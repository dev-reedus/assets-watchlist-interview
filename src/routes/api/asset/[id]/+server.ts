import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ASSETS } from '$lib/data/assets';
import { convertAsset } from '$lib/utils/currencyConvert';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GET: RequestHandler = async ({ params, url }) => {
	const asset = ASSETS.find((a) => a.id === params.id);

	await sleep(2000);
	if (!asset) {
		error(404, { message: `Asset "${params.id}" not found.` });
	}

	const targetCurrency = url.searchParams.get('currency') ?? 'USD';
	return json({ data: convertAsset(asset, targetCurrency) });
};
