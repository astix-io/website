export interface FaqItem {
	question: string;
	answer: string;
}

export const faqItems: FaqItem[] = [
	{
		question: 'Is there a free trial?',
		answer:
			'Yes — the Free tier is unlimited in time. You get full read-only intelligence (structural search, call graphs, impact analysis, data lineage, execution paths) for up to 100K lines of code across 3 projects. No credit card required.',
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
			'Yes. Every plan — including Free — can be self-hosted. You run astix on your own infrastructure (PostgreSQL + Docker). Self-hosted plans have slightly different pricing for Team (see the toggle above) and Enterprise. Zero code egress on all tiers.',
	},
	{
		question: 'What is BYOK / BYOM?',
		answer:
			'Bring Your Own Key / Bring Your Own Model. For LLM-powered features (explain_symbol, suggest_tests, fill_descriptions), you supply your own API key (OpenAI, Anthropic, etc.) or run a local model (Ollama). We never proxy your tokens or bill you for LLM usage — those costs go directly to your provider.',
	},
	{
		question: 'Do you offer annual billing?',
		answer:
			'Annual billing is coming soon, with approximately 20% off compared to monthly. Join the mailing list to be notified when it launches.',
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
