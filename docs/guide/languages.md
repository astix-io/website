---
title: Language Support
description: astix supports 36 programming languages across 3 tiers of intelligence.
---

# Language Support

**astix supports 36 programming languages across 3 tiers.**

All languages are parsed with [tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammars, giving astix a consistent, error-tolerant AST across the entire codebase. The tier determines how much intelligence astix can extract beyond raw symbol names.

---

## Tier 1 — Full Intelligence (10 languages)

Tier 1 languages have complete call graph extraction, control-flow graph (CFG) analysis, type binding resolution, and class hierarchy tracking. These languages get the full benefit of every astix tool: `impact_analysis`, `data_lineage`, `get_execution_paths`, and more.

**Features:** Symbols · Calls · Imports · CFG · Type Bindings · Parents

| Language | Notes |
|----------|-------|
| TypeScript | Includes `.ts`, `.tsx`, `.d.ts` |
| JavaScript | Includes `.js`, `.jsx`, `.mjs`, `.cjs` |
| Python | Includes `.py`, `.pyi` |
| Rust | Includes `.rs` |
| Go | Includes `.go` |
| Java | Includes `.java` |
| C# | Includes `.cs` |
| C | Includes `.c`, `.h` |
| C++ | Includes `.cpp`, `.cc`, `.cxx`, `.hpp` |
| Ruby | Includes `.rb` |

---

## Tier 2 — Symbols + Imports (23 languages)

Tier 2 languages have full symbol extraction and basic import tracking. You can search for symbols by name or intent (`search_structural`, `search_semantic`), navigate to definitions, and see cross-file import edges. Call graph analysis is not available.

**Features:** Symbols · Basic Imports

| Language | Language | Language |
|----------|----------|----------|
| PHP | Swift | Kotlin |
| Scala | Dart | Lua |
| Elixir | Haskell | OCaml |
| R | Julia | Perl |
| Zig | Nim | Crystal |
| Clojure | Erlang | F# |
| Groovy | MATLAB | PowerShell |
| Shell | Objective-C | |

---

## Tier 3 — Symbols Only (3 languages)

Tier 3 covers structured configuration and build files. astix extracts top-level keys and sections as symbols, enabling `search_structural` queries across config files alongside source code.

**Features:** Symbols

| Language | Extensions |
|----------|------------|
| TOML | `.toml` |
| YAML | `.yaml`, `.yml` |
| Dockerfile | `Dockerfile`, `.dockerfile` |

---

## Notes

- **Language detection** is based on file extension, with fallback to shebang lines for scripts.
- **Mixed projects** are fully supported — a monorepo with TypeScript, Python, and Go will index all three simultaneously.
- **Tier upgrades** happen automatically as astix adds deeper grammar support. Re-indexing is not required; changed files are lazily re-parsed.
- If you need a language not listed here, open an issue on [GitHub](https://github.com/astix-io/astix).
