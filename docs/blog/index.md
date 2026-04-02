---
layout: page
title: Blog — astix
description: Tutorials, benchmarks, and insights on code intelligence for AI agents.
---

<script setup>
import { data as posts } from '../.vitepress/plugins/blog.data'
import BlogIndex from '../.vitepress/theme/components/BlogIndex.vue'
</script>

<BlogIndex :posts="posts" />
