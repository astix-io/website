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
const { frontmatter } = useData()
</script>

<ClientOnly><HeroShader /></ClientOnly>

<!-- Hero -->
<section class="relative flex min-h-screen flex-col items-center justify-center px-6 py-32" style="position: relative; z-index: 1;">
  <div class="relative z-10 mx-auto max-w-2xl text-center">
    <span class="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider" style="color: var(--accent-blue); background: var(--badge-bg); border: 1px solid var(--badge-border)">
      Open Source · Apache 2.0
    </span>
    <h1 class="mb-4 font-sans text-5xl font-bold leading-tight tracking-tight md:text-6xl" style="color: var(--text-primary)">
      Trustworthy code intelligence <span class="gradient-text">for AI agents</span>
    </h1>
    <p class="mx-auto mb-8 max-w-lg text-lg leading-relaxed" style="color: var(--text-secondary)">
      Self-hosted. 36 languages. 30+ MCP tools. Works with Claude Code, Cursor, and any MCP client.
    </p>
    <div class="mb-10 flex flex-wrap items-center justify-center gap-4">
      <a href="/getting-started" class="btn-primary">Get Started</a>
      <a href="https://github.com/astix-io/astix" class="btn-secondary">View on GitHub</a>
    </div>
    <div class="inline-flex cursor-pointer items-center gap-3 rounded-xl px-6 py-3.5 font-mono text-sm transition-colors" style="background: var(--cmd-bg); border: 1px solid var(--cmd-border); color: var(--text-secondary)" onclick="navigator.clipboard.writeText('npx @astix/mcp-server init')">
      <span style="color: var(--accent-blue)">$</span>
      <span style="color: var(--text-primary)">npx @astix/mcp-server init</span>
      <span style="color: var(--text-muted)" class="text-xs">click to copy</span>
    </div>
  </div>
</section>

<!-- Jobs-to-be-done -->
<section class="mx-auto grid max-w-5xl gap-6 px-6 py-20 md:grid-cols-3" style="position: relative; z-index: 1;">
  <div class="rounded-xl p-8" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" style="background: var(--badge-bg)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    </div>
    <h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">Understand</h3>
    <ul class="space-y-2 text-sm leading-relaxed" style="color: var(--text-secondary)">
      <li>Call graphs &amp; cross-file references</li>
      <li>Data lineage across functions</li>
      <li>Execution paths &amp; coverage gaps</li>
      <li>Impact analysis before any change</li>
    </ul>
  </div>
  <div class="rounded-xl p-8" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" style="background: rgba(139,92,246,0.1)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
    </div>
    <h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">Change safely</h3>
    <ul class="space-y-2 text-sm leading-relaxed" style="color: var(--text-secondary)">
      <li>Rename across the entire call graph</li>
      <li>Patch with conflict detection</li>
      <li>Refactor with rollback safety</li>
      <li>Write tests from coverage gaps</li>
    </ul>
  </div>
  <div class="rounded-xl p-8" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" style="background: rgba(34,197,94,0.1)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    </div>
    <h3 class="mb-3 font-sans text-xl font-semibold" style="color: var(--text-primary)">Stay private</h3>
    <ul class="space-y-2 text-sm leading-relaxed" style="color: var(--text-secondary)">
      <li>100% self-hosted, your infrastructure</li>
      <li>BYOK embeddings &amp; LLM</li>
      <li>Zero code egress — ever</li>
      <li>Air-gap ready (Enterprise)</li>
    </ul>
  </div>
</section>

<!-- Features -->
<section class="mx-auto max-w-5xl px-6 py-20" style="position: relative; z-index: 1;">
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
</section>

<!-- Code Demo -->
<section class="px-6 py-20" style="position: relative; z-index: 1;">
  <div class="mx-auto max-w-2xl text-center mb-12">
    <h2 class="mb-4 font-sans text-3xl font-bold" style="color: var(--text-primary)">See it in action</h2>
    <p style="color: var(--text-secondary)">From search to impact analysis in seconds.</p>
  </div>
  <TerminalDemo />
</section>

<!-- Social Proof -->
<SocialProof :enabled="frontmatter.socialProof?.enabled ?? false" />

<!-- Numbers -->
<NumbersBar />

<!-- Final CTA -->
<section class="px-6 py-24 text-center" style="position: relative; z-index: 1;">
  <h2 class="mb-4 font-sans text-3xl font-bold" style="color: var(--text-primary)">
    Ready to understand your codebase?
  </h2>
  <p class="mb-8" style="color: var(--text-secondary)">
    Get started in under 10 minutes. Free forever.
  </p>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <a href="/getting-started" class="btn-primary">Get Started</a>
    <a href="/pricing" class="btn-secondary">View Pricing</a>
  </div>
</section>
