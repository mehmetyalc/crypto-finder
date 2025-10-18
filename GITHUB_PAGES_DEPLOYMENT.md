# GitHub Pages'e Kripto Para Bulucu Uygulamasını Yayınlama

Bu rehber, uygulamayı GitHub Pages üzerinde canlı olarak yayınlamak için adım adım talimatlar içerir.

---

## 📋 Ön Koşullar

- GitHub hesabı (https://github.com/signup)
- Git kurulu (https://git-scm.com/download)
- Terminal/Command Prompt erişimi
- Proje dosyaları hazır

---

## 🚀 ADIM 1: GitHub'da Repository Oluştur

### 1.1 GitHub'a Git
1. https://github.com adresine git
2. Sağ üst köşede **"+"** simgesine tıkla
3. **"New repository"** seçeneğini tıkla

### 1.2 Repository Ayarlarını Yap
```
Repository name: crypto-finder
Description: Kripto Para Risk Analiz Uygulaması
Visibility: Public (herkes görebilsin)
```

### 1.3 Repository'yi Oluştur
- **"Create repository"** butonuna tıkla
- Repository URL'ni kopyala (örn: `https://github.com/kullaniciadi/crypto-finder.git`)

---

## 💻 ADIM 2: Lokal Projeni Git ile Hazırla

### 2.1 Terminal'i Aç
Proje klasörüne git:
```bash
cd /home/ubuntu/crypto-finder
```

### 2.2 Git Konfigürasyonu Yap (İlk Defa)
```bash
git config --global user.name "Adın Soyadın"
git config --global user.email "email@example.com"
```

### 2.3 Git Repository'sini İnitle
```bash
git init
```

### 2.4 GitHub'a Bağla
Aşağıdaki komutları çalıştır (URL'yi kendi repository URL'inle değiştir):
```bash
git remote add origin https://github.com/KULLANICIADI/crypto-finder.git
git branch -M main
```

### 2.5 Dosyaları Ekle ve Commit Et
```bash
git add .
git commit -m "İlk commit: Kripto para bulucu uygulaması"
```

### 2.6 GitHub'a Push Et
```bash
git push -u origin main
```

**Not:** GitHub hesabı bilgilerini girmesi istenebilir. Eğer hata alırsan, GitHub Personal Access Token kullan:
1. GitHub Settings → Developer settings → Personal access tokens
2. "Generate new token" tıkla
3. "repo" izni seç
4. Token'ı kopyala
5. Terminal'de şifre yerine token'ı yapıştır

---

## 🌐 ADIM 3: Vite Build Ayarlarını Yap

### 3.1 vite.config.ts Dosyasını Aç
```bash
# Dosyayı düzenle
nano vite.config.ts
```

### 3.2 Base Path Ayarı Ekle
Dosyada şu satırı bul:
```typescript
export default defineConfig({
  // ...
})
```

Şöyle değiştir:
```typescript
export default defineConfig({
  base: '/crypto-finder/',  // Repository adınız
  // ... diğer ayarlar
})
```

### 3.3 Dosyayı Kaydet
- Ctrl+X → Y → Enter (nano editörde)

### 3.4 Değişiklikleri Commit Et
```bash
git add vite.config.ts
git commit -m "Vite base path ayarı eklendi"
git push origin main
```

---

## 🔨 ADIM 4: Projeyi Build Et

### 4.1 Bağımlılıkları Yükle
```bash
pnpm install
```

### 4.2 Projeyi Build Et
```bash
pnpm build
```

**Beklenen Çıktı:**
```
✓ 1234 modules transformed.
dist/index.html                   12.34 kB │ gzip: 3.45 kB
dist/assets/index-abc123.js      234.56 kB │ gzip: 67.89 kB
✓ built in 12.34s
```

### 4.3 Build Dosyalarını GitHub'a Ekle
```bash
git add dist/
git commit -m "Build dosyaları eklendi"
git push origin main
```

---

## ⚙️ ADIM 5: GitHub Pages'i Etkinleştir

### 5.1 Repository Ayarlarına Git
1. GitHub'da repository sayfasına git
2. **"Settings"** sekmesine tıkla (sağ tarafta)

### 5.2 Pages Ayarlarını Yap
1. Sol menüde **"Pages"** seçeneğini tıkla
2. **"Source"** bölümünde:
   - **Branch:** `main` seç
   - **Folder:** `/ (root)` seç
3. **"Save"** butonuna tıkla

### 5.3 Deployment Bekle
- GitHub otomatik olarak deploy edecektir
- 1-2 dakika bekle
- Sayfayı yenile (F5)

### 5.4 Canlı Site URL'sini Bul
Settings → Pages bölümünde şu mesajı göreceksin:
```
Your site is live at: https://kullaniciadi.github.io/crypto-finder/
```

---

## ✅ ADIM 6: Siteyi Test Et

### 6.1 Tarayıcıda Aç
URL'yi tarayıcıya yapıştır:
```
https://kullaniciadi.github.io/crypto-finder/
```

### 6.2 Kontrol Listesi
- [ ] Sayfa yükleniyor mu?
- [ ] Kripto para listesi gösteriliyor mu?
- [ ] Grafikler görünüyor mu?
- [ ] Filtreler çalışıyor mu?
- [ ] Tablolar düzgün gösteriliyor mu?

---

## 🔄 ADIM 7: Güncellemeleri Yayınla

Proje üzerinde değişiklik yaptıktan sonra:

### 7.1 Değişiklikleri Commit Et
```bash
git add .
git commit -m "Açıklayıcı mesaj (örn: Yeni özellik eklendi)"
```

### 7.2 Build Et
```bash
pnpm build
```

### 7.3 GitHub'a Push Et
```bash
git add dist/
git commit -m "Build güncellemesi"
git push origin main
```

**Otomatik Güncelleme:** GitHub Pages 1-2 dakika içinde otomatik olarak güncellenecektir.

---

## 🎯 GitHub Actions ile Otomatik Deployment (İLERİ)

### 7.1 GitHub Actions Workflow Oluştur
`.github/workflows/deploy.yml` dosyası oluştur:

```bash
mkdir -p .github/workflows
```

### 7.2 Deploy Dosyasını Oluştur
`nano .github/workflows/deploy.yml` ile dosya oluştur:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 7.3 Workflow'u Commit Et
```bash
git add .github/workflows/deploy.yml
git commit -m "GitHub Actions workflow eklendi"
git push origin main
```

**Sonuç:** Bundan sonra her push'ta otomatik olarak build ve deploy olacaktır.

---

## ⚠️ Önemli Notlar

### API Anahtarları
**Asla API anahtarlarını GitHub'a yükleme!**

1. `.env` dosyasını `.gitignore`'a ekle:
```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

2. GitHub Secrets kullan:
   - Settings → Secrets and variables → Actions
   - "New repository secret" tıkla
   - API anahtarlarını ekle

### Build Dosyaları
`dist/` klasörü büyük olabilir. Eğer sorun yaşarsan:
```bash
# Git LFS kullan (Large File Storage)
git lfs install
git lfs track "dist/**"
```

### Custom Domain
Kendi domain'ini kullanmak istersen:
1. Settings → Pages
2. "Custom domain" bölümüne domain adını gir
3. DNS ayarlarını GitHub'ın gösterdiği şekilde yap

---

## 🐛 Sorun Giderme

### Sayfa Boş Gözüküyor
```bash
# 1. Cache'i temizle
# Tarayıcı: Ctrl+Shift+Delete

# 2. Build dosyalarını kontrol et
ls -la dist/

# 3. Yeniden build et
pnpm build
git add dist/
git push origin main
```

### 404 Hatası
- URL'nin doğru olduğunu kontrol et
- `vite.config.ts`'de `base` path'i kontrol et
- GitHub Pages deployment'ın tamamlandığını bekle

### Build Hatası
```bash
# Bağımlılıkları yeniden yükle
rm -rf node_modules
pnpm install
pnpm build
```

### GitHub Push Hatası
```bash
# Lokal değişiklikleri kontrol et
git status

# Eğer conflict varsa
git pull origin main
# Çakışmaları çöz ve tekrar push et
git push origin main
```

---

## 📊 Deployment Kontrol Listesi

- [ ] GitHub repository oluşturdum
- [ ] Lokal projemi git ile bağladım
- [ ] vite.config.ts'de base path ayarladım
- [ ] Projeyi build ettim
- [ ] dist/ klasörünü GitHub'a yükledim
- [ ] GitHub Pages'i etkinleştirdim
- [ ] Canlı site URL'sini buldum
- [ ] Siteyi tarayıcıda test ettim
- [ ] Tüm özellikler çalışıyor

---

## 🎉 Tamamlandı!

Kripto para bulucu uygulamanız artık GitHub Pages'de canlı! 🚀

### Paylaşılacak Linkler
- **GitHub Repository:** `https://github.com/kullaniciadi/crypto-finder`
- **Canlı Site:** `https://kullaniciadi.github.io/crypto-finder/`

### Sonraki Adımlar
1. Arkadaşlarınla paylaş
2. Sosyal medyada duyur
3. Yeni özellikler ekle
4. Feedback al ve iyileştir

---

## 📚 Faydalı Kaynaklar

- [GitHub Pages Dokümantasyonu](https://pages.github.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions](https://github.com/features/actions)
- [Git Cheat Sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf)

---

**Sorular mı var? GitHub Issues'de soru sor!** 💬

