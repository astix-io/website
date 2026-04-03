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

<template>
<div class="mx-auto max-w-2xl">
  <div
    v-for="(item, i) in faqItems"
    :key="i"
    class="faq-item"
    :class="{ 'faq-item-open': openIndex === i }"
  >
    <button
      class="faq-button"
      :aria-expanded="openIndex === i"
      @click="toggle(i)"
    >
      <span class="faq-question">{{ item.question }}</span>
      <svg
        class="faq-chevron"
        :class="{ 'faq-chevron-open': openIndex === i }"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
    <div
      class="faq-answer"
      :class="{ 'faq-answer-open': openIndex === i }"
    >
      <p>{{ item.answer }}</p>
    </div>
  </div>
</div>
</template>
