---
title: "Data Lineage: Trace Variables from Input to Database"
date: 2026-04-24
dateModified: 2026-04-24
category: tutorials
featured: false
readingTime: 11
author: "Olivier Orabona"
image: https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop
description: "Trace any variable from user input to database across function boundaries. Find SQL injection, debug data corruption, and verify API contracts with one tool."
tags:
  - data-lineage
  - security
  - debugging
  - taint-analysis
  - owasp
  - sql-injection
  - variable-tracing
  - appsec
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

There is a class of bug that grep cannot find. Not because grep is too slow, or because you are using the wrong pattern — but because the bug lives in the relationship between lines, not in the lines themselves.

> Data lineage in code analysis is CFG-aware variable tracking through actual execution paths. Given a variable, a file, and a function, the engine follows the variable through assignments, function arguments, return values, and destructuring — across file and function boundaries. Each step in the chain is labeled as definition, param_pass, assignment, or return, showing where the variable originated and every transformation it underwent. Unlike grep, which finds text occurrences, data lineage follows control flow: it tracks which branch a variable takes, how it changes across function calls, and whether it reaches a sensitive sink like a database query in its original, unsanitized state.

## The Bug That Grep Can't Find

Here is a scenario that happens in production codebases every week. A POST endpoint accepts `req.body.email`. Somewhere downstream, that email address lands in a SQL query without being parameterized. The result is a textbook SQL injection — OWASP A03:2021, one of the most exploited vulnerability categories in existence.

You know the bug exists because your SAST scanner flagged it. You open your editor and search for `email`. Two hundred and forty hits across forty-three files. Controllers, validators, DAOs, test fixtures, migration scripts. Which of those 240 hits is the dangerous path?

The assignment happens in `src/handlers/user.ts`. It gets passed into a helper in `src/services/userService.ts`. That helper calls a utility in `src/utils/query.ts`. The utility builds a SQL string in `src/db/client.ts`. Four files. Three function boundaries. The data flows across all of them without being sanitized once.

grep cannot show you this. A text search finds occurrences. It cannot tell you which occurrence is the one that originates from untrusted user input and which is the one writing to the database. For that, you need to trace the data — not the text.

## What Is Data Lineage?

Data lineage in astix is variable-level tracking through actual execution paths. The engine uses the AST to follow a named variable as it flows through assignments, function arguments, return values, and destructuring patterns — across file and function boundaries.

Three properties make this useful in practice.

**CFG-aware.** The trace follows the actual control flow graph, not just lexical proximity. If a variable is only assigned on one branch of an `if` statement, the lineage tells you which branch. If a loop reassigns a variable on each iteration, the lineage shows that. Text search has no concept of branches.

**Cross-function.** This is the critical capability. When `email` is passed as an argument to `validateUser(email)`, astix follows it into `validateUser`, finds the corresponding parameter binding, and continues tracing from there. The chain crosses file boundaries transparently.

**Structured output.** The result is not a list of line numbers. It is a structured chain of actions — `definition`, `param_pass`, `assignment`, `return` — each with the expression that caused it. You can read the chain like a story: where the variable was born, every hand it passed through, and where it died.

The difference from grep in one sentence: grep finds text, lineage finds flow.

## Tracing a Variable in Express.js

Take a realistic Express handler. The route receives a POST body with an email field and, after passing through a service layer, queries the database with it.

```typescript
// src/handlers/user.ts
export async function handleRequest(req: Request, res: Response) {
  const email = req.body.email          // line 12 — user-controlled input
  const user = await validateUser(email) // line 15 — passes to service
  res.json(user)
}

// src/services/userService.ts
export async function validateUser(email: string) {
  const result = await db.query(        // line 28 — reaches the database
    `SELECT * FROM users WHERE email = ${email}` // interpolated, not parameterized
  )
  return result.rows[0]
}
```

You call `data_lineage` targeting the `email` variable in `handleRequest`:

```
data_lineage({
  file: "src/handlers/user.ts",
  symbol: "handleRequest",
  variable: "email",
  crossFunction: true
})
```

The response:

```json
{
  "file": "src/handlers/user.ts",
  "symbol": "handleRequest",
  "total_paths": 1,
  "returned_paths": 1,
  "paths": [{
    "path_index": 0,
    "description": "linear (no branches)",
    "traces": [{
      "variable": "email",
      "definition": {
        "line": 12,
        "expression": "const email = req.body.email"
      },
      "chain": [
        {
          "variable": "email",
          "line": 12,
          "action": "definition",
          "expression": "const email = req.body.email"
        },
        {
          "variable": "email",
          "line": 15,
          "action": "param_pass",
          "expression": "validateUser(email)"
        },
        {
          "variable": "email",
          "line": 28,
          "action": "param_pass",
          "expression": "db.query(`SELECT * FROM users WHERE email = ${email}`)"
        }
      ]
    }]
  }]
}
```

Read the chain in order. Line 12: `email` is defined as `req.body.email` — user-controlled, unvalidated. Line 15: it is passed as an argument to `validateUser`. Line 28: it arrives inside the database query, still as the original value, directly interpolated into a template literal.

The vulnerability is now visible. Not as a suspicion, not as a grep hit — as a structured chain of evidence. The data traveled from `req.body` to a SQL string without any sanitization step appearing in the chain. There is no `escape()`, no parameterized binding (`?`, `$1`), no validation that would have ended the unsafe form of the variable.

This is what an agent (or a developer) needs to write a confident fix: not just "email appears near the query" but "email arrives at the query as the exact value from req.body, with no intermediate transformation."

<MermaidDiagram code="graph LR
    A[&quot;req.body.email<br/><i>user input</i>&quot;] -->|&quot;line 12<br/>definition&quot;| B[&quot;handleRequest()&quot;]
    B -->|&quot;line 15<br/>param_pass&quot;| C[&quot;validateUser()&quot;]
    C -->|&quot;line 28<br/>param_pass&quot;| D[&quot;db.query()<br/><i>SQL sink</i>&quot;]" />

## Same Flow in FastAPI (Python)

The same tool works on Python codebases. The underlying mechanism is tree-sitter — astix parses Python into the same AST-level index as TypeScript, and `data_lineage` runs the same CFG-aware traversal.

```python
# src/handlers/user.py
@app.post("/user")
async def handle_request(body: dict):
    email = body["email"]                        # line 8 — user input
    user = await validate_user(email)            # line 9 — passes to service
    return user

# src/services/user_service.py
async def validate_user(email: str):
    result = await db.execute(
        f"SELECT * FROM users WHERE email = '{email}'"  # line 22 — interpolated
    )
    return result.fetchone()
```

```
data_lineage({
  file: "src/handlers/user.py",
  symbol: "handle_request",
  variable: "email",
  crossFunction: true
})
```

The response structure is identical — `definition` at line 8, `param_pass` at line 9, `param_pass` at line 22 inside the f-string. The dangerous interpolation surfaces in the chain the same way.

This is the power of a universal AST approach. The tool doesn't have TypeScript-specific knowledge or Python-specific knowledge. It has AST-level knowledge. The call graph, the parameter bindings, the variable assignments — all modeled in the same way regardless of the source language. You learn one tool and it works across 38 languages. When you bring a new service into your codebase written in Go or Java, you run the same query.

For OWASP Top 10 coverage, this matters practically. [Taint analysis across function boundaries](/blog/sast-taint-analysis) — tracking untrusted data from source to sink — is the core technique behind A01 (Broken Access Control), A03 (Injection), and A08 (Software Integrity Failures). Data lineage gives you that capability without a dedicated SAST tool per language.

## Use Cases Beyond Security

Security is the most dramatic use case. But the same capability applies anywhere the question is "how does this value get from here to there?"

**Debugging data corruption.** A financial service is logging that `amount` is sometimes an integer when it should always be a float. The bug has been happening intermittently for two weeks. You trace `amount` through the processing pipeline:

```
data_lineage({
  file: "src/processors/payment.ts",
  symbol: "processPayment",
  variable: "amount",
  crossFunction: true
})
```

The chain shows that `amount` passes through `formatCurrency`, which returns `Math.round(value)` — an integer. The rounding is intentional for display, but the result is being fed back into the calculation pipeline instead of being used only for display. The lineage trace shows the exact `assignment` action where the rounded value overwrites the original float. Two weeks of intermittent logs resolved in one tool call.

**Understanding legacy code.** You inherit a Node.js application where `config.timeout` is set in an initialization file but seems to have no effect in the HTTP client. You run:

```
data_lineage({
  file: "src/config/init.ts",
  symbol: "initConfig",
  variable: "timeout",
  crossFunction: true
})
```

The chain traces through five layers: `init.ts` → `configStore.ts` → `httpFactory.ts` → `axiosWrapper.ts` → `requestBuilder.ts`. At `axiosWrapper.ts`, the chain shows a `definition` action where `timeout` is reassigned to a hardcoded value before being passed to Axios. The previous developer set a fallback that swallowed the config value. Without lineage tracing, this would have taken hours of reading five interconnected files.

**Code review automation.** Before merging a PR that adds a new API field, you want to verify that the field doesn't reach the database without validation. You identify the entry point, run `data_lineage` with `crossFunction: true`, and inspect the chain for any `param_pass` action that reaches a `db.*` call without passing through a validator in between. This is mechanizable — an AI agent can run this check as part of a pre-merge review without reading a single source file.

**API contract verification.** A gRPC service receives a `userId` from the gateway and is supposed to set it on the response envelope. You run `data_lineage` on `userId` through the handler and verify that a `param_pass` or `assignment` action reaches the response builder. If `userId` disappears from the chain before the response — if it gets dropped silently — the chain ends early and you catch the contract violation before it reaches production.

## Combining with Other Tools

`data_lineage` is most powerful when used as the first step in a chain of queries.

**Data lineage + impact analysis.** After tracing an unsanitized variable to a database query, you want to know: how many callers reach this handler? `impact_analysis` lets you [measure the blast radius](/blog/impact-analysis) — every function in the call graph that eventually invokes `handleRequest`. If the answer is 14 callers across 3 services, the scope of the fix is clear before you write a single line.

```
impact_analysis({
  file: "src/handlers/user.ts",
  symbol: "handleRequest",
  depth: 4
})
```

**Data lineage + variable uses.** The lineage trace shows where a variable travels. `get_variable_uses` with `access_mode: ["write"]` shows every location where it is mutated. Run both to get a complete picture: the flow through the call graph (lineage) and every point in that flow where the value changes (mutations). Together they tell you whether the variable is transformed safely or passes through untouched.

```
get_variable_uses({
  file: "src/services/userService.ts",
  name: "email",
  access_mode: ["write"]
})
```

**Data lineage + code health taint check.** `code_health` with taint-related checks runs a broad scan across the codebase for classes of unsafe data flow. Use `data_lineage` to investigate the specific chains that `code_health` flags. The automated scan finds candidates; the lineage trace gives you the evidence.

This composition pattern — automated scan to surface candidates, structured trace to verify — maps directly to how security engineers work. The difference is that with astix, both steps are tool calls. No manual reading, no guesswork.

## Conclusion

Data lineage turns invisible flows into visible paths. The information was always there — in the assignments, the function calls, the parameter bindings — but distributed across files in a way that grep cannot traverse. `data_lineage` collapses that distribution into a single structured chain.

The use cases are different but the underlying question is the same: how does this value get from here to there? Security engineers ask it about untrusted input. Debugging engineers ask it about corrupted values. Code reviewers ask it about new fields. Legacy engineers ask it about configuration that never arrives at its destination.

One tool, one output format, 38 languages.

If you have not traced a variable through your production codebase yet, try it now. Pick any variable that crosses a function boundary — a request field, a database result, a config value — and run `data_lineage` with `crossFunction: true`. The chain you get back will tell you something about your code that you did not know before.

Data lineage is [part of our 6-step codebase exploration method](/blog/source-code-archaeology) — the final step that answers "where does this data go?" after you have mapped modules, traced execution paths, and assessed blast radius.

[Get started →](/docs/getting-started) · [Read the full MCP tools reference →](/docs/mcp-tools)

</BlogPostLayout>
