import { useState } from 'react';
import { EnrichedCryptoData } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunityDetailsModal } from './CommunityDetailsModal';
import { calculateCommunityMetrics, getCommunityStrengthColor } from '@/lib/communityCalculator';

interface CryptoTableProps {
  cryptos: EnrichedCryptoData[];
  title: string;
}

function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getRiskLevelLabel(riskLevel: string): string {
  switch (riskLevel) {
    case 'low':
      return 'Düşük Risk';
    case 'medium':
      return 'Orta Risk';
    case 'high':
      return 'Yüksek Risk';
    default:
      return 'Bilinmeyen';
  }
}

function getSupplyRatioBadge(ratio: number): string {
  if (ratio >= 0.9) return 'bg-green-100 text-green-800';
  if (ratio >= 0.7) return 'bg-green-50 text-green-700';
  if (ratio >= 0.5) return 'bg-yellow-100 text-yellow-800';
  if (ratio >= 0.3) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

export function CryptoTable({ cryptos, title }: CryptoTableProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<EnrichedCryptoData | null>(null);

  if (cryptos.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-8">
          Bu kategoride kripto para bulunamadı.
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Adı</th>
                <th className="text-right py-3 px-4 font-semibold">Fiyat</th>
                <th className="text-right py-3 px-4 font-semibold">Market Cap</th>
                <th className="text-right py-3 px-4 font-semibold">24h Hacim</th>
                <th className="text-right py-3 px-4 font-semibold">24h Değişim</th>
                <th className="text-right py-3 px-4 font-semibold">Risk Skoru</th>
                <th className="text-right py-3 px-4 font-semibold">Arz Oranı</th>
                <th className="text-center py-3 px-4 font-semibold">Topluluk</th>
              </tr>
            </thead>
            <tbody>
              {cryptos.map((crypto) => {
                const communityMetrics = calculateCommunityMetrics(crypto.social_metrics);
                return (
                  <tr
                    key={crypto.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {crypto.name}
                        </div>
                        <div className="text-gray-500 text-xs">{crypto.symbol}</div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-mono">
                      ${crypto.quote.USD.price.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4 font-mono">
                      ${(crypto.quote.USD.market_cap / 1_000_000_000).toFixed(2)}B
                    </td>
                    <td className="text-right py-3 px-4 font-mono">
                      ${(crypto.quote.USD.volume_24h / 1_000_000_000).toFixed(2)}B
                    </td>
                    <td className="text-right py-3 px-4">
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
                    <td className="text-right py-3 px-4">
                      <Badge className={`${getRiskColor(crypto.riskLevel)}`}>
                        {crypto.riskScore}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Badge className={`${getSupplyRatioBadge(crypto.supplyRatio)}`}>
                        {(crypto.supplyRatio * 100).toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCrypto(crypto)}
                        className="h-8 w-8 p-0"
                        title="Topluluk detaylarını gör"
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Toplam: {cryptos.length} kripto para
        </div>
      </Card>

      {/* Topluluk Detayları Modal */}
      {selectedCrypto && (
        <CommunityDetailsModal
          name={selectedCrypto.name}
          symbol={selectedCrypto.symbol}
          socialMetrics={selectedCrypto.social_metrics}
          isOpen={!!selectedCrypto}
          onClose={() => setSelectedCrypto(null)}
        />
      )}
    </>
  );
}

