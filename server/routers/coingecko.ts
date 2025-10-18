import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

interface CoinGeckoData {
  id: string;
  community_data?: {
    reddit_subscribers?: number;
    reddit_average_posts_48h?: number;
    reddit_average_comments_48h?: number;
    reddit_accounts_active_48h?: number;
    telegram_channel_user_count?: number;
    facebook_likes?: number;
    twitter_followers?: number;
  };
}

// Simple in-memory cache for coin list
let coinListCache: any[] | null = null;
let coinListCacheTime = 0;
const COIN_LIST_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function getCoinListCached() {
  const now = Date.now();
  if (coinListCache && (now - coinListCacheTime) < COIN_LIST_CACHE_DURATION) {
    return coinListCache;
  }

  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/list?include_platform=false`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch coin list: ${response.status}`);
    }
    coinListCache = await response.json();
    coinListCacheTime = now;
    return coinListCache;
  } catch (error) {
    console.error('Error fetching coin list:', error);
    // Return empty array on error to avoid crashing
    return [];
  }
}

export const coingeckoRouter = router({
  /**
   * CoinGecko API'sinden kripto paranın sosyal medya ve topluluk verilerini çek
   * Rate limit'e takılırsa graceful degradation ile sessiz başarısızlık döndür
   */
  getSocialMetrics: publicProcedure
    .input(
      z.object({
        cryptoSymbol: z.string().toLowerCase(),
      })
    )
    .query(async ({ input }) => {
      try {
        // Cached coin list'i kullan
        const coinList = await getCoinListCached();
        if (!coinList || coinList.length === 0) {
          return {
            community_data: null,
            error: null,
          };
        }
        const coin = coinList.find(
          (c: { symbol: string }) => c.symbol.toLowerCase() === input.cryptoSymbol
        );

        if (!coin) {
          return {
            community_data: null,
            error: null, // Sessiz başarısızlık
          };
        }

        // Sosyal medya verilerini çek
        const dataResponse = await fetch(
          `${COINGECKO_API_URL}/coins/${coin.id}?localization=false&tickers=false&market_data=false&community_data=true&developer_data=false`
        );

        if (!dataResponse.ok) {
          // Rate limit hatası - sessiz başarısızlık
          if (dataResponse.status === 429) {
            console.warn(`Rate limited for ${input.cryptoSymbol}`);
            return {
              community_data: null,
              error: null,
            };
          }
          throw new Error(`Failed to fetch coin data: ${dataResponse.status}`);
        }

        const data: CoinGeckoData = await dataResponse.json();

        return {
          community_data: data.community_data || null,
          error: null,
        };
      } catch (error) {
        console.error('Error fetching from CoinGecko API:', error);
        // Sessiz başarısızlık - uygulamayı çökertme
        return {
          community_data: null,
          error: null,
        };
      }
    }),

  /**
   * Birden fazla kripto paranın sosyal metriklerini toplu olarak çek
   * Rate limit'e takılırsa graceful degradation ile devam et
   */
  getSocialMetricsBatch: publicProcedure
    .input(
      z.object({
        symbols: z.array(z.string()),
      })
    )
    .query(async ({ input }) => {
      try {
        // Cached coin list'i kullan
        const coinList = await getCoinListCached();
        if (!coinList || coinList.length === 0) {
          return {};
        }
        const symbolMap = new Map<string, string>();

        input.symbols.forEach((symbol) => {
          const coin = coinList.find(
            (c: { symbol: string }) => c.symbol.toLowerCase() === symbol.toLowerCase()
          );
          if (coin) {
            symbolMap.set(symbol.toLowerCase(), coin.id);
          }
        });

        // Sosyal medya verilerini toplu olarak çek (rate limit'e dikkat)
        const results: Record<string, any> = {};

        const entries = Array.from(symbolMap.entries());
        for (const [symbol, coinId] of entries) {
          try {
            const response = await fetch(
              `${COINGECKO_API_URL}/coins/${coinId}?localization=false&tickers=false&market_data=false&community_data=true&developer_data=false`
            );

            if (response.ok) {
              const data: CoinGeckoData = await response.json();
              results[symbol] = data.community_data || null;
            } else if (response.status === 429) {
              // Rate limit - sessiz başarısızlık
              console.warn(`Rate limited for ${symbol}`);
              results[symbol] = null;
            } else {
              results[symbol] = null;
            }

            // Rate limit'i aşmamak için daha uzun bir gecikme
            await new Promise((resolve) => setTimeout(resolve, 200));
          } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error);
            results[symbol] = null;
          }
        }

        return results;
      } catch (error) {
        console.error('Error in batch fetch:', error);
        // Sessiz başarısızlık - boş object döndür
        return {};
      }
    }),
});

