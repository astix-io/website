# astix.io Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the astix.io marketing site and documentation using VitePress + Tailwind CSS, deployable on Cloudflare Pages.

**Architecture:** VitePress SSG with custom Vue 3 theme extending the default theme. Tailwind CSS for styling with CSS custom properties for dark/light theming. Canvas 2D shader components for hero background and animated logo. Blog system via VitePress data loaders.

**Tech Stack:** VitePress 1.x, Vue 3, Tailwind CSS 4.x, TypeScript, Canvas 2D API, wrangler (CF Pages deploy)

**Spec:** `docs/superpowers/specs/2026-04-02-website-design.md`

**Review applied:** 28 findings from Copilot + Claude review (2026-04-02). All CRITICAL and HIGH issues fixed in this plan revision:
- C1: Tailwind v4 CSS-first config (`@theme` instead of `tailwind.config.ts`)
- C2: Blog data loader renamed to `blog.data.ts`
- C3: VitePress `appearance: false` + custom `data-theme` toggle
- C4: Fonts self-hosted via fontsource (no `@import url()` ordering issue)
- H1: Features section added to landing page
- H2: FAQ JSON-LD moved to server-side `schema.ts`
- H3: SocialProof interval cleanup added
- H4: RSS feed noted in blog.data.ts responsibility
- H5: HeroShader Intersection Observer added
- H6: `twitter:image` added to head
- H7: `logo: false` removed (invalid TS type)
- M1: Sidebar links to non-existent pages removed
- M2: All page schemas added to `schema.ts`
- M4: TerminalDemo reactivity fix (array index mutation)
- M9: Skip-to-content link added to Layout
- M11: Dynamic copyright year
- M12: Fonts self-hosted via fontsource
- C5: `schema.ts` async import fix (static import instead)
- C6: PricingFaq import path corrected (`../../data/faq`)
- H8: Canonical URL missing `/` prefix fixed
- H9: Landing components lazy-loaded (not globally registered)
- H10: Schema.org Organization, Product+Offers, Blog index, og:type=article added
- M13: RSS feed generation via VitePress `buildEnd` hook
- M14: Pricing config frontmatter-driven

---

## File Map

### Foundation
| File | Responsibility |
|------|---------------|
| `package.json` | Dependencies, scripts |
| `docs/.vitepress/config.ts` | VitePress config: nav, sidebar, head, sitemap |
| `docs/.vitepress/theme/index.ts` | Custom theme registration |
| `docs/.vitepress/theme/style.css` | Tailwind directives + `@theme` tokens (dark/light) |
| `docs/.vitepress/theme/Layout.vue` | Custom layout: top stripe, shader, skip-to-content, footer |
| `tsconfig.json` | TypeScript config |

### Components
| File | Responsibility |
|------|---------------|
| `docs/.vitepress/theme/components/HeroShader.vue` | Full-page call graph Canvas 2D |
| `docs/.vitepress/theme/components/LogoRefraction.vue` | Animated diamond header logo (36px canvas) |
| `docs/.vitepress/theme/components/TerminalDemo.vue` | Typing animation terminal |
| `docs/.vitepress/theme/components/SocialProof.vue` | Toggleable testimonials + logo strip |
| `docs/.vitepress/theme/components/NumbersBar.vue` | Stats with count-up on scroll |
| `docs/.vitepress/theme/components/PricingCards.vue` | Cards + monthly/annual toggle |
| `docs/.vitepress/theme/components/PricingTable.vue` | Feature comparison table |
| `docs/.vitepress/theme/components/PricingFaq.vue` | Accordion FAQ + schema.org JSON-LD |
| `docs/.vitepress/theme/components/BlogIndex.vue` | Blog grid + category filters |
| `docs/.vitepress/theme/components/ToolSearch.vue` | Fuzzy search for MCP tools |

### Pages
| File | Responsibility |
|------|---------------|
| `docs/index.md` | Landing page |
| `docs/getting-started.md` | Quick start guide |
| `docs/pricing.md` | Pricing page |
| `docs/guide/mcp-tools.md` | MCP tools reference |
| `docs/guide/languages.md` | Language support table |
| `docs/blog/index.md` | Blog index |

### SEO & Infra
| File | Responsibility |
|------|---------------|
| `docs/.vitepress/plugins/schema.ts` | JSON-LD injection build transform (all page types + FAQ) |
| `docs/.vitepress/plugins/blog.data.ts` | Blog data loader + RSS generation |
| `docs/.vitepress/data/faq.ts` | FAQ data (shared: accordion + JSON-LD) |
| `docs/public/robots.txt` | Robots + sitemap ref |
| `docs/public/favicon.svg` | AST diamond favicon |
| `docs/public/logo.svg` | Full logo for schema.org publisher |
| `.github/workflows/deploy.yml` | Build + deploy to CF Pages on main |
| `.github/workflows/preview.yml` | Preview deploy on PR |

---

## Phase 1: Foundation

### Task 1: Project scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`

- [ ] **Step 1: Initialize package.json**

```json
{
  "name": "@astix/website",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
pnpm add -D vitepress vue typescript @tailwindcss/vite tailwindcss \
  @fontsource-variable/ibm-plex-sans @fontsource-variable/jetbrains-mono \
  vitepress-plugin-rss vite-plugin-image-optimizer \
  unplugin-vue-components vitepress-plugin-llms \
  @nolebase/vitepress-plugin-git-changelog \
  @nolebase/vitepress-plugin-og-image \
  vitepress-plugin-mermaid vue-axe schema-dts
```

Expected: lockfile created, node_modules populated.

**Packages rationale:**
- Fonts: self-hosted via fontsource (zero Google CDN — consistent with "zero egress" brand)
- `vitepress-plugin-rss`: RSS feed generation for blog (replaces custom code)
- `vite-plugin-image-optimizer`: auto compress images at build (Core Web Vitals)
- `unplugin-vue-components`: auto-import Vue components (no manual `app.component()`)
- `vitepress-plugin-llms`: generates `llms.txt` (meta for an AI agent tool)
- `@nolebase/vitepress-plugin-git-changelog`: "Last updated" + contributors on doc/blog pages
- `@nolebase/vitepress-plugin-og-image`: auto-generate OG images per page
- `vitepress-plugin-mermaid`: Mermaid diagrams in markdown (useful for tools ref / architecture docs)
- `vue-axe`: runtime a11y checking in dev mode (no ESLint conflict with Biome)
- `schema-dts`: TypeScript types for Schema.org JSON-LD (type-safe structured data)

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "noEmit": true,
    "paths": {
      "@theme/*": ["./docs/.vitepress/theme/*"]
    }
  },
  "include": ["docs/.vitepress/**/*.ts", "docs/.vitepress/**/*.vue"]
}
```

- [ ] **Step 4: Update .gitignore**

Append to existing `.gitignore`:
```
.superpowers/
```

- [ ] **Step 5: Verify build**

Run: `pnpm build`

Expected: Build succeeds (empty site, no pages yet). Output in `docs/.vitepress/dist/`.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml tsconfig.json .gitignore
git commit -m "feat: scaffold VitePress + Tailwind project"
```

---

### Task 2: Design tokens + custom theme

**Files:**
- Create: `docs/.vitepress/theme/style.css`
- Create: `docs/.vitepress/theme/index.ts`

- [ ] **Step 1: Create style.css with design tokens**

```css
/* Fonts — self-hosted via fontsource (zero egress, GDPR-safe) */
@import "@fontsource-variable/ibm-plex-sans";
@import "@fontsource-variable/jetbrains-mono";

@import "tailwindcss";

/* Tailwind v4: dark mode via custom variant on data-theme attribute */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* Tailwind v4: theme tokens via @theme (replaces tailwind.config.ts) */
@theme {
  --font-sans: "IBM Plex Sans Variable", system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, monospace;
  --color-accent-blue: var(--accent-blue);
  --color-accent-purple: var(--accent-purple);
  --color-accent-green: var(--accent-green);
  --color-surface-deep: var(--bg-deep);
  --color-surface-card: var(--bg-card);
}

/* ===== DESIGN TOKENS ===== */
:root {
  --transition: 0.35s ease;
}

[data-theme="dark"],
:root {
  --bg-deep: #0b1120;
  --bg-surface: rgba(11, 17, 32, 0.7);
  --bg-card: #1b2336;
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-muted: rgba(255, 255, 255, 0.1);
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent-blue: #3b82f6;
  --accent-purple: #8b5cf6;
  --accent-green: #22c55e;
  --badge-bg: rgba(59, 130, 246, 0.1);
  --badge-border: rgba(59, 130, 246, 0.2);
  --cmd-bg: rgba(255, 255, 255, 0.04);
  --cmd-border: rgba(255, 255, 255, 0.08);
  --btn-secondary-bg: rgba(255, 255, 255, 0.06);
  --btn-secondary-border: rgba(255, 255, 255, 0.1);
}

[data-theme="light"] {
  --bg-deep: #f8fafc;
  --bg-surface: rgba(255, 255, 255, 0.8);
  --bg-card: #ffffff;
  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-muted: rgba(0, 0, 0, 0.1);
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --accent-blue: #2563eb;
  --accent-purple: #7c3aed;
  --accent-green: #16a34a;
  --badge-bg: rgba(37, 99, 235, 0.08);
  --badge-border: rgba(37, 99, 235, 0.2);
  --cmd-bg: rgba(0, 0, 0, 0.03);
  --cmd-border: rgba(0, 0, 0, 0.08);
  --btn-secondary-bg: rgba(0, 0, 0, 0.04);
  --btn-secondary-border: rgba(0, 0, 0, 0.12);
}

/* ===== OVERRIDE VITEPRESS DEFAULTS ===== */
:root {
  --vp-c-brand-1: var(--accent-blue);
  --vp-c-brand-2: var(--accent-purple);
  --vp-font-family-base: "IBM Plex Sans", system-ui, sans-serif;
  --vp-font-family-mono: "JetBrains Mono", ui-monospace, monospace;
}

/* ===== GLOBAL ===== */
body {
  background: var(--bg-deep);
  color: var(--text-primary);
  transition: background var(--transition), color var(--transition);
}

/* ===== TOP STRIPE ===== */
.top-stripe {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 200;
  background: linear-gradient(
    90deg,
    #3b82f6,
    #8b5cf6,
    #ec4899,
    #8b5cf6,
    #3b82f6
  );
  background-size: 200% 100%;
  animation: stripe 4s linear infinite;
}

@keyframes stripe {
  to {
    background-position: -200% 0;
  }
}

/* ===== GRADIENT TEXT ===== */
.gradient-text {
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ===== BUTTONS ===== */
.btn-primary {
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  color: #fff;
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--btn-secondary-bg);
  border: 1px solid var(--btn-secondary-border);
  color: var(--text-primary);
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition),
    color var(--transition);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-secondary:hover {
  background: var(--btn-secondary-border);
}
```

- [ ] **Step 2: Create theme/index.ts**

```ts
import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Components will be registered here in later tasks
  },
} satisfies Theme;
```

- [ ] **Step 3: Verify dev server**

Run: `pnpm dev`

Expected: Dev server starts. Browser shows VitePress default page with custom fonts loaded and dark background.

- [ ] **Step 4: Commit**

```bash
git add docs/.vitepress/theme/
git commit -m "feat: add design tokens and custom theme"
```

---

### Task 3: VitePress config + Layout shell

**Files:**
- Create: `docs/.vitepress/config.ts`
- Create: `docs/.vitepress/theme/Layout.vue`
- Create: `docs/index.md` (minimal placeholder)
- Create: `docs/public/favicon.svg`
- Create: `docs/public/robots.txt`

- [ ] **Step 1: Create config.ts**

```ts
import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";
import imageOptimizer from "vite-plugin-image-optimizer";
import Components from "unplugin-vue-components/vite";
import { withMermaid } from "vitepress-plugin-mermaid";
import { RSSOptions, RssPlugin } from "vitepress-plugin-rss";
import llmsPlugin from "vitepress-plugin-llms";
import { GitChangelog, GitChangelogMarkdownSection } from "@nolebase/vitepress-plugin-git-changelog/vite";

const RSS_OPTIONS: RSSOptions = {
  title: "astix Blog",
  baseUrl: "https://astix.io",
  copyright: "© astix",
};

export default withMermaid(defineConfig({
  title: "astix",
  description: "Trustworthy code intelligence for AI coding agents",
  lang: "en-US",
  cleanUrls: true,
  appearance: false, // Custom theme toggle via data-theme attribute

  vite: {
    plugins: [
      tailwindcss(),
      imageOptimizer({ png: { quality: 80 }, jpeg: { quality: 80 } }),
      Components({ dirs: ["docs/.vitepress/theme/components"] }),
      GitChangelog({ repoURL: "https://github.com/astix-io/website" }),
      GitChangelogMarkdownSection(),
      RssPlugin(RSS_OPTIONS),
      llmsPlugin(),
    ],
  },

  head: [
    ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    // OpenGraph defaults
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "astix" }],
    ["meta", { property: "og:locale", content: "en_US" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:image", content: "https://astix.io/og-image.png" }],
  ],

  themeConfig: {
    siteTitle: false, // Hidden — custom header renders LogoRefraction + wordmark

    nav: [
      { text: "Docs", link: "/getting-started" },
      { text: "Pricing", link: "/pricing" },
      { text: "Blog", link: "/blog/" },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/astix-io/astix" },
      { icon: "slack", link: "https://astix.io/slack" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Getting Started", link: "/getting-started" },
            { text: "MCP Tools", link: "/guide/mcp-tools" },
            { text: "Languages", link: "/guide/languages" },
          ],
        },
      ],
    },

    footer: {
      message: "Released under the Apache 2.0 License.",
      copyright: `© ${new Date().getFullYear()} astix`,
    },
  },

  sitemap: {
    hostname: "https://astix.io",
  },
});
```

- [ ] **Step 2: Create Layout.vue**

```vue
<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";

const { Layout } = DefaultTheme;
const { frontmatter } = useData();
</script>

<template>
  <div class="top-stripe" />
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-[300] focus:bg-[var(--bg-deep)] focus:p-3 focus:text-[var(--accent-blue)]">
    Skip to content
  </a>
  <Layout>
    <template #layout-top>
      <!-- Shader + custom header injected in later tasks -->
    </template>
    <template #doc-before>
      <div id="main-content" />
    </template>
  </Layout>
</template>
```

- [ ] **Step 3: Register Layout in theme/index.ts**

Update `docs/.vitepress/theme/index.ts`:

```ts
import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import Layout from "./Layout.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // Components will be registered here in later tasks
  },
} satisfies Theme;
```

- [ ] **Step 4: Create minimal landing page**

`docs/index.md`:
```md
---
layout: home
title: astix — Code intelligence for AI agents
description: Self-hosted code intelligence for AI coding agents. 36 languages, 30+ MCP tools.
---
```

- [ ] **Step 5: Create favicon.svg**

`docs/public/favicon.svg` — AST diamond: diamond outline with tree nodes inside.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <polygon points="32,4 60,32 32,60 4,32" stroke="url(#g)" stroke-width="2.5" fill="none"/>
  <circle cx="32" cy="18" r="3" fill="#3B82F6"/>
  <circle cx="22" cy="32" r="2.5" fill="#6366F1"/>
  <circle cx="42" cy="32" r="2.5" fill="#6366F1"/>
  <circle cx="16" cy="44" r="2" fill="#8B5CF6"/>
  <circle cx="30" cy="44" r="2" fill="#8B5CF6"/>
  <circle cx="42" cy="44" r="2" fill="#8B5CF6"/>
  <circle cx="50" cy="44" r="2" fill="#8B5CF6"/>
  <line x1="32" y1="21" x2="22" y2="29.5" stroke="#4F46E5" stroke-width="1.2" opacity="0.7"/>
  <line x1="32" y1="21" x2="42" y2="29.5" stroke="#4F46E5" stroke-width="1.2" opacity="0.7"/>
  <line x1="22" y1="34.5" x2="16" y2="42" stroke="#6366F1" stroke-width="1" opacity="0.5"/>
  <line x1="22" y1="34.5" x2="30" y2="42" stroke="#6366F1" stroke-width="1" opacity="0.5"/>
  <line x1="42" y1="34.5" x2="42" y2="42" stroke="#6366F1" stroke-width="1" opacity="0.5"/>
  <line x1="42" y1="34.5" x2="50" y2="42" stroke="#6366F1" stroke-width="1" opacity="0.5"/>
</svg>
```

- [ ] **Step 6: Create robots.txt**

`docs/public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://astix.io/sitemap.xml
```

- [ ] **Step 7: Verify**

Run: `pnpm dev`

Expected: Site loads with top gradient stripe, dark background, custom fonts, VitePress default home layout. Favicon visible in browser tab.

- [ ] **Step 8: Commit**

```bash
git add docs/.vitepress/config.ts docs/.vitepress/theme/ docs/index.md docs/public/
git commit -m "feat: add VitePress config, layout shell, favicon"
```

---

## Phase 2: Landing Page Components

### Task 4: HeroShader component

**Files:**
- Create: `docs/.vitepress/theme/components/HeroShader.vue`

This is the full-page call graph Canvas 2D animation. Port the optimized shader from the brainstorm session (file `07-shader-v3.html`) into a Vue 3 component.

- [ ] **Step 1: Create HeroShader.vue**

The component must implement:
- 70 nodes with hub/mid/leaf types, spread in diamond-biased distribution
- Pre-computed connections at init (hub: 5, mid: 3, leaf: 1)
- Quadratic bezier curves for connections (organic feel)
- Dashed overlay on hub connections
- Data pulses traveling along edges
- Ghost diamond outline at low opacity
- Mouse proximity acceleration: 250px radius, 3x max, quadratic falloff, lerp 0.06
- Base speed calm, reactive near cursor
- Theme-reactive: watches `data-theme` attribute, recomputes colors
- DPR capped at 1.5
- `prefers-reduced-motion`: show static snapshot
- Glow only on hub nodes, additive composite
- Color cache for hsla/rgba to avoid per-frame string allocation
- ResizeObserver for responsive canvas

Reference implementation: `docs/superpowers/specs/2026-04-02-website-design.md` section "Shader Background" and brainstorm file `.superpowers/brainstorm/307977-1775131214/content/07-shader-v3.html` (the `<script>` section for the hero shader).

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";

const canvas = ref<HTMLCanvasElement>();

// Port the full hero shader code from the brainstorm prototype:
// - initCanvas with DPR 1.5 cap
// - Node class with hub/mid/leaf, reactMult
// - Pre-computed connections
// - Color cache (hsla/rgba)
// - Smoothed mouse tracking
// - getThemeColors() reading from data-theme attribute
// - animate() loop with:
//   1. Mouse proximity → per-node reactMult (lerp 0.06)
//   2. Bezier connections (solid + dashed hub overlay)
//   3. Data pulses
//   4. Glow (additive, hubs only)
//   5. Node dots
//   6. Ghost diamond outline
// - prefers-reduced-motion check → static render

// Full implementation: extract the complete <script> content from
// .superpowers/brainstorm/307977-1775131214/content/07-shader-v3.html
// (hero shader IIFE) and adapt to Vue 3 composition API:
// - Replace getElementById with template ref
// - Use onMounted/onUnmounted for lifecycle
// - Use ResizeObserver instead of window resize event
// - MutationObserver on documentElement for theme changes

const reducedMotion = ref(false);

onMounted(() => {
  reducedMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  // ... init and start animation loop
});

onUnmounted(() => {
  // ... cleanup: cancel RAF, disconnect observers
});
</script>

<template>
  <canvas
    ref="canvas"
    class="absolute inset-0 h-full w-full"
    aria-hidden="true"
  />
</template>
```

The implementer agent MUST read `.superpowers/brainstorm/307977-1775131214/content/07-shader-v3.html` and port the hero shader JavaScript into this Vue component. The exact animation logic is in that file — do not reinvent it.

**IMPORTANT (from review):**
- Add `IntersectionObserver` to pause animation when hero scrolls out of view (perf)
- Wrap `<HeroShader>` in `<ClientOnly>` in the landing page (SSR compat)
- The component already handles `prefers-reduced-motion` — verify it renders one static frame then stops

- [ ] **Step 2: Verify in isolation**

Temporarily add to `docs/index.md`:
```md
<script setup>
import HeroShader from './.vitepress/theme/components/HeroShader.vue'
</script>

<div style="position:relative;height:100vh">
  <HeroShader />
</div>
```

Run: `pnpm dev`

Expected: Full-page animated call graph visible. Mouse interaction works. Theme toggle changes colors.

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/HeroShader.vue
git commit -m "feat: add HeroShader call graph canvas component"
```

---

### Task 5: LogoRefraction component

**Files:**
- Create: `docs/.vitepress/theme/components/LogoRefraction.vue`

Animated diamond logo for the header. 36x36px canvas with faceted diamond and color-shifting facets.

- [ ] **Step 1: Create LogoRefraction.vue**

Port the header logo animation from `.superpowers/brainstorm/307977-1775131214/content/07-shader-v3.html` (the logo IIFE section).

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const canvas = ref<HTMLCanvasElement>();
let raf: number;

onMounted(() => {
  const el = canvas.value!;
  const ctx = el.getContext("2d")!;
  const s = 36;
  let t = 0;

  // 2x for retina
  el.width = 72;
  el.height = 72;

  function getThemeColors() {
    const isDark =
      document.documentElement.getAttribute("data-theme") !== "light";
    return {
      facetSat: isDark ? 75 : 65,
      facetLight: isDark ? 52 : 45,
      borderColor: isDark ? [255, 255, 255] : [0, 0, 0],
      borderAlpha: isDark ? 0.18 : 0.3,
      highlightAlpha: isDark ? 0.3 : 0.45,
    };
  }

  function animate() {
    t += 0.025;
    ctx.clearRect(0, 0, 72, 72);
    ctx.save();
    ctx.scale(2, 2);

    const theme = getThemeColors();
    const cx = s / 2;
    const cy = s / 2;
    const sz = 13;

    const pts: [number, number][] = [
      [cx, cy - sz],
      [cx + sz * 0.85, cy],
      [cx, cy + sz],
      [cx - sz * 0.85, cy],
      [cx, cy],
    ];

    const facets: [number, number, number, number, number][] = [
      [0, 1, 4, 220 + Math.sin(t) * 15, 0.55 + Math.sin(t) * 0.12],
      [1, 2, 4, 250 + Math.cos(t) * 15, 0.45 + Math.cos(t) * 0.1],
      [2, 3, 4, 240 + Math.sin(t + 1) * 15, 0.4 + Math.sin(t + 1) * 0.08],
      [3, 0, 4, 230 + Math.cos(t + 1) * 15, 0.5 + Math.cos(t + 1) * 0.1],
    ];

    for (const [a, b, c, h, alpha] of facets) {
      ctx.beginPath();
      ctx.moveTo(pts[a][0], pts[a][1]);
      ctx.lineTo(pts[b][0], pts[b][1]);
      ctx.lineTo(pts[c][0], pts[c][1]);
      ctx.closePath();
      ctx.fillStyle = `hsla(${h | 0},${theme.facetSat}%,${theme.facetLight}%,${alpha.toFixed(2)})`;
      ctx.fill();
    }

    const [lr, lg, lb] = theme.borderColor;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < 4; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.strokeStyle = `rgba(${lr},${lg},${lb},${(theme.borderAlpha + Math.sin(t * 0.8) * 0.08).toFixed(2)})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Highlight edge (top-right)
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    ctx.lineTo(pts[1][0], pts[1][1]);
    ctx.strokeStyle = `rgba(${lr},${lg},${lb},${(theme.highlightAlpha + Math.sin(t) * 0.12).toFixed(2)})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
    raf = requestAnimationFrame(animate);
  }

  // Respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    t = 0;
    animate();
    cancelAnimationFrame(raf);
  } else {
    animate();
  }
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
});
</script>

<template>
  <canvas
    ref="canvas"
    width="72"
    height="72"
    class="h-9 w-9"
    aria-hidden="true"
  />
</template>
```

- [ ] **Step 2: Verify**

Add temporarily to Layout.vue or test in dev. The animated diamond should render at 36x36px with smooth color shifts.

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/LogoRefraction.vue
git commit -m "feat: add LogoRefraction animated header logo"
```

---

### Task 6: TerminalDemo component

**Files:**
- Create: `docs/.vitepress/theme/components/TerminalDemo.vue`

- [ ] **Step 1: Create TerminalDemo.vue**

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Command {
  input: string;
  output: string[];
}

const commands: Command[] = [
  {
    input: 'astix search_structural "handlePayment"',
    output: [
      "→ 3 results in 12ms",
      "",
      "  src/payments/handler.ts:42  handlePayment()",
      "  src/checkout/service.ts:18  handlePayment()",
      "  src/api/routes.ts:95       handlePayment()",
    ],
  },
  {
    input: 'astix impact_analysis "handlePayment" --depth 3',
    output: [
      "→ 14 affected symbols, risk: HIGH",
      "",
      "  ├── PaymentController.process     (direct caller)",
      "  ├── OrderService.checkout          (transitive, depth 2)",
      "  ├── CartMiddleware.validate        (transitive, depth 2)",
      "  └── ... 11 more symbols",
    ],
  },
  {
    input: 'astix data_lineage "paymentAmount" --cross-function',
    output: [
      "→ Traced through 4 functions",
      "",
      "  req.body.amount",
      "    → validateAmount(amount)     src/validation.ts:12",
      "    → processPayment(validated)  src/payments/handler.ts:45",
      "    → db.insert(record)          src/payments/repo.ts:28",
    ],
  },
];

const displayLines = ref<{ text: string; type: "prompt" | "output" | "empty" }[]>([]);
const containerRef = ref<HTMLElement>();
let timeoutId: number;
let observer: IntersectionObserver;
let isVisible = false;

function sleep(ms: number) {
  return new Promise<void>((r) => {
    timeoutId = window.setTimeout(r, ms);
  });
}

async function typeCommand(cmd: Command) {
  // Type input character by character
  displayLines.value.push({ text: "$ ", type: "prompt" as const });
  const idx = displayLines.value.length - 1;

  for (let i = 0; i < cmd.input.length; i++) {
    displayLines.value[idx] = { text: "$ " + cmd.input.slice(0, i + 1), type: "prompt" };
    await sleep(35);
  }

  await sleep(300);

  // Show output lines
  for (const line of cmd.output) {
    displayLines.value.push({
      text: line,
      type: line === "" ? "empty" : "output",
    });
    await sleep(60);
  }
}

async function runLoop() {
  while (isVisible) {
    displayLines.value = [];
    for (const cmd of commands) {
      if (!isVisible) return;
      await typeCommand(cmd);
      await sleep(2000);
    }
    await sleep(3000);
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        isVisible = true;
        runLoop();
      } else if (!entry.isIntersecting) {
        isVisible = false;
        clearTimeout(timeoutId);
      }
    },
    { threshold: 0.3 }
  );
  if (containerRef.value) observer.observe(containerRef.value);
});

onUnmounted(() => {
  isVisible = false;
  clearTimeout(timeoutId);
  observer?.disconnect();
});
</script>

<template>
  <div
    ref="containerRef"
    class="mx-auto max-w-2xl overflow-hidden rounded-xl border"
    style="
      border-color: var(--border-muted);
      background: var(--bg-card);
    "
  >
    <!-- Title bar -->
    <div
      class="flex items-center gap-2 px-4 py-3"
      style="border-bottom: 1px solid var(--border-subtle)"
    >
      <span class="h-3 w-3 rounded-full bg-red-500/60" />
      <span class="h-3 w-3 rounded-full bg-yellow-500/60" />
      <span class="h-3 w-3 rounded-full bg-green-500/60" />
      <span
        class="ml-2 font-mono text-xs"
        style="color: var(--text-muted)"
      >
        astix — terminal
      </span>
    </div>
    <!-- Content -->
    <div class="min-h-[280px] p-5 font-mono text-sm leading-relaxed">
      <div
        v-for="(line, i) in displayLines"
        :key="i"
        :class="{
          'text-[var(--accent-blue)]': line.type === 'prompt',
          'text-[var(--text-secondary)]': line.type === 'output',
          'h-4': line.type === 'empty',
        }"
      >
        <span v-if="line.type === 'prompt'" style="color: var(--accent-green)">$</span>
        {{ line.type === "prompt" ? line.text.slice(2) : line.text }}
      </div>
      <span
        class="inline-block h-4 w-2 animate-pulse"
        style="background: var(--accent-blue)"
      />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify**

Test in dev server. Terminal should type commands, show results, loop. Pauses when scrolled out of view.

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/TerminalDemo.vue
git commit -m "feat: add TerminalDemo animated terminal component"
```

---

### Task 7: SocialProof, NumbersBar components

**Files:**
- Create: `docs/.vitepress/theme/components/SocialProof.vue`
- Create: `docs/.vitepress/theme/components/NumbersBar.vue`

- [ ] **Step 1: Create SocialProof.vue**

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  enabled: boolean;
}>();

// Placeholder data — replace with real testimonials
const testimonials = [
  {
    quote:
      "astix gave our agents the context they were missing. Refactoring a 200-file monorepo went from scary to safe.",
    author: "Engineering Lead",
    company: "Series B Startup",
  },
  {
    quote:
      "We tried Sourcegraph, LSP, grep — nothing gave agents cross-repo understanding like astix does.",
    author: "Staff Engineer",
    company: "Platform Company",
  },
  {
    quote:
      "Self-hosted, zero egress. That's what sold our security team. The intelligence is just a bonus.",
    author: "CTO",
    company: "Fintech",
  },
];

const current = ref(0);
let interval: number;

onMounted(() => {
  if (props.enabled) {
    interval = window.setInterval(() => {
      current.value = (current.value + 1) % testimonials.length;
    }, 5000);
  }
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <section v-if="enabled" class="mx-auto max-w-4xl px-6 py-20 text-center">
    <!-- Logo strip placeholder -->
    <div class="mb-12 flex items-center justify-center gap-10 opacity-40">
      <div
        v-for="i in 5"
        :key="i"
        class="h-8 w-24 rounded"
        style="background: var(--border-muted)"
      />
    </div>
    <!-- Testimonial carousel -->
    <blockquote class="relative">
      <p
        class="mx-auto max-w-xl text-lg italic leading-relaxed"
        style="color: var(--text-secondary)"
      >
        "{{ testimonials[current].quote }}"
      </p>
      <footer class="mt-4">
        <span class="font-semibold" style="color: var(--text-primary)">
          {{ testimonials[current].author }}
        </span>
        <span style="color: var(--text-muted)">
          , {{ testimonials[current].company }}
        </span>
      </footer>
    </blockquote>
    <!-- Dots -->
    <div class="mt-6 flex justify-center gap-2">
      <button
        v-for="(_, i) in testimonials"
        :key="i"
        class="h-2 w-2 rounded-full transition-colors"
        :style="{
          background:
            i === current ? 'var(--accent-blue)' : 'var(--border-muted)',
        }"
        :aria-label="`Testimonial ${i + 1}`"
        @click="current = i"
      />
    </div>
  </section>
</template>
```

- [ ] **Step 2: Create NumbersBar.vue**

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const stats = [
  { value: 5000, suffix: "+", label: "tests" },
  { value: 36, suffix: "", label: "languages" },
  { value: 30, suffix: "+", label: "MCP tools" },
  { value: 0, suffix: "", label: "Apache 2.0", isText: true },
];

const displayed = ref(stats.map(() => 0));
const container = ref<HTMLElement>();
let observer: IntersectionObserver;
let animated = false;

function animateCount(index: number, target: number, duration: number) {
  const start = performance.now();
  function tick(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    displayed.value[index] = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach((s, i) => {
          if (!s.isText) animateCount(i, s.value, 1500 + i * 200);
        });
      }
    },
    { threshold: 0.5 }
  );
  if (container.value) observer.observe(container.value);
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
  <div
    ref="container"
    class="flex flex-wrap items-center justify-center gap-8 py-16 md:gap-16"
    style="border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle)"
  >
    <div v-for="(stat, i) in stats" :key="i" class="text-center">
      <div class="font-mono text-3xl font-bold" style="color: var(--text-primary)">
        <template v-if="stat.isText">{{ stat.label }}</template>
        <template v-else>{{ displayed[i] }}{{ stat.suffix }}</template>
      </div>
      <div
        v-if="!stat.isText"
        class="mt-1 text-sm"
        style="color: var(--text-secondary)"
      >
        {{ stat.label }}
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/SocialProof.vue docs/.vitepress/theme/components/NumbersBar.vue
git commit -m "feat: add SocialProof and NumbersBar components"
```

---

### Task 8: Landing page assembly

**Files:**
- Modify: `docs/.vitepress/theme/index.ts` (register components)
- Modify: `docs/.vitepress/theme/Layout.vue` (integrate shader for home)
- Modify: `docs/index.md` (full landing page content)

- [ ] **Step 1: Register all landing components globally in theme/index.ts**

Update `enhanceApp`:

```ts
import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import Layout from "./Layout.vue";
import { NolebaseGitChangelogPlugin } from "@nolebase/vitepress-plugin-git-changelog/client";
import "./style.css";

// NOTE: All components in theme/components/ are auto-imported by
// unplugin-vue-components. No manual app.component() needed.
// Landing-heavy components (HeroShader, TerminalDemo, etc.) are
// code-split automatically by Vite since they're only referenced
// in index.md via <script setup> imports.

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(NolebaseGitChangelogPlugin);
    // vue-axe: dev-only a11y overlay
    if (import.meta.env.DEV) {
      import("vue-axe").then((VueAxe) => {
        app.use(VueAxe.default);
      });
    }
  },
} satisfies Theme;
```

- [ ] **Step 2: Write full landing page docs/index.md**

```md
---
layout: page
title: astix — Code intelligence for AI agents
description: Self-hosted code intelligence for AI coding agents. 36 languages, 30+ MCP tools. Works with Claude Code, Cursor, and any MCP client.
socialProof:
  enabled: true
---

<script setup>
import { useData } from 'vitepress'
import HeroShader from './.vitepress/theme/components/HeroShader.vue'
import TerminalDemo from './.vitepress/theme/components/TerminalDemo.vue'
import SocialProof from './.vitepress/theme/components/SocialProof.vue'
import NumbersBar from './.vitepress/theme/components/NumbersBar.vue'
const { frontmatter } = useData()
</script>

<!-- Hero -->
<section class="relative flex min-h-screen flex-col items-center justify-center px-6 py-32">
  <ClientOnly><HeroShader /></ClientOnly>
  <div class="relative z-10 mx-auto max-w-2xl text-center">
    <span class="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider" style="color: var(--accent-blue); background: var(--badge-bg); border: 1px solid var(--badge-border)">
      Open Source · Apache 2.0
    </span>
    <h1 class="mb-4 font-sans text-5xl font-bold leading-tight tracking-tight md:text-6xl" style="color: var(--text-primary)">
      Trustworthy code intelligence <span class="gradient-text">for AI agents</span>
    </h1>
    <p class="mx-auto mb-8 max-w-lg text-lg leading-relaxed" style="color: var(--text-secondary)">
      Self-hosted. 36 languages. 30+ MCP tools. Works with Claude Code, Cursor, and any MCP client.
    </p>
    <div class="mb-10 flex flex-wrap items-center justify-center gap-4">
      <a href="/getting-started" class="btn-primary">Get Started</a>
      <a href="https://github.com/astix-io/astix" class="btn-secondary">View on GitHub</a>
    </div>
    <div class="inline-flex cursor-pointer items-center gap-3 rounded-xl px-6 py-3.5 font-mono text-sm transition-colors" style="background: var(--cmd-bg); border: 1px solid var(--cmd-border); color: var(--text-secondary)" onclick="navigator.clipboard.writeText('npx @astix/mcp-server init')">
      <span style="color: var(--accent-blue)">$</span>
      <span style="color: var(--text-primary)">npx @astix/mcp-server init</span>
      <span style="color: var(--text-muted)" class="text-xs">click to copy</span>
    </div>
  </div>
</section>

<!-- Jobs-to-be-done -->
<section class="mx-auto grid max-w-5xl gap-6 px-6 py-20 md:grid-cols-3">
  <div class="rounded-xl p-8" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
    <div class="mb-4 text-3xl" style="color: var(--accent-blue)">🔍</div>
    <h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">Understand</h3>
    <ul class="space-y-2 text-sm leading-relaxed" style="color: var(--text-secondary)">
      <li>Call graphs & cross-file references</li>
      <li>Data lineage across functions</li>
      <li>Execution paths & coverage gaps</li>
      <li>Impact analysis before any change</li>
    </ul>
  </div>
  <div class="rounded-xl p-8" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
    <div class="mb-4 text-3xl" style="color: var(--accent-purple)">🛡️</div>
    <h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">Change safely</h3>
    <ul class="space-y-2 text-sm leading-relaxed" style="color: var(--text-secondary)">
      <li>Rename across the entire call graph</li>
      <li>Patch with conflict detection</li>
      <li>Refactor with rollback safety</li>
      <li>Write tests from coverage gaps</li>
    </ul>
  </div>
  <div class="rounded-xl p-8" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
    <div class="mb-4 text-3xl" style="color: var(--accent-green)">🔒</div>
    <h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">Stay private</h3>
    <ul class="space-y-2 text-sm leading-relaxed" style="color: var(--text-secondary)">
      <li>100% self-hosted, your infrastructure</li>
      <li>BYOK embeddings & LLM</li>
      <li>Zero code egress — ever</li>
      <li>Air-gap ready (Enterprise)</li>
    </ul>
  </div>
</section>

<!-- Features (zigzag layout) -->
<section class="mx-auto max-w-5xl px-6 py-20">
  <div class="text-center mb-16">
    <h2 class="mb-4 font-sans text-3xl font-bold" style="color: var(--text-primary)">Built for AI-assisted development</h2>
    <p style="color: var(--text-secondary)">Every tool your agent needs, none of the guesswork.</p>
  </div>

  <!-- Feature 1: left text, right code -->
  <div class="mb-16 grid items-center gap-8 md:grid-cols-2">
    <div>
      <h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">30+ MCP Tools</h3>
      <p class="mb-4 text-sm leading-relaxed" style="color: var(--text-secondary)">Search, analyze, refactor, and write code through a standardized protocol. Works with any MCP-compatible client.</p>
    </div>
    <div class="rounded-lg p-4 font-mono text-sm" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
      <span style="color: var(--accent-blue)">search_structural</span>(<span style="color: var(--accent-green)">"handlePayment"</span>)<br>
      <span style="color: var(--text-muted)">→ 3 results in 12ms</span>
    </div>
  </div>

  <!-- Feature 2: right text, left code -->
  <div class="mb-16 grid items-center gap-8 md:grid-cols-2">
    <div class="order-2 md:order-1 rounded-lg p-4 font-mono text-sm" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
      <span style="color: var(--accent-blue)">impact_analysis</span>(<span style="color: var(--accent-green)">"UserService"</span>)<br>
      <span style="color: var(--text-muted)">→ 14 affected, risk: HIGH</span><br>
      <span style="color: var(--text-muted)">  depth: 3, inherited_by: 2</span>
    </div>
    <div class="order-1 md:order-2">
      <h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">Impact Analysis</h3>
      <p class="mb-4 text-sm leading-relaxed" style="color: var(--text-secondary)">Know the blast radius before you change anything. Transitive callers, inherited classes, risk assessment — all in one call.</p>
    </div>
  </div>

  <!-- Feature 3: left text, right visual -->
  <div class="mb-16 grid items-center gap-8 md:grid-cols-2">
    <div>
      <h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">36 Languages</h3>
      <p class="mb-4 text-sm leading-relaxed" style="color: var(--text-secondary)">10 Tier-1 languages with full call graphs, type bindings, and CFG. 23 more with symbol extraction and imports. Powered by tree-sitter.</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <span v-for="lang in ['TypeScript','Python','Rust','Go','Java','C#','C++','Ruby','Swift','Kotlin']" :key="lang" class="rounded-md px-3 py-1 text-xs font-medium" style="background: var(--badge-bg); color: var(--accent-blue); border: 1px solid var(--badge-border)">{{ lang }}</span>
      <span class="rounded-md px-3 py-1 text-xs" style="color: var(--text-muted)">+26 more</span>
    </div>
  </div>
</section>

<!-- Code Demo -->
<section class="px-6 py-20">
  <div class="mx-auto max-w-2xl text-center mb-12">
    <h2 class="mb-4 font-sans text-3xl font-bold" style="color: var(--text-primary)">See it in action</h2>
    <p style="color: var(--text-secondary)">From search to impact analysis in seconds.</p>
  </div>
  <TerminalDemo />
</section>

<!-- Social Proof -->
<SocialProof :enabled="frontmatter.socialProof?.enabled ?? false" />

<!-- Numbers -->
<NumbersBar />

<!-- Final CTA -->
<section class="px-6 py-24 text-center">
  <h2 class="mb-4 font-sans text-3xl font-bold" style="color: var(--text-primary)">
    Ready to understand your codebase?
  </h2>
  <p class="mb-8" style="color: var(--text-secondary)">
    Get started in under 10 minutes. Free forever.
  </p>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <a href="/getting-started" class="btn-primary">Get Started</a>
    <a href="/pricing" class="btn-secondary">View Pricing</a>
  </div>
</section>
```

- [ ] **Step 3: Verify full landing page**

Run: `pnpm dev`

Expected: Complete landing page with all sections visible. Shader animates, terminal types, numbers count up on scroll, social proof rotates.

- [ ] **Step 4: Run build**

Run: `pnpm build`

Expected: Build succeeds. No errors.

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/theme/index.ts docs/.vitepress/theme/Layout.vue docs/index.md
git commit -m "feat: assemble landing page with all sections"
```

---

## Phase 3: Documentation Pages

### Task 9: Getting Started page

**Files:**
- Create: `docs/getting-started.md`

- [ ] **Step 1: Write full getting-started.md**

Write the complete Getting Started guide following the spec:
- Title + estimated time badge
- Prerequisites section (PostgreSQL 15+, Node.js 18+)
- Step 1: Start PostgreSQL with code-group tabs (Docker / Local)
- Step 2: Install & Configure with `npx @astix/mcp-server init` + TIP callout
- Step 3: Add Your Project with `astix add-project .`
- Step 4: Connect to Editor with code-group tabs (Claude Code / Cursor) showing JSON MCP config
- Step 5: Your First Query with example + SUCCESS callout

Use VitePress native features: `::: tip`, `::: warning`, code-group, copy button.

- [ ] **Step 2: Verify**

Run: `pnpm dev`, navigate to `/getting-started`. All tabs, callouts, code blocks render correctly.

- [ ] **Step 3: Commit**

```bash
git add docs/getting-started.md
git commit -m "feat: add Getting Started guide"
```

---

### Task 10: MCP Tools Reference

**Files:**
- Create: `docs/guide/mcp-tools.md`
- Create: `docs/.vitepress/theme/components/ToolSearch.vue`

- [ ] **Step 1: Create ToolSearch.vue**

Simple fuzzy search input that filters tools by name and description. Uses VitePress content and DOM manipulation — no external deps.

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";

const query = ref("");
const container = ref<HTMLElement>();

function filter() {
  if (!container.value) return;
  const sections = container.value.querySelectorAll("h3[id]");
  const q = query.value.toLowerCase();

  sections.forEach((h3) => {
    const block = [];
    let sibling = h3.nextElementSibling;
    block.push(h3);
    while (sibling && sibling.tagName !== "H3" && sibling.tagName !== "H2") {
      block.push(sibling);
      sibling = sibling.nextElementSibling;
    }

    const text = (h3.textContent || "").toLowerCase();
    const desc = block.map((el) => el.textContent || "").join(" ").toLowerCase();
    const match = !q || text.includes(q) || desc.includes(q);

    block.forEach((el) => {
      (el as HTMLElement).style.display = match ? "" : "none";
    });
  });
}

onMounted(() => {
  container.value = document.querySelector(".vp-doc") as HTMLElement;
});
</script>

<template>
  <div class="mb-8">
    <input
      v-model="query"
      type="search"
      placeholder="Filter tools..."
      class="w-full rounded-lg px-4 py-3 font-mono text-sm"
      style="
        background: var(--cmd-bg);
        border: 1px solid var(--cmd-border);
        color: var(--text-primary);
      "
      @input="filter"
    />
  </div>
</template>
```

- [ ] **Step 2: Write mcp-tools.md**

Write the complete MCP tools reference with:
- ToolSearch component at top
- Tools grouped by category (Search, Analysis, Write, Code Health, Sync)
- Each tool: name, description, params table, example request/response
- Start with 6-8 key tools (search_structural, search_semantic, get_symbol, impact_analysis, patch_symbol, rename_symbol, code_health, data_lineage). The rest can be added incrementally.

Register ToolSearch in theme/index.ts.

- [ ] **Step 3: Verify**

Run: `pnpm dev`, navigate to `/guide/mcp-tools`. Search filters tools in real time.

- [ ] **Step 4: Commit**

```bash
git add docs/guide/mcp-tools.md docs/.vitepress/theme/components/ToolSearch.vue docs/.vitepress/theme/index.ts
git commit -m "feat: add MCP tools reference with search"
```

---

### Task 11: Language Support page

**Files:**
- Create: `docs/guide/languages.md`

- [ ] **Step 1: Write languages.md**

Table of 36 languages with tier badges. Use VitePress markdown table with custom badge styling via inline HTML.

Tiers:
- Tier 1 (full): TypeScript, JavaScript, Python, Rust, Go, Java, C#, C, C++, Ruby
- Tier 2 (symbols + imports): PHP, Swift, Kotlin, Scala, Dart, Lua, Elixir, Haskell, OCaml, R, Julia, Perl, Zig, Nim, Crystal, Clojure, Erlang, F#, Groovy, MATLAB, PowerShell, Shell, Objective-C
- Tier 3 (symbols only): TOML, YAML, Dockerfile

- [ ] **Step 2: Commit**

```bash
git add docs/guide/languages.md
git commit -m "feat: add language support page"
```

---

## Phase 4: Pricing Page

### Task 12: PricingCards + PricingTable + PricingFaq components

**Files:**
- Create: `docs/.vitepress/theme/components/PricingCards.vue`
- Create: `docs/.vitepress/theme/components/PricingTable.vue`
- Create: `docs/.vitepress/theme/components/PricingFaq.vue`
- Create: `docs/.vitepress/data/faq.ts`

- [ ] **Step 1: Create faq.ts data file**

```ts
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Is the Community edition really free?",
    answer:
      "Yes, forever. Full read intelligence (search, call graphs, impact analysis, data lineage, execution paths) plus all write tools (rename, patch, insert). stdio MCP, single user. No feature lockdown, no usage limits.",
  },
  {
    question: "What's the difference between Community and Team?",
    answer:
      "Team adds multi-user collaboration: HTTP daemon (shared server), OAuth 2.1 authentication, RBAC, and audit logs. Same intelligence engine, different deployment model.",
  },
  {
    question: "Can I self-host all tiers?",
    answer:
      "Yes. Every tier runs on your infrastructure. Community is stdio (local), Team is HTTP daemon, Enterprise adds air-gap support. Zero code egress on all tiers.",
  },
  {
    question: "Do I need to send my code to a third-party service?",
    answer:
      "Never. astix runs entirely on your infrastructure. The optional embedding/LLM features are BYOK — you provide your own API keys or local models.",
  },
  {
    question: "What PostgreSQL version do I need?",
    answer:
      "PostgreSQL 15 or higher with pgvector extension. Works with any PostgreSQL provider (Docker, managed, self-hosted).",
  },
  {
    question: "Is there a trial for Team/Enterprise?",
    answer:
      "Yes, 14-day free trial for Team. Enterprise evaluations are arranged with our team — contact sales.",
  },
  {
    question: "Can I switch plans or cancel anytime?",
    answer:
      "Yes. Upgrade/downgrade takes effect immediately. Cancel anytime, you keep access until the end of your billing period.",
  },
  {
    question: "Do you offer discounts for open-source projects or education?",
    answer:
      "Yes. Open-source maintainers and educational institutions get Team tier free. Contact us with your project/institution details.",
  },
];
```

- [ ] **Step 2: Create PricingCards.vue**

Implement: 3 cards (Community/Team/Enterprise), monthly/annual toggle with "Save 20%" badge, Team card highlighted with gradient border and "POPULAR" badge. Annual prices show crossed-out monthly. Read tier data from component props or inline data.

- [ ] **Step 3: Create PricingTable.vue**

Implement: Feature comparison table grouped by category (Intelligence, Write Safety, Deployment, Governance, Support). Sticky header. ✓/— indicators.

- [ ] **Step 4: Create PricingFaq.vue**

Implement: Accordion component reading from `faq.ts`. Each item expandable/collapsible. Inject FAQPage JSON-LD schema via `useHead()` or script tag.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { faqItems } from "../../data/faq";

const openIndex = ref<number | null>(null);

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i;
}

// NOTE: FAQPage JSON-LD is injected server-side via schema.ts transformHead
// (not client-side) so it appears in SSG HTML for crawlers.
</script>

<template>
  <div class="mx-auto max-w-2xl divide-y" style="border-color: var(--border-subtle)">
    <div v-for="(item, i) in faqItems" :key="i">
      <button
        class="flex w-full items-center justify-between py-5 text-left font-semibold"
        style="color: var(--text-primary)"
        :aria-expanded="openIndex === i"
        @click="toggle(i)"
      >
        {{ item.question }}
        <span
          class="ml-4 transition-transform"
          :class="{ 'rotate-180': openIndex === i }"
        >
          ▾
        </span>
      </button>
      <div
        v-show="openIndex === i"
        class="pb-5 text-sm leading-relaxed"
        style="color: var(--text-secondary)"
      >
        {{ item.answer }}
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/theme/components/Pricing*.vue docs/.vitepress/data/faq.ts
git commit -m "feat: add pricing components (cards, table, FAQ)"
```

---

### Task 13: Pricing page assembly

**Files:**
- Create: `docs/pricing.md`
- Modify: `docs/.vitepress/theme/index.ts` (register pricing components)

- [ ] **Step 1: Register components in theme/index.ts**

Add PricingCards, PricingTable, PricingFaq to global component registration.

- [ ] **Step 2: Write pricing.md**

```md
---
layout: page
title: Pricing — astix
description: "Free community edition with full intelligence. Team and Enterprise tiers for collaboration and governance."
---

<section class="mx-auto max-w-5xl px-6 py-20 text-center">
  <h1 class="mb-4 font-sans text-4xl font-bold" style="color: var(--text-primary)">
    Choose your plan
  </h1>
  <p class="mb-12" style="color: var(--text-secondary)">
    Full intelligence on every tier. Pay only for collaboration features.
  </p>

  <PricingCards />
</section>

<section class="mx-auto max-w-5xl px-6 py-16">
  <h2 class="mb-8 text-center font-sans text-2xl font-bold" style="color: var(--text-primary)">
    Compare all features
  </h2>
  <PricingTable />
</section>

<section class="mx-auto max-w-3xl px-6 py-16">
  <h2 class="mb-8 text-center font-sans text-2xl font-bold" style="color: var(--text-primary)">
    Frequently asked questions
  </h2>
  <PricingFaq />
</section>
```

- [ ] **Step 3: Verify**

Run: `pnpm dev`, navigate to `/pricing`. Cards render, toggle works, table shows, FAQ expands.

- [ ] **Step 4: Commit**

```bash
git add docs/pricing.md docs/.vitepress/theme/index.ts
git commit -m "feat: assemble pricing page"
```

---

## Phase 5: Blog

### Task 14: Blog system

**Files:**
- Create: `docs/.vitepress/plugins/blog.data.ts`
- Create: `docs/.vitepress/theme/components/BlogIndex.vue`
- Create: `docs/blog/index.md`
- Create: `docs/blog/posts/2026-04-welcome.md` (first post)

- [ ] **Step 1: Create blog data loader**

`docs/.vitepress/plugins/blog.data.ts` — uses VitePress `createContentLoader` to load all posts from `blog/posts/*.md`:

```ts
import { createContentLoader } from "vitepress";

export interface Post {
  title: string;
  url: string;
  date: string;
  category: string;
  featured: boolean;
  readingTime: number;
  excerpt: string;
}

export default createContentLoader("blog/posts/*.md", {
  excerpt: true,
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title,
        url,
        date: frontmatter.date,
        category: frontmatter.category || "insights",
        featured: frontmatter.featured || false,
        readingTime: frontmatter.readingTime || 5,
        excerpt: excerpt || "",
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  },
});
```

- [ ] **Step 2: Create BlogIndex.vue**

Implement: category filter tabs (All, Tutorials, Insights, Benchmarks, Use Cases, Releases), featured post card, post grid (3 cols desktop, 1 mobile). Each card: title, category badge, date, reading time.

- [ ] **Step 3: Create blog index.md and first post**

`docs/blog/index.md`:
```md
---
layout: page
title: Blog — astix
description: Tutorials, benchmarks, and insights on code intelligence for AI agents.
---

<script setup>
import { data as posts } from '../.vitepress/plugins/blog.data'
</script>

<BlogIndex :posts="posts" />
```

`docs/blog/posts/2026-04-welcome.md`:
```md
---
title: "Introducing astix: Code Intelligence for AI Agents"
date: 2026-04-02
category: insights
featured: true
readingTime: 4
---

# Introducing astix: Code Intelligence for AI Agents

AI coding agents are powerful — but they're navigating your codebase blind...

<!-- Write 3-4 paragraphs introducing astix, the problem it solves, and how it works -->
```

- [ ] **Step 4: Register BlogIndex, verify**

Add BlogIndex to theme/index.ts. Run dev server, navigate to `/blog/`. First post card appears.

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/plugins/blog.data.ts docs/.vitepress/theme/components/BlogIndex.vue docs/blog/ docs/.vitepress/theme/index.ts
git commit -m "feat: add blog system with data loader and index"
```

---

## Phase 6: SEO & Meta

### Task 15: Schema.org JSON-LD + meta tags

**Files:**
- Create: `docs/.vitepress/plugins/schema.ts`
- Modify: `docs/.vitepress/config.ts` (add transformHead)
- Create: `docs/public/og-image.png` (placeholder — 1200x630 dark bg with logo + tagline)

- [ ] **Step 1: Create schema.ts**

Helper functions that generate JSON-LD based on page frontmatter:

```ts
import type { HeadConfig, TransformContext } from "vitepress";
import { faqItems } from "../data/faq";

export function generateSchemaHead(context: TransformContext): HeadConfig[] {
  const { pageData } = context;
  const fm = pageData.frontmatter;
  const heads: HeadConfig[] = [];

  // Canonical URL
  const slug = pageData.relativePath.replace(/\.md$/, "").replace(/index$/, "");
  const url = `https://astix.io/${slug}`.replace(/\/+$/, "") || "https://astix.io";
  heads.push(["link", { rel: "canonical", href: url }]);

  // OG tags
  heads.push(["meta", { property: "og:title", content: fm.title || pageData.title }]);
  heads.push(["meta", { property: "og:description", content: fm.description || "" }]);
  heads.push(["meta", { property: "og:url", content: url }]);
  heads.push(["meta", { property: "og:image", content: fm.ogImage || "https://astix.io/og-image.png" }]);

  // Twitter
  heads.push(["meta", { name: "twitter:title", content: fm.title || pageData.title }]);
  heads.push(["meta", { name: "twitter:description", content: fm.description || "" }]);

  // Schema.org — SoftwareApplication on home
  if (pageData.relativePath === "index.md") {
    heads.push([
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "astix",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Linux, macOS, Windows",
        description: "Self-hosted code intelligence for AI coding agents. 36 languages, 30+ MCP tools.",
        url: "https://astix.io",
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          description: "Community edition — free forever",
        },
      }),
    ]);
  }

  // BlogPosting schema for blog posts
  if (pageData.relativePath.startsWith("blog/posts/") && fm.date) {
    heads.push([
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: fm.title,
        datePublished: fm.date,
        author: { "@type": "Organization", name: "astix" },
        publisher: {
          "@type": "Organization",
          name: "astix",
          logo: "https://astix.io/logo.svg",
        },
        description: fm.description || "",
        mainEntityOfPage: url,
      }),
    ]);
  }

  // Pricing page — Product + Offers + FAQPage
  if (pageData.relativePath === "pricing.md") {
    heads.push([
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }),
    ]);
  }

  // TechArticle for docs pages
  if (
    pageData.relativePath.startsWith("guide/") ||
    pageData.relativePath === "getting-started.md"
  ) {
    heads.push([
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        name: fm.title || pageData.title,
        description: fm.description || "",
        proficiencyLevel: "Expert",
      }),
    ]);
  }

  // Blog posts: override og:type to article
  if (pageData.relativePath.startsWith("blog/posts/")) {
    heads.push(["meta", { property: "og:type", content: "article" }]);
  }

  // og:image dimensions for reliable social card rendering
  heads.push(["meta", { property: "og:image:width", content: "1200" }]);
  heads.push(["meta", { property: "og:image:height", content: "630" }]);

  return heads;
}
```

- [ ] **Step 2: Wire into config.ts**

Add `transformHead` to VitePress config:

```ts
import { generateSchemaHead } from "./plugins/schema";

export default defineConfig({
  // ... existing config
  transformHead(context) {
    return generateSchemaHead(context);
  },
});
```

- [ ] **Step 3: Verify**

Run: `pnpm build`

Inspect `docs/.vitepress/dist/index.html` — should contain `<script type="application/ld+json">` with SoftwareApplication schema, OG tags, canonical URL.

- [ ] **Step 4: Commit**

```bash
git add docs/.vitepress/plugins/schema.ts docs/.vitepress/config.ts
git commit -m "feat: add Schema.org JSON-LD and meta tags"
```

---

## Phase 7: CI/CD

### Task 16: GitHub Actions workflows

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `.github/workflows/preview.yml`

- [ ] **Step 1: Create deploy.yml**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm build

      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy docs/.vitepress/dist --project-name=astix-website
```

- [ ] **Step 2: Create preview.yml**

```yaml
name: Preview

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm build

      - uses: cloudflare/wrangler-action@v3
        id: deploy
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy docs/.vitepress/dist --project-name=astix-website --branch=${{ github.head_ref }}

      - uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: preview
          message: |
            ## Preview deployed
            ${{ steps.deploy.outputs.deployment-url }}
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/
git commit -m "feat: add deploy and preview GitHub Actions workflows"
```

---

## Phase 8: Final Polish

### Task 17: Theme toggle + Layout integration

**Files:**
- Modify: `docs/.vitepress/theme/Layout.vue`

- [ ] **Step 1: Add theme toggle and LogoRefraction to Layout**

Update Layout.vue to:
- Set `data-theme="dark"` on initial load (check localStorage for user preference)
- Add theme toggle button to the navbar (using VitePress nav slots)
- Integrate LogoRefraction in the navbar logo slot
- Apply `data-theme` class on `<html>` element

- [ ] **Step 2: Verify**

Run dev server. Theme toggle switches dark↔light. Logo animates in header. Shader adapts colors. All pages render correctly in both themes.

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/Layout.vue
git commit -m "feat: integrate theme toggle and animated logo in layout"
```

---

### Task 18: Build verification + Lighthouse

**Files:** None (verification only)

- [ ] **Step 1: Full build**

Run: `pnpm build`

Expected: No errors, no warnings. All pages generated.

- [ ] **Step 2: Preview**

Run: `pnpm preview`

Navigate all pages: /, /getting-started, /pricing, /guide/mcp-tools, /guide/languages, /blog/

Expected: All pages render correctly. No broken links. No console errors.

- [ ] **Step 3: Check HTML output for SEO**

```bash
grep -c "application/ld+json" docs/.vitepress/dist/index.html
grep -c "og:title" docs/.vitepress/dist/index.html
grep -c "canonical" docs/.vitepress/dist/index.html
```

Expected: At least 1 match for each.

- [ ] **Step 4: Accessibility spot check**

- Tab through the landing page — all interactive elements reachable
- Check heading hierarchy (h1 → h2 → h3, no skips)
- Verify `aria-label` on icon-only links
- Test with `prefers-reduced-motion: reduce` — shader should show static state

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: polish and accessibility improvements"
```
