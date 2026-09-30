# KORTEKS'i App Store ve Google Play'e yükleme rehberi

KORTEKS bir web uygulamasıdır. Mağazalara, web kodunu yerel bir uygulama kabuğuna saran **Capacitor** ile gönderilir. Proje buna hazır: ayar dosyası (`capacitor.config.json`), simgeler, gizlilik politikası, ekran görüntüleri ve mağaza metinleri depoda bulunuyor.

## Gerekenler

| | Google Play | App Store |
|---|---|---|
| Geliştirici hesabı | [Google Play Console](https://play.google.com/console), tek seferlik 25 $ | [Apple Developer Program](https://developer.apple.com/programs/), yıllık 99 $ |
| Bilgisayar | Windows, macOS veya Linux + [Android Studio](https://developer.android.com/studio) | **Mac zorunlu** + [Xcode](https://developer.apple.com/xcode/) |
| Yaş | 18+ (değilsen bir veli adına hesap açılmalı) | 18+ (değilsen bir veli adına hesap açılmalı) |

> Mağaza şartları ve ücretler değişebilir; başvurmadan önce resmi sayfalardan kontrol et.

## 1. Hazırlık (bir kez)

```bash
git clone https://github.com/bgelegen/korteks.git
cd korteks
npm install
npm test          # her şeyin çalıştığından emin ol
```

## 2. Android (Google Play)

```bash
npm run cap:android   # android/ klasörünü oluşturur ve Android Studio'yu açar
```

Android Studio'da:
1. **app/res** klasörüne sağ tıkla → **New → Image Asset** → `store/icon-1024.png` dosyasını seç (uygulama simgesi).
2. **Build → Generate Signed App Bundle** → yeni bir imza anahtarı oluştur. **Bu anahtarı ve şifresini kaybetme**, sonraki güncellemeler için gerekir.
3. Oluşan `.aab` dosyasını Play Console'da **Üretim → Yeni sürüm** kısmına yükle.

## 3. iOS (App Store)

```bash
npm run cap:ios       # ios/ klasörünü oluşturur ve Xcode'u açar (Mac gerekir)
```

Xcode'da:
1. **App → Signing & Capabilities** → Apple geliştirici hesabını seç.
2. **Assets → AppIcon** → `store/icon-1024.png` dosyasını sürükle.
3. **Product → Archive** → **Distribute App** → App Store Connect.
4. [App Store Connect](https://appstoreconnect.apple.com)'te uygulama sayfasını doldur ve incelemeye gönder.

## 4. Kod güncelledikten sonra

```bash
npm run cap:sync      # önbellek listesini yeniler ve web kodunu android/ ve ios/ içine kopyalar
```

Sonra `package.json` içindeki sürümü artır (örn. 1.1.0 → 1.2.0) ve mağazalara yeni bir derleme gönder.

## Mağaza sayfası için hazır malzemeler

| Dosya | Nerede kullanılır |
|---|---|
| `store/icon-1024.png` | App Store simgesi, Android simge kaynağı |
| `store/feature-graphic.png` (1024×500) | Google Play öne çıkan görsel |
| `store/screenshots/ios/*.png` (1290×2796) | App Store iPhone 6.7" ekran görüntüleri |
| `store/screenshots/android/*.png` (1080×1920) | Google Play telefon ekran görüntüleri |
| `src/privacy.html` | Gizlilik politikası adresi: `https://bgelegen.github.io/korteks/privacy.html` |

Ekran görüntülerini yeniden üretmek için: `npm run screenshots`

### Uygulama adı
**KORTEKS — Zihin Oyunları**

### Kısa açıklama (Google Play, en fazla 80 karakter)
8 beyin alanında 50 özgün zihin oyunu. Her gün birkaç dakikada zihnini çalıştır.

### Alt başlık (App Store, en fazla 30 karakter)
50 özgün zihin oyunu

### Uzun açıklama
KORTEKS, zihnini her gün birkaç dakikada çalıştırman için tasarlanmış 50 özgün mini oyun sunar.

**8 BEYİN ALANI**
• Hafıza: Sinaps Zinciri, Şifre Kasası, Eşleşme İzi ve daha fazlası
• Dikkat: Sinyal Avı, Tek Farklı, Hedef Arama…
• Hız: Refleks Işığı, Sıra Avcısı, Tam Zamanında…
• Esneklik: Ters Akış, Kuralı Bul, Ters İşlem…
• Mantık: Terazi, Sıralama Dedektifi, Örüntü Avcısı…
• Sayılar: Zincir Hesap, Kesir Düellosu, Para Üstü…
• Dil: Harf Karmaşası, Yazım Dedektifi, Kelime Zinciri…
• Uzamsal: Döndür Eşle, Pusula, Harita Yolu…

**GÜNÜN TURU**
Her gün farklı alanlardan seçilen 5 oyunluk kısa bir antrenman.

**GELİŞİMİNİ İZLE**
Korteks Endeksi, beceri haritası, gün serisi ve rekorlarla hangi alanda güçlü olduğunu gör.

**GİZLİLİĞE SAYGILI**
Hesap yok, reklam yok, takip yok. Tüm ilerlemen yalnızca cihazında saklanır. İnternet olmadan da çalışır.

### Anahtar kelimeler (App Store, virgülle, en fazla 100 karakter)
beyin,zeka,hafıza,dikkat,mantık,bulmaca,zihin,oyun,antrenman,refleks,matematik,kelime

### Kategori
Birincil: Eğitim · İkincil: Bulmaca

### Yaş derecelendirmesi
Tüm yaşlar (4+ / PEGI 3). Anketlerde: şiddet yok, kullanıcı etkileşimi yok, veri toplama yok, reklam yok.

### Veri güvenliği formu (Google Play) / Gizlilik etiketi (App Store)
"Veri toplanmıyor" seçeneğini işaretle. Uygulama hiçbir veriyi cihaz dışına göndermez.
