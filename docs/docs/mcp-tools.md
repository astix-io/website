---
title: "MCP Tools Reference — 40+ Code Intelligence Tools"
description: "Complete reference for astix MCP tools: semantic search, impact analysis, data lineage, code health, rename, patch, and 35+ more structured code intelligence operations."
---

<script setup>
import ToolSearch from '../.vitepress/theme/components/ToolSearch.vue'
import { ref, onMounted } from 'vue'

const filterQuery = ref('')

function handleFilter(q) {
  filterQuery.value = q.toLowerCase()
  if (typeof document === 'undefined') return
  const headings = document.querySelectorAll('.vp-doc h3[id]')
  headings.forEach(h3 => {
    const block = [h3]
    let sibling = h3.nextElementSibling
    while (sibling && sibling.tagName !== 'H3' && sibling.tagName !== 'H2') {
      block.push(sibling)
      sibling = sibling.nextElementSibling
    }
    const text = block.map(el => el.textContent || '').join(' ').toLowerCase()
    const match = !filterQuery.value || text.includes(filterQuery.value)
    block.forEach(el => el.style.display = match ? '' : 'none')
  })
}
</script>

# MCP Tools Reference

astix exposes 40+ tools over the Model Context Protocol, grouped into eight categories. All tools accept an optional `project` parameter (string, array, or glob) to target a specific registered project. If omitted, the active project (set by `set_active_project`) is used.

<ToolSearch @filter="handleFilter" />

---

## Search

### `search_structural`

Find symbols by name pattern. Searches the AST index — instant, no embeddings required. Supports cross-project queries.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pattern` | string | Yes | — | Glob-like name pattern (`*Handler*`, `get*`). Use `"*"` with `doc_query` to match all |
| `kind` | string[] | No | — | Filter by symbol kind: `"function"`, `"class"`, `"method"`, `"variable"`, `"interface"`, `"type_alias"` |
| `language` | string | No | — | Filter by language: `"typescript"`, `"python"`, `"go"`, `"rust"` |
| `exported_only` | boolean | No | `false` | Only exported symbols |
| `path` | string | No | — | Restrict to files under this directory (e.g. `"src/sync/"`) |
| `signature` | string | No | — | ILIKE pattern on the symbol signature (e.g. `"%SqlExecutor%"`) |
| `doc_query` | string | No | — | Search within doc comments / JSDoc |
| `parent` | string | No | — | Only symbols with this parent class/interface name |
| `has_parents` | boolean | No | `false` | Only symbols that have any inheritance relationship |
| `limit` | number | No | `10` | Max results (max: 50) |
| `offset` | number | No | `0` | Skip N results for pagination |
| `cursor` | string | No | — | Opaque pagination cursor from previous response |
| `project` | string \| string[] | No | active | Project name, array, or glob (e.g. `"*"`, `"api-*"`) |
| `from_project` | string | No | — | Boost results from dependencies of this project |
| `community_boost` | boolean | No | `false` | Boost by community cohesion (requires `detect_communities` with `persist=true`) |
| `community_id` | number | No | — | Boost results from a specific community (0-indexed). Implies `community_boost=true` |
| `community_label` | string | No | — | Boost results from communities matching this label substring |
| `boost_weight` | number | No | `0.2` | Community boost strength (0–1) |
| `boost_mechanism` | string | No | `"multiply"` | Boost strategy: `"multiply"` (M1), `"rerank"` (M2), `"sql"` (M3, falls back to M1) |

**Example request**

```json
{
  "pattern": "handle*Payment*",
  "kind": ["function"],
  "exported_only": true
}
```

**Example response** (abbreviated)

```json
{
  "results": [
    {
      "name": "handlePayment",
      "kind": "function",
      "file": "src/payments/handler.ts",
      "start_line": 42,
      "end_line": 87,
      "exported": true,
      "signature": "async function handlePayment(order: Order): Promise<Receipt>"
    }
  ],
  "count": 1
}
```

---

### `search_semantic`

Find symbols by natural-language intent. Uses vector embeddings and/or BM25 keyword search. Requires an embedding provider for `vector` and `hybrid` modes; `bm25` always works.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | — | Natural language description (e.g. `"function that validates email addresses"`) |
| `mode` | string | No | `"hybrid"` | `"hybrid"` (vector + BM25), `"vector"` (embedding only), `"bm25"` (keyword only) |
| `language` | string | No | — | Filter by language |
| `kind` | string[] | No | — | Filter by symbol kind |
| `limit` | number | No | `10` | Max results (max: 50) |
| `offset` | number | No | `0` | Skip N results for pagination |
| `exclude_files` | string[] | No | — | Glob patterns to exclude (e.g. `["*.lock", "pnpm-lock.yaml"]`) |
| `weight_bm25` | number | No | adaptive | Explicit BM25 weight for hybrid mode (0–1). Omit for adaptive weighting |
| `since` | string | No | — | ISO 8601 date — only symbols from files modified after this date |
| `scope` | string | No | — | `"source"` (source_dirs only), `"docs"` (doc_dirs only), `"all"` (both) |
| `project` | string \| string[] | No | active | Project name, array, or glob |
| `from_project` | string | No | — | Boost results from dependencies of this project |
| `community_boost` | boolean | No | `false` | Boost by community cohesion |
| `community_id` | number | No | — | Boost from specific community |
| `community_label` | string | No | — | Boost from communities matching label |
| `boost_weight` | number | No | `0.2` | Community boost strength (0–1) |
| `boost_mechanism` | string | No | `"multiply"` | `"multiply"`, `"rerank"`, or `"sql"` |

**Example request**

```json
{
  "query": "functions that validate email addresses",
  "mode": "hybrid",
  "kind": ["function"]
}
```

**Example response** (abbreviated)

```json
{
  "results": [
    {
      "name": "isValidEmail",
      "kind": "function",
      "file": "src/utils/validation.ts",
      "start_line": 17,
      "score": 0.92,
      "signature": "function isValidEmail(email: string): boolean"
    }
  ],
  "count": 1
}
```

::: tip
Use specific domain terms — avoid generic words like `"code"`, `"data"`, or `"function"`. They match everything and dilute results.
:::

---

## Symbol Navigation

### `get_symbol`

Look up a single symbol by file path and name or line number. Always includes callers, callees, and parents. Omit `name` and `line` to list all symbols in the file.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `name` | string | No | — | Symbol name (fuzzy match). Omit to list all symbols in the file |
| `line` | number | No | — | Line number (alternative to `name`) |
| `include_body` | boolean | No | `false` | Include the full source body |
| `include_children` | boolean | No | `false` | Include child symbols (e.g. methods of a class) |
| `depth` | number | No | `1` | Children recursion depth |
| `include_parents` | boolean | No | `true` | Include parent class/interface hierarchy |
| `include_inherited_by` | boolean | No | `false` | Include classes that extend this symbol |
| `project` | string | No | active | Project name |

**Example request**

```json
{
  "file": "src/payments/handler.ts",
  "name": "handlePayment",
  "include_body": false
}
```

**Example response** (abbreviated)

```json
{
  "name": "handlePayment",
  "kind": "function",
  "file": "src/payments/handler.ts",
  "start_line": 42,
  "end_line": 87,
  "exported": true,
  "signature": "async function handlePayment(order: Order): Promise<Receipt>",
  "body_hash": "abc123",
  "file_hash": "xyz789",
  "callers": [
    { "name": "processCheckout", "file": "src/checkout.ts", "line": 88, "kind": "call" }
  ],
  "callees": [
    { "name": "validateOrder", "file": "src/payments/validate.ts", "line": 55, "resolved": true },
    { "name": "chargeCard", "file": "src/payments/stripe.ts", "line": 61, "resolved": true }
  ],
  "parents": []
}
```

::: tip
`body_hash` and `file_hash` are used for optimistic concurrency with write tools (`patch_symbol`, `write_symbol`, etc.).
:::

---

### `get_symbols`

Batch-fetch multiple symbols in a single call. Each symbol is specified as `"file:name"` or `"file:name:line"` (line disambiguates overloads). Cap: 20 symbols per call.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `symbols` | string[] | Yes | — | Refs in `"file:name"` or `"file:name:line"` format |
| `include_body` | boolean | No | `false` | Include source code |
| `include_callers` | boolean | No | `true` | Include callers per symbol |
| `include_callees` | boolean | No | `true` | Include callees per symbol |
| `include_children` | boolean | No | `false` | Include child symbols |
| `depth` | number | No | `1` | Children depth |
| `include_parents` | boolean | No | `true` | Include parent hierarchy |
| `include_inherited_by` | boolean | No | `false` | Include inheriting classes |
| `project` | string | No | active | Project name |

**Example request**

```json
{
  "symbols": [
    "src/utils.ts:formatDate",
    "src/payments/handler.ts:handlePayment"
  ],
  "include_body": false
}
```

**Response**: JSON array of results, one per requested symbol, each with `found: true/false` and the same shape as `get_symbol`. Invalid refs are returned as partial errors in metadata rather than failing the entire batch.

---

### `get_variable_defs`

Find variable definitions matching criteria. Returns name, kind, file, line, scope, and enclosing symbol. At least one of `file` or `name` must be provided.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | No* | — | File path (relative to project root). *At least one of `file`/`name` required |
| `name` | string | No* | — | Variable name pattern (SQL ILIKE, supports `%`) |
| `kind` | string[] | No | — | Filter: `"const"`, `"let"`, `"var"`, `"parameter"`, `"for_variable"` |
| `symbol` | string | No | — | Enclosing function/method name pattern (ILIKE) |
| `include_uses` | boolean | No | `false` | Aggregate all uses for each definition |
| `limit` | number | No | `20` | Max results (max: 100) |
| `offset` | number | No | `0` | Skip N results |
| `project` | string | No | active | Project name |

---

### `get_variable_uses`

Find all uses of variable definitions. Returns definition location and each use location with its kind. At least one of `file` or `name` must be provided.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | No* | — | File path containing the definition |
| `name` | string | No* | — | Variable name (exact or ILIKE pattern with `%`) |
| `def_line` | number | No | — | Definition line number (disambiguates same-name variables in different scopes) |
| `access_mode` | string[] | No | — | Filter: `"read"`, `"write"`, `"read_write"` |
| `use_context` | string[] | No | — | Filter: `"default"`, `"param_pass"`, `"return"`, `"attribute_access"`, `"spread_source"` |
| `limit` | number | No | `20` | Max results (max: 100) |
| `offset` | number | No | `0` | Skip N results |
| `project` | string | No | active | Project name |

---

## Analysis

### `impact_analysis`

Compute the blast radius of changing a symbol. Returns risk level, direct callers, transitive callers, importers, and affected files. Use before any refactoring.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `name` | string | Yes | — | Symbol name |
| `depth` | number | No | `3` | Traversal depth (max: 10) |
| `max_results` | number | No | `100` | Cap on total callers (max: 500) |
| `project` | string | No | active | Project name |

**Example response** (abbreviated)

```json
{
  "risk_level": "high",
  "direct_callers": 3,
  "transitive_callers": 14,
  "inherited_by_count": 0,
  "importers": 2,
  "affected_files": ["src/checkout.ts", "src/api/orders.ts", "src/webhooks/stripe.ts"],
  "truncated": false
}
```

`risk_level` values: `"low"`, `"medium"`, `"high"`, `"unknown"` (unsupported language).

---

### `data_lineage`

Trace a variable's flow from its definition through all transformations, propagations, and function calls. Returns an ordered chain showing where data is read, transformed, passed, or returned.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `name` | string | No | — | Symbol name (function/method). If omitted, analyzes exported/public symbols |
| `variable` | string | No | — | Variable name to trace. If omitted, traces param-derived variables |
| `maxDepth` | number | No | `10` | Maximum propagation hops (max: 50) |
| `limit` | number | No | `100` | Maximum total traces returned (max: 500) |
| `max_paths` | number | No | `10` | Maximum execution paths returned (max: 256) |
| `crossFunction` | boolean | No | `false` | Enable inter-procedural tracing: follow data into called functions |
| `crossFunctionDepth` | number | No | `1` | Max cross-function hops when `crossFunction=true` (max: 3) |
| `project` | string | No | active | Project name |

---

### `trace_flow`

Generate a Mermaid flowchart or narrative trace of a function's execution flow. Follows the call graph BFS, annotating steps with descriptions and control structures (if/else, switch, loops, try/catch).

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `name` | string | No | — | Function name (required if `line` not provided) |
| `line` | number | No | — | Line number (alternative to `name`) |
| `depth` | number | No | `5` | Max recursion depth (max: 10, `0` = unlimited) |
| `max_nodes` | number | No | `100` | Max total nodes to trace (max: 500, `0` = unlimited) |
| `format` | string | No | `"mermaid"` | Output format: `"mermaid"` (flowchart TD), `"sequence"` (sequenceDiagram), `"state"` (stateDiagram-v2), `"json"` (D3/React Flow), `"text"`, `"markdown"` |
| `project` | string | No | active | Project name |

**Note:** Returns the trace directly as text/Mermaid, not JSON.

---

### `get_execution_paths`

Return all execution paths through a function (CFG-based). Each path is a sequence of nodes representing one possible execution sequence. Requires a Tier 1 language.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `name` | string | No | — | Symbol name. If omitted, returns paths for all functions in the file |
| `max_paths` | number | No | `64` | Maximum paths per symbol (max: 256) |
| `project` | string | No | active | Project name |

---

### `get_uncovered_paths`

Cross-reference execution paths with Istanbul/v8 or lcov coverage data to identify code paths not exercised by tests.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `name` | string | No | — | Symbol name. If omitted, returns coverage for all functions in the file |
| `coverage_path` | string | No | `"coverage/coverage-final.json"` | Path to Istanbul JSON (`coverage-final.json`) or lcov (`lcov.info`). Format auto-detected |
| `project` | string | No | active | Project name |

---

### `detect_communities`

Detect logical module clusters using the Leiden community detection algorithm. Groups symbols by call graph and import dependencies. Returns each community with files, symbols, cohesion score, and a generated label.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `resolution` | number | No | `1.0` | Leiden resolution parameter. Higher = more, smaller communities |
| `min_community_size` | number | No | `2` | Minimum symbols per community to include |
| `max_community_size` | number | No | — | Exclude communities larger than this (filters the "everything else" mega-community) |
| `exclude_tests` | boolean | No | `true` | Exclude test files from the graph |
| `limit` | number | No | — | Return only top N communities (sorted by size descending) |
| `include_symbols` | boolean | No | `false` | Include symbol names per file |
| `community_id` | number | No | — | Return details of a specific community (0-indexed). Ignores other filters |
| `label` | string | No | — | Filter communities by label (case-insensitive substring) |
| `persist` | boolean | No | `false` | Persist assignments to DB for use in search boost. Clears previous results |
| `project` | string | No | active | Project name |

**Example response** (abbreviated)

```json
{
  "_meta": { "last_sync": "2026-04-11T10:00:00Z" },
  "total_symbols": 842,
  "total_communities": 12,
  "modularity": 0.74,
  "communities": [
    {
      "id": 0,
      "label": "payment-processing",
      "size": 34,
      "cohesion": 0.82,
      "files": ["src/payments/handler.ts", "src/payments/stripe.ts"]
    }
  ]
}
```

---

## Code Health

### `code_health`

Run a code health check on the indexed codebase. Returns paginated findings with `total_count`.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `check` | string | Yes | — | Which check to run. See all values below |
| `limit` | number | No | `20` | Max findings (max: 100) |
| `offset` | number | No | `0` | Skip N findings for pagination |
| `language` | string | No | — | Filter by language |
| `path` | string | No | — | Filter by file path prefix |
| `include_files` | string[] | No | — | Glob patterns to include (e.g. `["src/**/*.ts"]`) |
| `exclude_files` | string[] | No | — | Glob patterns to exclude (e.g. `["*.spec.ts"]`) |
| `project` | string | No | active | Project name |

**Check-specific parameters**

| Check | Extra parameters |
|-------|-----------------|
| `high_coupling` | `min_callers` (number, default: 20) |
| `god_functions` | `min_callees` (number, default: 15) |
| `large_files` | `min_symbols` (number, default: 30) |
| `complex_functions` | `min_lines` (number, default: 50); `min_complexity` (integer, minimum cognitive complexity score) |
| `data_flow` | `min_chain_length` (integer ≥ 2, default: 5) |
| `unused_variables` | `include_params` (boolean, default: false) — include function parameters |
| `hardcoded_values` | `categories` (`"secret"`, `"hardcoded_url"`, `"hardcoded_ip"`, default: all); `custom_patterns` (string[], PostgreSQL regex patterns) |
| `taint` | `taint_categories` (string[], filter by `"sqli"`, `"xss"`, `"path_traversal"`, `"ssrf"`, `"log_injection"`) |

**Available checks**

| Check name | What it detects |
|------------|----------------|
| `dead_code` | Exported symbols with no cross-file callers |
| `unused_exports` | Exported symbols with no callers at all |
| `dead_exports` | Top-level exports never imported by any file |
| `orphan_files` | Files with no incoming references |
| `unused_deps` | Declared dependencies not found in imports |
| `circular_imports` | Import cycle detection |
| `high_coupling` | Symbols with many callers |
| `god_functions` | Functions calling many other functions |
| `unresolved_calls` | Calls that could not be resolved to a symbol |
| `large_files` | Files with many symbols |
| `complex_functions` | Functions ranked by cognitive complexity and LOC |
| `unresolved_type_bindings` | Type bindings that could not be resolved |
| `unused_variables` | Variables never read (def-use chain analysis) |
| `hardcoded_values` | Secrets, hardcoded URLs/IPs in symbol names and signatures |
| `data_flow` | Parameter flow patterns: pass-through, deep chains, unused flows |
| `taint` | Source→sink vulnerability detection (SQL injection, XSS, path traversal, SSRF, log injection) |

**Example response** (abbreviated)

```json
{
  "total_count": 12,
  "findings": [
    {
      "kind": "dead_code",
      "name": "formatCurrency",
      "file": "src/utils/format.ts",
      "line": 34,
      "severity": "warning"
    }
  ]
}
```

---

### `find_duplicates`

Find duplicate code in the project using one of four detection modes.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `mode` | string | Yes | — | `"exact"` (body_hash), `"semantic"` (embedding similarity), `"structural"` (normalized hash — same structure, different names), `"pattern"` (AST fingerprint sliding window) |
| `limit` | number | No | `20` | Max results (max: 100) |
| `offset` | number | No | `0` | Skip N results |
| `language` | string | No | — | Filter by language |
| `path` | string | No | — | Filter by file path prefix |
| `kind` | string[] | No | — | Filter by symbol kind (e.g. `["function", "method"]`) |
| `min_lines` | number | No | `5` | Minimum lines per symbol (semantic/structural modes default to 5) |
| `min_similarity` | number | No | `0.9` | Similarity threshold for semantic mode (0–1) |
| `min_window` | number | No | `3` | Minimum sliding window size in statements (pattern mode) |
| `max_window` | number | No | `10` | Maximum sliding window size (pattern mode) |
| `project` | string | No | active | Project name |

---

### `suggest_tests`

Analyze a symbol's execution paths and generate actionable test skeleton suggestions. Prioritizes: HIGH (error handling), MEDIUM (edge cases), LOW (variants). With a coverage file, suggests only uncovered paths.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `name` | string | No | — | Symbol name |
| `line` | number | No | — | Line number (alternative to `name`) |
| `coverage_path` | string | No | — | Path to Istanbul JSON or lcov file. When provided, suggests only uncovered paths |
| `framework` | string | No | `"vitest"` | Test framework hint in response (does not affect skeleton syntax) |
| `project` | string | No | active | Project name |

---

## Write Operations

### `patch_symbol`

Apply a targeted text or regex replacement within a symbol's body. Scoped to the symbol's line range for safety. Re-parses and updates the index after patching. Supports optimistic concurrency via `expectedHash`.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `name` | string | Yes | — | Symbol name to patch |
| `needle` | string | Yes | — | Text or regex pattern to find |
| `replacement` | string | Yes | — | Replacement text (supports `$1`, `$2` backreferences in regex mode) |
| `mode` | string | No | `"literal"` | `"literal"` or `"regex"` |
| `allowMultiple` | boolean | No | `false` | When `true`, replaces all occurrences; otherwise requires exactly one match |
| `expectedHash` | string | No | — | `body_hash` from `get_symbol`/`get_symbols` for optimistic concurrency |
| `project` | string | No | active | Project name |

**Response fields**: `newBodyHash` (for chaining symbol edits), `newFileHash` (for chaining file-level ops).

**Example request**

```json
{
  "file": "src/payments/handler.ts",
  "name": "handlePayment",
  "needle": "console.log(",
  "replacement": "logger.info(",
  "mode": "literal",
  "allowMultiple": true
}
```

---

### `write_symbol`

Replace a symbol's entire body. Re-parses and updates the index. Supports optimistic concurrency.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `name` | string | Yes | — | Symbol name to replace |
| `body` | string | Yes | — | Complete new source code for the symbol |
| `expectedHash` | string | No | — | `body_hash` from `get_symbol`/`get_symbols`. Returns `ConflictError` with `currentHash` if stale |
| `project` | string | No | active | Project name |

**Response fields**: `newBodyHash`, `newFileHash`.

---

### `delete_symbol`

Delete a symbol from a source file. Returns broken callers that reference it. Re-parses and updates the index.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `name` | string | Yes | — | Symbol name to delete |
| `expectedHash` | string | No | — | `body_hash` for optimistic concurrency |
| `project` | string | No | active | Project name |

**Response fields**: `newFileHash`, `newBodyHash` (always null — symbol deleted), `broken_callers[]`.

---

### `insert_symbol`

Insert new code before/after a named symbol, or at the end of a file. Re-parses and updates the index.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `body` | string | Yes | — | Complete source code to insert |
| `position` | string | No | `"end"` | `"before"`, `"after"`, or `"end"` |
| `anchor` | string | No | — | Symbol name used as reference point for `"before"`/`"after"` positions |
| `expectedFileHash` | string | No | — | `file_hash` from `get_symbol`/`get_symbols` for optimistic concurrency |
| `project` | string | No | active | Project name |

**Response fields**: `newFileHash`, `newBodyHash` (always null — file-level op).

---

### `patch_file`

Apply a targeted text or regex replacement anywhere in a file (not scoped to a symbol). Re-parses and updates the index.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `needle` | string | Yes | — | Text or regex pattern to find |
| `replacement` | string | Yes | — | Replacement text (supports `$1`, `$2` backreferences) |
| `mode` | string | No | `"literal"` | `"literal"` or `"regex"` |
| `allowMultiple` | boolean | No | `false` | Replace all occurrences |
| `expectedFileHash` | string | No | — | `file_hash` for optimistic concurrency |
| `project` | string | No | active | Project name |

**Response fields**: `newFileHash`, `newBodyHash` (always null).

---

### `rename_symbol`

Rename a symbol across the entire project: updates the definition, all callers, and all import statements. Uses the indexed call graph and import data. Re-indexes all modified files.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path containing the symbol definition |
| `name` | string | Yes | — | Current symbol name |
| `newName` | string | Yes | — | New name for the symbol |
| `project` | string | No | active | Project name |

::: warning
`rename_symbol` modifies multiple files. Run `impact_analysis` first to understand the blast radius. Uses post-hoc conflict detection — reports conflicts for files modified externally during the rename.
:::

---

## Intelligence

### `explain_symbol`

Generate a natural-language explanation of a symbol. Analyzes callers, callees, execution paths, and variable flows. Returns a structured explanation with sections: purpose, parameters, return value, side effects, and call graph summary.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | Yes | — | Relative file path |
| `name` | string | No | — | Symbol name (fuzzy match) |
| `line` | number | No | — | Line number (alternative to `name`) |
| `project` | string | No | active | Project name |

---

### `get_description`

Read the stored LLM-generated description for a symbol. Returns `null` when no description exists yet.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | No* | — | Relative file path (*required if `symbol_id` not provided) |
| `name` | string | No* | — | Symbol name (*required if `symbol_id` not provided) |
| `symbol_id` | number | No | — | Direct symbol ID (alternative to `file`+`name`) |
| `project` | string | No | active | Project name |

---

### `set_description`

Write or update the stored description for a symbol. When `description` is omitted and an LLM provider is configured, the description is auto-generated from symbol context. Enriches `search_semantic` results via BM25.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file` | string | No* | — | Relative file path |
| `name` | string | No* | — | Symbol name |
| `symbol_id` | number | No | — | Direct symbol ID |
| `description` | string | No | — | Description text. When omitted, auto-generates via configured LLM |
| `project` | string | No | active | Project name |

::: tip
Write ONE imperative sentence describing what it does and WHY. Use specific domain terms (e.g. `"Finds exported symbols with no cross-file callers for dead code detection"`) — these maximize BM25 recall in `search_semantic`.
:::

---

### `fill_descriptions`

Bulk-generate LLM descriptions for all functions without descriptions. Starts an async background job. Only available when an LLM provider is configured.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `project` | string | No | active | Project name |
| `force` | boolean | No | `false` | When `true`, overwrite existing descriptions |
| `limit` | number | No | — | Max functions to process (default: all) |

**Response**: `{ job_id, status, total }`. Poll with `fill_descriptions_status`.

---

### `fill_descriptions_status`

Check progress of a `fill_descriptions` background job.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `job_id` | string | Yes | Job ID returned by `fill_descriptions` |

**Response fields**: `job_id`, `status` (`"running"` | `"done"` | `"error"`), `total`, `filled`, `skipped`, `errors`, `started_at`, `elapsed_ms`, `estimated_remaining_ms` (when running), `completed_at` (when done).

---

### `fill_execution_paths`

Bulk-generate execution paths for all function-kind symbols that lack them. Starts an async background job.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `project` | string | No | active | Project name |
| `force` | boolean | No | `false` | `true`: regenerate all from scratch. `false`: skip symbols with existing paths |
| `limit` | number | No | — | Max symbols to process |

**Response**: `{ job_id, project, status, total, force }`. Poll with `fill_execution_paths_status`.

---

### `fill_execution_paths_status`

Check progress of a `fill_execution_paths` background job.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `job_id` | string | Yes | Job ID returned by `fill_execution_paths` |

**Response fields**: `job_id`, `project`, `status`, `total`, `filled`, `skipped`, `errors`, `started_at`, `elapsed_ms`, `estimated_remaining_ms` (when running), `completed_at`, `current_symbol` (when running).

---

## Project Management

### `add_project`

Register a new project for indexing. Name is auto-derived from git remote URL (owner/repo format). Returns after indexing starts (async lazy sync).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `root_path` | string | Yes | Absolute path to the project root directory |
| `name` | string | No | Custom name in `namespace/name` format (e.g. `"myorg/project"`). Must be unique |
| `ignore_gitignore` | boolean | No | When `true`, bypass `.gitignore` and use `.astixignore` for file exclusion |

**Response**: `{ id, name, root_path, is_git, dependencies_detected? }`.

**Validation rules**: `root_path` must be absolute and exist on disk; `name` must use `namespace/name` format with alphanumeric segments; the path must be the git repository root; overlapping project paths are rejected.

---

### `remove_project`

Unregister a project and delete all its indexed data (files, symbols, calls, imports, embeddings). Cancels any running background jobs for the project.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | Yes | Project name to remove |

**Response**: `{ success: true, name }`.

---

### `set_active_project`

Set the active project for this MCP session. Once set, all tools default to this project when the `project` parameter is omitted. Call with no arguments to clear the active project.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | No | Project name to activate. Omit to clear the active project |

**Response**: `{ active_project, id, root_path }` (or `{ active_project: null }` when cleared).

---

### `reindex_project`

Reindex a project. Returns immediately with a `job_id` — use `reindex_status` to poll progress.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `project` | string | Yes | — | Project name to reindex |
| `force` | boolean | No | `false` | `true`: wipe all data and re-parse from scratch. `false`: preserve `llm_description` and embeddings, re-parse changed symbols only |

**Response**: `{ job_id, project, status, phase }`.

---

### `reindex_status`

Check the status of a `reindex_project` job.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `job_id` | string | Yes | Job ID returned by `reindex_project` |

**Response fields**: `job_id`, `project`, `status` (`"running"` | `"completed"` | `"failed"` | `"cancelled"`), `phase`, `mode`, `files_processed`, `files_total`, `symbols_indexed`, `sync_errors`, `started_at`, `elapsed_ms`, `estimated_remaining_ms`, `completed_at`, `error` (if failed).

::: tip
Job IDs are ephemeral (in-memory). If the server restarts, the project auto-recovers via lazy sync on the next tool query. Historical jobs are also stored in the database and recovered automatically.
:::

---

### `reindex_embeddings`

Re-generate embeddings for all symbols in the project. Returns immediately with a `job_id`. Only available when an embedding provider is configured. Use after switching embedding models or after `reindex_project`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | No | Project name (default: current) |

**Response**: `{ job_id, project, status, phase: "embedding", model, files }`. Poll with `reindex_status`.

::: info
In normal operation, embeddings are kept fresh automatically — changed files are re-embedded incrementally after each sync. This tool is only needed for bulk regeneration.
:::

---

### `reindex_paths`

Purge cached execution paths so they are recomputed on the next `get_execution_paths` call. Use after upgrading the parser or when cached results seem stale.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | No | Project name (default: current) |
| `language` | string | No | Only purge paths for this language. Omit to purge all |

**Response**: `{ deleted, project, language, message }`.

---

### `cancel_job`

Cancel a running reindex or embedding job. The job must be in `"running"` status.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `job_id` | string | Yes | Job ID to cancel (e.g. `"reindex-1"`) |

**Response**: `{ job_id, cancelled: true }` or `{ cancelled: false, reason }`.

---

### `health_check`

Validate the server infrastructure: BM25 index, grammar parsers, embedding provider connectivity, PostgreSQL vacuum stats, and pgvector HNSW index health.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `auto_fix` | boolean | No | `false` | Attempt automatic repair of failed checks (e.g. rebuild corrupted BM25 index) |

**Response**: JSON object with one key per subsystem (`bm25`, `parsers`, `embeddings`, `vacuum`, `pgvector`), each with `status` (`"ok"` | `"warning"` | `"error"`) and `message`.

---

## File Operations

### `create_file`

Create a new file on disk and add it to the index. Fails if the file already exists.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | string | Yes | Relative file path for the new file (e.g. `"src/new-module.ts"`). Must not already exist |
| `content` | string | Yes | Full content to write |
| `project` | string | No | Project name (default: current) |

---

### `remove_file`

Delete a file from disk and remove it from the index.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | string | Yes | Relative file path to remove (e.g. `"src/old-module.ts"`). Must exist on disk |
| `project` | string | No | Project name (default: current) |

---

## Semantic Diff

### `semantic_diff`

Compare exported code symbols against documentation using embedding similarity. Identifies symbols that are undocumented or whose documentation no longer matches the current implementation. Requires an embedding provider.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `scope` | string | No | — | Restrict code symbols to files under this directory (e.g. `"src/"`) |
| `doc_path` | string | No | — | Restrict doc symbols to files under this directory (default: all markdown files) |
| `threshold` | number | No | adaptive | Minimum similarity score (0–1). When omitted, adapts to score distribution (mean ± 1σ). When provided, ceiling = max(threshold + 0.2, 0.6) |
| `project` | string | No | active | Project name |

**Response**: list of `{ symbol, doc, similarity, gap }` findings where `gap` indicates whether the symbol is undocumented or drifted from its docs.

---

## Metrics

### `get_tool_metrics`

Get per-tool call metrics for this session: call count, total latency, errors, and token savings vs. naive file-reading. Optionally includes aggregate historical metrics from the database.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `reset` | boolean | No | `false` | Reset all in-memory session metrics after returning them |
| `history` | boolean | No | `false` | Include historical metrics from database (across sessions) |
| `since` | string | No | — | ISO date — filter historical metrics to this period (e.g. `"2026-01-01T00:00:00Z"`) |

**Response** (abbreviated): `{ <tool_name>: { callCount, totalDurationMs, avgLatencyMs, errorCount, totalResponseChars }, session_response_tokens, session_naive_tokens, token_savings_pct }`.
