<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { watchlist } from '$lib/stores/watchlist.svelte';
	import logo from '$lib/assets/logo.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import CurrencySelector from '$lib/components/CurrencySelector.svelte';
	import { resolve } from '$app/paths';
	import { navigating } from '$app/state';

	let { children } = $props();

	let sidebarOpen = $state(false);

	let isDashboardActive = $derived(
		page.url.pathname === '/' && !page.url.searchParams.has('watchlist')
	);

	let isWatchlistActive = $derived(page.url.searchParams.has('watchlist'));

	let isPageChanging = $derived(
		navigating.to !== null && navigating.from?.url.pathname !== navigating.to?.url.pathname
	);

	// Close sidebar on route change
	$effect(() => {
		void page.url.pathname;
		sidebarOpen = false;
	});
</script>

<div class="flex min-h-screen flex-col">
	<!-- Header -->
	<header
		class="sticky top-0 z-100 h-16 border-b border-(--border) bg-[#080b12]/90 backdrop-blur-lg"
	>
		<div class="mx-auto flex h-full max-w-350 items-center justify-between gap-6 px-6">
			<div class="flex items-center gap-4">
				<!-- Hamburger -->
				<button
					class="flex flex-col gap-1.25 rounded-(--radius) border-0 bg-transparent p-1.5 transition-colors hover:bg-(--bg-elevated) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
					aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
					aria-expanded={sidebarOpen}
					onclick={() => (sidebarOpen = !sidebarOpen)}
				>
					<span class="bar" class:open={sidebarOpen}></span>
					<span class="bar" class:open={sidebarOpen}></span>
					<span class="bar" class:open={sidebarOpen}></span>
				</button>

				<!-- Logo -->
				<a
					href={resolve('/')}
					class="group font-display flex items-center gap-2 text-xl font-extrabold tracking-widest text-(--text) focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--accent)"
					aria-label="Asset Watchlist home"
				>
					<span
						class="text-[22px] text-(--accent) group-hover:[text-shadow:0_0_16px_var(--accent)]"
						aria-hidden="true"><img src={logo} alt="" class="h-8.5 w-auto" /></span
					>
					<span>Stonks-o-meter </span>
				</a>
			</div>

			<!-- Header Nav (hidden on mobile) -->
			<nav class="hidden items-center gap-1 md:flex" aria-label="Main navigation">
				<a
					href={resolve('/')}
					class="font-display flex items-center gap-1.5 rounded-(--radius) px-4 py-1.5 text-[13px] font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-(--bg-elevated) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) {isDashboardActive
						? 'bg-(--bg-elevated) text-(--accent)'
						: 'text-(--text-dim) hover:text-(--text)'}"
				>
					Dashboard
				</a>
				<a
					href={resolve('/?watchlist=1')}
					class="font-display flex items-center gap-1.5 rounded-(--radius) px-4 py-1.5 text-[13px] font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-(--bg-elevated) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) {isWatchlistActive
						? 'bg-(--bg-elevated) text-(--accent)'
						: 'text-(--text-dim) hover:text-(--text)'}"
				>
					Watchlist
					{#if watchlist.count > 0}
						<span
							class="min-w-5 rounded-[20px] bg-(--accent) px-1.5 py-px text-center font-mono text-[11px] font-bold text-(--bg)"
							aria-label="{watchlist.count} assets in watchlist">{watchlist.count}</span
						>
					{/if}
				</a>
				<span class="mx-1 h-4 w-px bg-(--border)" aria-hidden="true"></span>
				<CurrencySelector />
			</nav>
		</div>
	</header>

	<!-- Sidebar -->
	<Sidebar open={sidebarOpen} onClose={() => (sidebarOpen = false)} />

	<!-- Navigation progress bar -->
	{#if navigating.to}
		<div
			class="nav-progress"
			role="progressbar"
			aria-label="Page loading"
			aria-valuemin={0}
			aria-valuemax={100}
		></div>
	{/if}

	{#if isPageChanging}
		<div class="nav-backdrop" aria-hidden="true"></div>
	{/if}

	<!-- Main content -->
	<main class="flex flex-1 justify-center focus:outline-none" id="main-content" tabindex="-1">
		<div class="w-full max-w-350 px-5 pt-4 pb-12">
			{@render children()}
		</div>
	</main>

	<!-- Footer -->
	<footer
		class="flex flex-col gap-1 border-t border-(--border) px-6 py-6 text-center text-xs text-(--text-muted)"
	>
		<div>
			<span class=" mx-auto" aria-hidden="true"
				><img src={logo} alt="" class="inline h-4 w-auto" />
			</span>
			Stonks-o-meter · Assets Watchlist · Demo Application
		</div>
		<p class="opacity-50">All prices are simulated and for demonstration purposes only.</p>
	</footer>
</div>
