<script setup lang="ts">
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

const { Layout } = DefaultTheme;
const { frontmatter } = useData();
</script>

<template>
  <div class="top-stripe" />
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-[300] focus:bg-[var(--bg-deep)] focus:p-3 focus:text-[var(--accent-blue)]">
    Skip to content
  </a>
  <Layout>
    <template #layout-top>
      <!-- Shader + custom header injected in later tasks -->
    </template>
    <template #doc-before>
      <div id="main-content" />
    </template>
  </Layout>
</template>
