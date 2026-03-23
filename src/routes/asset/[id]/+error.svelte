<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let id = $derived(page.params.id);
	let status = $derived(page.status);
	let is404 = $derived(status === 404);
	let heading = $derived(is404 ? 'Asset Not Found' : 'Something Went Wrong');
	let message = $derived(
		is404
			? `No asset matching "${id}" could be found.`
			: (page.error?.message ?? 'An unexpected error occurred. Please try again.')
	);
</script>

<svelte:head>
	<title>{heading} — Stonks-o-meter</title>
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
	<div
		class="bg-linear-to-br from-(--bg-elevated) to-(--bg-card) bg-clip-text font-mono text-[clamp(80px,15vw,140px)] leading-none font-semibold tracking-[-0.04em] select-none [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
		aria-hidden="true"
	>
		{status}
	</div>
	<h1 class="font-display -mt-4 text-[clamp(22px,4vw,32px)] font-extrabold text-(--text)">
		{heading}
	</h1>
	<p class="max-w-100 text-[15px] leading-relaxed text-(--text-dim)">
		{#if is404}
			No asset matching <span class="font-mono text-(--text)">{id}</span> could be found.
		{:else}
			{message}
		{/if}
	</p>
	<div class="mt-2">
		<a href={resolve('/')} class="btn btn-primary">← Back to Dashboard</a>
	</div>
</div>
