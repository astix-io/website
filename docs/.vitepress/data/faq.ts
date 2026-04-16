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
			'Yes. The Free self-hosted tier has no LOC cap, no project cap, and no time limit. Index unlimited lines of code across unlimited projects with full read-only intelligence — structural search, call graphs, impact analysis, data lineage, execution paths, dead-code detection. The only thing you manage yourself is the PostgreSQL instance (PostgreSQL 15+ with pgvector and ParadeDB). Use Docker, a managed database (Supabase, Neon, RDS), or bare-metal. No credit card, no trial period, no feature gating on volume.',
	},
	{
		question: 'Can I use the Free tier hosted (without running my own database)?',
		answer:
			'No. Hosted deployment — where astix runs the PostgreSQL instance and the MCP server for you — starts at the Solo plan at $49/mo billed annually (or $59/mo monthly). The Free tier is self-hosted only: you operate PostgreSQL on your own infrastructure. This lets us keep Free genuinely free and unlimited, while hosted plans cover the infrastructure and write-operation safety features you get in Solo.',
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
			'Lines of code are measured as SLOC — source lines of code excluding blank lines and comments. Every file astix indexes contributes to the count, across every project in your workspace. Only files the parser actually processes count; excluded files (via your configured `exclude` patterns or `.astixignore`) do not. LOC limits apply only to paid plans — the Free self-hosted tier has no LOC cap. Usage is visible in the `astix://projects/{name}/stats` resource.',
	},
	{
		question: 'What happens if I exceed my LOC limit?',
		answer:
			'Soft limits only — we never cut you off abruptly. At 100% you get a warning. At 120% a persistent banner appears. At 150% premium features (semantic search, LLM tools) are paused. Structural search and all read operations always remain available.',
	},
	{
		question: 'Can I self-host astix?',
		answer:
			'Yes. Every plan — including Free — can be self-hosted. You run astix on your own infrastructure: PostgreSQL 15+ with pgvector, plus the astix CLI or MCP server via Docker, npm, or a bare-metal install. Self-hosted paid plans cost the same as hosted. Zero code egress on all tiers — your source code stays on your machines. Enterprise deployments support air-gapped environments with offline embedding providers and on-prem LLM configurations.',
	},
	{
		question: 'What is BYOK / BYOM?',
		answer:
			'Bring Your Own Key / Bring Your Own Model. For LLM-powered features (explain_symbol, suggest_tests, fill_descriptions), you supply your own API key (OpenAI, Anthropic, etc.) or run a local model (Ollama). We never proxy your tokens or bill you for LLM usage — those costs go directly to your provider.',
	},
	{
		question: 'What payment methods do you accept?',
		answer:
			'Credit card (Visa, Mastercard, American Express) via Stripe for Solo and Team plans. Wire transfer, ACH, and purchase orders are available for Enterprise contracts. All payments are processed securely by Stripe — we never store card details ourselves. European customers are billed in USD with Stripe automatically handling VAT/tax treatment per your location (EU B2C with VAT, EU B2B with reverse charge).',
	},
	{
		question: 'Do I need to send my code to a third-party service?',
		answer:
			'Never. astix parses and indexes your code locally inside your PostgreSQL database. No code is sent to astix servers — neither in self-hosted nor in hosted deployments, since hosted instances run dedicated PostgreSQL per customer. Optional LLM-powered features (explain_symbol, suggest_tests, fill_descriptions) are BYOK: you supply your provider key, you control which code snippets get sent, and you bill LLM usage directly with your provider. The embedding layer is also BYOK and runs locally by default (Ollama, local transformers).',
	},
	{
		question: 'What PostgreSQL version do I need?',
		answer:
			'PostgreSQL 15 or higher with two extensions: pgvector for vector search (embeddings) and ParadeDB for BM25 full-text search. Works with Docker images (we recommend `ghcr.io/oorabona/postgres:18-alpine-full`), managed cloud databases that expose these extensions (Supabase, Neon, self-managed RDS with custom image), or bare-metal installs. pgvector HNSW indexes are enabled by default for fast nearest-neighbor search. ParadeDB provides BM25 scoring that complements vector similarity in the hybrid search mode.',
	},
	{
		question: 'Can I switch plans or cancel anytime?',
		answer:
			'Yes. Upgrades take effect immediately — you get access to new features and write operations the moment payment processes. Downgrades and cancellations apply at the end of your current billing period: you keep full access until the period ends, then revert to the new plan (or to the Free self-hosted tier on full cancellation). Your indexed projects and configuration persist across plan changes. No cancellation fees, no lock-in. Annual-plan prorations are credited to the next billing cycle.',
	},
	{
		question: 'Do you offer discounts for open-source projects or education?',
		answer:
			'Yes. Open-source maintainers and educational institutions can apply for a free Team seat. Contact us with your project or institution details.',
	},
];
