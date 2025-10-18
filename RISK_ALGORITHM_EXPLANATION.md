# Kripto Para Risk Skorlama Algoritması - Detaylı Açıklama

## 📊 Genel Yapı

Risk skoru **0-100 arasında** bir değerdir. Daha **yüksek skor = daha düşük risk**, daha **düşük skor = daha yüksek risk** anlamına gelir.

Genel risk skoru, 5 farklı metriğin **ağırlıklı ortalaması**ndan hesaplanır:

```
Risk Skoru = (Market Cap Skoru × 0.25) 
           + (Likidite Skoru × 0.25) 
           + (Arz Oranı Skoru × 0.20) 
           + (Topluluk Gücü Skoru × 0.20) 
           + (Volatilite Skoru × 0.10)
```

---

## 🔍 Her Metriğin Detaylı Açıklaması

### 1️⃣ Market Cap Skoru (25% Ağırlık)

**Ne Ölçer:** Kripto paranın toplam pazar değeri (market capitalization)

**Mantık:** Daha büyük market cap = daha köklü proje = daha düşük risk

**Skor Tablosu:**
```
Market Cap ≥ 1 Milyar USD          → 100 puan (Çok Güvenli)
Market Cap 100M - 1B USD           → 80 puan  (Güvenli)
Market Cap 10M - 100M USD          → 60 puan  (Orta)
Market Cap 1M - 10M USD            → 40 puan  (Riskli)
Market Cap < 1M USD                → 20 puan  (Çok Riskli)
```

**Örnek:**
- Bitcoin (2.1 Trilyon USD) → 100 puan
- Ethereum (470 Milyar USD) → 100 puan
- Küçük altcoin (500K USD) → 20 puan

---

### 2️⃣ Likidite Skoru (25% Ağırlık)

**Ne Ölçer:** 24 saatlik işlem hacmi / Market cap oranı

**Mantık:** Yüksek likidite = paranızı kolayca satabilirsiniz = daha düşük risk

**Formül:**
```
Likidite Oranı = 24h İşlem Hacmi / Market Cap

Likidite Oranı ≥ 0.10 (10%)        → 100 puan (Mükemmel Likidite)
Likidite Oranı 0.05 - 0.10 (5-10%) → 80 puan  (İyi Likidite)
Likidite Oranı 0.01 - 0.05 (1-5%)  → 60 puan  (Orta Likidite)
Likidite Oranı 0.005 - 0.01 (0.5-1%) → 40 puan (Düşük Likidite)
Likidite Oranı < 0.005 (< 0.5%)    → 20 puan  (Çok Düşük Likidite)
```

**Örnek:**
- Bitcoin: 24h Hacim = 30B USD, Market Cap = 2.1T USD
  - Oran = 30B / 2.1T = 0.014 (1.4%) → 60 puan
  
- Küçük coin: 24h Hacim = 50K USD, Market Cap = 5M USD
  - Oran = 50K / 5M = 0.01 (1%) → 60 puan

---

### 3️⃣ Arz Oranı Skoru (20% Ağırlık) ⭐ ÖNEMLİ

**Ne Ölçer:** Dolaşımdaki arz / Toplam arz oranı

**Mantık:** Yüksek arz oranı = az enflasyon riski = daha düşük risk

**Formül:**
```
Arz Oranı = Dolaşımdaki Arz / Toplam Arz

Arz Oranı ≥ 90% (90-100%)          → 100 puan (Çok Düşük Enflasyon Riski)
Arz Oranı 70% - 90%                → 80 puan  (Düşük Enflasyon Riski)
Arz Oranı 50% - 70%                → 60 puan  (Orta Enflasyon Riski)
Arz Oranı 30% - 50%                → 40 puan  (Yüksek Enflasyon Riski)
Arz Oranı < 30%                    → 20 puan  (Çok Yüksek Enflasyon Riski)
```

**Neden Önemli?**

Bir kripto paranın toplam arzının yalnızca %30'u dolaşımdaysa, kalan %70'i gelecekte piyasaya sürülebilir. Bu da:
- Fiyat baskısı oluşturur (arz arttıkça fiyat düşer)
- Mevcut sahiplerin hisselerini seyreltir (dilution)
- Enflasyon riskini artırır

**Örnekler:**
- Bitcoin: Dolaşım = 21M, Toplam = 21M → Oran = 100% → 100 puan ✅
- Ethereum: Dolaşım ≈ 120M, Toplam = Sınırsız (staking) → Oran ≈ 100% → 100 puan ✅
- Polkadot: Dolaşım ≈ 1.2B, Toplam ≈ 1.5B → Oran ≈ 80% → 80 puan
- Shiba Inu: Dolaşım ≈ 589T, Toplam ≈ 1000T → Oran ≈ 59% → 60 puan ⚠️

---

### 4️⃣ Topluluk Gücü Skoru (20% Ağırlık)

**Ne Ölçer:** CoinMarketCap sıralaması (CMC Rank)

**Mantık:** Daha yüksek sırada = daha tanınmış = daha güvenilir

**Skor Tablosu:**
```
CMC Rank 1-10                      → 100 puan (Mega Projeler)
CMC Rank 11-50                     → 90 puan  (Büyük Projeler)
CMC Rank 51-100                    → 80 puan  (Orta Büyük Projeler)
CMC Rank 101-500                   → 60 puan  (Küçük Projeler)
CMC Rank 501-1000                  → 40 puan  (Çok Küçük Projeler)
CMC Rank 1000+                     → 20 puan  (Mikro Projeler)
```

**Örnek:**
- Bitcoin (Rank 1) → 100 puan
- Ethereum (Rank 2) → 100 puan
- Dogecoin (Rank 8) → 100 puan
- Chainlink (Rank 20) → 90 puan
- Bilinmeyen coin (Rank 5000) → 20 puan

---

### 5️⃣ Volatilite Skoru (10% Ağırlık)

**Ne Ölçer:** Fiyat dalgalanması (24h, 7d, 30d yüzde değişimleri)

**Mantık:** Daha az dalgalanma = daha stabil = daha düşük risk

**Formül:**
```
Ortalama Volatilite = (|24h Değişim| + |7d Değişim| + |30d Değişim|) / 3

Volatilite Skoru = max(20, 100 - (Ortalama Volatilite × 1.5))
```

**Örnekler:**
- Stabil Coin (USDT): 24h = ±0.1%, 7d = ±0.2%, 30d = ±0.3%
  - Ort = 0.2% → Skor = 100 - (0.2 × 1.5) = 99.7 puan ✅

- Bitcoin: 24h = ±2%, 7d = ±5%, 30d = ±8%
  - Ort = 5% → Skor = 100 - (5 × 1.5) = 92.5 puan ✅

- Yüksek Volatilite Coin: 24h = ±15%, 7d = ±25%, 30d = ±40%
  - Ort = 26.7% → Skor = 100 - (26.7 × 1.5) = 59.95 puan ⚠️

---

## 📈 Risk Seviyeleri

Genel risk skoru hesaplandıktan sonra, kripto para şu kategorilere ayrılır:

### 🟢 Düşük Risk (67-100 puan)
- **Özellikler:**
  - Yüksek market cap (1B+ USD)
  - İyi likidite
  - Yüksek arz oranı (70%+)
  - Top 100 kripto
  - Düşük volatilite
- **Yatırımcı Profili:** Muhafazakar yatırımcılar, uzun vadeli tutanlar
- **Örnekler:** Bitcoin, Ethereum, BNB, XRP

### 🟡 Orta Risk (34-66 puan)
- **Özellikler:**
  - Orta market cap (10M - 1B USD)
  - Orta likidite
  - Orta arz oranı (50-70%)
  - Top 500 kripto
  - Orta volatilite
- **Yatırımcı Profili:** Dengeli yatırımcılar, portföy çeşitlendirme
- **Örnekler:** Chainlink, Polygon, Avalanche

### 🔴 Yüksek Risk (0-33 puan)
- **Özellikler:**
  - Düşük market cap (< 10M USD)
  - Düşük likidite
  - Düşük arz oranı (< 50%)
  - Top 1000+ kripto
  - Yüksek volatilite
- **Yatırımcı Profili:** Agresif yatırımcılar, yüksek risk toleransı
- **Örnekler:** Yeni projeler, meme coins, mikro cap coins

---

## 💡 Arz Oranı Filtresi - Pratik Kullanım

### Arz Oranı Nedir?

```
Arz Oranı (%) = (Dolaşımdaki Arz / Toplam Arz) × 100
```

### Filtreleme Önerileri

**Muhafazakar Yatırımcılar:**
```
Minimum Arz Oranı: %80
Bu, enflasyon riskini minimize eder
```

**Dengeli Yatırımcılar:**
```
Minimum Arz Oranı: %60
Makul bir enflasyon riski ile iyi fırsatlar sunar
```

**Agresif Yatırımcılar:**
```
Minimum Arz Oranı: %30
Yüksek potansiyel fakat yüksek risk
```

### Arz Oranı Düşük Olduğunda Neler Olur?

Örneğin, bir kripto paranın arz oranı %30 ise:

```
Senaryo: Yeni Tokens Serbest Bırakılıyor
├─ Fiyat Baskısı: Arz arttıkça fiyat düşebilir
├─ Hisse Seyreltme: Mevcut sahiplerin % payı azalır
├─ Enflasyon: Parasal değer zayıflayabilir
└─ Belirsizlik: Ne zaman serbest bırakılacağı bilinmiyor

Örnek Hesaplama:
- Toplam Arz: 1 Milyar Token
- Dolaşım: 300 Milyon Token (30%)
- Kalan: 700 Milyon Token (70%)

Eğer 700M token birden piyasaya sürülürse:
- Arz 2.3x artar
- Fiyat potansiyel olarak 50-70% düşebilir
```

---

## 🎯 Algoritma Avantajları

✅ **Çok Boyutlu Analiz:** Tek bir metrik yerine 5 farklı açıdan değerlendirme

✅ **Ağırlıklı Sistem:** Daha önemli faktörlere daha yüksek ağırlık

✅ **Kolay Anlaşılır:** 0-100 skalası herkes tarafından anlaşılır

✅ **Gerçek Zamanlı:** CoinMarketCap API'den anlık veriler kullanır

✅ **Filtrelenebilir:** Kullanıcılar kendi risk toleransına göre filtreler

---

## ⚠️ Sınırlamalar

❌ **Geçmiş Veriler Yok:** RSI, MACD gibi teknik göstergeler kullanılmıyor (şimdilik)

❌ **Sosyal Sentiment:** Twitter/Reddit aktivitesi analiz edilmiyor

❌ **Proje Kalitesi:** Whitepaper, takım, roadmap analiz edilmiyor

❌ **Düzenleyici Risk:** Yasal statüsü değerlendirilmiyor

❌ **Hack Riski:** Güvenlik denetimi yapılmıyor

---

## 📊 Örnek Hesaplama

### Bitcoin Örneği:

```
Market Cap: 2.1 Trilyon USD
24h Hacim: 30 Milyar USD
Dolaşım: 21 Milyon BTC
Toplam: 21 Milyon BTC
CMC Rank: 1
24h Değişim: +2%
7d Değişim: +5%
30d Değişim: +8%

Skorlar:
├─ Market Cap Skoru: 100 (1T+ USD)
├─ Likidite Skoru: 60 (30B/2.1T = 1.4%)
├─ Arz Oranı Skoru: 100 (100% dolaşımda)
├─ Topluluk Gücü Skoru: 100 (Rank 1)
└─ Volatilite Skoru: 92 (Orta volatilite)

Risk Skoru = (100×0.25) + (60×0.25) + (100×0.20) + (100×0.20) + (92×0.10)
           = 25 + 15 + 20 + 20 + 9.2
           = 89.2 → DÜŞÜK RİSK ✅
```

### Küçük Altcoin Örneği:

```
Market Cap: 50 Milyon USD
24h Hacim: 2 Milyon USD
Dolaşım: 500 Milyon Token
Toplam: 2 Milyar Token
CMC Rank: 2500
24h Değişim: -8%
7d Değişim: -15%
30d Değişim: -25%

Skorlar:
├─ Market Cap Skoru: 60 (10M-100M USD)
├─ Likidite Skoru: 40 (2M/50M = 4%)
├─ Arz Oranı Skoru: 40 (25% dolaşımda)
├─ Topluluk Gücü Skoru: 20 (Rank 2500)
└─ Volatilite Skoru: 40 (Yüksek volatilite)

Risk Skoru = (60×0.25) + (40×0.25) + (40×0.20) + (20×0.20) + (40×0.10)
           = 15 + 10 + 8 + 4 + 4
           = 41 → ORTA RİSK ⚠️
```

---

## 🔄 Gelecek İyileştirmeler

- [ ] RSI ve MACD teknik göstergeleri ekle
- [ ] Sosyal medya sentiment analizi
- [ ] Proje kalitesi puanlaması
- [ ] Düzenleyici risk değerlendirmesi
- [ ] Makine öğrenmesi ile tahminler

