import { goto } from '$app/navigation';

export function updateSearchParams(
	url: URL,
	updates: Record<string, string | null>,
	opts = { replaceState: true, keepFocus: true, noScroll: true }
) {
	const next = new URL(url);

	for (const [key, value] of Object.entries(updates)) {
		if (value == null) {
			next.searchParams.delete(key);
		} else {
			next.searchParams.set(key, value);
		}
	}

	// eslint-disable-next-line svelte/no-navigation-without-resolve
	goto(next.pathname + next.search, opts);
}
