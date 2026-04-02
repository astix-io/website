# astix.io Website — Design Specification

## Overview

Landing page + documentation site for astix, a self-hosted code intelligence platform for AI coding agents. Primary acquisition channel.

**Stack:** VitePress (Vue 3 + markdown SSG) + Tailwind CSS
**Hosting:** GitHub Pages or Cloudflare Pages
**Dark mode by default**, light mode toggle

---

## Design System

### Visual Direction

Style "Gradient Accent" — dark base with blue→purple gradient accents. Inspired by Stripe/Raycast. Professional, technical, code-first.

### Color Tokens

| Token | Dark | Light |
|-------|------|-------|
| `--bg-deep` | `#0B1120` | `#F8FAFC` |
| `--bg-surface` | `rgba(11,17,32,0.7)` | `rgba(255,255,255,0.8)` |
| `--bg-card` | `#1B2336` | `#FFFFFF` |
| `--border-subtle` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.06)` |
| `--border-muted` | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.1)` |
| `--text-primary` | `#F8FAFC` | `#0F172A` |
| `--text-secondary` | `#94A3B8` | `#475569` |
| `--text-muted` | `#64748B` | `#94A3B8` |
| `--accent-blue` | `#3B82F6` | `#2563EB` |
| `--accent-purple` | `#8B5CF6` | `#7C3AED` |
| `--accent-green` | `#22C55E` | `#16A34A` |

### Typography

- **Headings / Code:** JetBrains Mono (400, 500, 600, 700)
- **Body:** IBM Plex Sans (400, 500, 600, 700)
- **Scale:** 12 / 14 / 16 / 18 / 24 / 32 / 40 / 52
- **Body line-height:** 1.6
- **Max line-length:** 65–75 characters

### Icons

Lucide icons (SVG). No emojis as structural icons.

### Spacing

4px/8px incremental system. Section spacing: 16 / 24 / 32 / 48 / 64 / 96.

### Breakpoints

375px (mobile) / 768px (tablet) / 1024px (desktop) / 1440px (wide)

---

## Identity

### Logo

**Primary (header):** Animated diamond refraction — 36x36px canvas with faceted diamond, colors shift between blue/purple hues. Placed left of "astix" wordmark in JetBrains Mono 600.

**Favicon:** Static AST diamond SVG — diamond outline containing an abstract syntax tree (nodes connected by edges, root at top, leaves at bottom). Blue→purple gradient fill.

### Top Stripe

2px animated gradient bar fixed at top of viewport: `#3B82F6 → #8B5CF6 → #EC4899 → #8B5CF6 → #3B82F6`. Background-size 200%, animated linearly over 4s.

---

## Shader Background

### Call Graph Vivant (Hero)

Full-viewport Canvas 2D animation behind the hero section.

**Concept:** Simulation of a code call graph — nodes represent functions, edges represent call relationships. The graph breathes slowly and reacts to mouse proximity.

**Specifications:**
- 70 nodes spread across viewport, density biased toward center (diamond shape)
- 3 node types: hub (r=4.5, 5 connections), mid (r=3, 3 connections), leaf (r=2, 1 connection)
- Connections: quadratic bezier curves (organic feel), solid lines with dashed overlay on hubs
- Data pulses: small dots traveling along edges
- Ghost diamond outline: subtle diamond shape hint at 4% opacity
- **Mouse reactivity:** base speed calm, nodes within 250px of cursor accelerate up to 3x with quadratic falloff and smooth lerp (0.06). Affects drift, pulse speed, and dash animation.
- Colors adapt to light/dark theme via token system
- DPR capped at 1.5 (decorative background, performance optimization)
- Pre-computed connections at init (not per-frame)
- Cached color strings to avoid per-frame allocation

**Performance target:** 60fps on modern hardware, 144fps observed on optimized version.

---

## Pages

### 1. Landing Page (`docs/index.md`)

**Sections in order:**

#### 1.1 Hero
- Full viewport height, shader background
- Badge: "Open Source · Apache 2.0"
- H1: "Trustworthy code intelligence **for AI agents**" (gradient on last part)
- Subtitle: "Self-hosted. 36 languages. 30+ MCP tools. Works with Claude Code, Cursor, and any MCP client."
- 2 buttons: "Get Started" (gradient primary) + "View on GitHub" (secondary outline)
- Install command block: `$ npx @astix/mcp-server init` (copy-on-click)

#### 1.2 Jobs-to-be-done
- 3 cards in row (responsive: stack on mobile)
- Each card: Lucide icon + title + 3 bullet points
- **Understand:** Call graphs, data lineage, execution paths, impact analysis
- **Change safely:** Rename, refactor, patch with rollback + conflict detection
- **Stay private:** Self-hosted, BYOK embeddings/LLM, zero code egress

#### 1.3 Features
- Zigzag layout: text left / visual right, then inverted
- Feature blocks:
  - **30+ MCP Tools** — with code snippet example
  - **36 Languages** — with tier badges (Tier 1/2/3) and language grid
  - **Impact Analysis** — with mini visualization of blast radius
  - **Semantic Search** — with query→results example
  - **Write Safety** — with rename/rollback code example
  - **Code Health** — with dead code detection example

#### 1.4 Code Demo
- `<TerminalDemo>` Vue component
- Animated terminal that types commands and shows results
- Commands: search_structural → results, impact_analysis → blast radius
- Loop with pause between commands
- Styled as a terminal window (dots, title bar, dark bg)

#### 1.5 Social Proof
- Component: `<SocialProof>`
- Controlled via frontmatter: `socialProof: { enabled: true }`
- When enabled: logo strip (partner/user logos) + quotes carousel (3 rotating testimonials)
- When disabled: section not rendered (no empty space)
- Placeholder content for layout validation, replaced with real testimonials later
- **Documentation:** Toggle via `docs/index.md` frontmatter `socialProof.enabled: true|false`

#### 1.6 Numbers
- Horizontal stats bar with count-up animation on scroll intersection
- Stats: "5000+ tests" · "36 languages" · "30+ MCP tools" · "Apache 2.0"

#### 1.7 Final CTA
- Subtle gradient background
- H2: "Ready to understand your codebase?"
- 2 buttons: "Get Started" + "View Pricing"

#### 1.8 Footer
- Links: Docs · Pricing · GitHub · Slack · Blog
- "Apache 2.0 · © 2026 astix"
- Minimal, single row on desktop

---

### 2. Getting Started (`docs/getting-started.md`)

**Target:** First useful query in under 10 minutes.

**Layout:** VitePress doc layout with sidebar outline.

**Sections:**
1. Prerequisites (PostgreSQL 15+, Node.js 18+)
2. Start PostgreSQL — tabs: Docker / Local
3. Install & Configure — `npx @astix/mcp-server init` + TIP callout
4. Add Your Project — `astix add-project .`
5. Connect to Your Editor — tabs: Claude Code / Cursor, with JSON config block
6. Your First Query — example query + SUCCESS callout with next steps

**Features:**
- Copy-on-click on all code blocks (native VitePress)
- Tabs for variant paths (Docker/Local, Claude Code/Cursor)
- Callout boxes: TIP (blue), WARNING (yellow), SUCCESS (green)
- Estimated time badge at top

---

### 3. Pricing (`docs/pricing.md`)

**Layout:** Full-width page (no sidebar).

**Sections:**

#### 3.1 Pricing Cards
- Monthly/Annual toggle with "Save 20%" badge
- 3 cards: Community (free), Team (€29/23), Enterprise (€49/39)
- Team card highlighted: gradient border, "POPULAR" badge, slightly elevated
- Each card: price, key features (5-6 bullets), CTA button
- CTA: Community → "Get Started", Team → "Start Trial", Enterprise → "Contact Sales"

#### 3.2 Feature Comparison Table
- Full comparison grouped by category: Intelligence, Write Safety, Deployment, Governance, Support
- ✓ / — indicators
- Sticky header row on scroll

#### 3.3 FAQ
- Accordion, 8 questions
- Schema.org `FAQPage` markup for rich snippets

| Question | Answer |
|----------|--------|
| **Is the Community edition really free?** | Yes, forever. Full read intelligence (search, call graphs, impact analysis, data lineage, execution paths) + all write tools (rename, patch, insert). stdio MCP, single user. No feature lockdown, no usage limits. |
| **What's the difference between Community and Team?** | Team adds multi-user collaboration: HTTP daemon (shared server), OAuth 2.1 authentication, RBAC, and audit logs. Same intelligence engine, different deployment model. |
| **Can I self-host all tiers?** | Yes. Every tier runs on your infrastructure. Community is stdio (local), Team is HTTP daemon, Enterprise adds air-gap support. Zero code egress on all tiers. |
| **Do I need to send my code to a third-party service?** | Never. astix runs entirely on your infrastructure. The optional embedding/LLM features are BYOK — you provide your own API keys or local models. |
| **What PostgreSQL version do I need?** | PostgreSQL 15 or higher with pgvector extension. Works with any PostgreSQL provider (Docker, managed, self-hosted). |
| **Is there a trial for Team/Enterprise?** | Yes, 14-day free trial for Team. Enterprise evaluations are arranged with our team — contact sales. |
| **Can I switch plans or cancel anytime?** | Yes. Upgrade/downgrade takes effect immediately. Cancel anytime, you keep access until the end of your billing period. |
| **Do you offer discounts for open-source projects or education?** | Yes. Open-source maintainers and educational institutions get Team tier free. Contact us with your project/institution details. |

**Configuration:**
```yaml
pricing:
  model: "per-seat"
  tiers: [...]
```

**Note:** Pricing model is preliminary (per BUSINESS.md). Strategic review planned: self-hosted/cloud axis, seat/project unit, consultancy pricing. Page structure designed to accommodate any model change via frontmatter configuration.

---

### 4. MCP Tools Reference (`docs/guide/mcp-tools.md`)

**Layout:** VitePress doc layout with sidebar.

**Features:**
- Client-side fuzzy search bar at top (filters tools by name + description)
- Sidebar: collapsible categories (Search, Analysis, Write, Code Health, Sync)
- Each tool documented with:
  - Name and one-line description
  - Parameters table (name, type, required, description)
  - Example request (JSON)
  - Example response (JSON)
- Categories:
  - **Search:** search_structural, search_semantic
  - **Analysis:** get_symbol, impact_analysis, get_execution_paths, data_lineage, get_variable_uses, get_variable_defs, code_health, find_duplicates, trace_flow, suggest_tests
  - **Write:** patch_symbol, write_symbol, insert_symbol, delete_symbol, patch_file, rename_symbol, remove_file
  - **Sync:** add_project, remove_project, set_active_project, reindex_project, reindex_embeddings, fill_descriptions, fill_execution_paths, health_check

**Future:** Auto-generation script from inputSchema zod in `astix/packages/mcp-server/src/tools/*.ts` (backlog item).

---

### 5. Language Support (`docs/guide/languages.md`)

**Layout:** VitePress doc layout.

- Table of 36 supported languages with tier level
- **Tier 1 (10 languages):** calls, imports, CFG, type bindings, parents — full intelligence
- **Tier 2 (23 languages):** symbols, basic imports
- **Tier 3 (3 languages):** symbols only
- Visual badges for tier levels (green/yellow/gray)

---

### 6. Blog (`docs/blog/`)

**Layout:** Custom VitePress layout.

**Index page (`docs/blog/index.md`):**
- Category filter tabs: All / Tutorials / Insights / Benchmarks / Use Cases / Releases
- Featured post: large card at top (controlled via frontmatter `featured: true`)
- Post grid: 3 columns desktop, 2 tablet, 1 mobile
- Each card: title, category badge, date, reading time
- "Load more" button (client-side, all posts in SSG bundle)

**Post layout:**
- Doc-style with table of contents sidebar
- Tags, reading time, date at top
- Next/Previous navigation at bottom

**Post frontmatter:**
```yaml
---
title: "Article Title"
date: 2026-04-01
category: tutorials | insights | benchmarks | use-cases | releases
featured: false
readingTime: 5
tags: [mcp, code-intelligence]
---
```

**Content strategy (5 categories):**
1. **Tutorials** — product depth, SEO evergreen ("First Query in 10 Minutes", "Safe Refactoring Across 50 Files")
2. **Insights** — thought leadership ("Why AST-Level Intelligence Beats grep for AI Agents")
3. **Benchmarks** — credibility ("Agent + grep vs Agent + astix", metrics: success rate, time, safety)
4. **Use Cases** — ICP-specific ("Onboarding Faster with Impact Analysis", "Cross-Repo Refactoring")
5. **Releases** — changelog + feature deep-dive

**Cadence:** 2 posts/month minimum. Launch with 3 posts (1 tutorial + 1 benchmark + 1 insight).

**SEO:**
- Primary keywords: "code intelligence", "AI agent context", "self-hosted code analysis", "data lineage"
- Long-tail: "Claude Code setup", "find unused functions", "rename symbol safely"
- RSS feed via VitePress plugin

---

## VitePress Structure

```
website/
├── .github/
│   └── workflows/
│       ├── deploy.yml              ← Build + wrangler deploy on main
│       └── preview.yml             ← Preview deploy on PR
├── docs/
│   ├── index.md                    ← Landing page
│   ├── getting-started.md          ← Quick start guide
│   ├── pricing.md                  ← Pricing cards + comparison
│   ├── guide/
│   │   ├── installation.md
│   │   ├── configuration.md
│   │   ├── mcp-tools.md            ← Tools reference
│   │   └── languages.md            ← Language support table
│   ├── blog/
│   │   ├── index.md                ← Blog index with filters
│   │   └── posts/
│   │       ├── 2026-04-first-query.md
│   │       └── ...
│   └── public/
│       ├── favicon.svg             ← AST diamond favicon
│       ├── logo.svg                ← Full logo for schema.org
│       ├── og-image.png            ← Default OpenGraph image (1200x630)
│       ├── og/                     ← Per-page OG images
│       │   └── pricing.png
│       └── robots.txt              ← Robots + sitemap reference
├── .vitepress/
│   ├── config.ts                   ← VitePress config
│   ├── theme/
│   │   ├── index.ts                ← Custom theme extending default
│   │   ├── style.css               ← Tailwind + CSS tokens
│   │   ├── Layout.vue              ← Custom layout (stripe, shader)
│   │   └── components/
│   │       ├── HeroShader.vue      ← Call graph canvas
│   │       ├── LogoRefraction.vue  ← Animated header logo
│   │       ├── TerminalDemo.vue    ← Animated terminal
│   │       ├── PricingCards.vue    ← Cards + toggle
│   │       ├── PricingTable.vue    ← Feature comparison
│   │       ├── SocialProof.vue     ← Toggleable testimonials
│   │       ├── NumbersBar.vue      ← Stats with count-up
│   │       ├── ToolSearch.vue      ← Fuzzy search for tools ref
│   │       └── BlogIndex.vue       ← Blog grid + filters
│   ├── plugins/
│   │   ├── blog.ts                 ← Blog data loader + RSS
│   │   ├── sitemap.ts              ← Sitemap generation
│   │   └── schema.ts               ← JSON-LD injection per page
│   └── data/
│       └── faq.ts                  ← FAQ data (shared: accordion + JSON-LD)
└── package.json
```

---

## Component Specifications

### `<SocialProof>`
- **Props:** `enabled: boolean` (from page frontmatter)
- **When disabled:** renders nothing (v-if, not v-show — no DOM, no space)
- **When enabled:** logo strip + testimonial carousel
- **Toggle:** `docs/index.md` frontmatter → `socialProof: { enabled: true }`

### `<HeroShader>`
- Canvas 2D, 70 nodes, pre-computed connections
- Mouse proximity acceleration (250px radius, 3x max, quadratic falloff, lerp 0.06)
- Theme-reactive (watches `data-theme` attribute)
- DPR capped at 1.5
- `prefers-reduced-motion`: disable animation, show static snapshot

### `<TerminalDemo>`
- Sequence of commands typed character-by-character (40ms/char)
- Results appear after command completes (200ms delay)
- Pause between commands (2s)
- Loops infinitely
- Intersection Observer: only animates when visible

### `<PricingCards>`
- Reads pricing config from frontmatter
- Monthly/Annual toggle with animated transition
- Annual prices show crossed-out monthly + "Save 20%"

---

## Accessibility

- WCAG AA minimum, AAA for text contrast
- `prefers-reduced-motion` respected on all animations (shader, terminal, count-up)
- Keyboard navigation: all interactive elements focusable with visible focus rings
- Skip-to-content link
- Semantic headings (h1→h6, no level skip)
- Alt text on all meaningful images
- `aria-label` on icon-only links (GitHub, Slack)
- Color not sole indicator (icons + text alongside)

## Performance

- VitePress SSG: all pages pre-rendered as static HTML
- Shader: lazy-loaded, only on landing page, Intersection Observer
- Images: WebP/AVIF, responsive srcset, lazy-load below fold
- Fonts: `font-display: swap`, preload critical weights only (IBM Plex Sans 400/600, JetBrains Mono 400/600)
- Code splitting: blog posts loaded on demand
- Target: Lighthouse 95+ on all pages

---

## Hosting & Deployment

### Infrastructure (separate repo: `astix-io/infra`)

Cloudflare Pages. Terraform manages infrastructure, wrangler manages content deployment.

**Repo structure:**
```
infra/
├── environments/
│   └── prod/
│       ├── main.tf              ← Cloudflare provider + backend config
│       ├── variables.tf         ← cloudflare_api_token, account_id, zone_id
│       ├── website.tf           ← CF Pages project for astix.io
│       ├── dns.tf               ← DNS records for astix.io domain
│       └── outputs.tf           ← Pages URL, domain
├── modules/
│   └── cf-pages-site/           ← Reusable module (pattern from o2csi/infra)
└── .github/
    └── workflows/
        └── terraform.yml        ← plan on PR, apply on merge to main
```

**Terraform resources:**
- `cloudflare_pages_project` — project name, build config (VitePress)
- `cloudflare_pages_domain` — custom domain `astix.io` + `www.astix.io`
- `cloudflare_record` — DNS CNAME records pointing to CF Pages
- `cloudflare_ruleset` — redirects (www → apex), security headers
- `cloudflare_zone_settings` — SSL, minification, caching

**Pattern:** Mirrors `o2csi/infra/` conventions — Cloudflare provider v5+, local state (S3/R2 migration path noted), sensitive token via variable.

### CI/CD Workflows (this repo: `website/`)

```
.github/
└── workflows/
    ├── deploy.yml               ← Build + deploy on push to main
    └── preview.yml              ← Build + preview deploy on PR
```

**`deploy.yml`:**
1. Checkout → Install (pnpm) → Build (`vitepress build`)
2. `wrangler pages deploy dist/ --project-name=astix-website`
3. Triggered on push to `main`

**`preview.yml`:**
1. Same build steps
2. `wrangler pages deploy dist/ --project-name=astix-website --branch=${{ github.head_ref }}`
3. Comments preview URL on PR
4. Triggered on pull request

**Secrets needed:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

---

## SEO & Structured Data

### Meta Tags (all pages)

Managed via VitePress `head` config and per-page frontmatter:

```yaml
# Per-page frontmatter
---
title: "Page Title — astix"
description: "One-line description for search engines (150-160 chars)"
head:
  - - meta
    - property: og:image
      content: /og/page-name.png
---
```

**Global (`.vitepress/config.ts` head):**

| Tag | Value |
|-----|-------|
| `<meta charset>` | `utf-8` |
| `<meta viewport>` | `width=device-width, initial-scale=1` |
| `og:type` | `website` (landing), `article` (blog posts) |
| `og:site_name` | `astix` |
| `og:locale` | `en_US` |
| `twitter:card` | `summary_large_image` |
| `twitter:site` | `@astix_io` (when created) |
| `<link rel=canonical>` | Auto-generated from route |

### Schema.org JSON-LD

Injected via `<script type="application/ld+json">` in each page's `<head>`. Implemented as a VitePress build-time transform or Vue `useHead()`.

#### Landing Page

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "astix",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Linux, macOS, Windows",
  "description": "Self-hosted code intelligence for AI coding agents. 36 languages, 30+ MCP tools.",
  "url": "https://astix.io",
  "license": "https://www.apache.org/licenses/LICENSE-2.0",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR",
    "description": "Community edition — free forever"
  },
  "publisher": {
    "@type": "Organization",
    "name": "astix",
    "url": "https://astix.io",
    "logo": "https://astix.io/logo.svg"
  }
}
```

#### Pricing Page

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Pricing — astix",
  "mainEntity": {
    "@type": "Product",
    "name": "astix",
    "offers": [
      {
        "@type": "Offer",
        "name": "Community",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "Free forever. Full intelligence + write tools."
      },
      {
        "@type": "Offer",
        "name": "Team",
        "price": "29",
        "priceCurrency": "EUR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "29",
          "priceCurrency": "EUR",
          "unitText": "user/month",
          "billingIncrement": 1
        },
        "description": "HTTP daemon, OAuth, RBAC, audit logs."
      },
      {
        "@type": "Offer",
        "name": "Enterprise",
        "price": "49",
        "priceCurrency": "EUR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "49",
          "priceCurrency": "EUR",
          "unitText": "user/month",
          "billingIncrement": 1
        },
        "description": "SSO/SAML, SCIM, approval workflows, policy engine."
      }
    ]
  }
}
```

#### Pricing FAQ

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is the Community edition really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, forever. Full read intelligence + all write tools. stdio MCP, single user. No feature lockdown, no usage limits."
      }
    }
  ]
}
```

*Pattern repeats for all 8 FAQ questions. Implemented as auto-generated from a `faq` array in frontmatter to avoid duplication between visible accordion and JSON-LD.*

#### Blog Posts

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{ title }}",
  "datePublished": "{{ date }}",
  "dateModified": "{{ lastUpdated }}",
  "author": {
    "@type": "Organization",
    "name": "astix"
  },
  "publisher": {
    "@type": "Organization",
    "name": "astix",
    "logo": "https://astix.io/logo.svg"
  },
  "description": "{{ description }}",
  "mainEntityOfPage": "{{ canonicalUrl }}"
}
```

#### Tools Reference

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "name": "MCP Tools Reference — astix",
  "description": "Complete reference for 30+ MCP tools: search, analysis, write, code health, sync.",
  "proficiencyLevel": "Expert"
}
```

### Global SEO Files

| File | Source | Notes |
|------|--------|-------|
| `sitemap.xml` | `vitepress-plugin-sitemap` | Auto-generated at build, submitted to Google Search Console |
| `robots.txt` | `docs/public/robots.txt` | `Allow: /`, `Sitemap: https://astix.io/sitemap.xml` |
| `/blog/feed.xml` | Blog data loader plugin | RSS 2.0 feed for blog posts |
| `og-image.png` | `docs/public/og-image.png` | Default OpenGraph image (1200x630) — astix logo + tagline on dark bg |

### Per-Page SEO Checklist

| Page | Title | Description | Schema | OG Image |
|------|-------|-------------|--------|----------|
| Landing | "astix — Code intelligence for AI agents" | "Self-hosted code intelligence..." (155 chars) | SoftwareApplication + Organization | Default |
| Getting Started | "Getting Started — astix" | "First useful query in 10 minutes..." | TechArticle | Default |
| Pricing | "Pricing — astix" | "Free community edition, Team €29/mo..." | Product + Offers + FAQPage | Custom (pricing visual) |
| MCP Tools | "MCP Tools Reference — astix" | "30+ tools for code intelligence..." | TechArticle | Default |
| Languages | "Language Support — astix" | "36 supported languages across 3 tiers..." | TechArticle | Default |
| Blog index | "Blog — astix" | "Tutorials, benchmarks, and insights..." | Blog | Default |
| Blog post | "{{ title }} — astix Blog" | "{{ description }}" | BlogPosting | Per-post if available |
