# TODO — astix.io website

## SEO Audit — 2026-04-16 (full report: `docs/plans/SEO-AUDIT-2026-04-16.md`)

Overall score 59/100 — **not launch-ready**. P0 items block Show HN on 2026-04-24.

### P0 — Critical / High (block launch)

- [ ] 🔴 [Schema] **C1: `schema.ts` emits 0 JSON-LD on 11 blog posts + 3 docs pages** — conditionals never match actual `pageData.relativePath` after rewrite. Patch L134/141/185. Affected: all `blog/*.html` (no BlogPosting, `og:type=website` instead of `article`), `docs/*.html` (no TechArticle). — Priority: H
- [ ] 🔴 [Technical] **C2: Create `docs/public/_headers` for Cloudflare Pages** — zero security headers today (no HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy). Template in audit doc. — Priority: H
- [ ] 🔴 [SEO] **C3: Exclude `blog-ideas-astix.md` from build** — internal planning doc is currently indexed in sitemap + published at `https://astix.io/blog-ideas-astix`. Add to `srcExclude` in `config.ts`. — Priority: H
- [ ] 🔴 [Landing] **C4: Replace "10 Tier-1" → "11 Tier-1"** across `FeatureShowcase.vue`, `blog/posts/introducing-astix.md`, `blog/posts/multi-language.md`, `public/llms.txt:10`, `docs/languages.md` header. Add Swift + Dart to Tier-1 list. — Priority: H
- [ ] 🔴 [SEO] **C5: Add `<lastmod>` to sitemap.xml** — all 21 URLs miss lastmod/changefreq/priority. Use `transformItems` in VitePress sitemap config. — Priority: H
- [ ] 🟡 [Landing] **H1: Pricing page dead-end + thin (~200 words)** — zero internal links, description 179 chars (truncated), no product definition in opening sentence. Expand to 350+ words, add 3 outbound links to docs. — Priority: H
- [ ] 🟡 [SEO] **H2: Shorten title tags > 70 chars** on index.md (71), pricing.md (74), mcp-tools.md (67), languages.md (67). Target 50-60. Also fix `titleTemplate` to avoid `| astix` duplication when page title already contains brand. — Priority: H
- [ ] 🟡 [SEO] **H3: Trim descriptions > 170 chars** on pricing.md (179) and mcp-tools.md (171). Target 140-160. — Priority: H
- [ ] 🟡 [SEO] **H4: Add internal links** to pricing.md, getting-started.md, mcp-tools.md, languages.md (currently 0 each). 3-5 contextual links per page. — Priority: H

### P1 — Pre-launch if time permits

- [ ] 🟡 [Content] **H5: Write `/blog/what-is-astix.md`** (150-200w definition) for AI search citability. Similar articles: "What is MCP?", "How does astix work?", "astix vs Sourcegraph/Semgrep/grep". — Priority: M
- [ ] 🟡 [Schema] **H6: Expand 8 FAQ answers < 50 words** in `docs/.vitepress/data/faq.ts` (47% too short for FAQPage rich results). — Priority: M
- [ ] 🟡 [Schema] **H7: Add Team monthly pricing** ($359/mo + $39/seat) to `Product.offers` in `schema.ts`. — Priority: M
- [ ] 🟡 [Schema] **H8: Add `FAQPage` + `HowTo` JSON-LD to home** — currently FAQPage only on `/pricing`. HowTo for the 5-step quick-start. — Priority: M
- [ ] 🟡 [Schema] **M3: Add `BreadcrumbList` to docs/blog pages** for sitelinks in SERP. — Priority: M
- [ ] 🟡 [Images] **M4: Blog post Unsplash images** — add `alt`, `width`, `height`, `loading="lazy"`, `decoding="async"` on 11 blog posts. — Priority: M
- [ ] 🟢 [Blog] **M5: Link blog author names to bio page** (`/blog/authors/olivier-orabona`). Currently text-only in posts. — Priority: L

### P2 — Post-launch

- [ ] 🟢 [Perf] M2: Code-split PricingMatrix.vue (1288 LOC) + Mermaid ecosystem (~1.7 MB total). Add `prefers-reduced-motion` guard to HeroShader.vue. — Priority: L
- [ ] 🟢 [Content] Write `/blog/astix-vs-competitors.md` comparison article. — Priority: L
- [ ] 🟢 [Schema] Add `SoftwareSourceCode` (codeRepository=GitHub), `VideoObject` (when demo video uploaded), `AggregateRating` (when testimonials collected). — Priority: L
- [ ] 🟢 [Perf] M6: Evaluate analytics (CF Web Analytics / Plausible) — coordinate with GDPR TODO line ~157. — Priority: L
- [ ] 🟢 [Perf] M7: Verify `font-display: swap` on Inter + IBM Plex Sans. — Priority: L

### Findings confirmed already addressed

- ✅ robots.txt — GPTBot/ClaudeBot/PerplexityBot allow, CCBot/anthropic-ai/Bytespider/cohere-ai disallow
- ✅ llms.txt — present, comprehensive (except stale "10 Tier-1" — see C4)
- ✅ og-image.png + og-image.svg — present, 1200×630 (F-008 from prior TODO is effectively done)
- ✅ Home JSON-LD — SoftwareApplication + Organization + WebSite (3 blocks)
- ✅ Author page JSON-LD — Person schema with sameAs links
- ✅ Pricing JSON-LD — FAQPage + Product
- ✅ Canonical tags — generated correctly per page
- ✅ Mobile responsive — Tailwind md/lg/sm classes, viewport auto by VitePress

## Content Updates — Session 2026-04-02/03

Features à ajouter/mettre en avant sur le site :

### Taint Tracking (killer feature — aucun concurrent MCP ne fait ça)
- [ ] 📝 [Features] Ajouter section "Security Analysis" — source→sink vulnerability detection
- [ ] 📝 [Features] 5 built-in patterns : SQL injection, XSS, path traversal, SSRF, log injection
- [ ] 📝 [Features] Cross-function taint tracing (suit la donnée à travers les appels de fonctions)
- [ ] 📝 [Features] CFG-aware sanitizer detection (détecte les branches non-sanitizées)
- [ ] 📝 [Features] Template literal sinks, inline property access, call-based sources
- [ ] 📝 [Features] Custom patterns via config.json (extensible par l'utilisateur)
- [ ] 📝 [Tools Ref] Documenter `code_health(check='taint')` — params, output, exemples

### Code Intelligence Improvements
- [ ] 📝 [Features] Column-aware call resolution — distingue `db.query(escape(id))` inner/outer calls
- [ ] 📝 [Features] Property write classification — `data.id = value` correctement classifié comme write
- [ ] 📝 [Features] Taint result caching — optimisation performance pour CI/agent

### Project Management
- [ ] 📝 [Features] Namespace/name project naming — format `owner/repo` dérivé du git remote
- [ ] 📝 [Features] Cross-project search par namespace glob (`astix-io/*`, `oorabona/*`)
- [ ] 📝 [Features] Custom project names via `add_project(name: "custom/name")`
- [ ] 📝 [Features] Collision detection avec suggestions de noms

### Infrastructure
- [ ] 📝 [Features] Resumable indexing — reprise après restart (DB v37, reindex_sessions)
- [ ] 📝 [Features] Pre-commit hooks — nano-staged + simple-git-hooks (convention DX)

### Changelog
- [ ] 📝 [Blog/Changelog] Écrire le changelog de cette session (15+ commits, 5000+ lignes)

## Content Updates — Session 2026-04-15/16

Astix monorepo shipped 16 commits (`70a227f..89e85f7`) pushed to `origin/main` 2026-04-16. Four user-facing features to add to the site, plus five under-exposed features from prior sessions that the 2026-04-16 audit surfaced. Reference: MEMORY.md + `/mnt/wsl/shared/dev/astix-io/astix/TODO.md`.

### Hero headline — stale count

- [ ] 📝 [Landing] Hero subheading says "10 Tier-1 languages" — now 11 (Swift and Dart both promoted to full Tier-1 parity in TIER1-PARITY). File: `docs/index.md` hero section. Search for "10 Tier-1" or "10 Tier 1" and bump to 11.  Current Tier-1 list: TS/JS, Python, Go, Rust, Java, C, C++, Kotlin, Swift, Dart. Verify language support table (`docs/docs/languages.md`) shows Swift and Dart with the same capability checkmarks as other Tier-1 langs. — Priority: M
- [ ] 📝 [Features] If hero keeps a language count, explain what "Tier-1" MEANS in a one-liner tooltip or footnote: "Full parity — identical extraction, test detection, attribute metadata, call graph, impact analysis behavior." Current site implies tiers without defining them. — Priority: M

### 11-language unified experience (TIER1-PARITY, 7 commits `70a227f..e50b372`)

Each Tier-1 language now emits the same symbol metadata shape: is_test flag, parent relationships, attributes, test framework detection. This matters because agents/tools don't need per-language special cases.

- [ ] 📝 [Landing] Add a "Consistent behavior across languages" pitch near the feature grid. Angle: "Switch from TypeScript to Rust or Swift — your refactoring, impact analysis, and dead-code detection work identically. No feature matrix to memorize." — Priority: M
- [ ] 📝 [Blog] Article: "What Tier-1 means in astix, and why you should care" — explain unified metadata schema, test detection across 11 langs (pytest/xunit/go test/XCTest/swift-testing/JUnit/Kotlin-test/dart-test/GTest/Catch2/Unity/CMocka/Tap-style), decorator/annotation extraction parity. 1000-1500 words. Target audience: tech leads choosing tools for polyglot stacks. — Priority: L
- [ ] 📝 [Docs] `docs/docs/languages.md` — audit the capability matrix. Ensure each of the 11 langs has equal coverage in: symbol kinds, test detection, attributes/decorators/annotations, CFG paths, call graph, type bindings where applicable. If the matrix is missing columns for test framework detection, add them. Source of truth: astix `packages/core/src/parser/lang/*.ts` + `parity-contract.spec.ts`. — Priority: M

### Entry-point intelligence (commit `98d1183 feat(sync): detect package entries in Python, Rust, Java, Kotlin`)

Dead-code analysis now recognizes package entry points across build systems. This ELIMINATES a specific class of false positives: "dead_code reports my main.py/app entry as unused".

- [ ] 📝 [Features] Add to Dead Code Detection section on landing: "Entry-point aware — your `main.py`, Spring Boot `@SpringBootApplication` class, Maven `<mainClass>`, or Cargo `[[bin]]` target is never mistakenly flagged as dead code." — Priority: M
- [ ] 📝 [Docs] Extend `docs/docs/` with a "Package entry detection" subsection (new file or within existing Code Health doc). Exhaustive list:
  - **Python**: `[project.scripts]` and `[tool.poetry.scripts]` in `pyproject.toml` (both flat and `src/` layout), `__init__.py`, `__main__.py`
  - **Rust**: `src/main.rs`, `src/lib.rs`, `build.rs`, and ALL `[[bin]]` entries in Cargo.toml (explicit `path` + implicit `src/bin/<name>.rs`)
  - **Java/Kotlin**: `<mainClass>` in `pom.xml` (both `src/main/java` and `src/main/kotlin` layouts), plus any file containing a class annotated `@SpringBootApplication` or `@QuarkusMain`
  - **TS/JS**: already supported (`main`/`types`/`exports` in `package.json`)
  - **Go**: `main.go` in module root
  Source: `packages/core/src/sync/lang-resolve.ts` — functions `extractCargoBinPaths`, `extractPyprojectScriptModules`, `resolvePythonModule`, `extractPomMainClass`, `resolveMavenMainClass`, `querySpringQuarkusEntries`. — Priority: M
- [ ] 📝 [Blog] Article: "Why your polyglot project's dead-code report has false positives (and how we fixed it)" — problem statement, show a before/after on a real polyglot repo. Could double as recruiting/design-partner bait. 800-1200 words. — Priority: L

### extends vs implements distinction (commits `fb9fca3` Go + `8c9700a` Swift)

Go has structural interface satisfaction (implicit `implements`). Swift uses identical AST nodes for class inheritance AND protocol conformance but they should be semantically different. Both now resolved correctly post-parse.

- [ ] 📝 [Features] Under Impact Analysis or Call Graph feature card, add: "Correctly distinguishes class inheritance from protocol/interface conformance — impact_analysis on an interface returns consumers, not subclasses." — Priority: M
- [ ] 📝 [Docs] Tools reference for `impact_analysis` — mention the `inherited_by[]` field now carries correct `parent_kind` (`extends` vs `implements`). Source: `packages/core/src/sync/resolve-go-interfaces.ts` + `resolve-swift-protocols.ts`. — Priority: L
- [ ] 📝 [Blog] Article (optional): "Why Go's implicit interfaces and Swift's protocols matter for code intelligence" — technical deep-dive showing how we resolve them post-parse. 600-1000 words. Audience: devs interested in tree-sitter / static analysis. — Priority: L

### Under-exposed features (shipped pre-2026-04-15, missing/weak on site)

These were identified by the 2026-04-16 website audit (see details in `~/.claude/projects/-mnt-wsl-shared-dev-astix-io-astix/memory/project_website_features.md`) as shipped-but-invisible.

- [ ] 📝 [Features] **LLM description auto-generation** (MCP tools `set_description`, `get_description`, bulk `fill_descriptions`) — configure any LLM provider (Ollama, OpenAI-compatible, Anthropic) to generate one-liner purpose descriptions per symbol. Descriptions feed BM25 + embeddings → better `search_semantic` hit quality on large codebases. Config: `~/.config/astix/config.json` → `llm` section. Source: MEMORY.md "LLM Configuration" + `docs/dbsp-feature-requests.md`. — Priority: M
- [ ] 📝 [Features] **Semantic diff** — `semantic_diff` MCP tool compares exported symbols in code vs doc strings using embedding similarity. Detects drift between code and documentation. Under-documented. — Priority: L
- [ ] 📝 [Features] **CFG-aware data lineage** — `data_lineage(crossFunction=true)` returns `paths[].traces[]` grouped by execution path, not flat. Answers "can variable X be null at line Y?" across branches. Already vaguely mentioned; deserves a dedicated feature card or doc page with a worked example. Source: MEMORY "Roadmap item 8 CFG-aware lineage DONE". — Priority: M
- [ ] 📝 [Features] **Computed-dispatch resolution** — `obj[key]()` registry/dispatch patterns (e.g. plugin maps, command dispatchers) no longer flagged as dead_code false positives. Source: MEMORY 2026-03-15 "COMPUTED-DISPATCH (4 blocks, 3565 tests)". Relevant for frameworks with dynamic handler maps. — Priority: L
- [ ] 📝 [Features] **`astix health` CLI** — 6-check diagnostic: BM25 index readiness, grammar parser compatibility, embedding provider connectivity, vacuum stats, pgvector HNSW health, + `--fix` flag for auto-repair. Useful troubleshooting blurb for self-hosters. Source: MEMORY 2026-03-19. — Priority: L
- [ ] 📝 [Features] **JSONL transcript search** — parser indexes `.jsonl` session transcripts (3 kinds: exchange, question, session). Lets you search past conversations via `search_semantic` once `oorabona/claude` or similar transcript-store project is registered. Niche but novel. Source: MEMORY "JSONL parser: 3 symbol kinds". — Priority: L

### SEO / site hygiene (from 2026-04-16 audit)

Existing TODO already tracks F-007 (ToolSearch), F-008 (OG image), F-009 (RSS), F-011 (schema mismatch) — not duplicating those. New findings:

- [ ] 🔧 [SEO] No `/changelog` page exists. Either (a) repurpose the existing blog index as a mixed news+changelog feed, or (b) add a dedicated `docs/changelog.md` that lists shipped features grouped by month with release tags. With 16 recent commits and TIER1-PARITY being a big story, absence of a changelog is a credibility hole for tech-savvy visitors. — Priority: M
- [ ] 🔧 [SEO] Stale "10 Tier-1" in landing copy (see Hero section above) — same issue repeats in other pages if present. Scan all `docs/**/*.md` for "10 Tier" / "10 languages" / "Tier 1" and reconcile. — Priority: S
- [ ] 🔧 [Docs] Capability matrix in `docs/docs/languages.md` — verify parity (11 Tier-1 all with test detection + metadata + attributes + CFG paths). If columns were written pre-TIER1-PARITY, they may under-report Swift/Dart/Kotlin capability. Cross-reference against `packages/core/src/parser/lang/parity-contract.spec.ts`. — Priority: M
- [ ] 🔧 [SEO] Tools reference page — 14 code_health checks exist but only a subset documented. Inventory: `dead_code`, `unused_exports`, `circular_imports`, `high_coupling`, `code_complexity`, `taint`, `data_flow`, `unused_variables`, `hardcoded_values`, `unresolved_type_bindings`, plus others. Source: astix `packages/core/src/analysis/code-health/*.ts`. Auto-generate if possible (see existing backlog item about zod→doc generation). — Priority: M
- [ ] 🔧 [SEO] Benchmark table comparison (already in backlog under "Inspiration: code-review-graph.com" section) — flagging here as SEO priority for Show HN / launch day. Having a side-by-side comparison table is a strong conversion driver vs competitor sites that don't offer one. — Priority: M

### Implementation hints for the next Claude Code session on the website

1. **Stack context**: VitePress 1.6, Vue 3.5, Tailwind 4.2. Content in `docs/`. Build via `pnpm docs:build`, preview via `pnpm docs:dev`.
2. **Reference for shipped features**: 
   - Astix monorepo at `/mnt/wsl/shared/dev/astix-io/astix/`
   - `MEMORY.md` in `~/.claude/projects/-mnt-wsl-shared-dev-astix-io-astix/memory/` has the cumulative feature ledger
   - `docs/superpowers/specs/2026-04-10-ce-ee-strategy-design.md` has the Apache 2.0 core vs Elastic L2 premium split (already formalized — no action needed unless expanding to marketing that calls out EE features)
3. **EE-flagged features** (teaser material only, don't list as shipped): entry_patterns framework packs (Tauri/Spring/Flask/Express), TaintMatcher `@RequestParam` discriminated union, code deobfuscation.
4. **Tone**: user-value first, not implementation jargon. "Crash instrumentation" is a reliability prerequisite, NOT a feature — don't list it. Same for parser consolidation, test fixtures, perf gating, vitest migration.
5. **Suggested execution order**:
   (a) fix the stale "10 Tier-1" hero immediately (single-word edit, 5 min)
   (b) write changelog page with the 16 commits reorganized by user value (1h)
   (c) expand Dead Code section with entry-point angle (30 min)
   (d) add LLM description + semantic diff + CFG-aware lineage docs (45 min)
   (e) blog posts are optional, can defer to dedicated writing sessions

## Review Findings (non-blocking)

- [ ] 🔧 [SocialProof] F-001: setInterval runs when enabled=false — guard with if check — Priority: S
- [ ] 🔧 [Layout] F-003: Footer external links (GitHub, Slack) lack rel="noopener" — Priority: S
- [ ] 🔧 [Biome] F-005: No biome.json configured for linting/formatting — Priority: S
- [ ] 🔧 [Landing] F-006: Missing "Final CTA" section (spec 1.7) before footer — Priority: M
- [ ] 🔧 [Tools Ref] F-007: ToolSearch component (fuzzy search) not implemented — Priority: M
- [ ] 🔧 [SEO] F-008: Missing og-image.png (1200x630) — Priority: S
- [ ] 🔧 [Blog] F-009: RSS feed not wired up (plugin installed but not configured) — Priority: S
- [ ] 🔧 [Blog] F-010: formatDate duplicated between BlogIndex + BlogPostLayout — Priority: S
- [ ] 🔧 [Schema] F-011: Solo tier description mismatch in schema.ts JSON-LD — Priority: S

## Backlog

- [ ] 💡 [Pricing] Strategic review: self-hosted vs cloud axis, per-seat vs per-project, consultancy pricing, discount tiers
- [ ] 🔧 [Legal] CGV/CGU pour astix.io — conditions de vente, politique d'annulation, RGPD. Validation avocat. Priority: P0 (BLOQUANT pour paid tiers)
- [ ] 🔧 [Legal] Politique TVA — EU B2C (TVA pays client) vs EU B2B (reverse charge). Stripe Tax ou manual. Priority: P0
- [ ] 💡 [Infra] CF Worker licensing — Stripe webhook → JWT signé → email client. Priority: P1 (après CGV)
- [ ] 💡 [Landing] Page CGV/CGU + Privacy Policy. Priority: P0
- [ ] 💡 [Blog] Rédiger les 3 posts de lancement (tutorial setup, benchmark agent comparison, thought leadership)
- [ ] 💡 [Blog] Article: "Analyzing obfuscated JavaScript with AST intelligence" — how astix parses/traces obfuscated code without decompilation
- [ ] 💡 [Blog] Article: "Supply chain security: detecting malicious patterns in npm packages" — taint tracking on obfuscated deps
- [ ] 💡 [Blog] Article: "Legal aspects of code deobfuscation for non-compiled languages" — DMCA, EU directive, security research exemptions
- [ ] 💡 [Landing] Section "Security & Deobfuscation" — EE feature teaser (malware analysis, supply chain, legacy recovery)
- [ ] 💡 [Business] Update business.md: deobfuscation as EE product line (pricing, target market, legal positioning)
- [ ] 💡 [Tools Ref] Script de génération auto depuis les inputSchema zod dans astix/packages/mcp-server/src/tools/*.ts

### Inspiration: code-review-graph.com (5.2K stars, launched Feb 2026)

**Design patterns to replicate:**
- [ ] 💡 [Landing] Hero minimal — headline + 1-2 metrics chiffrés (pas de feature overload). Ex: "Index 100K symbols in <30s. Trace data lineage across 10 languages."
- [ ] 💡 [Landing] Quantified value propositions — lead with numbers, not features. Benchmark agent+grep vs agent+astix on real tasks.
- [ ] 💡 [Landing] Technical depth first — devs trust precision over marketing. Expliquer le HOW (tree-sitter + PostgreSQL + pgvector) avant le WHY.
- [ ] 💡 [Landing] Dark/light mode — convention dev tools (code-review-graph le fait)

**Content they lack (our differentiator):**
- [ ] 💡 [Landing] Interactive demo widget — live semantic search on un sample codebase (ils n'en ont pas, c'est statique)
- [ ] 💡 [Landing] Comparison table — astix vs code-review-graph vs Sourcegraph vs Semgrep (features matrix)
- [ ] 💡 [Landing] Social proof section — early adopter count, GitHub stars, benchmark results

**Benchmark (dep: astix eval harness):**
- [ ] 💡 [Landing] Token savings badge in hero — "Nx fewer tokens" with link to benchmark methodology
- [ ] 💡 [Blog] Article: "How astix reduces LLM token consumption by 127.7x" — benchmark done, 6 repos, 24 queries, methodology + honest comparison vs code-review-graph 8.2x. Source: `docs/benchmark.md` in astix repo. Priority: M
- [ ] 💡 [Landing] Benchmark comparison table — 127.7x astix vs 8.2x code-review-graph on same repos. Priority: M
- [ ] 💡 [Blog] Article: "Code-review-graph vs astix — complementary tools or competitors?" — honest comparison, SEO play
- [ ] 💡 [Social Proof] Collecter témoignages design partners pour activer la section
- [ ] 💡 [Infra] Créer repo astix-io/infra avec Terraform Cloudflare (module cf-pages-site, DNS, workflows)
- [ ] 💡 [Analytics] Évaluer options : CF Web Analytics (gratuit, server-side) vs Umami/Plausible + consent banner vs aucun. Vérifier conformité ePrivacy/CNIL avant de choisir
