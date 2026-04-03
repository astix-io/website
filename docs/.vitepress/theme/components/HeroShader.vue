<template>
  <canvas
    ref="canvas"
    class="hero-shader-canvas"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);

// ---- Cleanup handles ----
let rafId = 0;
let resizeObserver: ResizeObserver | null = null;

// ---- Scroll parallax ----
let scrollY = 0;

function onScroll() {
	scrollY = window.scrollY;
}

// ---- Color cache (avoid per-frame string allocation) ----
const CC: Record<string, string> = {};

function hsla(h: number, s: number, l: number, a: number): string {
	h = h | 0;
	s = s | 0;
	l = l | 0;
	a = ((a * 100) | 0) / 100;
	const k = `${h},${s},${l},${a}`;
	return CC[k] ?? (CC[k] = `hsla(${h},${s}%,${l}%,${a})`);
}

function rgba(r: number, g: number, b: number, a: number): string {
	a = ((a * 100) | 0) / 100;
	const k = `${r},${g},${b},${a}`;
	return CC[k] ?? (CC[k] = `rgba(${r},${g},${b},${a})`);
}

// ---- Theme ----
function getThemeColors() {
	const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
	return {
		isDark,
		bgDeep: isDark ? ([11, 17, 32] as [number, number, number]) : ([248, 250, 252] as [number, number, number]),
		nodeHueBase: isDark ? 220 : 225,
		nodeSat: isDark ? 70 : 55,
		nodeLightDark: isDark ? 62 : 42,
		connAlphaMult: isDark ? 1 : 1.6,
		glowAlpha: isDark ? 0.1 : 0.06,
		ghostAlpha: isDark ? 0.04 : 0.07,
		ghostColor: isDark ? ([99, 102, 241] as [number, number, number]) : ([37, 99, 235] as [number, number, number]),
		pulseColor: isDark ? 'rgba(99,102,241,0.45)' : 'rgba(37,99,235,0.55)',
	};
}

// ---- Smoothed mouse ----
const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

function onMouseMove(e: MouseEvent) {
	mouse.tx = e.clientX / window.innerWidth;
	mouse.ty = e.clientY / window.innerHeight;
}

function lerpMouse() {
	mouse.x += (mouse.tx - mouse.x) * 0.08;
	mouse.y += (mouse.ty - mouse.y) * 0.08;
}

// ---- Node types ----
type NodeType = 'hub' | 'mid' | 'leaf';

interface Node {
	x: number;
	y: number;
	baseX: number;
	baseY: number;
	radius: number;
	phase: number;
	speed: number;
	driftX: number;
	driftY: number;
	reactMult: number;
	connections: number[];
	alpha: number;
	type: NodeType;
	hue: number;
	// cached color strings (updated on theme change)
	_hue: number;
	colorBright: string;
	colorDim: string;
	glowColor: string;
}

// ---- Constants ----
const NCOUNT = 70;
const MAX_CONN_DIST = 200;
const MOUSE_RADIUS = 250;
const ACCEL_MAX = 3.0;
const ACCEL_LERP = 0.06;

// ---- State ----
let ctx: CanvasRenderingContext2D | null = null;
let w = 0;
let h = 0;
let t = 0;
const nodes: Node[] = [];
let lastTheme = '';

function updateNodeColors() {
	const theme = getThemeColors();
	for (const n of nodes) {
		const hue = theme.nodeHueBase + (n.hue - 220);
		n._hue = hue;
		n.colorBright = hsla(hue, theme.nodeSat, theme.nodeLightDark + 8, n.alpha);
		n.colorDim = hsla(hue, theme.nodeSat, theme.nodeLightDark, n.alpha * 0.5);
		n.glowColor = hsla(hue, theme.nodeSat, theme.nodeLightDark, theme.glowAlpha);
	}
}

function initNodes() {
	nodes.length = 0;
	for (let i = 0; i < NCOUNT; i++) {
		const angle = Math.random() * Math.PI * 2;
		const maxR = Math.min(w, h) * 0.48;
		const r = Math.random() ** 0.6 * maxR;
		const x = w / 2 + Math.cos(angle) * r * (w / h) * 0.9;
		const y = h / 2 + Math.sin(angle) * r;
		const type: NodeType = Math.random() > 0.82 ? 'hub' : Math.random() > 0.5 ? 'mid' : 'leaf';

		nodes.push({
			x,
			y,
			baseX: x,
			baseY: y,
			radius: type === 'hub' ? 4.5 : type === 'mid' ? 3 : 2,
			phase: Math.random() * Math.PI * 2,
			speed: Math.random() * 0.006 + 0.002,
			driftX: Math.random() * 14 + 6,
			driftY: Math.random() * 10 + 5,
			reactMult: 1,
			connections: [],
			alpha: 0.25 + Math.random() * 0.4,
			type,
			hue: 220 + Math.random() * 45,
			_hue: 220,
			colorBright: '',
			colorDim: '',
			glowColor: '',
		});
	}

	// Pre-compute connections (NOT per-frame)
	for (let i = 0; i < NCOUNT; i++) {
		const n = nodes[i];
		const maxConn = n.type === 'hub' ? 5 : n.type === 'mid' ? 3 : 1;
		const candidates: { idx: number; dist: number }[] = [];
		for (let j = 0; j < NCOUNT; j++) {
			if (j === i) continue;
			const dx = n.baseX - nodes[j].baseX;
			const dy = n.baseY - nodes[j].baseY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < MAX_CONN_DIST * 1.3) candidates.push({ idx: j, dist });
		}
		candidates.sort((a, b) => a.dist - b.dist);
		n.connections = candidates.slice(0, maxConn).map((c) => c.idx);
	}

	updateNodeColors();
}

function resize() {
	const el = canvas.value;
	if (!el || !ctx) return;
	const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
	w = window.innerWidth;
	h = window.innerHeight;
	el.width = w * dpr;
	el.height = h * dpr;
	el.style.width = w + 'px';
	el.style.height = h + 'px';
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	if (nodes.length) initNodes();
}

function animate() {
	if (!ctx) return;

	// Theme change detection (watches data-theme attribute on <html>)
	const currentTheme = document.documentElement.getAttribute('data-theme') ?? 'dark';
	if (currentTheme !== lastTheme) {
		lastTheme = currentTheme;
		updateNodeColors();
	}

	t += 1;
	lerpMouse();

	const theme = getThemeColors();

	// Clear with theme background
	const [br, bg, bb] = theme.bgDeep;
	ctx.fillStyle = rgba(br, bg, bb, 1);
	ctx.fillRect(0, 0, w, h);

	const mx = (mouse.x - 0.5) * 22;
	const my = (mouse.y - 0.5) * 22;
	const mCanvasX = mouse.x * w;
	const mCanvasY = mouse.y * h;

	// Scroll parallax: shift the entire scene vertically based on scroll position
	// Hubs shift more (depth effect), leaves shift less
	const scrollParallax = scrollY * 0.08;

	// Update positions with proximity-based acceleration
	for (const n of nodes) {
		const dmx = n.x - mCanvasX;
		const dmy = n.y - mCanvasY;
		const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);

		// Quadratic falloff: 1.0 (far) → ACCEL_MAX (close)
		const proximity = Math.max(0, 1 - mouseDist / MOUSE_RADIUS);
		const targetMult = 1 + proximity * proximity * (ACCEL_MAX - 1);
		// Smooth lerp (0.06) — no sudden snaps
		n.reactMult += (targetMult - n.reactMult) * ACCEL_LERP;

		const spd = n.speed * n.reactMult;
		// Parallax: hubs react more to mouse than leaves
		const p = n.type === 'hub' ? 0.55 : 0.25;
		// Scroll parallax: hubs shift more (further depth), leaves less
		const sp = n.type === 'hub' ? 0.14 : n.type === 'mid' ? 0.09 : 0.05;
		n.x = n.baseX + Math.sin(t * spd + n.phase) * n.driftX * n.reactMult + mx * p;
		n.y = n.baseY + Math.cos(t * spd * 0.7 + n.phase) * n.driftY * n.reactMult + my * p - scrollParallax * sp;
	}

	const alphaMult = theme.connAlphaMult;

	// Pass 1: solid connection lines (quadratic bezier, organic feel)
	for (let i = 0; i < NCOUNT; i++) {
		const n = nodes[i];
		for (const j of n.connections) {
			const target = nodes[j];
			const dx = target.x - n.x;
			const dy = target.y - n.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist > MAX_CONN_DIST) continue;

			const falloff = 1 - dist / MAX_CONN_DIST;
			const alpha = falloff * 0.28 * n.alpha * alphaMult;

			ctx.beginPath();
			ctx.moveTo(n.x, n.y);
			// Quadratic bezier for organic feel
			const midX = (n.x + target.x) / 2 + (n.y - target.y) * 0.06;
			const midY = (n.y + target.y) / 2 + (target.x - n.x) * 0.06;
			ctx.quadraticCurveTo(midX, midY, target.x, target.y);
			ctx.strokeStyle = hsla(n._hue, theme.nodeSat - 5, theme.nodeLightDark, alpha);
			// Thicker for hubs (1.4px), thinner for others (0.9px)
			ctx.lineWidth = n.type === 'hub' ? 1.4 : 0.9;
			ctx.stroke();
		}
	}

	// Pass 2: dashed overlay on hub connections (animated dash offset)
	ctx.setLineDash([8, 8]);
	for (let i = 0; i < NCOUNT; i++) {
		const n = nodes[i];
		if (n.type === 'leaf') continue;
		// Dash speed reactive to node proximity
		ctx.lineDashOffset = -t * 0.25 * n.reactMult;
		for (const j of n.connections) {
			const target = nodes[j];
			const dx = target.x - n.x;
			const dy = target.y - n.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist > MAX_CONN_DIST) continue;

			const falloff = 1 - dist / MAX_CONN_DIST;
			const alpha = falloff * 0.12 * n.alpha * alphaMult;

			ctx.beginPath();
			ctx.moveTo(n.x, n.y);
			ctx.lineTo(target.x, target.y);
			ctx.strokeStyle = hsla(n._hue, theme.nodeSat, theme.nodeLightDark + 15, alpha);
			ctx.lineWidth = 0.6;
			ctx.stroke();
		}
	}
	ctx.setLineDash([]);

	// Data pulses: small dots traveling along edges
	for (let i = 0; i < NCOUNT; i++) {
		const n = nodes[i];
		if (n.type === 'leaf') continue;
		for (const j of n.connections) {
			const target = nodes[j];
			const dx = target.x - n.x;
			const dy = target.y - n.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist > MAX_CONN_DIST) continue;

			const pulsePos = (t * 0.012 * n.reactMult + i * 0.07) % 1;
			const px = n.x + dx * pulsePos;
			const py = n.y + dy * pulsePos;

			// Pulse glow
			ctx.beginPath();
			ctx.arc(px, py, 4, 0, Math.PI * 2);
			ctx.fillStyle = hsla(n._hue, 80, 65, 0.08 * alphaMult);
			ctx.fill();
			// Pulse core
			ctx.beginPath();
			ctx.arc(px, py, 2, 0, Math.PI * 2);
			ctx.fillStyle = theme.pulseColor;
			ctx.fill();
		}
	}

	// Hub glow — additive composite
	ctx.globalCompositeOperation = 'lighter';
	for (const n of nodes) {
		if (n.type !== 'hub') continue;
		const sz = n.radius * 6;
		const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, sz);
		glow.addColorStop(0, n.glowColor);
		glow.addColorStop(1, 'transparent');
		ctx.fillStyle = glow;
		ctx.fillRect(n.x - sz, n.y - sz, sz * 2, sz * 2);
	}
	ctx.globalCompositeOperation = 'source-over';

	// Nodes
	for (const n of nodes) {
		ctx.beginPath();
		ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
		ctx.fillStyle = n.colorBright;
		ctx.fill();
		// Subtle ring on hubs
		if (n.type === 'hub') {
			ctx.beginPath();
			ctx.arc(n.x, n.y, n.radius + 3, 0, Math.PI * 2);
			ctx.strokeStyle = hsla(n._hue, theme.nodeSat, theme.nodeLightDark, n.alpha * 0.2);
			ctx.lineWidth = 0.8;
			ctx.stroke();
		}
	}

	// Ghost diamond outline at ~4% opacity, pulses subtly
	ctx.save();
	ctx.translate(w / 2 + mx * 0.08, h / 2 + my * 0.08);
	const ds = 1 + Math.sin(t * 0.006) * 0.02;
	ctx.scale(ds, ds);
	ctx.beginPath();
	ctx.moveTo(0, -h * 0.36);
	ctx.lineTo(w * 0.3, 0);
	ctx.lineTo(0, h * 0.36);
	ctx.lineTo(-w * 0.3, 0);
	ctx.closePath();
	const [gr, gg, gb] = theme.ghostColor;
	ctx.strokeStyle = rgba(gr, gg, gb, theme.ghostAlpha);
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.restore();

	if (!stopped) {
		rafId = requestAnimationFrame(animate);
	}
}

let stopped = false;

onMounted(() => {
	const el = canvas.value;
	if (!el) return;

	ctx = el.getContext('2d');
	if (!ctx) return;

	// prefers-reduced-motion: render ONE static frame and stop
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Initial resize + node init
	resize();
	initNodes();
	lastTheme = document.documentElement.getAttribute('data-theme') ?? 'dark';

	if (reducedMotion) {
		stopped = true;
		animate();
		return;
	}

	// ResizeObserver: responsive resize on window
	resizeObserver = new ResizeObserver(() => resize());
	resizeObserver.observe(document.documentElement);

	window.addEventListener('scroll', onScroll, { passive: true });
	document.addEventListener('mousemove', onMouseMove);

	rafId = requestAnimationFrame(animate);
});

onUnmounted(() => {
	cancelAnimationFrame(rafId);
	rafId = 0;
	resizeObserver?.disconnect();
	window.removeEventListener('scroll', onScroll);
	document.removeEventListener('mousemove', onMouseMove);
});
</script>
