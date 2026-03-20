<script lang="ts">
	import type { AssetSummary, Category } from '$lib/types/asset';
	import { watchlist } from '$lib/stores/watchlist.svelte';
	import { formatPrice, formatPercent } from '$lib/utils/format';
	import { resolve } from '$app/paths';

	interface Props {
		asset: AssetSummary;
		categories: Category[];
	}

	let { asset, categories }: Props = $props();

	let inWatchlist = $derived(watchlist.has(asset.id));
	let isPositive = $derived(asset.changePercent >= 0);
	let category = $derived(categories.find((c) => c.id === asset.category));

	function handleWatchlist(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		watchlist.toggle(asset.id);
	}
</script>

<article
	class="card relative overflow-hidden p-0"
	class:in-watchlist={inWatchlist}
	class:is-up={isPositive}
	class:is-down={!isPositive}
	aria-label="{asset.name} {asset.symbol}"
>
	<a
		href={resolve(`/asset/${asset.id}`)}
		class="block h-full p-5 -outline-offset-2 focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-(--accent)"
		tabindex="0"
		aria-label="View details for {asset.name}"
	>
		<div class="mb-2.5 flex items-start justify-between">
			<div class="flex flex-col gap-1">
				<span class="font-mono text-[18px] font-semibold tracking-[0.04em] text-(--text)"
					>{asset.symbol}</span
				>
				<span
					class="flex items-center gap-1 text-[11px] font-medium tracking-[0.06em] text-(--text-muted) uppercase"
				>
					<span aria-hidden="true">{category?.icon}</span>
					{category?.label}
				</span>
			</div>
			<button
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-(--border) bg-transparent text-[18px] text-(--text-muted) transition-all hover:border-(--watchlist) hover:bg-(--watchlist-bg) hover:text-(--watchlist) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) {inWatchlist
					? 'border-[rgba(251,191,36,0.4)] bg-(--watchlist-bg) text-(--watchlist)'
					: ''}"
				onclick={handleWatchlist}
				aria-label={inWatchlist
					? `Remove ${asset.name} from watchlist`
					: `Add ${asset.name} to watchlist`}
				aria-pressed={inWatchlist}
				title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
			>
				<span aria-hidden="true">{inWatchlist ? '★' : '☆'}</span>
			</button>
		</div>

		<p class="mb-4 truncate text-[14px] text-(--text-dim)">{asset.name}</p>

		<div class="flex items-baseline justify-between gap-2">
			<span class="font-mono text-[20px] font-semibold tracking-[-0.01em] text-(--text)"
				>{formatPrice(asset.price, asset.currency)}</span
			>
			<span
				class="flex items-center gap-0.75 rounded-md px-2 py-0.75 font-mono text-[16px] font-medium {isPositive
					? 'bg-(--up-bg) text-(--up)'
					: 'bg-(--down-bg) text-(--down)'}"
				aria-label="Change: {formatPercent(asset.changePercent)}"
			>
				<span class="text-[16px]" aria-hidden="true">{isPositive ? '▲' : '▼'}</span>
				{formatPercent(asset.changePercent)}
			</span>
		</div>
	</a>
</article>

<style>
	.is-up {
		background: linear-gradient(160deg, var(--bg-card), var(--up-bg) 80%);
	}

	.is-down {
		background: linear-gradient(160deg, var(--bg-card), var(--down-bg) 80%);
	}

	.in-watchlist {
		border-color: rgba(251, 191, 36, 0.25);
		background: linear-gradient(135deg, var(--bg-card), rgba(251, 191, 36, 0.04) 70%);
	}

	article:hover {
		transform: translateY(-3px);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.45),
			0 0 0 1px rgba(99, 210, 255, 0.08),
			0 0 24px rgba(99, 210, 255, 0.06);
		border-color: rgba(99, 210, 255, 0.2);
	}

	article.in-watchlist:hover {
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.45),
			0 0 0 1px rgba(251, 191, 36, 0.2),
			0 0 24px rgba(251, 191, 36, 0.08);
		border-color: rgba(251, 191, 36, 0.4);
	}
</style>
