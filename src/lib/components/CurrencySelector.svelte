<script lang="ts">
	import { page } from '$app/state';
	import { currency } from '$lib/stores/currency.svelte';
	import { updateSearchParams } from '$lib/utils/url';

	let selected = $derived(page.url.searchParams.get('currency') ?? 'USD');

	function onCurrencyChange(e: Event) {
		updateSearchParams(new URL(window.location.href), {
			currency: (e.target as HTMLSelectElement).value
		});
	}
</script>

<div class="flex items-center gap-1.5">
	<label
		for="currency-select"
		class="font-display sr-only text-[11px] font-bold tracking-widest text-(--text-muted) uppercase"
		>Currency</label
	>
	<select
		id="currency-select"
		class="font-display block cursor-pointer rounded-(--radius) border border-(--border) bg-(--bg-elevated) px-2.5 py-1.5 pr-7 text-[12px] font-semibold tracking-[0.05em] text-(--text-dim) uppercase transition-colors hover:border-(--border-focus) hover:text-(--text) focus:border-(--border-focus) focus:outline-none"
		onchange={onCurrencyChange}
		aria-label="Select display currency"
	>
		{#each currency.supported as code (code)}
			<option value={code} selected={code === selected}>{code}</option>
		{/each}
	</select>
</div>
