---
title: "Introducing astix: Code Intelligence for AI Agents"
date: 2026-04-02
category: insights
featured: true
readingTime: 4
author: "astix team"
tldr: "AI coding agents are powerful but blind — they navigate your codebase with grep and guesswork. astix gives them an AST-level structural understanding: call graphs, data lineage, impact analysis, and safe refactoring tools. Self-hosted, 36 languages, 30+ MCP tools."
tags:
  - announcement
  - code-intelligence
  - mcp
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

AI coding agents are powerful — but they're navigating your codebase blind. They can read files and run grep, but they can't understand how your code actually works: which functions call which, how data flows across modules, or what the blast radius of a change looks like.

## The Problem

When you ask an AI agent to "rename this function safely" or "find all the code that handles payments," it resorts to text search. That works for simple cases, but falls apart in real codebases with:

- **Cross-file references** that grep can't reliably trace
- **Polymorphism and inheritance** that require type-level understanding
- **Transitive dependencies** that span multiple layers

The result? Agents that rename a function but miss 14 callers. Agents that refactor code and silently break imports. Agents that say "done" when they've only touched the surface.

## What astix Does

astix maintains an AST-level index of your codebase — symbols, calls, imports, type bindings — backed by PostgreSQL and tree-sitter. When an embedding provider is configured, it also supports natural-language semantic search.

Your AI agent connects to astix via the Model Context Protocol (MCP) and gets access to 30+ tools for understanding, analyzing, and safely modifying code.

### Understand

- **Call graphs** — who calls what, across files and modules
- **Data lineage** — trace variable flow from input to database
- **Execution paths** — map all branches through a function
- **Impact analysis** — know the blast radius before changing anything

### Change Safely

- **Rename** across the entire call graph + import statements
- **Patch** with conflict detection and rollback
- **Write tests** from coverage gap analysis

### Stay Private

- 100% self-hosted, your infrastructure
- BYOK embeddings and LLM (or use local models via Ollama)
- Zero code egress — ever

## Getting Started

Install and run your first query in under 10 minutes:

```bash
npx @astix/mcp-server init
astix add-project .
astix serve
```

Then connect your favorite MCP client — Claude Code, Cursor, or any MCP-compatible tool.

[Read the Getting Started guide →](/getting-started)

## What's Next

We're building in public. Follow our progress on [GitHub](https://github.com/astix-io/astix) and join the conversation on [Slack](https://astix.io/slack).

</BlogPostLayout>
