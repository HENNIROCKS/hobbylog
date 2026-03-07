<script lang="ts">
	import type { Miniature } from '$lib/types';
	import { t } from '$lib/i18n';

	let {
		miniatures,
		searchQuery = $bindable(''),
		selectedGenre = $bindable(''),
		selectedFaction = $bindable(''),
		paintedOnly = $bindable(false),
		showPaintedFilter = true
	}: {
		miniatures: Miniature[];
		searchQuery: string;
		selectedGenre: string;
		selectedFaction: string;
		paintedOnly: boolean;
		showPaintedFilter?: boolean;
	} = $props();

	const genres = $derived.by(() => {
		const set = new Set<string>();
		for (const m of miniatures) if (m.genre) set.add(m.genre);
		return Array.from(set);
	});

	const factions = $derived.by(() => {
		const set = new Set<string>();
		for (const m of miniatures) {
			if (!selectedGenre || selectedGenre === 'fantasy') {
				for (const f of m.faction_fantasy) if (f) set.add(f);
			}
			if (!selectedGenre || selectedGenre === 'scifi') {
				for (const f of m.faction_scifi) if (f) set.add(f);
			}
		}
		return ['', ...Array.from(set).sort()];
	});
</script>

<div class="flex flex-wrap items-center gap-4">
	<input
		type="search"
		bind:value={searchQuery}
		placeholder={t.search}
		class="min-w-40 flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 sm:flex-none"
	/>

	{#if genres.length > 1}
		<label class="flex items-center gap-2 text-sm">
			<span class="font-medium text-gray-700 dark:text-gray-300">{t.genre}</span>
			<select
				bind:value={selectedGenre}
				onchange={() => (selectedFaction = '')}
				class="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
			>
				<option value="">{t.all}</option>
				<option value="fantasy">Fantasy</option>
				<option value="scifi">Sci-Fi</option>
			</select>
		</label>
	{/if}

	{#if factions.length > 2}
		<label class="flex items-center gap-2 text-sm">
			<span class="font-medium text-gray-700 dark:text-gray-300">{t.faction}</span>
			<select
				bind:value={selectedFaction}
				class="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
			>
				{#each factions as faction}
					<option value={faction}>{faction || t.all}</option>
				{/each}
			</select>
		</label>
	{/if}

	{#if showPaintedFilter}
		<label class="flex cursor-pointer items-center gap-2 text-sm">
			<input
				type="checkbox"
				bind:checked={paintedOnly}
				class="h-4 w-4 rounded border-gray-300 accent-green-500"
			/>
			<span class="font-medium text-gray-700 dark:text-gray-300">{t.paintedOnly}</span>
		</label>
	{/if}
</div>
