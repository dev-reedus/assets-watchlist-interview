import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from './+server';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

async function callGet(id: string, search = '') {
	const url = new URL(`http://localhost/api/asset/${id}${search}`);
	const promise = GET({ params: { id }, url } as Parameters<typeof GET>[0]);
	await vi.runAllTimersAsync();
	return promise;
}

describe('GET /api/asset/[id]', () => {
	it('returns asset data for a valid id', async () => {
		const res = await callGet('btc');
		const body = await res.json();
		expect(body.data.id).toBe('btc');
		expect(body.data.symbol).toBe('BTC');
		expect(body.data.name).toBe('Bitcoin');
	});

	it('throws 404 for an unknown id', async () => {
		await expect(callGet('unknown-asset')).rejects.toMatchObject({ status: 404 });
	});

	it('includes the asset id in the 404 message', async () => {
		await expect(callGet('foobar')).rejects.toMatchObject({
			body: { message: expect.stringContaining('foobar') }
		});
	});

	it('returns USD prices by default', async () => {
		const res = await callGet('btc');
		const body = await res.json();
		expect(body.data.currency).toBe('USD');
	});

	it('converts prices to the target currency', async () => {
		const [usdRes, eurRes] = await Promise.all([callGet('btc'), callGet('btc', '?currency=EUR')]);
		const usd = (await usdRes.json()).data;
		const eur = (await eurRes.json()).data;
		expect(eur.price).toBeCloseTo(usd.price * 0.92);
		expect(eur.currency).toBe('EUR');
	});

	it('converts high24h and low24h with the exchange rate', async () => {
		const [usdRes, eurRes] = await Promise.all([callGet('btc'), callGet('btc', '?currency=EUR')]);
		const usd = (await usdRes.json()).data;
		const eur = (await eurRes.json()).data;
		expect(eur.high24h).toBeCloseTo(usd.high24h * 0.92);
		expect(eur.low24h).toBeCloseTo(usd.low24h * 0.92);
	});
});