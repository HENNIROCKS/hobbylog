<script lang="ts">
	import type { MiniatureImage } from '$lib/types';

	let {
		images,
		name,
		originalName,
		open = $bindable(false)
	}: {
		images: MiniatureImage[];
		name: string;
		originalName: string;
		open: boolean;
	} = $props();

	let index = $state(0);

	function close() {
		open = false;
		index = 0;
	}

	function prev() {
		index = (index - 1 + images.length) % images.length;
	}

	function next() {
		index = (index + 1) % images.length;
	}

	function onKeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') close();
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	}

	let touchStartX = 0;

	function onTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function onTouchEnd(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - touchStartX;
		if (Math.abs(dx) < 40) return;
		if (dx < 0) next();
		else prev();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		role="presentation"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
		onclick={close}
		onkeydown={(e) => e.key === 'Escape' && close()}
	>
		<!-- Dialog -->
		<div
			role="dialog"
			aria-modal="true"
			aria-label={name}
			tabindex="-1"
			class="relative w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<div class="flex items-start justify-between border-b p-4 dark:border-gray-700">
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">{name}</h3>
					{#if originalName}
						<p class="text-sm text-gray-500 dark:text-gray-400">{originalName}</p>
					{/if}
				</div>
				<button
					onclick={close}
					class="ml-4 rounded p-2 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
					aria-label="Close"
				>
					<svg class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
						<path
							d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
						/>
					</svg>
				</button>
			</div>

			<div class="relative p-4">
				{#if images.length > 0}
					<img
						src={images[index].url}
						alt={originalName || name}
						class="mx-auto max-h-[60vh] w-full object-contain"
						ontouchstart={onTouchStart}
						ontouchend={onTouchEnd}
					/>
					{#if images.length > 1}
						<div class="mt-3 flex items-center justify-center gap-4">
							<button
								onclick={prev}
								class="min-w-[44px] rounded border px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
							>
								&#8249; Previous
							</button>
							<span class="text-sm text-gray-500 dark:text-gray-400">{index + 1} / {images.length}</span>
							<button
								onclick={next}
								class="min-w-[44px] rounded border px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
							>
								Next &#8250;
							</button>
						</div>
					{/if}
				{:else}
					<p class="py-8 text-center text-gray-400 dark:text-gray-500">No images available</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
