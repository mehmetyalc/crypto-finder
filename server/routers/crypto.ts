import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

const CMC_API_KEY = 'fc216752-707d-48a2-a86f-6c33cbe2476c';
const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

export const cryptoRouter = router({
  /**
   * CoinMarketCap API'sinden kripto para verilerini proxy aracılığıyla çek
   */
  getListings: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(5000).default(100),
        start: z.number().min(1).default(1),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await fetch(
          `${CMC_API_URL}?start=${input.start}&limit=${input.limit}&convert=USD`,
          {
            headers: {
              'X-CMC_PRO_API_KEY': CMC_API_KEY,
              'Accepts': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`CMC API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching from CMC API:', error);
        throw new Error(
          error instanceof Error ? error.message : 'Failed to fetch crypto data'
        );
      }
    }),
});

