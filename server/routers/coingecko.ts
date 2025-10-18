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

export const coingeckoRouter = router({
  /**
   * CoinGecko API'sinden kripto paranın sosyal medya ve topluluk verilerini çek
   */
  getSocialMetrics: publicProcedure
    .input(
      z.object({
        cryptoSymbol: z.string().toLowerCase(),
      })
    )
    .query(async ({ input }) => {
      try {
        // CoinGecko coin ID'sini bul (symbol'dan)
        const listResponse = await fetch(
          `${COINGECKO_API_URL}/coins/list?include_platform=false`
        );

        if (!listResponse.ok) {
          throw new Error(`Failed to fetch coin list: ${listResponse.status}`);
        }

        const coinList = await listResponse.json();
        const coin = coinList.find(
          (c: { symbol: string }) => c.symbol.toLowerCase() === input.cryptoSymbol
        );

        if (!coin) {
          return {
            community_data: null,
            error: `Coin not found for symbol: ${input.cryptoSymbol}`,
          };
        }

        // Sosyal medya verilerini çek
        const dataResponse = await fetch(
          `${COINGECKO_API_URL}/coins/${coin.id}?localization=false&tickers=false&market_data=false&community_data=true&developer_data=false`
        );

        if (!dataResponse.ok) {
          throw new Error(`Failed to fetch coin data: ${dataResponse.status}`);
        }

        const data: CoinGeckoData = await dataResponse.json();

        return {
          community_data: data.community_data || null,
          error: null,
        };
      } catch (error) {
        console.error('Error fetching from CoinGecko API:', error);
        return {
          community_data: null,
          error: error instanceof Error ? error.message : 'Failed to fetch social metrics',
        };
      }
    }),

  /**
   * Birden fazla kripto paranın sosyal metriklerini toplu olarak çek
   */
  getSocialMetricsBatch: publicProcedure
    .input(
      z.object({
        symbols: z.array(z.string()),
      })
    )
    .query(async ({ input }) => {
      try {
        // CoinGecko coin ID'lerini bul
        const listResponse = await fetch(
          `${COINGECKO_API_URL}/coins/list?include_platform=false`
        );

        if (!listResponse.ok) {
          throw new Error(`Failed to fetch coin list: ${listResponse.status}`);
        }

        const coinList = await listResponse.json();
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
            } else {
              results[symbol] = null;
            }

            // Rate limit'i aşmamak için kısa bir gecikme
            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error);
            results[symbol] = null;
          }
        }

        return results;
      } catch (error) {
        console.error('Error in batch fetch:', error);
        throw error;
      }
    }),
});

