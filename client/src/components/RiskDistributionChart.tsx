import { EnrichedCryptoData } from '@/lib/types';
import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface RiskDistributionChartProps {
  cryptos: EnrichedCryptoData[];
}

export function RiskDistributionChart({ cryptos }: RiskDistributionChartProps) {
  const lowRisk = cryptos.filter((c) => c.riskLevel === 'low').length;
  const mediumRisk = cryptos.filter((c) => c.riskLevel === 'medium').length;
  const highRisk = cryptos.filter((c) => c.riskLevel === 'high').length;

  const data = [
    { name: 'Düşük Risk', value: lowRisk, color: '#10b981' },
    { name: 'Orta Risk', value: mediumRisk, color: '#f59e0b' },
    { name: 'Yüksek Risk', value: highRisk, color: '#ef4444' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Risk Dağılımı</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

