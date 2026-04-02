---
title: MCP Tools Reference
description: Complete reference for astix MCP tools — search, analysis, write, and code health.
---

# MCP Tools Reference

astix exposes 30+ tools over the Model Context Protocol. This page documents the most commonly used tools, grouped by category.

All tools accept an optional `project` parameter to target a specific registered project. If omitted, the active project is used.

---

## Search

### `search_structural`

Find symbols by name pattern. Searches the AST index — instant, no embeddings required.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `pattern` | string | Yes | Name pattern to match (ILIKE, supports `%` wildcards) |
| `kind` | string | No | Filter by symbol kind: `"function"`, `"class"`, `"variable"`, etc. |
| `exported` | boolean | No | When `true`, return only exported symbols |
| `project` | string | No | Target project name (defaults to active project) |

**Example request**

```json
{
  "pattern": "handlePayment",
  "kind": "function"
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
      "line": 42,
      "exported": true,
      "caller_count": 3
    }
  ]
}
```

---

### `search_semantic`

Find code by intent or natural-language description. Uses vector embeddings (BM25 + vector hybrid by default).

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Natural-language description of what you're looking for |
| `mode` | string | No | Search strategy: `"hybrid"` (default), `"vector"`, or `"bm25"` |
| `project` | string | No | Target project name (defaults to active project) |

**Example request**

```json
{
  "query": "functions that validate email addresses"
}
```

**Example response** (abbreviated)

```json
{
  "results": [
    {
      "name": "isValidEmail",
      "file": "src/utils/validation.ts",
      "line": 17,
      "score": 0.92,
      "signature": "function isValidEmail(email: string): boolean"
    }
  ]
}
```

::: tip
Use specific domain terms in your query. Avoid generic words like "code", "data", or "function" — they match everything and dilute results.
:::

---

## Analysis

### `get_symbol`

Get symbol details including signature, callers, and callees. The primary tool for understanding a specific function or class.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `file` | string | Yes | Path to the file containing the symbol |
| `name` | string | No | Symbol name. If omitted, returns all symbols in the file |
| `include_body` | boolean | No | Include the full source body (default: `false`) |

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
  "signature": "async function handlePayment(order: Order): Promise<Receipt>",
  "callers": [
    { "name": "processCheckout", "file": "src/checkout.ts", "line": 88 }
  ],
  "callees": [
    { "name": "validateOrder", "file": "src/payments/validate.ts" },
    { "name": "chargeCard", "file": "src/payments/stripe.ts" }
  ]
}
```

---

### `impact_analysis`

Compute the blast radius of changing a symbol. Returns a risk assessment and transitive caller tree.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `file` | string | Yes | Path to the file containing the symbol |
| `name` | string | Yes | Symbol name to analyze |
| `depth` | number | No | Traversal depth for the caller tree (default: `3`) |

**Example request**

```json
{
  "file": "src/payments/handler.ts",
  "name": "handlePayment",
  "depth": 3
}
```

**Example response** (abbreviated)

```json
{
  "risk_level": "high",
  "direct_callers": 3,
  "transitive_callers": 14,
  "inherited_by_count": 0,
  "affected_files": ["src/checkout.ts", "src/api/orders.ts", "src/webhooks/stripe.ts"]
}
```

---

### `data_lineage`

Trace a variable's flow across functions — from definition to all downstream uses.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `file` | string | Yes | Path to the file where the variable is defined |
| `variable` | string | Yes | Variable name to trace |
| `crossFunction` | boolean | No | Follow the variable across function call boundaries (default: `false`) |

**Example request**

```json
{
  "file": "src/payments/handler.ts",
  "variable": "receipt",
  "crossFunction": true
}
```

**Example response** (abbreviated)

```json
{
  "definition": { "file": "src/payments/handler.ts", "line": 55 },
  "uses": [
    { "context": "return", "file": "src/payments/handler.ts", "line": 71 },
    { "context": "param_pass", "file": "src/checkout.ts", "line": 92 }
  ]
}
```

---

## Write

### `patch_symbol`

Edit within a function using a literal string or regex replacement. Scoped to the symbol's range — safer than a file-wide sed.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `file` | string | Yes | Path to the file |
| `name` | string | Yes | Symbol name to patch |
| `needle` | string | Yes | Text or pattern to find |
| `replacement` | string | Yes | Replacement text |
| `mode` | string | No | `"literal"` (default) or `"regex"` |

**Example request**

```json
{
  "file": "src/payments/handler.ts",
  "name": "handlePayment",
  "needle": "console.log(",
  "replacement": "logger.info(",
  "mode": "literal"
}
```

---

### `rename_symbol`

Rename a symbol across the entire call graph and all import sites. Updates references in every file that uses the symbol.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `file` | string | Yes | Path to the file containing the symbol |
| `name` | string | Yes | Current symbol name |
| `newName` | string | Yes | New symbol name |

**Example request**

```json
{
  "file": "src/payments/handler.ts",
  "name": "handlePayment",
  "newName": "processPayment"
}
```

::: warning
`rename_symbol` modifies multiple files. Run `impact_analysis` first to understand the blast radius.
:::

---

## Code Health

### `code_health`

Detect dead code, unused exports, and duplicates. Returns a prioritized list of findings.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | string | No | Scope to a specific directory or file. Defaults to the whole project |
| `limit` | number | No | Maximum findings to return (default: `20`, max: `200`) |

**Example request**

```json
{
  "path": "src/payments",
  "limit": 50
}
```

**Example response** (abbreviated)

```json
{
  "total_count": 12,
  "findings": [
    {
      "kind": "unused_export",
      "name": "formatCurrency",
      "file": "src/utils/format.ts",
      "line": 34,
      "severity": "warning"
    },
    {
      "kind": "duplicate",
      "name": "isValidEmail",
      "duplicates": ["src/utils/validation.ts:17", "src/auth/helpers.ts:52"],
      "severity": "info"
    }
  ]
}
```
