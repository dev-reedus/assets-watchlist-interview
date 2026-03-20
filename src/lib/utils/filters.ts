import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

export function setCategory(cat: string) {
	const params = new URLSearchParams(window.location.search);
	const urlCat = params.get('category');
	if (urlCat === cat || cat === 'all') {
		params.delete('category');
	} else {
		params.set('category', cat);
	}
	goto(resolve(`/?${params}`), { replaceState: true, keepFocus: true, noScroll: true });
}

export function setQuery(q: string) {
	const params = new URLSearchParams(window.location.search);
	if (q) {
		params.set('q', q);
	} else {
		params.delete('q');
	}
	goto(resolve(`/?${params}`), { replaceState: true, keepFocus: true, noScroll: true });
}
