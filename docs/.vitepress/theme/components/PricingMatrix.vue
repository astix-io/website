<script setup lang="ts">
import { computed, ref } from 'vue';

type DeployMode = 'hosted' | 'self-hosted';
type BillingCycle = 'monthly' | 'annual';

const deploy = ref<DeployMode>('hosted');
const billing = ref<BillingCycle>('annual');

interface TierPrice {
  monthly: number | null; // null = "Contact us"
  annual: number | null; // per-month equivalent when billed annually
  perSeat?: { monthly: number; annual: number };
  billingLabel?: string;
}

interface Tier {
  name: string;
  tagline: string;
  hosted: TierPrice;
  selfHosted: TierPrice;
  hostedAvailable: boolean;
  highlights: string[];
  cta: { text: string; href: string; style: 'ghost' | 'primary' | 'outline' };
  popular: boolean;
  badge?: string;
  popularBadge?: string;
}

const tiers: Tier[] = [
  {
    name: 'Free',
    tagline: 'For exploring and solo hobby projects',
    hostedAvailable: false,
    hosted: { monthly: 0, annual: 0 },
    selfHosted: { monthly: 0, annual: 0 },
    highlights: [
      'Unlimited lines of code',
      'Unlimited projects',
      '1 developer',
      'All read-only analysis tools',
      'Call graphs & data lineage',
      'Self-hosted (PostgreSQL required)',
    ],
    cta: { text: 'Get started', href: '/docs/getting-started', style: 'ghost' },
    popular: false,
    badge: 'SELF-HOSTED ONLY',
  },
  {
    name: 'Solo',
    tagline: 'For individual developers',
    hostedAvailable: true,
    hosted: { monthly: 59, annual: 49, billingLabel: 'billed annually' },
    selfHosted: { monthly: 49, annual: 39, billingLabel: 'billed annually' },
    highlights: [
      'Everything in Free',
      'Hosted option (zero ops) or self-hosted',
      'All write operations (rename, patch, refactor)',
      'Semantic + hybrid search',
      'BYOK intelligence features (200/mo)',
      '500K LOC included',
    ],
    cta: { text: 'Get started', href: 'mailto:hello@astix.io?subject=Solo plan', style: 'ghost' },
    popular: false,
    badge: 'WRITE ENABLED',
  },
  {
    name: 'Team',
    tagline: 'For growing engineering teams',
    hostedAvailable: true,
    hosted: {
      monthly: 359,
      annual: 299,
      perSeat: { monthly: 39, annual: 29 },
      billingLabel: 'billed annually',
    },
    selfHosted: {
      monthly: 299,
      annual: 249,
      perSeat: { monthly: 29, annual: 19 },
      billingLabel: 'billed annually',
    },
    highlights: [
      'Everything in Solo',
      'Up to 5 developers included ($29/seat extra)',
      'Hosted dashboard with shareable links',
      'SSO (SAML / OAuth)',
      'Impact analysis depth 5',
      '2M LOC included',
      'Commercial / team license',
    ],
    cta: { text: 'Contact sales', href: 'mailto:sales@astix.io?subject=Team plan', style: 'primary' },
    popular: true,
    popularBadge: 'MOST POPULAR',
  },
  {
    name: 'Enterprise',
    tagline: 'Custom for your organization',
    hostedAvailable: true,
    hosted: { monthly: null, annual: null },
    selfHosted: { monthly: null, annual: null },
    highlights: [
      'Everything in Team',
      'Unlimited LOC and developers',
      'Physical tenant isolation',
      'Audit log + SIEM export',
      'Priority support & SLA',
      'Custom deployment',
    ],
    cta: { text: 'Contact us', href: 'mailto:sales@astix.io?subject=Enterprise plan', style: 'outline' },
    popular: false,
  },
];

const activePrice = computed(() =>
  tiers.map((t) => {
    const price = deploy.value === 'hosted' ? t.hosted : t.selfHosted;
    return {
      value: billing.value === 'annual' ? price.annual : price.monthly,
      perSeat: price.perSeat
        ? billing.value === 'annual'
          ? price.perSeat.annual
          : price.perSeat.monthly
        : undefined,
    };
  }),
);

interface SecurityTier {
  name: string;
  monthly: number | null;
  annual: number | null;
  features: string[];
  cta: string;
  ctaHref: string;
}

const securityTiers: SecurityTier[] = [
  {
    name: 'Solo',
    monthly: 99,
    annual: 79,
    features: [
      '5 taint categories',
      '14 code health checks',
      'Framework signature detection',
      'CLI + MCP integration',
    ],
    cta: 'Join waitlist',
    ctaHref: 'mailto:hello@astix.io?subject=Security Solo waitlist',
  },
  {
    name: 'Team',
    monthly: 499,
    annual: 399,
    features: [
      'Everything in Solo Security',
      'Custom taint patterns',
      'PR check integration',
      'OWASP Top 10 reports',
    ],
    cta: 'Join waitlist',
    ctaHref: 'mailto:hello@astix.io?subject=Security Team waitlist',
  },
  {
    name: 'Enterprise',
    monthly: null,
    annual: null,
    features: [
      'Everything in Team Security',
      'Custom detection rules',
      'SIEM export',
      'SOC 2 compliance reports',
    ],
    cta: 'Contact us',
    ctaHref: 'mailto:sales@astix.io?subject=Security Enterprise',
  },
];

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
    values: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited'],
  },
  {
    name: 'Semantic search (vector + BM25)',
    tooltip: 'Natural-language search using embeddings and full-text ranking.',
    values: ['BM25 only', 'Hybrid, unlimited', 'Hybrid, unlimited', 'Hybrid, unlimited'],
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
    <!-- Launch offer banner -->
    <div class="pm-launch-banner" role="alert">
      <span class="pm-launch-emoji" aria-hidden="true">🎉</span>
      <span><strong>Launch offer:</strong> 3 months free on any annual plan. Ends June 24, 2026.</span>
    </div>

    <!-- Toggles row -->
    <div class="pm-controls">
      <!-- Hosted / Self-hosted toggle -->
      <div class="pm-toggle-group">
        <button
          class="pm-toggle-btn"
          :class="{ 'pm-toggle-btn-active': deploy === 'hosted' }"
          @click="deploy = 'hosted'"
        >
          Hosted
        </button>
        <button
          class="pm-toggle-btn"
          :class="{ 'pm-toggle-btn-active': deploy === 'self-hosted' }"
          @click="deploy = 'self-hosted'"
        >
          Self-hosted
        </button>
      </div>

      <!-- Monthly / Annual billing toggle -->
      <div class="pm-toggle-group pm-billing-toggle">
        <button
          class="pm-toggle-btn"
          :class="{ 'pm-toggle-btn-active': billing === 'monthly' }"
          @click="billing = 'monthly'"
        >
          Monthly
        </button>
        <button
          class="pm-toggle-btn"
          :class="{ 'pm-toggle-btn-active': billing === 'annual' }"
          @click="billing = 'annual'"
        >
          Annual
          <span class="pm-annual-save">Save ~17%</span>
        </button>
      </div>
    </div>

    <p class="pm-deploy-note">
      <template v-if="deploy === 'hosted'">
        Managed by astix — zero ops, always up to date.
      </template>
      <template v-else>
        Run on your own infrastructure. Zero code egress.
      </template>
    </p>

    <!-- ===== CODE INTELLIGENCE SECTION ===== -->
    <div class="pm-section-header">
      <h2 class="pm-section-title">Code Intelligence</h2>
      <p class="pm-section-desc">AST-level analysis, semantic search, and safe code writes across 38 languages.</p>
    </div>

    <!-- Pricing cards -->
    <div class="pm-cards">
      <div
        v-for="(tier, i) in tiers"
        :key="tier.name"
        class="pm-card"
        :class="{
          'pm-card-popular': tier.popular,
          'pm-card-unavailable': deploy === 'hosted' && !tier.hostedAvailable,
        }"
      >
        <div v-if="tier.popular && tier.popularBadge" class="pm-popular-badge">{{ tier.popularBadge }}</div>
        <div v-if="tier.badge" class="pm-tier-badge">{{ tier.badge }}</div>

        <div class="pm-card-name">{{ tier.name }}</div>
        <p class="pm-tagline">{{ tier.tagline }}</p>

        <div class="pm-divider"></div>

        <!-- Hosted-not-available state for Free tier -->
        <template v-if="deploy === 'hosted' && !tier.hostedAvailable">
          <div class="pm-not-available-block">
            <div class="pm-not-available-icon" aria-hidden="true">🔒</div>
            <p class="pm-not-available-msg">Not available hosted</p>
            <p class="pm-not-available-hint">Free tier is self-hosted only. See Solo for hosted.</p>
          </div>
          <a href="mailto:hello@astix.io?subject=Solo plan" class="pm-cta pm-cta-ghost">
            Explore Solo
          </a>
        </template>

        <!-- Normal price display -->
        <template v-else>
          <div class="pm-price-block">
            <div class="pm-price">
              <template v-if="activePrice[i].value === null">
                <span class="pm-price-contact">Contact us</span>
              </template>
              <template v-else-if="activePrice[i].value === 0">
                <span class="pm-price-value">$0</span>
                <span class="pm-price-period">/mo</span>
              </template>
              <template v-else>
                <span class="pm-price-prefix">$</span>
                <span class="pm-price-value">{{ activePrice[i].value }}</span>
                <span class="pm-price-period">/mo</span>
              </template>
            </div>
            <div class="pm-billing">
              <template v-if="activePrice[i].value === null">Custom pricing</template>
              <template v-else-if="activePrice[i].value === 0">Forever free</template>
              <template v-else-if="billing === 'annual'">billed annually</template>
              <template v-else>billed monthly</template>
              <template v-if="activePrice[i].perSeat !== undefined">
                &nbsp;+ ${{ activePrice[i].perSeat }}/seat
              </template>
            </div>
          </div>

          <a :href="tier.cta.href" class="pm-cta" :class="'pm-cta-' + tier.cta.style">
            {{ tier.cta.text }}
          </a>
        </template>

        <div class="pm-divider"></div>

        <div class="pm-highlights-header">What's included</div>
        <ul class="pm-highlights">
          <li v-for="h in tier.highlights" :key="h">{{ h }}</li>
        </ul>
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
              <template v-if="activePrice[i].value === null">Contact</template>
              <template v-else-if="activePrice[i].value === 0">Free</template>
              <template v-else>${{ activePrice[i].value }}/mo</template>
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

    <!-- ===== SECURITY ANALYSIS SECTION ===== -->
    <section class="pm-security-section">
      <div class="pm-security-header">
        <div class="pm-security-title-row">
          <h2 class="pm-security-title">Add Security Analysis</h2>
          <span class="pm-security-coming-soon">COMING SOON — PHASE 2</span>
        </div>
        <p class="pm-security-desc">
          CFG-aware taint tracking across function boundaries. Detects injection, XSS, path traversal and more.
          Requires an active Code Intelligence subscription.
        </p>
      </div>

      <div class="pm-security-cards">
        <div
          v-for="sec in securityTiers"
          :key="sec.name"
          class="pm-security-card"
        >
          <div class="pm-security-card-name">{{ sec.name }}</div>
          <div class="pm-security-price-block">
            <template v-if="sec.monthly === null">
              <span class="pm-security-price-contact">Custom</span>
            </template>
            <template v-else>
              <span class="pm-security-price-prefix">$</span>
              <span class="pm-security-price-value">
                {{ billing === 'annual' ? sec.annual : sec.monthly }}
              </span>
              <span class="pm-security-price-period">/mo</span>
            </template>
          </div>
          <div class="pm-security-billing">
            <template v-if="sec.monthly !== null">
              {{ billing === 'annual' ? 'billed annually' : 'billed monthly' }}
            </template>
          </div>
          <ul class="pm-security-features">
            <li v-for="f in sec.features" :key="f">{{ f }}</li>
          </ul>
          <a :href="sec.ctaHref" class="pm-cta pm-cta-outline pm-security-cta">
            {{ sec.cta }}
          </a>
        </div>
      </div>

      <div class="pm-security-note">
        <strong>Bundle &amp; save ~20%</strong> — Code Intelligence + Security together.
        <a href="mailto:sales@astix.io?subject=Bundle pricing">Contact us for bundle pricing.</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ===== LAUNCH BANNER ===== */
.pm-launch-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--accent-blue) 12%, transparent),
    color-mix(in srgb, var(--accent-purple) 10%, transparent)
  );
  border: 1px solid color-mix(in srgb, var(--accent-blue) 30%, transparent);
  border-radius: 10px;
  padding: 12px 20px;
  margin-bottom: 32px;
  font-size: 14px;
  color: var(--text-primary);
}

.pm-launch-emoji {
  font-size: 18px;
  flex-shrink: 0;
}

/* ===== CONTROLS ROW ===== */
.pm-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

/* ===== TOGGLE GROUPS ===== */
.pm-toggle-group {
  display: inline-flex;
  border: 1px solid var(--border-muted);
  border-radius: 10px;
  overflow: hidden;
}

.pm-toggle-btn {
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  transition: background-color 0.18s ease, color 0.18s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pm-toggle-btn-active {
  background: var(--accent-blue);
  color: #fff;
  font-weight: 600;
}

.pm-annual-save {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 2px 6px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--accent-green) 20%, transparent);
  color: var(--accent-green);
}

.pm-toggle-btn-active .pm-annual-save {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.pm-deploy-note {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 40px;
}

/* ===== SECTION HEADER ===== */
.pm-section-header {
  margin-bottom: 28px;
}

.pm-section-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
}

.pm-section-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
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
  border-radius: 14px;
  padding: 32px 24px;
  display: grid;
  grid-template-rows:
    auto      /* 1. tier name */
    48px      /* 2. tagline */
    1px       /* 3. divider */
    120px     /* 4. price block or not-available block */
    auto      /* 5. CTA button */
    1px       /* 6. divider */
    auto      /* 7. features header */
    1fr;      /* 8. features list */
  gap: 0;
  text-align: center;
  position: relative;
  background: var(--bg-card);
  transition: border-color 0.2s, transform 0.2s;
  min-height: 560px;
}

.pm-card:hover {
  border-color: var(--border-muted);
  transform: translateY(-2px);
}

.pm-card-popular {
  border-color: var(--accent-blue);
  border-width: 2px;
  background: rgba(59, 130, 246, 0.04);
}

.pm-card-unavailable {
  opacity: 0.6;
  filter: grayscale(0.4);
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
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  background: var(--bg-deep);
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.pm-card-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 8px;
  margin-bottom: 4px;
}

.pm-tagline {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pm-divider {
  border: none;
  border-top: 1px solid var(--border-subtle);
  margin: 0;
}

/* ===== NOT AVAILABLE STATE ===== */
.pm-not-available-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;
}

.pm-not-available-icon {
  font-size: 24px;
}

.pm-not-available-msg {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.pm-not-available-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
}

/* ===== PRICE BLOCK ===== */
.pm-price-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.pm-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  margin-bottom: 4px;
}

.pm-price-contact {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.pm-price-prefix {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 4px;
}

.pm-price-value {
  font-size: 40px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.pm-price-period {
  font-size: 15px;
  color: var(--text-muted);
  font-weight: 500;
  align-self: flex-end;
  margin-bottom: 6px;
}

.pm-billing {
  font-size: 12px;
  color: var(--text-muted);
  min-height: 18px;
  margin-top: 6px;
}

/* ===== HIGHLIGHTS ===== */
.pm-highlights-header {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-top: 20px;
  padding-bottom: 14px;
  margin: 0;
  text-align: left;
}

.pm-highlights {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  align-content: start;
}

.pm-highlights li {
  position: relative;
  padding-left: 26px;
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.pm-highlights li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  width: 16px;
  height: 16px;
  background: color-mix(in srgb, var(--accent-blue) 15%, transparent);
  border-radius: 50%;
}

.pm-highlights li::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 7px;
  width: 8px;
  height: 5px;
  border-left: 2px solid var(--accent-blue);
  border-bottom: 2px solid var(--accent-blue);
  transform: rotate(-45deg);
}

.pm-card-popular .pm-highlights li::before {
  background: color-mix(in srgb, var(--accent-blue) 20%, transparent);
}

.pm-card-popular .pm-highlights li::after {
  border-color: var(--accent-blue);
}

/* ===== CTAs ===== */
.pm-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  text-align: center;
  width: 100%;
  align-self: center;
  margin: 12px 0;
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

/* ===== SECURITY SECTION ===== */
.pm-security-section {
  margin-top: 72px;
  padding-top: 48px;
  border-top: 1px solid var(--border-subtle);
}

.pm-security-header {
  margin-bottom: 32px;
}

.pm-security-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.pm-security-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.pm-security-coming-soon {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  background: var(--bg-deep);
  border: 1px solid var(--border-muted);
  padding: 4px 10px;
  border-radius: 6px;
}

.pm-security-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  max-width: 600px;
}

.pm-security-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.pm-security-card {
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 24px 20px;
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  gap: 0;
  opacity: 0.75;
  transition: opacity 0.2s;
}

.pm-security-card:hover {
  opacity: 1;
}

.pm-security-card-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.pm-security-price-block {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-bottom: 4px;
}

.pm-security-price-contact {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.pm-security-price-prefix {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.pm-security-price-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.pm-security-price-period {
  font-size: 13px;
  color: var(--text-muted);
  align-self: flex-end;
  margin-bottom: 4px;
}

.pm-security-billing {
  font-size: 11px;
  color: var(--text-muted);
  min-height: 16px;
  margin-bottom: 16px;
}

.pm-security-features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.pm-security-features li {
  position: relative;
  padding-left: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.pm-security-features li::before {
  content: '\B7';
  position: absolute;
  left: 6px;
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.2;
}

.pm-security-cta {
  margin: 0;
  font-size: 13px;
  padding: 9px 16px;
}

.pm-security-note {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
  padding: 16px;
  background: color-mix(in srgb, var(--accent-blue) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent-blue) 15%, transparent);
  border-radius: 8px;
}

.pm-security-note a {
  color: var(--accent-blue);
  text-decoration: none;
}

.pm-security-note a:hover {
  text-decoration: underline;
}

/* ===== FOCUS VISIBLE ===== */
.pm-cta:focus-visible,
.pm-toggle-btn:focus-visible {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
}

/* ===== MOBILE ===== */
@media (max-width: 1100px) {
  .pm-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .pm-security-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .pm-security-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .pm-cards {
    grid-template-columns: 1fr;
  }

  .pm-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .pm-toggle-btn {
    padding: 8px 16px;
  }
}
</style>
