<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let id = $derived(page.params.id);
</script>

<svelte:head>
	<title>Asset Not Found — Stonks-o-meter</title>
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
	<div
		class="bg-linear-to-br from-(--bg-elevated) to-(--bg-card) bg-clip-text font-mono text-[clamp(80px,15vw,140px)] leading-none font-semibold tracking-[-0.04em] select-none [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
		aria-hidden="true"
	>
		404
	</div>
	<h1 class="font-display -mt-4 text-[clamp(22px,4vw,32px)] font-extrabold text-(--text)">
		Asset Not Found
	</h1>
	<p class="max-w-100 text-[15px] leading-relaxed text-(--text-dim)">
		No asset matching <span class="font-mono text-(--text)">{id}</span> could be found.
	</p>
	<div class="mt-2">
		<a href={resolve('/')} class="btn btn-primary">← Back to Dashboard</a>
	</div>
</div>
