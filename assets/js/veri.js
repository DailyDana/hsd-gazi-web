/*
  HSD Gazi — site verileri
  Etkinlik, ekip ve başvuru bilgilerini sadece bu dosyadan güncelleyin.
  Tarih biçimi: "YYYY-AA-GG" (örn. "2026-10-15"). Tarihi olmayan etkinlik "Yakında" olarak görünür.
  Tarihi bugünden önce olan etkinlikler otomatik olarak "Geçmiş" sekmesine düşer.
*/
window.HSD = {
  // Google Form vb. başvuru linki. Boş bırakılırsa butonlar Instagram profiline gider.
  basvuruLinki: "",

  instagram: "https://www.instagram.com/hsdgazi/",

  etkinlikler: [
    {
      baslik: "Etkinlik başlığı",
      tarih: "2026-10-15",
      saat: "18:00",
      tur: "Workshop",
      yer: "Gazi Üniversitesi · Salon adı",
      aciklama: "Etkinliğin kısa açıklaması buraya gelecek. Konu, konuşmacı ve kimlere uygun olduğu gibi bilgiler.",
      link: "",
      gorsel: ""
    },
    {
      baslik: "Etkinlik başlığı",
      tarih: "",
      saat: "",
      tur: "Teknik Söyleşi",
      yer: "Gazi Üniversitesi",
      aciklama: "Etkinliğin kısa açıklaması buraya gelecek.",
      link: "",
      gorsel: ""
    },
    {
      baslik: "Etkinlik başlığı",
      tarih: "",
      saat: "",
      tur: "Hackathon",
      yer: "Gazi Üniversitesi",
      aciklama: "Etkinliğin kısa açıklaması buraya gelecek.",
      link: "",
      gorsel: ""
    },
    {
      baslik: "Geçmiş etkinlik başlığı",
      tarih: "2026-05-14",
      saat: "14:00",
      tur: "Workshop",
      yer: "Gazi Üniversitesi",
      aciklama: "Geçmiş bir etkinliğin kısa özeti buraya gelecek.",
      link: "",
      gorsel: ""
    }
  ],

  // foto: "assets/img/ekip/ad-soyad.jpg" gibi bir yol (kare fotoğraf önerilir). Boşsa baş harfler gösterilir.
  ekip: [
    { ad: "İsim Soyisim", gorev: "Başkan", linkedin: "", foto: "" },
    { ad: "İsim Soyisim", gorev: "Başkan Yardımcısı", linkedin: "", foto: "" },
    { ad: "İsim Soyisim", gorev: "Genel Sekreter", linkedin: "", foto: "" },
    { ad: "İsim Soyisim", gorev: "Organizasyon Komitesi", linkedin: "", foto: "" },
    { ad: "İsim Soyisim", gorev: "Sosyal Medya Komitesi", linkedin: "", foto: "" },
    { ad: "İsim Soyisim", gorev: "Teknik Etkinlik Komitesi", linkedin: "", foto: "" },
    { ad: "İsim Soyisim", gorev: "Tanıtım ve Tasarım Komitesi", linkedin: "", foto: "" }
  ]
};
