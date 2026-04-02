<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
	quote: string;
	source: string;
	sourceUrl: string;
	delay?: number;
}>();

const displayed = ref('');
const showSource = ref(false);
const container = ref<HTMLElement>();
let timeout: number;
let observer: IntersectionObserver;
let started = false;

async function type() {
	for (let i = 0; i <= props.quote.length; i++) {
		displayed.value = props.quote.slice(0, i);
		await new Promise<void>((r) => {
			timeout = window.setTimeout(r, 28);
		});
	}
	// Pause then show source
	await new Promise<void>((r) => {
		timeout = window.setTimeout(r, 400);
	});
	showSource.value = true;
}

onMounted(() => {
	// Respect reduced motion
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		displayed.value = props.quote;
		showSource.value = true;
		return;
	}

	observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting && !started) {
				started = true;
				// Wait for the stagger delay before starting typewriter
				window.setTimeout(() => type(), props.delay ?? 700);
			}
		},
		{ threshold: 0.3 },
	);

	if (container.value) observer.observe(container.value);
});

onUnmounted(() => {
	clearTimeout(timeout);
	observer?.disconnect();
});
</script>

<template>
  <div ref="container" class="mx-auto max-w-xl">
    <blockquote class="text-base md:text-lg italic leading-relaxed" style="color: var(--text-secondary); min-height: 4.5em;">
      <span>"{{ displayed }}</span>
      <span class="inline-block w-0.5 h-5 ml-0.5 align-middle animate-pulse" style="background: var(--accent-blue);" v-if="displayed.length < quote.length" />
      <span v-if="displayed.length >= quote.length">"</span>
    </blockquote>
    <p
      v-if="showSource"
      class="mt-3 text-sm transition-opacity duration-500"
      :class="showSource ? 'opacity-100' : 'opacity-0'"
      style="color: var(--text-muted)"
    >
      — <a :href="sourceUrl" target="_blank" rel="noopener" class="underline hover:no-underline" style="color: var(--text-muted)">{{ source }}</a>
    </p>
  </div>
</template>
