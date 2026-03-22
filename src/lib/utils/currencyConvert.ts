import { EXCHANGE_RATES } from '$lib/data/exchangeRates';
import type { Asset, AssetSummary } from '$lib/types/asset';

export function convertAssetSummary(asset: AssetSummary, targetCurrency: string): AssetSummary {
	if (targetCurrency === 'USD') return asset;
	const rate = EXCHANGE_RATES[targetCurrency] ?? 1;
	return {
		...asset,
		price: asset.price * rate,
		change: asset.change * rate,
		currency: targetCurrency
	};
}

export function convertAsset(asset: Asset, targetCurrency: string): Asset {
	if (targetCurrency === 'USD') return asset;
	const rate = EXCHANGE_RATES[targetCurrency] ?? 1;
	return {
		...asset,
		price: asset.price * rate,
		change: asset.change * rate,
		currency: targetCurrency,
		...(asset.high24h !== undefined && { high24h: asset.high24h * rate }),
		...(asset.low24h !== undefined && { low24h: asset.low24h * rate }),
		...(asset.marketCap !== undefined && { marketCap: asset.marketCap * rate })
	};
}