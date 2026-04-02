export interface FaqItem {
	question: string;
	answer: string;
}

export const faqItems: FaqItem[] = [
	{
		question: 'Is the Community edition really free?',
		answer:
			'Yes, forever. Full read intelligence (search, call graphs, impact analysis, data lineage, execution paths) plus all write tools (rename, patch, insert). stdio MCP, single user. No feature lockdown, no usage limits.',
	},
	{
		question: "What's the difference between Community and Team?",
		answer:
			'Team adds multi-user collaboration: HTTP daemon (shared server), OAuth 2.1 authentication, RBAC, and audit logs. Same intelligence engine, different deployment model.',
	},
	{
		question: 'Can I self-host all tiers?',
		answer:
			'Yes. Every tier runs on your infrastructure. Community is stdio (local), Team is HTTP daemon, Enterprise adds air-gap support. Zero code egress on all tiers.',
	},
	{
		question: 'Do I need to send my code to a third-party service?',
		answer:
			'Never. astix runs entirely on your infrastructure. The optional embedding/LLM features are BYOK — you provide your own API keys or local models.',
	},
	{
		question: 'What PostgreSQL version do I need?',
		answer:
			'PostgreSQL 15 or higher with pgvector extension. Works with any PostgreSQL provider (Docker, managed, self-hosted).',
	},
	{
		question: 'Is there a trial for Team/Enterprise?',
		answer: 'Yes, 14-day free trial for Team. Enterprise evaluations are arranged with our team — contact sales.',
	},
	{
		question: 'Can I switch plans or cancel anytime?',
		answer:
			'Yes. Upgrade/downgrade takes effect immediately. Cancel anytime, you keep access until the end of your billing period.',
	},
	{
		question: 'Do you offer discounts for open-source projects or education?',
		answer:
			'Yes. Open-source maintainers and educational institutions get Team tier free. Contact us with your project/institution details.',
	},
];
