<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{ code: string }>();

const container = ref<HTMLElement>();
const svg = ref('');
const error = ref('');
const loading = ref(true);

async function render() {
	if (!props.code || typeof window === 'undefined') return;

	try {
		loading.value = true;
		error.value = '';

		const { default: mermaid } = await import('mermaid');

		mermaid.initialize({
			startOnLoad: false,
			theme: 'dark',
			themeVariables: {
				darkMode: true,
				background: '#0d1117',
				primaryColor: '#1e293b',
				primaryBorderColor: '#3b82f6',
				primaryTextColor: '#f8fafc',
				secondaryColor: '#1e293b',
				secondaryBorderColor: '#8b5cf6',
				secondaryTextColor: '#f8fafc',
				tertiaryColor: '#1e293b',
				tertiaryBorderColor: '#22c55e',
				tertiaryTextColor: '#f8fafc',
				lineColor: '#475569',
				textColor: '#f8fafc',
				mainBkg: '#1e293b',
				nodeBorder: '#3b82f6',
				clusterBkg: 'rgba(59, 130, 246, 0.08)',
				clusterBorder: '#334155',
				titleColor: '#f8fafc',
				edgeLabelBackground: '#0d1117',
				nodeTextColor: '#f8fafc',
			},
			flowchart: {
				htmlLabels: true,
				curve: 'basis',
			},
			fontFamily: 'var(--vp-font-family-mono)',
			fontSize: 13,
		});

		const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
		const { svg: rendered } = await mermaid.render(id, props.code);
		svg.value = rendered;
	} catch (e: any) {
		error.value = e.message || 'Failed to render diagram';
		console.warn('Mermaid render error:', e);
	} finally {
		loading.value = false;
	}
}

onMounted(render);
watch(() => props.code, render);
</script>

<template>
  <div class="mermaid-wrapper">
    <div v-if="loading" class="mermaid-loading">Loading diagram...</div>
    <div v-else-if="error" class="mermaid-error">
      <pre>{{ code }}</pre>
    </div>
    <div v-else ref="container" class="mermaid-svg" v-html="svg" />
  </div>
</template>

<style scoped>
.mermaid-wrapper {
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #0d1117;
  border: 1px solid var(--border-subtle);
}

.mermaid-svg {
  padding: 24px;
  display: flex;
  justify-content: center;
}

.mermaid-svg :deep(svg) {
  max-width: 100%;
  height: auto;
}

.mermaid-loading {
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

.mermaid-error {
  padding: 16px;
}

.mermaid-error pre {
  font-size: 12px;
  color: var(--text-muted);
  white-space: pre-wrap;
  margin: 0;
}
</style>
