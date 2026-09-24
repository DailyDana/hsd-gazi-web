# HSD Gazi · Web Sitesi

Huawei Student Developers Gazi Üniversitesi topluluğunun tanıtım sitesi. Tek sayfa, kütüphanesiz (sadece HTML, CSS ve JavaScript). Sunucu, veritabanı veya derleme adımı gerekmez.

**Tasarım ve geliştirme:** İsmail Bilgehan Kazancı ([github.com/DailyDana](https://github.com/DailyDana))

## Klasör yapısı

```
index.html            Sayfanın tamamı (Hakkımızda, Komiteler, SSS metinleri burada)
404.html              Bulunamayan sayfalar için hata sayfası
assets/js/veri.js     ← Etkinlikler, ekip ve başvuru linki (en sık düzenlenecek dosya)
assets/js/main.js     Terminal, sekmeler, animasyonlar (genelde dokunmaya gerek yok)
assets/css/style.css  Tasarım
assets/img/           Logo, favicon, paylaşım görseli (og-image.png)
```

## İçerik güncelleme

Etkinlik, ekip ve başvuru bilgilerinin hepsi **`assets/js/veri.js`** dosyasında. Kodlama bilgisi gerekmez, tırnak içindeki metinleri değiştirmek yeterli.

**Başvuru linki:** `basvuruLinki: ""` satırına Google Form linkini yapıştırın. Boş kalırsa sitedeki başvuru butonları Instagram profiline gider.

**Etkinlik eklemek:** `etkinlikler` listesine yeni bir blok ekleyin:

```js
{
  baslik: "Huawei Cloud ile Kubernetes'e Giriş",
  tarih: "2026-11-05",        // YYYY-AA-GG. Boş bırakılırsa "Yakında" görünür
  saat: "14:00",
  tur: "Workshop",
  yer: "Gazi Üniversitesi · Mühendislik Fakültesi",
  aciklama: "Kısa açıklama.",
  link: "https://...",        // kayıt formu veya duyuru linki (isteğe bağlı)
  gorsel: ""                  // "assets/img/etkinlik/afis.jpg" gibi (isteğe bağlı)
},
```

- Tarihi geçen etkinlik kendiliğinden **Geçmiş** sekmesine düşer.
- Tarihi yaklaşan etkinliklerde "5 GÜN KALDI" rozeti ve **Takvime ekle** (Google Takvim) bağlantısı otomatik çıkar.
- Blokların arasındaki virgülleri unutmayın.

**Ekip:** `ekip` listesinde isim, görev ve LinkedIn linkini doldurun. Fotoğraf eklemek için kare bir görseli `assets/img/ekip/` klasörüne koyup `foto: "assets/img/ekip/ad-soyad.jpg"` yazın. Fotoğraf yoksa silüet ve baş harfler görünür.

**Metinler:** Hakkımızda, komite açıklamaları ve SSS `index.html` içinde, düz metin olarak duruyor.

## Yayınlama (GitHub Pages, ücretsiz)

1. GitHub'da topluluk adına bir **organizasyon** açın (ör. `hsd-gazi`). Böylece site tek bir kişinin hesabına bağlı kalmaz; yönetim değişince yetki devredilir.
2. Organizasyonda yeni bir depo oluşturun. Depo adı `hsd-gazi.github.io` olursa site doğrudan `https://hsd-gazi.github.io` adresinde açılır.
3. Bu klasördeki tüm dosyaları depoya yükleyin (**Add file → Upload files**).
4. **Settings → Pages** bölümünde kaynak olarak `main` dalını ve `/ (root)` klasörünü seçin.
5. Birkaç dakika içinde site yayında olur. Sonraki her değişiklik (ör. `veri.js` düzenlemesi) kaydedildikten kısa süre sonra siteye yansır.

**Özel alan adı (isteğe bağlı):** Okulun vereceği bir alt alan adı (ör. `hsd.gazi.edu.tr`) ya da satın alınan bir alan adı **Settings → Pages → Custom domain** kısmından bağlanır.

**Adres değişince:** `index.html` içindeki `og:url` ve `og:image` satırları şu an deneme adresini (`https://dailydana.github.io/hsd-gazi-web/`) gösteriyor. Site kalıcı adresine taşınınca bu iki satırı yeni adresle güncelleyin (ör. `https://hsd-gazi.github.io/assets/img/og-image.png`). Link WhatsApp, LinkedIn vb. yerlerde paylaşıldığında önizleme görselinin çıkması için gerekli.

## Küçük sürprizler

Sayfanın başındaki terminal gerçekten çalışıyor. `help` yazarak komutları görebilirsiniz. Klavyede `/` tuşu terminale odaklar. Tarayıcının geliştirici konsolunu açanları da küçük bir mesaj bekliyor.
