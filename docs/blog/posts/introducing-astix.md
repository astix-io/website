---
title: "astix: MCP Code Intelligence for AI Coding Assistants"
date: 2026-04-24
dateModified: 2026-04-24
category: announcement
featured: true
readingTime: 7
author: "Olivier Orabona"
image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop
description: "astix gives AI coding assistants structured access to call graphs, data lineage, and impact analysis via 30+ MCP tools. 128x fewer tokens than raw file reads."
tags:
  - launch
  - announcement
  - open-source
  - mcp-tools
  - code-intelligence
  - claude-code
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

Your AI agent doesn't understand your codebase. It reads files. There's a difference.

> astix is a self-hosted semantic code intelligence platform that gives AI coding assistants structured access to codebases through the Model Context Protocol (MCP). Instead of reading raw source files, AI assistants query astix for specific symbols, call graphs, data lineage, and impact analysis — receiving only the relevant metadata. This approach reduces token consumption by a median of [128x fewer tokens](/blog/token-benchmark) compared to raw file reads, as measured across 7 repositories and 28 query types. astix parses 38 programming languages using tree-sitter, stores AST-level relationships in PostgreSQL with pgvector for vector search, and exposes [30+ MCP tools](/docs/mcp-tools) via the MCP standard. It is fully self-hosted with zero code egress and supports BYOK embeddings and BYOM LLM configurations.

## The Problem

Every time you ask Claude Code or Cursor to find a function, rename a symbol, or trace a data flow, it reads raw source files. A 300-line file to find one function signature. A 200-line file to check whether a variable is null by the time it hits the database. Repeat that a few times and you've consumed 50,000 tokens — before the agent has even written a single character of code.

This isn't a model quality problem. It's a tooling problem.

AI coding assistants are powerful reasoners — but they navigate your codebase with the equivalent of grep and intuition. They can't see:

- **Call graphs** — which functions call which, across files and modules
- **Data lineage** — how a variable flows from API boundary to database write
- **Type bindings** — what concrete type a polymorphic call resolves to
- **Blast radius** — what breaks if you change this function's signature

The result is predictable. Agents rename a function but miss 14 callers. They refactor a module and silently break an import three layers deep. They say "done" when they've only touched the surface. Context windows fill up with raw file content, leaving no room for reasoning — and hallucinations follow.

The fundamental problem: reading files is the wrong primitive for code understanding. You need structured queries.

## The Solution: astix

astix maintains a semantic index of your codebase at the AST level. It understands symbols, call relationships, type bindings, and import edges — and it keeps that index fresh automatically as your code changes.

Under the hood, three components work together:

**tree-sitter** parses your source files into concrete syntax trees across 38 languages. Symbols (functions, classes, types, variables) are extracted with their signatures, doc comments, and source ranges. This happens incrementally — only changed files are re-parsed.

**PostgreSQL + pgvector** stores the structural index (symbols, calls, imports) and optional vector embeddings in the same database. No separate vector database to manage. Structural queries go through standard SQL; semantic search goes through pgvector's HNSW index.

**MCP protocol** exposes everything as [30+ MCP tools](/docs/mcp-tools) that any AI assistant can call. Claude Code, Cursor, or any MCP-compatible client connects to astix and gains structured access to your codebase.

The payoff is dramatic. We benchmarked astix against raw file reads across 7 repositories and 28 different queries. The median token reduction: **[128x fewer tokens](/blog/token-benchmark)**.

<MermaidDiagram code="graph LR
    A[&quot;Source Code<br/>38 languages&quot;] -->|tree-sitter| B[&quot;AST Parser&quot;]
    B --> C[&quot;PostgreSQL<br/>+ pgvector&quot;]
    C -->|MCP Protocol| D[&quot;AI Assistant<br/>Claude Code / Cursor&quot;]" />

Instead of reading 300 lines to find a function, `get_symbol` returns exactly the signature, the callers, and the callees — in under 1KB. Instead of scanning 5 files to trace a data flow, `data_lineage` walks the call graph and returns a structured chain.

Token savings aren't just about cost. They're about reliability. An agent that stays within 20K tokens reasons better than one that hits the 200K context limit and starts hallucinating.

## What You Can Do

### Understand

**Call graphs.** `get_symbol` returns every function that calls the target and every function the target calls, recursively. No grep, no manual tracing.

**Data lineage.** `data_lineage` lets you [trace data lineage across functions](/blog/data-lineage) — following a variable from its definition through every assignment, function call, and return statement across file boundaries. Ask "can this variable be null when it hits the database?" and get a structured answer.

**Execution paths.** `get_execution_paths` maps every code path through a function — branches, loops, early returns. Combined with `get_uncovered_paths`, you can see exactly which paths your tests don't cover.

**Impact analysis.** `impact_analysis` calculates the blast radius of changing a symbol — direct callers, transitive callers, inherited classes — and returns a risk level. Change nothing until you understand what you're touching.

### Change Safely

**Rename across the call graph.** `rename_symbol` updates the definition, all call sites, and all import statements in one operation. No missed references.

**Patch with conflict detection.** `patch_symbol` scopes regex replacements to a single symbol's source range — no accidental edits to similarly-named symbols in other files.

**Write tests from coverage gaps.** `get_uncovered_paths` identifies which execution paths lack test coverage. `suggest_tests` generates test skeletons for those gaps. The agent writes tests for what actually matters.

### Stay Private

Self-hosted means self-hosted. Your code never leaves your infrastructure. You bring your own embedding model (OpenAI, Cohere, or a local model via Ollama) and your own LLM for description generation. astix never sees your API keys in a way that would let us bill you — you configure them in your own environment.

Zero code egress. Ever.

## Quick Start

You need Docker and Node.js. Everything else is configured in one command.

```bash
# 1. Start PostgreSQL with pgvector
docker compose up -d

# 2. Install and initialize
npx @astix/mcp-server init

# 3. Add your project
astix add-project /path/to/your/project

# 4. Start the MCP server
astix serve
```

Then add astix to your Claude Code configuration:

```json
{
  "mcpServers": {
    "astix": {
      "command": "astix",
      "args": ["serve", "--stdio"]
    }
  }
}
```

Restart Claude Code and ask it to `search_structural` for any function name in your codebase. First query typically completes in under a second.

[Read the full Getting Started guide →](/docs/getting-started)



## [Pricing](/pricing)

astix is open-source (Apache 2.0). The core structural engine — parsing, call graphs, impact analysis, 30+ read tools — is free.

**Free (self-hosted)** — full read-only access, unlimited lines of code, unlimited projects. No credit card. Self-hosted only.

**Solo — $49/month** (annual) or $59/month — write operations (rename, patch, write_symbol), intelligence features (execution paths, data lineage), unlimited projects. For individual developers.

**Team — $299/month + $29/seat** (annual) or $359 + $39/seat — HTTP daemon mode, OAuth 2.1, RBAC, audit logs, collaboration features. Required for commercial use with 2+ developers.

**Enterprise** — on-prem deployment, air-gap support, SSO/SAML/SCIM, policy engine, SLA. [Contact us](mailto:hello@astix.io).

BYOK and BYOM: you configure your own embedding and LLM providers. We never see your tokens, we never resell them.

> **Launch offer:** 3 months free on annual plans — valid until June 24, 2026. [See pricing →](/pricing)

## What's Next

**More language coverage.** We currently have 10 Tier-1 languages (full call graphs, type bindings, CFG) and 28 more at various levels. TypeScript, JavaScript, Python, Rust, Go, Java, C#, C, C++, and Ruby are Tier 1. If your language is Tier 2 or 3 and you want call graphs, open an issue — prioritization follows demand.

**CI/CD integration.** Impact analysis as a pull request check — "this PR touches 47 callers of a public API, here's the blast radius" before the merge happens.

**Security product.** SAST, taint tracking, and vulnerability detection built on the same AST index. Coming when customers ask for it.

**Contributions welcome.** The core is Apache 2.0. The grammar parsers, the MCP tool schemas, the query engine — all open. If you want to add a language, improve a tool, or fix a bug, the repo is at [github.com/astix-io/astix](https://github.com/astix-io/astix).

Join the conversation on [Slack](https://astix.io/slack) or watch the repo for updates.

</BlogPostLayout>
