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
const { frontmatter } = useData()
</script>

<ClientOnly><HeroShader /></ClientOnly>

<!-- Announcement Banner -->
<div class="flex items-center justify-center gap-2 py-2 text-xs font-medium" style="background: var(--badge-bg); border-bottom: 1px solid var(--badge-border); color: var(--accent-blue); position: relative; z-index: 1;">
  Open Source &nbsp;·&nbsp; Apache 2.0 &nbsp;·&nbsp; Free forever
</div>

<!-- Hero — transparent, shader visible behind -->
<section class="relative flex flex-col items-center justify-center px-6" style="min-height: 100vh; padding-top: 160px; padding-bottom: 120px; position: relative; z-index: 1;">
  <!-- Vignette for text readability -->
  <div class="hero-vignette" />

  <div class="relative z-10 mx-auto max-w-2xl text-center">
    <!-- Label -->
    <span class="animate-fade-up animate-delay-1 mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider" style="color: var(--accent-blue); background: var(--badge-bg); border: 1px solid var(--badge-border)">
      Code Intelligence for AI Agents
    </span>

    <!-- H1 — bigger -->
    <h1 class="animate-fade-up animate-delay-2 mb-10 font-sans text-5xl font-bold leading-tight tracking-tight md:text-7xl" style="color: var(--text-primary)">
      Your AI agent doesn't understand <span class="gradient-text">your codebase</span>
    </h1>

    <!-- Typewriter citation -->
    <div class="animate-fade-up animate-delay-3 mb-10">
      <ClientOnly>
        <TypewriterQuote
          quote="It doesn't understand your code's structure at all. It uses text-based grep by default — returning the wrong file because it matched a comment instead of the actual definition."
          source="r/ClaudeCode · 66 upvotes · Feb 2026"
          source-url="https://www.reddit.com/r/ClaudeCode/comments/1rh5pcm/"
          :delay="1200"
        />
      </ClientOnly>
    </div>

    <!-- Solution pitch -->
    <p class="animate-fade-up animate-delay-4 mx-auto mb-10 max-w-lg text-lg leading-relaxed" style="color: var(--text-secondary)">
      astix gives your agent an AST-level understanding of your entire codebase. Self-hosted. 36 languages. 30+ MCP tools.
    </p>

    <!-- CTAs -->
    <div class="animate-fade-up animate-delay-5 mb-12 flex flex-wrap items-center justify-center gap-4">
      <a href="/getting-started" class="btn-primary">Get Started</a>
      <a href="https://github.com/astix-io/astix" class="btn-secondary">View on GitHub</a>
    </div>

    <!-- Install command -->
    <div class="animate-fade-up animate-delay-6 inline-flex cursor-pointer items-center gap-3 rounded-xl px-6 py-3.5 font-mono text-sm transition-colors" style="background: var(--cmd-bg); border: 1px solid var(--cmd-border); color: var(--text-secondary)" onclick="navigator.clipboard.writeText('npx @astix/mcp-server init')">
      <span style="color: var(--accent-blue)">$</span>
      <span style="color: var(--text-primary)">npx @astix/mcp-server init</span>
      <span style="color: var(--text-muted)" class="text-xs">click to copy</span>
    </div>
  </div>
</section>

<!-- Community Pain Validation -->
<section class="px-6 py-24" style="position: relative; z-index: 1; background: var(--bg-deep);">
  <div class="mx-auto max-w-5xl">
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
      <div class="rounded-xl p-6 md:col-span-2 lg:col-span-1" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
        <p class="mb-4 text-sm italic leading-relaxed" style="color: var(--text-secondary)">"No structure, no consistency, and good luck figuring out what that one function was even doing."</p>
        <footer class="text-xs" style="color: var(--text-muted)">
          r/cursor &nbsp;·&nbsp; 227 upvotes &nbsp;·&nbsp;
          <a href="https://www.reddit.com/r/cursor/comments/1ktxqa0/" target="_blank" rel="noopener" style="color: var(--accent-blue)">Link</a>
        </footer>
      </div>
    </div>
  </div>
</section>

<!-- Pipeline Visualization -->
<section class="px-6 py-24" style="position: relative; z-index: 1; background: var(--bg-deep);">
  <div class="mx-auto max-w-5xl">
    <div class="mb-14 text-center">
      <h2 class="mb-3 font-sans text-3xl font-bold" style="color: var(--text-primary)">How astix works</h2>
      <p style="color: var(--text-secondary)">Five stages. One coherent pipeline.</p>
    </div>
    <div class="flex flex-col items-stretch gap-0 md:flex-row md:items-start">
      <!-- Index -->
      <div class="flex flex-1 flex-col items-center text-center p-6 rounded-xl" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" style="background: var(--badge-bg)">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
        </div>
        <h3 class="mb-2 font-sans text-sm font-semibold" style="color: var(--text-primary)">Index</h3>
        <p class="text-xs leading-relaxed" style="color: var(--text-secondary)">Tree-sitter parses your code into an AST. Symbols, calls, imports stored in PostgreSQL.</p>
      </div>
      <!-- Arrow -->
      <div class="flex items-center justify-center py-3 px-2 md:py-0 md:self-center" style="color: var(--text-muted)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden md:block"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="md:hidden"><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></svg>
      </div>
      <!-- Search -->
      <div class="flex flex-1 flex-col items-center text-center p-6 rounded-xl" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" style="background: var(--badge-bg)">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <h3 class="mb-2 font-sans text-sm font-semibold" style="color: var(--text-primary)">Search</h3>
        <p class="text-xs leading-relaxed" style="color: var(--text-secondary)">Structural search by name, semantic search by intent. Results in milliseconds.</p>
      </div>
      <!-- Arrow -->
      <div class="flex items-center justify-center py-3 px-2 md:py-0 md:self-center" style="color: var(--text-muted)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden md:block"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="md:hidden"><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></svg>
      </div>
      <!-- Analyze -->
      <div class="flex flex-1 flex-col items-center text-center p-6 rounded-xl" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" style="background: var(--badge-bg)">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>
        </div>
        <h3 class="mb-2 font-sans text-sm font-semibold" style="color: var(--text-primary)">Analyze</h3>
        <p class="text-xs leading-relaxed" style="color: var(--text-secondary)">Impact analysis, data lineage, execution paths. Know the blast radius before changing anything.</p>
      </div>
      <!-- Arrow -->
      <div class="flex items-center justify-center py-3 px-2 md:py-0 md:self-center" style="color: var(--text-muted)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden md:block"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="md:hidden"><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></svg>
      </div>
      <!-- Change -->
      <div class="flex flex-1 flex-col items-center text-center p-6 rounded-xl" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" style="background: var(--badge-bg)">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </div>
        <h3 class="mb-2 font-sans text-sm font-semibold" style="color: var(--text-primary)">Change</h3>
        <p class="text-xs leading-relaxed" style="color: var(--text-secondary)">Rename across the call graph, patch with conflict detection, rollback safety.</p>
      </div>
      <!-- Arrow -->
      <div class="flex items-center justify-center py-3 px-2 md:py-0 md:self-center" style="color: var(--text-muted)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden md:block"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="md:hidden"><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></svg>
      </div>
      <!-- Verify -->
      <div class="flex flex-1 flex-col items-center text-center p-6 rounded-xl" style="background: var(--bg-card); border: 1px solid var(--border-subtle)">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" style="background: var(--badge-bg)">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h3 class="mb-2 font-sans text-sm font-semibold" style="color: var(--text-primary)">Verify</h3>
        <p class="text-xs leading-relaxed" style="color: var(--text-secondary)">Code health checks, dead code detection, coverage gap analysis.</p>
      </div>
    </div>
  </div>
</section>

<!-- Before / After Comparison -->
<section class="px-6 py-24" style="position: relative; z-index: 1; background: var(--bg-deep);">
  <div class="mx-auto max-w-5xl">
    <div class="mb-14 text-center">
      <h2 class="mb-3 font-sans text-3xl font-bold" style="color: var(--text-primary)">The difference</h2>
      <p style="color: var(--text-secondary)">Same AI agent. Completely different outcomes.</p>
    </div>
    <div class="grid gap-6 md:grid-cols-2">
      <!-- Without -->
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
        </ul>
      </div>
      <!-- With -->
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
        </ul>
      </div>
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
  <div class="mb-8 flex flex-wrap items-center justify-center gap-4">
    <a href="/getting-started" class="btn-primary">Get Started</a>
    <a href="/pricing" class="btn-secondary">View Pricing</a>
  </div>
  <p class="text-xs" style="color: var(--text-muted)">
    Self-hosted &nbsp;·&nbsp; Zero code egress &nbsp;·&nbsp; BYOK &nbsp;·&nbsp; Apache 2.0
  </p>
</section>
