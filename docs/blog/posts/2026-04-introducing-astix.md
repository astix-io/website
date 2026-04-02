---
title: "Introducing astix: Code Intelligence for AI Agents"
date: 2026-04-02
category: insights
featured: true
readingTime: 4
---

# Introducing astix: Code Intelligence for AI Agents

AI coding agents are powerful — but they're navigating your codebase blind. They can read files and run grep, but they can't understand how your code actually works: which functions call which, how data flows across modules, or what the blast radius of a change looks like.

## The Problem

When you ask an AI agent to "rename this function safely" or "find all the code that handles payments," it resorts to text search. That works for simple cases, but falls apart in real codebases with:

- **Cross-file references** that grep can't reliably trace
- **Polymorphism and inheritance** that require type-level understanding
- **Transitive dependencies** that span multiple layers

## What astix Does

astix maintains an AST-level index of your codebase — symbols, calls, imports, type bindings — backed by PostgreSQL and tree-sitter. When an embedding provider is configured, it also supports natural-language semantic search.

Your AI agent connects to astix via the Model Context Protocol (MCP) and gets access to 30+ tools for understanding, analyzing, and safely modifying code.

## Getting Started

Install and run your first query in under 10 minutes:

```bash
npx @astix/mcp-server init
astix add-project .
astix serve
```

Then connect your favorite MCP client — Claude Code, Cursor, or any MCP-compatible tool.

[Read the Getting Started guide →](/getting-started)
