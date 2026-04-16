---
title: "Polyglot Code Intelligence: 38 Languages, One API"
date: 2026-04-24
dateModified: 2026-04-24
category: insights
featured: false
readingTime: 10
author: "Olivier Orabona"
image: https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop
description: "Same impact_analysis on TypeScript, Python, Go, and Rust. tree-sitter parses 38 languages into one AST index with universal call graph intelligence."
tags:
  - tree-sitter
  - multi-language
  - architecture
  - polyglot
  - code-analysis
  - developer-tools
  - typescript
  - python
  - go
  - rust
layout: page
---

<script setup>
import BlogPostLayout from '../../.vitepress/theme/components/BlogPostLayout.vue'
</script>

<BlogPostLayout>

Every language has its own tool. TypeScript teams reach for ts-morph. Python teams use the `ast` module. Go teams rely on `go/ast`. Rust teams integrate `syn`. Each tool has its own API, its own data model, its own concept of what a "symbol" or a "call" even means. Polyglot teams — running a TypeScript frontend, a Python ML pipeline, and a Go service layer — end up maintaining three completely different setups just to answer one question: "what breaks if I change this?"

astix takes a different approach. One index, one API, 38 languages.

Polyglot code intelligence means providing the same analysis capabilities — call graphs, impact analysis, semantic search, data lineage — across multiple programming languages through a single, unified API. astix achieves this using tree-sitter, an incremental parsing framework that supports 38 languages through pluggable grammars. Each language's source code is parsed into a concrete syntax tree, from which astix extracts a universal symbol model: functions, classes, methods, variables, calls, and imports stored in the same PostgreSQL schema regardless of language. The result is that `impact_analysis` on a TypeScript function returns the same JSON structure as on a Python function, a Go function, or a Rust function — enabling language-agnostic tooling for polyglot teams.

## The Tool Fragmentation Problem

The problem with language-specific tools is not that they're bad. ts-morph is excellent for TypeScript. The Python `ast` module is accurate and well-documented. The issue is that each operates in isolation, with an API designed for its language's idioms rather than for the questions you actually need to answer.

Ask "who calls this function?" and you get different answer shapes from each tool. ts-morph returns `Node` objects with TypeScript-specific navigation methods. `go/ast` returns raw AST nodes you traverse manually. `syn` gives you Rust token streams. None of them give you the same structured, queryable answer regardless of which language the code is in.

For AI coding assistants, this is a harder problem still. An agent working on a polyglot codebase would need to know which tool to call, in what order, and how to merge the results into a coherent picture. That's too much overhead — and it scales linearly with the number of languages in your stack.

The deeper issue: tool fragmentation means intelligence fragmentation. TypeScript gets deep call graph analysis; your Python service gets grep. Go gets precise type resolution; your Rust library gets a symbol list. Teams end up with uneven coverage, and the weakest link is always the language nobody tooled properly.

## tree-sitter: One Parser, Every Language

[tree-sitter](https://tree-sitter.github.io/tree-sitter/) is an incremental, error-tolerant parser generator. Given a grammar definition, it produces a parser that can turn source code into a concrete syntax tree (CST) in milliseconds — even for files with syntax errors. It was built for code editors (VS Code, Neovim, and Helix all use it) and is optimized for the edit-parse-query loop: change five lines, re-parse only those five lines.

This is the foundation astix builds on. Every supported language has a tree-sitter grammar. When astix indexes a project, each source file is piped through the appropriate parser — the grammar is selected from the file extension — and the resulting CST is walked to extract symbols, call sites, and import edges.

The extraction pipeline is where the real work happens. A tree-sitter CST is language-specific: a TypeScript `MethodDeclaration` node is not the same as a Python `FunctionDef` or a Go `FuncDecl`. astix has per-language visitors that map each language's CST node types to a common internal model:

```
Language CST node → astix Symbol {
  id, name, kind, file, line_start, line_end,
  signature, doc_comment, language, project
}
```

Once in PostgreSQL, a symbol is a symbol regardless of language. A function in Go and a function in Python live in the same `symbols` table. A call edge between two TypeScript functions and a call edge between two Rust functions live in the same `calls` table. The same SQL queries, the same MCP tools, the same API surface — for everything.

Incremental parsing means the index stays fresh without full rescans. When you edit a file, only that file is re-parsed. The previous symbols for that file are removed and replaced. For a 100K-line project spread across three languages, a typical edit-index cycle takes under 200ms.

<MermaidDiagram code="graph LR
    subgraph &quot;Source Files&quot;
        TS[&quot;TypeScript&quot;]
        PY[&quot;Python&quot;]
        GO[&quot;Go&quot;]
        RS[&quot;Rust&quot;]
    end
    subgraph &quot;tree-sitter&quot;
        G[&quot;Language<br/>Grammars&quot;]
    end
    subgraph &quot;Universal Index&quot;
        DB[&quot;PostgreSQL<br/>same schema&quot;]
    end
    subgraph &quot;MCP Tools&quot;
        T[&quot;impact_analysis<br/>search_semantic<br/>data_lineage&quot;]
    end
    TS --> G
    PY --> G
    GO --> G
    RS --> G
    G --> DB
    DB --> T" />

## The 3-Tier Model

Not all languages can support the same level of intelligence. Full call graph extraction requires understanding how a language resolves method calls — which depends on type information, import semantics, and often on runtime dispatch rules. A simple surface-level parser can tell you that a function named `handler` is defined on line 42; it takes deeper analysis to tell you that the call on line 87 in another file resolves to *that specific* handler.

astix uses a three-tier model to be explicit about what each language can deliver.

**Tier 1 — 10 languages: TypeScript, JavaScript, Python, Rust, Go, Java, C#, C, C++, Ruby.**

These languages have full call graphs, type bindings, control flow graphs (CFG), and [CFG-aware taint analysis](/blog/sast-taint-analysis#cfg-aware-taint-analysis). For each call site, astix resolves which symbol is being called — not just the name, but the specific definition, including across method dispatch and module boundaries. This is the tier where `impact_analysis` returns transitive callers, where `data_lineage` traces across function calls, and where `get_execution_paths` maps every branch.

Full call graph extraction in Tier 1 languages required building language-specific resolution logic on top of the tree-sitter CST: import resolution (which module does this `import` statement actually load?), method dispatch (which class's `handle` method does this call resolve to?), and type narrowing (what is the concrete type of this variable at this point in the CFG?). None of this is free — it's why Tier 1 is 10 languages and not 38.

**Tier 2 — 23 languages: Kotlin, Swift, Scala, PHP, Ruby, Elixir, Haskell, Lua, R, MATLAB, and more.**

These languages have symbol extraction and basic import tracking. Call detection is best-effort: astix identifies call-shaped expressions and links them to symbols with the same name in the index, without full type resolution. The results are useful — you get a call graph — but precision is lower. Refactoring tools work; blast radius estimates are approximate.

**Tier 3 — 5 file types: JSON, YAML, TOML, Dockerfile, Makefile.**

These are not programming languages in the traditional sense, but they're part of your codebase. astix parses them into key-value pairs and structured entries. You can `search_structural` for a specific configuration key across all your YAML files, or find which Dockerfiles reference a particular base image. Call graphs don't apply, but symbol-level indexing still gives you searchable, queryable structure.

The tier design is intentional transparency. astix doesn't pretend every language gets the same depth. The API tells you the language tier of a symbol in every response — so you know exactly what the result set means.

## Same Tool, Four Languages

The most direct demonstration: run [`impact_analysis`](/blog/impact-analysis#same-blast-radius-analysis-in-every-language) on an HTTP request handler written in four different languages, and look at what comes back.

**TypeScript (Express)**

```typescript
// src/routes/users.ts
export async function getUser(req: Request, res: Response) {
  const user = await userService.findById(req.params.id)
  res.json(user)
}
```

```json
{
  "symbol": "getUser",
  "file": "src/routes/users.ts",
  "language": "typescript",
  "tier": 1,
  "risk_level": "medium",
  "direct_callers": [
    { "name": "router.get", "file": "src/routes/index.ts", "line": 14 },
    { "name": "testGetUser", "file": "tests/users.test.ts", "line": 23 }
  ],
  "transitive_callers_count": 4,
  "affected_files": ["src/routes/index.ts", "src/app.ts", "tests/users.test.ts"],
  "inherited_by": []
}
```

**Python (FastAPI)**

```python
# app/routes/users.py
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    return user
```

```json
{
  "symbol": "get_user",
  "file": "app/routes/users.py",
  "language": "python",
  "tier": 1,
  "risk_level": "medium",
  "direct_callers": [
    { "name": "router.add_api_route", "file": "app/routes/__init__.py", "line": 8 },
    { "name": "test_get_user", "file": "tests/test_users.py", "line": 17 }
  ],
  "transitive_callers_count": 3,
  "affected_files": ["app/routes/__init__.py", "app/main.py", "tests/test_users.py"],
  "inherited_by": []
}
```

**Go (Gin)**

```go
// handlers/users.go
func GetUser(c *gin.Context) {
    id := c.Param("id")
    user, err := userService.FindByID(id)
    c.JSON(http.StatusOK, user)
}
```

```json
{
  "symbol": "GetUser",
  "file": "handlers/users.go",
  "language": "go",
  "tier": 1,
  "risk_level": "medium",
  "direct_callers": [
    { "name": "r.GET", "file": "routes/routes.go", "line": 11 },
    { "name": "TestGetUser", "file": "handlers/users_test.go", "line": 29 }
  ],
  "transitive_callers_count": 3,
  "affected_files": ["routes/routes.go", "main.go", "handlers/users_test.go"],
  "inherited_by": []
}
```

**Rust (Actix-web)**

```rust
// src/handlers/users.rs
pub async fn get_user(path: web::Path<i32>, pool: web::Data<DbPool>) -> impl Responder {
    let user_id = path.into_inner();
    let user = db::find_user(&pool, user_id).await;
    HttpResponse::Ok().json(user)
}
```

```json
{
  "symbol": "get_user",
  "file": "src/handlers/users.rs",
  "language": "rust",
  "tier": 1,
  "risk_level": "medium",
  "direct_callers": [
    { "name": "web::resource", "file": "src/routes.rs", "line": 19 },
    { "name": "test_get_user", "file": "src/handlers/users_test.rs", "line": 44 }
  ],
  "transitive_callers_count": 5,
  "affected_files": ["src/routes.rs", "src/main.rs", "src/handlers/users_test.rs"],
  "inherited_by": []
}
```

Four languages. Four different syntaxes. Same JSON shape. The same agent code that reads `impact_analysis` output for TypeScript handlers works unchanged for Python, Go, and Rust. There is no language-specific branch in the agent logic.

This is what a universal API makes possible: the AI assistant doesn't need to know which language it's looking at. It calls `impact_analysis`, reads the structured response, and reasons about the blast radius. The language is metadata, not a dispatch condition.

## Cross-Language Search

The universal index enables queries that would be impossible with language-specific tools: finding the same concept across every language in a project simultaneously. This extends [semantic search across 20,000 files](/blog/semantic-search#semantic-search-across-20000-files) to the full polyglot surface area of your organization.

```typescript
// Find every HTTP request handler — across all languages, all projects
search_semantic({
  query: "HTTP request handler that reads path parameters",
  project: "*"
})
```

Results:

```json
[
  { "name": "getUser",   "file": "src/routes/users.ts",      "language": "typescript", "score": 0.94 },
  { "name": "get_user",  "file": "app/routes/users.py",      "language": "python",     "score": 0.91 },
  { "name": "GetUser",   "file": "handlers/users.go",        "language": "go",         "score": 0.89 },
  { "name": "get_user",  "file": "src/handlers/users.rs",    "language": "rust",       "score": 0.88 },
  { "name": "UserController#show", "file": "app/controllers/users_controller.rb", "language": "ruby", "score": 0.85 }
]
```

The semantic search operates on vector embeddings of symbol signatures and doc comments. The embedding space doesn't care about syntax — a TypeScript `async function getUser(req: Request, res: Response)` and a Python `async def get_user(user_id: int, db: Session)` are semantically close because they describe the same intent. The BM25 component picks up on shared terminology (path, request, handler) regardless of language-specific naming conventions.

For polyglot teams doing architecture reviews, this is significant. "Find every place we do token validation" is now a single query against the whole codebase — not four separate searches with four different tools and four different result formats to merge manually.

## Per-Language Idioms

Normalizing 38 languages into a common model without losing language-specific meaning requires handling each language's structural idioms explicitly.

**TypeScript decorators.** A `@Controller('/users')` decorator and a `@Get('/:id')` method decorator together define a route. astix's TypeScript visitor recognizes this pattern and tags the method with the full route path as part of its symbol metadata, making it searchable as a route handler even if the function name is generic.

**Python `__init__` and `__dunder__` methods.** Python's constructor and magic methods have a naming convention rather than a keyword. The Python visitor treats `__init__` as a constructor (`kind: "constructor"`), `__str__` and `__repr__` as serializers, and `__enter__`/`__exit__` as context manager boundaries — mapping them to the common symbol kind taxonomy rather than treating them as ordinary functions.

**Go interfaces.** Go's implicit interface satisfaction means there's no `implements` keyword to parse. astix resolves interface satisfaction structurally: a type `T` implements interface `I` if it has methods matching every signature in `I`. This is resolved at index time and stored in the `parents` relationship — so `get_symbol` on a Go interface shows all types that implement it, even without explicit declaration.

**Rust traits.** Rust's `impl Trait for Type` blocks are parsed explicitly, linking the trait to the implementing type in the index. `search_structural({ parent: "Responder" })` returns every Actix handler type — because every `impl Responder for T` is captured as a parent relationship. Blanket implementations (`impl<T: Send> Trait for T`) are flagged as such, with a note that the affected set is not fully enumerable without monomorphization.

In each case, the goal is the same: map language-specific syntax to the common symbol model without losing information. The common model is the interface. The per-language visitors are the adapters. The user never sees the adapter — only the consistent result.

## One Index, Every Language

Tool fragmentation is a real cost. It's maintenance overhead (N tools to update), cognitive overhead (N APIs to remember), and — for AI assistants specifically — architectural overhead: an agent that needs to know which tool to call based on file extension is an agent with implicit language logic baked in everywhere.

The tree-sitter foundation lets astix offer something different: a single index where TypeScript, Python, Go, and Rust are all first-class citizens with the same query surface. Tier 1 languages get the full picture — call graphs, type resolution, execution paths, data lineage. Tier 2 languages get structural intelligence — symbols, imports, approximate call detection. Every tier gets the same tools.

For AI coding assistants, this means the tool layer is language-agnostic. `impact_analysis` works the same way whether the agent is editing a TypeScript component or a Rust service. `search_semantic` finds intent across the whole polyglot codebase in one query. `rename_symbol` updates call sites in every language where the symbol is referenced.

One API. Every language. No fragmentation.

[Start indexing your polyglot codebase →](/docs/getting-started)

</BlogPostLayout>
