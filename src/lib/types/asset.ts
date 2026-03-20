export type AssetCategory = 'stock' | 'etf' | 'crypto' | 'commodity' | 'empty' | 'error';

export interface Asset {
	id: string;
	symbol: string;
	name: string;
	price: number;
	change: number; // absolute change
	changePercent: number; // % change
	category: AssetCategory;
	description: string;
	marketCap?: number;
	volume?: number;
	high24h?: number;
	low24h?: number;
	currency: string;
}

export interface AssetSummary {
	id: string;
	symbol: string;
	name: string;
	price: number;
	change: number;
	changePercent: number;
	category: AssetCategory;
	currency: string;
}

export interface Category {
	id: AssetCategory;
	label: string;
	count: number;
	icon?: string;
}
