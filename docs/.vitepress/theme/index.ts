import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import BlogPostLayout from './components/BlogPostLayout.vue';
import HeroReveal from './components/HeroReveal.vue';
import MermaidDiagram from './components/MermaidDiagram.vue';
import Layout from './Layout.vue';
import './style.css';

export default {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }) {
		app.component('BlogPostLayout', BlogPostLayout);
		app.component('HeroReveal', HeroReveal);
		app.component('MermaidDiagram', MermaidDiagram);

		// vue-axe: dev-only a11y overlay
		if (import.meta.env.DEV) {
			import('vue-axe').then((VueAxe) => {
				app.use(VueAxe.default);
			});
		}
	},
} satisfies Theme;
