<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import WatchlistToggleButton from './WatchlistToggleButton.svelte';

	const { Story } = defineMeta({
		title: 'Components/WatchlistToggleButton',
		component: WatchlistToggleButton,
		args: { assetId: 'btc', assetName: 'Bitcoin' },
		parameters: { layout: 'centered' }
	});
</script>

<Story name="Default (Not in Watchlist)" />

<Story name="Small Size" args={{ size: 'sm' }} />

<Story
	name="Toggle On and Off"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const btn = canvas.getByRole('button');
		await expect(btn).toHaveAttribute('aria-pressed', 'false');
		await userEvent.click(btn);
		await expect(btn).toHaveAttribute('aria-pressed', 'true');
		await userEvent.click(btn);
		await expect(btn).toHaveAttribute('aria-pressed', 'false');
	}}
/>
