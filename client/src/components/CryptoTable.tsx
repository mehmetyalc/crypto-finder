import { EnrichedCryptoData } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoTableProps {
  cryptos: EnrichedCryptoData[];
}

function getCommunityColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-blue-100 text-blue-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-orange-100 text-orange-800';
}

function getSupplyRatioBadge(ratio: number): string {
  if (ratio >= 0.9) return 'bg-green-100 text-green-800';
  if (ratio >= 0.7) return 'bg-green-50 text-green-700';
  if (ratio >= 0.5) return 'bg-yellow-100 text-yellow-800';
  if (ratio >= 0.3) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

function formatPrice(price: number): string {
  if (price >= 1) {
    return `$${price.toFixed(2)}`;
  }
  return `$${price.toFixed(6)}`;
}

function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1_000_000_000) {
    return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
  }
  if (marketCap >= 1_000_000) {
    return `$${(marketCap / 1_000_000).toFixed(2)}M`;
  }
  return `$${(marketCap / 1_000).toFixed(2)}K`;
}

export function CryptoTable({ cryptos }: CryptoTableProps) {
  if (cryptos.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-gray-500 text-center py-8">
          Filtre kriterlerine uygun kripto para bulunamadı.
        </p>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left font-semibold text-gray-900">#</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">Ad</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-900">Fiyat</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-900">Market Cap</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-900">24h %</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-900">Kategori</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-900">Topluluk Gücü</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-900">Arz Oranı</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto, index) => (
            <tr key={crypto.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-600">{index + 1}</td>
              <td className="px-4 py-3">
                <div>
                  <div className="font-semibold text-gray-900">{crypto.name}</div>
                  <div className="text-gray-500 text-xs">{crypto.symbol.toUpperCase()}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-right text-gray-900 font-semibold">
                {formatPrice(crypto.quote.USD.price)}
              </td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatMarketCap(crypto.quote.USD.market_cap)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  {crypto.quote.USD.percent_change_24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={
                      crypto.quote.USD.percent_change_24h >= 0
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {crypto.quote.USD.percent_change_24h.toFixed(2)}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                {crypto.primaryCategory ? (
                  <Badge variant="outline" className="text-xs">
                    {crypto.primaryCategory}
                  </Badge>
                ) : (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <Badge className={`${getCommunityColor(crypto.communityScore)} text-xs`}>
                  {crypto.communityScore}
                </Badge>
              </td>
              <td className="px-4 py-3 text-center">
                <Badge className={`${getSupplyRatioBadge(crypto.supplyRatio)} text-xs`}>
                  {(crypto.supplyRatio * 100).toFixed(1)}%
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

