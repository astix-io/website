<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Post } from '../../plugins/blog.data';
import { formatDate } from '../utils';

const props = defineProps<{ posts: Post[] }>();

const categories = ['All', 'Tutorials', 'Insights', 'Benchmarks', 'Use Cases', 'Releases'];

const categoryKey: Record<string, string> = {
	All: 'all',
	Tutorials: 'tutorials',
	Insights: 'insights',
	Benchmarks: 'benchmarks',
	'Use Cases': 'use-cases',
	Releases: 'releases',
};

const categoryColors: Record<string, string> = {
	tutorials: 'badge-blue',
	insights: 'badge-purple',
	benchmarks: 'badge-green',
	'use-cases': 'badge-orange',
	releases: 'badge-teal',
};

const activeCategory = ref('All');

const filteredPosts = computed(() => {
	if (activeCategory.value === 'All') return props.posts;
	const key = categoryKey[activeCategory.value];
	return props.posts.filter((p) => p.category === key);
});

const featuredPost = computed(() => props.posts.find((p) => p.featured) ?? null);

const gridPosts = computed(() =>
	filteredPosts.value.filter((p) => !(activeCategory.value === 'All' && p.featured && p === featuredPost.value)),
);
</script>

<template>
  <div class="blog-index">
    <div class="blog-header">
      <h1 class="blog-title">Blog</h1>
      <p class="blog-subtitle">Tutorials, benchmarks, and insights on code intelligence for AI agents.</p>
    </div>

    <!-- Category filter -->
    <div class="category-tabs" role="tablist" aria-label="Filter posts by category">
      <button
        v-for="cat in categories"
        :key="cat"
        role="tab"
        :aria-selected="activeCategory === cat"
        :class="['tab-btn', { active: activeCategory === cat }]"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Featured post (only shown on "All" tab) -->
    <a
      v-if="activeCategory === 'All' && featuredPost"
      :href="featuredPost.url"
      class="featured-card"
    >
      <div v-if="featuredPost.image" class="featured-image">
        <img :src="featuredPost.image" :alt="featuredPost.title" loading="lazy" decoding="async" />
      </div>
      <div class="featured-meta">
        <span :class="['category-badge', categoryColors[featuredPost.category] ?? 'badge-blue']">
          {{ featuredPost.category }}
        </span>
        <span class="featured-label">Featured</span>
      </div>
      <h2 class="featured-title">{{ featuredPost.title }}</h2>
      <p class="featured-excerpt">{{ featuredPost.tldr || featuredPost.excerpt }}</p>
      <div class="post-footer">
        <div class="flex items-center gap-2">
          <div class="author-avatar">{{ featuredPost.author?.charAt(0) || 'A' }}</div>
          <a :href="'/blog/authors/' + (featuredPost.author || 'astix-team').toLowerCase().replace(/\s+/g, '-')" class="post-author author-link">{{ featuredPost.author || 'astix team' }}</a>
        </div>
        <span class="post-date">{{ formatDate(featuredPost.date) }}</span>
        <span class="reading-time">{{ featuredPost.readingTime }} min read</span>
      </div>
    </a>

    <!-- Empty state -->
    <p v-if="filteredPosts.length === 0" class="empty-state">
      No posts in this category yet.
    </p>

    <!-- Post grid -->
    <div v-else-if="gridPosts.length > 0" class="post-grid">
      <a
        v-for="post in gridPosts"
        :key="post.url"
        :href="post.url"
        class="post-card"
      >
        <div v-if="post.image" class="post-image">
          <img :src="post.image" :alt="post.title" loading="lazy" decoding="async" />
        </div>
        <div class="post-card-meta">
          <span :class="['category-badge', categoryColors[post.category] ?? 'badge-blue']">
            {{ post.category }}
          </span>
        </div>
        <h3 class="post-card-title">{{ post.title }}</h3>
        <p v-if="post.tldr" class="post-card-tldr">{{ post.tldr }}</p>
        <div class="post-footer">
          <div class="flex items-center gap-2">
            <div class="author-avatar">{{ post.author?.charAt(0) || 'A' }}</div>
            <a :href="'/blog/authors/' + (post.author || 'astix-team').toLowerCase().replace(/\s+/g, '-')" class="post-author author-link">{{ post.author || 'astix team' }}</a>
          </div>
          <span class="post-date">{{ formatDate(post.date) }}</span>
          <span class="reading-time">{{ post.readingTime }} min read</span>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.blog-index {
  max-width: 1024px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.blog-header {
  margin-bottom: 2.5rem;
}

.blog-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
  line-height: 1.2;
}

.blog-subtitle {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin: 0;
}

/* Category tabs */
.category-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.tab-btn {
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  border: 1px solid var(--border-muted);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  font-family: inherit;
}

.tab-btn:hover {
  border-color: var(--accent-blue);
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
  color: #fff;
}

/* Featured card */
.featured-card {
  display: block;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  padding: 2rem 2rem 2rem;
  margin-bottom: 2.5rem;
  text-decoration: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.featured-image {
  margin: -2rem -2rem 1.5rem -2rem;
  height: 240px;
  overflow: hidden;
  border-radius: 1rem 1rem 0 0;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-card:hover {
  border-color: var(--border-muted);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.featured-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.featured-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.featured-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem;
  line-height: 1.3;
}

.featured-excerpt {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Post grid */
.post-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 700px) {
  .post-grid {
    grid-template-columns: 1fr;
  }

  .featured-card {
    padding: 1.5rem;
  }

  .featured-image {
    margin: -1.5rem -1.5rem 1.25rem -1.5rem;
  }

  .featured-title {
    font-size: 1.375rem;
  }
}

.post-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
  overflow: hidden;
  min-height: 280px;
}

.post-image {
  margin: -1.5rem -1.5rem 1rem -1.5rem;
  height: 180px;
  overflow: hidden;
  border-radius: 0.75rem 0.75rem 0 0;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-card:hover {
  border-color: var(--border-muted);
  transform: translateY(-2px);
}

.post-card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

/* Post footer */
.post-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}

.post-date {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.reading-time {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

/* Category badges */
.category-badge {
  display: inline-block;
  padding: 0.2em 0.65em;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.02em;
}

.badge-blue {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.badge-purple {
  background: rgba(139, 92, 246, 0.12);
  color: #a78bfa;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.badge-green {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.badge-orange {
  background: rgba(249, 115, 22, 0.12);
  color: #fb923c;
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.badge-teal {
  background: rgba(20, 184, 166, 0.12);
  color: #2dd4bf;
  border: 1px solid rgba(20, 184, 166, 0.2);
}

/* Author avatar */
.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.post-author {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

/* Post card TL;DR */
.post-card-tldr {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

/* Focus visible */
.tab-btn:focus-visible,
.featured-card:focus-visible,
.post-card:focus-visible {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
}

/* Light mode badge contrast overrides */
:global([data-theme="light"]) .badge-blue { color: #1d4ed8; }
:global([data-theme="light"]) .badge-purple { color: #6d28d9; }
:global([data-theme="light"]) .badge-green { color: #15803d; }
:global([data-theme="light"]) .badge-orange { color: #c2410c; }
:global([data-theme="light"]) .badge-teal { color: #0f766e; }

/* Empty state */
.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 4rem 0;
  font-size: 1rem;
}

/* Author link */
.author-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}
.author-link:hover {
  color: var(--accent-blue);
}
</style>
