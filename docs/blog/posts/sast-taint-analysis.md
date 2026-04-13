---
title: "Open-Source SAST: Taint Analysis Across Functions"
date: 2026-04-24
dateModified: 2026-04-24
category: tutorials
featured: false
readingTime: 10
author: "Olivier Orabona"
image: https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&h=400&fit=crop
description: "CFG-aware taint tracking finds SQL injection, XSS, and SSRF across function boundaries. No rules to write — the call graph already knows the vulnerable paths."
tags:
  - security
  - sast
  - taint-tracking
  - owasp
  - static-analysis
  - code-intelligence
  - vulnerability-detection
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

Security scanning is a solved problem — if you can afford the solution. Semgrep Enterprise starts around $30K/year. Checkmarx SAST is closer to $50K before you negotiate. Veracode can run past $100K for larger teams. And if you want results that don't miss half your vulnerabilities, you're expected to pay.

Taint analysis is a security technique that traces potentially dangerous data from its source (user input, environment variables, external APIs) through the program to sensitive sinks (database queries, file operations, HTTP responses). Traditional SAST tools use pattern matching — scanning for known vulnerable code patterns like `query(user_input)`. CFG-aware taint analysis goes further: it follows data through the actual control flow graph, tracking variables across function calls, file boundaries, and conditional branches. This approach catches vulnerabilities that span multiple files and functions — the category of bugs that pattern-based tools systematically miss. astix implements taint tracking for five categories: SQL injection, cross-site scripting (XSS), path traversal, server-side request forgery (SSRF), and log injection, requiring zero configuration rules.

## The $50K Question

The pitch is always the same: accurate taint analysis requires deep program analysis, and deep program analysis is expensive to build. Fair enough. But here's the thing: most teams running Python, TypeScript, or Go microservices have already built most of the infrastructure that taint analysis needs. They have a CI pipeline. They have a linter. And if they use astix, they have a fully-parsed, call-graph-aware AST index sitting next to their code.

The question isn't whether taint analysis is hard. It is. The question is whether you need a $50K license to get it when your codebase is already indexed at the AST level.

Pattern-matching tools like Semgrep are genuinely useful, and this article isn't a takedown of them. But they have a fundamental ceiling: they look at code locally, not globally. A `grep`-style rule finds `query($user_input)` on a single line. It cannot tell you that `$user_input` arrived as `request.query_params["id"]`, was passed to `get_user()`, re-shaped by `build_query()`, and then handed to `db.execute()` in three different files. Cross-function taint requires a call graph. astix has one.

## Pattern Matching vs. Call Graph

Consider a naive SQL injection check. A Semgrep rule looks for dangerous sinks: `db.execute(...)` with a non-literal argument. That catches the obvious case:

```python
# Semgrep catches this: direct injection
user_id = request.query_params["id"]
db.execute(f"SELECT * FROM users WHERE id = {user_id}")
```

It misses this:

```python
# routes.py
@app.get("/users/{id}")
async def get_user(id: str):
    return await user_service.fetch(id)

# user_service.py
async def fetch(user_id: str):
    query = build_query(user_id)
    return await db.execute(query)

# query_builder.py
def build_query(user_id: str):
    return f"SELECT * FROM users WHERE id = {user_id}"
```

Three files. Three functions. The taint originates in `routes.py`, travels through `user_service.py`, and reaches the sink in `query_builder.py`. A pattern matcher sees three clean function calls. A call graph sees a data flow from source to sink.

This isn't a contrived example. It's how virtually every production application is structured. Business logic is layered. Inputs are sanitized in one layer and sometimes unsanitized in another. Real vulnerabilities live in the gaps between functions — and those gaps are exactly what a call graph covers.

astix traces data across function boundaries using the same index it uses for everything else: the AST-level structural index backed by PostgreSQL, enriched with cross-file call edges.

## The 5 Taint Categories

`code_health({ check: "taint" })` surfaces five vulnerability classes. Each maps a known taint source to a known sink, and each uses the call graph to trace the path between them.

**SQL Injection** — Sources: `request.query_params`, `request.body`, `request.path_params`, form inputs. Sinks: `db.execute()`, `session.execute()`, ORM `filter()` with raw string concatenation, `cursor.execute()`. Example: user-controlled string interpolated into a SQL template three layers deep in a query builder.

**XSS (Cross-Site Scripting)** — Sources: any user-controlled value from request context. Sinks: `Markup()`, `jinja2.Template().render()`, `innerHTML` assignment in JavaScript, unescaped template variables. Example: a username stored in the database, retrieved by a service, and rendered without escaping in an admin panel.

**Path Traversal** — Sources: `request.query_params["file"]`, `request.path_params["path"]`. Sinks: `open()`, `os.path.join()` with user input, `pathlib.Path()` without normalization. Example: file download endpoint that passes the filename directly to `open()` without checking for `../` sequences.

**SSRF (Server-Side Request Forgery)** — Sources: URL parameters, JSON body fields containing URLs. Sinks: `httpx.get()`, `requests.get()`, `aiohttp.ClientSession().get()` with user-controlled URL. Example: a webhook registration endpoint that fetches the provided URL to verify it — without allowlist checks.

**Log Injection** — Sources: user-controlled string fields. Sinks: `logger.info()`, `logger.error()`, `print()` with f-strings containing user data. Example: an authentication error log that includes the attempted username, allowing an attacker to forge log entries.

Running `code_health` against a FastAPI project returns structured findings:

```json
{
  "check": "taint",
  "findings": [
    {
      "id": "taint-sqli-001",
      "category": "sql_injection",
      "severity": "critical",
      "source": {
        "file": "api/routes/users.py",
        "line": 14,
        "symbol": "get_user",
        "expression": "request.query_params[\"id\"]"
      },
      "sink": {
        "file": "db/query_builder.py",
        "line": 8,
        "symbol": "build_query",
        "expression": "f\"SELECT * FROM users WHERE id = {user_id}\""
      },
      "path": [
        { "file": "api/routes/users.py", "symbol": "get_user", "line": 14 },
        { "file": "services/user_service.py", "symbol": "fetch", "line": 22 },
        { "file": "db/query_builder.py", "symbol": "build_query", "line": 8 }
      ],
      "confidence": "high",
      "message": "User-controlled input flows unsanitized to SQL sink across 3 functions and 2 files."
    },
    {
      "id": "taint-ssrf-001",
      "category": "ssrf",
      "severity": "high",
      "source": {
        "file": "api/routes/webhooks.py",
        "line": 31,
        "symbol": "register_webhook",
        "expression": "request.body[\"callback_url\"]"
      },
      "sink": {
        "file": "services/http_client.py",
        "line": 19,
        "symbol": "verify_endpoint",
        "expression": "await httpx.get(url)"
      },
      "path": [
        { "file": "api/routes/webhooks.py", "symbol": "register_webhook", "line": 31 },
        { "file": "services/webhook_service.py", "symbol": "validate", "line": 45 },
        { "file": "services/http_client.py", "symbol": "verify_endpoint", "line": 19 }
      ],
      "confidence": "high",
      "message": "User-supplied URL passed to outbound HTTP client without allowlist check."
    }
  ],
  "total_count": 2,
  "scanned_symbols": 847
}
```

Each finding includes the full taint path — not just "there's an injection somewhere in this file," but the exact chain of function calls connecting source to sink.

<MermaidDiagram code="graph LR
    subgraph &quot;Source&quot;
        S[&quot;request.query_params&quot;]
    end
    subgraph &quot;Propagation&quot;
        P1[&quot;fetch()&quot;] --> P2[&quot;build_query()&quot;]
    end
    subgraph &quot;Sink&quot;
        K[&quot;db.execute()&quot;]
    end
    S -->|&quot;file_a.py:8&quot;| P1
    P2 -->|&quot;file_b.py:23&quot;| K" />

## Real Example: FastAPI + SQLAlchemy

Let's walk through a complete trace. The application has a user lookup endpoint that takes an `id` query parameter. The request handler delegates to a service, which calls a query builder, which constructs raw SQL.

The code across three files:

```python
# api/routes/users.py
@router.get("/users")
async def get_user(request: Request, db: AsyncSession = Depends(get_db)):
    user_id = request.query_params["id"]   # taint source
    result = await user_service.fetch(user_id, db)
    return result

# services/user_service.py
async def fetch(user_id: str, db: AsyncSession) -> dict:
    query = query_builder.build_query(user_id)   # taint passes through
    row = await db.execute(text(query))           # taint reaches sink
    return dict(row.mappings().first())

# db/query_builder.py
def build_query(user_id: str) -> str:
    return f"SELECT * FROM users WHERE id = {user_id}"   # sink
```

Running [`data_lineage`](/blog/data-lineage#trace-data-lineage) on the `user_id` variable in `get_user` returns the full chain:

```json
{
  "variable": "user_id",
  "origin": {
    "file": "api/routes/users.py",
    "line": 14,
    "expression": "request.query_params[\"id\"]",
    "taint": "external_input"
  },
  "chain": [
    {
      "step": 1,
      "kind": "param_pass",
      "from": { "file": "api/routes/users.py", "symbol": "get_user", "line": 15 },
      "to":   { "file": "services/user_service.py", "symbol": "fetch", "param": "user_id" }
    },
    {
      "step": 2,
      "kind": "param_pass",
      "from": { "file": "services/user_service.py", "symbol": "fetch", "line": 22 },
      "to":   { "file": "db/query_builder.py", "symbol": "build_query", "param": "user_id" }
    },
    {
      "step": 3,
      "kind": "return",
      "from": { "file": "db/query_builder.py", "symbol": "build_query", "line": 8 },
      "expression": "f\"SELECT * FROM users WHERE id = {user_id}\"",
      "taint": "sql_sink"
    },
    {
      "step": 4,
      "kind": "call",
      "from": { "file": "services/user_service.py", "symbol": "fetch", "line": 23 },
      "to":   { "symbol": "db.execute", "arg": "query" },
      "taint": "executed"
    }
  ],
  "verdict": "TAINTED — external_input reaches sql_sink without sanitization"
}
```

This is what pattern matching cannot produce. The vulnerability crosses two files, three function calls, and involves a return value being passed to a database driver — none of which is visible from any single line of code.

A Semgrep rule looking for `db.execute()` with a non-literal would fire on line 23 (`db.execute(text(query))`), but `query` looks like a plain variable — nothing in that line tells you it originated from `request.query_params["id"]`. A call-graph-aware trace knows the entire history of that value.

The fix is a single parameterized query in `build_query`. astix's `suggest_tests` can generate a test that verifies the injection path is closed — a test that includes `"1 OR 1=1"` as the input and asserts the query is parameterized, not concatenated.

## Comparison Table

You need accurate data to make a decision. Here's how astix compares on the factors that matter for small teams:

| | **astix** | **Semgrep OSS** | **CodeQL** | **Snyk Code** |
|---|---|---|---|---|
| **Price** | [Free / $29/month Solo](/pricing#astix-pricing) | Free (OSS rules) | Free (GitHub), $6K+ enterprise | Free tier, $98/dev/mo+ |
| **Approach** | AST call graph + taint | Pattern matching | Dataflow / QL query language | Dataflow (proprietary) |
| **Cross-function taint** | Yes | No | Yes | Yes |
| **Setup time** | ~10 minutes (Docker + `npx`) | ~5 minutes | 30–120 minutes (CodeQL DB build) | 5 minutes (SaaS) |
| **Languages (Tier 1)** | 10 (TS, JS, Python, Rust, Go, Java, C#, C, C++, Ruby) | 30+ (patterns, not call graph) | 10 | 10+ |
| **Self-hosted** | Yes (full) | Yes | Yes (GitHub Actions) | No (SaaS) |
| **Code egress** | Zero | Zero | Zero (self-hosted) | Yes (to Snyk cloud) |
| **CI integration** | `code_health` MCP tool | CLI (`semgrep ci`) | GitHub Actions / CLI | CLI / GitHub App |
| **False positive rate** | Low (call-graph filtering) | Medium–High (pattern noise) | Low | Low–Medium |

The honest summary: Semgrep is fast and free, and for pattern-level checks it remains excellent. CodeQL is the gold standard for deep dataflow but its query language has a learning curve measured in days, not hours. Snyk Code is polished but sends your code to their servers. astix's taint tracking is not yet as mature as CodeQL's — but it runs in ten minutes, stays on your infrastructure, and integrates with the same tools you already use for code navigation.

## Integrating with Your Workflow

The power of taint analysis inside your AST index is that it composes with every other code intelligence operation. You're not adding a new tool — you're adding a new capability to an existing one.

**In CI**, add a `code_health` check to your pull request pipeline. Configure it to fail on `critical` severity findings and annotate the PR with the taint path. Unlike Semgrep, which lists files, astix lists the exact chain from source to sink — reviewers see the full attack surface, not just a filename.

```bash
# In your CI script
astix code_health --check taint --severity critical --format json \
  | jq '.findings[] | select(.severity == "critical")'
```

**During code review**, when a reviewer spots a suspicious data flow, `data_lineage` answers the question immediately: does this user-controlled value reach a dangerous sink? Run it on any variable. Get the chain in seconds. No manual tracing through five files.

**For coverage gaps**, `get_uncovered_paths` combined with `suggest_tests` generates test skeletons for the [execution paths your current tests don't exercise](/blog/execution-paths#map-execution-paths-and-generate-test-skeletons). Pair that with `code_health`'s taint findings and you can generate targeted security tests: input paths that reach sinks, tested with adversarial payloads. The gap between "we have unit tests" and "we test our taint paths" closes without manual effort.

The three tools compose into a repeatable loop: [`code_health`](/blog/dead-code-detection#code-health-checks) finds the vulnerability, `data_lineage` explains the path, `suggest_tests` generates the test that proves the fix. All through the same MCP interface your AI assistant already uses.

## Conclusion

Security scanning doesn't require a $50K annual contract. It requires a call graph, a taint propagation model, and integration with the tools your team already uses daily. astix provides all three — built on an open-source AST index, self-hosted on your infrastructure, with zero code egress.

The taint analysis described here is available today via `code_health({ check: "taint" })` and `data_lineage`. It finds SQL injection, XSS, SSRF, path traversal, and log injection across function and file boundaries — the vulnerabilities that pattern matching misses by design.

If you're running a Python or TypeScript backend and you're not doing cross-function taint analysis because the tools cost too much, that gap is now closed.

```bash
npx @astix/mcp-server init
astix add-project /path/to/your/project
# Then ask your AI assistant: code_health({ check: "taint" })
```

[Read the Getting Started guide →](/getting-started) — first taint scan in under 10 minutes.

</BlogPostLayout>
