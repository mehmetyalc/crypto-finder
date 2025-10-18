import { FilterOptions } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function FilterControls({
  filters,
  onFiltersChange,
}: FilterControlsProps) {
  const handleRiskLevelChange = (value: string) => {
    onFiltersChange({
      ...filters,
      riskLevel: value as 'low' | 'medium' | 'high' | 'all',
    });
  };

  const handleSortByChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value as 'riskScore' | 'marketCap' | 'volume' | 'name',
    });
  };

  const handleSortOrderChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortOrder: value as 'asc' | 'desc',
    });
  };

  const handleMinMarketCapChange = (value: string) => {
    const num = value ? parseFloat(value) * 1_000_000 : undefined;
    onFiltersChange({
      ...filters,
      minMarketCap: num,
    });
  };

  const handleMinSupplyRatioChange = (value: string) => {
    const num = value ? parseFloat(value) / 100 : undefined;
    onFiltersChange({
      ...filters,
      minSupplyRatio: num,
    });
  };

  const handleReset = () => {
    onFiltersChange({
      riskLevel: 'all',
      sortBy: 'riskScore',
      sortOrder: 'asc',
    });
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filtreler</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Risk Seviyesi */}
        <div>
          <label className="block text-sm font-medium mb-2">Risk Seviyesi</label>
          <Select
            value={filters.riskLevel || 'all'}
            onValueChange={handleRiskLevelChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="low">Düşük Risk</SelectItem>
              <SelectItem value="medium">Orta Risk</SelectItem>
              <SelectItem value="high">Yüksek Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sıralama */}
        <div>
          <label className="block text-sm font-medium mb-2">Sırala</label>
          <Select
            value={filters.sortBy || 'riskScore'}
            onValueChange={handleSortByChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="riskScore">Risk Skoru</SelectItem>
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="volume">24h Hacim</SelectItem>
              <SelectItem value="name">Ad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sıralama Yönü */}
        <div>
          <label className="block text-sm font-medium mb-2">Yön</label>
          <Select
            value={filters.sortOrder || 'asc'}
            onValueChange={handleSortOrderChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Artan</SelectItem>
              <SelectItem value="desc">Azalan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Market Cap */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Min Market Cap (Milyon)
          </label>
          <Input
            type="number"
            placeholder="0"
            onChange={(e) => handleMinMarketCapChange(e.target.value)}
          />
        </div>

        {/* Min Supply Ratio */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Min Arz Oranı (%)
            <span className="text-xs text-gray-500 block mt-1">
              Dolaşımdaki arz / Toplam arz
            </span>
          </label>
          <Input
            type="number"
            placeholder="0"
            min="0"
            max="100"
            onChange={(e) => handleMinSupplyRatioChange(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 %70 altı = Enflasyon riski
          </p>
        </div>

        {/* Reset Butonu */}
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full"
          >
            Sıfırla
          </Button>
        </div>
      </div>
    </Card>
  );
}

