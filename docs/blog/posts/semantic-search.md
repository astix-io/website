---
title: "Semantic Code Search: Find by Intent, Not by Name"
date: 2026-04-24
dateModified: 2026-04-24
category: tutorials
featured: false
readingTime: 9
author: "Olivier Orabona"
image: https://images.unsplash.com/photo-1516382799247-87df95d790b7?w=800&h=400&fit=crop
description: "Combine BM25 keyword matching with vector embeddings to find code by what it does, not what it's called. Search 20K files in milliseconds with astix."
tags:
  - semantic-search
  - embeddings
  - bm25
  - vector-search
  - code-navigation
  - developer-tools
  - grep-alternative
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

You need the function that validates email addresses. You open your terminal and type `grep -r "email" src/`. Two hundred matches. You narrow it to `grep -r "validate" src/`. Eighty more. You scan them one by one. The function you're looking for is called `checkInput`. It lives in `lib/forms/utils.ts`. It appears in neither search.

This is the naming problem. Code is written by humans who choose names for reasons that made sense at 3pm on a Tuesday. Those names often encode *how* something works, not *what* it does. `checkInput` validates email format. `processRecord` persists a transaction to the database. `handleResponse` parses a paginated API result and extracts the cursor. Grep doesn't know any of this.

The answer isn't a better regex. It's a search system that understands intent — one that can answer "find me the function responsible for email validation" without requiring that the word "email" appear in the function's name. That's what astix semantic search does, and this post is a complete walkthrough of how it works and when to reach for each mode.

Semantic code search combines keyword matching (BM25) with vector embeddings to find code by what it does, not what it is called. When a developer searches for "email validation logic," traditional grep returns every file containing the word "email" — often hundreds of irrelevant results. Semantic search embeds the query into the same vector space as the codebase's function signatures and documentation, returning functions ranked by conceptual similarity. astix implements hybrid search using Reciprocal Rank Fusion (RRF) to merge BM25 keyword scores with cosine similarity from pgvector embeddings. The result is high-precision code discovery that works even when function names don't match the search intent — finding `checkInput` when you search for "email validation."

## Three Search Modes

astix exposes one tool — `search_semantic` — with three distinct search strategies. Choosing the right one depends on what you know and what you're looking for.

### BM25 — keyword matching with TF-IDF ranking

BM25 (Best Match 25) is the same algorithm that powers Elasticsearch and Lucene. It scores documents based on term frequency and inverse document frequency: terms that appear often in a specific document but rarely across the corpus rank higher. It's fast, deterministic, and excellent when you know the right vocabulary.

```json
{
  "tool": "search_semantic",
  "params": {
    "query": "email validation",
    "mode": "bm25",
    "project": "my-app"
  }
}
```

BM25 shines for API surface exploration — when you know a library's terminology and want exact matches. It fails when the codebase uses different vocabulary than you do.

### Vector — embedding cosine similarity

Vector search converts both your query and every indexed symbol into a high-dimensional embedding (via OpenAI, Cohere, or a local Ollama model). At query time, it finds the symbols whose embeddings are closest to your query embedding by cosine similarity. The model has been trained on vast amounts of code and natural language, so it understands that "validates email format" and `checkInput(email: string): boolean` describe related concepts — even without shared words.

```json
{
  "tool": "search_semantic",
  "params": {
    "query": "validates that an email address is properly formatted",
    "mode": "vector",
    "project": "my-app"
  }
}
```

Vector search retrieves things you can't name. Its weakness: it can surface semantically adjacent results that aren't quite what you want. Precision suffers when the query is generic.

### Hybrid — RRF fusion (recommended default)

Hybrid mode runs both BM25 and vector search in parallel and fuses their ranked lists using Reciprocal Rank Fusion (RRF). RRF assigns each result a score of `1 / (rank + k)` from each ranker and sums them. Results that appear high in both lists score highest. Results that appear in only one list still surface — you don't lose recall — but at a lower rank.

```json
{
  "tool": "search_semantic",
  "params": {
    "query": "email validation",
    "mode": "hybrid",
    "project": "my-app",
    "limit": 5
  }
}
```

```json
{
  "results": [
    {
      "file": "lib/forms/utils.ts",
      "name": "checkInput",
      "kind": "function",
      "signature": "checkInput(value: string, field: 'email' | 'phone' | 'zip'): ValidationResult",
      "score": 0.94,
      "_meta": { "bm25_rank": 3, "vector_rank": 1, "query_duration_ms": 12 }
    },
    {
      "file": "services/auth/validators.ts",
      "name": "assertValidEmailDomain",
      "kind": "function",
      "signature": "assertValidEmailDomain(address: string): void",
      "score": 0.87,
      "_meta": { "bm25_rank": 1, "vector_rank": 4, "query_duration_ms": 12 }
    },
    {
      "file": "lib/forms/schemas.ts",
      "name": "emailSchema",
      "kind": "variable",
      "signature": "const emailSchema: z.ZodString",
      "score": 0.81,
      "_meta": { "bm25_rank": 2, "vector_rank": 6, "query_duration_ms": 12 }
    }
  ]
}
```

`checkInput` ranked first despite its non-descriptive name — vector search knew what it does and promoted it to rank 1, compensating for its poor BM25 score. `assertValidEmailDomain` ranked first in BM25 (literal keyword match) but lower in vector (it validates domain existence, not format). Hybrid fusion correctly places them in order of relevance.

Use `mode: "hybrid"` by default. Switch to `"bm25"` when you know the exact terminology. Switch to `"vector"` when you're searching by concept in a codebase with inconsistent naming.

<MermaidDiagram code="graph TB
    Q[&quot;Query: 'email validation'&quot;] --> BM[&quot;BM25 Engine<br/>keyword matching&quot;]
    Q --> VE[&quot;Vector Engine<br/>embedding similarity&quot;]
    BM --> R1[&quot;Rank 1: checkInput<br/>Rank 2: validateForm<br/>Rank 3: sanitize&quot;]
    VE --> R2[&quot;Rank 1: validateForm<br/>Rank 2: checkInput<br/>Rank 3: isValidEmail&quot;]
    R1 --> RRF[&quot;RRF Fusion&quot;]
    R2 --> RRF
    RRF --> F[&quot;Final: validateForm 0.94<br/>checkInput 0.91<br/>isValidEmail 0.87&quot;]" />

## Enriching Search with Descriptions

Embeddings are generated from symbol signatures and doc comments. A function with no doc comment embeds its signature alone — which may carry little semantic information. `checkInput(value: string, field: string): ValidationResult` doesn't tell you much.

`set_description` attaches a one-line LLM-generated (or manually written) description to any symbol. This description is indexed separately and boosts BM25 discriminative power significantly — it's the difference between matching on `checkInput` and matching on "validates email, phone, or zip code format before form submission."

```json
{
  "tool": "set_description",
  "params": {
    "file": "lib/forms/utils.ts",
    "name": "checkInput",
    "description": "Validates that a form field value matches the expected format for email, phone, or zip code; returns a ValidationResult with error messages on failure."
  }
}
```

The same query — `"email validation"` — now returns `checkInput` at rank 1 across both BM25 and vector. Before the description existed, vector search found it at rank 3 and BM25 missed it entirely.

For an established codebase, setting descriptions manually is impractical. `fill_descriptions` runs a background job that auto-generates descriptions for all functions without one, using your configured LLM provider:

```json
{
  "tool": "fill_descriptions",
  "params": {
    "project": "my-app",
    "limit": 500
  }
}
```

The job runs asynchronously. Poll progress with `fill_descriptions_status`. On a 50K-line codebase, expect 10–20 minutes with a local Ollama model. After it completes, every function in your index has a searchable one-liner. Search precision improves across the board — not just for the symbols you explicitly described.

One rule for good descriptions: be specific. "Validates email format" is good. "Processes data and returns results" is noise. BM25 IDF penalizes common words — a description full of generic terms (`process`, `handle`, `data`, `result`) matches everything and discriminates nothing.

One more factor that degrades search precision: [dead exports in the index](/blog/dead-code-detection#dead-exports-degrade-search-precision). A function that is exported but never called by anything still has embeddings — and those embeddings participate in every search. If a dead symbol is semantically similar to your query, it surfaces in results. You follow the reference, realize the function is vestigial, and lose time. Keeping the index clean with `code_health` directly improves search signal.

## Scaling to 20,000 Files

Grep has a scaling problem that isn't just speed. On a large Next.js application — 20,000 files, 800,000 lines — `grep -r "email"` returns thousands of matches across test fixtures, generated types, migration files, and lockfiles. You then pipe through `grep -v` to exclude noise, add `--include="*.ts"` to scope it, and still end up reading 200 results manually. The cognitive load is the bottleneck, not the I/O.

Vector search with pgvector's HNSW index is sub-100ms on a 20K-file corpus. The `_meta.query_duration_ms` field in every response tells you the exact cost:

```json
{
  "_meta": {
    "query_duration_ms": 23,
    "total_symbols_searched": 187432,
    "results_returned": 10
  }
}
```

23 milliseconds to search 187K symbols. That's not grep's 3 seconds being optimized — that's a fundamentally different operation. Vector search returns the 10 most semantically similar symbols from the entire corpus in one round trip. No pipe, no exclude, no manual scan.

Cross-project search extends this to your entire organization. If your monorepo has a shared `packages/` directory and several application packages, pass `project="*"` to [search across polyglot codebases](/blog/multi-language#search-across-polyglot-codebases) simultaneously:

```json
{
  "tool": "search_semantic",
  "params": {
    "query": "rate limiting middleware",
    "mode": "hybrid",
    "project": "*",
    "limit": 8
  }
}
```

Results include a `project` field in each entry so you can see which package each match comes from. This is how you find the rate limiter that the `api` package uses before re-implementing one in `gateway`.

## Community-Boosted Search

Within a large codebase, "relevant" has a spatial dimension. If you're working in `packages/auth/` and searching for "token refresh logic", you probably want results from the auth subsystem ranked above identical-scoring results from `packages/payments/`. Community boost does exactly that.

astix uses a graph community detection algorithm (Leiden/Louvain) to identify clusters of tightly coupled symbols — files and functions that call each other frequently form a community. When you pass `community_boost: true`, results from the same community as your recently accessed symbols are scored higher:

```json
{
  "tool": "search_semantic",
  "params": {
    "query": "token refresh logic",
    "mode": "hybrid",
    "project": "my-app",
    "community_boost": true,
    "limit": 6
  }
}
```

```json
{
  "results": [
    {
      "file": "packages/auth/token.ts",
      "name": "refreshAccessToken",
      "score": 0.96,
      "_meta": { "community": "auth-core", "community_boost_applied": true }
    },
    {
      "file": "packages/auth/session.ts",
      "name": "extendSession",
      "score": 0.91,
      "_meta": { "community": "auth-core", "community_boost_applied": true }
    },
    {
      "file": "packages/payments/billing.ts",
      "name": "renewSubscriptionToken",
      "score": 0.88,
      "_meta": { "community": "payments-core", "community_boost_applied": false }
    }
  ]
}
```

`renewSubscriptionToken` is semantically similar but not in the auth community — it surfaces third, not first. This is the right answer when you're exploring the auth subsystem and don't want adjacent-but-wrong results cluttering the top of the list.

Community boost is most useful during deep-dive sessions — when you've been working in one area and want search to stay contextually local. For broad exploration or cross-cutting queries, leave it off.

## Search vs Grep: The Numbers

Here's a concrete comparison on a real codebase: a TypeScript monorepo with 340 files, 42,000 lines of code, 2,100 exported symbols.

| Method | Query | Results | Precision | Time |
|--------|-------|---------|-----------|------|
| `grep -r "validate"` | `validate` | 847 lines | ~5% | 180ms |
| `grep -r "email"` | `email` | 412 lines | ~12% | 95ms |
| `search_structural` | `checkInput` | 1 result | 100% | 8ms |
| `search_semantic` (BM25) | `email validation` | 8 results | ~60% | 14ms |
| `search_semantic` (hybrid) | `email validation` | 8 results | ~88% | 23ms |

Precision is measured as the fraction of returned results that were actually relevant to the query intent. Grep achieves high recall but catastrophic precision — you get everything that contains the word, useful or not. `search_structural` is perfect for exact name lookups but useless when you don't know the name. Semantic hybrid gives you 88% precision at 8 results — meaning 7 of 8 results are genuinely what you were looking for.

The numbers that matter for daily use: grep forces you to read hundreds of results mentally. Semantic search returns 5–10 results you can act on immediately. The cost difference isn't query latency — it's the cognitive overhead of manual result filtering that grep imposes and semantic search eliminates.

One more comparison worth noting: `search_structural` vs `search_semantic`. Use `search_structural` when you know the symbol name — it's exact-match and returns in under 10ms. Use `search_semantic` when you know the intent. They're complementary, not competing.

## Code Discovery at the Speed of Thought

The function you need exists. It always has. The question is whether you find it in 30 seconds or 30 minutes — and whether the search process interrupts your thinking or fits inside it.

`grep` requires you to already know the name. It's a lookup tool dressed as a search tool. Semantic search accepts what you actually have: a description of behavior, a half-remembered concept, a job-to-be-done. You type what you're looking for in plain language and get back ranked, relevant results.

Combine `search_semantic` with [`get_symbol`](/blog/impact-analysis#understand-callers-and-callees) and you have the complete discovery workflow: find the function by intent, read its signature and callers in one call, understand it in context. No file scanning, no tab-opening, no context window pollution from reading 300-line files to find one function.

For large codebases, this isn't a quality-of-life improvement — it's the difference between understanding the system and operating in the dark.

[Read the MCP tools reference →](/docs/mcp-tools) or [run your first semantic query in 10 minutes →](/docs/getting-started).

</BlogPostLayout>
