---
layout: page
title: "Blog — astix Code Intelligence for AI Agents"
description: "Technical articles about semantic code intelligence, AI coding assistants, token optimization, and software architecture analysis with astix."
---

<script setup>
import { data as posts } from '../.vitepress/plugins/blog.data'
import BlogIndex from '../.vitepress/theme/components/BlogIndex.vue'
</script>

<BlogIndex :posts="posts" />
