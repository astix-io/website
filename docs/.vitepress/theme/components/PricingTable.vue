<template>
  <div class="overflow-x-auto rounded-2xl border" style="border-color: var(--border-muted);">
    <table class="pricing-table w-full text-sm border-collapse">
      <thead>
        <tr style="background: var(--bg-card);">
          <th class="text-left py-4 px-6 font-semibold" style="color: var(--text-secondary); width: 40%;">Feature</th>
          <th class="text-center py-4 px-4 font-semibold" style="color: var(--text-primary);">Community</th>
          <th
            class="text-center py-4 px-4 font-semibold"
            style="color: var(--accent-blue);"
          >Team</th>
          <th class="text-center py-4 px-4 font-semibold" style="color: var(--text-primary);">Enterprise</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="group in tableGroups" :key="group.category">
          <!-- Category header row -->
          <tr class="category-row" style="background: var(--bg-deep);">
            <td
              colspan="4"
              class="py-3 px-6 text-xs font-bold uppercase tracking-widest"
              style="color: var(--text-muted);"
            >{{ group.category }}</td>
          </tr>
          <!-- Feature rows -->
          <tr
            v-for="row in group.rows"
            :key="row.feature"
          >
            <td class="py-3 px-6" style="color: var(--text-secondary); background: var(--bg-card);">
              <span class="feature-tooltip" :data-tooltip="row.tooltip">{{ row.feature }}</span>
            </td>
            <td class="py-3 px-4 text-center" style="background: var(--bg-card);">
              <span v-html="renderCell(row.community)" />
            </td>
            <td class="py-3 px-4 text-center">
              <span v-html="renderCell(row.team)" />
            </td>
            <td class="py-3 px-4 text-center" style="background: var(--bg-card);">
              <span v-html="renderCell(row.enterprise)" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface TableRow {
	feature: string;
	tooltip: string;
	community: boolean | string;
	team: boolean | string;
	enterprise: boolean | string;
}

interface TableGroup {
	category: string;
	rows: TableRow[];
}

const tableGroups: TableGroup[] = [
	{
		category: 'Intelligence',
		rows: [
			{
				feature: 'Search (structural + semantic)',
				tooltip: 'Find symbols by name pattern or by natural language description. Results in milliseconds.',
				community: true,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Call graphs',
				tooltip:
					'Trace which functions call which, across files and modules. See direct and transitive callers/callees.',
				community: true,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Impact analysis',
				tooltip:
					'Know the blast radius before changing anything. Shows all affected symbols with risk level assessment.',
				community: true,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Data lineage',
				tooltip:
					'Trace how variables flow across functions. Follow data from input to database, across module boundaries.',
				community: true,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Execution paths',
				tooltip: 'Map all possible paths through a function. Identify untested branches and edge cases.',
				community: true,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Code health',
				tooltip: 'Detect dead code, unused exports, duplicated logic. Keep your codebase clean automatically.',
				community: true,
				team: true,
				enterprise: true,
			},
		],
	},
	{
		category: 'Write Safety',
		rows: [
			{
				feature: 'Rename',
				tooltip: 'Rename a symbol across the entire call graph + import statements. Atomic, conflict-free.',
				community: true,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Patch / Write',
				tooltip: 'Edit code within functions using regex or literal patterns. Scoped to symbol boundaries for safety.',
				community: true,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Rollback',
				tooltip: 'Undo any write operation. Every change is tracked with before/after state.',
				community: true,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Approval workflows',
				tooltip: 'Require human approval before write operations are applied. Configurable per team and risk level.',
				community: false,
				team: false,
				enterprise: true,
			},
		],
	},
	{
		category: 'Deployment',
		rows: [
			{
				feature: 'stdio (local)',
				tooltip: 'Run astix as a local process. Your MCP client connects directly via stdin/stdout.',
				community: true,
				team: true,
				enterprise: true,
			},
			{
				feature: 'HTTP daemon',
				tooltip: 'Run astix as a shared server. Multiple developers connect to the same indexed codebase.',
				community: false,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Air-gap / on-prem',
				tooltip: 'Deploy in fully isolated environments with no internet access. All dependencies bundled.',
				community: false,
				team: false,
				enterprise: true,
			},
		],
	},
	{
		category: 'Governance',
		rows: [
			{
				feature: 'OAuth 2.1',
				tooltip: 'Authenticate users with industry-standard OAuth 2.1 protocol.',
				community: false,
				team: true,
				enterprise: true,
			},
			{
				feature: 'SSO / SAML',
				tooltip: 'Single sign-on with your identity provider. SAML 2.0 support for enterprise IdPs.',
				community: false,
				team: false,
				enterprise: true,
			},
			{
				feature: 'SCIM',
				tooltip: 'Automated user provisioning and deprovisioning from your identity provider.',
				community: false,
				team: false,
				enterprise: true,
			},
			{
				feature: 'RBAC',
				tooltip: 'Role-based access control. Define who can read, write, or admin each project.',
				community: false,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Audit logs',
				tooltip: 'Complete audit trail of every action: who did what, when, on which symbols.',
				community: false,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Policy engine',
				tooltip: 'Define custom policies for code changes. Block risky operations based on configurable rules.',
				community: false,
				team: false,
				enterprise: true,
			},
		],
	},
	{
		category: 'Support',
		rows: [
			{
				feature: 'Community',
				tooltip: 'Slack community, GitHub issues, documentation.',
				community: true,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Standard',
				tooltip: 'Email support with 48h response time. Priority issue routing.',
				community: false,
				team: true,
				enterprise: true,
			},
			{
				feature: 'Premium + SLA',
				tooltip: 'Dedicated support engineer, 4h response SLA, custom onboarding.',
				community: false,
				team: false,
				enterprise: true,
			},
		],
	},
];

function renderCell(value: boolean | string): string {
	if (value === true) {
		return `<svg class="inline-block w-5 h-5" style="color: var(--accent-green);" viewBox="0 0 20 20" fill="none" aria-label="Included">
      <path d="M4 10l4.5 4.5L16 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
	}
	if (value === false) {
		return `<span style="color: var(--text-muted);" aria-label="Not included">—</span>`;
	}
	return `<span style="color: var(--text-secondary);">${value}</span>`;
}
</script>
