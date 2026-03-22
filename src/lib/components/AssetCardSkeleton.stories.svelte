<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AssetCardSkeleton from './AssetCardSkeleton.svelte';

	const { Story } = defineMeta({
		title: 'Components/AssetCardSkeleton',
		component: AssetCardSkeleton,
		parameters: { layout: 'padded' }
	});
</script>

<Story name="Default" />

<Story name="Grid of 6">
	<div class="grid grid-cols-3 gap-4">
		{#each { length: 6 } as _, i (i)}
			<AssetCardSkeleton />
		{/each}
	</div>
</Story>