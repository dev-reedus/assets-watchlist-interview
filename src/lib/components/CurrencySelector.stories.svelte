<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
	import CurrencySelector from './CurrencySelector.svelte';

	const { Story } = defineMeta({
		title: 'Components/CurrencySelector',
		component: CurrencySelector,
		parameters: {
			layout: 'centered',
			sveltekit_experimental: {
				stores: {
					page: { url: new URL('http://localhost/') }
				}
			}
		}
	});
</script>

<Story
	name="Default (USD)"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox');
		await expect(select).toHaveValue('USD');
	}}
/>

<Story
	name="EUR Selected"
	parameters={{
		sveltekit_experimental: {
			state: { page: { url: new URL('http://localhost/?currency=EUR') } }
		}
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox');
		await expect(select).toHaveValue('EUR');
	}}
/>
