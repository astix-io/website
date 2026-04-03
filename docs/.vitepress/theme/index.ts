import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import BlogPostLayout from './components/BlogPostLayout.vue';
import Layout from './Layout.vue';
import './style.css';

export default {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }) {
		app.component('BlogPostLayout', BlogPostLayout);

		// vue-axe: dev-only a11y overlay
		if (import.meta.env.DEV) {
			import('vue-axe').then((VueAxe) => {
				app.use(VueAxe.default);
			});
		}
	},
} satisfies Theme;
