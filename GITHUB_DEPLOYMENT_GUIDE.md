# GitHub'a Kripto Para Bulucu Uygulamasını Yayınlama Rehberi

Bu rehber, kripto para bulucu uygulamasını GitHub'a yükleyip GitHub Pages üzerinde yayınlamanızı adım adım anlatır.

---

## 📋 Ön Koşullar

- GitHub hesabı (https://github.com/signup)
- Git kurulu (https://git-scm.com/download)
- Terminal/Command Prompt erişimi

---

## 🚀 Adım 1: GitHub'da Yeni Repository Oluştur

### 1.1 GitHub'a Giriş Yap
1. https://github.com adresine git
2. Sağ üst köşede profil simgesine tıkla
3. "Your repositories" seçeneğini tıkla

### 1.2 Yeni Repository Oluştur
1. Yeşil "New" butonuna tıkla
2. Repository adı gir: `crypto-finder` (veya istediğin ad)
3. Açıklama (Description) gir: "Kripto Para Risk Analiz Uygulaması"
4. "Public" seçeneğini seç (herkes görebilsin)
5. "Create repository" butonuna tıkla

**Önemli:** Repository URL'ni kopyala (örn: `https://github.com/kullaniciadi/crypto-finder.git`)

---

## 💻 Adım 2: Lokal Projeni Git ile Hazırla

### 2.1 Terminal/Command Prompt'u Aç
Proje klasörüne (`crypto-finder`) git:
```bash
cd /home/ubuntu/crypto-finder
```

### 2.2 Git Konfigürasyonu Yap
İlk defa git kullanıyorsan:
```bash
git config --global user.name "Adın Soyadın"
git config --global user.email "email@example.com"
```

### 2.3 Git Repository'sini İnitle
```bash
git init
git add .
git commit -m "İlk commit: Kripto para bulucu uygulaması"
```

### 2.4 GitHub Repository'sine Bağla
Aşağıdaki komutu çalıştır (URL'yi kendi repository URL'inle değiştir):
```bash
git remote add origin https://github.com/kullaniciadi/crypto-finder.git
git branch -M main
git push -u origin main
```

**Not:** GitHub hesabı bilgilerini girmesi istenebilir. GitHub token kullanman gerekebilir:
1. GitHub Settings → Developer settings → Personal access tokens
2. "Generate new token" tıkla
3. "repo" izni seç
4. Token'ı kopyala ve terminal'de şifre yerine yapıştır

---

## 🌐 Adım 3: GitHub Pages'i Etkinleştir

### 3.1 Repository Ayarlarına Git
1. GitHub'da repository sayfasına git
2. "Settings" sekmesine tıkla (sağ tarafta)

### 3.2 GitHub Pages Ayarlarını Yap
1. Sol menüde "Pages" seçeneğini tıkla
2. "Source" bölümünde:
   - Branch: `main` seç
   - Folder: `/ (root)` seç
3. "Save" butonuna tıkla

### 3.3 Build Ayarlarını Yap (Opsiyonel)
Eğer custom build gerekiyorsa:
1. "Build and deployment" bölümünde
2. "GitHub Actions" seçeneğini seç

---

## 📦 Adım 4: Build Dosyalarını Hazırla

### 4.1 Projeyi Build Et
Terminal'de proje klasöründe:
```bash
pnpm install
pnpm build
```

### 4.2 Build Çıktısını Kontrol Et
Build dosyaları şu klasörde olmalı:
```
crypto-finder/dist/
```

### 4.3 GitHub'a Push Et
```bash
git add dist/
git commit -m "Build dosyaları eklendi"
git push origin main
```

---

## ✅ Adım 5: Deployment'ı Kontrol Et

### 5.1 GitHub Pages Durumunu Kontrol Et
1. Repository → Settings → Pages
2. "Your site is live at: https://kullaniciadi.github.io/crypto-finder/" mesajını göreceksin

### 5.2 Siteyi Ziyaret Et
Tarayıcıda aşağıdaki URL'yi aç:
```
https://kullaniciadi.github.io/crypto-finder/
```

**Not:** Deployment 1-2 dakika sürebilir. Sayfayı yenilemek gerekebilir.

---

## 🔄 Adım 6: Güncellemeleri Push Et

Proje üzerinde değişiklik yaptıktan sonra:

```bash
# Değişiklikleri stage et
git add .

# Commit et
git commit -m "Açıklayıcı mesaj (örn: Yeni özellik eklendi)"

# GitHub'a push et
git push origin main
```

GitHub Pages otomatik olarak güncellenecektir (1-2 dakika sonra).

---

## 🎯 Önemli Notlar

### API Anahtarları
⚠️ **Dikkat:** API anahtarlarını asla GitHub'a yükleme!

1. `.env` dosyasını `.gitignore`'a ekle:
```
# .gitignore dosyasında şu satırları ekle
.env
.env.local
.env.*.local
```

2. GitHub Secrets kullan:
   - Settings → Secrets and variables → Actions
   - "New repository secret" tıkla
   - API anahtarlarını ekle

### Build Ayarları
GitHub Pages için `vite.config.ts`'de base path ayarla:
```typescript
export default defineConfig({
  base: '/crypto-finder/',  // Repository adınız
  // ...
})
```

### Custom Domain (Opsiyonel)
Kendi domain'ini kullanmak istersen:
1. Settings → Pages
2. "Custom domain" bölümüne domain adını gir
3. DNS ayarlarını GitHub'ın gösterdiği şekilde yap

---

## 🐛 Sorun Giderme

### Sayfa Boş Gözüküyor
- Tarayıcı cache'ini temizle (Ctrl+Shift+Delete)
- GitHub Pages deployment'ın tamamlanmasını bekle
- Browser console'da (F12) hata mesajlarını kontrol et

### Build Hatası
```bash
# Node modules'ü yeniden yükle
rm -rf node_modules
pnpm install
pnpm build
```

### Git Push Hatası
```bash
# Lokal değişiklikleri kontrol et
git status

# Eğer conflict varsa
git pull origin main
# Çakışmaları çöz ve tekrar push et
```

---

## 📚 Faydalı Kaynaklar

- GitHub Pages Dokümantasyonu: https://pages.github.com/
- Git Rehberi: https://git-scm.com/book/tr/v2
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html

---

## 🎉 Tamamlandı!

Kripto para bulucu uygulamanız artık GitHub'da canlı! 🚀

Başkalarıyla paylaş:
- GitHub Repository: `https://github.com/kullaniciadi/crypto-finder`
- Canlı Site: `https://kullaniciadi.github.io/crypto-finder/`

