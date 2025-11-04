import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { CryptoData, EnrichedCryptoData } from '@/lib/types';
import { enrichCryptoData } from '@/lib/riskCalculator';

interface UseCryptoDataReturn {
  cryptos: EnrichedCryptoData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * tRPC aracılığıyla CoinMarketCap API'den kripto para verilerini çek ve zenginleştir
 * CoinGecko API'den kategorileri çek
 */
export function useCryptoData(limit: number = 100): UseCryptoDataReturn {
  const [cryptos, setCryptos] = useState<EnrichedCryptoData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // tRPC query'sini çağır - CoinMarketCap verisi
  const { data, isLoading, error: queryError, refetch: trpcRefetch } = trpc.crypto.getListings.useQuery(
    { limit, start: 1 },
    {
      staleTime: 5 * 60 * 1000, // 5 dakika
      gcTime: 10 * 60 * 1000, // 10 dakika
    }
  );

  // Verileri zenginleştir ve CoinGecko kategorilerini çek
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      try {
        const enrichedCryptos = data.data.map((crypto: CryptoData) =>
          enrichCryptoData(crypto)
        );
        
        // CoinGecko'dan kategorileri çek
        const fetchCategories = async () => {
          try {
            const symbols = enrichedCryptos.map((c: EnrichedCryptoData) => c.symbol.toLowerCase()).slice(0, 30);
            const categoryMap: Record<string, string> = {};
            
            for (const symbol of symbols) {
              try {
                const response = await fetch(
                  `https://api.coingecko.com/api/v3/search?query=${symbol}`
                );
                if (response.ok) {
                  const result = await response.json();
                  if (result.coins && result.coins.length > 0) {
                    const coin = result.coins[0];
                    if (coin.categories && coin.categories.length > 0) {
                      categoryMap[symbol] = coin.categories[0];
                    }
                  }
                }
              } catch (err) {
                console.warn(`Failed to fetch category for ${symbol}`);
              }
            }
            
            // Kategorileri enriched data'ya ekle
            const cryptosWithCategories = enrichedCryptos.map((crypto: EnrichedCryptoData) => ({
              ...crypto,
              primaryCategory: categoryMap[crypto.symbol.toLowerCase()] || crypto.primaryCategory
            }));
            
            setCryptos(cryptosWithCategories);
          } catch (err) {
            console.error('Error fetching categories:', err);
            setCryptos(enrichedCryptos);
          }
        };
        
        fetchCategories();
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Veri işleme hatası';
        setError(errorMessage);
        console.error('Error enriching crypto data:', err);
      }
    }
  }, [data]);

  // Hata durumunu yönet
  useEffect(() => {
    if (queryError) {
      const errorMessage = queryError instanceof Error ? queryError.message : 'Veri çekme hatası';
      setError(errorMessage);
      console.error('Error fetching crypto data:', queryError);
    }
  }, [queryError]);

  return {
    cryptos,
    loading: isLoading,
    error,
    refetch: () => trpcRefetch(),
  };
}

