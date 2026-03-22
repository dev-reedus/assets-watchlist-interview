import { describe, it, expect, vi } from 'vitest';
import { load } from './+page';
import type { Category, AssetSummary } from '$lib/types/asset';

vi.mock('$app/environment', () => ({ browser: false }));

const mockCategories: Category[] = [
	{ id: 'crypto', label: 'Crypto', count: 5, icon: '₿' },
	{ id: 'stock', label: 'Stocks', count: 10, icon: '📈' }
];

const mockAssets: AssetSummary[] = [
	{ id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 68420.5, change: 1823.4, changePercent: 2.74, category: 'crypto', currency: 'USD' },
	{ id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 3512.8, change: -87.2, changePercent: -2.42, category: 'crypto', currency: 'USD' }
];

function makeFetch({ assetOk = true, assetStatus = 200 } = {}) {
	return vi.fn().mockImplementation((url: string) => {
		if (url.includes('/api/category')) {
			return Promise.resolve({ json: () => ({ data: mockCategories }) });
		}
		return Promise.resolve({
			ok: assetOk,
			status: assetStatus,
			json: () => ({ data: mockAssets, total: mockAssets.length })
		});
	});
}

function makeEvent(url: URL, fetch: ReturnType<typeof makeFetch>) {
	return { fetch, url } as unknown as Parameters<typeof load>[0];
}

function assetApiCall(fetch: ReturnType<typeof makeFetch>) {
	return fetch.mock.calls.find((call) => String(call[0]).includes('/api/asset'));
}

describe('load (+page)', () => {
	it('returns categories, query, and activeCategory', async () => {
		const url = new URL('http://localhost/');
		const result = await load(makeEvent(url, makeFetch()));

		expect(result!.categories).toEqual(mockCategories);
		expect(result!.query).toBe('');
		expect(result!.activeCategory).toBe('all');
	});

	it('resolves streamed assets with data and total', async () => {
		const url = new URL('http://localhost/');
		const result = await load(makeEvent(url, makeFetch()));
		const streamed = await result!.streamed.assets;

		expect(streamed.assets).toEqual(mockAssets);
		expect(streamed.total).toBe(2);
	});

	it('forwards the q param to the assets API', async () => {
		const fetch = makeFetch();
		await load(makeEvent(new URL('http://localhost/?q=bitcoin'), fetch));

		expect(assetApiCall(fetch)![0]).toContain('q=bitcoin');
	});

	it('forwards the category param to the assets API', async () => {
		const fetch = makeFetch();
		await load(makeEvent(new URL('http://localhost/?category=crypto'), fetch));

		expect(assetApiCall(fetch)![0]).toContain('category=crypto');
	});

	it('omits q from the API call when not set', async () => {
		const fetch = makeFetch();
		await load(makeEvent(new URL('http://localhost/'), fetch));

		expect(assetApiCall(fetch)![0]).not.toContain('q=');
	});

	it('omits category from the API call when set to all', async () => {
		const fetch = makeFetch();
		await load(makeEvent(new URL('http://localhost/?category=all'), fetch));

		expect(assetApiCall(fetch)![0]).not.toContain('category=');
	});

	it('exposes query and activeCategory from URL params', async () => {
		const url = new URL('http://localhost/?q=eth&category=crypto');
		const result = await load(makeEvent(url, makeFetch()));

		expect(result!.query).toBe('eth');
		expect(result!.activeCategory).toBe('crypto');
	});

	it('rejects streamed.assets when the response is not ok', async () => {
		const url = new URL('http://localhost/');
		const result = await load(makeEvent(url, makeFetch({ assetOk: false, assetStatus: 503 })));

		await expect(result!.streamed.assets).rejects.toMatchObject({ status: 503 });
	});

	it('forwards the currency param to the assets API', async () => {
		const fetch = makeFetch();
		await load(makeEvent(new URL('http://localhost/?currency=EUR'), fetch));

		expect(assetApiCall(fetch)![0]).toContain('currency=EUR');
	});
});
