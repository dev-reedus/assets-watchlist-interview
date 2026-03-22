import { describe, it, expect } from 'vitest';
import { GET } from './+server';

function callGet(id: string, search = '') {
	const url = new URL(`http://localhost/api/asset/${id}/price-history${search}`);
	return GET({ params: { id }, url } as Parameters<typeof GET>[0]);
}

describe('GET /api/asset/[id]/price-history', () => {
	it('returns candle data with the expected shape', async () => {
		const res = await callGet('btc');
		const body = await res.json();
		expect(body.data.length).toBeGreaterThan(0);
		expect(body.data[0]).toMatchObject({
			time: expect.any(Number),
			open: expect.any(Number),
			high: expect.any(Number),
			low: expect.any(Number),
			close: expect.any(Number)
		});
	});

	it('defaults to the 1D interval with 90 candles', async () => {
		const res = await callGet('btc');
		const body = await res.json();
		expect(body.interval).toBe('1D');
		expect(body.data.length).toBe(90);
	});

	it('returns correct candle count per interval', async () => {
		const cases: [string, number][] = [
			['1D', 90],
			['1W', 52],
			['1M', 24]
		];
		for (const [interval, count] of cases) {
			const res = await callGet('btc', `?interval=${interval}`);
			const body = await res.json();
			expect(body.data.length, `interval ${interval}`).toBe(count);
		}
	});

	it('throws 404 for an unknown asset', async () => {
		await expect(callGet('unknown-xyz')).rejects.toMatchObject({ status: 404 });
	});

	it('throws 400 for an invalid interval', async () => {
		await expect(callGet('btc', '?interval=5M')).rejects.toMatchObject({ status: 400 });
	});

	it('returns the asset_id in the response', async () => {
		const res = await callGet('eth');
		const body = await res.json();
		expect(body.asset_id).toBe('eth');
	});

	it('applies the currency exchange rate to candle prices', async () => {
		const [usdRes, eurRes] = await Promise.all([
			callGet('btc', '?interval=1D'),
			callGet('btc', '?interval=1D&currency=EUR')
		]);
		const usd = (await usdRes.json()).data[0];
		const eur = (await eurRes.json()).data[0];
		expect(eur.close).toBeCloseTo(usd.close * 0.92);
	});

	it('produces deterministic candles for the same inputs', async () => {
		const [res1, res2] = await Promise.all([
			callGet('btc', '?interval=1W'),
			callGet('btc', '?interval=1W')
		]);
		const [body1, body2] = await Promise.all([res1.json(), res2.json()]);
		expect(body1.data).toEqual(body2.data);
	});

	it('candle high is always >= open and close', async () => {
		const res = await callGet('btc');
		const body = await res.json();
		for (const candle of body.data) {
			expect(candle.high).toBeGreaterThanOrEqual(candle.open);
			expect(candle.high).toBeGreaterThanOrEqual(candle.close);
		}
	});

	it('candle low is always <= open and close', async () => {
		const res = await callGet('btc');
		const body = await res.json();
		for (const candle of body.data) {
			expect(candle.low).toBeLessThanOrEqual(candle.open);
			expect(candle.low).toBeLessThanOrEqual(candle.close);
		}
	});
});