<script lang="ts">
	import { watchlist } from '$lib/stores/watchlist.svelte';

	interface Props {
		assetId: string;
		assetName: string;
		size?: 'sm' | 'md';
	}

	let { assetId, assetName, size = 'md' }: Props = $props();

	let inWatchlist = $derived(watchlist.has(assetId));
</script>

<button
	aria-label={inWatchlist ? `Remove ${assetName} from watchlist` : `Add ${assetName} to watchlist`}
	aria-pressed={inWatchlist}
	class="inline-flex items-center justify-center gap-2 border font-display font-bold tracking-[0.06em] uppercase cursor-pointer transition-all rounded-(--radius) focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2
    {size === 'sm' ? 'py-1.5 px-3 text-[11px]' : 'py-2.5 px-5 text-[13px]'}
    {inWatchlist
      ? 'border-[rgba(251,191,36,0.4)] text-(--watchlist) bg-(--watchlist-bg) shadow-[0_0_16px_rgba(251,191,36,0.1)]'
      : 'border-(--border) bg-transparent text-(--text-dim) hover:border-(--watchlist) hover:text-(--watchlist) hover:bg-(--watchlist-bg)'}"
	onclick={() => watchlist.toggle(assetId)}
>
	<span aria-hidden="true">{inWatchlist ? '★' : '☆'}</span>
	{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
</button>
