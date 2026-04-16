import type { HeadConfig, TransformContext } from 'vitepress';
import { faqItems } from '../data/faq';

function jsonLd(schema: Record<string, unknown>): HeadConfig {
	return ['script', { type: 'application/ld+json' }, JSON.stringify(schema)];
}

export function generateSchemaHead({ pageData, title, description }: TransformContext): HeadConfig[] {
	const rawSlug = pageData.relativePath.replace(/\.md$/, '').replace(/(^|\/)index$/, '');
	// Apply the blog/posts/:slug → blog/:slug rewrite for canonical URLs
	const slug = rawSlug.replace(/^blog\/posts\//, 'blog/');
	const url = slug ? `https://astix.io/${slug}` : 'https://astix.io';

	const heads: HeadConfig[] = [
		['link', { rel: 'canonical', href: url }],
		['meta', { property: 'og:title', content: title }],
		['meta', { property: 'og:description', content: description }],
		['meta', { property: 'og:url', content: url }],
		['meta', { property: 'og:image', content: 'https://astix.io/og-image.png' }],
		['meta', { property: 'og:image:width', content: '1200' }],
		['meta', { property: 'og:image:height', content: '630' }],
		['meta', { name: 'twitter:title', content: title }],
		['meta', { name: 'twitter:description', content: description }],
		['meta', { name: 'twitter:image', content: 'https://astix.io/og-image.png' }],
	];

	// Home — SoftwareApplication + Organization + WebSite
	if (pageData.relativePath === 'index.md') {
		heads.push(
			jsonLd({
				'@context': 'https://schema.org',
				'@type': 'SoftwareApplication',
				name: 'astix',
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'Linux, macOS, Windows',
				description: 'Semantic code intelligence for AI coding assistants. 38 languages, 30+ MCP tools.',
				url: 'https://astix.io',
				license: 'https://www.apache.org/licenses/LICENSE-2.0',
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Community edition — free forever' },
			}),
		);
		heads.push(
			jsonLd({
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: 'astix',
				url: 'https://astix.io',
				logo: 'https://astix.io/logo.svg',
				sameAs: ['https://github.com/astix-io/astix'],
			}),
		);
		heads.push(
			jsonLd({
				'@context': 'https://schema.org',
				'@type': 'WebSite',
				name: 'astix',
				url: 'https://astix.io',
				potentialAction: {
					'@type': 'SearchAction',
					target: 'https://astix.io/docs/mcp-tools?q={search_term_string}',
					'query-input': 'required name=search_term_string',
				},
			}),
		);
		heads.push(
			jsonLd({
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: [
					{
						'@type': 'Question',
						name: 'What is astix?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'astix is a self-hosted semantic code intelligence platform that gives AI coding assistants structured access to codebases via the Model Context Protocol (MCP). It replaces raw file reads with AST-level queries — call graphs, data lineage, impact analysis — reducing token consumption by 128x on average.',
						},
					},
					{
						'@type': 'Question',
						name: 'How does astix work?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'astix parses your code with tree-sitter, stores symbols, calls, and imports in PostgreSQL, and optionally embeds symbol signatures into pgvector for semantic search. AI coding assistants query the index through 30+ MCP tools instead of reading raw source files.',
						},
					},
					{
						'@type': 'Question',
						name: 'Which AI coding assistants work with astix?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'Any MCP-compatible client: Claude Code, Cursor, GitHub Copilot, Cline, and any custom agent that speaks the Model Context Protocol. astix exposes itself as a standard MCP server.',
						},
					},
					{
						'@type': 'Question',
						name: 'How many languages does astix support?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: '38 programming languages across 3 tiers. 11 Tier-1 languages (TypeScript, JavaScript, Python, Rust, Go, Java, C#, C, C++, Ruby, Swift) get full call graphs, CFG analysis, and type binding resolution. 22 Tier-2 languages get symbols and imports. 5 Tier-3 languages get symbol extraction.',
						},
					},
					{
						'@type': 'Question',
						name: 'Is astix open source?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'Yes. The core is Apache 2.0 licensed (GitHub: astix-io/astix). Premium features are under Elastic License v2. Self-hosted Free tier is unlimited and free forever.',
						},
					},
				],
			}),
		);
		heads.push(
			jsonLd({
				'@context': 'https://schema.org',
				'@type': 'HowTo',
				name: 'How to install and use astix in under 10 minutes',
				description: 'Set up astix with PostgreSQL, configure the MCP server, register your first project, and query the index from Claude Code, Cursor, or any MCP-compatible agent.',
				totalTime: 'PT10M',
				step: [
					{
						'@type': 'HowToStep',
						position: 1,
						name: 'Start PostgreSQL',
						text: 'Run PostgreSQL 15+ with pgvector and ParadeDB extensions. The recommended Docker image is ghcr.io/oorabona/postgres:18-alpine-full.',
					},
					{
						'@type': 'HowToStep',
						position: 2,
						name: 'Install astix',
						text: 'Run npx @astix/mcp-server init to install the CLI and generate the configuration file.',
					},
					{
						'@type': 'HowToStep',
						position: 3,
						name: 'Add your project',
						text: 'Run astix add-project . in the root of your codebase. astix parses all supported files and builds the AST index.',
					},
					{
						'@type': 'HowToStep',
						position: 4,
						name: 'Start the MCP server',
						text: 'Run astix serve to expose the MCP interface on stdio or HTTP. The output prints the MCP client configuration to copy.',
					},
					{
						'@type': 'HowToStep',
						position: 5,
						name: 'Connect your AI assistant',
						text: 'Paste the printed configuration into Claude Code, Cursor, or any MCP-compatible client. Query the index with search_structural, get_symbol, impact_analysis, and 27 more tools.',
					},
				],
			}),
		);
	}

	// Pricing — FAQPage + Product with offers
	if (pageData.relativePath === 'pricing.md') {
		heads.push(
			jsonLd({
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: faqItems.map((item) => ({
					'@type': 'Question',
					name: item.question,
					acceptedAnswer: { '@type': 'Answer', text: item.answer },
				})),
			}),
		);
		heads.push(
			jsonLd({
				'@context': 'https://schema.org',
				'@type': 'Product',
				name: 'astix',
				description: 'Semantic code intelligence for AI coding assistants. 38 languages, 30+ MCP tools.',
				url: 'https://astix.io/pricing',
				offers: [
					{
						'@type': 'Offer',
						name: 'Free',
						price: '0',
						priceCurrency: 'USD',
						description: 'Self-hosted only. Read-only intelligence. Unlimited LOC, unlimited projects. Free forever.',
					},
					{
						'@type': 'Offer',
						name: 'Solo',
						price: '49',
						priceCurrency: 'USD',
						description: '$49/mo billed annually, or $59/mo monthly. Hosted or self-hosted. Write operations included.',
					},
					{
						'@type': 'Offer',
						name: 'Team',
						price: '299',
						priceCurrency: 'USD',
						description: '$299/mo + $29/seat billed annually. Commercial use license for teams.',
					},
					{
						'@type': 'Offer',
						name: 'Team Monthly',
						price: '359',
						priceCurrency: 'USD',
						description: '$359/mo + $39/seat billed monthly. Commercial use license for teams.',
					},
					{
						'@type': 'Offer',
						name: 'Enterprise',
						description: 'Custom pricing for enterprise deployments. Contact sales@astix.io',
					},
					{
						'@type': 'Offer',
						name: 'Security Solo',
						price: '79',
						priceCurrency: 'USD',
						description: 'Security add-on. Requires Code Intelligence subscription. $79/mo annual or $99/mo monthly.',
					},
					{
						'@type': 'Offer',
						name: 'Security Team',
						price: '399',
						priceCurrency: 'USD',
						description: 'Security add-on for teams. $399/mo flat billed annually or $499/mo monthly.',
					},
				],
			}),
		);
	}

	// og:type — article for blog posts, website for everything else
	const isBlogPost = pageData.relativePath.startsWith('blog/') &&
		!pageData.relativePath.startsWith('blog/authors/') &&
		pageData.relativePath !== 'blog/index.md';
	if (isBlogPost) {
		heads.push(['meta', { property: 'og:type', content: 'article' }]);
	} else {
		heads.push(['meta', { property: 'og:type', content: 'website' }]);
	}

	// Blog posts — BlogPosting schema
	if (isBlogPost) {
		const fm = pageData.frontmatter;
		if (fm.date) {
			heads.push(
				jsonLd({
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: fm.title || title,
					datePublished: fm.date,
					dateModified: fm.date,
					image: fm.image || fm.ogImage || 'https://astix.io/og-image.png',
					author: { '@type': 'Organization', name: 'astix' },
					publisher: { '@type': 'Organization', name: 'astix', logo: 'https://astix.io/logo.svg' },
					description: fm.description || description,
					mainEntityOfPage: url,
				}),
			);
		}
	}

	// Author profile — Person
	if (pageData.relativePath.startsWith('blog/authors/')) {
		heads.push(
			jsonLd({
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: 'Olivier Orabona',
				url: 'https://astix.io/blog/authors/olivier-orabona',
				jobTitle: 'Founder & Lead Developer',
				worksFor: {
					'@type': 'Organization',
					name: 'astix',
				},
				sameAs: [
					'https://github.com/oorabona',
					'https://x.com/oorabona',
					'https://www.linkedin.com/in/olivierorabona/',
				],
				knowsAbout: ['code intelligence', 'cloud architecture', 'cybersecurity', 'MCP protocol', 'tree-sitter'],
			}),
		);
	}

	// Docs — TechArticle
	if (pageData.relativePath.startsWith('docs/')) {
		heads.push(
			jsonLd({
				'@context': 'https://schema.org',
				'@type': 'TechArticle',
				name: title,
				description: description,
				proficiencyLevel: 'Expert',
			}),
		);
	}

	// BreadcrumbList for docs and blog pages
	if (pageData.relativePath.startsWith('docs/') || (pageData.relativePath.startsWith('blog/') && pageData.relativePath !== 'blog/index.md')) {
		const segments = slug.split('/');
		const itemListElement: Array<Record<string, unknown>> = [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://astix.io/' },
		];
		let accumulated = '';
		for (let i = 0; i < segments.length; i++) {
			accumulated += (i === 0 ? '' : '/') + segments[i];
			const isLast = i === segments.length - 1;
			const name = segments[i]
				.replace(/-/g, ' ')
				.replace(/\b\w/g, (c) => c.toUpperCase());
			const listItem: Record<string, unknown> = {
				'@type': 'ListItem',
				position: i + 2,
				name,
			};
			if (!isLast) {
				listItem.item = `https://astix.io/${accumulated}`;
			}
			itemListElement.push(listItem);
		}
		heads.push(
			jsonLd({
				'@context': 'https://schema.org',
				'@type': 'BreadcrumbList',
				itemListElement,
			}),
		);
	}

	return heads;
}
