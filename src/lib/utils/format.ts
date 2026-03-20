export function formatPrice(value: number, currency = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		minimumFractionDigits: value >= 1000 ? 2 : value >= 1 ? 2 : 4,
		maximumFractionDigits: value >= 1000 ? 2 : value >= 1 ? 2 : 4
	}).format(value);
}

export function formatPercent(value: number): string {
	const sign = value >= 0 ? '+' : '';
	return `${sign}${value.toFixed(2)}%`;
}

export function formatMarketCap(value: number): string {
	if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
	if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
	if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
	return `$${value.toLocaleString()}`;
}

export function formatVolume(value: number): string {
	if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
	if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
	if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
	return value.toLocaleString();
}
