import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CATEGORIES } from '$lib/data/categories';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GET: RequestHandler = async () => {
	await sleep(200);

	return json({
		data: CATEGORIES
	});
};
