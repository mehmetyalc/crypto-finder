import {
  CryptoData,
  EnrichedCryptoData,
  RiskScoreComponents,
  FilterOptions,
} from './types';

/**
 * Topluluk Gücü Skorunu Hesapla
 * Market cap rank'e göre (daha düşük rank = daha güçlü topluluk)
 */
function calculateCommunityScore(cmcRank: number): number {
  // Top 10 = 100 puan
  if (cmcRank <= 10) return 100;
  // Top 50 = 90 puan
  if (cmcRank <= 50) return 90;
  // Top 100 = 80 puan
  if (cmcRank <= 100) return 80;
  // Top 500 = 60 puan
  if (cmcRank <= 500) return 60;
  // Top 1000 = 40 puan
  if (cmcRank <= 1000) return 40;
  // 1000+ = 20 puan
  return 20;
}

/**
 * Volatilite Skorunu Hesapla
 * 24h, 7d, 30d yüzde değişimlerine göre
 * Daha düşük volatilite = daha düşük risk
 */
function calculateVolatilityScore(
  percentChange24h: number,
  percentChange7d: number,
  percentChange30d: number
): number {
  // Mutlak değerleri al
  const abs24h = Math.abs(percentChange24h);
  const abs7d = Math.abs(percentChange7d);
  const abs30d = Math.abs(percentChange30d);
  
  // Ortalama volatiliteyi hesapla
  const avgVolatility = (abs24h + abs7d + abs30d) / 3;
  
  // Volatiliteyi 0-100 skalasına çevir
  // 0-5% = 100, 5-10% = 80, 10-20% = 60, 20-50% = 40, 50%+ = 20
  if (avgVolatility <= 5) return 100;
  if (avgVolatility <= 10) return 80;
  if (avgVolatility <= 20) return 60;
  if (avgVolatility <= 50) return 40;
  return 20;
}

/**
 * Arz Oranını Hesapla
 * circulating_supply / total_supply
 */
function calculateSupplyRatio(
  circulatingSupply: number,
  totalSupply: number
): number {
  if (totalSupply === 0) return 0;
  return circulatingSupply / totalSupply;
}

/**
 * Kripto Parasının Adına Göre Kategori Belirle
 */
function getCategoryByName(name: string, symbol: string): string | undefined {
  const lowerName = name.toLowerCase();
  const lowerSymbol = symbol.toLowerCase();
  
  // Exchange Token kategorisi
  if (lowerName.includes('binance') || lowerName.includes('kuCoin') || 
      lowerName.includes('okb') || lowerName.includes('leo') ||
      lowerSymbol === 'bnb' || lowerSymbol === 'kcs' || lowerSymbol === 'okb' || 
      lowerSymbol === 'leo' || lowerSymbol === 'gt' || lowerSymbol === 'ftt') {
    return 'Exchange Token';
  }
  
  // L1 Blockchain kategorisi
  if (lowerName.includes('ripple') || lowerName.includes('tron') ||
      lowerName.includes('litecoin') || lowerName.includes('toncoin') ||
      lowerName.includes('kaspa') || lowerName.includes('vechain') ||
      lowerSymbol === 'xrp' || lowerSymbol === 'trx' || lowerSymbol === 'ltc' ||
      lowerSymbol === 'ton' || lowerSymbol === 'kas' || lowerSymbol === 'vet') {
    return 'Blockchain';
  }
  
  // Staking kategorisi
  if (lowerName.includes('hyperliquid') || lowerName.includes('ethena') ||
      lowerName.includes('hedera') || lowerName.includes('cronos') ||
      lowerSymbol === 'hype' || lowerSymbol === 'ena' || lowerSymbol === 'hbar' || 
      lowerSymbol === 'cro') {
    return 'Staking';
  }
  
  // Sui kategorisi
  if (lowerName.includes('sui') || lowerSymbol === 'sui') {
    return 'Layer 1';
  }
  
  // Mantle kategorisi
  if (lowerName.includes('mantle') || lowerSymbol === 'mnt') {
    return 'Layer 2';
  }
  
  // Bittensor kategorisi
  if (lowerName.includes('bittensor') || lowerSymbol === 'tao') {
    return 'AI';
  }
  
  // Stellar kategorisi
  if (lowerName.includes('stellar') || lowerSymbol === 'xlm') {
    return 'Blockchain';
  }
  
  // DeFi kategorisi
  if (lowerName.includes('uniswap') || lowerName.includes('aave') || 
      lowerName.includes('curve') || lowerName.includes('lido') ||
      lowerName.includes('maker') || lowerName.includes('compound') ||
      lowerName.includes('pancakeswap') || lowerName.includes('aerodrome') ||
      lowerSymbol === 'uni' || lowerSymbol === 'aave' || lowerSymbol === 'crv' ||
      lowerSymbol === 'ldo' || lowerSymbol === 'mkr' || lowerSymbol === 'comp' ||
      lowerSymbol === 'cake' || lowerSymbol === 'aero') {
    return 'DeFi';
  }
  
  // AI kategorisi
  if (lowerName.includes('ai') || lowerName.includes('artificial intelligence') ||
      lowerName.includes('neural') || lowerName.includes('render') ||
      lowerSymbol === 'rndr' || lowerSymbol === 'fet' || lowerSymbol === 'agix') {
    return 'Yapay Zeka';
  }
  
  // Layer 2 kategorisi
  if (lowerName.includes('arbitrum') || lowerName.includes('optimism') ||
      lowerName.includes('polygon') || lowerName.includes('layer 2') ||
      lowerSymbol === 'arb' || lowerSymbol === 'op' || lowerSymbol === 'matic') {
    return 'Layer 2';
  }
  
  // Layer 1 kategorisi
  if (lowerName.includes('solana') || lowerName.includes('cardano') ||
      lowerName.includes('avalanche') || lowerName.includes('polkadot') ||
      lowerName.includes('cosmos') || lowerName.includes('near') ||
      lowerSymbol === 'sol' || lowerSymbol === 'ada' || lowerSymbol === 'avax' ||
      lowerSymbol === 'dot' || lowerSymbol === 'atom' || lowerSymbol === 'near') {
    return 'Layer 1';
  }
  
  // Meme kategorisi
  if (lowerName.includes('doge') || lowerName.includes('shib') ||
      lowerName.includes('pepe') || lowerName.includes('floki') ||
      lowerSymbol === 'doge' || lowerSymbol === 'shib' || lowerSymbol === 'pepe') {
    return 'Meme';
  }
  
  // Gaming kategorisi
  if (lowerName.includes('axie') || lowerName.includes('sandbox') ||
      lowerName.includes('decentraland') || lowerName.includes('enjin') ||
      lowerName.includes('gala') || lowerSymbol === 'axs' || lowerSymbol === 'sand' ||
      lowerSymbol === 'mana' || lowerSymbol === 'enj' || lowerSymbol === 'gala') {
    return 'Gaming';
  }
  
  // Privacy kategorisi
  if (lowerName.includes('monero') || lowerName.includes('zcash') ||
      lowerName.includes('privacy') || lowerSymbol === 'xmr' || lowerSymbol === 'zec') {
    return 'Privacy';
  }
  
  // NFT kategorisi
  if (lowerName.includes('immutable') || lowerName.includes('flow') ||
      lowerSymbol === 'imx' || lowerSymbol === 'flow') {
    return 'NFT';
  }
  
  // Stablecoin kategorisi
  if (lowerName.includes('tether') || lowerName.includes('usdc') ||
      lowerName.includes('dai') || lowerName.includes('usdt') ||
      lowerSymbol === 'usdt' || lowerSymbol === 'usdc' || lowerSymbol === 'dai') {
    return 'Stablecoin';
  }
  
  // Bitcoin kategorisi
  if (lowerName.includes('bitcoin') || lowerSymbol === 'btc') {
    return 'Bitcoin';
  }
  
  // Ethereum kategorisi
  if (lowerName.includes('ethereum') || lowerSymbol === 'eth') {
    return 'Ethereum';
  }
  
  return undefined;
}

/**
 * Ana Kategoriyi Seç
 */
function getPrimaryCategory(categories?: string[]): string | undefined {
  if (!categories || categories.length === 0) return undefined;
  
  // Popüler kategorileri önceliklendir
  const priorityCategories = [
    'Decentralized Finance (DeFi)',
    'Artificial Intelligence',
    'Layer 1',
    'Layer 2',
    'Meme',
    'Gaming',
    'Metaverse',
    'NFT',
    'Privacy',
    'Web3'
  ];
  
  for (const priority of priorityCategories) {
    if (categories.includes(priority)) {
      return priority;
    }
  }
  
  // İlk kategoriyi döndür
  return categories[0];
}

/**
 * Kripto Parasını Zenginleştir
 */
export function enrichCryptoData(crypto: CryptoData): EnrichedCryptoData {
  const supplyRatio = calculateSupplyRatio(crypto.circulating_supply, crypto.total_supply);
  const communityScore = calculateCommunityScore(crypto.cmc_rank);
  const volatility = calculateVolatilityScore(
    crypto.quote.USD.percent_change_24h,
    crypto.quote.USD.percent_change_7d,
    crypto.quote.USD.percent_change_30d
  );
  
  // Önce CoinGecko kategorilerini kontrol et, yoksa adına göre belirle
  let primaryCategory = getPrimaryCategory(crypto.categories);
  if (!primaryCategory) {
    primaryCategory = getCategoryByName(crypto.name, crypto.symbol);
  }
  
  return {
    ...crypto,
    supplyRatio,
    communityScore,
    volatility,
    primaryCategory,
  };
}

/**
 * Kripto Paralarını Filtrele
 */
export function filterCryptos(
  cryptos: EnrichedCryptoData[],
  filters: FilterOptions
): EnrichedCryptoData[] {
  let filtered = [...cryptos];
  
  // Market cap'e göre filtrele
  if (filters.minMarketCap !== undefined) {
    filtered = filtered.filter(
      (c) => c.quote.USD.market_cap >= filters.minMarketCap!
    );
  }
  if (filters.maxMarketCap !== undefined) {
    filtered = filtered.filter(
      (c) => c.quote.USD.market_cap <= filters.maxMarketCap!
    );
  }
  
  // Arz oranına göre filtrele
  if (filters.minSupplyRatio !== undefined) {
    filtered = filtered.filter((c) => c.supplyRatio >= filters.minSupplyRatio!);
  }
  if (filters.maxSupplyRatio !== undefined) {
    filtered = filtered.filter((c) => c.supplyRatio <= filters.maxSupplyRatio!);
  }
  
  // 24h hacmine göre filtrele
  if (filters.minVolume24h !== undefined) {
    filtered = filtered.filter(
      (c) => c.quote.USD.volume_24h >= filters.minVolume24h!
    );
  }
  
  // Sıralama
  const sortBy = filters.sortBy || 'marketCap';
  const sortOrder = filters.sortOrder || 'desc';
  
  filtered.sort((a, b) => {
    let aValue: number;
    let bValue: number;
    
    switch (sortBy) {
      case 'marketCap':
        aValue = a.quote.USD.market_cap;
        bValue = b.quote.USD.market_cap;
        break;
      case 'volume':
        aValue = a.quote.USD.volume_24h;
        bValue = b.quote.USD.volume_24h;
        break;
      case 'name':
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      default:
        aValue = a.quote.USD.market_cap;
        bValue = b.quote.USD.market_cap;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });
  
  return filtered;
}

/**
 * Kripto Paralarını Kategoriye Göre Grupla
 */
export function groupByCategory(
  cryptos: EnrichedCryptoData[]
): Record<string, EnrichedCryptoData[]> {
  const grouped: Record<string, EnrichedCryptoData[]> = {};
  
  cryptos.forEach((crypto) => {
    const category = crypto.primaryCategory || 'Diğer';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(crypto);
  });
  
  return grouped;
}

