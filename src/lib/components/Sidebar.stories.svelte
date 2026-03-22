<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import { fn } from 'storybook/test';
	import Sidebar from './Sidebar.svelte';

	const { Story } = defineMeta({
		title: 'Components/Sidebar',
		component: Sidebar,
		args: { open: true, onClose: fn() },
		parameters: {
			layout: 'fullscreen',
			sveltekit_experimental: {
				stores: {
					page: { url: new URL('http://localhost/') }
				}
			}
		}
	});
</script>

<Story name="Open — Dashboard Active" />

<Story
	name="Open — Watchlist Active"
	parameters={{
		sveltekit_experimental: {
			state: { page: { url: new URL('http://localhost/?watchlist=1') } }
		}
	}}
/>

<Story name="Closed" args={{ open: false }} />

<Story
	name="Close Button"
	play={async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const btn = canvas.getByRole('button', { name: /close sidebar/i });
		await userEvent.click(btn);
		await expect(args.onClose).toHaveBeenCalledOnce();
	}}
/>