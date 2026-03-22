import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ASSETS } from '$lib/data/assets';
import { EXCHANGE_RATES } from '$lib/data/exchangeRates';

export interface CandleData {
	time: number;
	open: number;
	high: number;
	low: number;
	close: number;
}

function seededRandom(seed: number) {
	let s = seed;
	return () => {
		s = (s * 1664525 + 1013904223) & 0xffffffff;
		return (s >>> 0) / 0xffffffff;
	};
}

function strToSeed(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
	}
	return hash >>> 0;
}

function generateCandles(
	assetId: string,
	currentPrice: number,
	interval: string,
	count: number,
	targetCurrency: string
): CandleData[] {
	const rand = seededRandom(strToSeed(assetId + interval));

	const exchangeRate = EXCHANGE_RATES[targetCurrency] ?? 1;

	// Volatility by interval
	const volatilityMap: Record<string, number> = {
		'1D': 0.018,
		'1W': 0.045,
		'1M': 0.09
	};
	const volatility = volatilityMap[interval] ?? 0.018;

	// Interval step in seconds
	const stepMap: Record<string, number> = {
		'1D': 86400,
		'1W': 604800,
		'1M': 2592000
	};
	const step = stepMap[interval] ?? 86400;

	// Simulate price going backwards from current one
	const closes: number[] = new Array(count);
	closes[count - 1] = currentPrice * exchangeRate;
	for (let i = count - 2; i >= 0; i--) {
		const change = (rand() - 0.49) * volatility;
		closes[i] = closes[i + 1] / (1 + change);
	}

	// Current timestamp aligned to interval
	const now = Math.floor(Date.now() / 1000);
	const startTime = now - step * (count - 1);

	const candles: CandleData[] = [];
	for (let i = 0; i < count; i++) {
		const close = closes[i];
		const open = i === 0 ? close * (1 + (rand() - 0.5) * volatility) : closes[i - 1];
		const wickRange = Math.abs(close - open) * (0.3 + rand() * 1.5);
		const high = Math.max(open, close) + wickRange * rand();
		const low = Math.min(open, close) - wickRange * rand();

		candles.push({
			time: startTime + step * i,
			open: parseFloat(open.toFixed(open >= 1 ? 2 : 6)),
			high: parseFloat(high.toFixed(high >= 1 ? 2 : 6)),
			low: parseFloat(low.toFixed(low >= 1 ? 2 : 6)),
			close: parseFloat(close.toFixed(close >= 1 ? 2 : 6))
		});
	}

	return candles;
}

export const GET: RequestHandler = ({ params, url }) => {
	const asset = ASSETS.find((a) => a.id === params.id);

	if (!asset) {
		error(404, { message: `Asset "${params.id}" not found.` });
	}

	const interval = url.searchParams.get('interval') ?? '1D';
	const allowedIntervals = ['1D', '1W', '1M'];
	if (!allowedIntervals.includes(interval)) {
		error(400, { message: `Invalid interval. Use one of: ${allowedIntervals.join(', ')}` });
	}

	const targetCurrency = url.searchParams.get('currency') ?? 'USD';

	const countMap: Record<string, number> = { '1D': 90, '1W': 52, '1M': 24 };
	const count = countMap[interval];

	const candles = generateCandles(asset.id, asset.price, interval, count, targetCurrency);

	return json({ data: candles, interval, asset_id: asset.id });
};
