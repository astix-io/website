<template>
  <div
    ref="container"
    class="rounded-xl border overflow-hidden font-mono text-sm"
    style="background: var(--bg-card); border-color: var(--border-muted);"
  >
    <!-- Window chrome -->
    <div
      class="flex items-center gap-2 px-4 py-3 border-b"
      style="border-color: var(--border-subtle); background: var(--bg-deep);"
    >
      <span class="h-3 w-3 rounded-full bg-red-500/80"></span>
      <span class="h-3 w-3 rounded-full bg-yellow-400/80"></span>
      <span class="h-3 w-3 rounded-full bg-green-500/80"></span>
      <span class="ml-auto text-xs" style="color: var(--text-muted);">astix — terminal</span>
    </div>

    <!-- Terminal body -->
    <div class="p-4 space-y-1 min-h-48" style="color: var(--text-primary);">
      <div
        v-for="(line, idx) in displayLines"
        :key="idx"
        :class="lineClass(line.type)"
      >{{ line.text }}<span
          v-if="idx === displayLines.length - 1 && showCursor"
          class="cursor-blink"
        >▋</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

type LineType = 'prompt' | 'result-header' | 'result-line' | 'blank';

interface Line {
	text: string;
	type: LineType;
}

interface Command {
	input: string;
	output: Line[];
}

const COMMANDS: Command[] = [
	{
		input: 'astix search_structural "handlePayment"',
		output: [
			{ text: '→ 3 results in 12ms', type: 'result-header' },
			{ text: '  src/payments/handler.ts:42  handlePayment(req, res)', type: 'result-line' },
			{ text: '  src/payments/retry.ts:18    handlePayment(event)', type: 'result-line' },
			{ text: '  test/payments.spec.ts:91    handlePayment(mockReq, mockRes)', type: 'result-line' },
		],
	},
	{
		input: 'astix impact_analysis "handlePayment" --depth 3',
		output: [
			{ text: '→ 14 affected symbols, risk: HIGH', type: 'result-header' },
			{ text: '  handlePayment', type: 'result-line' },
			{ text: '  ├─ processStripeWebhook  (payments/stripe.ts:77)', type: 'result-line' },
			{ text: '  ├─ scheduleRetry         (payments/retry.ts:33)', type: 'result-line' },
			{ text: '  └─ recordAuditLog        (audit/logger.ts:14)', type: 'result-line' },
		],
	},
	{
		input: 'astix data_lineage "paymentAmount" --cross-function',
		output: [
			{ text: '→ Traced through 4 functions', type: 'result-header' },
			{ text: '  parseWebhookBody → validateAmount → handlePayment → recordAuditLog', type: 'result-line' },
			{ text: '  write  payments/stripe.ts:12   paymentAmount = body.amount', type: 'result-line' },
			{ text: '  read   payments/handler.ts:44  if (paymentAmount > limit)', type: 'result-line' },
		],
	},
];

const CHAR_DELAY = 35;
const LINE_DELAY = 60;
const PAUSE_BETWEEN = 2000;
const PAUSE_LOOP = 3000;

const container = ref<HTMLElement | null>(null);
const displayLines = ref<Line[]>([{ text: '$ ', type: 'prompt' }]);
const showCursor = ref(true);
const isVisible = ref(false);

let timeoutId: ReturnType<typeof setTimeout> | null = null;
let observer: IntersectionObserver | null = null;
let stopped = false;

function lineClass(type: LineType): string {
	switch (type) {
		case 'prompt':
			return 'whitespace-pre';
		case 'result-header':
			return 'whitespace-pre' + ' ' + 'pl-2' + ' font-semibold';
		case 'result-line':
			return 'whitespace-pre pl-2';
		default:
			return 'whitespace-pre';
	}
}

function schedule(fn: () => void, delay: number) {
	if (stopped) return;
	timeoutId = setTimeout(() => {
		if (!stopped) fn();
	}, delay);
}

function runSequence() {
	let cmdIdx = 0;

	function nextCommand() {
		if (stopped) return;

		const cmd = COMMANDS[cmdIdx % COMMANDS.length];

		// Reset to a single prompt line
		displayLines.value = [{ text: '$ ', type: 'prompt' }];
		const promptIdx = 0;

		// Type the command character by character
		let charIdx = 0;
		function typeChar() {
			if (stopped) return;
			if (charIdx < cmd.input.length) {
				// IMPORTANT: mutate via index for Vue reactivity
				displayLines.value[promptIdx] = {
					text: '$ ' + cmd.input.slice(0, charIdx + 1),
					type: 'prompt',
				};
				charIdx++;
				schedule(typeChar, CHAR_DELAY);
			} else {
				// Done typing — show output lines one by one
				schedule(() => showOutputLines(0), LINE_DELAY);
			}
		}

		function showOutputLines(lineIdx: number) {
			if (stopped) return;
			if (lineIdx < cmd.output.length) {
				displayLines.value.push({ ...cmd.output[lineIdx] });
				schedule(() => showOutputLines(lineIdx + 1), LINE_DELAY);
			} else {
				// Pause then move to next command
				cmdIdx++;
				schedule(nextCommand, PAUSE_BETWEEN);
			}
		}

		if (!isVisible.value) {
			// Not visible — check again soon
			schedule(nextCommand, 500);
			return;
		}

		schedule(typeChar, CHAR_DELAY);
	}

	// Initial pause before first command
	schedule(nextCommand, PAUSE_LOOP);
}

// Blinking cursor — independent of animation loop
let cursorInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
	cursorInterval = setInterval(() => {
		showCursor.value = !showCursor.value;
	}, 530);

	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				isVisible.value = entry.isIntersecting;
				if (entry.isIntersecting) {
					// Start sequence on first intersection
					observer?.disconnect();
					observer = null;
					runSequence();
				}
			}
		},
		{ threshold: 0.3 },
	);

	if (container.value) {
		observer.observe(container.value);
	}
});

onUnmounted(() => {
	stopped = true;
	isVisible.value = false;
	if (timeoutId !== null) clearTimeout(timeoutId);
	if (cursorInterval !== null) clearInterval(cursorInterval);
	observer?.disconnect();
	observer = null;
});
</script>

<style scoped>
.cursor-blink {
  display: inline-block;
  opacity: 1;
  animation: none; /* cursor blinks via JS toggle on showCursor */
}

.font-semibold {
  font-weight: 600;
}

/* Result header: accent blue */
.whitespace-pre.pl-2.font-semibold {
  color: var(--accent-blue);
}

/* Result lines: secondary text */
.whitespace-pre.pl-2:not(.font-semibold) {
  color: var(--text-secondary);
}
</style>
