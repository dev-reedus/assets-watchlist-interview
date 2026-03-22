import { describe, it, expect } from 'vitest';
import { convertAssetSummary, convertAsset } from './currencyConvert';
import type { Asset, AssetSummary } from '$lib/types/asset';

const baseSummary: AssetSummary = {
	id: 'btc',
	symbol: 'BTC',
	name: 'Bitcoin',
	price: 100,
	change: 10,
	changePercent: 10,
	category: 'crypto',
	currency: 'USD'
};

const baseAsset: Asset = {
	...baseSummary,
	description: 'Test asset',
	marketCap: 1_000_000,
	volume: 500_000,
	high24h: 110,
	low24h: 90
};

describe('convertAssetSummary', () => {
	it('returns the same reference for USD', () => {
		const result = convertAssetSummary(baseSummary, 'USD');
		expect(result).toBe(baseSummary);
	});

	it('converts price and change using the exchange rate', () => {
		const result = convertAssetSummary(baseSummary, 'EUR'); // rate: 0.92
		expect(result.price).toBeCloseTo(92);
		expect(result.change).toBeCloseTo(9.2);
		expect(result.currency).toBe('EUR');
	});

	it('does not modify changePercent', () => {
		const result = convertAssetSummary(baseSummary, 'EUR');
		expect(result.changePercent).toBe(baseSummary.changePercent);
	});

	it('defaults to rate 1 for an unknown currency', () => {
		const result = convertAssetSummary(baseSummary, 'XYZ');
		expect(result.price).toBe(100);
		expect(result.currency).toBe('XYZ');
	});

	it('preserves all non-price fields', () => {
		const result = convertAssetSummary(baseSummary, 'GBP'); // rate: 0.79
		expect(result.id).toBe('btc');
		expect(result.symbol).toBe('BTC');
		expect(result.name).toBe('Bitcoin');
		expect(result.category).toBe('crypto');
	});
});

describe('convertAsset', () => {
	it('returns the same reference for USD', () => {
		const result = convertAsset(baseAsset, 'USD');
		expect(result).toBe(baseAsset);
	});

	it('converts price, change, high24h, low24h, and marketCap', () => {
		const result = convertAsset(baseAsset, 'EUR'); // rate: 0.92
		expect(result.price).toBeCloseTo(92);
		expect(result.change).toBeCloseTo(9.2);
		expect(result.high24h).toBeCloseTo(101.2);
		expect(result.low24h).toBeCloseTo(82.8);
		expect(result.marketCap).toBeCloseTo(920_000);
		expect(result.currency).toBe('EUR');
	});

	it('omits high24h/low24h/marketCap when they are undefined', () => {
		const asset: Asset = { ...baseAsset, high24h: undefined, low24h: undefined, marketCap: undefined };
		const result = convertAsset(asset, 'EUR');
		expect(result.high24h).toBeUndefined();
		expect(result.low24h).toBeUndefined();
		expect(result.marketCap).toBeUndefined();
	});

	it('does not modify volume', () => {
		const result = convertAsset(baseAsset, 'EUR');
		expect(result.volume).toBe(baseAsset.volume);
	});
});