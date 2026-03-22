<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import { fn } from 'storybook/test';
	import ErrorBanner from './ErrorBanner.svelte';

	const { Story } = defineMeta({
		title: 'Components/ErrorBanner',
		component: ErrorBanner,
		parameters: { layout: 'padded' }
	});
</script>

<Story name="Default" />

<Story name="Custom Message" args={{ message: 'Failed to load assets. The server returned an error.' }} />

<Story name="With Retry" args={{ message: 'Failed to load assets.', onRetry: fn() }} />

<Story
	name="Retry Interaction"
	args={{ message: 'Something went wrong.', onRetry: fn() }}
	play={async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const btn = canvas.getByRole('button', { name: /retry/i });
		await userEvent.click(btn);
		await expect(args.onRetry).toHaveBeenCalledOnce();
	}}
/>