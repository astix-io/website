---
title: "Community Detection: Map Your Codebase Architecture"
date: 2026-04-24
dateModified: 2026-04-24
category: tutorials
featured: false
readingTime: 10
author: "Olivier Orabona"
image: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop
description: "Use the Leiden algorithm on your call graph to discover logical modules, detect coupling, and visualize your codebase architecture — no documentation needed."
tags:
  - community-detection
  - leiden-algorithm
  - architecture
  - visualization
  - code-architecture
  - monorepo
  - refactoring
  - graph-theory
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

Every codebase has a real architecture. It just doesn't live in your folder structure.

> Community detection for codebases applies the Leiden graph clustering algorithm to a program's call graph, treating symbols (functions, classes, types) as nodes and calls and imports as edges. The algorithm partitions the graph into densely connected subgroups — communities — that represent logical modules. Unlike folder structure, which reflects organizational decisions, community structure reflects actual code coupling. A modularity score above 0.7 indicates genuinely well-separated modules; scores below 0.5 suggest tightly coupled code that may benefit from refactoring. Each community receives an auto-generated label based on the most distinctive terms in its symbol names.

## The Invisible Architecture

Imagine inheriting a 500-file TypeScript monolith. No architecture docs. The senior engineer who built it left six months ago. There's a Confluence page from 2019 that describes a microservices plan that was never executed. Folders are named `utils`, `helpers`, `services`, `core`, and `shared` — names that tell you nothing about what the code actually does or how the pieces relate.

The traditional approach: find someone who's been there the longest, ask them to draw boxes on a whiteboard, then spend two weeks reading code to validate their mental model. By the time you finish, you've changed twelve files and the whiteboard diagram is already wrong.

The problem isn't that codebases are undocumented. The problem is that architecture lives in the call graph, not in comments or folder names. Every time a function calls another function, it reveals a dependency. Every import edge is a vote for "these two things belong together." The structure is there — it's just encoded in relationships that no human naturally reads in aggregate.

Community detection is how you read it.

## What Is Community Detection?

Community detection comes from graph theory and social network analysis. The core intuition: in a graph where dense clusters of nodes are loosely connected to each other, those clusters are "communities." In social networks, they map to friend groups, professional circles, or interest communities. In a codebase, they map to logical modules.

The mapping is direct:

- **Nodes** = symbols (functions, classes, types, variables)
- **Edges** = calls and imports between them
- **Weight** = call frequency or import count

Given this graph, community detection algorithms partition the nodes into groups that maximize internal connectivity and minimize cross-group connections. The metric is **modularity** — a score between 0 and 1 where 0 means the partition is no better than random, and 1 means every community is perfectly isolated from every other.

Real codebases typically score between 0.4 and 0.8. Above 0.7 is genuinely well-structured. Below 0.4 usually means either a very small codebase or a serious tangle.

### Why Leiden, Not Louvain?

Louvain has been the standard community detection algorithm for over a decade. It's fast and produces reasonable results. But it has a known flaw: it can generate poorly-connected communities — groups where nodes are assigned together even though the path between them runs almost entirely through other communities. The communities look good at the aggregate level but fall apart under inspection.

Leiden (Traag et al., 2019) fixes this. After each partition step, it checks that all communities are internally connected, and refinement stops only when no node can be moved to a neighboring community to improve modularity. The result is communities where high cohesion is guaranteed by construction, not just by the overall score.

For codebase analysis, this matters. A poorly-connected Louvain community might group `EditorPane`, `FileService`, and `NetworkAdapter` together because they happen to share a common utility library — even though they have no direct relationship. Leiden won't make that mistake.

## Running It on a Real Codebase

Let's use a medium-sized TypeScript project as an example — say, 1,200 indexed symbols across 80 files. The call is one line:

```typescript
detect_communities({ persist: true })
```

The `persist: true` flag writes community assignments back to the index, which enables community-scoped queries later (more on that below).

Realistic output:

```json
{
  "communities": [
    {
      "id": 0,
      "label": "editor-core",
      "size": 234,
      "cohesion": 0.87,
      "top_symbols": ["EditorPane", "TextModel", "CursorController"],
      "top_files": ["src/editor/pane.ts", "src/editor/model.ts"]
    },
    {
      "id": 1,
      "label": "extension-host",
      "size": 156,
      "cohesion": 0.91,
      "top_symbols": ["ExtHostLanguageFeatures", "ExtHostCommands", "ExtHostWorkspace"],
      "top_files": ["src/extension/host.ts", "src/extension/api.ts"]
    },
    {
      "id": 2,
      "label": "file-service",
      "size": 89,
      "cohesion": 0.78,
      "top_symbols": ["FileService", "DiskFileSystemProvider", "FileWatcher"],
      "top_files": ["src/platform/files/fileService.ts"]
    },
    {
      "id": 3,
      "label": "telemetry-logging",
      "size": 41,
      "cohesion": 0.94,
      "top_symbols": ["TelemetryService", "AppInsightsAppender", "LogService"],
      "top_files": ["src/platform/telemetry/telemetryService.ts"]
    },
    {
      "id": 4,
      "label": "workspace-config",
      "size": 33,
      "cohesion": 0.52,
      "top_symbols": ["ConfigurationService", "UserSettings", "WorkspaceResolver"],
      "top_files": ["src/platform/configuration/configurationService.ts"]
    }
  ],
  "modularity": 0.71,
  "total_symbols": 1247,
  "cross_community_edges": 183,
  "algorithm": "leiden",
  "resolution": 1.0
}
```

The labels — `editor-core`, `extension-host`, `file-service` — are auto-generated from the most discriminative terms in the symbol names within each community. They're not always perfect, but they're almost always useful as a starting point.

<MermaidDiagram code="graph TB
    subgraph &quot;Community 1: editor-core&quot;
        E1[&quot;EditorPane&quot;] --> E2[&quot;TextModel&quot;]
        E2 --> E3[&quot;CursorController&quot;]
        E1 --> E3
    end
    subgraph &quot;Community 2: extension-host&quot;
        X1[&quot;ExtHostLanguageFeatures&quot;] --> X2[&quot;ExtHostCommands&quot;]
        X2 --> X3[&quot;ExtHostDiagnostics&quot;]
    end
    subgraph &quot;Community 3: file-service&quot;
        F1[&quot;FileService&quot;] --> F2[&quot;DiskProvider&quot;]
    end
    E2 -.->|&quot;cross-community<br/>coupling&quot;| F1
    X1 -.->|&quot;cross-community<br/>coupling&quot;| E1" />

## Reading the Results

**High cohesion (> 0.8)** means the community is genuinely well-isolated. Its symbols call each other heavily and rarely reach outside. `extension-host` at 0.91 is a textbook example — the extension host protocol is a well-defined boundary.

**Low cohesion (< 0.5)** is a red flag. Community 4 (`workspace-config`) at 0.52 is suspicious. It has 33 symbols that the algorithm grouped together, but almost half their call relationships run to symbols outside the community. This is a candidate for further inspection: is it a genuine module that happens to depend heavily on shared utilities? Or is it a "god module" that was never properly isolated?

**Cross-community edges** are your coupling map. The output shows 183 cross-community edges total. If you query which communities those edges connect, you get your dependency graph at the module level — not at the file level, where it's too detailed to read, and not at the folder level, where it's too coarse to be useful.

**Community size distribution** tells a structural story. A healthy codebase tends to have a few large communities (the core domains) and several smaller ones (utilities, infrastructure, adapters). If you have one community with 900 symbols and everything else is tiny, you likely have a monolith that was never decomposed. If you have 40 communities of 30 symbols each, you may have over-fragmented design.

**Auto-generated labels** are based on TF-IDF scoring over the symbol names within each community. They work well when code is consistently named. They fail when symbol names are generic (`handleRequest`, `processData`) — in that case, the label will be generic too, and you'll want to inspect `top_symbols` directly.

## Use Cases

### Onboarding

This is the most immediately valuable use case. A new engineer joins the team. Instead of a whiteboard session, run `detect_communities` and give them the output. In five minutes, they have an evidence-based map of the codebase's actual structure — not the aspirational structure from the 2019 design doc, but the structure revealed by actual call relationships in the current code. For a complete [6-step codebase onboarding method](/blog/source-code-archaeology) that combines community detection with execution tracing, impact analysis, and data lineage, see the dedicated walkthrough.

Pair it with `trace_flow` per community to get a human-readable description of what each module does:

```typescript
trace_flow({ entry: "EditorPane", community: 0, format: "text" })
```

This gives you a narrative: "EditorPane initializes TextModel, registers CursorController for cursor events, delegates rendering to ..." — exactly what you'd want to write in an architecture doc, generated automatically.

### Refactoring Targets

Low-cohesion communities tell you where to refactor. But the cross-community edges tell you *how*. Each cross-community edge is a dependency that crosses a module boundary — a coupling point. The high-traffic cross-community edges (many calls across the boundary) are the seams worth addressing first.

If two communities have 40 cross-community edges between them and both have low cohesion, consider merging them. If one community calls into another heavily but not vice versa, you have a clear one-directional dependency — make it explicit with an interface or event boundary.

### Impact Analysis with Community Boost

When `persist: true` is set, community membership is stored in the index and becomes available as a parameter to other tools. The most powerful combination is with `impact_analysis`:

```typescript
impact_analysis({
  symbol: "FileService",
  community_boost: true
})
```

With `community_boost: true`, the impact analysis separates blast radius by community. Changes to `FileService` might touch 240 symbols in total — but if 200 of them are in the same `file-service` community and only 40 are in other communities, your actual cross-boundary risk is much lower than the raw number suggests. You can confidently refactor within the community and treat the 40 cross-boundary callers as the real risk surface.

### Monorepo Boundary Validation

If you're running a monorepo with declared package boundaries (via `package.json` workspaces, Nx project graph, or Turborepo), community detection gives you an objective validation. The question is simple: do the detected communities match the declared package boundaries?

**Ideal case:** community boundaries and package boundaries are aligned. Internal calls dominate; cross-package calls are rare and intentional.

**Common anti-pattern:** two packages share a community. Their call graphs are too intertwined to be cleanly separated. The package boundary exists in the build config but not in the code. Merging the packages would reduce accidental complexity; or a hard interface boundary needs to be enforced.

**Another anti-pattern:** one package contains two communities. The package can be split without changing any call relationships — it's already two separate modules sharing a deployment unit.

Here's a concrete before/after. Your folder structure says:

```
src/
├── core/
│   ├── editor.ts
│   ├── file-service.ts
│   └── config.ts
└── platform/
    ├── telemetry.ts
    └── extension-host.ts
```

But the community structure reveals:

| Community | Files |
|---|---|
| editor-core | core/editor.ts |
| file-service | core/file-service.ts |
| workspace-config | core/config.ts + platform/ (partial) |
| telemetry | platform/telemetry.ts |
| extension-host | platform/extension-host.ts |

The `core/` folder is not a coherent module. `config.ts` couples into `platform/` in ways that `editor.ts` and `file-service.ts` don't. The folder structure is misleading — the community structure is accurate.

## Combining with Other Tools

Community detection is most powerful as a first step in a pipeline.

**Architecture diagrams.** `detect_communities` gives you nodes (communities) and edges (cross-community calls). Pipe these into `trace_flow` per community to generate Mermaid diagrams — one per community for detail, one at the community level for overview. You get architecture documentation that regenerates automatically when the code changes.

**Dead module detection.** A community with no incoming cross-community edges is a candidate for dead code analysis. Run `code_health` scoped to that community's files to [detect dead code and orphan modules](/blog/dead-code-detection). If the community itself is mostly dead code, you've found an orphan module — a piece of the codebase that has been effectively abandoned but never deleted.

**Semantic search within a module.** Once communities are persisted, `search_semantic` respects community boundaries:

```typescript
search_semantic({
  query: "handle cursor position updates",
  community: 0  // editor-core only
})
```

This is especially useful in large codebases where a generic query like "cursor" would return results from across the entire codebase. Scoping to the `editor-core` community filters the search space to where the answer is most likely to live.

**Coverage gaps by module.** Combine `get_uncovered_paths` with community membership to see which communities have the worst test coverage. A low-cohesion community with low test coverage is your highest-risk area — tightly coupled code that nobody has confidence to change.

## Conclusion

The architecture of your codebase is already there. It's encoded in millions of call relationships and import edges, written incrementally by dozens of engineers over years. Community detection reads that structure and makes it visible in minutes.

What you get is not a diagram someone drew in 2019. It's a live map derived from the actual code. It updates automatically as the code evolves. It shows you where the real module boundaries are, where coupling has accumulated, and where the folder structure has drifted away from reality.

For onboarding, it replaces weeks of exploration with a five-minute overview. For refactoring, it gives you evidence-based targets instead of gut feelings. For monorepo governance, it validates whether your declared boundaries match your actual dependency graph.

Try it on your project:

```typescript
detect_communities({ persist: true })
```

If the modularity score surprises you — higher or lower than expected — you've already learned something about your codebase that wasn't in any document.

[Get started with astix →](/getting-started) · [Full MCP tools reference →](/guide/mcp-tools)

</BlogPostLayout>
