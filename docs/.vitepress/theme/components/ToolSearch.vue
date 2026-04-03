<script setup lang="ts">
import { ref } from 'vue';

const query = ref('');

// Expose query for parent to use
defineExpose({ query });

const emit = defineEmits<(e: 'filter', value: string) => void>();

function onInput() {
	emit('filter', query.value);
}
</script>

<template>
<div class="mb-8">
<input
v-model="query"
type="search"
placeholder="Filter tools..."
class="w-full rounded-lg px-4 py-3 font-mono text-sm"
style="background: var(--cmd-bg); border: 1px solid var(--cmd-border); color: var(--text-primary); outline: none;"
@input="onInput"
/>
</div>
</template>
