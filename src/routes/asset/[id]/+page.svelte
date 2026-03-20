<script lang="ts">
    import type { PageData } from './$types';
    import { formatPrice, formatPercent, formatMarketCap, formatVolume } from '$lib/utils/format';
    import WatchlistToggleButton from '$lib/components/WatchlistToggleButton.svelte';

    let { data }: { data: PageData } = $props();
    let { asset, categories } = $derived(data);

    let isPositive = $derived(asset.changePercent >= 0);
    let category = $derived(categories.find((c) => c.id === asset.category));
</script>

<svelte:head>
    <title>{asset.symbol} — {asset.name} — ORBIT</title>
    <meta name="description" content="{asset.name} ({asset.symbol}): {asset.description.slice(0, 150)}…" />
</svelte:head>

<div class="flex flex-col gap-5 max-w-215">
	<!-- Breadcrumb -->
	<nav class="flex items-center gap-2 text-[13px] text-(--text-muted) font-(--font-mono)" aria-label="Breadcrumb">
		<a href="/" class="text-(--accent) hover:opacity-80 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:rounded-[3px] transition-opacity">Dashboard</a>
		<span class="opacity-40" aria-hidden="true">/</span>
		<span aria-current="page">{asset.symbol}</span>
	</nav>

	<!-- Hero Section -->
	<div class="card p-7 pb-6 flex flex-col gap-6">
		<div class="flex items-start justify-between gap-6 flex-wrap max-[600px]:flex-col">
			<div>
				<div class="flex items-center gap-2.5 mb-1.5">
					<span class="font-mono text-[28px] font-semibold text-(--text) tracking-[0.02em]">{asset.symbol}</span>
					<span class="inline-flex items-center gap-1 py-1 px-2.5 bg-(--bg-elevated) border border-(--border) rounded-full text-[11px] font-semibold font-display tracking-[0.08em] uppercase text-(--text-dim)">
                        <span aria-hidden="true">{category?.icon}</span>
						{category?.label}
                    </span>
				</div>
				<h1 class="font-display text-[18px] font-medium text-(--text-dim)">{asset.name}</h1>
			</div>

			<div class="text-right flex flex-col items-end gap-2 max-[600px]:text-left max-[600px]:items-start">
				<p class="font-mono text-[36px] font-semibold text-(--text) tracking-[-0.02em] leading-none max-[600px]:text-[28px]" aria-label="Current price: {formatPrice(asset.price, asset.currency)}">
					{formatPrice(asset.price, asset.currency)}
				</p>
				<div
					class="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg font-mono text-[14px] font-medium {isPositive ? 'bg-(--up-bg) text-(--up)' : 'bg-(--down-bg) text-(--down)'}"
					aria-label="Change: {formatPercent(asset.changePercent)}"
				>
					<span class="text-[10px]" aria-hidden="true">{isPositive ? '▲' : '▼'}</span>
					<span>{formatPrice(Math.abs(asset.change), asset.currency)}</span>
					<span class="font-semibold">{formatPercent(asset.changePercent)}</span>
				</div>
			</div>
		</div>

		<div class="flex gap-2.5 flex-wrap">
			<WatchlistToggleButton assetId={asset.id} assetName={asset.name} />
			<a href="/" class="btn btn-ghost">← Back to Dashboard</a>
		</div>
	</div>

	<!-- Stats Row -->
	<div class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 max-[600px]:grid-cols-2">
		{#if asset.high24h !== undefined}
			<div class="card py-4 px-4.5 flex flex-col gap-1.5">
				<span class="font-display text-[10px] font-bold tracking-[0.12em] uppercase text-(--text-muted)">24h High</span>
				<span class="font-mono text-[16px] font-semibold positive">{formatPrice(asset.high24h, asset.currency)}</span>
			</div>
		{/if}
		{#if asset.low24h !== undefined}
			<div class="card py-4 px-4.5 flex flex-col gap-1.5">
				<span class="font-display text-[10px] font-bold tracking-[0.12em] uppercase text-(--text-muted)">24h Low</span>
				<span class="font-mono text-[16px] font-semibold negative">{formatPrice(asset.low24h, asset.currency)}</span>
			</div>
		{/if}
		{#if asset.volume !== undefined}
			<div class="card py-4 px-4.5 flex flex-col gap-1.5">
				<span class="font-display text-[10px] font-bold tracking-[0.12em] uppercase text-(--text-muted)">Volume (24h)</span>
				<span class="font-mono text-[16px] font-semibold text-(--text)">{formatVolume(asset.volume)}</span>
			</div>
		{/if}
		{#if asset.marketCap !== undefined}
			<div class="card py-4 px-4.5 flex flex-col gap-1.5">
				<span class="font-display text-[10px] font-bold tracking-[0.12em] uppercase text-(--text-muted)">Market Cap</span>
				<span class="font-mono text-[16px] font-semibold text-(--text)">{formatMarketCap(asset.marketCap)}</span>
			</div>
		{/if}
		<div class="card py-4 px-4.5 flex flex-col gap-1.5">
			<span class="font-display text-[10px] font-bold tracking-[0.12em] uppercase text-(--text-muted)">Currency</span>
			<span class="font-mono text-[16px] font-semibold text-(--text)">{asset.currency}</span>
		</div>
		<div class="card py-4 px-4.5 flex flex-col gap-1.5">
			<span class="font-display text-[10px] font-bold tracking-[0.12em] uppercase text-(--text-muted)">Category</span>
			<span class="font-mono text-[16px] font-semibold text-(--text)">
                <span aria-hidden="true">{category?.icon}</span>
				{category?.label}
            </span>
		</div>
	</div>

	<!-- Description -->
	<section class="card p-7" aria-labelledby="desc-heading">
		<h2 id="desc-heading" class="font-display text-[13px] font-bold tracking-[0.12em] uppercase text-(--text-muted) mb-3.5">About {asset.name}</h2>
		<p class="text-[15px] leading-[1.75] text-(--text-dim)">{asset.description}</p>
	</section>

	<!-- Price Range Visual -->
	{#if asset.high24h !== undefined && asset.low24h !== undefined}
		{@const pct = ((asset.price - asset.low24h) / (asset.high24h - asset.low24h)) * 100}
		<div class="card py-6 px-7" aria-label="24h price range">
			<h2 class="font-display text-[13px] font-bold tracking-[0.12em] uppercase text-(--text-muted) mb-3.5">24h Range</h2>
			<div class="flex items-center gap-3.5 max-[600px]:flex-col max-[600px]:gap-2">
				<span class="font-mono text-[12px] text-(--text-muted) whitespace-nowrap min-w-20">{formatPrice(asset.low24h, asset.currency)}</span>
				<div class="flex-1 h-1.5 bg-(--bg-elevated) rounded-full relative overflow-visible max-[600px]:w-full" role="presentation">
					<div
						class="h-full rounded-full transition-[width] duration-600 ease-in-out {isPositive ? 'bg-(--up)' : 'bg-(--down)'}"
						style="width: {Math.max(2, Math.min(100, pct)).toFixed(1)}%"
					></div>
					<div
						class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-(--text) border-2 border-(--bg-card) rounded-full shadow-[0_0_8px_rgba(0,0,0,0.4)]"
						style="left: {Math.max(2, Math.min(98, pct)).toFixed(1)}%"
						role="img"
						aria-label="Current price position: {formatPrice(asset.price, asset.currency)}"
					></div>
				</div>
				<span class="font-mono text-[12px] text-(--text-muted) whitespace-nowrap min-w-20 text-right">{formatPrice(asset.high24h, asset.currency)}</span>
			</div>
		</div>
	{/if}
</div>
