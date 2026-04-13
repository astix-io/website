---
title: "128x Token Reduction: MCP Queries vs Raw File Reads"
date: 2026-04-24
dateModified: 2026-04-24
category: technical
featured: false
readingTime: 8
author: "Olivier Orabona"
image: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop
description: "We benchmarked astix against raw file reads across 6 repositories and 24 queries. Average result: 128x fewer tokens for the same answers. Methodology, raw numbers, and where astix loses — included."
tags:
  - benchmark
  - technical
  - token-reduction
  - mcp-tools
  - ai-coding
  - context-window
  - llm-performance
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

128x. That's the average token reduction when you replace raw file reads with structured code queries. We built a benchmark suite to measure this, ran it across 6 real-world repositories, and the number held up. For trace queries specifically, reductions hit 432x.

Here's how we measured it, where the number comes from, and where astix loses.

> Structured code queries are [structured MCP tool calls](/guide/mcp-tools) that return only the requested symbol metadata — signature, callers, callees, type annotations — rather than entire source files. When an AI coding assistant calls `get_symbol` instead of reading a file, the response typically contains 97 tokens instead of 17,858. TOKEN-BENCH measured this difference systematically across 6 open-source repositories and 24 query types, finding an average reduction of 128x. The benchmark compares NAIVE (simulated raw file reads, the approach most AI assistants use) against ASTIX (structured MCP tool responses), counting tokens using `Math.ceil(text.length / 4)` — the same formula used by code-review-graph for a fair head-to-head comparison.

## Why Tokens Matter

Tokens are the unit cost of every AI coding session. Each tool call, each file read, each model response consumes tokens from a shared pool — the context window.

Modern context windows are large (Claude's is 200K tokens, GPT-4o's is 128K) but not unlimited. And context window size isn't just a budget concern — it's a quality concern. Models degrade when context is saturated. Retrieval quality drops. Hallucination risk increases. The agent starts losing track of what it read 50 files ago.

Raw file reads are the primary driver of context saturation in AI coding workflows. A typical feature-sized codebase query might involve:

- Reading 5-10 source files to locate a function
- Reading those files again to understand what calls it
- Reading adjacent files to understand the data flow

That's easily 150K tokens for what a developer with grep and a good memory could answer in 30 seconds.

The other dimension is cost. At standard API rates, 150K tokens of input per coding session adds up. Teams running AI assistants on real codebases are discovering this is their second-largest engineering cost after compute.

## Methodology: TOKEN-BENCH

TOKEN-BENCH is a reproducible benchmark suite that measures token consumption for equivalent coding queries answered two ways: by simulating raw file reads (NAIVE) versus by calling astix MCP tools (ASTIX).

**Repositories tested:**

| Repo | Language | Queries |
|------|----------|---------|
| expressjs/express | JavaScript | 4 |
| tiangolo/fastapi | Python | 4 |
| pallets/flask | Python | 4 |
| gin-gonic/gin | Go | 4 |
| encode/httpx | Python | 4 |
| code-review-graph | Python | 4 |

**Setup:**
- 6 repositories across 3 languages (JavaScript, Python, Go)
- 24 query types covering the most common AI coding tasks (4 per repo)
- Queries matched for semantic equivalence — same answer, different method
- Token counting: `Math.ceil(text.length / 4)` — same formula as code-review-graph for a fair comparison
- Fresh PostgreSQL DB per run, no caching between runs
- Reproducible: `pnpm --filter @astix/mcp-server run benchmark`

**Two approaches measured:**

- **NAIVE baseline**: simulates what Claude Code does natively — Grep to find symbols, then Read with realistic offsets. This is a simulation, not recorded Claude Code traffic — actual agent behavior may differ.
- **ASTIX**: actual MCP tool response size, including schema and envelope overhead (~50–100 tokens per call).

**Query types (4 per repo):**
1. `understand` — function: signature, body, callers, callees
2. `impact` — blast radius: transitive callers
3. `search` — finding code by concept
4. `trace` — execution flow from entry point

**Before/after comparison by query type:**

| Task type | What it measures | NAIVE (avg tokens) | ASTIX (avg tokens) | Reduction |
|-----------|-----------------|-------------------|-------------------|-----------|
| trace | Execution flow from entry point | 4,594 | 18 | 255.9x |
| understand | Function: signature, body, callers, callees | 17,858 | 97 | 156.2x |
| impact | Blast radius: transitive callers | 13,627 | 86 | 88.9x |
| search | Finding code by concept | 2,641 | 1,606 | 9.8x |
| **Overall** | | **9,680** | **452** | **128x** |

**Per-repo breakdown:**

| Repo | Average reduction | Best query | Worst query |
|------|------------------|-----------|-------------|
| expressjs/express | 165.8x | trace: 372.9x | search: 52.4x |
| tiangolo/fastapi | 186.9x | trace: 374.1x | search: 3.2x |
| pallets/flask | 143.9x | trace: 297.9x | search: 0.8x |
| gin-gonic/gin | 127.5x | trace: 432.7x | search: 1.8x |
| encode/httpx | 61.9x | impact: 160.8x | search: 1.0x |
| code-review-graph | 80.1x | impact: 243.1x | search: 1.1x |

> **How does this compare?** code-review-graph reports 8.2x average token reduction on the same repos. astix achieves 128x — 15x more reduction — because it returns structured symbol data (signatures, callers, callees) instead of file-level context.

<MermaidDiagram code="graph LR
    subgraph &quot;Without astix&quot;
        A1[&quot;Read file<br/>2,000-17,858 tokens&quot;] --> A2[&quot;Parse mentally&quot;]
        A2 --> A3[&quot;Read next file<br/>2,000-17,858 tokens&quot;]
    end
    subgraph &quot;With astix&quot;
        B1[&quot;get_symbol<br/>~97 tokens&quot;] --> B2[&quot;Structured response<br/>callers + callees&quot;]
    end" />

## Results: 128x Average, Up to 432x

The average token reduction across all 24 query types and 6 repositories was **128x**.

The range was significant:
- **Low end (0.8x)**: Semantic search on pallets/flask where the NAIVE approach (grep) happened to find the right file immediately and the ASTIX response included rich metadata that slightly exceeded grep cost. Search on popular patterns is where astix has the smallest advantage — and occasionally loses.
- **High end (432.7x)**: Trace queries on gin-gonic/gin where the NAIVE approach requires reading an entire call chain of files to manually follow execution flow.

The 128x average doesn't account for:
- **Re-reads**: AI agents frequently re-read files they've already seen when context shifts. astix responses are cached in the tool call history — no re-read needed.
- **Exploration overhead**: When an agent doesn't know which file to read, it often reads several wrong ones first. `search_structural` finds the right symbol in one call.
- **Response inflation**: File reads return the entire file regardless of what the agent needs. astix tools return only what was asked for.

## Where astix Loses

Being honest about this is important for HN credibility and for setting correct expectations.

**Search on popular patterns: 0.8x–52.4x**

When a search query matches a very common pattern, grep is fast and the matching file is small. In that case, astix's structured response (which includes signatures, callers, callees, and metadata) can actually be larger than a targeted grep result. The `search` query type shows the highest variance: flask search was 0.8x (essentially a tie), express search was 52.4x (astix wins comfortably).

**Impact on isolated symbols: ~2x overhead**

For symbols with 1–2 callers, the overhead of an MCP tool call (schema, envelope, ~50–100 tokens) can approach the cost of simply reading the small file. `impact_analysis` shines on deeply connected code; it's marginal on leaf functions.

**NAIVE is a simulation, not ground truth**

The NAIVE baseline simulates realistic Claude Code behavior (Grep → Read with offsets) but is not recorded traffic from a live agent. Real agent behavior varies: some agents read entire files, some read targeted ranges. Our simulation is conservative — real agents often do worse (more re-reads, wider file reads).

## How It Works

The token efficiency comes from the architecture, not from compression tricks.

### tree-sitter → structured symbols

When you add a project to astix, tree-sitter parses every file into a concrete syntax tree. Functions, classes, types, variables — each becomes a row in PostgreSQL with:

- Symbol name and kind
- File path and line range
- Signature (without the body)
- Doc comment (if present)
- Import edges (what this symbol imports)
- Call edges (what this symbol calls, and what calls it)

This parse happens once per file change. After that, queries hit the database — not the file system.

### PostgreSQL + pgvector → targeted retrieval

A `get_symbol` call for `parseUserInput` returns approximately this:

```json
{
  "name": "parseUserInput",
  "file": "src/parser/input.ts",
  "signature": "function parseUserInput(raw: string): ParsedInput",
  "callers": ["validateRequest", "handleWebhook"],
  "callees": ["stripWhitespace", "tokenize", "buildParseTree"],
  "lines": [42, 67]
}
```

That response is ~97 tokens average. Reading `src/parser/input.ts` to find the same information would consume the entire file — typically 2,000–17,858 tokens depending on file size and how many wrong files the agent reads first.

For semantic search, pgvector's HNSW index finds semantically similar symbols via cosine similarity on their embeddings. Natural-language queries like "find the function that validates email addresses" work without knowing the function name.

### MCP protocol → structured tool calls

The Model Context Protocol gives AI assistants a clean interface for [structured MCP tool calls](/guide/mcp-tools). Instead of `read_file("src/parser/input.ts")` → parse the whole file → find the function, the agent calls `get_symbol("parseUserInput")` → gets exactly what it needs.

The MCP tool call overhead (schema, parameters, response envelope) is roughly 50–100 tokens per call. That's included in the ASTIX numbers above — it's not hidden.

## Reproducing the Benchmark

The benchmark code lives in `packages/mcp-server/src/eval/` in the [astix repository](https://github.com/astix-io/astix). Run it yourself: `pnpm --filter @astix/mcp-server run benchmark`

It requires astix running locally with a PostgreSQL database. The benchmark is language-agnostic — you define queries in a YAML file and TOKEN-BENCH handles token counting and comparison. Instructions and the query set for all 24 query types are in the `eval/` directory.

## Conclusion

The 128x number is real and measured. For trace queries on popular codebases, reductions reach 300–432x. For search queries on small, well-structured codebases, the advantage shrinks to near-zero.

This isn't about AI models getting better at reading code. It's about giving them the right interface in the first place. File reads were designed for human editors who can skim and search visually. AI agents need queryable structure — the same thing developers have been building for IDEs for 20 years.

[Introducing astix](/blog/introducing-astix) explains the full architecture behind these numbers. The benchmark is the proof; the system is the explanation.

[Get started in 10 minutes →](/getting-started) · [Read the launch post →](/blog/introducing-astix)

</BlogPostLayout>
