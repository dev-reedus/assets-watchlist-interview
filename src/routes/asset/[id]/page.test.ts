import { describe, it, expect, vi } from 'vitest';
import { load } from './+page';
import type { Asset, Category } from '$lib/types/asset';

const mockAsset: Asset = {
	id: 'btc',
	symbol: 'BTC',
	name: 'Bitcoin',
	price: 68420.5,
	change: 1823.4,
	changePercent: 2.74,
	category: 'crypto',
	currency: 'USD',
	description: 'Bitcoin is the first decentralized cryptocurrency.',
	marketCap: 1_340_000_000_000,
	volume: 28_500_000_000,
	high24h: 69_100,
	low24h: 66_200
};

const mockCategories: Category[] = [
	{ id: 'crypto', label: 'Crypto', count: 5, icon: '₿' },
	{ id: 'stock', label: 'Stocks', count: 10, icon: '📈' }
];

function makeFetch({ assetStatus = 200 } = {}) {
	return vi.fn().mockImplementation((url: string) => {
		if (url.includes('/api/category')) {
			return Promise.resolve({ ok: true, status: 200, json: () => ({ data: mockCategories }) });
		}
		return Promise.resolve({
			ok: assetStatus === 200,
			status: assetStatus,
			json: () => (assetStatus === 200 ? { data: mockAsset } : {})
		});
	});
}

function makeEvent(url: URL, fetch: ReturnType<typeof makeFetch>, params = { id: 'btc' }) {
	return { fetch, params, url } as unknown as Parameters<typeof load>[0];
}

function assetApiCall(fetch: ReturnType<typeof makeFetch>) {
	return fetch.mock.calls.find((call) => String(call[0]).includes('/api/asset/'));
}

describe('load (asset/[id]/+page)', () => {
	it('returns asset and categories', async () => {
		const result = await load(makeEvent(new URL('http://localhost/asset/btc'), makeFetch()));

		expect(result!.asset).toEqual(mockAsset);
		expect(result!.categories).toEqual(mockCategories);
	});

	it('fetches asset and categories in parallel', async () => {
		const fetch = makeFetch();
		await load(makeEvent(new URL('http://localhost/asset/btc'), fetch));

		expect(fetch).toHaveBeenCalledTimes(2);
	});

	it('throws 404 when the asset does not exist', async () => {
		await expect(
			load(makeEvent(new URL('http://localhost/asset/unknown'), makeFetch({ assetStatus: 404 }), { id: 'unknown' }))
		).rejects.toMatchObject({ status: 404 });
	});

	it('throws on non-404 server errors', async () => {
		await expect(
			load(makeEvent(new URL('http://localhost/asset/btc'), makeFetch({ assetStatus: 503 })))
		).rejects.toMatchObject({ status: 503 });
	});

	it('forwards the currency param to the asset API', async () => {
		const fetch = makeFetch();
		await load(makeEvent(new URL('http://localhost/asset/btc?currency=EUR'), fetch));

		expect(assetApiCall(fetch)![0]).toContain('currency=EUR');
	});

	it('uses USD as the default currency', async () => {
		const fetch = makeFetch();
		await load(makeEvent(new URL('http://localhost/asset/btc'), fetch));

		expect(assetApiCall(fetch)![0]).toContain('currency=USD');
	});

	it('includes the asset id in the API request', async () => {
		const fetch = makeFetch();
		await load(makeEvent(new URL('http://localhost/asset/eth'), fetch, { id: 'eth' }));

		expect(assetApiCall(fetch)![0]).toContain('/api/asset/eth');
	});
});