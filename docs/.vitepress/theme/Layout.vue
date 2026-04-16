<script setup lang="ts">
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { onMounted, ref } from 'vue';
import LogoRefraction from './components/LogoRefraction.vue';

const { Layout } = DefaultTheme;
const { frontmatter } = useData();

const theme = ref<'dark' | 'light'>('dark');

function toggleTheme() {
	theme.value = theme.value === 'dark' ? 'light' : 'dark';
	document.documentElement.setAttribute('data-theme', theme.value);
	localStorage.setItem('astix-theme', theme.value);
}

onMounted(() => {
	const saved = localStorage.getItem('astix-theme');
	if (saved === 'light' || saved === 'dark') {
		theme.value = saved;
	} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
		theme.value = 'light';
	}
	document.documentElement.setAttribute('data-theme', theme.value);
});
</script>

<template>
  <div class="top-stripe" />
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:absolute focus:z-[300] focus:bg-[var(--bg-deep)] focus:p-3 focus:text-[var(--accent-blue)]"
  >
    Skip to content
  </a>
  <Layout>
    <template #nav-bar-title-before>
      <div class="flex items-center gap-2 mr-4">
        <ClientOnly><LogoRefraction /></ClientOnly>
        <span class="font-mono text-lg font-semibold" style="color: var(--text-primary)">astix</span>
      </div>
    </template>
    <template #nav-bar-content-after>
      <button
        class="flex h-9 w-9 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-deep)]"
        style="margin-left: 12px;"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      >
        <!-- Sun icon (shown in dark mode) -->
        <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <!-- Moon icon (shown in light mode) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </template>
    <template #doc-before>
      <div id="main-content" />
    </template>
    <template #layout-bottom>
      <footer class="border-t px-6 py-8 text-center" style="border-color: var(--border-subtle); background: var(--bg-deep);">
        <nav class="mb-3 flex flex-wrap items-center justify-center gap-4 text-xs" aria-label="Legal">
          <a href="/legal/terms" style="color: var(--text-muted)" class="hover:underline">Terms of Service</a>
          <span style="color: var(--text-muted)">·</span>
          <a href="/legal/privacy" style="color: var(--text-muted)" class="hover:underline">Privacy Policy</a>
        </nav>
        <p class="text-xs" style="color: var(--text-muted)">© 2026 astix · Released under the Apache 2.0 License</p>
      </footer>
    </template>
  </Layout>
</template>
