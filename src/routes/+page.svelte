<script lang="ts">
	import type { PageData } from './$types';
	import type { AssetSummary } from '$lib/types/asset';
	import { page } from '$app/state';
	import { watchlist } from '$lib/stores/watchlist.svelte';
	import { setCategory, setQuery } from '$lib/utils/filters';
	import logo from '$lib/assets/logo.svg';

	import SearchBar from '$lib/components/SearchBar.svelte';
	import AssetCard from '$lib/components/AssetCard.svelte';
	import AssetCardSkeleton from '$lib/components/AssetCardSkeleton.svelte';
	import CategoryFilter from '$lib/components/CategoryFilter.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import ErrorBanner from '$lib/components/ErrorBanner.svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	let { data }: { data: PageData } = $props();

	let searchQuery = $derived(data.query ?? '');
	let activeCategory = $derived(data.activeCategory ?? 'all');
	let isSearching = $state(false);
	let searchError = $state<string | null>(null);

	let clientAssets = $state<{ assets: AssetSummary[]; total: number } | null>(null);

	let showWatchlist = $derived(page.url.searchParams.has('watchlist'));

	let abortController: AbortController | null = null;

	async function doSearch() {
		// Cancel previous request
		if (abortController) {
			abortController.abort();
		}
		abortController = new AbortController();
		const signal = abortController.signal;

		isSearching = true;
		searchError = null;
		clientAssets = null;

		try {
			const params = new SvelteURLSearchParams();

			if (searchQuery !== '') params.set('q', searchQuery);
			if (activeCategory !== 'all') params.set('category', activeCategory);

			const res = await fetch(`/api/asset?${params}`, { signal });

			if (!res.ok) throw new Error(`HTTP ${res.status}`);

			const payload = await res.json();
			clientAssets = { assets: payload.data, total: payload.total };
		} catch (e: unknown) {
			if ((e as Error).name === 'AbortError') return; // Cancelled — ignore
			searchError = 'Search failed. Please try again.';
		} finally {
			isSearching = false;
		}
	}

	function handleSearch(q: string) {
		setQuery(q.trim());
	}

	function handleCategory(cat: string) {
		setCategory(cat);
	}

	function retrySearch() {
		searchError = null;
		doSearch();
	}

	let pageTitle = $derived(
		showWatchlist ? 'My Watchlist' : searchQuery ? `Results for "${searchQuery}"` : 'All Assets'
	);
</script>

<svelte:head>
	<title>{showWatchlist ? 'Watchlist' : 'Dashboard'} — Stonks-o-meter</title>
	<meta
		name="description"
		content="Explore financial assets: stocks, ETFs, cryptocurrencies, and commodities."
	/>
</svelte:head>

<!-- Skip to content -->
<a href="#main-content" class="skip-link">Skip to content</a>

<div class="flex flex-col gap-7">
	<!-- Page Header -->
	<div class="flex flex-wrap items-end justify-between gap-6 max-sm:flex-col max-sm:items-start">
		<div class="flex flex-col gap-1">
			<h1
				class="flex items-center gap-2.5 text-[clamp(24px,4vw,36px)] leading-tight font-(--font-display) tracking-[-0.01em] text-(--text)"
			>
				{#if showWatchlist}
					<span class="text-[0.8em] text-(--accent)" aria-hidden="true">★</span>
				{:else}
					<span class="text-[0.8em] text-(--accent)" aria-hidden="true"
						><img src={logo} alt="" class="h-6 w-auto" /></span
					>
				{/if}
				{pageTitle}
			</h1>
			<p class="pl-0.5 font-mono text-xs tracking-[0.05em] text-(--text-muted)">
				{#if showWatchlist}
					{watchlist.count} asset{watchlist.count !== 1 ? 's' : ''} tracked
				{:else}
					{#await data.streamed.assets then resolved}
						{clientAssets?.total ?? resolved.total}
						asset{(clientAssets?.total ?? resolved.total) !== 1 ? 's' : ''} available
					{/await}
				{/if}
			</p>
		</div>

		{#if !showWatchlist}
			<SearchBar bind:value={searchQuery} loading={isSearching} onSearch={handleSearch} />
		{/if}
	</div>

	<!-- Category Filter (dashboard only) -->
	{#if !showWatchlist}
		<div class="flex flex-wrap items-center gap-4">
			<CategoryFilter
				categories={data.categories}
				active={activeCategory}
				onSelect={handleCategory}
			/>
			{#if isSearching}
				<span
					class="flex items-center gap-2 font-mono text-[13px] text-(--text-muted)"
					role="status"
					aria-live="polite"
				>
					<span
						class="inline-block h-3 w-3 animate-[spin_500ms_linear_infinite] rounded-full border-2 border-(--border) border-t-(--accent)"
						aria-hidden="true"
					></span>
					Searching…
				</span>
			{/if}
		</div>
	{/if}

	<!-- Error -->
	{#if searchError}
		<ErrorBanner message={searchError} onRetry={retrySearch} />
	{/if}

	<!-- Asset Grid -->
	{#await data.streamed.assets}
		<section aria-label="Loading assets" aria-busy="true">
			<div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 max-sm:grid-cols-1">
				{#each { length: 12 } as _i, index (index)}
					<AssetCardSkeleton />
				{/each}
			</div>
		</section>
	{:then resolved}
		{@const displayedAssets = (() => {
			const base = clientAssets?.assets ?? resolved.assets;
			return showWatchlist ? base.filter((a) => watchlist.has(a.id)) : base;
		})()}
		{#if displayedAssets.length === 0}
			<EmptyState
				title={searchQuery ? `No results for "${searchQuery}"` : 'No assets found'}
				message={searchQuery
					? 'Try a different search term or clear the filters.'
					: 'No assets match the current filters.'}
				action={searchQuery
					? { label: 'Clear Search', onclick: () => handleSearch('') }
					: { label: 'View All', onclick: () => handleCategory('all') }}
			/>
		{:else}
			<section aria-label="Asset list">
				<div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 max-sm:grid-cols-1">
					{#each displayedAssets as asset (asset.id)}
						<AssetCard {asset} categories={data.categories} />
					{/each}
				</div>
			</section>
		{/if}
	{:catch error}
		<ErrorBanner message={error.body.message} onRetry={retrySearch} />
	{/await}
</div>
