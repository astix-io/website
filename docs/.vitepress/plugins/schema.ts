import type { HeadConfig, TransformContext } from 'vitepress';
import { faqItems } from '../data/faq';

function jsonLd(schema: Record<string, unknown>): HeadConfig {
	return ['script', { type: 'application/ld+json' }, JSON.stringify(schema)];
}

export function generateSchemaHead({ pageData, title, description }: TransformContext): HeadConfig[] {
	const slug = pageData.relativePath.replace(/\.md$/, '').replace(/(^|\/)index$/, '');
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

	// Home — SoftwareApplication
	if (pageData.relativePath === 'index.md') {
		heads.push(
			jsonLd({
				'@context': 'https://schema.org',
				'@type': 'SoftwareApplication',
				name: 'astix',
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'Linux, macOS, Windows',
				description: 'Self-hosted code intelligence for AI coding agents. 36 languages, 30+ MCP tools.',
				url: 'https://astix.io',
				license: 'https://www.apache.org/licenses/LICENSE-2.0',
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Community edition — free forever' },
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
				description: 'Self-hosted code intelligence for AI coding agents. 36 languages, 30+ MCP tools.',
				url: 'https://astix.io',
				offers: [
					{
						'@type': 'Offer',
						name: 'Community',
						price: '0',
						priceCurrency: 'EUR',
						description: 'Read-only intelligence. Free forever.',
					},
					{
						'@type': 'Offer',
						name: 'Solo',
						price: '12',
						priceCurrency: 'EUR',
						description: 'Write-enabled intelligence for individual developers. €12/month.',
					},
					{
						'@type': 'Offer',
						name: 'Team',
						price: '29',
						priceCurrency: 'EUR',
						description: 'HTTP daemon, shared indexes, OAuth 2.1, RBAC, audit logs.',
					},
					{
						'@type': 'Offer',
						name: 'Enterprise',
						price: '59',
						priceCurrency: 'EUR',
						description: 'SSO/SAML/SCIM, approval workflows, policy engine.',
					},
				],
			}),
		);
	}

	// Blog posts — BlogPosting + og:type article
	if (pageData.relativePath.startsWith('blog/posts/')) {
		const fm = pageData.frontmatter;
		heads.push(['meta', { property: 'og:type', content: 'article' }]);
		if (fm.date) {
			heads.push(
				jsonLd({
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: fm.title || title,
					datePublished: fm.date,
					author: { '@type': 'Organization', name: 'astix' },
					publisher: { '@type': 'Organization', name: 'astix', logo: 'https://astix.io/logo.svg' },
					description: fm.description || description,
					mainEntityOfPage: url,
				}),
			);
		}
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
