import { EnrichedCryptoData } from '@/lib/types';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface MarketCapChartProps {
  cryptos: EnrichedCryptoData[];
}

export function MarketCapChart({ cryptos }: MarketCapChartProps) {
  // Top 10 kripto parayı al
  const topCryptos = cryptos.slice(0, 10).map((crypto) => ({
    name: crypto.symbol,
    marketCap: crypto.quote.USD.market_cap / 1_000_000_000, // Milyar cinsinden
    riskLevel: crypto.riskLevel,
  }));

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Top 10 Market Cap (Milyar USD)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topCryptos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => `$${(value as number).toFixed(2)}B`}
          />
          <Bar dataKey="marketCap" fill="#3b82f6">
            {topCryptos.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getRiskColor(entry.riskLevel)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

