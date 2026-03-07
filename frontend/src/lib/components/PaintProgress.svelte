<script lang="ts">
	import type { Miniature } from '$lib/types';

	let { miniatures }: { miniatures: Miniature[] } = $props();

	const collection = $derived(miniatures.filter((m) => !m.wished));
	const painted = $derived(collection.filter((m) => m.painted));
	const percentage = $derived(
		collection.length > 0 ? Math.round((painted.length / collection.length) * 1000) / 10 : 0
	);
</script>

<div class="mb-6 flex items-center gap-4">
	<span class="shrink-0 text-sm font-medium text-gray-600 dark:text-gray-400">Bemalfortschritt</span>
	<div class="flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
		<div
			class="flex h-5 items-center justify-center rounded-full bg-green-500 text-xs font-semibold text-white transition-all"
			style="width: {percentage}%; min-width: {percentage > 0 ? '2.5rem' : '0'}"
		>
			{percentage}%
		</div>
	</div>
</div>
