import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ASSETS } from '$lib/data/assets';

export const GET: RequestHandler = ({ params }) => {
	const asset = ASSETS.find((a) => a.id === params.id);

	if (!asset) {
		error(404, { message: `Asset "${params.id}" not found.` });
	}

	return json({ data: asset });
};
