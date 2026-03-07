<script lang="ts">
	import type { PageData } from './$types';
	import type { CollectionPage, Miniature } from '$lib/types';
	import DonutChart from '$lib/components/DonutChart.svelte';
	import { t } from '$lib/i18n';

	let { data }: { data: PageData } = $props();
	const pages: CollectionPage[] = $derived(data.pages);

	const allMiniatures: Miniature[] = $derived(pages.flatMap((p) => p.miniatures));

	// Owned: non-wished, counted by amount
	const ownedAmount = $derived(
		allMiniatures.filter((m) => !m.wished).reduce((sum, m) => sum + m.amount, 0)
	);

	// Painted: painted non-wished, counted by amount
	const paintedAmount = $derived(
		allMiniatures.filter((m) => !m.wished && m.painted).reduce((sum, m) => sum + m.amount, 0)
	);

	// Wishlist: entries with wished=true
	const wishedCount = $derived(allMiniatures.filter((m) => m.wished).length);

	// Genre: sum amount by genre (owned only)
	const fantasyAmount = $derived(
		allMiniatures
			.filter((m) => !m.wished && m.genre === 'fantasy')
			.reduce((sum, m) => sum + m.amount, 0)
	);
	const scifiAmount = $derived(
		allMiniatures
			.filter((m) => !m.wished && m.genre === 'scifi')
			.reduce((sum, m) => sum + m.amount, 0)
	);
	const genreTotal = $derived(fantasyAmount + scifiAmount);

	// Painting queue: top 10 unpainted owned entries across all collections
	const paintingQueue = $derived(
		pages
			.flatMap((p) =>
				p.miniatures
					.filter((m) => !m.wished && !m.painted && m.amount > 0)
					.map((m) => ({ name: m.name, amount: m.amount, collectionTitle: p.title, collectionSlug: p.slug }))
			)
			.sort((a, b) => b.amount - a.amount)
			.slice(0, 10)
	);
</script>

<svelte:head>
	<title>Hobbylog</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<header class="border-b bg-white px-6 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Hobbylog</h1>
		<p class="text-sm text-gray-500 dark:text-gray-400">{t.allCollections}</p>
	</header>

	<main class="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6">
		{#if pages.length > 0}
			<!-- Stats -->
			<div class="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<p class="mb-6 text-sm text-gray-400 dark:text-gray-500">
					{t.miniatureCount(ownedAmount, pages.length)}
				</p>
				<div class="flex flex-wrap justify-around gap-8">
					<DonutChart
						value={paintedAmount}
						total={ownedAmount}
						color="#22c55e"
						label={t.painted}
					/>
					<DonutChart
						value={fantasyAmount}
						total={genreTotal}
						color="#a855f7"
						trackColor="#3b82f6"
						label="Fantasy / Sci-Fi"
					/>
					<div class="flex flex-col items-center gap-2">
						<div class="flex h-28 w-28 items-center justify-center rounded-full bg-amber-400 dark:bg-amber-500">
							<span class="text-3xl font-bold text-amber-900 dark:text-amber-950">{wishedCount}</span>
						</div>
						<p class="text-sm font-medium text-gray-500 dark:text-gray-400">{t.wishlist}</p>
					</div>
				</div>
			</div>

			<!-- Painting queue -->
			{#if paintingQueue.length > 0}
				<div class="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
					<div class="border-b border-gray-100 px-5 py-3 dark:border-gray-700">
					<h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.paintingQueue}</h2>
					<p class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t.paintingQueueDesc}</p>
				</div>
					<ol class="divide-y divide-gray-100 dark:divide-gray-700">
						{#each paintingQueue as item, i}
							<li>
								<a
									href="/{item.collectionSlug}?sort=painted"
									class="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
								>
									<span class="w-5 text-right text-xs text-gray-400 dark:text-gray-500">{i + 1}</span>
									<span class="flex-1 text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
									<span class="text-xs text-gray-400 dark:text-gray-500">{item.collectionTitle}</span>
									<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
										×{item.amount}
									</span>
								</a>
							</li>
						{/each}
					</ol>
				</div>
			{/if}
		{/if}

		<!-- Collections -->
		{#if pages.length === 0}
			<p class="text-center text-gray-400 dark:text-gray-500">{t.noCollectionsFound}</p>
		{:else}
			<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each pages as page}
					{@const owned = page.miniatures.filter((m) => !m.wished)}
					{@const ownedAmt = owned.reduce((s, m) => s + m.amount, 0)}
					{@const paintedAmt = owned.filter((m) => m.painted).reduce((s, m) => s + m.amount, 0)}
					{@const pct = ownedAmt > 0 ? Math.round((paintedAmt / ownedAmt) * 1000) / 10 : 0}
					<li>
						<a
							href="/{page.slug}"
							class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
						>
							<h2 class="text-lg font-semibold text-gray-900 dark:text-white">{page.title}</h2>
							{#if page.subtitle}
								<p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{page.subtitle}</p>
							{/if}
							<div class="mt-auto pt-3">
								<div class="mb-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
									<div
										class="flex h-4 items-center justify-center rounded-full bg-green-500 text-xs font-semibold text-white transition-all"
										style="width: {pct}%; min-width: {pct > 0 ? '2rem' : '0'}"
									>
										{#if pct > 0}{pct}%{/if}
									</div>
								</div>
								<p class="text-sm text-gray-400 dark:text-gray-500">
									{ownedAmt} miniatures · {page.miniatures.filter((m) => m.wished).length} {t.onWishlist}
								</p>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</main>
</div>
