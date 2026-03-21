<script lang="ts">
	import { page } from '$app/state';
	import { watchlist } from '$lib/stores/watchlist.svelte';
	import { setQuery } from '$lib/utils/filters';
	import { resolve } from '$app/paths';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open, onClose }: Props = $props();

	let searchQuery = $derived(page.url.searchParams.get('q') ?? '');

	let isDashboardActive = $derived(
		page.url.pathname === '/' && !page.url.searchParams.has('watchlist')
	);
	let isWatchlistActive = $derived(page.url.searchParams.has('watchlist'));

	function handleSearch(e: KeyboardEvent) {
		if (e.key === 'Enter' && searchQuery.trim()) {
			setQuery(searchQuery.trim());
			onClose();
		}
	}
</script>

<!-- Overlay -->
{#if open}
	<div
		class="fixed inset-0 z-150 animate-[fadeIn_200ms_ease] bg-black/60 backdrop-blur-[2px]"
		role="presentation"
		onclick={onClose}
	></div>
{/if}

<!-- Sidebar -->
<aside
	class="fixed top-0 left-0 z-200 h-screen w-65 overflow-y-auto border-r border-(--border) bg-(--bg-card) transition-transform duration-280 ease-in-out {open
		? 'translate-x-0 shadow-[4px_0_40px_rgba(0,0,0,0.5)]'
		: '-translate-x-full'}"
	aria-label="Side navigation"
	aria-hidden={!open}
>
	<div class="flex flex-col gap-6 px-4 pt-5 pb-10">
		<div class="flex items-center justify-between">
			<span
				class="font-display text-[11px] font-bold tracking-[0.15em] text-(--text-muted) uppercase"
				>Navigation</span
			>
			<button
				class="cursor-pointer rounded border-0 bg-transparent p-1 text-[16px] text-(--text-muted) transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-(--accent)"
				aria-label="Close sidebar"
				onclick={onClose}
				>✕
			</button>
		</div>

		<nav aria-label="Sidebar navigation">
			<a
				href={resolve('/')}
				class="flex items-center gap-2.5 rounded-(--radius) px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-(--bg-elevated) {isDashboardActive
					? 'bg-(--bg-elevated) text-(--text)'
					: 'text-(--text-dim) hover:text-(--text)'}"
			>
				<span class="text-[16px]" aria-hidden="true">⬡</span> Dashboard
			</a>
			<a
				href={resolve('/?watchlist=1')}
				class="flex items-center gap-2.5 rounded-(--radius) px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-(--bg-elevated) {isWatchlistActive
					? 'bg-(--bg-elevated) text-(--text)'
					: 'text-(--text-dim) hover:text-(--text)'}"
			>
				<span class="text-[16px]" aria-hidden="true">★</span> My Watchlist
				{#if watchlist.count > 0}
					<span
						class="min-w-5 rounded-[20px] bg-(--accent) px-1.5 py-px text-center font-mono text-[11px] font-bold text-(--bg)"
						>{watchlist.count}</span
					>
				{/if}
			</a>
		</nav>

		<div>
			<label for="sidebar-search-input" class="sr-only">Search assets</label>
			<input
				id="sidebar-search-input"
				type="search"
				placeholder="Search assets…"
				class="w-full rounded-(--radius) border border-(--border) bg-(--bg-input) px-3 py-2.5 text-[13px] text-(--text) transition-colors placeholder:text-(--text-muted) focus:border-(--border-focus) focus:outline-none"
				bind:value={searchQuery}
				onkeydown={handleSearch}
				autocomplete="off"
			/>
		</div>
	</div>
</aside>
