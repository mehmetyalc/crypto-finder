# 🚀 Kripto Para Bulucu - Risk Analiz Uygulaması

Yatırımcılar için gelişmiş kripto para risk analizi ve filtreleme platformu. CoinMarketCap API'sini kullanarak gerçek zamanlı veri sunuyor.

## ✨ Özellikler

### 📊 Risk Skorlama Algoritması
Beş farklı metriğin ağırlıklı ortalaması ile risk skoru hesaplanır:

- **Market Cap (25%)**: Proje büyüklüğü ve istikrarı
- **Likidite (25%)**: 24h hacim / market cap oranı
- **Arz Oranı (20%)**: Dolaşımdaki / Toplam arz (enflasyon riski)
- **Topluluk Gücü (20%)**: CMC rank ve market cap
- **Volatilite (10%)**: Fiyat dalgalanması

### 🎯 Risk Seviyeleri
- 🟢 **Düşük Risk (67-100)**: Bitcoin, Ethereum, BNB
- 🟡 **Orta Risk (34-66)**: Chainlink, Polygon, Avalanche
- 🔴 **Yüksek Risk (0-33)**: Yeni projeler, meme coins

### 🔍 Filtreleme Sistemi
- Risk seviyesine göre filtrele
- Market cap minimum değer ayarla
- Arz oranı minimum değer ayarla
- Sıralama (Risk Skoru, Market Cap, Hacim, Ad)

### 📈 Dashboard
- Risk dağılımı pie chart
- Top 10 kripto para market cap bar chart
- İstatistik kartları (toplam kripto, ortalama risk, vb.)
- Detaylı kripto para tabloları

## 🛠️ Teknoloji Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI bileşenleri
- **Recharts** - Grafikler
- **Wouter** - Routing
- **tRPC** - Type-safe API

### Backend
- **Express.js** - Server
- **tRPC** - API
- **Node.js** - Runtime

### Veri Kaynakları
- **CoinMarketCap API** - Kripto para fiyatları ve metrikleri
- **CoinGecko API** - Sosyal medya metrikleri (opsiyonel)

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- pnpm (veya npm)

### Adımlar

1. **Repository'yi klonla**
```bash
git clone https://github.com/kullaniciadi/crypto-finder.git
cd crypto-finder
```

2. **Bağımlılıkları yükle**
```bash
pnpm install
```

3. **CoinMarketCap API anahtarını ayarla**
```bash
# .env.local dosyası oluştur
echo "VITE_CMC_API_KEY=your_api_key_here" > .env.local
```

4. **Development sunucusunu başlat**
```bash
pnpm dev
```

5. **Tarayıcıda aç**
```
http://localhost:3000
```

## 🚀 Deployment

### GitHub Pages'e Yayınla
Detaylı rehber için `GITHUB_DEPLOYMENT_GUIDE.md` dosyasını oku.

Özet:
```bash
# 1. GitHub'da repository oluştur
# 2. Lokal projeni git ile bağla
git remote add origin https://github.com/kullaniciadi/crypto-finder.git
git push -u origin main

# 3. GitHub Settings → Pages'de etkinleştir
# 4. Build et ve push et
pnpm build
git add dist/
git commit -m "Build files"
git push origin main
```

Canlı site: `https://kullaniciadi.github.io/crypto-finder/`

## 📖 Kullanım

### Ana Sayfa
1. Kripto para listesi otomatik yüklenir
2. Risk dağılımı ve market cap grafiklerini gör
3. Filtreler ile kripto paraları ara

### Filtreleme
- **Risk Seviyesi**: Düşük/Orta/Yüksek Risk
- **Min Market Cap**: Minimum market cap değeri (milyon)
- **Min Arz Oranı**: Minimum arz oranı (%)
- **Sıralama**: Risk Skoru, Market Cap, Hacim, Ad

### Tablolar
- Risk seviyesine göre gruplandırılmış tablolar
- Fiyat, market cap, hacim, 24h değişim gösterir
- Arz oranı renk kodlu (yeşil = güvenli, kırmızı = riskli)

## 📚 Risk Algoritması Detayları

Detaylı açıklama için `RISK_ALGORITHM_EXPLANATION.md` dosyasını oku.

### Örnek Hesaplama (Bitcoin)
```
Market Cap: 2.1 Trilyon USD → 100 puan
Likidite: 1.4% → 60 puan
Arz Oranı: 100% → 100 puan
Topluluk Gücü: Rank 1 → 100 puan
Volatilite: Orta → 92 puan

Risk Skoru = (100×0.25) + (60×0.25) + (100×0.20) + (100×0.20) + (92×0.10)
           = 89.2 → DÜŞÜK RİSK ✅
```

## ⚙️ Konfigürasyon

### Environment Variables
```bash
# .env.local
VITE_CMC_API_KEY=your_coinmarketcap_api_key
```

### Vite Config
```typescript
// vite.config.ts
export default defineConfig({
  base: '/crypto-finder/',  // GitHub Pages için
  // ...
})
```

## 🔄 Güncellemeler

Yeni özellikler eklemek için:

1. Kod değişikliği yap
2. Test et (`pnpm dev`)
3. Commit et (`git commit -m "Açıklama"`)
4. Push et (`git push origin main`)
5. GitHub Pages otomatik güncellenecektir

## 🐛 Bilinen Sorunlar

- CoinGecko API rate limit'e takılabilir (çok fazla istek)
- Bazı küçük kriptolar için sosyal medya verisi eksik olabilir

## 🤝 Katkıda Bulun

1. Repository'yi fork et
2. Feature branch oluştur (`git checkout -b feature/AmazingFeature`)
3. Değişiklikleri commit et (`git commit -m 'Add AmazingFeature'`)
4. Branch'e push et (`git push origin feature/AmazingFeature`)
5. Pull Request aç

## 📄 Lisans

Bu proje MIT Lisansı altında yayınlanmıştır. Detaylar için `LICENSE` dosyasını oku.

## 📞 İletişim

- GitHub Issues: Sorunları ve önerileri bildir
- Email: [Email adresin]

## 🙏 Teşekkürler

- CoinMarketCap - Kripto para verileri
- CoinGecko - Sosyal medya metrikleri
- shadcn/ui - UI bileşenleri
- Recharts - Grafik kütüphanesi

## 📊 Proje Durumu

- ✅ Risk skorlama algoritması
- ✅ Filtreleme sistemi
- ✅ Dashboard ve grafikler
- ✅ Responsive tasarım
- ⏳ Gelişmiş teknik göstergeler (RSI, MACD)
- ⏳ Sosyal medya sentiment analizi
- ⏳ Kullanıcı portföyü takibi

---

**Kripto yatırımı risklidir. Bu uygulama sadece bilgi amaçlıdır. Yatırım kararı almadan önce kendi araştırmanızı yapın!** ⚠️

