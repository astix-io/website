export interface FaqItem {
	question: string;
	answer: string;
}

export const faqItems: FaqItem[] = [
	{
		question: 'Is the Free tier really free forever?',
		answer:
			'Yes. The Free tier is self-hosted only with no time limit. You get full read-only code intelligence — structural search, call graphs, impact analysis, data lineage, execution paths — for unlimited lines of code across unlimited projects. No credit card required. You run PostgreSQL yourself.',
	},
	{
		question: 'Is self-hosted Free really unlimited?',
		answer:
			'Yes. Unlimited lines of code, unlimited projects, read-only access. The only constraint is that you run and maintain the PostgreSQL instance yourself. There are no LOC caps or project limits on the Free self-hosted tier.',
	},
	{
		question: 'Can I use the Free tier hosted (without running my own database)?',
		answer:
			'No. The Free tier is self-hosted only — you manage your own PostgreSQL instance. The entry point for hosted deployment is the Solo plan at $49/mo billed annually (or $59/mo monthly).',
	},
	{
		question: 'Why are write operations paid?',
		answer:
			'Write operations — rename, patch, refactor — are the primary AI coding assistant use case and require additional infrastructure for conflict detection and rollback. The Free tier provides all read and analysis tools (call graphs, semantic search, data lineage, impact analysis) at no cost. Write ops unlock at the Solo plan.',
	},
	{
		question: 'When do I need a Team license?',
		answer:
			'You need a Team license when two or more developers access the same astix instance, or when using astix within an organization for commercial purposes. Solo licenses are for individual developers only. Team plans start at $359/mo + $39/seat (monthly) or $299/mo + $29/seat (annual).',
	},
	{
		question: 'What is the difference between monthly and annual billing?',
		answer:
			'Annual billing saves approximately 17% compared to monthly (equivalent to about 2 free months). Launch offer: sign up for any annual plan before June 24, 2026 and get 3 months free — your first charge comes after the 3-month free period ends.',
	},
	{
		question: 'What is the launch offer?',
		answer:
			'Until June 24, 2026, any new annual plan subscription gets 3 months free. This applies to both Code Intelligence and Security add-on plans. Your billing starts after the 3-month free period. No promo code needed — the offer is applied automatically at checkout.',
	},
	{
		question: 'Can I buy the Security add-on without Code Intelligence?',
		answer:
			'No. Security Analysis requires an active Code Intelligence subscription because it builds on the AST index that Code Intelligence maintains. You can bundle both products for approximately 20% off the combined price — contact us at sales@astix.io to discuss a bundle.',
	},
	{
		question: 'What counts as a line of code?',
		answer:
			'Lines of code (LOC) are measured as SLOC — source lines of code excluding blank lines and comments. All files indexed by astix contribute to the count, across all projects in your workspace.',
	},
	{
		question: 'What happens if I exceed my LOC limit?',
		answer:
			'Soft limits only — we never cut you off abruptly. At 100% you get a warning. At 120% a persistent banner appears. At 150% premium features (semantic search, LLM tools) are paused. Structural search and all read operations always remain available.',
	},
	{
		question: 'Can I self-host astix?',
		answer:
			'Yes. Every plan — including Free — can be self-hosted. You run astix on your own infrastructure (PostgreSQL + Docker). Self-hosted paid plans have the same pricing as hosted. Zero code egress on all tiers.',
	},
	{
		question: 'What is BYOK / BYOM?',
		answer:
			'Bring Your Own Key / Bring Your Own Model. For LLM-powered features (explain_symbol, suggest_tests, fill_descriptions), you supply your own API key (OpenAI, Anthropic, etc.) or run a local model (Ollama). We never proxy your tokens or bill you for LLM usage — those costs go directly to your provider.',
	},
	{
		question: 'What payment methods do you accept?',
		answer:
			'Credit card (Visa, Mastercard, Amex) for Solo and Team. Wire transfer is available for Enterprise. All payments are processed securely — we never store card details.',
	},
	{
		question: 'Do I need to send my code to a third-party service?',
		answer:
			'Never. astix parses and indexes your code locally. Optional LLM features are BYOK — you control which provider receives your code snippets, and only the snippets you explicitly query.',
	},
	{
		question: 'What PostgreSQL version do I need?',
		answer:
			'PostgreSQL 15 or higher with the pgvector and ParadeDB extensions for full-text search. Works with Docker, managed cloud databases (Supabase, Neon, RDS), or bare-metal installs.',
	},
	{
		question: 'Can I switch plans or cancel anytime?',
		answer:
			'Yes. Upgrades take effect immediately. Downgrades and cancellations apply at the end of your current billing period — you keep full access until then.',
	},
	{
		question: 'Do you offer discounts for open-source projects or education?',
		answer:
			'Yes. Open-source maintainers and educational institutions can apply for a free Team seat. Contact us with your project or institution details.',
	},
];
