---
title: "Dead Code Detection: Unused Exports and Orphan Modules"
date: 2026-04-24
dateModified: 2026-04-24
category: insights
featured: false
readingTime: 8
author: "Olivier Orabona"
image: https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop
description: "Your linter catches unused variables. astix finds unused exports, transitively dead call chains, and orphan modules with zero external callers."
tags:
  - dead-code
  - code-health
  - tech-debt
  - maintenance
  - code-cleanup
  - unused-code
  - refactoring
  - code-maintenance
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

Your linter reports zero unused variables. Your TypeScript compiler compiles clean. Your CI is green. And yet — somewhere in your codebase — there are hundreds, maybe thousands, of lines that nothing will ever execute again.

Dead code isn't one thing. It exists at three distinct levels, and most tools only see the first.

Dead code exists at three levels. Level 1 — unused variables and imports — is caught by standard linters. Level 2 — exported symbols with zero cross-file callers — requires import graph analysis across the entire project. Level 3 — orphan communities — are groups of interconnected symbols that have no incoming edges from the rest of the codebase, effectively forming isolated islands in the call graph. Most codebases contain 8–15% dead code by line count, costing token waste for AI assistants, longer build times, false positives in search results, and unnecessary cognitive load during code review. astix detects all three levels using its AST index without requiring runtime instrumentation.

## Three Levels of Dead Code

**Level 1: Unused variables and imports.** This is what your linter catches. A variable declared but never read. An import statement whose identifier is never referenced. ESLint, Biome, the TypeScript compiler — they all see this tier. It's the shallow end of the problem, and it's essentially solved.

**Level 2: Unused exports.** A function that is exported — making it a public API within your module system — but that nothing in the codebase actually imports. The symbol is "used" from the compiler's perspective: it's reachable, it's exported, the module loads. But zero other files import it. If you deleted it, nothing would break.

Linters can't see this. A linter operates on a single file. It sees that your function is exported and marks it as used. It doesn't know whether any other file in the 300-file project ever calls it.

**Level 3: Dead communities.** This is the hardest class. An entire cluster of files — say, a feature module — where every function has callers and every export is imported. But the only callers are *within* the cluster. No external code ever reaches into this module. The whole thing is a self-contained island with zero incoming edges from the rest of the codebase.

Delete one entry point at the border of that island and you could delete all 12 files. But from inside any individual file, everything looks healthy.

Most dead code detection stops at Level 1. Level 2 requires cross-file analysis. Level 3 requires graph-level community detection. Here is how astix handles all three.

<MermaidDiagram code="graph TB
    subgraph &quot;Level 1: Linter catches&quot;
        L1[&quot;unused variable<br/>unused import&quot;]
    end
    subgraph &quot;Level 2: Export analysis&quot;
        L2[&quot;exported function<br/>0 cross-file callers&quot;]
    end
    subgraph &quot;Level 3: Community analysis&quot;
        L3A[&quot;moduleA()&quot;] --> L3B[&quot;moduleB()&quot;]
        L3B --> L3C[&quot;moduleC()&quot;]
    end
    L3A -.->|&quot;0 incoming edges<br/>from rest of codebase&quot;| L3A" />

## Finding Unused Exports

The `code_health` tool runs a suite of structural checks against the AST index. One of those checks — `unused_exports` — cross-references every exported symbol against the import graph to identify exports with zero incoming cross-file references.

```bash
astix code_health --check unused_exports --project my-project
```

The response is a structured list of findings:

```json
{
  "check": "unused_exports",
  "total_count": 23,
  "findings": [
    {
      "name": "formatCurrencyDisplay",
      "kind": "function",
      "file": "src/utils/currency.ts",
      "start_line": 47,
      "exported": true,
      "cross_file_callers": 0,
      "message": "Exported function with no cross-file callers"
    },
    {
      "name": "LegacyPaymentAdapter",
      "kind": "class",
      "file": "src/adapters/legacy-payment.ts",
      "start_line": 12,
      "exported": true,
      "cross_file_callers": 0,
      "message": "Exported class with no cross-file callers"
    },
    {
      "name": "STRIPE_WEBHOOK_RETRY_LIMIT",
      "kind": "variable",
      "file": "src/config/stripe.ts",
      "start_line": 8,
      "exported": true,
      "cross_file_callers": 0,
      "message": "Exported constant with no cross-file callers"
    }
  ]
}
```

Each finding tells you: the symbol name, its kind, exactly where it lives, and that its cross-file caller count is zero. This is actionable. `formatCurrencyDisplay` is exported from `src/utils/currency.ts` at line 47. Nothing imports it. You can delete it — and be certain that deletion is safe, because the index knows every import edge in the project.

The important distinction: `code_health` doesn't just grep for the symbol name. It walks the actual import graph. A symbol can appear in a `* as utils` namespace import and still have zero callers if no code ever dereferences `utils.formatCurrencyDisplay`. The structural index tracks usage at the call-site level, not the import-statement level.

## Transitively Dead Code

Here is where it gets more interesting. Consider this call chain:

```
reportingDashboard() → aggregateLegacyMetrics() → parseLegacyFormat()
```

`aggregateLegacyMetrics` has a caller: `reportingDashboard`. `parseLegacyFormat` has a caller: `aggregateLegacyMetrics`. A naive unused-export check marks both as "used." But if `reportingDashboard` is itself dead — an export with zero callers — then the entire chain is dead. The callers exist, but they're in dead code too.

This is the transitive problem. To solve it, you need a call graph traversal that starts from the dead root and walks *downward* through everything it exclusively reaches.

[`impact_analysis`](/blog/impact-analysis#trace-downstream-dependencies) gives you the downstream tree of any symbol:

```bash
astix impact_analysis --symbol "reportingDashboard" --file "src/dashboard/reports.ts" --depth 5
```

```json
{
  "symbol": "reportingDashboard",
  "file": "src/dashboard/reports.ts",
  "risk_level": "low",
  "cross_file_callers": 0,
  "downstream": [
    {
      "name": "aggregateLegacyMetrics",
      "file": "src/metrics/legacy.ts",
      "callers_outside_subtree": 0,
      "depth": 1
    },
    {
      "name": "parseLegacyFormat",
      "file": "src/metrics/legacy.ts",
      "callers_outside_subtree": 0,
      "depth": 2
    },
    {
      "name": "normalizeLegacyTimestamp",
      "file": "src/utils/legacy-time.ts",
      "callers_outside_subtree": 0,
      "depth": 3
    }
  ]
}
```

The `callers_outside_subtree` field is the key. A value of zero means this symbol's only callers are themselves within the dead subtree — so it is also safe to delete. When every node in the downstream tree shows `callers_outside_subtree: 0`, you have found a transitive dead cluster.

The practical workflow: run `code_health({ check: "unused_exports" })` to find dead roots. For each root, run `impact_analysis` with increasing depth to trace the downstream blast radius. Any downstream symbol where all callers fall within the dead tree is also dead. In practice, dead roots cluster — one disabled feature entry point can cascade to 8-12 transitively dead functions.

## Dead Communities

Level 3 requires stepping back further. Instead of looking at individual symbols, you look at the graph structure of entire modules.

[`detect_communities`](/blog/community-detection#community-detection-reveals-orphan-modules) partitions your codebase into clusters based on the density of import and call edges. Files that heavily reference each other end up in the same community. Files with sparse connections form separate communities. This is computed via graph algorithms over the full import and call graph in the index.

The dead community pattern has one signature: a cluster with zero incoming edges from any other cluster. Every function within it may have callers — but those callers are all inside the same community. The module is a closed system.

```json
{
  "communities": [
    {
      "id": "community_7",
      "size": 12,
      "files": [
        "src/features/legacy-xml-import/index.ts",
        "src/features/legacy-xml-import/parser.ts",
        "src/features/legacy-xml-import/normalizer.ts",
        "src/features/legacy-xml-import/schema-validator.ts"
      ],
      "internal_edges": 34,
      "incoming_edges_from_other_communities": 0,
      "total_lines": 312,
      "flag": "orphan_community"
    }
  ]
}
```

This is what a dead community looks like in practice. `community_7`: 12 files, 312 lines, 34 internal function calls, zero incoming edges. This is a feature — legacy XML import, in this case — that was disabled at some point. The entry point was removed from the router or the job scheduler, but the implementation was never cleaned up. Every function inside still has callers, every export is still imported — all of it within the cluster itself.

From any individual file's perspective, everything looks fine. Only from the graph level is the orphan visible.

Running `code_health` with the `orphan_communities` check will surface these directly, without requiring you to manually inspect `detect_communities` output. The check flags any community where `incoming_edges_from_other_communities === 0`.

## The Cost of Dead Code

Dead code has real, measurable costs. They compound over time and they're mostly invisible until you audit them.

**Token waste.** When an AI coding assistant reads your codebase to answer a question, it reads dead code too. `get_symbol` on a function that calls into a dead cluster returns callee information that consumes context tokens and contributes nothing to the agent's task. In a 50K-line project with 10% dead code, that's 5,000 lines of noise in every search result. Across a working day, that is a non-trivial share of your context budget.

**Build time.** Your bundler, your TypeScript compiler, your test runner — all traverse dead code. Tree-shaking helps for final bundles but does nothing for compile time or test collection time. A module with 8 dead files adds parsing, type-checking, and potentially test discovery overhead on every build.

**Cognitive load.** A developer reading `src/utils/` and seeing `legacy-payment.ts`, `legacy-xml-import/`, and `currency-display.ts` has to understand whether these are active or vestigial before touching anything nearby. Dead code creates a map where some territories no longer exist. Every new contributor pays this orientation tax.

**Search false positives.** [Dead code pollutes semantic search results](/blog/semantic-search#dead-code-pollutes-semantic-search-results) — `search_semantic` in astix returns dead symbols in results. If you ask "where is currency formatting handled?" and `formatCurrencyDisplay` is in the index with a body that looks relevant, it will appear in results. You follow the reference. You realize it's dead. You've wasted time. At scale, this noise degrades the reliability of every search.

Industry data suggests 8-15% of lines in a mature codebase are dead by the time teams start auditing. For a 50K-line project, that is 4,000-7,500 lines that consume tokens, build time, and cognitive load on every interaction.

## Removing Dead Code Safely

The workflow is straightforward once you have the data.

Start with `code_health` to find Level 1 and Level 2 dead code — unused imports and unused exports. Each finding comes with a file and line number. Delete the symbol. Run your tests. The index confirms no callers exist, so breakage is structurally impossible if the check was clean.

For transitive clusters: identify dead roots from the `unused_exports` check, run `impact_analysis` on each root, walk the downstream tree to find transitively dead symbols. Delete bottom-up — remove the leaf nodes first, then their parents. This avoids cascading type errors during deletion.

For dead communities: run `code_health` with `orphan_communities`. For each flagged community, confirm the flag with `detect_communities` to see the full file list. Delete the entire directory. Verify by re-running `code_health` — the community disappears from the index on the next sync.

Dead code is tech debt you can measure. Most teams discover it only when a new developer asks "what does this do?" and no one knows. With call graph analysis, you can turn that from a quarterly archaeology session into a routine check that runs alongside your lint and type checks.

Run `code_health` on your project. See what your linter missed.

[Get started →](/docs/getting-started) or [explore the `code_health` tool →](/docs/mcp-tools#code-health)

</BlogPostLayout>
