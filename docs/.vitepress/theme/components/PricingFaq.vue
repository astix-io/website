<template>
  <div class="space-y-3">
    <div
      v-for="(item, i) in faqItems"
      :key="i"
      class="rounded-xl border overflow-hidden transition-colors duration-200"
      style="border-color: var(--border-subtle); background: var(--bg-card);"
    >
      <button
        class="w-full flex items-center justify-between gap-4 px-6 py-4 text-left border-0 cursor-pointer"
        style="background: transparent; color: var(--text-primary);"
        :aria-expanded="openIndex === i"
        @click="toggle(i)"
      >
        <span class="font-medium text-sm">{{ item.question }}</span>
        <svg
          class="shrink-0 w-5 h-5"
          :style="{
            color: 'var(--text-secondary)',
            transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 7l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div
        class="overflow-hidden transition-all duration-300 ease-out px-6"
        :style="{ maxHeight: openIndex === i ? '300px' : '0', opacity: openIndex === i ? 1 : 0 }"
      >
        <div class="pb-5 pt-1 text-sm leading-relaxed" style="color: var(--text-secondary)">
          {{ item.answer }}
        </div>
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
