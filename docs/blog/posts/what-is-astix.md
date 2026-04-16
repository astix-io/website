---
title: "What is astix?"
date: 2026-04-16
dateModified: 2026-04-16
category: guide
featured: false
readingTime: 3
author: "Olivier Orabona"
image: https://astix.io/og-image.png
description: "astix is a self-hosted semantic code intelligence platform that gives AI coding assistants (Claude Code, Cursor, Copilot) structured access to codebases via MCP."
tags:
  - definition
  - semantic-code-intelligence
  - mcp
  - ast
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

> astix is a self-hosted semantic code intelligence platform that gives AI coding assistants structured access to codebases through the Model Context Protocol (MCP). Instead of reading raw source files line by line, an AI assistant queries astix for specific symbols, call graphs, data lineage, and impact analysis — receiving only the relevant metadata. This approach reduces token consumption by a median of [128x compared to raw file reads](/blog/token-benchmark), measured across 6 repositories and 24 query types. astix parses 38 programming languages via tree-sitter, stores AST-level relationships in PostgreSQL with pgvector, and exposes [40+ MCP tools](/docs/mcp-tools) following the MCP standard. It is fully self-hosted with zero code egress and supports BYOK embeddings and BYOM LLM configurations.

## The problem astix solves

AI coding assistants read source files. When Claude Code needs to understand how a function is used, it greps. When it wants to rename a symbol safely, it reads every file that might contain a reference. This burns tokens, loses context between sessions, and still misses cross-file edges that only show up through the call graph.

astix inverts the model. Code gets parsed once, indexed structurally, and queried on demand. An agent asks *"who calls `processOrder` and what would break if I rename it?"* and gets a structured answer — callers, call sites, import graph, risk level — in a few hundred tokens instead of tens of thousands.

## What "semantic code intelligence" means here

Three layers, all derived from a tree-sitter parse:

1. **Structural index** — every symbol (function, class, variable, type), every call edge, every import edge, stored in PostgreSQL and kept fresh via lazy sync.
2. **Semantic layer** — embeddings of symbol signatures and documentation, enabling natural-language search alongside exact-match structural search.
3. **Analysis layer** — call graphs, data lineage across branches, impact analysis with blast radius, execution paths, dead-code detection, taint tracking for security.

Every operation is an MCP tool call. Any MCP-compatible client works: Claude Code, Cursor, Copilot, Cline, custom agents.

## How it compares

- **Versus `grep` / `ripgrep`**: astix answers "who calls this?" not "which files mention this string?". Comments, string literals, and variable-name collisions don't produce false positives.
- **Versus Sourcegraph**: astix runs on your laptop or a single PostgreSQL instance — no Kubernetes, no enterprise contract. Apache 2.0 for core, Elastic License v2 for premium.
- **Versus Semgrep**: astix's taint tracking operates on the same index as its refactoring tools. Source→sink detection for SQL injection, XSS, SSRF works across function boundaries without writing rules.

## Getting started

One command: `npx @astix/mcp-server init`. See the [10-minute setup guide](/docs/getting-started) or read the full [MCP tools reference](/docs/mcp-tools).

</BlogPostLayout>
