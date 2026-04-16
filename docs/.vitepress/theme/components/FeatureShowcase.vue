<script setup>
const diffItems = [
	{
		value: '128×',
		label: 'avg fewer tokens',
		desc: 'avg reduction vs raw file reads (up to 1,000x for trace queries)',
		color: '#3b82f6',
	},
	{ value: 'MCP', label: 'native protocol', desc: 'Works with any AI assistant', color: '#8b5cf6' },
	{ value: 'BYOK', label: 'your keys, your models', desc: 'We never resell LLM tokens', color: '#22c55e' },
	{ value: '38', label: 'languages', desc: '11 Tier-1 with full call graphs', color: '#3b82f6' },
	{ value: '0', label: 'code egress', desc: 'Self-hosted, air-gap ready', color: '#ef4444' },
];
</script>

<template>
  <div class="fs-container">
    <!-- Product lines -->
    <div class="fs-products">
      <!-- Code Intelligence -->
      <div class="fs-product fs-product-intel">
        <div class="fs-product-header">
          <span class="fs-dot" style="background: #3b82f6" aria-hidden="true"></span>
          <h3 class="fs-product-title">Code Intelligence</h3>
        </div>
        <p class="fs-product-sub">Understand, search, and refactor with full AST context</p>
        <div class="fs-features" role="list" aria-label="Code Intelligence features">
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #3b82f6" aria-hidden="true">✓</span> Structural &amp; semantic search</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #3b82f6" aria-hidden="true">✓</span> Cross-project queries</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #3b82f6" aria-hidden="true">✓</span> Impact analysis</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #3b82f6" aria-hidden="true">✓</span> Data lineage</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #3b82f6" aria-hidden="true">✓</span> Execution paths</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #3b82f6" aria-hidden="true">✓</span> Rename &amp; refactor</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #3b82f6" aria-hidden="true">✓</span> Duplicate detection</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #3b82f6" aria-hidden="true">✓</span> Code health checks</div>
        </div>
        <div class="fs-product-footer">Free tier available · Solo from $49/mo</div>
      </div>

      <!-- Security Analysis -->
      <div class="fs-product fs-product-security">
        <div class="fs-product-header">
          <span class="fs-dot" style="background: #f59e0b" aria-hidden="true"></span>
          <h3 class="fs-product-title">Security Analysis</h3>
          <span class="fs-badge-soon" aria-label="Coming soon">COMING SOON</span>
        </div>
        <p class="fs-product-sub">CFG-aware taint tracking across function boundaries</p>
        <div class="fs-features" role="list" aria-label="Security Analysis features">
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #f59e0b" aria-hidden="true">✓</span> SQL injection detection</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #f59e0b" aria-hidden="true">✓</span> XSS &amp; path traversal</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #f59e0b" aria-hidden="true">✓</span> SSRF &amp; log injection</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #f59e0b" aria-hidden="true">✓</span> Hardcoded secrets</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #f59e0b" aria-hidden="true">✓</span> Custom framework packs</div>
          <div class="fs-feat" role="listitem"><span class="fs-check" style="color: #f59e0b" aria-hidden="true">✓</span> Compliance mapping (OWASP, CWE)</div>
        </div>
        <p class="fs-product-note">No rules to write — the call graph already knows the paths.</p>
        <div class="fs-product-footer">Add-on from $79/mo</div>
      </div>
    </div>

    <!-- Differentiator strip -->
    <div class="fs-diff-strip" role="list" aria-label="Key differentiators">
      <div
        v-for="item in diffItems"
        :key="item.value"
        class="fs-diff-item"
        role="listitem"
      >
        <div class="fs-diff-value" :style="{ color: item.color }">{{ item.value }}</div>
        <div class="fs-diff-label">{{ item.label }}</div>
        <div class="fs-diff-desc">{{ item.desc }}</div>
      </div>
    </div>

    <!-- Positioning one-liner -->
    <p class="fs-positioning">
      <strong>From grep to graph.</strong> Text search returns files. astix returns the call graph, the blast radius, and the exact symbols that matter — in 128x fewer tokens on average.
    </p>
  </div>
</template>

<style scoped>
/* ── Container ──────────────────────────────────────────── */
.fs-container {
  width: 100%;
}

/* ── Product cards grid ─────────────────────────────────── */
.fs-products {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
}

.fs-product {
  position: relative;
  isolation: isolate;
  background: var(--bg-card);
  border: none;
  border-radius: 14px;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: box-shadow 0.3s ease;
}

/* Animated gradient border via mask */
.fs-product::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 14px;
  padding: 1.5px;
  background: linear-gradient(
    135deg,
    var(--fs-c1),
    var(--fs-c2),
    var(--fs-c1),
    var(--fs-c2)
  );
  background-size: 300% 300%;
  animation: fs-border-flow 8s ease infinite;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.45;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.fs-product:hover::before {
  opacity: 1;
}

@keyframes fs-border-flow {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
}

.fs-product-intel {
  --fs-c1: #3b82f6;
  --fs-c2: #8b5cf6;
}
.fs-product-intel:hover {
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.1), 0 0 80px rgba(139, 92, 246, 0.05);
}

.fs-product-security {
  --fs-c1: #f59e0b;
  --fs-c2: #ef4444;
}
.fs-product-security:hover {
  box-shadow: 0 0 40px rgba(245, 158, 11, 0.1), 0 0 80px rgba(239, 68, 68, 0.05);
}

@media (prefers-reduced-motion: reduce) {
  .fs-product::before {
    animation: none;
  }
}

/* ── Product header ─────────────────────────────────────── */
.fs-product-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fs-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
}

.fs-product-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.fs-badge-soon {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.12);
  padding: 3px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ── Product subtitle, note, footer ─────────────────────── */
.fs-product-sub {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.fs-product-note {
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
  margin: 0;
}

.fs-product-footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

/* ── Feature grid (2 cols inside card) ──────────────────── */
.fs-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
}

.fs-feat {
  font-size: 13.5px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.fs-check {
  font-weight: 700;
  flex-shrink: 0;
}

/* ── Differentiator strip ───────────────────────────────── */
.fs-diff-strip {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0;
  padding: 32px 0;
  margin-bottom: 32px;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.fs-diff-item {
  flex: 1;
  text-align: center;
  padding: 0 16px;
  position: relative;
}

/* Vertical dividers between items */
.fs-diff-item + .fs-diff-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 1px;
  background: var(--border-subtle);
}

.fs-diff-value {
  font-family: var(--vp-font-family-mono);
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 6px;
}

.fs-diff-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.fs-diff-desc {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
}

/* ── Positioning one-liner ──────────────────────────────── */
.fs-positioning {
  text-align: center;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 640px;
  margin: 0 auto;
}

.fs-positioning strong {
  color: var(--text-primary);
}

/* ── Mobile ─────────────────────────────────────────────── */
@media (max-width: 768px) {
  .fs-products {
    grid-template-columns: 1fr;
  }

  .fs-features {
    grid-template-columns: 1fr;
  }

  .fs-diff-strip {
    flex-wrap: wrap;
    gap: 24px;
  }

  .fs-diff-item {
    flex: 0 0 calc(50% - 12px);
  }

  .fs-diff-item + .fs-diff-item::before {
    display: none;
  }
}
</style>
