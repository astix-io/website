# astix.io — Website

## Objectif

Landing page + documentation pour astix. Canal d'acquisition principal.

## Stack recommandé

- **Framework** : VitePress (markdown-first, Vue components, SSG, fast)
- **Hosting** : GitHub Pages ou Cloudflare Pages
- **Style** : Tailwind CSS
- **Pas de CMS** — tout en markdown/Vue, versionné dans git

## Structure

```
website/
├── docs/
│   ├── index.md              ← Landing page
│   ├── getting-started.md    ← 10 min to first query
│   ├── guide/
│   │   ├── installation.md
│   │   ├── configuration.md
│   │   ├── mcp-tools.md      ← Reference des 30+ tools
│   │   └── languages.md      ← 36 langages supportés
│   ├── pricing.md            ← Community / Team / Enterprise
│   └── api/                  ← Auto-generated from tool schemas
├── .vitepress/
│   └── config.ts
└── package.json
```

## Pages à créer

### 1. Landing page (`index.md`)

**Hero** : "Trustworthy code intelligence for AI coding agents"
**Sous-titre** : "Self-hosted. 36 languages. 30+ MCP tools. Works with Claude Code, Cursor, any MCP client."

**3 colonnes (jobs-to-be-done)** :
1. **Understand** — Call graphs, data lineage, execution paths, impact analysis
2. **Change safely** — Rename, refactor, patch with rollback + conflict detection
3. **Stay private** — Self-hosted, BYOK embeddings/LLM, zero code egress

**Social proof** : 5000+ tests, 10 Tier-1 languages, Apache 2.0

**CTA** : `npx @astix/mcp-server init` (quand npm publish sera fait)

### 2. Getting Started (`getting-started.md`)

Target : **first useful query in under 10 minutes**

```bash
# 1. Start PostgreSQL (skip if you have one)
docker compose up -d

# 2. Install & configure
npx @astix/mcp-server init

# 3. Add your project
astix add-project .

# 4. Start MCP server
astix serve
# → Copy the MCP config to Claude Code / Cursor
```

### 3. Pricing (`pricing.md`)

3 tiers — voir BUSINESS.md dans astix-ee/docs/ pour les détails.

| | Community | Team | Enterprise |
|---|---|---|---|
| Prix | **Free** | **€29/user/mo** | **€49/user/mo** |
| Deployment | stdio (local) | HTTP daemon | On-prem / air-gap |
| Intelligence | ✅ Full | ✅ Full | ✅ Full |
| Write safety | ✅ | ✅ | ✅ + approval workflows |
| Auth | — | OAuth 2.1 | SSO/SAML/SCIM |
| Governance | — | RBAC + audit | Policy engine |
| Support | Community | Standard | Premium + SLA |

### 4. MCP Tools Reference (`guide/mcp-tools.md`)

Documenter chaque tool avec : nom, description, paramètres, exemple d'usage.
Grouper par catégorie : Search, Analysis, Code Health, Write, Sync.

Source : les inputSchema zod dans `astix/packages/mcp-server/src/tools/*.ts`

### 5. Language Support (`guide/languages.md`)

Tableau des 36 langages avec niveau de support :
- Tier 1 (10) : calls, imports, CFG, type bindings, parents
- Tier 2 (23) : symbols, basic imports
- Tier 3 (3) : symbols only

## Contenu source

Le contenu existe déjà dans le repo astix OSS :
- `astix/docs/` — documentation technique (index, overviews)
- `astix/packages/mcp-server/src/tools/*.ts` — inputSchema = API reference
- `astix/CLAUDE.md` — stack, structure, conventions
- `astix-ee/docs/BUSINESS.md` — positioning, pricing (repo privé)

## Design

- **Sobre, technique, professionnel** — pas de illustrations cartoon
- **Code-first** — les exemples de code sont le hero
- **Dark mode par défaut** (devs)
- Inspiration : VitePress default theme, Astro Starlight, Turborepo docs

## Ce qu'il NE faut PAS faire

- Pas de blog (pas de contenu à maintenir pour l'instant)
- Pas de signup/login (pas de SaaS)
- Pas de chat widget
- Pas de pricing calculator — 3 tiers simples
- Pas de comparaison feature-par-feature avec les concurrents sur le site public

## Priorité

1. Landing page + getting started → permet de share un lien
2. Pricing page → clarifie le modèle
3. Tools reference → documentation API
4. Language support → crédibilité technique
