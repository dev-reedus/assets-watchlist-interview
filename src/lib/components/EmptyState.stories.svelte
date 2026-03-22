<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import EmptyState from './EmptyState.svelte';

	const { Story } = defineMeta({
		title: 'Components/EmptyState',
		component: EmptyState,
		parameters: { layout: 'padded' }
	});
</script>

<Story name="Default" />

<Story
	name="No Search Results"
	args={{
		title: 'No results for "xrp"',
		message: 'Try a different search term or clear the filters.',
		action: { label: 'Clear Search', onclick: fn() }
	}}
/>

<Story
	name="No Assets in Category"
	args={{
		title: 'No assets found',
		message: 'No assets match the current filters.',
		action: { label: 'View All', onclick: fn() }
	}}
/>

<Story
	name="Watchlist Empty"
	args={{
		icon: '★',
		title: 'Your watchlist is empty',
		message: 'Star any asset to add it here.'
	}}
/>

<Story name="No Action" args={{ title: 'Nothing here', message: 'Check back later.' }} />