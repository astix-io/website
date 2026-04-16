<script setup>
import { ref } from 'vue';

const active = ref(0);

const steps = [
	{
		num: '01',
		title: 'Index',
		color: '#3b82f6',
		desc: 'Tree-sitter parses 38 languages into an AST. Symbols, calls, and imports land in PostgreSQL.',
		code: `<span class="ws-dim">&gt;</span> add_project({ path: <span class="ws-str">"/app"</span> })

{ <span class="ws-str">"id"</span>: <span class="ws-ok">42</span>,
  <span class="ws-str">"name"</span>: <span class="ws-str">"app"</span>,
  <span class="ws-str">"root_path"</span>: <span class="ws-str">"/app"</span>,
  <span class="ws-str">"is_git"</span>: <span class="ws-ok">true</span> }

<span class="ws-dim">// Lazy sync: 847 files parsed on first query</span>`,
	},
	{
		num: '02',
		title: 'Search',
		color: '#8b5cf6',
		desc: 'Find code by name or intent. Structural search for exact matches, semantic search for concepts.',
		code: `<span class="ws-dim">&gt;</span> search_semantic({ query: <span class="ws-str">"authentication flow"</span> })

{ "results": [
    { "name": <span class="ws-str">"handleAuth"</span>,    "file": <span class="ws-str">"src/auth/handler.ts"</span>,
      "kind": <span class="ws-str">"function"</span>,      "score": <span class="ws-ok">0.94</span> },
    { "name": <span class="ws-str">"validate"</span>,      "file": <span class="ws-str">"src/middleware/session.ts"</span>,
      "kind": <span class="ws-str">"function"</span>,      "score": <span class="ws-ok">0.87</span> },
    { "name": <span class="ws-str">"exchangeToken"</span>, "file": <span class="ws-str">"src/auth/oauth.ts"</span>,
      "kind": <span class="ws-str">"function"</span>,      "score": <span class="ws-ok">0.82</span> }
  ], "count": <span class="ws-ok">3</span> }`,
	},
	{
		num: '03',
		title: 'Analyze',
		color: '#f59e0b',
		desc: 'Know the blast radius before you touch anything. Call graph traversal finds every downstream impact.',
		code: `<span class="ws-dim">&gt;</span> impact_analysis({ name: <span class="ws-str">"handleAuth"</span>, depth: <span class="ws-ok">3</span> })

{ "risk_level": <span class="ws-warn">"high"</span>,
  "direct_callers": [
    { "name": <span class="ws-str">"loginRoute"</span>,    "file": <span class="ws-str">"src/routes/api.ts"</span> },
    { "name": <span class="ws-str">"oauthCallback"</span>, "file": <span class="ws-str">"src/auth/oauth.ts"</span> }
  ],
  "risk_factors": {
    "total_callers": <span class="ws-ok">14</span>,  "total_files": <span class="ws-ok">8</span>,
    "is_exported": <span class="ws-ok">true</span>,  "has_dynamic_callers": <span class="ws-dim">false</span>
  }}`,
	},
	{
		num: '04',
		title: 'Change',
		color: '#22c55e',
		desc: 'Rename across the call graph. Patch with conflict detection. Every edit updates the index.',
		code: `<span class="ws-dim">&gt;</span> rename_symbol({
    old_name: <span class="ws-str">"handleAuth"</span>, new_name: <span class="ws-str">"authenticate"</span>
  })

{ "success": <span class="ws-ok">true</span>,
  "files_modified": [
    <span class="ws-str">"src/auth/handler.ts"</span>,
    <span class="ws-str">"src/middleware/session.ts"</span>,
    <span class="ws-str">"src/routes/api.ts"</span>,
    <span class="ws-str">"src/auth/oauth.ts"</span>
  ]}

<span class="ws-dim">// 14 references updated across 4 files</span>`,
	},
	{
		num: '05',
		title: 'Verify',
		color: '#06b6d4',
		desc: 'Find dead code, duplicates, and untested paths. Continuous health checks across the codebase.',
		code: `<span class="ws-dim">&gt;</span> code_health({ check: <span class="ws-warn">"unused_exports"</span> })

{ "check": <span class="ws-warn">"unused_exports"</span>,
  "total": <span class="ws-ok">2</span>,
  "findings": [
    { "name": <span class="ws-str">"exchangeToken"</span>,
      "file": <span class="ws-str">"src/auth/oauth.ts"</span>,     "line": <span class="ws-ok">47</span> },
    { "name": <span class="ws-str">"validateEmail"</span>,
      "file": <span class="ws-str">"src/utils/validate.ts"</span>,  "line": <span class="ws-ok">12</span> }
  ]}`,
	},
];
</script>

<template>
  <div class="ws-container">
    <!-- Left: step list (desktop) / tabs (mobile) -->
    <div
      class="ws-steps"
      role="tablist"
      aria-label="How astix works steps"
    >
      <button
        v-for="(step, i) in steps"
        :key="i"
        class="ws-step"
        :class="{ 'ws-step-active': active === i }"
        :style="`--ws-accent: ${step.color}`"
        role="tab"
        :aria-selected="active === i"
        :aria-controls="`ws-panel-${i}`"
        :id="`ws-tab-${i}`"
        @click="active = i"
      >
        <span class="ws-num">{{ step.num }}</span>
        <div class="ws-step-text">
          <span class="ws-step-title">{{ step.title }}</span>
          <span v-if="active === i" class="ws-step-desc">{{ step.desc }}</span>
        </div>
      </button>
    </div>

    <!-- Right: code panel -->
    <div
      class="ws-panel"
      :style="`--ws-accent: ${steps[active].color}`"
      role="tabpanel"
      :aria-labelledby="`ws-tab-${active}`"
      :id="`ws-panel-${active}`"
    >
      <div class="ws-panel-header">
        <span class="ws-panel-dot" aria-hidden="true"></span>
        <span class="ws-panel-dot" aria-hidden="true"></span>
        <span class="ws-panel-dot" aria-hidden="true"></span>
        <span class="ws-panel-title">{{ steps[active].title.toLowerCase() }}</span>
      </div>
      <div class="ws-code-wrap">
        <pre><code v-html="steps[active].code"></code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ws-container {
  display: grid;
  grid-template-columns: 1fr 1.8fr;
  gap: 20px;
  min-height: 380px;
}

/* ── Left panel ── */
.ws-steps {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ws-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  border-left: 3px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  width: 100%;
}

.ws-step:hover {
  background: color-mix(in srgb, var(--bg-card) 60%, transparent);
}

.ws-step-active {
  background: var(--bg-card);
  border-left-color: var(--ws-accent);
}

.ws-step:focus-visible {
  outline: 2px solid var(--ws-accent);
  outline-offset: 2px;
}

.ws-num {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--ws-accent);
  background: color-mix(in srgb, var(--ws-accent) 12%, transparent);
  padding: 3px 8px;
  border-radius: 5px;
  flex-shrink: 0;
  margin-top: 2px;
}

.ws-step-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.ws-step-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.ws-step-desc {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
}

/* ── Right panel ── */
.ws-panel {
  background: var(--bg-deep);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ws-panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.ws-panel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-subtle);
}

.ws-panel-dot:first-child { background: #ef4444; }
.ws-panel-dot:nth-child(2) { background: #f59e0b; }
.ws-panel-dot:nth-child(3) { background: #22c55e; }

.ws-panel-title {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--text-muted);
  margin-left: 8px;
}

.ws-code-wrap {
  padding: 20px 24px;
  flex: 1;
  display: flex;
  align-items: flex-start;
}

.ws-code-wrap pre {
  margin: 0;
  padding: 0;
  background: none;
  transition: opacity 0.2s ease;
}

.ws-code-wrap code {
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--text-primary);
  white-space: pre;
  background: none;
}

/* Syntax highlight spans rendered via v-html — need :deep() to pierce scoped boundary */
.ws-code-wrap :deep(.ws-dim)  { color: var(--text-muted); }
.ws-code-wrap :deep(.ws-ok)   { color: var(--accent-green); }
.ws-code-wrap :deep(.ws-fn)   { color: var(--accent-blue); }
.ws-code-wrap :deep(.ws-str)  { color: var(--accent-purple); }
.ws-code-wrap :deep(.ws-warn) { color: #f59e0b; }

@media (prefers-reduced-motion: reduce) {
  .ws-step,
  .ws-code-wrap pre {
    transition: none;
  }
}

/* ── Mobile: horizontal tabs ── */
@media (max-width: 768px) {
  .ws-container {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .ws-steps {
    flex-direction: row;
    overflow-x: auto;
    gap: 6px;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
  }

  .ws-step {
    flex-shrink: 0;
    border-left: none;
    border-bottom: 3px solid transparent;
    padding: 10px 14px;
    flex-direction: row;
    align-items: center;
  }

  .ws-step-active {
    border-bottom-color: var(--ws-accent);
    border-left-color: transparent;
  }

  .ws-step-desc {
    display: none;
  }
}
</style>
