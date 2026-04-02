---
layout: page
title: Pricing — astix
description: Free community edition with full intelligence. Team and Enterprise tiers for collaboration and governance.
---

<script setup>
import PricingCards from './.vitepress/theme/components/PricingCards.vue'
import PricingTable from './.vitepress/theme/components/PricingTable.vue'
import PricingFaq from './.vitepress/theme/components/PricingFaq.vue'
</script>

<section class="mx-auto max-w-5xl px-6 py-20 text-center">
  <h1 class="mb-4 font-sans text-4xl font-bold" style="color: var(--text-primary)">
    Choose your plan
  </h1>
  <p class="mb-12" style="color: var(--text-secondary)">
    Full intelligence on every tier. Pay only for collaboration features.
  </p>
  <PricingCards />
</section>

<section class="mx-auto max-w-5xl px-6 py-16">
  <h2 class="mb-8 text-center font-sans text-2xl font-bold" style="color: var(--text-primary)">
    Compare all features
  </h2>
  <PricingTable />
</section>

<section class="mx-auto max-w-3xl px-6 py-16">
  <h2 class="mb-8 text-center font-sans text-2xl font-bold" style="color: var(--text-primary)">
    Frequently asked questions
  </h2>
  <PricingFaq />
</section>
