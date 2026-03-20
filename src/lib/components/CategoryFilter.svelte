<script lang="ts">
	import type { Category } from '$lib/types/asset';

	interface Props {
		categories: Category[];
		active: string;
		onSelect: (id: string) => void;
	}

	let { categories, active, onSelect }: Props = $props();
</script>

<div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
	<button
		class="font-display inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-(--border) px-3.5 py-1.75 text-[12px] font-semibold tracking-[0.05em] uppercase transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) {active ===
		'all'
			? 'border-(--accent) bg-(--accent) text-(--bg)'
			: 'bg-transparent text-(--text-dim) hover:border-[rgba(255,255,255,0.15)] hover:bg-(--bg-elevated) hover:text-(--text)'}"
		onclick={() => onSelect('all')}
		aria-pressed={active === 'all'}
	>
		All
	</button>
	{#each categories as cat (cat.id)}
		<button
			class="font-display inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-(--border) px-3.5 py-1.75 text-[12px] font-semibold tracking-[0.05em] uppercase transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) {active ===
			cat.id
				? 'border-(--accent) bg-(--accent) text-(--bg)'
				: 'bg-transparent text-(--text-dim) hover:border-[rgba(255,255,255,0.15)] hover:bg-(--bg-elevated) hover:text-(--text)'}"
			onclick={() => onSelect(cat.id)}
			aria-pressed={active === cat.id}
		>
			<span aria-hidden="true">{cat.icon}</span>
			{cat.label}
			<span
				class="rounded-full px-1.5 font-mono text-[10px] {active === cat.id
					? 'bg-[rgba(0,0,0,0.25)] text-(--bg)'
					: 'bg-[rgba(0,0,0,0.2)]'}"
				aria-label="{cat.count} assets">{cat.count}</span
			>
		</button>
	{/each}
</div>
