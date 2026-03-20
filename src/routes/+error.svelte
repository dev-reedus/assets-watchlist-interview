<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} — Stonks-o-meter</title>
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
	<div
		class="bg-linear-to-br from-(--bg-elevated) to-(--bg-card) bg-clip-text font-mono text-[clamp(80px,15vw,140px)] leading-none font-semibold tracking-[-0.04em] select-none [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
		aria-hidden="true"
	>
		{page.status}
	</div>
	<h1 class="font-display -mt-4 text-[clamp(22px,4vw,32px)] font-extrabold text-(--text)">
		{#if page.status === 404}
			{#if page.error?.message?.startsWith('ASSET_NOT_FOUND')}
				Asset Not Found
			{:else}
				Page Not Found
			{/if}
		{:else}
			Something Went Wrong
		{/if}
	</h1>
	<p class="max-w-100 text-[15px] leading-relaxed text-(--text-dim)">
		{page.error?.message ?? 'An unexpected error occurred.'}
	</p>
	<div class="mt-2">
		<a href="/" class="btn btn-primary">← Back to Dashboard</a>
	</div>
</div>
