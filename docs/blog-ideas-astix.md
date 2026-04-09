# Blog Ideas — astix Product / Features / SAST

Articles centrés sur ce qu'astix FAIT, pas sur comment il est construit. Pour le blog astix.io.

**Terminology**: astix does SOURCE CODE analysis (AST-level), NOT binary reverse engineering (Ghidra/IDA). The correct framing is "codebase understanding" or "source code archaeology."

---

## Showcase Repos

| Repo | Language | Files | Best for articles |
|------|----------|-------|-------------------|
| **Git** (git/git) | C | ~3K | #4 (archaeology), #9 (execution paths on `cmd_rebase`) |
| **SQLite** (sqlite/sqlite) | C | ~150K lines, 1 file | #9 (execution paths on `sqlite3VdbeExec`) |
| **Redis** (redis/redis) | C | ~500 | #3 (communities: networking/persistence/commands/pubsub), #6 (impact) |
| **VS Code** (microsoft/vscode) | TS | ~15K | #3 (Leiden communities), #10 (semantic search in 15K files) |
| **Express.js** | JS | ~150 | #1 (data lineage), #5 (dead code), #7 (SAST taint) |
| **FastAPI** | Python | ~300 | #1 (data lineage Python), #7 (taint), #8 (multi-lang) |
| **next.js** (vercel/next.js) | TS | ~20K | #10 (semantic search — grep impossible) |
| **Kubernetes** (kubernetes/kubernetes) | Go | ~20K | #3 (communities), #6 (impact analysis) |
| **Claude Code plugins** (anthropics/claude-code/plugins) | TS/MD (open-source) | ~200 | #11 (plugin architecture analysis — core CLI is compiled ELF, not analyzable) |
| **astix itself** | TS | ~400 | #2 (JSONL memory), self-referential demos |

---

## 1. "Data Lineage: Trace how your data flows from user input to database"

**Showcase**: Express.js + FastAPI (same flow in 2 languages)

**Hook**: You found a bug where `req.body.email` ends up unsanitized in a SQL query. How do you trace the full path?

**Content**:
- What is data lineage: tracking variable values through assignments, function calls, returns
- `data_lineage(variable="userInput", crossFunction=true)` — one call, full trace
- CFG-aware: follows actual execution paths (if/else branches, try/catch, loops)
- Concrete example: Express route → middleware → service → db.query
- Same flow in FastAPI: `@app.post` → Pydantic → SQLAlchemy
- Taint analysis: automatic source/sink detection with `taint-patterns`

**Why it matters**: Security audit, debugging data corruption, understanding legacy code

---

## 2. "Retrouver la mémoire: How astix indexes Claude Code transcripts for cross-session recall"

**Showcase**: oorabona/claude (our own JSONL transcripts)

**Hook**: You had a conversation 3 weeks ago about a specific bug fix. How do you find it?

**Content**:
- The problem: Claude Code sessions are ephemeral — context lost after each conversation
- The solution: astix indexes JSONL transcripts as a project (`oorabona/claude`)
- 3 symbol kinds: `exchange` (conversation), `question` (user messages), `session` (metadata)
- `search_semantic(query="spread property tracking", project="oorabona/claude")` → finds the exact session
- BM25 + vector hybrid search on conversation content
- Practical: `/recall` command searches past sessions via astix

**Why it matters**: Institutional knowledge preservation, onboarding acceleration

---

## 3. "Community Detection: Discover your codebase's hidden architecture with Leiden"

**Showcase**: VS Code (15K TS files) + Redis (C, clear module boundaries)

**Hook**: Your monorepo has 500 files. Which ones form logical modules? Which are tightly coupled? Where are the boundaries?

**Content**:
- What is community detection: graph algorithm that finds clusters of highly-connected nodes
- Leiden algorithm: improved Louvain, local-move + aggregation + recursion
- Applied to code: symbols are nodes, calls + imports are edges (weighted)
- `detect_communities(resolution=5)` → communities with cohesion scores and auto-generated labels
- VS Code: editor / extensions / workbench / terminal communities emerge automatically
- Redis: networking / persistence / commands / pubsub — matches the documented architecture
- Use cases: architecture discovery, refactoring, impact assessment, onboarding

**Why it matters**: Invisible architecture made visible. No documentation needed.

---

## 4. "Source Code Archaeology: Understanding a codebase you didn't write"

**Showcase**: Git (git/git) — "How does `git rebase` actually work?"

**Hook**: You just joined a team. 200K lines of code. No architecture doc. Where do you start?

**Content**:
- Step 1: `detect_communities()` → discover the modules (Git: object store, refs, merge, diff, pack)
- Step 2: `trace_flow(file="builtin/rebase.c", name="cmd_rebase")` → follow the rebase lifecycle
- Step 3: `impact_analysis("merge-recursive.c", "merge_trees", depth=3)` → what depends on merge?
- Step 4: `get_execution_paths("read-cache.c", "read_index_from")` → how does the index get loaded?
- Step 5: `search_semantic(query="conflict resolution")` → find code by intent
- Step 6: `data_lineage(variable="result", crossFunction=true)` → trace merge result through the system
- The full story: from `cmd_rebase` entry to commit creation, traced with astix

**Why it matters**: Every developer faces unfamiliar codebases. astix turns days into hours.

**NOTE**: This is SOURCE code analysis. We clone the Git repo from GitHub and analyze the C source. Not binary reverse engineering.

---

## 5. "Dead Code Detection Beyond Unused Functions"

**Showcase**: Express.js (real numbers from our benchmark data)

**Hook**: Your linter says "0 unused imports." But what about exports nobody imports? Functions called only from dead code? Entire modules unused?

**Content**:
- Level 1: Unused exports — exported but never imported in the project (`checkDeadExports`)
- Level 2: Transitively dead — called only from other dead functions (`code_health` transitive)
- Level 3: Dead communities — entire module clusters with 0 external edges
- Cross-file value resolution: know WHAT is exported (literal array? computed?) not just THAT it's exported
- Concrete numbers from Express.js analysis

**Why it matters**: Dead code is tech debt that costs tokens, build time, and cognitive load.

---

## 6. "Impact Analysis: What breaks if I change this function?"

**Showcase**: Redis or Kubernetes — large, interconnected

**Hook**: You need to refactor `handleRequest()`. It's called from 15 places. But what about indirect callers? Type references? Community boundaries?

**Content**:
- `impact_analysis(file, name, depth=3)` — transitive blast radius in one call
- Direct callers + callers of callers + type references
- Risk levels: low/medium/high/critical based on caller count + community spread
- Community-aware: "this change crosses 3 community boundaries → HIGH risk"
- Comparison: manual grep cascade (5-10 minutes, error-prone) vs astix (1 call, complete)

**Why it matters**: Confident refactoring. No more "I didn't know X depended on Y."

---

## 7. "SAST Without the Enterprise Price Tag: Open-Source Taint Analysis with astix"

**Showcase**: FastAPI (Python web → db flow)

**Hook**: Commercial SAST tools cost $50K+/year. What if your AST-level code index already has everything needed for taint analysis?

**Content**:
- Source/sink pattern library — req.body, db.query, exec, innerHTML
- Cross-function taint propagation via data lineage + call graph
- Cross-file taint: CJS normalization + value resolution enable full module-boundary tracing
- Sanitizer detection: `escapeHtml()`, parameterized queries cut the taint chain
- Comparison with Semgrep/CodeQL: AST-level but lighter, incremental, MCP-integrated
- Limitations: honest about what it can't do

**Why it matters**: Security scanning integrated into your AI coding workflow, not a separate tool.

---

## 8. "10 Languages, One Architecture: Universal Code Intelligence with tree-sitter"

**Showcase**: Multi-repo — same `impact_analysis` on Express (JS), FastAPI (Python), Gin (Go), Actix (Rust)

**Hook**: You have a polyglot monorepo: TypeScript frontend, Python ML, Go microservices, Rust CLI. One tool understands all of them.

**Content**:
- tree-sitter: incremental parsing, concrete syntax trees, language-agnostic queries
- Tier 1 (10 languages): full SAST (calls, imports, CFG, type bindings, parents, value metadata)
- Tier 2 (23 languages): symbols + basic structure
- Concrete: same `impact_analysis` call works on Go, Python, Rust, Java
- Per-language idioms: Python `setattr` vs JS `forEach` vs Go `reflect` — different syntax, same semantics

**Why it matters**: One index, one API, every language. No tool fragmentation.

---

## 9. "Execution Paths: Every branch your function can take, mapped automatically"

**Showcase**: SQLite `sqlite3VdbeExec` (legendary function, 100+ branches)

**Hook**: That function has 47 lines, 3 if/else, 2 try/catch, 1 switch. How many execution paths? What does each path DO?

**Content**:
- `get_execution_paths(file, name)` → named paths with branch descriptions
- CFG (Control Flow Graph) analysis: if/else, try/catch, switch, early returns, loops
- `get_uncovered_paths` + coverage data → which paths have no tests
- `suggest_tests(coverage_path)` → auto-generate test skeletons for uncovered paths
- SQLite's virtual machine: the most complex switch statement in open-source C

**Why it matters**: Test coverage is path coverage. Know what you're not testing.

---

## 10. "Semantic Search for Code: Find by intent, not by name"

**Showcase**: next.js (20K TS files — grep is impossible)

**Hook**: You need "the function that validates email addresses." You don't know its name. `grep "email"` returns 200 hits.

**Content**:
- `search_semantic(query="validates email format")` → finds `isValidEmail` in utils.ts
- Hybrid search: BM25 (keyword) + vector embeddings (intent) + RRF fusion
- LLM-enriched descriptions: `set_description` adds human-readable purpose to each symbol
- Community boost: results from cohesive modules rank higher
- At scale: 20K files, grep gives 200 hits, astix gives the 10 most relevant symbols
- Comparison: grep (exact match) vs GitHub search (file-level) vs astix (symbol-level, intent-aware)

**Why it matters**: Code discovery at the speed of thought.

---

## 11. "Inside Claude Code's Plugin Architecture" (META — scoped)

**Showcase**: anthropics/claude-code/plugins (open-source TS/MD)

**Hook**: Claude Code's plugin system powers skills, hooks, commands, and agents. How is it structured?

**Reality check**: The Claude Code CLI core is a compiled ELF binary — NOT analyzable as source. The GitHub repo contains plugins, scripts, and docs only. This article focuses on the **plugin architecture**, not the CLI internals.

**Content**:
- Index the plugins directory with astix
- `detect_communities()` → discover plugin clusters (commit-commands, code-review, feature-dev, security)
- Analyze plugin.json manifests: how commands/skills/hooks/agents are declared
- `search_semantic(query="pre-commit validation")` → find hooks across all plugins
- Cross-plugin dependency patterns: which plugins reference shared utilities
- How to build your own plugin: structure revealed by astix analysis

**What we CAN'T do** (honest): The CLI core (tool dispatch, MCP client, permission system, context compaction) is in the compiled binary. Analyzing that would require binary reverse engineering (Ghidra/IDA), not source code analysis.

**Why it matters**: Plugin developers need to understand the architecture. astix makes it transparent.

**Tested (2026-04-09)**: Indexed the npm package `@anthropic-ai/claude-code@2.1.97`:
- `cli.js`: 16K lines bundled on ~1 line, mangled names → **0 symbols extracted**. tree-sitter parses it but no named functions survive minification.
- `sdk-tools.d.ts`: **43 interfaces/types** perfectly indexed with doc comments. The SDK contract IS analyzable.
- `detect_communities`: 0 communities (no call edges in type declarations)
- **Verdict**: Minified bundles are NOT a good showcase for astix. The tool is designed for readable source code.

**Alternative angle**: If Anthropic ever open-sources the CLI core, THIS becomes the killer article. For now, use **Git**, **VS Code**, or **Express** as showcases — real source code where astix shines.

---

## Priority

### Tier 1 (highest impact, write first)
1. **#4 Source Code Archaeology** (Git) — most viral, universal problem, everyone uses git
2. **#3 Community Detection** (VS Code + Redis) — most visual, unique differentiator
3. **#1 Data Lineage** (Express + FastAPI) — most practical, direct SAST value

### Tier 2 (strong value)
4. **#7 SAST open-source** — commercial differentiator
5. **#10 Semantic Search** (next.js) — impressive at scale
6. **#2 JSONL Memory** — unique to Claude Code ecosystem
7. **#6 Impact Analysis** — solid product feature

### Tier 3 (supporting)
8. **#9 Execution Paths** (SQLite) — niche but impressive
9. **#5 Dead Code** — practical value
10. **#8 10 Languages** — completeness story
11. **#11 Claude Code plugins** — limited scope (CLI core is compiled ELF, not analyzable)
