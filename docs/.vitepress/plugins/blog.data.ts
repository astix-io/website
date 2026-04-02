import { createContentLoader } from 'vitepress';

export interface Post {
	title: string;
	url: string;
	date: string;
	category: string;
	featured: boolean;
	readingTime: number;
	excerpt: string;
}

declare const data: Post[];

export { data };

export default createContentLoader('blog/posts/*.md', {
	excerpt: true,
	transform(raw): Post[] {
		return raw
			.map(({ url, frontmatter, excerpt }) => ({
				title: frontmatter.title,
				url,
				date: frontmatter.date,
				category: frontmatter.category || 'insights',
				featured: frontmatter.featured || false,
				readingTime: frontmatter.readingTime || 5,
				excerpt: excerpt || '',
			}))
			.sort((a, b) => +new Date(b.date) - +new Date(a.date));
	},
});
