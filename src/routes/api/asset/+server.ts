import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ASSETS } from '$lib/data/assets';
import type { AssetSummary } from '$lib/types/asset';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim().toLowerCase() ?? '';
	const category = url.searchParams.get('category')?.toLowerCase() ?? '';

	await sleep(2500);

	let results = ASSETS;

	if (q) {
		results = results.filter(
			(a) => a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
		);
	}

	if (category && category !== 'all') {
		results = results.filter((a) => a.category === category);
	}

	if(category === 'error') {
		throw new Error('Error on purpose');
	}

	const summaries: AssetSummary[] = results.map(
		({ id, symbol, name, price, change, changePercent, category, currency }) => ({
			id,
			symbol,
			name,
			price,
			change,
			changePercent,
			category,
			currency
		})
	);

	return json({
		data: summaries,
		total: summaries.length,
		query: q || undefined
	});
};
