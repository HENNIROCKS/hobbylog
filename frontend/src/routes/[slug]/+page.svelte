<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import type { Miniature } from '$lib/types';
	import PaintProgress from '$lib/components/PaintProgress.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import MiniatureCards from '$lib/components/MiniatureCards.svelte';
	import MiniatureTable from '$lib/components/MiniatureTable.svelte';
	import { t } from '$lib/i18n';

	let { data }: { data: PageData } = $props();

	const page = $derived(data.page);
	const allMiniatures: Miniature[] = $derived(page?.miniatures ?? []);

	let activeTab = $state<'collection' | 'wishlist'>('collection');
	let view = $state<'cards' | 'table'>('cards');
	let searchQuery = $state('');
	let selectedGenre = $state('');
	let selectedFaction = $state('');
	let paintedOnly = $state(false);
	let sortBy = $state<'name' | 'amount' | 'painted'>('name');

	let mounted = $state(false);

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		activeTab = (params.get('tab') as 'collection' | 'wishlist') || 'collection';
		view = (params.get('view') as 'cards' | 'table') || 'cards';
		searchQuery = params.get('q') || '';
		selectedGenre = params.get('genre') || '';
		selectedFaction = params.get('faction') || '';
		paintedOnly = params.get('painted') === '1';
		sortBy = (params.get('sort') as 'name' | 'amount' | 'painted') || 'name';
		mounted = true;
	});

	$effect(() => {
		if (!mounted) return;

		const params = new URLSearchParams();
		if (activeTab !== 'collection') params.set('tab', activeTab);
		if (view !== 'cards') params.set('view', view);
		if (searchQuery) params.set('q', searchQuery);
		if (selectedGenre) params.set('genre', selectedGenre);
		if (selectedFaction) params.set('faction', selectedFaction);
		if (paintedOnly) params.set('painted', '1');
		if (sortBy !== 'name') params.set('sort', sortBy);

		const search = params.toString();
		goto(`${window.location.pathname}${search ? `?${search}` : ''}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	});

	function switchToWishlist() {
		activeTab = 'wishlist';
		paintedOnly = false;
		if (sortBy === 'painted' || sortBy === 'amount') sortBy = 'name';
	}

	const isWishlist = $derived(activeTab === 'wishlist');

	const collectionMinis = $derived(allMiniatures.filter((m) => !m.wished));
	const collectionTotal = $derived(collectionMinis.reduce((s, m) => s + m.amount, 0));

	const wishlistMinis = $derived(allMiniatures.filter((m) => m.wished));

	const tabMiniatures: Miniature[] = $derived(
		isWishlist
			? allMiniatures.filter((m) => m.wished)
			: allMiniatures.filter((m) => !m.wished)
	);

	const factionStats = $derived.by(() => {
		const map = new Map<string, { owned: number; painted: number }>();
		for (const m of collectionMinis) {
			const factions = (m.genre === 'fantasy' ? m.faction_fantasy : m.faction_scifi).filter(Boolean);
			const keys = factions.length > 0 ? factions : ['–'];
			for (const f of keys) {
				const entry = map.get(f) ?? { owned: 0, painted: 0 };
				entry.owned += m.amount;
				if (m.painted) entry.painted += m.amount;
				map.set(f, entry);
			}
		}
		return Array.from(map.entries())
			.map(([name, s]) => ({ name, ...s, pct: s.owned > 0 ? Math.round((s.painted / s.owned) * 100) : 0 }))
			.sort((a, b) => b.owned - a.owned);
	});

	const filteredMiniatures: Miniature[] = $derived.by(() => {
		const q = searchQuery.toLowerCase().trim();

		const filtered = tabMiniatures.filter((m) => {
			if (selectedGenre && m.genre !== selectedGenre) return false;
			if (selectedFaction) {
				const factions = [...m.faction_fantasy, ...m.faction_scifi];
				if (!factions.includes(selectedFaction)) return false;
			}
			if (paintedOnly && !m.painted) return false;
			if (q && !m.name.toLowerCase().includes(q)) return false;
			return true;
		});

		return filtered.sort((a, b) => {
			if (sortBy === 'amount') return b.amount - a.amount;
			if (sortBy === 'painted') return Number(a.painted) - Number(b.painted);
			return a.name.localeCompare(b.name, 'en');
		});
	});
</script>

<svelte:head>
	<title>{page?.title ?? 'Hobbylog'}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<header class="border-b bg-white px-6 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<a href="/" class="mb-1 block text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">{t.backToAllCollections}</a>
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">{page?.title ?? 'Hobbylog'}</h1>
		{#if page?.subtitle}
			<p class="text-sm text-gray-500 dark:text-gray-400">{page.subtitle}</p>
		{/if}
	</header>

	<main class="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6">
		{#if page.paint_progress}
			<PaintProgress miniatures={allMiniatures} />
		{/if}

		{#if factionStats.length > 1}
			<div class="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<h2 class="border-b border-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300">
					{t.factions}
				</h2>
				<div class="divide-y divide-gray-100 dark:divide-gray-700">
					{#each factionStats as f}
						<div class="flex items-center gap-4 px-5 py-2.5">
							<span class="w-40 shrink-0 truncate text-sm text-gray-700 dark:text-gray-300">{f.name}</span>
							<div class="flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700" style="height:6px">
								<div class="rounded-full bg-green-500" style="width:{f.pct}%;height:6px"></div>
							</div>
							<span class="w-24 shrink-0 text-right text-xs text-gray-400 dark:text-gray-500">
								{f.painted}/{f.owned} · {f.pct}%
							</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<div class="mb-4 border-b border-gray-200 dark:border-gray-700">
			<nav class="-mb-px flex gap-6">
				<button
					class="border-b-2 pb-2 text-sm font-medium transition-colors {activeTab === 'collection' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 dark:text-gray-400'}"
					onclick={() => (activeTab = 'collection')}
				>
					{t.collection}
					<span class="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
						{collectionTotal}
					</span>
				</button>
				<button
					class="border-b-2 pb-2 text-sm font-medium transition-colors {activeTab === 'wishlist' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 dark:text-gray-400'}"
					onclick={switchToWishlist}
				>
					{t.wishlist}
					<span class="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
						{wishlistMinis.length}
					</span>
				</button>
			</nav>
		</div>

		<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
			<FilterBar
				miniatures={tabMiniatures}
				bind:searchQuery
				bind:selectedGenre
				bind:selectedFaction
				bind:paintedOnly
				showPaintedFilter={!isWishlist}
			/>

			<div class="flex items-center gap-3">
				<label class="flex items-center gap-2 text-sm">
					<span class="font-medium text-gray-700 dark:text-gray-300">{t.sortBy}</span>
					<select
						bind:value={sortBy}
						class="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
					>
						<option value="name">{t.sortName}</option>
						{#if !isWishlist}
							<option value="amount">{t.sortAmount}</option>
							<option value="painted">{t.sortUnpaintedFirst}</option>
						{/if}
					</select>
				</label>

				<div class="flex rounded-lg border border-gray-200 bg-white text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800">
					<button
						class="rounded-l-lg px-3 py-1.5 font-medium transition-colors {view === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400'}"
						onclick={() => (view = 'cards')}
					>
						{t.cards}
					</button>
					<button
						class="rounded-r-lg px-3 py-1.5 font-medium transition-colors {view === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400'}"
						onclick={() => (view = 'table')}
					>
						{t.table}
					</button>
				</div>
			</div>
		</div>

		{#if view === 'cards'}
			<MiniatureCards miniatures={filteredMiniatures} {searchQuery} showPainted={sortBy === 'painted'} />
		{:else}
			<MiniatureTable miniatures={filteredMiniatures} {searchQuery} />
		{/if}
	</main>
</div>
