<script lang="ts">
	import type { PageData } from './$types';
	import { formatPrice, formatPercent, formatMarketCap, formatVolume } from '$lib/utils/format';
	import WatchlistToggleButton from '$lib/components/WatchlistToggleButton.svelte';
	import CandleChart from '$lib/components/CandleChart.svelte';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();
	let { asset, categories } = $derived(data);

	let isPositive = $derived(asset.changePercent >= 0);
	let category = $derived(categories.find((c) => c.id === asset.category));
</script>

<svelte:head>
	<title>{asset.symbol} — {asset.name} — ORBIT</title>
	<meta
		name="description"
		content="{asset.name} ({asset.symbol}): {asset.description.slice(0, 150)}…"
	/>
</svelte:head>

<div class="flex flex-col gap-5 lg:max-w-9/12">
	<!-- Breadcrumb -->
	<nav
		class="flex items-center gap-2 text-[13px] font-(--font-mono) text-(--text-muted)"
		aria-label="Breadcrumb"
	>
		<a
			href={resolve('/')}
			class="text-(--accent) transition-opacity hover:opacity-80 focus-visible:rounded-[3px] focus-visible:outline-2 focus-visible:outline-(--accent)"
			>Dashboard</a
		>
		<span class="opacity-40" aria-hidden="true">/</span>
		<span aria-current="page">{asset.symbol}</span>
	</nav>

	<!-- Hero Section -->
	<div
		class="card flex flex-col gap-6 p-7 pb-6"
		class:is-up={isPositive}
		class:is-down={!isPositive}
	>
		<div class="flex flex-wrap items-start justify-between gap-6 max-[600px]:flex-col">
			<div>
				<div class="mb-1.5 flex items-center gap-2.5">
					<span class="font-mono text-[28px] font-semibold tracking-[0.02em] text-(--text)"
						>{asset.symbol}</span
					>
					<span
						class="font-display inline-flex items-center gap-1 rounded-full border border-(--border) bg-(--bg-elevated) px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-(--text-dim) uppercase"
					>
						<span aria-hidden="true">{category?.icon}</span>
						{category?.label}
					</span>
				</div>
				<h1 class="font-display text-[18px] font-medium text-(--text-dim)">{asset.name}</h1>
			</div>

			<div
				class="flex flex-col items-end gap-2 text-right max-[600px]:items-start max-[600px]:text-left"
			>
				<p
					class="font-mono text-[36px] leading-none font-semibold tracking-[-0.02em] text-(--text) max-[600px]:text-[28px]"
					aria-label="Current price: {formatPrice(asset.price, asset.currency)}"
				>
					{formatPrice(asset.price, asset.currency)}
				</p>
				<div
					class="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-mono text-[14px] font-medium {isPositive
						? 'bg-(--up-bg) text-(--up)'
						: 'bg-(--down-bg) text-(--down)'}"
					aria-label="Change: {formatPercent(asset.changePercent)}"
				>
					<span class="text-[10px]" aria-hidden="true">{isPositive ? '▲' : '▼'}</span>
					<span>{formatPrice(Math.abs(asset.change), asset.currency)}</span>
					<span class="font-semibold">{formatPercent(asset.changePercent)}</span>
				</div>
			</div>
		</div>

		<div class="flex flex-wrap gap-2.5">
			<WatchlistToggleButton assetId={asset.id} assetName={asset.name} />
			<a href={resolve('/')} class="btn btn-ghost">← Back to Dashboard</a>
		</div>
	</div>

	<!-- Stats Row -->
	<div class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 max-[600px]:grid-cols-2">
		{#if asset.high24h !== undefined}
			<div class="card flex flex-col gap-1.5 px-4.5 py-4">
				<span
					class="font-display text-[10px] font-bold tracking-[0.12em] text-(--text-muted) uppercase"
					>24h High</span
				>
				<span class="positive font-mono text-[16px] font-semibold"
					>{formatPrice(asset.high24h, asset.currency)}</span
				>
			</div>
		{/if}
		{#if asset.low24h !== undefined}
			<div class="card flex flex-col gap-1.5 px-4.5 py-4">
				<span
					class="font-display text-[10px] font-bold tracking-[0.12em] text-(--text-muted) uppercase"
					>24h Low</span
				>
				<span class="negative font-mono text-[16px] font-semibold"
					>{formatPrice(asset.low24h, asset.currency)}</span
				>
			</div>
		{/if}
		{#if asset.volume !== undefined}
			<div class="card flex flex-col gap-1.5 px-4.5 py-4">
				<span
					class="font-display text-[10px] font-bold tracking-[0.12em] text-(--text-muted) uppercase"
					>Volume (24h)</span
				>
				<span class="font-mono text-[16px] font-semibold text-(--text)"
					>{formatVolume(asset.volume)}</span
				>
			</div>
		{/if}
		{#if asset.marketCap !== undefined}
			<div class="card flex flex-col gap-1.5 px-4.5 py-4">
				<span
					class="font-display text-[10px] font-bold tracking-[0.12em] text-(--text-muted) uppercase"
					>Market Cap</span
				>
				<span class="font-mono text-[16px] font-semibold text-(--text)"
					>{formatMarketCap(asset.marketCap)}</span
				>
			</div>
		{/if}
		<div class="card flex flex-col gap-1.5 px-4.5 py-4">
			<span
				class="font-display text-[10px] font-bold tracking-[0.12em] text-(--text-muted) uppercase"
				>Currency</span
			>
			<span class="font-mono text-[16px] font-semibold text-(--text)">{asset.currency}</span>
		</div>
		<div class="card flex flex-col gap-1.5 px-4.5 py-4">
			<span
				class="font-display text-[10px] font-bold tracking-[0.12em] text-(--text-muted) uppercase"
				>Category</span
			>
			<span class="font-mono text-[16px] font-semibold text-(--text)">
				<span aria-hidden="true">{category?.icon}</span>
				{category?.label}
			</span>
		</div>
	</div>

	<!-- Description -->
	<section class="card p-7" aria-labelledby="desc-heading">
		<h2
			id="desc-heading"
			class="font-display mb-3.5 text-[13px] font-bold tracking-[0.12em] text-(--text-muted) uppercase"
		>
			About {asset.name}
		</h2>
		<p class="text-[15px] leading-[1.75] text-(--text-dim)">{asset.description}</p>
	</section>

	<!-- Candle Chart -->
	<CandleChart assetId={asset.id} />
</div>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 10px 20px;
		border-radius: var(--radius);
		font-family: var(--font-display), sans-serif;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		border: 1px solid transparent;
		transition: all var(--transition);
		cursor: pointer;
	}

	.btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.btn-ghost {
		background: transparent;
		color: var(--text-dim);
		border-color: var(--border);
	}

	.btn-ghost:hover {
		border-color: var(--accent);
		color: var(--accent);
		background: var(--accent-glow);
	}

	.is-up {
		background: linear-gradient(160deg, var(--bg-card), var(--up-bg) 80%);
	}

	.is-down {
		background: linear-gradient(160deg, var(--bg-card), var(--down-bg) 80%);
	}
</style>
