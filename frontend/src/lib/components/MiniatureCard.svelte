<script lang="ts">
	import type { Miniature } from '$lib/types';
	import ImageModal from './ImageModal.svelte';
	import { t } from '$lib/i18n';

	let {
		miniature,
		searchQuery = '',
		showPainted = false
	}: {
		miniature: Miniature;
		searchQuery?: string;
		showPainted?: boolean;
	} = $props();

	let modalOpen = $state(false);

	const thumb = $derived(miniature.images[0]?.thumb ?? null);

	function escapeHtml(text: string): string {
		return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function highlight(text: string, query: string): string {
		if (!query.trim()) return escapeHtml(text);
		const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
		return parts
			.map((part, i) =>
				i % 2 === 1
					? `<mark class="bg-yellow-200 dark:bg-yellow-700 rounded-sm not-italic">${escapeHtml(part)}</mark>`
					: escapeHtml(part)
			)
			.join('');
	}

	const highlightedName = $derived(highlight(miniature.name, searchQuery));
	const hasPills = $derived(miniature.amount >= 1 || showPainted);
</script>

<div class="flex flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
	<!-- Image -->
	<button
		type="button"
		class="relative block aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-700"
		onclick={() => (modalOpen = true)}
		aria-label={t.showImagesOf(miniature.name)}
	>
		{#if thumb}
			<img
				src={thumb}
				alt={miniature.name_german || miniature.name}
				class="h-full w-full object-cover transition-all"
				class:grayscale={!miniature.painted}
			/>
		{:else}
			<div class="flex h-full items-center justify-center text-gray-300 dark:text-gray-600">
				<svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</div>
		{/if}

		{#if hasPills}
			<div class="absolute left-2 top-2 flex flex-col gap-1">
				{#if miniature.amount >= 1}
					<span class="rounded-full bg-gray-900/70 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
						×{miniature.amount}
					</span>
				{/if}
				{#if showPainted}
					{#if miniature.painted}
						<span class="rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
							{t.painted}
						</span>
					{:else}
						<span class="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
							{t.unpainted}
						</span>
					{/if}
				{/if}
			</div>
		{/if}
	</button>

	<!-- Body -->
	<div class="p-3">
		<p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
			{@html highlightedName}
		</p>
	</div>
</div>

<ImageModal
	images={miniature.images}
	name={miniature.name}
	originalName={miniature.name_german}
	bind:open={modalOpen}
/>
