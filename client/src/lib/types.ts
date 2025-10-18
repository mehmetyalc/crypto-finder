/**
 * Kripto para veri türleri
 */

export interface CryptoQuote {
  price: number;
  market_cap: number;
  market_cap_dominance: number;
  volume_24h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
}

export interface SocialMetrics {
  reddit_subscribers?: number;
  reddit_average_posts_48h?: number;
  reddit_average_comments_48h?: number;
  reddit_accounts_active_48h?: number;
  telegram_channel_user_count?: number;
  facebook_likes?: number;
  twitter_followers?: number;
}

export interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  quote: {
    USD: CryptoQuote;
  };
  social_metrics?: SocialMetrics;
}

export interface CommunityMetrics {
  redditScore: number;
  telegramScore: number;
  facebookScore: number;
  overallCommunityScore: number;
}

export interface EnrichedCryptoData extends CryptoData {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  supplyRatio: number; // circulating_supply / total_supply
  communityScore: number; // 0-100, based on market cap rank
  volatility: number; // Based on 24h, 7d, 30d percent changes
  communityMetrics?: CommunityMetrics;
}

export interface RiskScoreComponents {
  marketCapScore: number; // 0-100
  liquidityScore: number; // 0-100
  supplyRatioScore: number; // 0-100
  communityScore: number; // 0-100
  volatilityScore: number; // 0-100
}

export interface FilterOptions {
  riskLevel?: 'low' | 'medium' | 'high' | 'all';
  minMarketCap?: number;
  maxMarketCap?: number;
  minSupplyRatio?: number;
  maxSupplyRatio?: number;
  minVolume24h?: number;
  sortBy?: 'riskScore' | 'marketCap' | 'volume' | 'name';
  sortOrder?: 'asc' | 'desc';
}

