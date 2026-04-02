import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import './style.css';

export default {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }) {
		// Components will be registered here in later tasks
	},
} satisfies Theme;
