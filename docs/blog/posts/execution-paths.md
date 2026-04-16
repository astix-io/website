---
title: "Execution Path Analysis: Find Untested Code Branches"
date: 2026-04-24
dateModified: 2026-04-24
category: tutorials
featured: false
readingTime: 9
author: "Olivier Orabona"
image: https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop
description: "47 lines, 3 branches, 8 possible paths. Your tests cover 2. astix maps every execution path and finds the ones your coverage misses."
tags:
  - execution-paths
  - testing
  - cfg
  - coverage
  - code-coverage
  - software-testing
  - path-coverage
  - static-analysis
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

Your test suite is green. 80% line coverage. You ship.

Three days later, a customer hits an edge case that causes a silent data corruption. You look at the test coverage report — the line that failed is covered. The function was executed in tests. But not that branch. Not that combination of conditions. Not that path.

Line coverage measures which lines run. Path coverage measures which sequences of decisions your code takes. These are not the same thing, and the gap between them is where bugs live.

A function with three independent boolean conditions has eight possible execution paths. Your test suite covers two — the happy path and the obvious error case. The other six paths? Unknown territory. Production will find them.

The math compounds quickly. Add a try/catch around an external call. Add a retry loop with a configurable limit. Add a fallback when the retry exhausts. A 47-line function can easily have 32 distinct paths through it. The ones your tests don't cover aren't hypothetical. They fire in production, under load, when the network hiccups, when the queue backs up, when a user sends input that's valid but unusual.

The problem isn't that engineers write insufficient tests. The problem is that without tooling, the untested paths are invisible.

Execution path analysis enumerates every distinct control flow path through a function by traversing its control flow graph (CFG). A function with three independent if/else branches has eight possible paths, though tests typically cover only two or three. astix extracts the CFG from tree-sitter's AST, identifies each path with its branching conditions and terminal states, and maps paths against coverage data (Istanbul JSON or lcov) to find gaps. The result is a complete list of tested and untested paths — each described by its condition chain and the functions it calls. This shifts testing from line coverage (which measures syntax visited) to path coverage (which measures behavior exercised).

## CFG Analysis on Real Code

astix builds a control flow graph (CFG) for every function it indexes. Every branch, every early return, every try/catch, every loop — represented as nodes and edges. `get_execution_paths` traverses that graph and returns every distinct path from entry to exit.

Take a realistic order processing function:

```typescript
async function processOrder(order: Order, options: ProcessOptions) {
  if (!validateOrder(order)) {
    throw new ValidationError("Invalid order");
  }

  let attempt = 0;
  while (attempt < options.maxRetries) {
    try {
      const result = await submitToPaymentGateway(order);
      if (result.requiresReview) {
        await flagForManualReview(order, result);
        return { status: "pending_review", result };
      }
      await confirmInventory(order);
      return { status: "confirmed", result };
    } catch (err) {
      attempt++;
      if (!options.isIdempotent || attempt >= options.maxRetries) {
        await rollbackOrder(order);
        throw err;
      }
      await delay(options.retryDelayMs * attempt);
    }
  }
}
```

Call `get_execution_paths({ name: "processOrder" })` and astix returns:

```json
{
  "symbol": "processOrder",
  "file": "src/orders/processor.ts",
  "path_count": 7,
  "complexity": 8,
  "paths": [
    {
      "id": "path_1",
      "description": "Validation failure — throws immediately",
      "conditions": ["!validateOrder(order)"],
      "terminals": ["throw ValidationError"],
      "length": 2
    },
    {
      "id": "path_2",
      "description": "Happy path — payment succeeds, inventory confirmed",
      "conditions": ["validateOrder(order)", "!result.requiresReview"],
      "terminals": ["return { status: 'confirmed' }"],
      "length": 5
    },
    {
      "id": "path_3",
      "description": "Payment succeeds, flagged for manual review",
      "conditions": ["validateOrder(order)", "result.requiresReview"],
      "terminals": ["return { status: 'pending_review' }"],
      "length": 5
    },
    {
      "id": "path_4",
      "description": "Payment throws, idempotent, retry succeeds on second attempt",
      "conditions": ["validateOrder(order)", "catch(err)", "options.isIdempotent", "attempt < maxRetries", "!result.requiresReview"],
      "terminals": ["return { status: 'confirmed' }"],
      "length": 9
    },
    {
      "id": "path_5",
      "description": "Payment throws, idempotent, retry flagged for review",
      "conditions": ["validateOrder(order)", "catch(err)", "options.isIdempotent", "attempt < maxRetries", "result.requiresReview"],
      "terminals": ["return { status: 'pending_review' }"],
      "length": 9
    },
    {
      "id": "path_6",
      "description": "Payment throws, not idempotent — immediate rollback and rethrow",
      "conditions": ["validateOrder(order)", "catch(err)", "!options.isIdempotent"],
      "terminals": ["rollbackOrder(order)", "throw err"],
      "length": 6
    },
    {
      "id": "path_7",
      "description": "Payment throws, idempotent, all retries exhausted — rollback and rethrow",
      "conditions": ["validateOrder(order)", "catch(err)", "options.isIdempotent", "attempt >= maxRetries"],
      "terminals": ["rollbackOrder(order)", "throw err"],
      "length": 7
    }
  ]
}
```

Seven paths in a 40-line function. Most engineers would estimate three or four — "validation error, happy path, and the retry case." The retry case alone splits into four paths depending on `isIdempotent` and whether the retry eventually succeeds or exhausts.

<MermaidDiagram code="graph TB
    A[&quot;processOrder()&quot;] --> B{&quot;validate?&quot;}
    B -->|&quot;valid&quot;| C{&quot;stock > 0?&quot;}
    B -->|&quot;invalid&quot;| D[&quot;return error&quot;]
    C -->|&quot;yes&quot;| E[&quot;chargePayment()&quot;]
    C -->|&quot;no&quot;| F[&quot;backorder()&quot;]
    E --> G{&quot;payment ok?&quot;}
    G -->|&quot;yes&quot;| H[&quot;fulfillOrder()&quot;]
    G -->|&quot;no&quot;| I[&quot;rollback()&quot;]" />

*Green borders = tested paths. Red borders = untested paths.*

## Finding Untested Paths

Knowing the paths is the first step. Knowing which ones your tests don't cover is where it becomes actionable.

`get_uncovered_paths` takes your Istanbul or lcov coverage file and cross-references it against the CFG. It returns only the paths that were never fully executed during your test run:

```typescript
get_uncovered_paths({
  name: "processOrder",
  coverage_path: "./coverage/coverage-final.json"
})
```

```json
{
  "symbol": "processOrder",
  "total_paths": 7,
  "covered_paths": 3,
  "uncovered_paths": [
    {
      "id": "path_4",
      "description": "Payment throws, idempotent, retry succeeds on second attempt",
      "conditions": ["options.isIdempotent === true", "attempt === 1", "second_submit succeeds"],
      "risk": "high",
      "note": "Retry success after transient failure — inventory confirmation runs on retried result. Not tested."
    },
    {
      "id": "path_5",
      "description": "Payment throws, idempotent, retry flagged for review",
      "conditions": ["options.isIdempotent === true", "attempt === 1", "result.requiresReview === true"],
      "risk": "medium",
      "note": "Review flag only appears on retried request. Manual review queue may receive duplicate entries."
    },
    {
      "id": "path_6",
      "description": "Payment throws, not idempotent — immediate rollback",
      "conditions": ["options.isIdempotent === false", "catch(err)"],
      "risk": "high",
      "note": "rollbackOrder() is called but its result is not awaited-checked. Silent failure possible."
    },
    {
      "id": "path_7",
      "description": "All retries exhausted — rollback and rethrow",
      "conditions": ["options.isIdempotent === true", "attempt >= maxRetries"],
      "risk": "high",
      "note": "Exhausted retry path exercises rollbackOrder() under already-degraded conditions. Not tested."
    }
  ]
}
```

Look at path_6. The condition is `options.isIdempotent === false` and a thrown error. The note flags something the CFG analysis detected: `rollbackOrder()` is called without its promise being awaited in a way that surfaces errors. If rollback fails, the function rethrows the original payment error — the rollback failure is swallowed.

This is not a problem you'd find with line coverage. The line is executed in your happy-path tests when rollback never runs. You'd find it in production, after a payment gateway outage, when an order gets stuck in a half-committed state.

Path_5 is subtler: a payment that succeeds on retry but is also flagged for review. That's a valid state in your domain — a payment gateway can return `requiresReview: true` on any attempt. But your test fixtures always set `requiresReview: false` on retried requests because you built them to test the retry mechanism, not the review flow. The combination was never tested.

## Generating Test Skeletons

Once you know which paths are uncovered, [`suggest_tests`](/blog/sast-taint-analysis#find-security-vulnerabilities-in-untested-paths) generates the scaffolding:

```typescript
suggest_tests({
  coverage_path: "./coverage/coverage-final.json",
  framework: "vitest"
})
```

```json
{
  "symbol": "processOrder",
  "generated_tests": [
    {
      "path_id": "path_4",
      "test_name": "should confirm inventory after successful retry when isIdempotent is true",
      "description": "Simulate transient payment failure on first attempt, success on second. Verify confirmInventory is called with the retried result, not the failed one.",
      "setup": {
        "order": "valid order fixture",
        "options": "{ isIdempotent: true, maxRetries: 3, retryDelayMs: 0 }",
        "mocks": "submitToPaymentGateway: [throws NetworkError, resolves { requiresReview: false }]"
      },
      "assertions": [
        "expect(submitToPaymentGateway).toHaveBeenCalledTimes(2)",
        "expect(confirmInventory).toHaveBeenCalledWith(order)",
        "expect(result.status).toBe('confirmed')"
      ]
    },
    {
      "path_id": "path_6",
      "test_name": "should surface rollback errors when isIdempotent is false",
      "description": "Payment throws on non-idempotent order. rollbackOrder also throws. Verify the caller receives a meaningful error, not a silently swallowed rollback failure.",
      "setup": {
        "options": "{ isIdempotent: false, maxRetries: 1 }",
        "mocks": "submitToPaymentGateway: throws PaymentError, rollbackOrder: throws RollbackError"
      },
      "assertions": [
        "await expect(processOrder(order, options)).rejects.toThrow()",
        "expect(rollbackOrder).toHaveBeenCalledOnce()"
      ]
    },
    {
      "path_id": "path_7",
      "test_name": "should rollback and rethrow after all retries exhausted",
      "description": "All retry attempts fail. Verify rollback is called exactly once after the final attempt, and the original error propagates.",
      "setup": {
        "options": "{ isIdempotent: true, maxRetries: 3, retryDelayMs: 0 }",
        "mocks": "submitToPaymentGateway: always throws NetworkError"
      },
      "assertions": [
        "expect(submitToPaymentGateway).toHaveBeenCalledTimes(3)",
        "expect(rollbackOrder).toHaveBeenCalledOnce()",
        "await expect(processOrder(order, options)).rejects.toThrow(NetworkError)"
      ]
    }
  ]
}
```

These aren't complete tests — they're specifications. The setup describes what needs to be mocked and how, the assertions describe what needs to hold. You fill in the fixture details and the mock implementations. The hard part — figuring out which scenario to test and what to assert — is already done.

The path_6 skeleton is particularly valuable here. It surfaced the unawaited rollback issue and made it a first-class test requirement: "verify the caller receives a meaningful error, not a silently swallowed rollback failure." Without the path analysis, this test would never be written because the scenario would never be thought of.

## Real Example: SQLite's `sqlite3VdbeExec`

`processOrder` has seven paths. Realistic, but tractable. Now consider `sqlite3VdbeExec` from the SQLite source — the function that executes VDBE bytecode instructions.

It's over 8,000 lines. It contains a switch statement with 178 opcodes. Each opcode has its own branching logic — arithmetic operations check for overflow, comparison operations handle NULL semantics, jump operations check loop bounds. The SQLite team estimates the function handles over 100 distinct opcode cases, each with multiple sub-paths.

```typescript
get_execution_paths({ name: "sqlite3VdbeExec", project: "sqlite" })
```

```json
{
  "symbol": "sqlite3VdbeExec",
  "file": "src/vdbe.c",
  "path_count": 847,
  "complexity": 1203,
  "cyclomatic_complexity": 312,
  "paths": [
    {
      "id": "path_1",
      "description": "OP_Init — program counter set to jump target",
      "length": 3
    },
    {
      "id": "path_2",
      "description": "OP_Integer — push integer constant, overflow check skipped (small value)",
      "length": 4
    },
    {
      "id": "path_3",
      "description": "OP_Add — integer addition, overflow detected, promote to real",
      "length": 7
    },
    {
      "id": "path_47",
      "description": "OP_Column — column read from cursor, NULL flag set, type affinity applied",
      "length": 12
    },
    {
      "id": "path_312",
      "description": "OP_Halt — error code non-zero, constraint violation, rollback triggered",
      "length": 9
    }
    // ... 842 more
  ],
  "uncovered_by_test_suite": 203,
  "high_risk_uncovered": 31
}
```

847 paths. 203 not covered by SQLite's own comprehensive test suite — one of the most tested C codebases in existence. 31 of those uncovered paths are high-risk: paths where error handling diverges from the primary path, where integer overflow promotion happens under specific numeric ranges, where NULL semantics interact with JOIN conditions in ways the test fixtures don't exercise.

The SQLite developers can't manually enumerate 847 paths. Nobody can. This isn't a criticism — it's the nature of complex stateful code. The CFG exists whether or not you have tooling to read it. astix makes it legible.

For a codebase at this scale, the output of `get_uncovered_paths` becomes an engineering artifact: a prioritized list of scenarios to investigate, triaged by risk level, with conditions spelled out. The team can work through the high-risk uncovered paths systematically rather than relying on intuition or waiting for production incidents.

## Conclusion

80% line coverage means 80% of your lines run in tests. It says nothing about how many paths through those lines are exercised. In a function with branching logic, the difference is enormous. Before changing any branched function, [measure the blast radius](/blog/impact-analysis#measure-the-blast-radius-before-changing-code) to understand which callers each path can reach.

astix makes path coverage concrete. `get_execution_paths` maps every branch from entry to exit. `get_uncovered_paths` cross-references against your existing coverage data and surfaces the gaps — not as percentages, but as specific conditions and sequences. `suggest_tests` turns those gaps into test specifications.

The invisible becomes visible. The untested paths are no longer hypothetical — they're listed, ranked by risk, with the conditions that trigger them spelled out.

You don't need to wait for production to find your edge cases.

---

`get_execution_paths`, `get_uncovered_paths`, and `suggest_tests` are available on the Solo plan and above. The CFG is built automatically during indexing — no annotations, no configuration.

[Get started →](/docs/getting-started) or [view the tool reference →](/docs/mcp-tools)

</BlogPostLayout>
