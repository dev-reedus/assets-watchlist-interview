import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import type { AssetSummary, Category } from '$lib/types/asset';

// Only lives on the client, server doesn't have race condition problem
let controller: AbortController | null = null;

export const load: PageLoad = async ({ fetch, url }) => {
	const q = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('category') ?? 'all';
	const selectedCurrency = url.searchParams.get('currency') ?? 'USD';

	const params = new URLSearchParams();
	if (q !== '') params.set('q', q);
	if (category !== 'all') params.set('category', category);
	params.set('currency', selectedCurrency);

	// Cancel previous in-flight assets stream on rapid navigation
	let signal: AbortSignal | undefined;
	// handle race condition/abort only on client side
	if (browser) {
		if (controller) controller.abort();
		controller = new AbortController();
		signal = controller.signal;
	}

	// start both fetch in parallel
	const categoriesPromise = fetch('/api/category').then((res) => res.json());
	const assetsPromise = fetch(`/api/asset?${params}`, { signal })
		.then(async (res) => {
			if (!res.ok) error(res.status, 'Failed to load assets');
			const payload = await res.json();
			return {
				assets: payload.data as AssetSummary[],
				total: payload.total as number
			};
		})
		.catch((err: unknown) => {
			if ((err as Error).name === 'AbortError') return new Promise<never>(() => {});
			throw err;
		});

	// since potentially this should be a fast fetch, we await it to render withing the page
	const categoriesPayload = await categoriesPromise;

	return {
		streamed: { assets: assetsPromise },
		categories: categoriesPayload.data as Category[],
		query: q,
		activeCategory: category
	};
};
