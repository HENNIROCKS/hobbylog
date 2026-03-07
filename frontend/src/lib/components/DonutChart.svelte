<script lang="ts">
	import { t } from '$lib/i18n';

	let {
		value,
		total,
		color,
		trackColor = 'var(--chart-track)',
		label
	}: {
		value: number;
		total?: number;
		color: string;
		trackColor?: string;
		label: string;
	} = $props();

	const r = 36;
	const circ = 2 * Math.PI * r;
	const pct = $derived(total !== undefined && total > 0 ? Math.min(value / total, 1) : 0);
	const filled = $derived(pct * circ);
</script>

<div class="flex flex-col items-center gap-2">
	<svg viewBox="0 0 100 100" class="h-28 w-28">
		<circle cx="50" cy="50" r={r} fill="none" style="stroke: {trackColor}" stroke-width="16" />
		{#if total !== undefined}
			<circle
				cx="50"
				cy="50"
				r={r}
				fill="none"
				stroke={color}
				stroke-width="16"
				stroke-dasharray="{filled} {circ}"
				stroke-linecap="round"
				transform="rotate(-90 50 50)"
			/>
			<text x="50" y="47" text-anchor="middle" font-size="20" font-weight="600" class="fill-gray-900 dark:fill-white">
				{value}
			</text>
			<text x="50" y="63" text-anchor="middle" font-size="9" class="fill-gray-400 dark:fill-gray-500">
				{t.of} {total}
			</text>
		{:else}
			<text x="50" y="57" text-anchor="middle" font-size="20" font-weight="600" class="fill-gray-900 dark:fill-white">
				{value}
			</text>
		{/if}
	</svg>
	<p class="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
</div>
