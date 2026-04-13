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
					target: 'https://astix.io/guide/mcp-tools?q={search_term_string}',
					'query-input': 'required name=search_term_string',
				},
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
						name: 'Community',
						price: '0',
						priceCurrency: 'USD',
						description: 'Read-only intelligence. Free forever.',
					},
					{
						'@type': 'Offer',
						name: 'Solo',
						price: '29',
						priceCurrency: 'USD',
						description: 'Write-enabled intelligence for individual developers. $29/month.',
					},
					{
						'@type': 'Offer',
						name: 'Team',
						price: '179',
						priceCurrency: 'USD',
						description: 'HTTP daemon, shared indexes, OAuth 2.1, RBAC, audit logs. $179/month + $20/seat.',
					},
					{
						'@type': 'Offer',
						name: 'Enterprise',
						description: 'Contact us for custom pricing',
					},
				],
			}),
		);
	}

	// og:type — article for blog posts, website for everything else
	if (pageData.relativePath.startsWith('blog/posts/')) {
		heads.push(['meta', { property: 'og:type', content: 'article' }]);
	} else {
		heads.push(['meta', { property: 'og:type', content: 'website' }]);
	}

	// Blog posts — BlogPosting schema
	if (pageData.relativePath.startsWith('blog/posts/')) {
		const fm = pageData.frontmatter;
		if (fm.date) {
			heads.push(
				jsonLd({
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: fm.title || title,
					datePublished: fm.date,
					dateModified: fm.date,
					image: fm.ogImage || 'https://astix.io/og-image.png',
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
	if (pageData.relativePath.startsWith('guide/') || pageData.relativePath === 'getting-started.md') {
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

	return heads;
}
