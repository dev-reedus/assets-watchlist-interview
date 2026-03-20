import { ASSETS } from '$lib/data/assets';
import type { Category } from '$lib/types/asset';

export const CATEGORIES: Category[] = [
	{
		id: 'stock',
		label: 'Stocks',
		icon: '📈',
		count: ASSETS.filter((a) => a.category === 'stock').length
	},
	{
		id: 'etf',
		label: 'ETFs',
		icon: '🏦',
		count: ASSETS.filter((a) => a.category === 'etf').length
	},
	{
		id: 'crypto',
		label: 'Crypto',
		icon: '₿',
		count: ASSETS.filter((a) => a.category === 'crypto').length
	},
	{
		id: 'commodity',
		label: 'Commodities',
		icon: '🪙',
		count: ASSETS.filter((a) => a.category === 'commodity').length
	},
	{
		id: 'empty',
		label: 'Empty',
		icon: '◫',
		count: ASSETS.filter((a) => a.category === 'empty').length
	},
	{
		id: 'error',
		label: 'Error',
		icon: '⛔',
		count: ASSETS.filter((a) => a.category === 'error').length
	}
];
