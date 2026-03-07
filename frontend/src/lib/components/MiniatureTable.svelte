<script lang="ts">
	import type { Miniature } from '$lib/types';
	import ImageModal from './ImageModal.svelte';
	import { t } from '$lib/i18n';

	let {
		miniatures,
		searchQuery = ''
	}: {
		miniatures: Miniature[];
		searchQuery?: string;
	} = $props();

	let modalOpen = $state(false);
	let activeMiniature = $state<Miniature | null>(null);

	function openModal(m: Miniature) {
		activeMiniature = m;
		modalOpen = true;
	}

	$effect(() => {
		if (!modalOpen) activeMiniature = null;
	});

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
</script>

{#if miniatures.length === 0}
	<p class="py-12 text-center text-gray-400 dark:text-gray-500">{t.noMiniaturesFound}</p>
{:else}
	<div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
		<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-700">
				<tr>
					<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
					<th class="hidden px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 sm:table-cell">{t.originalName}</th>
					<th class="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">{t.amount}</th>
					<th class="hidden px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 sm:table-cell">{t.paintedOn}</th>
				<th class="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">{t.images}</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-800">
				{#each miniatures as miniature (miniature.name_german || miniature.name)}
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
						<td class="px-4 py-2 font-medium text-gray-900 dark:text-white">
							{@html highlight(miniature.name, searchQuery)}
						</td>
						<td class="hidden px-4 py-2 text-gray-500 dark:text-gray-400 sm:table-cell">
							{@html highlight(miniature.name_german, searchQuery)}
						</td>
						<td class="px-4 py-2 text-right text-gray-700 dark:text-gray-300">{miniature.amount}</td>
						<td class="hidden px-4 py-2 text-gray-500 dark:text-gray-400 sm:table-cell">
							{miniature.painted_on || '—'}
						</td>
						<td class="px-4 py-2 text-center">
							{#if miniature.images.length > 0}
								<button
									type="button"
									class="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
									onclick={() => openModal(miniature)}
								>
									{t.images} ({miniature.images.length})
								</button>
							{:else}
								<span class="text-gray-300 dark:text-gray-600">—</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if activeMiniature}
	<ImageModal
		images={activeMiniature.images}
		name={activeMiniature.name}
		originalName={activeMiniature.name_german}
		bind:open={modalOpen}
	/>
{/if}
