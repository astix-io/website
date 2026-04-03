<template>
  <div>
    <!-- Monthly / Annual toggle -->
    <div class="flex items-center justify-center gap-3 mb-12">
      <span
        class="text-sm font-medium"
        :style="{ color: !annual ? 'var(--text-primary)' : 'var(--text-secondary)' }"
      >Monthly</span>
      <button
        class="relative w-12 h-6 rounded-full border-0 cursor-pointer transition-all duration-300"
        :style="{
          background: annual
            ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))'
            : 'var(--border-muted)',
        }"
        :aria-pressed="annual"
        aria-label="Toggle annual billing"
        @click="annual = !annual"
      >
        <span
          class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-300"
          :style="{
            background: '#fff',
            transform: annual ? 'translateX(24px)' : 'translateX(0)',
          }"
        />
      </button>
      <span
        class="text-sm font-medium"
        :style="{ color: annual ? 'var(--text-primary)' : 'var(--text-secondary)' }"
      >Annual</span>
      <span
        v-if="annual"
        class="text-xs font-semibold px-2 py-0.5 rounded-full"
        style="background: rgba(34,197,94,0.12); color: var(--accent-green);"
      >Save 20%</span>
    </div>

    <!-- Cards grid -->
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <!-- Community -->
      <div
        class="relative flex flex-col rounded-2xl border p-8"
        style="background: var(--bg-card); border-color: var(--border-muted);"
      >
        <div class="mb-6">
          <p class="text-xs font-semibold uppercase tracking-widest mb-2" style="color: var(--text-muted);">Community</p>
          <div class="flex items-end gap-1 mb-1">
            <span class="text-4xl font-bold" style="color: var(--text-primary);">Free</span>
          </div>
          <!-- Spacer matching the "/user/mo" + "billed monthly" lines in paid cards for vertical alignment -->
          <div class="mb-1" style="height: 24px;" aria-hidden="true"></div>
          <p class="text-sm" style="color: var(--text-secondary);">Forever. No credit card required.</p>
        </div>

        <ul class="flex-1 space-y-3 mb-8 list-none p-0">
          <li v-for="f in communityFeatures" :key="f" class="flex items-start gap-2 text-sm" style="color: var(--text-secondary);">
            <svg class="mt-0.5 shrink-0 w-4 h-4" style="color: var(--accent-green);" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ f }}
          </li>
        </ul>

        <a href="/getting-started" class="btn-secondary w-full justify-center text-center">Get Started</a>
      </div>

      <!-- Team (highlighted with gradient border) -->
      <div
        class="relative flex flex-col rounded-2xl"
        style="padding: 2px; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));"
      >
        <div class="relative flex flex-col h-full rounded-2xl p-8" style="background: var(--bg-card);">
          <!-- Popular badge -->
          <span
            class="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap"
            style="background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); color: #fff;"
          >Popular</span>

          <div class="mb-6">
            <p class="text-xs font-semibold uppercase tracking-widest mb-2" style="color: var(--text-muted);">Team</p>
            <div class="flex items-end gap-2 mb-1">
              <span class="text-4xl font-bold" style="color: var(--text-primary);">€{{ annual ? 23 : 29 }}</span>
              <span class="text-sm mb-1" style="color: var(--text-secondary);">/user/mo</span>
            </div>
            <p v-if="annual" class="text-sm" style="color: var(--text-secondary);">
              <s style="color: var(--text-muted);">€29</s>&nbsp;billed annually
            </p>
            <p v-else class="text-sm" style="color: var(--text-secondary);">billed monthly</p>
          </div>

          <ul class="flex-1 space-y-3 mb-8 list-none p-0">
            <li v-for="f in teamFeatures" :key="f" class="flex items-start gap-2 text-sm" style="color: var(--text-secondary);">
              <svg class="mt-0.5 shrink-0 w-4 h-4" style="color: var(--accent-blue);" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ f }}
            </li>
          </ul>

          <a href="#" class="btn-primary w-full justify-center text-center">Start Trial</a>
        </div>
      </div>

      <!-- Enterprise -->
      <div
        class="relative flex flex-col rounded-2xl border p-8"
        style="background: var(--bg-card); border-color: var(--border-muted);"
      >
        <div class="mb-6">
          <p class="text-xs font-semibold uppercase tracking-widest mb-2" style="color: var(--text-muted);">Enterprise</p>
          <div class="flex items-end gap-2 mb-1">
            <span class="text-4xl font-bold" style="color: var(--text-primary);">€{{ annual ? 39 : 49 }}</span>
            <span class="text-sm mb-1" style="color: var(--text-secondary);">/user/mo</span>
          </div>
          <p v-if="annual" class="text-sm" style="color: var(--text-secondary);">
            <s style="color: var(--text-muted);">€49</s>&nbsp;billed annually
          </p>
          <p v-else class="text-sm" style="color: var(--text-secondary);">billed monthly</p>
        </div>

        <ul class="flex-1 space-y-3 mb-8 list-none p-0">
          <li v-for="f in enterpriseFeatures" :key="f" class="flex items-start gap-2 text-sm" style="color: var(--text-secondary);">
            <svg class="mt-0.5 shrink-0 w-4 h-4" style="color: var(--accent-purple);" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ f }}
          </li>
        </ul>

        <a href="mailto:sales@astix.io" class="btn-secondary w-full justify-center text-center">Contact Sales</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const annual = ref(false);

const communityFeatures = [
	'Full intelligence: search, call graphs, impact analysis',
	'Data lineage & execution paths',
	'All write tools: rename, patch, insert',
	'stdio MCP transport',
	'Single user',
	'Apache 2.0 — open source',
];

const teamFeatures = [
	'Everything in Community',
	'HTTP daemon (shared server)',
	'OAuth 2.1 authentication',
	'RBAC (role-based access control)',
	'Audit logs',
	'Standard support',
];

const enterpriseFeatures = [
	'Everything in Team',
	'On-prem / air-gap deployment',
	'SSO / SAML / SCIM',
	'Approval workflows for writes',
	'Policy engine',
	'Premium support + SLA',
];
</script>
