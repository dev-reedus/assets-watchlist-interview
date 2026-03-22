import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from './+server';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

async function callGet(search = '') {
	const url = new URL(`http://localhost/api/asset${search}`);
	const promise = GET({ url } as Parameters<typeof GET>[0]);
	await vi.runAllTimersAsync();
	return promise;
}

describe('GET /api/asset', () => {
	it('returns all assets with a total count', async () => {
		const res = await callGet();
		const body = await res.json();
		expect(body.data.length).toBeGreaterThan(0);
		expect(body.total).toBe(body.data.length);
	});

	it('filters by search query (name)', async () => {
		const res = await callGet('?q=bitcoin');
		const body = await res.json();
		expect(body.data.length).toBeGreaterThan(0);
		expect(
			body.data.every(
				(a: { name: string; symbol: string }) =>
					a.name.toLowerCase().includes('bitcoin') || a.symbol.toLowerCase().includes('bitcoin')
			)
		).toBe(true);
	});

	it('filters by category', async () => {
		const res = await callGet('?category=crypto');
		const body = await res.json();
		expect(body.data.length).toBeGreaterThan(0);
		expect(body.data.every((a: { category: string }) => a.category === 'crypto')).toBe(true);
	});

	it('returns empty array when query matches nothing', async () => {
		const res = await callGet('?q=xyznonexistent999');
		const body = await res.json();
		expect(body.data).toEqual([]);
		expect(body.total).toBe(0);
	});

	it('reflects the query in the response', async () => {
		const res = await callGet('?q=bitcoin');
		const body = await res.json();
		expect(body.query).toBe('bitcoin');
	});

	it('omits query from response when not provided', async () => {
		const res = await callGet();
		const body = await res.json();
		expect(body.query).toBeUndefined();
	});

	it('converts prices to the target currency', async () => {
		const [usdRes, eurRes] = await Promise.all([callGet('?q=bitcoin'), callGet('?q=bitcoin&currency=EUR')]);
		const usd = (await usdRes.json()).data[0];
		const eur = (await eurRes.json()).data[0];
		expect(eur.price).toBeCloseTo(usd.price * 0.92);
		expect(eur.currency).toBe('EUR');
	});

	it('throws on the reserved error category', async () => {
		await expect(callGet('?category=error')).rejects.toMatchObject({ status: 500 });
	});
});