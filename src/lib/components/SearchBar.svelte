<script lang="ts">
	interface Props {
		value?: string;
		loading?: boolean;
		onSearch: (query: string) => void;
		debounceMs?: number;
		placeholder?: string;
	}

	let {
		value = $bindable(''),
		loading = false,
		onSearch,
		debounceMs = 350,
		placeholder = 'Search by name or symbol…'
	}: Props = $props();

	let debounceTimer: ReturnType<typeof setTimeout>;

	function handleInput(e: Event) {
		const q = (e.target as HTMLInputElement).value;
		value = q;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			onSearch(q.trim());
		}, debounceMs);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			value = '';
			onSearch('');
		}
	}
</script>

<div class="relative flex w-full max-w-120 items-center" role="search">
	<label for="asset-search" class="sr-only">Search assets</label>
	<span
		class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[20px] leading-none text-(--text-muted)"
		aria-hidden="true">⌕</span
	>
	<input
		id="asset-search"
		type="search"
		{placeholder}
		bind:value
		oninput={handleInput}
		onkeydown={handleKeydown}
		autocomplete="off"
		spellcheck="false"
		aria-label="Search assets"
		class="w-full appearance-none rounded-(--radius) border border-(--border) bg-(--bg-input) py-2.75 pr-10 pl-10.5 text-[14px] text-(--text) transition-[border-color,box-shadow] placeholder:text-(--text-muted) focus:border-(--border-focus) focus:shadow-[0_0_0_3px_rgba(99,210,255,0.08)] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
	/>
	{#if loading}
		<span
			class="absolute right-3 flex items-center justify-center"
			aria-label="Searching…"
			role="status"
		>
			<span
				class="h-4 w-4 animate-[spin_600ms_linear_infinite] rounded-full border-2 border-(--border) border-t-(--accent)"
			></span>
		</span>
	{:else if value}
		<button
			class="absolute right-3 flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-1 text-[13px] text-(--text-muted) transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-(--accent)"
			onclick={() => {
				value = '';
				onSearch('');
			}}
			aria-label="Clear search"
			type="button">✕</button
		>
	{/if}
</div>
