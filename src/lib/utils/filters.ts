import { updateSearchParams } from '$lib/utils/url';

export function setCategory(cat: string) {
	const params = new URLSearchParams(window.location.search);
	const urlCat = params.get('category');
	const next = urlCat === cat || cat === 'all' ? null : cat;
	updateSearchParams(new URL(window.location.href), { category: next });
}

export function setQuery(q: string) {
	updateSearchParams(new URL(window.location.href), { q: q || null });
}