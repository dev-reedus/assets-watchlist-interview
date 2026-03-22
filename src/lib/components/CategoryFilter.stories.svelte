<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import { fn } from 'storybook/test';
	import CategoryFilter from './CategoryFilter.svelte';
	import type { Category } from '$lib/types/asset';

	const mockCategories: Category[] = [
		{ id: 'crypto', label: 'Crypto', count: 5, icon: '₿' },
		{ id: 'stock', label: 'Stocks', count: 10, icon: '📈' },
		{ id: 'etf', label: 'ETF', count: 3, icon: '🏦' },
		{ id: 'commodity', label: 'Commodities', count: 2, icon: '🪙' }
	];

	const { Story } = defineMeta({
		title: 'Components/CategoryFilter',
		component: CategoryFilter,
		args: { categories: mockCategories, onSelect: fn() },
		parameters: { layout: 'padded' }
	});
</script>

<Story name="All Active" args={{ active: 'all' }} />

<Story name="Category Active" args={{ active: 'crypto' }} />

<Story
	name="Select Category"
	args={{ active: 'all' }}
	play={async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const cryptoBtn = canvas.getByRole('button', { name: /crypto/i });
		await expect(cryptoBtn).toHaveAttribute('aria-pressed', 'false');
		await userEvent.click(cryptoBtn);
		await expect(args.onSelect).toHaveBeenCalledWith('crypto');
	}}
/>