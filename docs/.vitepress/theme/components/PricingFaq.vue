<template>
  <div class="space-y-3">
    <div
      v-for="(item, i) in faqItems"
      :key="i"
      class="rounded-xl border overflow-hidden"
      style="border-color: var(--border-muted); background: var(--bg-card);"
    >
      <button
        class="w-full flex items-center justify-between gap-4 px-6 py-4 text-left border-0 cursor-pointer"
        style="background: transparent; color: var(--text-primary);"
        :aria-expanded="openIndex === i"
        @click="toggle(i)"
      >
        <span class="font-medium text-sm">{{ item.question }}</span>
        <svg
          class="shrink-0 w-4 h-4 transition-transform duration-300"
          :style="{
            color: 'var(--text-muted)',
            transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
          }"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div v-show="openIndex === i" class="px-6 pb-5">
        <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">{{ item.answer }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { faqItems } from '../../data/faq';

const openIndex = ref<number | null>(null);

function toggle(i: number) {
	openIndex.value = openIndex.value === i ? null : i;
}

// NOTE: FAQPage JSON-LD is injected server-side via schema.ts transformHead
// (not client-side) so it appears in SSG HTML for crawlers.
</script>
