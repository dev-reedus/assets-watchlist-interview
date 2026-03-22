import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Asset, Category } from '$lib/types/asset';

export const load: PageLoad = async ({ fetch, params, url }) => {
	const targetCurrency = url.searchParams.get('currency') ?? 'USD';

	const [assetRes, categoriesRes] = await Promise.all([
		fetch(`/api/asset/${params.id}?currency=${targetCurrency}`),
		fetch(`/api/category`)
	]);

	if (assetRes.status === 404) {
		error(404, { message: `Asset "${params.id}" not found.` });
	}

	if (!assetRes.ok) {
		error(assetRes.status, 'Failed to load asset details.');
	}

	const [assetPayload, categoriesPayload] = await Promise.all([
		assetRes.json(),
		categoriesRes.json()
	]);

	return {
		asset: assetPayload.data as Asset,
		categories: categoriesPayload.data as Category[]
	};
};