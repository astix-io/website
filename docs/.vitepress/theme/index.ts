import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		// Components will be registered here in later tasks
	},
} satisfies Theme;
