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
