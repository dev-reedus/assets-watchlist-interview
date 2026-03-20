import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { AssetSummary, Category } from '$lib/types/asset';

export const load: PageLoad = async ({ fetch, url }) => {
	const q = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('category') ?? 'all';

	// since potentially this should be a fast fetch, we await it to render withing the page
	const categoriesRes = await fetch(`/api/category`);
	const categoriesPayload = await categoriesRes.json();

	const params = new URLSearchParams();

	if (q !== '') params.set('q', q);
	if (category !== 'all') params.set('category', category);

	// return a promise, to not block the page render, and render skeleton until promise is resolved
	const assetsPromise = fetch(`/api/asset?${params}`).then(async (res) => {
		if (!res.ok) error(res.status, 'Failed to load assets');
		const payload = await res.json();
		return {
			assets: payload.data as AssetSummary[],
			total: payload.total as number
		};
	});

	return {
		streamed: { assets: assetsPromise },
		categories: categoriesPayload.data as Category[],
		query: q,
		activeCategory: category
	};
};
