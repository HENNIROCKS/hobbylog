<script lang="ts">
	import type { Miniature } from '$lib/types';
	import MiniatureCard from './MiniatureCard.svelte';
	import { t } from '$lib/i18n';

	let {
		miniatures,
		searchQuery = '',
		showPainted = false
	}: {
		miniatures: Miniature[];
		searchQuery?: string;
		showPainted?: boolean;
	} = $props();
</script>

{#if miniatures.length === 0}
	<p class="py-12 text-center text-gray-400 dark:text-gray-500">{t.noMiniaturesFound}</p>
{:else}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-6">
		{#each miniatures as miniature (miniature.name_german || miniature.name)}
			<MiniatureCard {miniature} {searchQuery} {showPainted} />
		{/each}
	</div>
{/if}
