<script setup lang="ts">
import { useData } from 'vitepress';
import { computed } from 'vue';
import { formatDate } from '../utils';

const { frontmatter, page } = useData();

const formattedDate = computed(() => {
	if (!frontmatter.value.date) return '';
	return formatDate(frontmatter.value.date);
});

const lastUpdated = computed(() => {
	if (!page.value.lastUpdated) return '';
	return new Date(page.value.lastUpdated).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
});
</script>

<template>
<article class="blog-post mx-auto max-w-3xl px-6 py-16">
  <!-- Category badge -->
  <div class="mb-6">
    <span
      v-if="frontmatter.category"
      class="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider"
      style="background: var(--badge-bg); color: var(--accent-blue); border: 1px solid var(--badge-border);"
    >
      {{ frontmatter.category }}
    </span>
  </div>

  <!-- Title -->
  <h1 class="mb-6 font-sans text-4xl font-bold leading-tight" style="color: var(--text-primary);">
    {{ frontmatter.title }}
  </h1>

  <!-- Meta row -->
  <div class="mb-8 flex flex-wrap items-center gap-4 text-sm" style="color: var(--text-muted);">
    <!-- Author -->
    <div class="flex items-center gap-2">
      <div class="flex h-7 w-7 items-center justify-center rounded-full" style="background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));">
        <span class="text-xs font-bold text-white">A</span>
      </div>
      <span>{{ frontmatter.author || "astix team" }}</span>
    </div>
    <span>·</span>
    <!-- Date -->
    <span>{{ formattedDate }}</span>
    <span v-if="lastUpdated && lastUpdated !== formattedDate">· Updated {{ lastUpdated }}</span>
    <span>·</span>
    <!-- Reading time -->
    <span>{{ frontmatter.readingTime || 5 }} min read</span>
  </div>

  <!-- TL;DR -->
  <div
    v-if="frontmatter.tldr"
    class="mb-10 rounded-xl p-6"
    style="background: var(--bg-card); border: 1px solid var(--border-subtle);"
  >
    <div class="mb-2 text-xs font-semibold uppercase tracking-wider" style="color: var(--accent-blue);">TL;DR</div>
    <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">{{ frontmatter.tldr }}</p>
  </div>

  <!-- Content slot -->
  <div class="blog-content">
    <slot />
  </div>

  <!-- Tags -->
  <div v-if="frontmatter.tags?.length" class="mt-12 flex flex-wrap gap-2">
    <span
      v-for="tag in frontmatter.tags"
      :key="tag"
      class="rounded-full px-3 py-1 text-xs"
      style="background: var(--bg-card); color: var(--text-muted); border: 1px solid var(--border-subtle);"
    >
      #{{ tag }}
    </span>
  </div>

  <!-- Separator + back link -->
  <div class="mt-12 pt-8" style="border-top: 1px solid var(--border-subtle);">
    <a href="/blog/" class="text-sm font-medium" style="color: var(--accent-blue);">
      ← Back to all articles
    </a>
  </div>
</article>
</template>
