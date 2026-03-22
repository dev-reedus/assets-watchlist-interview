<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import { fn } from 'storybook/test';
	import AssetCard from './AssetCard.svelte';
	import type { AssetSummary, Category } from '$lib/types/asset';

	const mockCategories: Category[] = [
		{ id: 'crypto', label: 'Crypto', count: 5, icon: '₿' },
		{ id: 'stock', label: 'Stocks', count: 10, icon: '📈' },
		{ id: 'etf', label: 'ETF', count: 3, icon: '🏦' },
		{ id: 'commodity', label: 'Commodities', count: 2, icon: '🪙' }
	];

	const btc: AssetSummary = {
		id: 'btc', symbol: 'BTC', name: 'Bitcoin',
		price: 68420.5, change: 1823.4, changePercent: 2.74,
		category: 'crypto', currency: 'USD'
	};

	const eth: AssetSummary = {
		id: 'eth', symbol: 'ETH', name: 'Ethereum',
		price: 3512.8, change: -87.2, changePercent: -2.42,
		category: 'crypto', currency: 'USD'
	};

	const aapl: AssetSummary = {
		id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.',
		price: 189.3, change: 2.1, changePercent: 1.12,
		category: 'stock', currency: 'USD'
	};

	const longName: AssetSummary = {
		id: 'test', symbol: 'TST', name: 'This Is A Very Long Asset Name That Should Truncate',
		price: 1.23, change: 0.01, changePercent: 0.82,
		category: 'etf', currency: 'USD'
	};

	const { Story } = defineMeta({
		title: 'Components/AssetCard',
		component: AssetCard,
		args: { categories: mockCategories },
		parameters: { layout: 'padded' }
	});
</script>

<Story name="Positive Change" args={{ asset: btc }} />

<Story name="Negative Change" args={{ asset: eth }} />

<Story name="Stock" args={{ asset: aapl }} />

<Story name="Long Name Truncation" args={{ asset: longName }} />

<Story
	name="Toggle Watchlist"
	args={{ asset: btc }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const btn = canvas.getByRole('button', { name: /add bitcoin to watchlist/i });
		await expect(btn).toHaveAttribute('aria-pressed', 'false');
		await userEvent.click(btn);
		await expect(btn).toHaveAttribute('aria-pressed', 'true');
		await userEvent.click(btn);
		await expect(btn).toHaveAttribute('aria-pressed', 'false');
	}}
/>