import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, TrendingDown } from 'lucide-react';

export function SupplyRatioInfo() {
  return (
    <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Arz Oranı Nedir?</h3>
            <p className="text-sm text-blue-800">
              <strong>Arz Oranı = (Dolaşımdaki Arz / Toplam Arz) × 100</strong>
            </p>
            <p className="text-sm text-blue-800 mt-2">
              Bir kripto paranın ne kadarının şu anda piyasada olduğunu gösterir. 
              Kalan kısım gelecekte serbest bırakılabilir.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {/* Yüksek Arz Oranı */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-900">90%+ (Güvenli)</span>
            </div>
            <p className="text-xs text-green-800">
              Neredeyse tüm arz dolaşımda. Enflasyon riski çok düşük.
            </p>
            <p className="text-xs text-green-700 mt-1 font-semibold">
              ✅ Bitcoin, Ethereum
            </p>
          </div>

          {/* Orta Arz Oranı */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-yellow-600" />
              <span className="font-semibold text-yellow-900">50-70% (Orta)</span>
            </div>
            <p className="text-xs text-yellow-800">
              Makul enflasyon riski. Gelecekte daha fazla token serbest bırakılabilir.
            </p>
            <p className="text-xs text-yellow-700 mt-1 font-semibold">
              ⚠️ Çoğu altcoin
            </p>
          </div>

          {/* Düşük Arz Oranı */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="font-semibold text-red-900">&lt;30% (Riskli)</span>
            </div>
            <p className="text-xs text-red-800">
              Çoğu token henüz dolaşımda değil. Yüksek enflasyon riski!
            </p>
            <p className="text-xs text-red-700 mt-1 font-semibold">
              ❌ Yeni projeler
            </p>
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-3 mt-4">
          <p className="text-sm text-gray-700">
            <strong>💡 Filtreleme Önerisi:</strong>
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
            <li>• <strong>Muhafazakar:</strong> %80+ arz oranı filtrele</li>
            <li>• <strong>Dengeli:</strong> %60+ arz oranı filtrele</li>
            <li>• <strong>Agresif:</strong> %30+ arz oranı filtrele</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

