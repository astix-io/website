import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitepress';
import { generateSchemaHead } from './plugins/schema';

export default defineConfig({
	title: 'astix',
	description: 'Trustworthy code intelligence for AI coding agents',
	lang: 'en-US',
	cleanUrls: true,
	appearance: false,
	srcExclude: ['superpowers/**'],

	vite: {
		plugins: [tailwindcss()],
	},

	head: [
		['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:site_name', content: 'astix' }],
		['meta', { property: 'og:locale', content: 'en_US' }],
		['meta', { name: 'twitter:card', content: 'summary_large_image' }],
		['meta', { name: 'twitter:image', content: 'https://astix.io/og-image.png' }],
	],

	themeConfig: {
		siteTitle: false,

		nav: [
			{ text: 'Docs', link: '/getting-started' },
			{ text: 'Pricing', link: '/pricing' },
			{ text: 'Blog', link: '/blog/' },
		],

		socialLinks: [{ icon: 'github', link: 'https://github.com/astix-io/astix' }],

		sidebar: {
			'/guide/': [
				{
					text: 'Guide',
					items: [
						{ text: 'Getting Started', link: '/getting-started' },
						{ text: 'MCP Tools', link: '/guide/mcp-tools' },
						{ text: 'Languages', link: '/guide/languages' },
					],
				},
			],
		},

		footer: {
			message: 'Released under the Apache 2.0 License.',
			copyright: `© ${new Date().getFullYear()} astix`,
		},
	},

	sitemap: {
		hostname: 'https://astix.io',
	},

	async transformHead(context) {
		return generateSchemaHead(context);
	},
});
