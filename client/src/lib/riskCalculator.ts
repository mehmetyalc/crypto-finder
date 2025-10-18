import {
  CryptoData,
  EnrichedCryptoData,
  RiskScoreComponents,
  FilterOptions,
} from './types';

/**
 * Market Cap Skorunu Hesapla
 * Daha yüksek market cap = daha düşük risk
 * 1B+ = 100, 100M-1B = 80, 10M-100M = 60, 1M-10M = 40, <1M = 20
 */
function calculateMarketCapScore(marketCap: number): number {
  if (marketCap >= 1_000_000_000) return 100; // 1B+
  if (marketCap >= 100_000_000) return 80; // 100M-1B
  if (marketCap >= 10_000_000) return 60; // 10M-100M
  if (marketCap >= 1_000_000) return 40; // 1M-10M
  return 20; // <1M
}

/**
 * Likidite Skorunu Hesapla
 * 24h hacim / market cap oranına göre
 * Yüksek oran = iyi likidite = düşük risk
 */
function calculateLiquidityScore(volume24h: number, marketCap: number): number {
  if (marketCap === 0) return 0;
  
  const volumeToMarketCapRatio = volume24h / marketCap;
  
  // Oran 0.1+ ise iyi likidite (100 puan)
  if (volumeToMarketCapRatio >= 0.1) return 100;
  // Oran 0.05-0.1 ise orta (80 puan)
  if (volumeToMarketCapRatio >= 0.05) return 80;
  // Oran 0.01-0.05 ise düşük (60 puan)
  if (volumeToMarketCapRatio >= 0.01) return 60;
  // Oran 0.005-0.01 ise çok düşük (40 puan)
  if (volumeToMarketCapRatio >= 0.005) return 40;
  // Oran <0.005 ise çok riskli (20 puan)
  return 20;
}

/**
 * Arz Oranı Skorunu Hesapla
 * circulating_supply / total_supply
 * Yüksek oran = daha az enflasyon riski = düşük risk
 */
function calculateSupplyRatioScore(
  circulatingSupply: number,
  totalSupply: number
): number {
  if (totalSupply === 0) return 50; // Bilinmeyen durum
  
  const ratio = circulatingSupply / totalSupply;
  
  // 90%+ = 100 puan (çok az enflasyon riski)
  if (ratio >= 0.9) return 100;
  // 70-90% = 80 puan
  if (ratio >= 0.7) return 80;
  // 50-70% = 60 puan
  if (ratio >= 0.5) return 60;
  // 30-50% = 40 puan
  if (ratio >= 0.3) return 40;
  // <30% = 20 puan (yüksek enflasyon riski)
  return 20;
}

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
  
  // Volatiliteyi 0-100 skalasına dönüştür
  // 0% volatilite = 100 puan
  // 50%+ volatilite = 20 puan
  const volatilityScore = Math.max(20, 100 - avgVolatility * 1.5);
  
  return Math.round(volatilityScore);
}

/**
 * Risk Skoru Bileşenlerini Hesapla
 */
function calculateRiskScoreComponents(
  crypto: CryptoData
): RiskScoreComponents {
  const quote = crypto.quote.USD;
  
  return {
    marketCapScore: calculateMarketCapScore(quote.market_cap),
    liquidityScore: calculateLiquidityScore(quote.volume_24h, quote.market_cap),
    supplyRatioScore: calculateSupplyRatioScore(
      crypto.circulating_supply,
      crypto.total_supply
    ),
    communityScore: calculateCommunityScore(crypto.cmc_rank),
    volatilityScore: calculateVolatilityScore(
      quote.percent_change_24h,
      quote.percent_change_7d,
      quote.percent_change_30d
    ),
  };
}

/**
 * Genel Risk Skorunu Hesapla (0-100)
 * Tüm bileşenlerin ağırlıklı ortalaması
 */
function calculateOverallRiskScore(components: RiskScoreComponents): number {
  const weights = {
    marketCapScore: 0.25,
    liquidityScore: 0.25,
    supplyRatioScore: 0.20,
    communityScore: 0.20,
    volatilityScore: 0.10,
  };
  
  const score =
    components.marketCapScore * weights.marketCapScore +
    components.liquidityScore * weights.liquidityScore +
    components.supplyRatioScore * weights.supplyRatioScore +
    components.communityScore * weights.communityScore +
    components.volatilityScore * weights.volatilityScore;
  
  return Math.round(score);
}

/**
 * Risk Seviyesini Belirle
 * 0-33: Düşük Risk
 * 34-66: Orta Risk
 * 67-100: Yüksek Risk
 */
function determineRiskLevel(
  riskScore: number
): 'low' | 'medium' | 'high' {
  if (riskScore >= 67) return 'high';
  if (riskScore >= 34) return 'medium';
  return 'low';
}

/**
 * Kripto Parasını Zenginleştir (Risk Skoru ve Seviyesi Ekle)
 */
export function enrichCryptoData(crypto: CryptoData): EnrichedCryptoData {
  const components = calculateRiskScoreComponents(crypto);
  const riskScore = calculateOverallRiskScore(components);
  const riskLevel = determineRiskLevel(riskScore);
  const supplyRatio = crypto.circulating_supply / crypto.total_supply;
  const communityScore = components.communityScore;
  
  return {
    ...crypto,
    riskScore,
    riskLevel,
    supplyRatio,
    communityScore,
    volatility: components.volatilityScore,
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
  
  // Risk seviyesine göre filtrele
  if (filters.riskLevel && filters.riskLevel !== 'all') {
    filtered = filtered.filter((c) => c.riskLevel === filters.riskLevel);
  }
  
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
  const sortBy = filters.sortBy || 'riskScore';
  const sortOrder = filters.sortOrder || 'asc';
  
  filtered.sort((a, b) => {
    let aValue: number;
    let bValue: number;
    
    switch (sortBy) {
      case 'riskScore':
        aValue = a.riskScore;
        bValue = b.riskScore;
        break;
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
        aValue = a.riskScore;
        bValue = b.riskScore;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });
  
  return filtered;
}

/**
 * Kripto Paralarını Risk Seviyesine Göre Grupla
 */
export function groupByRiskLevel(
  cryptos: EnrichedCryptoData[]
): {
  low: EnrichedCryptoData[];
  medium: EnrichedCryptoData[];
  high: EnrichedCryptoData[];
} {
  return {
    low: cryptos.filter((c) => c.riskLevel === 'low'),
    medium: cryptos.filter((c) => c.riskLevel === 'medium'),
    high: cryptos.filter((c) => c.riskLevel === 'high'),
  };
}

