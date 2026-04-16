<template>
  <section v-if="enabled" class="py-16 px-6">
    <!-- Logo strip -->
    <div class="max-w-4xl mx-auto mb-12">
      <p class="text-center text-xs uppercase tracking-widest mb-8" style="color: var(--text-muted);">
        Trusted by engineering teams
      </p>
      <div class="flex items-center justify-center gap-8 flex-wrap">
        <div
          v-for="i in 5"
          :key="i"
          class="h-8 rounded"
          role="img"
          style="width: 96px; background: var(--border-muted);"
          :aria-label="`Partner logo ${i}`"
        ></div>
      </div>
    </div>

    <!-- Testimonial carousel -->
    <div class="max-w-2xl mx-auto">
      <div
        class="rounded-xl border p-8 transition-opacity duration-500"
        style="background: var(--bg-card); border-color: var(--border-muted);"
      >
        <blockquote>
          <p class="text-lg leading-relaxed mb-6" style="color: var(--text-primary);">
            "{{ TESTIMONIALS[current].quote }}"
          </p>
          <footer class="text-sm" style="color: var(--text-secondary);">
            — {{ TESTIMONIALS[current].attribution }}
          </footer>
        </blockquote>
      </div>

      <!-- Navigation dots -->
      <div class="flex justify-center gap-2 mt-6" role="tablist" :aria-label="'Testimonials'">
        <button
          v-for="(_, idx) in TESTIMONIALS"
          :key="idx"
          role="tab"
          :aria-selected="idx === current"
          :aria-label="`Testimonial ${idx + 1}`"
          class="h-2 rounded-full transition-all duration-300 cursor-pointer border-0"
          :style="{
            width: idx === current ? '24px' : '8px',
            background: idx === current ? 'var(--accent-blue)' : 'var(--border-muted)',
          }"
          @click="goTo(idx)"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{ enabled: boolean }>();

interface Testimonial {
	quote: string;
	attribution: string;
}

const TESTIMONIALS: Testimonial[] = [
	{
		quote:
			'astix gave our agents the context they were missing. Refactoring a 200-file monorepo went from scary to safe.',
		attribution: 'Engineering Lead, Series B Startup',
	},
	{
		quote: 'We tried Sourcegraph, LSP, grep — nothing gave agents cross-repo understanding like astix does.',
		attribution: 'Staff Engineer, Platform Company',
	},
	{
		quote: "Self-hosted, zero egress. That's what sold our security team. The intelligence is just a bonus.",
		attribution: 'CTO, Fintech',
	},
];

const current = ref(0);

function goTo(idx: number) {
	current.value = idx;
}

let interval: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
	if (!props.enabled) return;
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (!prefersReducedMotion) {
		interval = window.setInterval(() => {
			current.value = (current.value + 1) % TESTIMONIALS.length;
		}, 5000);
	}
});

onUnmounted(() => {
	clearInterval(interval);
});
</script>
