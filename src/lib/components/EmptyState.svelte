<script lang="ts">
	interface Props {
		title?: string;
		message?: string;
		icon?: string;
		action?: { label: string; href?: string; onclick?: () => void };
	}

	let {
		title = 'No results found',
		message = 'Try adjusting your search or filters.',
		icon = '◧',
		action
	}: Props = $props();
</script>

<div
	class="flex min-h-75 flex-col items-center justify-center gap-3 px-6 py-20 text-center"
	role="status"
	aria-live="polite"
>
	<span class="mb-2 block text-[48px] text-(--text-muted) opacity-40" aria-hidden="true"
		>{icon}</span
	>
	<h2 class="font-mono text-[24px] font-bold tracking-[0.02em] text-(--text)">{title}</h2>
	<p class="max-w-xs text-[14px] leading-relaxed text-(--text-muted)">{message}</p>
	{#if action}
		{#if action.href}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={action.href} class="btn btn-ghost">{action.label}</a>
		{:else}
			<button class="btn btn-ghost" onclick={action.onclick}>{action.label}</button>
		{/if}
	{/if}
</div>
