<template>
  <div class="overflow-x-auto rounded-2xl border" style="border-color: var(--border-muted);">
    <table class="pricing-table w-full text-sm border-collapse">
      <thead class="pricing-thead">
        <tr style="background: var(--bg-card);">
          <th class="text-left py-4 px-6 font-semibold" style="color: var(--text-secondary); width: 40%;">Feature</th>
          <th class="text-center py-4 px-4 font-semibold" style="color: var(--text-primary);">Community</th>
          <th
            class="text-center py-4 px-4 font-semibold team-col"
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
            class="border-t"
            style="border-color: var(--border-subtle);"
          >
            <td class="py-3 px-6" style="color: var(--text-secondary); background: var(--bg-card);">{{ row.feature }}</td>
            <td class="py-3 px-4 text-center" style="background: var(--bg-card);">
              <span v-html="renderCell(row.community)" />
            </td>
            <td class="py-3 px-4 text-center team-col">
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
			{ feature: 'Search (structural + semantic)', community: true, team: true, enterprise: true },
			{ feature: 'Call graphs', community: true, team: true, enterprise: true },
			{ feature: 'Impact analysis', community: true, team: true, enterprise: true },
			{ feature: 'Data lineage', community: true, team: true, enterprise: true },
			{ feature: 'Execution paths', community: true, team: true, enterprise: true },
			{ feature: 'Code health', community: true, team: true, enterprise: true },
		],
	},
	{
		category: 'Write Safety',
		rows: [
			{ feature: 'Rename', community: true, team: true, enterprise: true },
			{ feature: 'Patch / Write', community: true, team: true, enterprise: true },
			{ feature: 'Rollback', community: true, team: true, enterprise: true },
			{ feature: 'Approval workflows', community: false, team: false, enterprise: true },
		],
	},
	{
		category: 'Deployment',
		rows: [
			{ feature: 'stdio (local)', community: true, team: true, enterprise: true },
			{ feature: 'HTTP daemon', community: false, team: true, enterprise: true },
			{ feature: 'Air-gap / on-prem', community: false, team: false, enterprise: true },
		],
	},
	{
		category: 'Governance',
		rows: [
			{ feature: 'OAuth 2.1', community: false, team: true, enterprise: true },
			{ feature: 'SSO / SAML', community: false, team: false, enterprise: true },
			{ feature: 'SCIM', community: false, team: false, enterprise: true },
			{ feature: 'RBAC', community: false, team: true, enterprise: true },
			{ feature: 'Audit logs', community: false, team: true, enterprise: true },
			{ feature: 'Policy engine', community: false, team: false, enterprise: true },
		],
	},
	{
		category: 'Support',
		rows: [
			{ feature: 'Community', community: true, team: true, enterprise: true },
			{ feature: 'Standard', community: false, team: true, enterprise: true },
			{ feature: 'Premium + SLA', community: false, team: false, enterprise: true },
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
