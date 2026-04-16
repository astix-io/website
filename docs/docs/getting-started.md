---
title: "Get Started with astix — First Query in 10 Minutes"
description: "Set up astix in under 10 minutes. Connect semantic code intelligence to Claude Code or Cursor with PostgreSQL, tree-sitter, and 30+ MCP tools."
---

# Getting Started

**First useful query in under 10 minutes.**

## Prerequisites

- **PostgreSQL 18** with pgvector and ParadeDB (BM25) — see Step 1 for the recommended Docker image
- **Node.js 18+**

---

## Step 1: Start PostgreSQL

::: code-group

```bash [Docker — full]
# Recommended: includes pgvector, ParadeDB BM25, and 18 more extensions
docker run -d --name astix-db \
  -e POSTGRES_PASSWORD=astix \
  -e POSTGRES_DB=astix \
  -p 127.0.0.1:5432:5432 \
  ghcr.io/oorabona/postgres:18-alpine-full
```

```bash [Docker — vector only]
# Lighter alternative: pgvector + ParadeDB BM25 only — sufficient for astix
docker run -d --name astix-db \
  -e POSTGRES_PASSWORD=astix \
  -e POSTGRES_DB=astix \
  -p 127.0.0.1:5432:5432 \
  ghcr.io/oorabona/postgres:18-alpine-vector
```

```bash [Local PostgreSQL]
# Connect to your existing PostgreSQL instance
psql -U postgres

# Install the required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_bm25;

# Create a database for astix
CREATE DATABASE astix;
```

:::

::: tip Which image should I use?
Both images are based on **PostgreSQL 18 Alpine** and are bound to localhost only (`127.0.0.1`) for security.

- **`18-alpine-full`** — includes pgvector (embeddings), ParadeDB (BM25 search), and 18 additional extensions. Best for production or if you want room to grow.
- **`18-alpine-vector`** — lighter image with just pgvector + ParadeDB. Sufficient for all astix features.
:::

---

## Step 2: Install & Configure

```bash
npx @astix/mcp-server init
```

::: tip
This command creates an `.astix.json` file in your project root with your database connection and embedding settings. You can edit it at any time to change the configuration.
:::

---

## Step 3: Add Your Project

Navigate to your project directory and register it with astix:

```bash
astix add-project .
```

::: details What happens during indexing?
astix walks your project, parses every source file with tree-sitter, and stores symbols, call edges, and import edges in PostgreSQL. For a typical project of 50k lines this takes 10–30 seconds. Incremental re-indexing on subsequent runs is nearly instant.
:::

---

## Step 4: Connect to Your Editor

::: code-group

```json [Claude Code]
// Add to your Claude Code MCP settings
// (~/.claude/settings.json or project .claude/settings.json)
{
  "mcpServers": {
    "astix": {
      "command": "astix",
      "args": ["serve"]
    }
  }
}
```

```json [Cursor]
// Add to your Cursor MCP settings
// (.cursor/mcp.json in your project root)
{
  "mcpServers": {
    "astix": {
      "command": "astix",
      "args": ["serve"]
    }
  }
}
```

:::

::: warning Restart required
After updating your MCP settings, restart your editor so it picks up the new server configuration.
:::

---

## Step 5: Your First Query

In your AI coding assistant, try:

```
"Find all exported functions in this project"
```

astix will call:

```json
search_structural({ "exported": true })
```

And return a structured list of every exported symbol — with file paths, line numbers, signatures, and caller counts.

::: tip You're all set
Now explore what astix can do:

- [MCP Tools Reference](/docs/mcp-tools) — full list of 30+ tools with examples
- [Language Support](/docs/languages) — check if your language has Tier 1 support
:::
