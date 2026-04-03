---
layout: page
title: astix — Code intelligence for AI agents
description: Self-hosted code intelligence for AI coding agents. 36 languages, 30+ MCP tools. Works with Claude Code, Cursor, and any MCP client.
socialProof:
  enabled: true
---

<script setup>
import { useData } from 'vitepress'
import HeroShader from './.vitepress/theme/components/HeroShader.vue'
import TerminalDemo from './.vitepress/theme/components/TerminalDemo.vue'
import SocialProof from './.vitepress/theme/components/SocialProof.vue'
import NumbersBar from './.vitepress/theme/components/NumbersBar.vue'
import TypewriterQuote from './.vitepress/theme/components/TypewriterQuote.vue'
import PricingFaq from './.vitepress/theme/components/PricingFaq.vue'
const { frontmatter } = useData()
</script>

<ClientOnly><HeroShader /></ClientOnly>

<div class="scroll-snap-container">

<section class="snap-section relative px-6" style="position: relative; z-index: 1;">
<div class="flex items-center justify-center gap-2 py-2 text-xs font-medium" style="background: var(--badge-bg); border-bottom: 1px solid var(--badge-border); color: var(--accent-blue); position: relative; z-index: 1; position: absolute; top: 0; left: 0; right: 0;">
Open Source &nbsp;·&nbsp; Apache 2.0 &nbsp;·&nbsp; Free forever
</div>
<div class="hero-vignette" />
<div class="relative z-10 mx-auto max-w-2xl text-center">
<span class="animate-fade-up animate-delay-1 mb-10 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider" style="color: var(--accent-blue); background: var(--badge-bg); border: 1px solid var(--badge-border)">
Code Intelligence for AI Agents
</span>
<h1 class="animate-fade-up animate-delay-2 mb-14 font-sans text-5xl font-bold leading-tight tracking-tight md:text-7xl" style="color: var(--text-primary)">
Your AI agent doesn't understand <span class="gradient-text">your codebase</span>
</h1>
<div class="animate-fade-up animate-delay-3 mb-14">
<ClientOnly>
<TypewriterQuote
quote="It doesn't understand your code's structure at all. It uses text-based grep by default — returning the wrong file because it matched a comment instead of the actual definition."
source="r/ClaudeCode · 66 upvotes · Feb 2026"
source-url="https://www.reddit.com/r/ClaudeCode/comments/1rh5pcm/"
:delay="1200"
/>
</ClientOnly>
</div>
<p class="animate-fade-up animate-delay-4 mx-auto mb-12 max-w-lg text-lg leading-relaxed" style="color: var(--text-secondary)">
astix gives your agent an AST-level understanding of your entire codebase. Self-hosted. 36 languages. 30+ MCP tools.
</p>
<div class="animate-fade-up animate-delay-5 mb-16 flex flex-wrap items-center justify-center gap-4">
<a href="/getting-started" class="btn-primary">Get Started</a>
<a href="https://github.com/astix-io/astix" class="btn-secondary">View on GitHub</a>
</div>
<div class="animate-fade-up animate-delay-6 inline-flex cursor-pointer items-center gap-3 rounded-xl px-6 py-3.5 font-mono text-sm transition-colors" style="background: var(--cmd-bg); border: 1px solid var(--cmd-border); color: var(--text-secondary)" onclick="navigator.clipboard.writeText('npx @astix/mcp-server init')">
<span style="color: var(--accent-blue)">$</span>
<span style="color: var(--text-primary)">npx @astix/mcp-server init</span>
<span style="color: var(--text-muted)" class="text-xs">click to copy</span>
</div>
</div>
</section>

<section class="snap-section px-6" style="position: relative; z-index: 1; background: var(--bg-deep);">
<div class="mx-auto max-w-5xl w-full">
<div class="mb-12 text-center">
<h2 class="mb-3 font-sans text-3xl font-bold" style="color: var(--text-primary)">You're not alone.</h2>
<p style="color: var(--text-secondary)">Developers everywhere are hitting the same wall.</p>
</div>
<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
<div class="rounded-xl p-6" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<p class="mb-4 text-sm italic leading-relaxed" style="color: var(--text-secondary)">"It's like coding with a genius who lacks even short-term memory. Everything gets forgotten after 2-3 iterations."</p>
<footer class="text-xs" style="color: var(--text-muted)">
r/cursor &nbsp;·&nbsp; 133 upvotes &nbsp;·&nbsp;
<a href="https://www.reddit.com/r/cursor/comments/1kam4i7/" target="_blank" rel="noopener" style="color: var(--accent-blue)">Link</a>
</footer>
</div>
<div class="rounded-xl p-6" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<p class="mb-4 text-sm italic leading-relaxed" style="color: var(--text-secondary)">"One stupid animation fix cost me $20 because Claude needed to re-learn the entire codebase."</p>
<footer class="text-xs" style="color: var(--text-muted)">
r/ClaudeAI &nbsp;·&nbsp; 106 upvotes &nbsp;·&nbsp;
<a href="https://www.reddit.com/r/ClaudeAI/comments/1jpddbf/" target="_blank" rel="noopener" style="color: var(--accent-blue)">Link</a>
</footer>
</div>
<div class="rounded-xl p-6" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<p class="mb-4 text-sm italic leading-relaxed" style="color: var(--text-secondary)">"Claude Code has no idea what your code is supposed to do. It can only see what it does right now."</p>
<footer class="text-xs" style="color: var(--text-muted)">
r/ClaudeCode &nbsp;·&nbsp; 27 upvotes &nbsp;·&nbsp;
<a href="https://www.reddit.com/r/ClaudeCode/comments/1qobg1g/" target="_blank" rel="noopener" style="color: var(--accent-blue)">Link</a>
</footer>
</div>
<div class="rounded-xl p-6" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<p class="mb-4 text-sm italic leading-relaxed" style="color: var(--text-secondary)">"AI created 1.7× as many bugs as humans. Code generation tools promise speed but get tripped up by the errors they introduce."</p>
<footer class="text-xs" style="color: var(--text-muted)">
Stack Overflow Blog &nbsp;·&nbsp;
<a href="https://stackoverflow.blog/2026/01/28/are-bugs-and-incidents-inevitable-with-ai-coding-agents/" target="_blank" rel="noopener" style="color: var(--accent-blue)">Link</a>
</footer>
</div>
<div class="rounded-xl p-6" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<p class="mb-4 text-sm italic leading-relaxed" style="color: var(--text-secondary)">"No structure, no consistency, and good luck figuring out what that one function was even doing."</p>
<footer class="text-xs" style="color: var(--text-muted)">
r/cursor &nbsp;·&nbsp; 227 upvotes &nbsp;·&nbsp;
<a href="https://www.reddit.com/r/cursor/comments/1ktxqa0/" target="_blank" rel="noopener" style="color: var(--accent-blue)">Link</a>
</footer>
</div>
<div class="rounded-xl p-6" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<p class="mb-4 text-sm italic leading-relaxed" style="color: var(--text-secondary)">"If only there was some sort of regular language that prescribed exactly how to describe logic in a way a computer would always interpret correctly, some sort of…language…for programming."</p>
<footer class="text-xs" style="color: var(--text-muted)">
r/ExperiencedDevs &nbsp;·&nbsp; 674 upvotes &nbsp;·&nbsp;
<a href="https://www.reddit.com/r/ExperiencedDevs/comments/1lz4dmj/" target="_blank" rel="noopener" style="color: var(--accent-blue)">Link</a>
</footer>
</div>
</div>
</div>
</section>

<section class="snap-section px-6" style="background: var(--bg-deep); position: relative; z-index: 1;">
<div class="mx-auto max-w-4xl">
<div class="mb-14 text-center">
<h2 class="mb-3 font-sans text-3xl font-bold" style="color: var(--text-primary)">How astix works</h2>
<p style="color: var(--text-secondary)">Five stages. One coherent pipeline.</p>
</div>
<div class="pipeline">
<div class="pipeline-step">
<div class="pipeline-dot">1</div>
<div class="pipeline-label">Index</div>
<div class="pipeline-desc">Tree-sitter parses your code into an AST. Symbols, calls, imports stored in PostgreSQL.</div>
</div>
<div class="pipeline-step">
<div class="pipeline-dot">2</div>
<div class="pipeline-label">Search</div>
<div class="pipeline-desc">Structural search by name, semantic search by intent. Results in milliseconds.</div>
</div>
<div class="pipeline-step">
<div class="pipeline-dot">3</div>
<div class="pipeline-label">Analyze</div>
<div class="pipeline-desc">Impact analysis, data lineage, execution paths. Know the blast radius first.</div>
</div>
<div class="pipeline-step">
<div class="pipeline-dot">4</div>
<div class="pipeline-label">Change</div>
<div class="pipeline-desc">Rename across the call graph, patch with conflict detection, rollback safety.</div>
</div>
<div class="pipeline-step">
<div class="pipeline-dot">5</div>
<div class="pipeline-label">Verify</div>
<div class="pipeline-desc">Code health checks, dead code detection, coverage gap analysis.</div>
</div>
</div>
</div>
</section>

<section class="snap-section px-6" style="position: relative; z-index: 1;">
<div class="mx-auto max-w-5xl w-full">
<div class="mb-14 text-center">
<h2 class="mb-3 font-sans text-3xl font-bold" style="color: var(--text-primary)">The difference</h2>
<p style="color: var(--text-secondary)">Same AI agent. Completely different outcomes.</p>
</div>
<div class="grid gap-6 md:grid-cols-2">
<div class="rounded-xl p-8" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<div class="mb-6 flex items-center gap-3">
<div class="flex h-8 w-8 items-center justify-center rounded-full" style="background: rgba(239,68,68,0.1)">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
</div>
<h3 class="font-sans text-base font-semibold" style="color: var(--text-primary)">Without astix</h3>
</div>
<ul class="space-y-4">
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
Agent renames function, misses 14 callers across 3 files
</li>
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
Every session starts from zero — no codebase memory
</li>
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
Grep returns wrong file because it matched a comment
</li>
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
"It works" means trusting the agent blindly
</li>
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
Refactoring breaks imports silently
</li>
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
Security vulnerabilities hidden in data flow across modules
</li>
</ul>
</div>
<div class="rounded-xl p-8" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<div class="mb-6 flex items-center gap-3">
<div class="flex h-8 w-8 items-center justify-center rounded-full" style="background: rgba(34,197,94,0.1)">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
</div>
<h3 class="font-sans text-base font-semibold" style="color: var(--text-primary)">With astix</h3>
</div>
<ul class="space-y-4">
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
Call graph traced — all 14 callers renamed atomically
</li>
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
Persistent AST index — instant structural context
</li>
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
Semantic + structural search in 12ms, exact results
</li>
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
Impact analysis: 14 affected symbols, risk level HIGH
</li>
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
Import graph updated, conflict detection built-in
</li>
<li class="flex items-start gap-3 text-sm leading-relaxed" style="color: var(--text-secondary)">
<svg class="mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
Taint tracking: source→sink vulnerability detection, zero rules to write
</li>
</ul>
</div>
</div>
</div>
</section>

<section class="snap-section px-6" style="background: var(--bg-deep); position: relative; z-index: 1;">
<div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">

<div class="rounded-xl overflow-hidden" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<div class="p-6 pb-4">
<div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg" style="background: var(--badge-bg)">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
</div>
<h3 class="mb-1 font-sans text-lg font-semibold" style="color: var(--text-primary)">Understand</h3>
<p class="text-xs" style="color: var(--text-secondary)">Call graphs, data lineage, execution paths, impact analysis</p>
</div>
<div class="px-4 pb-4">
<div class="rounded-lg p-3 font-mono text-xs leading-relaxed" style="background: var(--bg-deep); border: 1px solid var(--border-subtle);">
<div><span style="color: var(--accent-green)">$</span> <span style="color: var(--text-primary)">search_structural</span> <span style="color: var(--accent-blue)">"handlePayment"</span></div>
<div style="color: var(--text-muted)">→ 3 results in 12ms</div>
<div style="color: var(--text-muted)">&nbsp;&nbsp;src/payments/handler.ts:42</div>
<div style="color: var(--text-muted)">&nbsp;&nbsp;src/checkout/service.ts:18</div>
<div style="color: var(--text-muted)">&nbsp;&nbsp;src/api/routes.ts:95</div>
</div>
</div>
</div>

<div class="rounded-xl overflow-hidden" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<div class="p-6 pb-4">
<div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg" style="background: rgba(139,92,246,0.1)">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
</div>
<h3 class="mb-1 font-sans text-lg font-semibold" style="color: var(--text-primary)">Change safely</h3>
<p class="text-xs" style="color: var(--text-secondary)">Rename, refactor, patch with rollback and conflict detection</p>
</div>
<div class="px-4 pb-4">
<div class="rounded-lg p-3 font-mono text-xs leading-relaxed" style="background: var(--bg-deep); border: 1px solid var(--border-subtle);">
<div><span style="color: var(--accent-green)">$</span> <span style="color: var(--text-primary)">rename_symbol</span> <span style="color: var(--accent-blue)">"handlePayment"</span> → <span style="color: var(--accent-green)">"processPayment"</span></div>
<div style="color: var(--accent-green)">✓ 14 callers updated across 6 files</div>
<div style="color: var(--accent-green)">✓ 3 import statements rewritten</div>
<div style="color: var(--accent-green)">✓ 0 conflicts detected</div>
</div>
</div>
</div>

<div class="rounded-xl overflow-hidden" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<div class="p-6 pb-4">
<div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg" style="background: rgba(34,197,94,0.1)">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
</div>
<h3 class="mb-1 font-sans text-lg font-semibold" style="color: var(--text-primary)">Stay private</h3>
<p class="text-xs" style="color: var(--text-secondary)">Self-hosted, BYOK embeddings/LLM, zero code egress</p>
</div>
<div class="px-4 pb-4">
<div class="rounded-lg p-3 font-mono text-xs leading-relaxed" style="background: var(--bg-deep); border: 1px solid var(--border-subtle);">
<div><span style="color: var(--accent-green)">$</span> <span style="color: var(--text-primary)">astix serve</span></div>
<div style="color: var(--accent-green)">✓ MCP server listening on localhost:3001</div>
<div style="color: var(--text-muted)">&nbsp;&nbsp;PostgreSQL: localhost:5432 (local)</div>
<div style="color: var(--text-muted)">&nbsp;&nbsp;Embeddings: ollama/nomic (local)</div>
<div style="color: var(--accent-green)">✓ 0 bytes sent externally</div>
</div>
</div>
</div>

</div>
</section>

<section class="snap-section px-6" style="position: relative; z-index: 1;">
<div class="mx-auto max-w-5xl w-full">
<div class="text-center mb-16">
<h2 class="mb-4 font-sans text-3xl font-bold" style="color: var(--text-primary)">Built for AI-assisted development</h2>
<p style="color: var(--text-secondary)">Every tool your agent needs, none of the guesswork.</p>
</div>
<div class="mb-16 grid items-center gap-8 md:grid-cols-2">
<div>
<h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">30+ MCP Tools</h3>
<p class="mb-4 text-sm leading-relaxed" style="color: var(--text-secondary)">Search, analyze, refactor, and write code through a standardized protocol. Works with any MCP-compatible client.</p>
</div>
<div class="rounded-lg p-4 font-mono text-sm" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<span style="color: var(--accent-blue)">search_structural</span>(<span style="color: var(--accent-green)">"handlePayment"</span>)<br>
<span style="color: var(--text-muted)">→ 3 results in 12ms</span>
</div>
</div>
<div class="mb-16 grid items-center gap-8 md:grid-cols-2">
<div class="order-2 md:order-1 rounded-lg p-4 font-mono text-sm" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
<span style="color: var(--accent-blue)">impact_analysis</span>(<span style="color: var(--accent-green)">"UserService"</span>)<br>
<span style="color: var(--text-muted)">→ 14 affected, risk: HIGH</span><br>
<span style="color: var(--text-muted)">&nbsp;&nbsp;depth: 3, inherited_by: 2</span>
</div>
<div class="order-1 md:order-2">
<h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">Impact Analysis</h3>
<p class="mb-4 text-sm leading-relaxed" style="color: var(--text-secondary)">Know the blast radius before you change anything. Transitive callers, inherited classes, risk assessment — all in one call.</p>
</div>
</div>
<div class="grid items-center gap-8 md:grid-cols-2">
<div>
<h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">36 Languages</h3>
<p class="mb-4 text-sm leading-relaxed" style="color: var(--text-secondary)">10 Tier-1 languages with full call graphs, type bindings, and CFG. 23 more with symbol extraction and imports. Powered by tree-sitter.</p>
</div>
<div class="flex flex-wrap gap-2">
<span class="rounded-md px-3 py-1 text-xs font-medium" style="background: var(--badge-bg); color: var(--accent-blue); border: 1px solid var(--badge-border)" v-for="lang in ['TypeScript','Python','Rust','Go','Java','C#','C++','Ruby','Swift','Kotlin']" :key="lang">{{ lang }}</span>
<span class="rounded-md px-3 py-1 text-xs" style="color: var(--text-muted)">+26 more</span>
</div>
</div>
<div class="mb-16 grid items-center gap-8 md:grid-cols-2">
<div>
<h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">Security Analysis</h3>
<p class="mb-4 text-sm leading-relaxed" style="color: var(--text-secondary)">Taint tracking from source to sink — detect SQL injection, XSS, path traversal, SSRF, and log injection across function boundaries. No rules to write.</p>
</div>
<div class="rounded-lg p-4 font-mono text-xs leading-relaxed" style="background: var(--bg-card); border: 1px solid var(--border-subtle);">
<div><span style="color: var(--accent-blue)">code_health</span>(<span style="color: var(--accent-green)">check='taint'</span>)</div>
<div style="color: var(--text-muted)">→ 2 vulnerabilities found</div>
<div style="color: var(--text-muted)">&nbsp;</div>
<div style="color: #EF4444">⚠ SQL Injection</div>
<div style="color: var(--text-muted)">&nbsp;&nbsp;req.params.id → db.query()</div>
<div style="color: var(--text-muted)">&nbsp;&nbsp;src/api/users.ts:42 → src/db/repo.ts:18</div>
</div>
</div>
</div>
</section>

<section class="snap-section px-6" style="position: relative; z-index: 1;">
<div class="mx-auto max-w-5xl w-full">
<div class="mx-auto max-w-2xl text-center mb-12">
<h2 class="mb-4 font-sans text-3xl font-bold" style="color: var(--text-primary)">See it in action</h2>
<p style="color: var(--text-secondary)">From search to impact analysis in seconds.</p>
</div>
<TerminalDemo />
</div>
</section>

<section class="faq-section snap-section px-6" style="background: var(--bg-deep); position: relative; z-index: 1;">
<div class="mx-auto max-w-3xl">
<div class="mb-12 text-center">
<h2 class="mb-3 font-sans text-3xl font-bold" style="color: var(--text-primary)">Frequently asked questions</h2>
<p style="color: var(--text-secondary)">Everything you need to know about astix.</p>
</div>
<PricingFaq />
</div>
</section>

<section class="snap-section px-6" style="position: relative; z-index: 1;">
<div class="mx-auto max-w-5xl w-full">
<SocialProof :enabled="frontmatter.socialProof?.enabled ?? false" />
<NumbersBar />
</div>
</section>

<section class="snap-section px-6" style="background: var(--bg-deep); position: relative; z-index: 1;">
<div class="mx-auto max-w-2xl text-center">
<h2 class="mb-4 font-sans text-3xl font-bold" style="color: var(--text-primary)">Ready to understand your codebase?</h2>
<p class="mb-8" style="color: var(--text-secondary)">Get started in under 10 minutes. Free forever.</p>
<div class="flex flex-wrap items-center justify-center gap-4 mb-6">
<a href="/getting-started" class="btn-primary">Get Started</a>
<a href="/pricing" class="btn-secondary">View Pricing</a>
</div>
<p class="text-xs" style="color: var(--text-muted)">Self-hosted · Zero code egress · BYOK · Apache 2.0</p>
</div>
</section>

</div>
