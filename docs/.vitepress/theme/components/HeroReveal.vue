<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	before: string;
	highlight: string;
	after?: string;
	delay?: number;
	step?: number;
}>();

interface Char {
	c: string;
	delay: number;
	highlight: boolean;
}

const chars = computed<Char[]>(() => {
	const startDelay = props.delay ?? 0.4;
	const step = props.step ?? 0.025;
	const all: Char[] = [];
	let idx = 0;
	for (const c of props.before) {
		all.push({ c, delay: startDelay + idx * step, highlight: false });
		idx++;
	}
	for (const c of props.highlight) {
		all.push({ c, delay: startDelay + idx * step, highlight: true });
		idx++;
	}
	for (const c of props.after ?? '') {
		all.push({ c, delay: startDelay + idx * step, highlight: false });
		idx++;
	}
	return all;
});
</script>

<template>
  <h1 class="hero-reveal mb-8 font-sans text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl md:mb-10" style="color: var(--text-primary)">
    <span
      v-for="(item, i) in chars"
      :key="i"
      class="hero-char"
      :class="{ 'gradient-text': item.highlight }"
      :style="{ animationDelay: item.delay + 's' }"
      aria-hidden="true"
      v-text="item.c === ' ' ? '\u00A0' : item.c"
    />
    <span class="sr-only">{{ before }}{{ highlight }}{{ after ?? '' }}</span>
  </h1>
</template>
