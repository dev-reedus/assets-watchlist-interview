<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import { fn } from 'storybook/test';
	import SearchBar from './SearchBar.svelte';

	const { Story } = defineMeta({
		title: 'Components/SearchBar',
		component: SearchBar,
		args: { onSearch: fn() },
		parameters: { layout: 'padded' }
	});
</script>

<Story name="Empty" />

<Story name="With Value" args={{ value: 'Bitcoin' }} />

<Story name="Loading" args={{ value: 'Bit', loading: true }} />

<Story name="Custom Placeholder" args={{ placeholder: 'Search by ticker…' }} />

<Story
	name="Type and Clear"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('searchbox');
		await userEvent.type(input, 'Bitcoin');
		await expect(input).toHaveValue('Bitcoin');
		const clear = canvas.getByRole('button', { name: /clear search/i });
		await userEvent.click(clear);
		await expect(input).toHaveValue('');
	}}
/>

<Story
	name="Escape Clears"
	args={{ value: 'Ethereum' }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('searchbox');
		await input.focus();
		await userEvent.keyboard('{Escape}');
		await expect(input).toHaveValue('');
	}}
/>