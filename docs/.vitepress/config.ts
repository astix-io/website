import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitepress';
import { RssPlugin } from 'vitepress-plugin-rss';
import { generateSchemaHead } from './plugins/schema';

export default defineConfig({
	title: 'astix',
	description: 'Semantic code intelligence for AI coding assistants',
	lang: 'en-US',
	cleanUrls: true,
	appearance: false,
	srcExclude: ['superpowers/**', 'blog-ideas-astix.md', 'plans/**'],
	titleTemplate: ':title',

	rewrites: {
		'blog/posts/:slug': 'blog/:slug',
	},

	vite: {
		plugins: [
			tailwindcss(),
			RssPlugin({
				title: 'astix Blog',
				baseUrl: 'https://astix.io',
				copyright: '© 2026 astix',
			}),
		],
		ssr: {
			noExternal: [],
			external: ['mermaid'],
		},
	},

	head: [
		['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
		['meta', { name: 'theme-color', content: '#0b1120' }],
		['link', { rel: 'alternate', type: 'application/rss+xml', title: 'astix Blog', href: 'https://astix.io/feed.rss' }],
		['meta', { property: 'og:site_name', content: 'astix' }],
		['meta', { property: 'og:locale', content: 'en_US' }],
		['meta', { name: 'twitter:card', content: 'summary_large_image' }],
	],

	themeConfig: {
		siteTitle: false,

		nav: [
			{ text: 'Docs', link: '/docs/getting-started' },
			{ text: 'Pricing', link: '/pricing' },
			{ text: 'Blog', link: '/blog/' },
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/astix-io/astix' },
			{
				icon: {
					svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>',
				},
				link: 'https://astix.io/slack',
				ariaLabel: 'Slack',
			},
		],

		sidebar: {
			'/docs/': [
				{
					text: 'Guide',
					items: [
						{ text: 'Getting Started', link: '/docs/getting-started' },
						{ text: 'MCP Tools', link: '/docs/mcp-tools' },
						{ text: 'Languages', link: '/docs/languages' },
					],
				},
			],
		},
	},

	sitemap: {
		hostname: 'https://astix.io',
		transformItems: (items) => {
			const buildTime = new Date().toISOString();
			return items.map((item) => {
				let relPath = new URL(item.url, 'https://astix.io').pathname.replace(/^\//, '').replace(/\/$/, '');
				if (!relPath) relPath = 'index';

				const candidates = [`docs/${relPath}.md`, `docs/${relPath}/index.md`];
				// Reverse the blog/posts rewrite
				if (relPath.startsWith('blog/') && !relPath.startsWith('blog/authors') && relPath !== 'blog') {
					candidates.unshift(`docs/blog/posts/${relPath.slice('blog/'.length)}.md`);
				}

				for (const cand of candidates) {
					const abs = resolve(process.cwd(), cand);
					if (!existsSync(abs)) continue;
					try {
						const iso = execSync(`git log -1 --format=%cI -- "${cand}"`, { encoding: 'utf8' }).trim();
						if (iso) return { ...item, lastmod: iso };
					} catch {
						// git not available or file not tracked — fall through
					}
				}
				return { ...item, lastmod: buildTime };
			});
		},
	},

	async transformHead(context) {
		return generateSchemaHead(context);
	},
});
