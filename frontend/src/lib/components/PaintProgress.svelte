<script lang="ts">
	import type { Miniature } from '$lib/types';

	let { miniatures }: { miniatures: Miniature[] } = $props();

	const collection = $derived(miniatures.filter((m) => !m.wished && m.amount > 0));
	const ownedAmount = $derived(collection.reduce((s, m) => s + m.amount, 0));
	const paintedAmount = $derived(collection.filter((m) => m.painted).reduce((s, m) => s + m.amount, 0));
	const percentage = $derived(
		ownedAmount > 0 ? Math.round((paintedAmount / ownedAmount) * 1000) / 10 : 0
	);
</script>

<div class="mb-6 flex items-center gap-4">
	<span class="shrink-0 text-sm font-medium text-gray-600 dark:text-gray-400">Paint Progress</span>
	<div class="flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
		<div
			class="flex h-5 items-center justify-center rounded-full bg-green-500 text-xs font-semibold text-white transition-all"
			style="width: {percentage}%; min-width: {percentage > 0 ? '2.5rem' : '0'}"
		>
			{percentage}%
		</div>
	</div>
</div>
