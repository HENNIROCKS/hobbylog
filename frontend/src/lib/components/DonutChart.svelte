<script lang="ts">
	let {
		value,
		total,
		color,
		trackColor = 'var(--chart-track)',
		label,
		centerLabel,
		pie = false
	}: {
		value: number;
		total?: number;
		color: string;
		trackColor?: string;
		label: string;
		centerLabel?: string;
		pie?: boolean;
	} = $props();

	const r = $derived(pie ? 25 : 36);
	const circ = $derived(2 * Math.PI * r);
	const pct = $derived(total !== undefined && total > 0 ? Math.min(value / total, 1) : 0);
	const filled = $derived(pct * circ);
</script>

<div class="flex flex-col items-center gap-2">
	<svg viewBox="0 0 100 100" class="h-28 w-28">
		{#if total !== undefined}
			<circle cx="50" cy="50" r={r} fill="none" style="stroke: {trackColor}" stroke-width={pie ? 50 : 12} />
			<circle
				cx="50"
				cy="50"
				r={r}
				fill="none"
				stroke={color}
				stroke-width={pie ? 50 : 12}
				stroke-dasharray="{filled} {circ}"
				stroke-linecap={pie ? 'butt' : 'round'}
				transform="rotate(-90 50 50)"
			/>
			{#if pie && centerLabel}
				<text x="50" y="55" text-anchor="middle" font-size="14" font-weight="600" class="fill-white">{centerLabel}</text>
			{:else if !pie}
				{#if centerLabel}
					<text x="50" y="46" text-anchor="middle" font-size="11" class="fill-gray-500 dark:fill-gray-400">{centerLabel}</text>
					<text x="50" y="62" text-anchor="middle" font-size="20" font-weight="600" class="fill-gray-900 dark:fill-white">{value}</text>
				{:else}
					<text x="50" y="55" text-anchor="middle" font-size="18" font-weight="600" class="fill-gray-900 dark:fill-white">
						{parseFloat((pct * 100).toFixed(1))}%
					</text>
				{/if}
			{/if}
		{:else}
			<text x="50" y="57" text-anchor="middle" font-size="20" font-weight="600" class="fill-gray-900 dark:fill-white">
				{value}
			</text>
		{/if}
	</svg>
	<p class="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
</div>
