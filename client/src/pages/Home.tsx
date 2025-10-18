import { useState, useMemo } from 'react';
import { useCryptoData } from '@/hooks/useCryptoData';
import { filterCryptos, groupByRiskLevel } from '@/lib/riskCalculator';
import { FilterOptions } from '@/lib/types';
import { FilterControls } from '@/components/FilterControls';
import { CryptoTable } from '@/components/CryptoTable';
import { RiskDistributionChart } from '@/components/RiskDistributionChart';
import { MarketCapChart } from '@/components/MarketCapChart';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { cryptos, loading: cryptoLoading, error: cryptoError, refetch } = useCryptoData(100);
  const [filters, setFilters] = useState<FilterOptions>({
    riskLevel: 'all',
    sortBy: 'riskScore',
    sortOrder: 'asc',
  });

  // Filtrelenmiş ve sıralanmış kripto paralar
  const filteredCryptos = useMemo(() => {
    return filterCryptos(cryptos, filters);
  }, [cryptos, filters]);

  // Risk seviyesine göre gruplandırılmış kripto paralar
  const groupedCryptos = useMemo(() => {
    return groupByRiskLevel(cryptos);
  }, [cryptos]);

  // İstatistikler
  const stats = useMemo(() => {
    return {
      totalCryptos: cryptos.length,
      avgRiskScore:
        cryptos.length > 0
          ? Math.round(
              cryptos.reduce((sum, c) => sum + c.riskScore, 0) / cryptos.length
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
                Risk seviyesine göre kripto paralar bulun ve analiz edin
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
                <p className="text-sm text-red-700">{cryptoError}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Yükleniyor */}
        {cryptoLoading && cryptos.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Kripto para verileri yükleniyor...</p>
            </div>
          </div>
        )}

        {/* İçerik */}
        {!cryptoLoading && cryptos.length > 0 && (
          <>
            {/* İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="text-sm text-gray-600">Toplam Kripto</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalCryptos}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Ort. Risk Skoru</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.avgRiskScore}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Toplam Market Cap</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  ${(stats.totalMarketCap / 1_000_000_000_000).toFixed(2)}T
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600">Toplam 24h Hacim</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  ${(stats.totalVolume / 1_000_000_000_000).toFixed(2)}T
                </div>
              </Card>
            </div>

            {/* Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <RiskDistributionChart cryptos={cryptos} />
              <MarketCapChart cryptos={cryptos} />
            </div>

            {/* Filtreler */}
            <FilterControls
              filters={filters}
              onFiltersChange={setFilters}
            />

            {/* Tablolar */}
            <div className="space-y-6">
              <CryptoTable
                cryptos={groupedCryptos.low}
                title={`Düşük Risk Kriptolar (${groupedCryptos.low.length})`}
              />
              <CryptoTable
                cryptos={groupedCryptos.medium}
                title={`Orta Risk Kriptolar (${groupedCryptos.medium.length})`}
              />
              <CryptoTable
                cryptos={groupedCryptos.high}
                title={`Yüksek Risk Kriptolar (${groupedCryptos.high.length})`}
              />
            </div>

            {/* Filtrelenmiş Sonuçlar */}
            {filters.riskLevel !== 'all' && (
              <div className="mt-6">
                <CryptoTable
                  cryptos={filteredCryptos}
                  title="Filtrelenmiş Sonuçlar"
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-600 text-center">
            Veriler CoinMarketCap API'sinden alınmaktadır. Her 5 dakikada bir güncellenir.
          </p>
        </div>
      </footer>
    </div>
  );
}

