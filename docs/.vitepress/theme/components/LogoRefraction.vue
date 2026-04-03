<template>
  <canvas ref="canvas" width="72" height="72" class="h-9 w-9" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);

let rafId = 0;

function getLogoTheme() {
	const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
	return {
		facetSat: isDark ? 75 : 65,
		facetLight: isDark ? 52 : 45,
		borderAlpha: isDark ? 0.18 : 0.3,
		highlightAlpha: isDark ? 0.3 : 0.45,
		borderColor: isDark ? ([255, 255, 255] as [number, number, number]) : ([0, 0, 0] as [number, number, number]),
	};
}

function drawFrame(ctx: CanvasRenderingContext2D, t: number) {
	ctx.clearRect(0, 0, 72, 72);
	ctx.save();
	ctx.scale(2, 2);

	const theme = getLogoTheme();
	const s = 36;
	const cx = s / 2;
	const cy = s / 2;
	const sz = 13;

	// Diamond points: top, right, bottom, left, center
	const pts: [number, number][] = [
		[cx, cy - sz], // 0: top
		[cx + sz * 0.85, cy], // 1: right
		[cx, cy + sz], // 2: bottom
		[cx - sz * 0.85, cy], // 3: left
		[cx, cy], // 4: center
	];

	// 4 facets: [pointA, pointB, pointC, hue, alpha]
	const facets: [number, number, number, number, number][] = [
		[0, 1, 4, 220 + Math.sin(t) * 15, 0.55 + Math.sin(t) * 0.12], // top-right
		[1, 2, 4, 250 + Math.cos(t) * 15, 0.45 + Math.cos(t) * 0.1], // bottom-right
		[2, 3, 4, 240 + Math.sin(t + 1) * 15, 0.4 + Math.sin(t + 1) * 0.08], // bottom-left
		[3, 0, 4, 230 + Math.cos(t + 1) * 15, 0.5 + Math.cos(t + 1) * 0.1], // top-left
	];

	for (const [a, b, c, h, alpha] of facets) {
		ctx.beginPath();
		ctx.moveTo(pts[a][0], pts[a][1]);
		ctx.lineTo(pts[b][0], pts[b][1]);
		ctx.lineTo(pts[c][0], pts[c][1]);
		ctx.closePath();
		ctx.fillStyle = `hsla(${h | 0},${theme.facetSat}%,${theme.facetLight}%,${alpha.toFixed(2)})`;
		ctx.fill();
	}

	const [lr, lg, lb] = theme.borderColor;

	// Diamond border
	ctx.beginPath();
	ctx.moveTo(pts[0][0], pts[0][1]);
	ctx.lineTo(pts[1][0], pts[1][1]);
	ctx.lineTo(pts[2][0], pts[2][1]);
	ctx.lineTo(pts[3][0], pts[3][1]);
	ctx.closePath();
	ctx.strokeStyle = `rgba(${lr},${lg},${lb},${(theme.borderAlpha + Math.sin(t * 0.8) * 0.08).toFixed(2)})`;
	ctx.lineWidth = 0.8;
	ctx.stroke();

	// Highlight on top-right edge
	ctx.beginPath();
	ctx.moveTo(pts[0][0], pts[0][1]);
	ctx.lineTo(pts[1][0], pts[1][1]);
	ctx.strokeStyle = `rgba(${lr},${lg},${lb},${(theme.highlightAlpha + Math.sin(t) * 0.12).toFixed(2)})`;
	ctx.lineWidth = 1.2;
	ctx.stroke();

	ctx.restore();
}

onMounted(() => {
	const el = canvas.value;
	if (!el) return;

	const ctx = el.getContext('2d');
	if (!ctx) return;

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	let t = 0;

	if (reducedMotion) {
		drawFrame(ctx, 0);
		return;
	}

	function animate() {
		t += 0.025;
		drawFrame(ctx!, t);
		rafId = requestAnimationFrame(animate);
	}

	rafId = requestAnimationFrame(animate);
});

onUnmounted(() => {
	cancelAnimationFrame(rafId);
	rafId = 0;
});
</script>
