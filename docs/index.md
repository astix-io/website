---
layout: page
title: astix — Semantic code intelligence for AI coding assistants
description: Self-hosted semantic code intelligence. 38 languages, 30+ MCP tools, 128x avg token reduction. Works with Claude Code, Cursor, and any MCP client.
socialProof:
  enabled: true
---

<script setup>
import { useData } from 'vitepress'
import HeroShader from './.vitepress/theme/components/HeroShader.vue'
import SocialProof from './.vitepress/theme/components/SocialProof.vue'
import NumbersBar from './.vitepress/theme/components/NumbersBar.vue'
import PricingFaq from './.vitepress/theme/components/PricingFaq.vue'
import WorkflowStepper from './.vitepress/theme/components/WorkflowStepper.vue'
import FeatureShowcase from './.vitepress/theme/components/FeatureShowcase.vue'
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
Open Source · Self-Hosted · Apache 2.0
</span>
<h1 class="animate-fade-up animate-delay-2 mb-6 font-sans text-5xl font-bold leading-tight tracking-tight md:text-7xl" style="color: var(--text-primary)">
Semantic code intelligence for <span class="gradient-text">AI coding assistants</span>
</h1>
<p class="animate-fade-up animate-delay-3 mx-auto mb-12 max-w-lg text-lg leading-relaxed font-mono" style="color: var(--text-secondary)">
128x fewer tokens &nbsp;·&nbsp; 38 languages &nbsp;·&nbsp; AST + embeddings + call graph
</p>
<div class="animate-fade-up animate-delay-4 mb-16 flex flex-wrap items-center justify-center gap-4">
<a href="/getting-started" class="btn-primary">Get started in 5 minutes</a>
<a href="https://github.com/astix-io/astix" class="btn-secondary">View on GitHub</a>
</div>
<button class="animate-fade-up animate-delay-5 inline-flex cursor-pointer items-center gap-3 rounded-xl px-6 py-3.5 font-mono text-sm transition-colors" style="background: var(--cmd-bg); border: 1px solid var(--cmd-border); color: var(--text-secondary); font-family: inherit" onclick="navigator.clipboard.writeText('npx @astix/mcp-server init')">
<span style="color: var(--accent-blue)">$</span>
<span style="color: var(--text-primary)">npx @astix/mcp-server init</span>
<span style="color: var(--text-muted)" class="text-xs">click to copy</span>
</button>
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
<div class="mx-auto max-w-5xl">
<div class="mb-14 text-center">
<h2 class="mb-3 font-sans text-3xl font-bold" style="color: var(--text-primary)">How astix works</h2>
<p style="color: var(--text-secondary)">From raw code to actionable intelligence in five steps.</p>
</div>
<WorkflowStepper />
</div>
</section>

<section class="snap-section px-6" style="position: relative; z-index: 1;">
<div class="mx-auto max-w-5xl w-full">
<div class="mb-14 text-center">
<h2 class="mb-3 font-sans text-3xl font-bold" style="color: var(--text-primary)">Your AI agent doesn't understand <span class="gradient-text">your codebase</span></h2>
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

<section class="snap-section px-6" style="position: relative; z-index: 1;">
<div class="mx-auto max-w-5xl">
<div class="mb-14 text-center">
<h2 class="mb-3 font-sans text-3xl font-bold" style="color: var(--text-primary)">Two product lines. One platform.</h2>
<p style="color: var(--text-secondary)">Intelligence to understand and change code. Security to keep it safe.</p>
</div>
<FeatureShowcase />
</div>
</section>

<section class="snap-section px-6" style="position: relative; z-index: 1;">
<div class="mx-auto max-w-5xl w-full">
<div class="mx-auto max-w-2xl text-center mb-12">
<h2 class="mb-4 font-sans text-3xl font-bold" style="color: var(--text-primary)">See it in action</h2>
<p style="color: var(--text-secondary)">Watch astix power a real coding session in Claude Code.</p>
</div>
<!-- TODO: Replace YOUTUBE_VIDEO_ID with actual video ID before Apr 24 -->
<div style="position: relative; width: 100%; padding-bottom: 56.25%; border-radius: 14px; overflow: hidden; border: 1px solid var(--border-subtle); background: var(--bg-card);">
<div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
<svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
<circle cx="12" cy="12" r="11" stroke="var(--text-muted)" stroke-width="1" opacity="0.4"/>
<path d="M10 8l6 4-6 4V8z" fill="var(--text-muted)" opacity="0.6"/>
</svg>
<span style="color: var(--text-muted); font-size: 14px;">Demo video coming soon</span>
</div>
</div>
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
