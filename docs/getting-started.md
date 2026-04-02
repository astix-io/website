---
title: Getting Started
description: First useful query in under 10 minutes.
---

# Getting Started

**First useful query in under 10 minutes.**

## Prerequisites

- **PostgreSQL 15+** with the [pgvector](https://github.com/pgvector/pgvector) extension
- **Node.js 18+**

---

## Step 1: Start PostgreSQL

::: code-group

```bash [Docker]
docker run -d \
  --name astix-pg \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=astix \
  pgvector/pgvector:pg16
```

```bash [Local PostgreSQL]
# Connect to your existing PostgreSQL instance
psql -U postgres

# Install the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

# Create a database for astix
CREATE DATABASE astix;
```

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

- [MCP Tools Reference](/guide/mcp-tools) — full list of 30+ tools with examples
- [Language Support](/guide/languages) — check if your language has Tier 1 support
:::
