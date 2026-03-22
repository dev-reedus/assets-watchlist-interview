<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
	import CandleChart from './CandleChart.svelte';

	function mockCandles(count: number, basePrice = 68000) {
		const now = Math.floor(Date.now() / 1000);
		const step = 86400;
		let price = basePrice;
		let seed = 1013904223;
		return Array.from({ length: count }, (_, i) => {
			seed = (seed * 1664525 + 1013904223) >>> 0;
			const open = price;
			const change = (seed / 0xffffffff - 0.5) * 0.03;
			const close = parseFloat((price * (1 + change)).toFixed(2));
			const wick = (seed % 100) / 10000;
			const high = parseFloat((Math.max(open, close) * (1 + wick)).toFixed(2));
			const low = parseFloat((Math.min(open, close) * (1 - wick)).toFixed(2));
			price = close;
			return { time: now - (count - 1 - i) * step, open, high, low, close };
		});
	}

	function makeFetchMock(candles: ReturnType<typeof mockCandles>): typeof fetch {
		return async () =>
			new Response(JSON.stringify({ data: candles }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
	}

	const errorFetch: typeof fetch = async () => new Response(null, { status: 500 });

	const { Story } = defineMeta({
		title: 'Components/CandleChart',
		component: CandleChart,
		args: { assetId: 'btc' },
		parameters: {
			layout: 'padded',
			sveltekit_experimental: {
				state: { page: { url: new URL('http://localhost/asset/btc') } }
			}
		}
	});
</script>

<Story
	name="Loaded — 90D"
	loaders={[
		async () => {
			window.fetch = makeFetchMock(mockCandles(90));
			return {};
		}
	]}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('Price History')).toBeInTheDocument();
	}}
/>

<Story
	name="Loaded — EUR"
	loaders={[
		async () => {
			window.fetch = makeFetchMock(mockCandles(90, 62000));
			return {};
		}
	]}
	parameters={{
		sveltekit_experimental: {
			state: { page: { url: new URL('http://localhost/asset/btc?currency=EUR') } }
		}
	}}
/>

<Story
	name="Error State"
	parameters={{
		sveltekit_experimental: {
			state: { page: { url: new URL('http://localhost/asset/btc?currency=EUR') } }
		}
	}}
	loaders={[
		async () => {
			window.fetch = errorFetch;
			return {};
		}
	]}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(await canvas.findByText(/HTTP 500/i)).toBeInTheDocument();
	}}
/>
