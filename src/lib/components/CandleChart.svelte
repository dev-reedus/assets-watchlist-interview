<script lang="ts">
	import { onMount, onDestroy, untrack } from 'svelte';
	import { page } from '$app/state';

	interface CandleData {
		time: number;
		open: number;
		high: number;
		low: number;
		close: number;
	}

	let { assetId }: { assetId: string } = $props();

	type Interval = '1D' | '1W' | '1M';

	let container: HTMLDivElement = $state() as HTMLDivElement;
	let chart: import('lightweight-charts').IChartApi | null = null;
	let candleSeries: import('lightweight-charts').ISeriesApi<'Candlestick'> | null = null;

	let activeInterval = $state<Interval>('1D');
	let loading = $state(true);
	let error = $state<string | null>(null);

	let currency = $derived(page.url.searchParams.get('currency') ?? 'USD');

	const INTERVALS: { label: string; value: Interval }[] = [
		{ label: '90D', value: '1D' },
		{ label: '52W', value: '1W' },
		{ label: '24M', value: '1M' }
	];

	// Theme colours matching the app's CSS variables
	const THEME = {
		bg: '#0e1220',
		bgElevated: '#131928',
		border: 'rgba(255, 255, 255, 0.07)',
		text: '#e8edf5',
		textMuted: '#5a6882',
		up: '#34d399',
		down: '#f87171',
		accent: '#63d2ff'
	};

	async function loadChart() {
		const { createChart, CandlestickSeries } = await import('lightweight-charts');

		chart = createChart(container, {
			width: container.clientWidth,
			height: 320,
			layout: {
				background: { color: THEME.bg },
				textColor: THEME.textMuted,
				fontFamily: "'IBM Plex Mono', monospace"
			},
			grid: {
				vertLines: { color: THEME.border },
				horzLines: { color: THEME.border }
			},
			crosshair: {
				vertLine: { color: THEME.accent, labelBackgroundColor: THEME.bgElevated },
				horzLine: { color: THEME.accent, labelBackgroundColor: THEME.bgElevated }
			},
			rightPriceScale: {
				borderColor: THEME.border,
				textColor: THEME.textMuted
			},
			timeScale: {
				borderColor: THEME.border,
				timeVisible: true,
				secondsVisible: false
			},
			handleScale: {
				axisPressedMouseMove: true
			}
		});

		candleSeries = chart.addSeries(CandlestickSeries, {
			upColor: THEME.up,
			downColor: THEME.down,
			borderUpColor: THEME.up,
			borderDownColor: THEME.down,
			wickUpColor: THEME.up,
			wickDownColor: THEME.down
		});

		await fetchAndUpdate(activeInterval);
		chart.timeScale().fitContent();
	}

	async function fetchAndUpdate(interval: Interval) {
		loading = true;
		error = null;
		try {
			const res = await fetch(
				`/api/asset/${assetId}/price-history?interval=${interval}&currency=${currency}`
			);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const { data }: { data: CandleData[] } = await res.json();
			candleSeries?.setData(
				data.map((c) => ({
					time: c.time as import('lightweight-charts').Time,
					open: c.open,
					high: c.high,
					low: c.low,
					close: c.close
				}))
			);
			chart?.timeScale().fitContent();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load chart data';
		} finally {
			loading = false;
		}
	}

	async function setInterval(interval: Interval) {
		activeInterval = interval;
		await fetchAndUpdate(interval);
	}

	// Re-fetch when currency changes (after initial mount)
	let mounted = false;

	$effect(() => {
		void currency; // track currency reactively
		if (mounted) untrack(() => fetchAndUpdate(activeInterval));
	});

	// Resize observer
	let resizeObserver: ResizeObserver | null = null;

	onMount(async () => {
		await loadChart();
		mounted = true;
		resizeObserver = new ResizeObserver(() => {
			chart?.applyOptions({ width: container.clientWidth });
		});
		resizeObserver.observe(container);
	});

	onDestroy(() => {
		resizeObserver?.disconnect();
		chart?.remove();
	});
</script>

<section class="card p-7" aria-labelledby="chart-heading">
	<div class="mb-5 flex items-center justify-between gap-3">
		<h2
			id="chart-heading"
			class="font-display text-[13px] font-bold tracking-[0.12em] text-(--text-muted) uppercase"
		>
			Price History
		</h2>

		<div class="flex gap-1" role="group" aria-label="Chart interval">
			{#each INTERVALS as { label, value }}
				<button
					class="rounded-md px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.04em] transition-all duration-150 {activeInterval ===
					value
						? 'bg-(--accent) text-(--bg) shadow-[0_0_10px_rgba(99,210,255,0.3)]'
						: 'text-(--text-muted) hover:bg-(--bg-elevated) hover:text-(--text)'}"
					onclick={() => setInterval(value)}
					aria-pressed={activeInterval === value}
					disabled={loading}
				>
					{label}
				</button>
			{/each}
		</div>
	</div>

	<div class="relative">
		{#if loading}
			<div
				class="absolute inset-0 z-10 flex items-center justify-center rounded-(--radius)"
				style="background: {THEME.bg};"
			>
				<div class="flex flex-col items-center gap-3">
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-(--border) border-t-(--accent)"
					></div>
					<span class="font-mono text-[12px] text-(--text-muted)">Loading chart…</span>
				</div>
			</div>
		{/if}

		{#if error}
			<div class="flex h-[320px] items-center justify-center">
				<p class="font-mono text-[13px] text-(--down)">{error}</p>
			</div>
		{:else}
			<div bind:this={container} class="w-full overflow-hidden rounded-(--radius)"></div>
		{/if}
	</div>
</section>
