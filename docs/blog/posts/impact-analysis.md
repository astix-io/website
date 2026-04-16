---
title: "Impact Analysis: What Breaks If I Change This Function?"
date: 2026-04-24
dateModified: 2026-04-24
category: tutorials
featured: false
readingTime: 10
author: "Olivier Orabona"
image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop
description: "Know the blast radius before you push. Traverse the call graph to find every direct and transitive caller, assess risk, and prevent regressions."
tags:
  - impact-analysis
  - refactoring
  - call-graph
  - risk-assessment
  - code-refactoring
  - call-graph-analysis
  - software-maintenance
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

You need to refactor `handleRequest()`. It's tangled, it does too many things, and you've already identified the cleaner abstraction. The problem: it's called from 15 places across the codebase. You grep for the name, find those 15 direct callers, and figure you'll touch them all.

Then you push. CI breaks. Something in `middleware/auth` was calling a helper that called `handleRequest()`. You didn't see it because it wasn't in your grep output — it was two hops away. Then a type test fails because a shared interface had `handleRequest` in its contract. Then a subclass in `src/plugins/` overrides it, and your change silently breaks the override without a compile error.

"I didn't know X depended on Y" is the single most common cause of regressions in large codebases. It's not a skill problem. It's an information problem. Grep shows you names; it doesn't show you the graph.

Impact analysis is the process of determining which parts of a codebase are affected by a proposed change before the change is made. In astix, this is implemented as a breadth-first traversal of the call graph starting from the target symbol. The analysis finds all direct callers, then expands to transitive callers up to a configurable depth (default 3). Each affected symbol is annotated with its file location, caller count, and whether it involves dynamic dispatch. The result includes a computed risk level — low, medium, or high — based on the total number of callers, affected files, exported status, presence of dynamic callers, and inheritance depth. This transforms refactoring from a gamble into a measured decision.

## How Impact Analysis Works

`impact_analysis` in astix traverses the call graph — the same AST-level graph that `get_symbol` exposes for direct callers — and walks it to a configurable depth. Instead of returning just the function's immediate callers, it performs a breadth-first traversal: direct callers first, then callers of those callers, then one level deeper, until `depth` is exhausted or the graph terminates.

```typescript
// MCP tool call
impact_analysis({
  name: "handleRequest",
  project: "my-api",
  depth: 3
})
```

The traversal collects four things at each level:

1. **Callers** — every symbol that calls the target, directly or transitively
2. **Files** — the set of files containing those callers
3. **Dynamic call sites** — call sites where the receiver is an interface, union, or computed property (these can't be statically resolved)
4. **Inherited implementations** — subclasses or implementors that override the target method

From those four, a set of **risk factors** is derived, and a `risk_level` is computed: `"low"`, `"medium"`, or `"high"`.

<MermaidDiagram code="graph TB
    T[&quot;handleRequest<br/><b>TARGET</b>&quot;] --> D1[&quot;loginRoute<br/>depth 1&quot;]
    T --> D2[&quot;oauthCallback<br/>depth 1&quot;]
    D1 --> D3[&quot;authMiddleware<br/>depth 2&quot;]
    D1 --> D4[&quot;sessionManager<br/>depth 2&quot;]
    D2 --> D5[&quot;tokenExchange<br/>depth 2&quot;]
    D3 --> D6[&quot;rateLimiter<br/>depth 3&quot;]" />

Here is what a real response looks like:

```json
{
  "symbol": "handleRequest",
  "file": "src/server/router.ts",
  "risk_level": "high",
  "risk_factors": {
    "total_callers": 14,
    "total_files": 8,
    "is_exported": true,
    "has_dynamic_callers": true,
    "dynamic_caller_count": 2,
    "inherited_by_count": 3,
    "max_depth_reached": false
  },
  "callers": [
    {
      "depth": 1,
      "symbol": "routeRequest",
      "file": "src/server/router.ts",
      "kind": "function"
    },
    {
      "depth": 1,
      "symbol": "handleWebSocket",
      "file": "src/server/ws.ts",
      "kind": "function"
    },
    {
      "depth": 2,
      "symbol": "middleware",
      "file": "src/middleware/auth.ts",
      "kind": "function"
    },
    {
      "depth": 2,
      "symbol": "TestRouter.dispatchRequest",
      "file": "src/test/helpers/router.ts",
      "kind": "method"
    },
    {
      "depth": 3,
      "symbol": "AppServer.start",
      "file": "src/app.ts",
      "kind": "method",
      "is_dynamic": true
    }
  ],
  "inherited_by": [
    {
      "symbol": "AdminRouter.handleRequest",
      "file": "src/plugins/admin/router.ts"
    },
    {
      "symbol": "ApiV2Router.handleRequest",
      "file": "src/plugins/v2/router.ts"
    },
    {
      "symbol": "LegacyRouter.handleRequest",
      "file": "src/compat/legacy.ts"
    }
  ]
}
```

## Reading the Risk Level

The `risk_level` field is computed from a weighted evaluation of the risk factors. Understanding the thresholds helps you decide how much caution the change warrants. When you need to [find code by intent with semantic search](/blog/semantic-search#find-code-by-intent-with-semantic-search) before narrowing down which function to analyze, `search_semantic` pairs naturally with `impact_analysis` as a pre-step.

**Low** — 1 to 3 total callers, all in the same file, `is_exported: false`, no dynamic callers, no subclasses. A private helper called in one place. You can change it with confidence: the blast radius is self-contained, the compiler will catch any signature mismatch, and there are no hidden dispatch paths.

**Medium** — 4 to 10 callers, spanning 2 to 3 files, possibly exported, no dynamic callers, at most 1 subclass. The function has reach but it's still statically traceable. You'll want to check each caller manually, but there are no surprises the type system won't surface.

**High** — any of: more than 10 callers total, dynamic call sites, `inherited_by_count` greater than 0, or `is_exported: true` in a library context. Dynamic callers are particularly dangerous because they resolve at runtime — astix flags them explicitly via `is_dynamic: true` on the caller entry. Subclasses are dangerous because a signature change silently breaks the override contract in languages without full covariant checking.

When `risk_level` is `"high"`, the right response is not to skip the refactor. It's to test each path in `callers[]` and each entry in `inherited_by[]` before you push.

## Real Example: Kubernetes

Kubernetes is one of the most call-graph-dense Go codebases in existence — a good illustration of [universal call graph across languages](/blog/multi-language#universal-call-graph-across-languages). Its `pkg/scheduler/framework/` package shows what high-risk impact looks like in practice.

Consider `RunFilterPlugins` — the method on the scheduling framework that evaluates whether a pod can be placed on a node by running every registered filter plugin. Here is what `impact_analysis` returns for it at `depth: 3`:

```json
{
  "symbol": "RunFilterPlugins",
  "file": "pkg/scheduler/framework/interface.go",
  "risk_level": "high",
  "risk_factors": {
    "total_callers": 14,
    "total_files": 8,
    "is_exported": true,
    "has_dynamic_callers": true,
    "dynamic_caller_count": 4,
    "inherited_by_count": 6,
    "max_depth_reached": false
  },
  "callers": [
    {
      "depth": 1,
      "symbol": "findNodesThatPassFilters",
      "file": "pkg/scheduler/schedule_one.go",
      "kind": "function"
    },
    {
      "depth": 1,
      "symbol": "runPreFilterExtensionRemovePod",
      "file": "pkg/scheduler/framework/runtime/framework.go",
      "kind": "function"
    },
    {
      "depth": 2,
      "symbol": "scheduleOne",
      "file": "pkg/scheduler/schedule_one.go",
      "kind": "function"
    },
    {
      "depth": 2,
      "symbol": "frameworkImpl.RunPreFilterPlugins",
      "file": "pkg/scheduler/framework/runtime/framework.go",
      "kind": "method"
    },
    {
      "depth": 3,
      "symbol": "Scheduler.scheduleOne",
      "file": "pkg/scheduler/scheduler.go",
      "kind": "method",
      "is_dynamic": true
    },
    {
      "depth": 3,
      "symbol": "TestFramework.RunFilterPlugins",
      "file": "pkg/scheduler/testing/framework.go",
      "kind": "method",
      "is_dynamic": true
    }
  ],
  "inherited_by": [
    {
      "symbol": "frameworkImpl.RunFilterPlugins",
      "file": "pkg/scheduler/framework/runtime/framework.go"
    },
    {
      "symbol": "noopFramework.RunFilterPlugins",
      "file": "pkg/scheduler/framework/runtime/framework.go"
    },
    {
      "symbol": "TestFramework.RunFilterPlugins",
      "file": "pkg/scheduler/testing/framework.go"
    }
  ]
}
```

Walk through this output the way an agent should. Fourteen symbols call this method across eight files. Four of those call sites are dynamic — they go through the `Framework` interface, so the actual dispatch target is resolved at runtime. Six subclasses implement the method (only three shown in this excerpt). If you change the signature of `RunFilterPlugins`, you need to update the interface definition, all three concrete implementations, the test double, and every call site that constructs the arguments — including the four dynamic ones that the type system won't necessarily catch.

This is a HIGH risk change. That's not a reason to avoid it. It's a reason to write a checklist before you start.

## Inheritance-Aware Analysis

When a method is part of an inheritance hierarchy, the blast radius extends to every class that overrides it. astix detects this automatically by tracking the `parent` relationship on symbols — the same data that `get_symbol(include_inherited_by: true)` exposes.

Consider a `BaseHandler.process()` method with five subclasses:

```json
{
  "symbol": "process",
  "file": "src/handlers/base.ts",
  "risk_level": "high",
  "risk_factors": {
    "total_callers": 6,
    "total_files": 4,
    "is_exported": true,
    "has_dynamic_callers": false,
    "dynamic_caller_count": 0,
    "inherited_by_count": 5
  },
  "inherited_by": [
    { "symbol": "JsonHandler.process", "file": "src/handlers/json.ts" },
    { "symbol": "XmlHandler.process",  "file": "src/handlers/xml.ts" },
    { "symbol": "CsvHandler.process",  "file": "src/handlers/csv.ts" },
    { "symbol": "BinaryHandler.process","file": "src/handlers/binary.ts" },
    { "symbol": "NullHandler.process", "file": "src/handlers/null.ts" }
  ]
}
```

Only 6 direct callers, 4 files — on its own that looks medium risk. But `inherited_by_count: 5` pushes the rating to `"high"`. Changing the base method's contract (parameter types, return shape, thrown exceptions, side effects) can silently invalidate all five overrides. The compiler may not catch it if the override signatures are individually valid — it's a behavioral contract violation, not a type error.

The `inherited_by` array gives you a precise checklist: those five files need to be reviewed, and their corresponding test files need to be run.

## Combining Impact Analysis with Rename

The correct workflow for any non-trivial refactor is: understand first, change second. `impact_analysis` gives you the understanding; `rename_symbol` gives you the safe change.

Here is the full pattern for renaming `handleRequest` to `processHttpRequest`:

**Step 1 — measure the blast radius:**

```typescript
impact_analysis({
  name: "handleRequest",
  project: "my-api",
  depth: 3
})
// → risk_level: "high", 14 callers, 8 files, 3 subclasses
```

**Step 2 — review the callers list.** For each entry in `callers[]`, decide: does this call site need behavioral changes beyond the rename, or is it a pure mechanical update? Flag any that need manual review.

**Step 3 — review the inherited_by list.** Open each subclass. Confirm the override signature is compatible with your intended new signature.

**Step 4 — execute the rename atomically:**

```typescript
rename_symbol({
  file: "src/server/router.ts",
  name: "handleRequest",
  new_name: "processHttpRequest",
  project: "my-api"
})
```

`rename_symbol` updates the definition, every call site in `callers[]`, every import statement that references the name, and every override in `inherited_by[]` — in a single operation. It does not generate a diff for you to apply: it writes the changes and updates the index immediately. There are no missed references because it operates on the same call graph that `impact_analysis` traversed.

After the rename, run your test suite. If `impact_analysis` flagged dynamic callers, [test those paths explicitly](/blog/execution-paths#map-every-execution-path) — they're the ones the type system cannot verify.

The key insight: `impact_analysis` and `rename_symbol` are designed as a pair. The first gives you the map; the second makes the change. Never skip the first step. A rename with an unknown blast radius is a refactoring gamble. A rename after `impact_analysis` is a controlled operation.

## Confident Refactoring

The refactoring gamble exists because call graphs are invisible without the right tooling. You grep, you find the obvious callers, you change the code, and then something two hops away breaks in production.

`impact_analysis` makes the graph visible. Before you touch a function, you know: how many callers, across how many files, how many dynamic dispatch paths, how many subclasses. The `risk_level` is a judgment call distilled into a single token — but the full `callers[]` and `inherited_by[]` arrays give you the evidence to verify it yourself.

Pair it with `rename_symbol` for atomic refactors, or use the caller list to manually audit code paths before a behavioral change. Either way, you're making a decision with information instead of making a guess with grep.

No more "I didn't know X depended on Y." That information is in the graph. Now you can see it.

[Get started →](/docs/getting-started) or [explore the full MCP tools reference →](/docs/mcp-tools)

</BlogPostLayout>
