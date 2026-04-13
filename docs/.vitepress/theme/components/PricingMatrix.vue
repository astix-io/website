<script setup lang="ts">
import { computed, ref } from 'vue';

type DeployMode = 'hosted' | 'self-hosted';
const deploy = ref<DeployMode>('hosted');

interface TierPrice {
	base: number | null; // null = "Contact us"
	perSeat?: number; // extra per seat above included
	billing: string;
}

interface Tier {
	name: string;
	hosted: TierPrice;
	selfHosted: TierPrice;
	loc: string;
	projects: string;
	devs: string;
	cta: { text: string; href: string; style: 'ghost' | 'primary' | 'outline' };
	popular: boolean;
	badge?: string;
}

const tiers: Tier[] = [
	{
		name: 'Free',
		hosted: { base: 0, billing: 'Forever free' },
		selfHosted: { base: 0, billing: 'Forever free' },
		loc: '100K',
		projects: '3',
		devs: '1',
		cta: { text: 'Get started', href: '/getting-started', style: 'ghost' },
		popular: false,
		badge: 'READ-ONLY',
	},
	{
		name: 'Solo',
		hosted: { base: 29, billing: 'per month' },
		selfHosted: { base: 29, billing: 'per month' },
		loc: '500K',
		projects: 'Unlimited',
		devs: '1',
		cta: { text: 'Get started', href: '#', style: 'ghost' },
		popular: false,
	},
	{
		name: 'Team',
		hosted: { base: 179, perSeat: 20, billing: '/mo + $20/seat' },
		selfHosted: { base: 249, perSeat: 25, billing: '/mo + $25/seat' },
		loc: '2M',
		projects: 'Unlimited',
		devs: '5 included',
		cta: { text: 'Contact sales', href: 'mailto:sales@astix.io', style: 'primary' },
		popular: true,
	},
	{
		name: 'Enterprise',
		hosted: { base: null, billing: '' },
		selfHosted: { base: null, billing: '' },
		loc: 'Unlimited',
		projects: 'Unlimited',
		devs: 'Unlimited',
		cta: { text: 'Contact us', href: 'mailto:sales@astix.io', style: 'outline' },
		popular: false,
	},
];

const activePrice = computed(() => tiers.map((t) => (deploy.value === 'hosted' ? t.hosted : t.selfHosted)));

interface Feature {
	name: string;
	tooltip: string;
	category?: string;
	values: [string | boolean, string | boolean, string | boolean, string | boolean];
}

const features: Feature[] = [
	// SEARCH & ANALYSIS
	{
		name: 'Structural search',
		tooltip: 'Find symbols by name pattern across the entire codebase.',
		category: 'SEARCH & ANALYSIS',
		values: ['50 queries/day', 'Unlimited', 'Unlimited', 'Unlimited'],
	},
	{
		name: 'Semantic search (vector + BM25)',
		tooltip: 'Natural-language search using embeddings and full-text ranking.',
		values: ['BM25 only, 30/day', 'Hybrid, unlimited', 'Hybrid, unlimited', 'Hybrid, unlimited'],
	},
	{
		name: 'Cross-project search',
		tooltip: 'Search across multiple repositories in a single query.',
		values: ['1 project', true, true, true],
	},
	{
		name: 'Impact analysis (blast radius)',
		tooltip: 'Know which symbols are affected before making a change.',
		values: ['Depth 2', 'Depth 3', 'Depth 5', 'Unlimited'],
	},
	{
		name: 'Duplicate detection',
		tooltip: 'Find structurally or semantically similar code blocks.',
		values: ['Exact only', '4 modes', '4 modes', '4 modes'],
	},
	{
		name: 'Community detection',
		tooltip: 'Map clusters of tightly coupled modules.',
		values: [true, true, '+ trends', '+ trends'],
	},
	// WRITE OPERATIONS
	{
		name: 'patch_symbol / patch_file',
		tooltip: 'Edit code within a symbol using literal or regex patterns.',
		category: 'WRITE OPERATIONS',
		values: [false, true, true, true],
	},
	{
		name: 'insert_symbol / delete_symbol',
		tooltip: 'Add or remove symbols with automatic index update.',
		values: [false, true, true, true],
	},
	{
		name: 'rename_symbol (cross-file)',
		tooltip: 'Rename across the entire call graph and all import sites.',
		values: [false, true, true, true],
	},
	{
		name: 'Conflict detection',
		tooltip: 'Detect concurrent edits before applying write operations.',
		values: [false, true, true, true],
	},
	// INTELLIGENCE / LLM (BYOK)
	{
		name: 'explain_symbol',
		tooltip: 'Generate natural-language explanations of functions and classes. Requires BYOK.',
		category: 'INTELLIGENCE / LLM (BYOK)',
		values: ['10/mo', '200/mo', 'Unlimited', 'Unlimited'],
	},
	{
		name: 'trace_flow (Mermaid/JSON)',
		tooltip: 'Visualize execution flows as Mermaid diagrams or structured JSON.',
		values: ['10/mo', '200/mo', 'Unlimited', 'Unlimited'],
	},
	{
		name: 'suggest_tests',
		tooltip: 'Generate test skeletons from uncovered execution paths.',
		values: [false, '100/mo', 'Unlimited', 'Unlimited'],
	},
	{
		name: 'fill_descriptions (batch)',
		tooltip: 'Auto-generate doc descriptions for all symbols in bulk.',
		values: [false, '500/mo', 'Unlimited', 'Unlimited'],
	},
	// INFRASTRUCTURE
	{
		name: 'API rate limit',
		tooltip: 'Maximum requests per hour to the astix MCP server.',
		category: 'INFRASTRUCTURE',
		values: ['100 req/h', '1K req/h', '10K req/h', 'Unlimited'],
	},
	{
		name: 'SSO (SAML / OAuth)',
		tooltip: 'Single sign-on with your identity provider.',
		values: [false, false, true, true],
	},
	{
		name: 'Audit log',
		tooltip: 'Complete trail of all read and write operations.',
		values: [false, false, false, true],
	},
	{
		name: 'Tenant isolation',
		tooltip: 'Degree of data isolation between workspaces.',
		values: ['—', 'RLS', 'Schema', 'Physical'],
	},
	{
		name: 'Dashboard',
		tooltip: 'Web UI for project health, query history, and team usage.',
		values: [false, 'Localhost', 'Hosted + shareable', 'Hosted + shareable'],
	},
	{
		name: 'History & trends',
		tooltip: 'Track code health metrics and usage trends over time.',
		values: [false, false, true, true],
	},
];
</script>

<template>
  <div>
    <!-- Hosted / Self-hosted toggle -->
    <div class="pm-deploy-toggle">
      <button
        class="pm-deploy-btn"
        :class="{ 'pm-deploy-btn-active': deploy === 'hosted' }"
        @click="deploy = 'hosted'"
      >
        Hosted
      </button>
      <button
        class="pm-deploy-btn"
        :class="{ 'pm-deploy-btn-active': deploy === 'self-hosted' }"
        @click="deploy = 'self-hosted'"
      >
        Self-hosted
      </button>
    </div>
    <p class="pm-deploy-note">
      <template v-if="deploy === 'hosted'">
        Managed by astix — zero ops, always up to date.
      </template>
      <template v-else>
        Run on your own infrastructure. Zero code egress.
      </template>
    </p>

    <!-- Pricing cards -->
    <div class="pm-cards">
      <div
        v-for="(tier, i) in tiers"
        :key="tier.name"
        class="pm-card"
        :class="{ 'pm-card-popular': tier.popular }"
      >
        <div v-if="tier.popular" class="pm-popular-badge">MOST POPULAR</div>
        <div v-if="tier.badge" class="pm-tier-badge">{{ tier.badge }}</div>

        <div class="pm-card-name">{{ tier.name }}</div>

        <div class="pm-price">
          <template v-if="activePrice[i].base === null">
            <span class="pm-price-contact">Contact us</span>
          </template>
          <template v-else-if="activePrice[i].base === 0">
            <span class="pm-price-value">$0</span>
            <span class="pm-price-period">/mo</span>
          </template>
          <template v-else>
            <span class="pm-price-prefix">$</span>
            <span class="pm-price-value">{{ activePrice[i].base }}</span>
            <span class="pm-price-period">/mo</span>
          </template>
        </div>

        <div class="pm-billing">{{ activePrice[i].billing }}</div>

        <ul class="pm-highlights">
          <li><span class="pm-hl-label">LOC</span> {{ tier.loc }}</li>
          <li><span class="pm-hl-label">Projects</span> {{ tier.projects }}</li>
          <li><span class="pm-hl-label">Developers</span> {{ tier.devs }}</li>
        </ul>

        <a :href="tier.cta.href" class="pm-cta" :class="'pm-cta-' + tier.cta.style">
          {{ tier.cta.text }}
        </a>
      </div>
    </div>

    <!-- All plans include -->
    <div class="pm-all-include">
      <div class="pm-all-include-label">All plans include</div>
      <div class="pm-all-include-items">
        <span>38 languages</span>
        <span>AST parsing</span>
        <span>Call graphs</span>
        <span>Data lineage</span>
        <span>Execution paths</span>
        <span>Self-hosted option</span>
        <span>Apache 2.0 core</span>
      </div>
    </div>

    <!-- Feature comparison table -->
    <div class="pm-scroll" style="margin-top: 56px;">
      <div class="pricing-matrix">

        <!-- Header row -->
        <div class="pm-row pm-header">
          <div class="pm-label pm-label-header">Feature comparison</div>
          <div
            v-for="(tier, i) in tiers"
            :key="tier.name"
            class="pm-cell pm-tier"
            :class="{ 'pm-popular-col': tier.popular }"
          >
            <div class="pm-tier-name">{{ tier.name }}</div>
            <div class="pm-tier-subprice">
              <template v-if="activePrice[i].base === null">Contact</template>
              <template v-else-if="activePrice[i].base === 0">Free</template>
              <template v-else>${{ activePrice[i].base }}/mo</template>
            </div>
          </div>
        </div>

        <!-- Feature rows -->
        <template v-for="feat in features" :key="feat.name">
          <div v-if="feat.category" class="pm-row pm-category">
            <div class="pm-label">{{ feat.category }}</div>
            <div class="pm-cell" v-for="n in 4" :key="n"></div>
          </div>
          <div class="pm-row">
            <div class="pm-label">
              <span class="feature-tooltip" :data-tooltip="feat.tooltip">{{ feat.name }}</span>
            </div>
            <div
              v-for="(val, j) in feat.values"
              :key="j"
              class="pm-cell"
              :class="{ 'pm-popular-col': tiers[j].popular }"
            >
              <svg
                v-if="val === true"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent-green)"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-label="Included"
              >
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              <span v-else-if="val === false" class="pm-dash" aria-label="Not included">—</span>
              <span v-else class="pm-text-val">{{ val }}</span>
            </div>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== DEPLOY TOGGLE ===== */
.pm-deploy-toggle {
  display: inline-flex;
  border: 1px solid var(--border-muted);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.pm-deploy-btn {
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.pm-deploy-btn-active {
  background: var(--accent-blue);
  color: #fff;
  font-weight: 600;
}

.pm-deploy-note {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 40px;
}

/* ===== PRICING CARDS ===== */
.pm-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.pm-card {
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  position: relative;
  background: var(--bg-card);
  transition: border-color 0.2s;
}

.pm-card:hover {
  border-color: var(--border-muted);
}

.pm-card-popular {
  border-color: var(--accent-blue);
  border-width: 2px;
  background: rgba(59, 130, 246, 0.04);
}

.pm-popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #fff;
  background: var(--accent-blue);
  padding: 3px 12px;
  border-radius: 20px;
  white-space: nowrap;
  text-transform: uppercase;
}

.pm-tier-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 2px;
}

.pm-card-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.pm-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 1px;
  margin-top: 4px;
}

.pm-price-contact {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.pm-price-prefix {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.pm-price-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.pm-price-period {
  font-size: 14px;
  color: var(--text-muted);
  margin-left: 2px;
}

.pm-billing {
  font-size: 12px;
  color: var(--text-muted);
  min-height: 18px;
}

.pm-highlights {
  list-style: none;
  padding: 0;
  margin: 12px 0 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  text-align: left;
  width: 100%;
}

.pm-hl-label {
  font-weight: 600;
  color: var(--text-primary);
  margin-right: 4px;
}

/* ===== CTAs ===== */
.pm-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  margin-top: auto;
  text-align: center;
  width: 100%;
}

.pm-cta-ghost {
  background: transparent;
  border: 1px solid var(--border-muted);
  color: var(--text-primary);
}

.pm-cta-ghost:hover {
  border-color: var(--text-secondary);
  background: var(--btn-secondary-bg);
}

.pm-cta-primary {
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  border: none;
  color: #fff;
}

.pm-cta-primary:hover {
  opacity: 0.9;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.pm-cta-outline {
  background: transparent;
  border: 1px solid var(--border-muted);
  color: var(--text-secondary);
}

.pm-cta-outline:hover {
  border-color: var(--text-muted);
}

/* ===== ALL PLANS INCLUDE ===== */
.pm-all-include {
  border-top: 1px solid var(--border-subtle);
  padding-top: 24px;
  text-align: center;
}

.pm-all-include-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.pm-all-include-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.pm-all-include-items span {
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  padding: 4px 14px;
}

/* ===== MATRIX CONTAINER ===== */
.pm-scroll {
  overflow-x: auto;
}

.pricing-matrix {
  display: grid;
  grid-template-columns: minmax(200px, 1.2fr) repeat(4, 1fr);
  min-width: 760px;
}

.pm-row {
  display: contents;
}

/* ===== LABEL COLUMN ===== */
.pm-label {
  padding: 14px 16px;
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-subtle);
}

.pm-label-header {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* ===== DATA CELLS ===== */
.pm-cell {
  padding: 14px 16px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 14px;
}

.pm-popular-col {
  background: rgba(59, 130, 246, 0.04);
}

.pm-dash {
  color: var(--text-muted);
}

.pm-text-val {
  color: var(--text-secondary);
  font-size: 13px;
}

/* ===== CATEGORY HEADER ROWS ===== */
.pm-category .pm-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding-top: 28px;
  border-bottom: 1px solid var(--border-muted);
}

.pm-category .pm-cell {
  padding-top: 28px;
  border-bottom: 1px solid var(--border-muted);
}

/* ===== TIER HEADER CELLS (in matrix) ===== */
.pm-tier {
  flex-direction: column;
  padding: 20px 16px;
  gap: 2px;
  border-bottom: 2px solid var(--border-muted);
}

.pm-tier-name {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-primary);
}

.pm-tier-subprice {
  font-size: 12px;
  color: var(--text-muted);
}

/* ===== FOCUS VISIBLE ===== */
.pm-cta:focus-visible,
.pm-deploy-btn:focus-visible {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
}

/* ===== MOBILE ===== */
@media (max-width: 900px) {
  .pm-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 540px) {
  .pm-cards {
    grid-template-columns: 1fr;
  }

  .pm-deploy-btn {
    padding: 8px 16px;
  }
}
</style>