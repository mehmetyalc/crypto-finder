import { useState, useMemo } from 'react';
import { useCryptoData } from '@/hooks/useCryptoData';
import { filterCryptos, groupByCategory } from '@/lib/riskCalculator';
import { FilterOptions } from '@/lib/types';
import { FilterControls } from '@/components/FilterControls';
import { CryptoTable } from '@/components/CryptoTable';
import { MarketCapChart } from '@/components/MarketCapChart';
import { SupplyRatioInfo } from '@/components/SupplyRatioInfo';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { cryptos, loading: cryptoLoading, error: cryptoError, refetch } = useCryptoData(100);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'marketCap',
    sortOrder: 'desc',
  });

  // Filtrelenmiş ve sıralanmış kripto paralar
  const filteredCryptos = useMemo(() => {
    return filterCryptos(cryptos, filters);
  }, [cryptos, filters]);

  // Kategoriye göre gruplandırılmış kripto paralar
  const groupedCryptos = useMemo(() => {
    return groupByCategory(cryptos);
  }, [cryptos]);

  // İstatistikler
  const stats = useMemo(() => {
    return {
      totalCryptos: cryptos.length,
      avgCommunityScore:
        cryptos.length > 0
          ? Math.round(
              cryptos.reduce((sum, c) => sum + c.communityScore, 0) / cryptos.length
            )
          : 0,
      totalMarketCap: cryptos.reduce(
        (sum, c) => sum + c.quote.USD.market_cap,
        0
      ),
      totalVolume: cryptos.reduce((sum, c) => sum + c.quote.USD.volume_24h, 0),
    };
  }, [cryptos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Kripto Para Bulucu
              </h1>
              <p className="text-gray-600 mt-1">
                Topluluk gücü ve kategorilerine göre kripto paralar bulun ve analiz edin
              </p>
            </div>
            <Button
              onClick={refetch}
              disabled={cryptoLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${cryptoLoading ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hata Mesajı */}
        {cryptoError && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Hata</h3>
                <p className="text-red-700">{cryptoError}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Yükleniyor */}
        {cryptoLoading && cryptos.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Kripto para verileri yükleniyor...</span>
          </div>
        )}

        {!cryptoLoading && cryptos.length > 0 && (
          <>
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6 bg-white">
                <div className="text-sm text-gray-600">Toplam Kripto</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalCryptos}
                </div>
              </Card>
              <Card className="p-6 bg-white">
                <div className="text-sm text-gray-600">Ort. Topluluk Gücü</div>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.avgCommunityScore}
                </div>
              </Card>
              <Card className="p-6 bg-white">
                <div className="text-sm text-gray-600">Toplam Market Cap</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  ${(stats.totalMarketCap / 1_000_000_000).toFixed(2)}B
                </div>
              </Card>
              <Card className="p-6 bg-white">
                <div className="text-sm text-gray-600">24h Hacim</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  ${(stats.totalVolume / 1_000_000_000).toFixed(2)}B
                </div>
              </Card>
            </div>

            {/* Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Top 10 Market Cap
                </h2>
                <MarketCapChart cryptos={filteredCryptos.slice(0, 10)} />
              </Card>
              <Card className="p-6 bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Kategoriler
                </h2>
                <div className="space-y-2">
                  {Object.entries(groupedCryptos).map(([category, coins]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{category}</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {coins.length} coin
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Arz Oranı Bilgisi */}
            <SupplyRatioInfo />

            {/* Filtreler */}
            <Card className="p-6 bg-white mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h2>
              <FilterControls filters={filters} onFiltersChange={setFilters} />
            </Card>

            {/* Kripto Tablosu */}
            <Card className="p-6 bg-white">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Kripto Paralar ({filteredCryptos.length})
              </h2>
              <CryptoTable cryptos={filteredCryptos} />
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

