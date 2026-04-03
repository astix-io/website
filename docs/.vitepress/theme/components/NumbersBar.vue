<template>
  <div
    ref="container"
    class="py-12 px-6"
  >
    <div class="max-w-4xl mx-auto grid grid-cols-2 gap-8 sm:grid-cols-4">
      <div
        v-for="(stat, idx) in stats"
        :key="idx"
        class="text-center"
      >
        <div
          class="text-4xl font-bold mb-2 tabular-nums"
          style="color: var(--text-primary);"
        >
          <template v-if="stat.isText">{{ stat.suffix }}</template>
          <template v-else>{{ displayValues[idx] }}{{ stat.suffix }}</template>
        </div>
        <div class="text-sm" style="color: var(--text-secondary);">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface Stat {
	target: number;
	suffix: string;
	label: string;
	isText: boolean;
}

const stats: Stat[] = [
	{ target: 5000, suffix: '+', label: 'tests', isText: false },
	{ target: 36, suffix: '', label: 'languages', isText: false },
	{ target: 30, suffix: '+', label: 'MCP tools', isText: false },
	{ target: 0, suffix: 'Apache 2.0', label: '', isText: true },
];

const container = ref<HTMLElement | null>(null);
const displayValues = ref<number[]>(stats.map(() => 0));

let observer: IntersectionObserver | null = null;
let animationFrames: number[] = [];
let triggered = false;

const DURATION = 1500; // ms
const STAGGER = 200; // ms per stat

function easeOutCubic(t: number): number {
	return 1 - (1 - t) ** 3;
}

function animateStat(idx: number, target: number, delay: number) {
	const start = performance.now() + delay;

	function step(now: number) {
		if (now < start) {
			animationFrames[idx] = requestAnimationFrame(step);
			return;
		}
		const elapsed = now - start;
		const progress = Math.min(elapsed / DURATION, 1);
		const eased = easeOutCubic(progress);
		displayValues.value[idx] = Math.round(eased * target);

		if (progress < 1) {
			animationFrames[idx] = requestAnimationFrame(step);
		}
	}

	animationFrames[idx] = requestAnimationFrame(step);
}

function triggerCountUp() {
	if (triggered) return;
	triggered = true;

	for (let i = 0; i < stats.length; i++) {
		if (!stats[i].isText) {
			animateStat(i, stats[i].target, i * STAGGER);
		}
	}
}

onMounted(() => {
	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					triggerCountUp();
					observer?.disconnect();
					observer = null;
				}
			}
		},
		{ threshold: 0.5 },
	);

	if (container.value) {
		observer.observe(container.value);
	}
});

onUnmounted(() => {
	observer?.disconnect();
	observer = null;
	for (const id of animationFrames) {
		cancelAnimationFrame(id);
	}
});
</script>
