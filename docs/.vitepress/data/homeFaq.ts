export interface HomeFaqItem {
	question: string;
	answer: string;
}

export const homeFaqItems: HomeFaqItem[] = [
	{
		question: 'What is astix?',
		answer: 'astix is a self-hosted semantic code intelligence platform that gives AI coding assistants structured access to codebases via the Model Context Protocol (MCP). It replaces raw file reads with AST-level queries — call graphs, data lineage, impact analysis — reducing token consumption by 128x on average.',
	},
	{
		question: 'How does astix work?',
		answer: 'astix parses your code with tree-sitter, stores symbols, calls, and imports in PostgreSQL, and optionally embeds symbol signatures into pgvector for semantic search. AI coding assistants query the index through 40+ MCP tools instead of reading raw source files.',
	},
	{
		question: 'Which AI coding assistants work with astix?',
		answer: 'Any MCP-compatible client: Claude Code, Cursor, GitHub Copilot, Cline, and any custom agent that speaks the Model Context Protocol. astix exposes itself as a standard MCP server.',
	},
	{
		question: 'How many languages does astix support?',
		answer: '38 programming languages across 3 tiers. 11 Tier-1 languages (TypeScript, JavaScript, Python, Rust, Go, Java, C#, C, C++, Ruby, Swift) get full call graphs, CFG analysis, and type binding resolution. 22 Tier-2 languages get symbols and imports. 5 Tier-3 languages get symbol extraction.',
	},
	{
		question: 'Is astix open source?',
		answer: 'Yes. The core is Apache 2.0 licensed (GitHub: astix-io/astix). Premium features are under Elastic License v2. Self-hosted Free tier is unlimited and free forever.',
	},
];
