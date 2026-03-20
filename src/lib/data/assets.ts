import type { Asset } from '$lib/types/asset';

export const ASSETS: Asset[] = [
	{
		id: 'btc',
		symbol: 'BTC',
		name: 'Bitcoin',
		price: 68420.5,
		change: 1823.4,
		changePercent: 2.74,
		category: 'crypto',
		currency: 'USD',
		marketCap: 1_340_000_000_000,
		volume: 28_500_000_000,
		high24h: 69_100.0,
		low24h: 66_200.0,
		description:
			'Bitcoin is the first decentralized cryptocurrency, created in 2009 by the pseudonymous Satoshi Nakamoto. It operates on a peer-to-peer network without a central authority, enabling trustless transactions via blockchain technology. Bitcoin has a fixed supply cap of 21 million coins, making it deflationary by design.'
	},
	{
		id: 'eth',
		symbol: 'ETH',
		name: 'Ethereum',
		price: 3512.8,
		change: -87.2,
		changePercent: -2.42,
		category: 'crypto',
		currency: 'USD',
		marketCap: 422_000_000_000,
		volume: 15_200_000_000,
		high24h: 3_640.0,
		low24h: 3_480.0,
		description:
			'Ethereum is a decentralized, open-source blockchain featuring smart contract functionality. It is the foundation for thousands of decentralized applications (dApps) and the DeFi ecosystem. After the Merge in 2022, Ethereum transitioned to a Proof-of-Stake consensus mechanism, drastically reducing its energy consumption.'
	},
	{
		id: 'sol',
		symbol: 'SOL',
		name: 'Solana',
		price: 178.4,
		change: 8.65,
		changePercent: 5.1,
		category: 'crypto',
		currency: 'USD',
		marketCap: 82_000_000_000,
		volume: 3_800_000_000,
		high24h: 182.0,
		low24h: 169.0,
		description:
			'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale. It offers extremely fast transaction speeds (65,000 TPS) and very low fees, making it a popular choice for NFTs, DeFi, and consumer-facing Web3 applications.'
	},
	{
		id: 'aapl',
		symbol: 'AAPL',
		name: 'Apple Inc.',
		price: 189.3,
		change: 2.15,
		changePercent: 1.15,
		category: 'stock',
		currency: 'USD',
		marketCap: 2_940_000_000_000,
		volume: 58_000_000,
		high24h: 191.0,
		low24h: 187.5,
		description:
			'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. Its flagship products include the iPhone, Mac, iPad, Apple Watch, and AirPods. Apple also operates a growing Services segment including the App Store, Apple Music, iCloud, and Apple TV+.'
	},
	{
		id: 'msft',
		symbol: 'MSFT',
		name: 'Microsoft Corporation',
		price: 415.7,
		change: -3.2,
		changePercent: -0.76,
		category: 'stock',
		currency: 'USD',
		marketCap: 3_090_000_000_000,
		volume: 22_000_000,
		high24h: 420.0,
		low24h: 414.0,
		description:
			'Microsoft develops, licenses, and supports software, services, devices, and solutions worldwide. Its Azure cloud platform is a major growth driver. Microsoft owns LinkedIn, GitHub, and has made a major investment in OpenAI, positioning itself as a leader in the AI-powered software era.'
	},
	{
		id: 'nvda',
		symbol: 'NVDA',
		name: 'NVIDIA Corporation',
		price: 875.4,
		change: 34.8,
		changePercent: 4.14,
		category: 'stock',
		currency: 'USD',
		marketCap: 2_160_000_000_000,
		volume: 45_000_000,
		high24h: 890.0,
		low24h: 840.0,
		description:
			"NVIDIA designs and manufactures graphics processing units (GPUs), system-on-chip units, and APIs for data centers, gaming, professional visualization, and automotive markets. NVIDIA's H100 and A100 GPUs are the backbone of modern AI training infrastructure, making it one of the most consequential companies in the AI revolution."
	},
	{
		id: 'spy',
		symbol: 'SPY',
		name: 'SPDR S&P 500 ETF Trust',
		price: 524.18,
		change: 1.84,
		changePercent: 0.35,
		category: 'etf',
		currency: 'USD',
		marketCap: 530_000_000_000,
		volume: 72_000_000,
		high24h: 525.8,
		low24h: 522.1,
		description:
			'The SPDR S&P 500 ETF Trust is one of the largest and most liquid ETFs in the world. It tracks the S&P 500 index, providing broad exposure to 500 of the largest publicly traded companies in the United States. SPY is widely used by both institutional and retail investors for portfolio diversification and hedging.'
	},
	{
		id: 'qqq',
		symbol: 'QQQ',
		name: 'Invesco QQQ Trust',
		price: 448.25,
		change: 3.92,
		changePercent: 0.88,
		category: 'etf',
		currency: 'USD',
		marketCap: 244_000_000_000,
		volume: 38_000_000,
		high24h: 450.0,
		low24h: 443.0,
		description:
			'The Invesco QQQ Trust tracks the Nasdaq-100 Index, which includes the 100 largest non-financial companies listed on the Nasdaq. It is heavily weighted toward technology companies including Apple, Microsoft, NVIDIA, Amazon, and Alphabet, making it a popular vehicle for technology-sector exposure.'
	},
	{
		id: 'voo',
		symbol: 'VOO',
		name: 'Vanguard S&P 500 ETF',
		price: 481.6,
		change: 1.22,
		changePercent: 0.25,
		category: 'etf',
		currency: 'USD',
		marketCap: 460_000_000_000,
		volume: 5_500_000,
		high24h: 482.8,
		low24h: 479.0,
		description:
			'The Vanguard S&P 500 ETF seeks to track the performance of the S&P 500 Index. Known for its industry-leading low expense ratio of 0.03%, VOO is a favorite among long-term passive investors. It provides exposure to the same 500 large-cap US equities as SPY but with significantly lower costs.'
	},
	{
		id: 'gold',
		symbol: 'GOLD',
		name: 'Gold Spot',
		price: 2342.8,
		change: 12.4,
		changePercent: 0.53,
		category: 'commodity',
		currency: 'USD',
		high24h: 2358.0,
		low24h: 2329.0,
		description:
			'Gold is a precious metal that has been used as a store of value for thousands of years. It is widely considered a safe-haven asset and inflation hedge. Central banks hold significant gold reserves, and it plays a key role in global financial stability. Gold is traded in spot markets and via futures, ETFs, and physical bullion.'
	},
	{
		id: 'avax',
		symbol: 'AVAX',
		name: 'Avalanche',
		price: 38.72,
		change: -1.28,
		changePercent: -3.2,
		category: 'crypto',
		currency: 'USD',
		marketCap: 16_000_000_000,
		volume: 580_000_000,
		high24h: 40.5,
		low24h: 37.9,
		description:
			'Avalanche is a layer-1 blockchain platform featuring three interoperable blockchains, ultra-fast finality (sub-second), and high throughput. It uses a novel Proof-of-Stake consensus and supports Ethereum-compatible smart contracts, making it a popular destination for DeFi protocols and enterprise deployments.'
	},
	{
		id: 'tsla',
		symbol: 'TSLA',
		name: 'Tesla, Inc.',
		price: 177.9,
		change: -6.4,
		changePercent: -3.47,
		category: 'stock',
		currency: 'USD',
		marketCap: 566_000_000_000,
		volume: 112_000_000,
		high24h: 185.0,
		low24h: 176.2,
		description:
			"Tesla designs, develops, manufactures, leases, and sells electric vehicles, energy generation and storage systems. Its lineup includes the Model 3, Model Y, Model S, and Model X. Tesla's Full Self-Driving (FSD) software and energy products like Powerwall and Megapack are key growth initiatives beyond the core EV business."
	}
];
