<script lang="ts">
	interface Props {
		message?: string;
		onRetry?: () => void;
	}

	let { message = 'Something went wrong. Please try again.', onRetry }: Props = $props();
</script>

<div
	class="flex items-center gap-4 rounded-lg border border-[rgba(248,113,113,0.2)] bg-[rgba(248,113,113,0.06)] px-5 py-4 text-(--text)"
	role="alert"
	aria-live="assertive"
>
	<span class="shrink-0 text-[34px] text-(--down)" aria-hidden="true">⚠</span>
	<div class="min-w-0 flex-1">
		<strong
			class="font-display mb-0.5 block text-[16px] font-bold tracking-[0.08em] text-(--down) uppercase"
			>Error</strong
		>
		<p class="text-[14px] text-(--text-dim)">{message}</p>
	</div>
	{#if onRetry}
		<button
			class="font-display inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-(--radius) border border-[rgba(248,113,113,0.3)] bg-transparent px-3 py-1.5 text-[14px] font-bold tracking-[0.06em] text-(--down) uppercase transition-all hover:border-(--down) hover:bg-[rgba(248,113,113,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
			onclick={onRetry}
		>
			↺ Retry
		</button>
	{/if}
</div>
