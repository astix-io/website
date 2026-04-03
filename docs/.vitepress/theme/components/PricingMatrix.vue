<script setup lang="ts">
import { ref } from 'vue';

const annual = ref(false);

const tiers = [
	{
		name: 'Community',
		price: { monthly: 0, annual: 0 },
		billing: 'Forever. No credit card required.',
		cta: { text: 'Get Started', href: '/getting-started', style: 'ghost' },
		popular: false,
	},
	{
		name: 'Team',
		price: { monthly: 29, annual: 23 },
		billing: 'per user / month',
		cta: { text: 'Start Trial', href: '#', style: 'primary' },
		popular: true,
	},
	{
		name: 'Enterprise',
		price: { monthly: 49, annual: 39 },
		billing: 'per user / month',
		cta: { text: 'Contact Sales', href: 'mailto:sales@astix.io', style: 'ghost' },
		popular: false,
	},
];

interface Feature {
	name: string;
	tooltip: string;
	category?: string;
	values: [boolean | string, boolean | string, boolean | string];
}

const features: Feature[] = [
	// INTELLIGENCE
	{
		name: 'Search (structural + semantic)',
		tooltip: 'Find symbols by name pattern or by natural language description.',
		category: 'INTELLIGENCE',
		values: [true, true, true],
	},
	{
		name: 'Call graphs',
		tooltip: 'Trace which functions call which, across files and modules.',
		values: [true, true, true],
	},
	{ name: 'Impact analysis', tooltip: 'Know the blast radius before changing anything.', values: [true, true, true] },
	{ name: 'Data lineage', tooltip: 'Trace how variables flow across functions.', values: [true, true, true] },
	{ name: 'Execution paths', tooltip: 'Map all possible paths through a function.', values: [true, true, true] },
	{ name: 'Code health', tooltip: 'Detect dead code, unused exports, duplicated logic.', values: [true, true, true] },
	// WRITE SAFETY
	{
		name: 'Rename',
		tooltip: 'Rename across the entire call graph + imports.',
		category: 'WRITE SAFETY',
		values: [true, true, true],
	},
	{
		name: 'Patch / Write',
		tooltip: 'Edit code within functions using regex or literal patterns.',
		values: [true, true, true],
	},
	{ name: 'Rollback', tooltip: 'Undo any write operation.', values: [true, true, true] },
	{
		name: 'Approval workflows',
		tooltip: 'Require human approval before write operations.',
		values: [false, false, true],
	},
	// DEPLOYMENT
	{
		name: 'stdio (local)',
		tooltip: 'Run astix as a local process via stdin/stdout.',
		category: 'DEPLOYMENT',
		values: [true, true, true],
	},
	{ name: 'HTTP daemon', tooltip: 'Shared server for multiple developers.', values: [false, true, true] },
	{ name: 'Air-gap', tooltip: 'Fully isolated environments, all dependencies bundled.', values: [false, false, true] },
	// GOVERNANCE
	{
		name: 'OAuth 2.1',
		tooltip: 'Industry-standard authentication.',
		category: 'GOVERNANCE',
		values: [false, true, true],
	},
	{ name: 'SSO / SAML', tooltip: 'Single sign-on with your identity provider.', values: [false, false, true] },
	{ name: 'SCIM', tooltip: 'Automated user provisioning.', values: [false, false, true] },
	{ name: 'RBAC', tooltip: 'Role-based access control per project.', values: [false, true, true] },
	{ name: 'Audit logs', tooltip: 'Complete action audit trail.', values: [false, true, true] },
	{ name: 'Policy engine', tooltip: 'Custom rules for blocking risky operations.', values: [false, false, true] },
	// SUPPORT
	{
		name: 'Community',
		tooltip: 'Slack community, GitHub issues, docs.',
		category: 'SUPPORT',
		values: [true, true, true],
	},
	{ name: 'Standard', tooltip: 'Email support, 48h response time.', values: [false, true, true] },
	{ name: 'Premium + SLA', tooltip: 'Dedicated engineer, 4h response SLA.', values: [false, false, true] },
];
</script>

<template>
  <div>
    <!-- Billing toggle -->
    <div class="pm-toggle">
      <span :class="['pm-toggle-label', { 'pm-toggle-label-active': !annual }]">Monthly</span>
      <button
        class="pm-toggle-switch"
        :style="{ background: annual ? 'var(--accent-blue)' : 'var(--border-muted)' }"
        role="switch"
        :aria-checked="annual"
        @click="annual = !annual"
      >
        <span
          class="pm-toggle-knob"
          :style="{ transform: annual ? 'translateX(22px)' : 'translateX(4px)' }"
        />
      </button>
      <span :class="['pm-toggle-label', { 'pm-toggle-label-active': annual }]">Annual</span>
      <span v-if="annual" class="pm-save-badge">Save 20%</span>
    </div>

    <!-- Pricing matrix -->
    <div class="pm-scroll">
      <div class="pricing-matrix">

        <!-- Header row: tier names + prices + CTAs -->
        <div class="pm-row pm-header">
          <div class="pm-label"></div>
          <div
            v-for="tier in tiers"
            :key="tier.name"
            class="pm-cell pm-tier"
            :class="{ 'pm-popular': tier.popular }"
          >
            <div v-if="tier.popular" class="pm-popular-badge">POPULAR</div>
            <div class="pm-tier-name">{{ tier.name }}</div>
            <div class="pm-price">
              <template v-if="tier.price.monthly === 0">
                <span class="pm-price-value">Free</span>
              </template>
              <template v-else>
                <span class="pm-price-value">€{{ annual ? tier.price.annual : tier.price.monthly }}</span>
                <span class="pm-price-period">/mo</span>
              </template>
            </div>
            <div class="pm-billing">
              <template v-if="tier.price.monthly === 0">{{ tier.billing }}</template>
              <template v-else-if="annual">billed annually</template>
              <template v-else>{{ tier.billing }}</template>
            </div>
            <a :href="tier.cta.href" class="pm-cta" :class="'pm-cta-' + tier.cta.style">
              {{ tier.cta.text }}
            </a>
          </div>
        </div>

        <!-- Feature rows -->
        <template v-for="feat in features" :key="feat.name">
          <!-- Category header -->
          <div v-if="feat.category" class="pm-row pm-category">
            <div class="pm-label">{{ feat.category }}</div>
            <div class="pm-cell" v-for="n in 3" :key="n"></div>
          </div>
          <!-- Feature row -->
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
                style="display: inline-block;"
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
/* ===== BILLING TOGGLE ===== */
.pm-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 40px;
  font-size: 14px;
  color: var(--text-secondary);
}

.pm-toggle-label {
  font-weight: 400;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.pm-toggle-label-active {
  font-weight: 600;
  color: var(--text-primary);
}

.pm-toggle-switch {
  position: relative;
  display: inline-flex;
  height: 28px;
  width: 48px;
  align-items: center;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  padding: 0;
}

.pm-toggle-knob {
  display: inline-block;
  height: 20px;
  width: 20px;
  border-radius: 9999px;
  background: #fff;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.pm-save-badge {
  border-radius: 9999px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(34, 197, 94, 0.15);
  color: var(--accent-green);
}

/* ===== MATRIX CONTAINER ===== */
.pm-scroll {
  overflow-x: auto;
}

.pricing-matrix {
  display: grid;
  grid-template-columns: minmax(200px, 1.2fr) repeat(3, 1fr);
  min-width: 700px;
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

/* ===== TIER HEADER CELLS ===== */
.pm-tier {
  flex-direction: column;
  padding: 32px 24px;
  gap: 4px;
  border-bottom: 2px solid var(--border-muted);
  position: relative;
}

.pm-popular {
  background: rgba(59, 130, 246, 0.04);
  border-left: 2px solid var(--accent-blue);
  border-right: 2px solid var(--accent-blue);
  border-top: 2px solid var(--accent-blue);
  margin-top: -8px;
  padding-top: 40px;
  border-radius: 12px 12px 0 0;
}

.pm-popular-badge {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--accent-blue);
  text-transform: uppercase;
  white-space: nowrap;
}

.pm-tier-name {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text-muted);
}

.pm-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
}

.pm-price-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--vp-font-family-base);
}

.pm-price-period {
  font-size: 14px;
  color: var(--text-muted);
}

.pm-billing {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 16px;
  text-align: center;
}

/* ===== CTAs ===== */
.pm-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
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

/* ===== MOBILE ===== */
@media (max-width: 768px) {
  .pricing-matrix {
    grid-template-columns: minmax(140px, 1fr) repeat(3, minmax(140px, 1fr));
  }

  .pm-tier {
    padding: 24px 12px;
  }

  .pm-price-value {
    font-size: 28px;
  }
}
</style>
