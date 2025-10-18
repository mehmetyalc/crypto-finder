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
 */
export function useCryptoData(limit: number = 100): UseCryptoDataReturn {
  const [cryptos, setCryptos] = useState<EnrichedCryptoData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // tRPC query'sini çağır
  const { data, isLoading, error: queryError, refetch: trpcRefetch } = trpc.crypto.getListings.useQuery(
    { limit, start: 1 },
    {
      staleTime: 5 * 60 * 1000, // 5 dakika
      gcTime: 10 * 60 * 1000, // 10 dakika
    }
  );

  // Verileri zenginleştir ve state'e kaydet
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      try {
        const enrichedCryptos = data.data.map((crypto: CryptoData) =>
          enrichCryptoData(crypto)
        );
        setCryptos(enrichedCryptos);
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

