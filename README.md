# KORTEKS

**8 beyin alanında 50 özgün zihin oyunu.** Telefon için tasarlanmış, kurulum gerektirmeyen bir web uygulaması.

Hafıza, dikkat, hız, esneklik, mantık, sayılar, dil ve uzamsal düşünme becerilerini kısa oyunlarla çalıştırır. Oyunlar mevcut beyin antrenmanı uygulamalarından bağımsız olarak tasarlanmıştır.

## Özellikler

- 50 oyun, 8 kategori
- **Korteks Endeksi** (0–1000) ve seviyeler: Çaylak → Gelişiyor → Keskin → Usta → Dahi
- Her gün değişen 5 oyunluk **Günün Beyin Turu**
- Beceri haritası, gün serisi, rekorlar ve seans geçmişi (tarayıcıda saklanır)
- Seri çarpanı, geri sayım, konfeti ve dokunsal geri bildirim
- Hiçbir kütüphane veya derleme adımı gerektirmez

## Oyunlar

| Alan | Oyunlar |
|---|---|
| Hafıza | Sinaps Zinciri, Kayıp Parça, Değişen Kare, Kelime Rafı, Renk Sırası, Şifre Kasası, Tersten Sayı, Eşleşme İzi |
| Dikkat | Sinyal Avı, Tek Farklı, Harf Sayacı, Çoğunluk, Kod Kontrol, Hedef Arama |
| Hız | Refleks Işığı, Sıra Avcısı, Büyük Olan, Nokta Kalabalığı, Tam Zamanında, Işık Avı |
| Esneklik | Ters Akış, İkili Kural, Kuralı Bul, Ters İşlem, Karşıt Kutu |
| Mantık | Hedef Sayı, Örüntü Avcısı, Şekil Dizisi, Terazi, Sıralama Dedektifi, Denge Tablosu, Kesin mi? |
| Sayılar | Zincir Hesap, Kesir Düellosu, Yüzde Avcısı, Göz Kararı, Para Üstü, Kayıp İşaret, Sayı Doğrusu |
| Dil | Harf Karmaşası, Zıt Kutuplar, Yazım Dedektifi, Eş Anlam, Eksik Harf, Kelime Zinciri |
| Uzamsal | Ayna Dokunuş, Döndür Eşle, Pusula, Harita Yolu, Saat Kaç? |

Sinaps Zinciri ve Kuralı Bul, psikolojide kullanılan Corsi blok testi ile Wisconsin kart eşleme testinden esinlenmiştir.

## Çalıştırma

```bash
npm start        # http://localhost:5173 adresinde açar
```

Ya da `src/index.html` dosyasını doğrudan tarayıcıda aç.

## Test

```bash
npm install
npx playwright install chromium
npm test
```

Test; her oyunun soru üreticisini yüzlerce kez çalıştırıp cevapların geçerli olduğunu kontrol eder, ardından 50 oyunun hepsini açıp rastgele oynatarak hata arar.

## Proje yapısı

```
src/
  index.html          Sayfa iskeleti
  css/style.css       Tüm stiller
  js/core.js          Yardımcılar, oyun kaydı, ana sayfa, quiz ve tur motorları
  js/words.js         Türkçe kelime listeleri
  js/games/*.js       Kategori başına bir dosya
  js/main.js          Uygulamayı başlatır
tests/smoke.mjs       Otomatik test
```

## Yeni oyun eklemek

Uygun kategori dosyasına bir `def({...})` çağrısı ekle. Çoğu oyun hazır motorlardan birini kullanır:

```js
def({
  id: 'ornek', cat: 'sayi', gl: '+', name: 'Örnek Oyun', mode: 'quiz',
  desc: 'Oyunun kısa açıklaması.',
  gen(lv) {
    const a = ri(1, 9 * lv), b = ri(1, 9);
    return Object.assign(mk(a + b, near(a + b, 3, 4)), { q: `<div class="qmono">${a} + ${b}</div>` });
  },
});
```

- `mode: 'quiz'` — süreli, seri çarpanlı soru-cevap
- `mode: 'rounds'` — önce göster, sonra sor; 3 hak, seviye artar
- `mode: 'custom'` — `run(g)` ile tamamen özel oyun

## Yayın

`main` dalına her gönderimde GitHub Actions testleri çalıştırır ve geçerse uygulamayı GitHub Pages'e yayınlar. Depo ayarlarında **Settings → Pages → Source: GitHub Actions** seçili olmalıdır.
