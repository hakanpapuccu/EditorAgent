# AI Agent Çalışma Alanı

Word ve Excel dosyalarını doğal dil konuşmaları ile düzenlemenize olanak sağlayan akıllı AI destekli belge düzenleme asistanı.

## 🚀 Özellikler

### Belge Desteği
- **Excel Dosyaları** (.xlsx, .xls)
  - FortuneSheet ile desteklenen interaktif elektronik tablo görüntüleyici
  - Hücre değerlerini okuma ve değiştirme
  - Hücre stillendirme (kalın, italik, renkler, arka planlar)
  - Satır ve sütun ekleme/silme
  - Hücreleri birleştirme/ayırma
  - Otomatik .xls'den .xlsx'e dönüştürme

- **Word Belgeleri** (.docx, .doc)
  - Zengin metin önizleme
  - Belge içeriğini okuma
  - Metin ekleme
  - Bul ve değiştir

### AI Agent Yetenekleri
- **Doğal Dil Komutları**: Belgelerinizle sade Türkçe ile etkileşim
- **Konuşma Hafızası**: Agent oturum boyunca bağlamı hatırlar
- **Akıllı Araç Seçimi**: İsteklerinizi yerine getirmek için otomatik olarak doğru araçları seçer
- **Gerçek Zamanlı Önizleme**: Değişiklikleri önizleme panelinde anında görün

## 🏗️ Mimari

### Backend
- **Framework**: FastAPI (Python)
- **LLM**: OpenAI GPT (LangChain aracılığıyla)
- **Agent Framework**: Hafıza kalıcılığı ile LangGraph
- **Belge İşleme**: 
  - openpyxl (Excel manipülasyonu)
  - python-docx (Word manipülasyonu)
  - pandas (veri işleme)
  - mammoth (Word önizleme oluşturma)

### Frontend
- **Framework**: React ile Next.js 16
- **Stil**: Tailwind CSS
- **Elektronik Tablo Görüntüleyici**: Dosya ayrıştırma için LuckyExcel ile FortuneSheet
- **TypeScript**: Tam tip güvenliği

## 📋 Gereksinimler

- **Node.js** 18+ ve npm
- **Python** 3.12+
- **OpenAI API Anahtarı**

## 🛠️ Kurulum

### 1. Projeyi Klonlayın
```bash
cd /path/to/project
```

### 2. Backend Kurulumu

```bash
cd backend

# Sanal ortam oluşturun ve etkinleştirin
python3 -m venv venv
source venv/bin/activate  # Windows'ta: venv\Scripts\activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# .env dosyası oluşturun
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### 3. Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları yükleyin
npm install
```

## 🚀 Uygulamayı Çalıştırma

### Backend Sunucusunu Başlatın

```bash
cd backend
source venv/bin/activate
python main.py
```

Backend `http://localhost:8000` adresinde çalışacak

### Frontend Geliştirme Sunucusunu Başlatın

```bash
cd frontend
npm run dev
```

Frontend `http://localhost:3000` adresinde çalışacak

## 💡 Kullanım

1. **Belge Yükleyin**: Yükleme alanına tıklayın ve bir Word veya Excel dosyası seçin
2. **Önizlemeyi Görüntüleyin**: Belge sol panelde görünecek
3. **AI ile Sohbet Edin**: Sağ paneli kullanarak şu tür talimatlar verin:
   - "John, Doe, 30 verisiyle bir satır ekle"
   - "Başlık satırını kalın yap"
   - "A1 hücresini 'Merhaba Dünya' olarak değiştir"
   - "Tüm 'eski metin' kelimelerini 'yeni metin' ile değiştir"
   - "5. satırı sil"
4. **Güncellemeleri Görün**: Değişiklikler önizlemede gerçek zamanlı olarak görünür

## 📁 Proje Yapısı

```
proje/
├── backend/
│   ├── agent.py          # LangGraph agent yapılandırması
│   ├── tools.py          # Belge manipülasyon araçları
│   ├── main.py           # FastAPI sunucusu
│   ├── uploads/          # Yüklenen dosyalar deposu
│   └── requirements.txt  # Python bağımlılıkları
│
└── frontend/
    ├── app/
    │   ├── page.tsx      # Ana uygulama sayfası
    │   └── layout.tsx    # Kök layout
    ├── components/
    │   ├── ExcelSheet.tsx    # Excel görüntüleyici bileşeni
    │   ├── FilePreview.tsx   # Dosya önizleme sarmalayıcı
    │   └── ChatInterface.tsx # Sohbet arayüzü
    ├── lib/
    │   └── api.ts        # API istemci fonksiyonları
    └── package.json      # Node bağımlılıkları
```

## 🔧 Mevcut Agent Araçları

### Excel Araçları
- `read_excel_structure_tool`: Sayfa adlarını ve sütunları al
- `read_excel_values_tool`: Bir aralıktan hücre değerlerini oku
- `write_excel_cell_tool`: Belirli bir hücreye yaz
- `add_excel_row_tool`: Satır ekle
- `delete_excel_row_tool`: Satır sil
- `delete_excel_column_tool`: Sütun sil
- `apply_excel_style_tool`: Biçimlendirme uygula (kalın, italik, renkler)
- `merge_excel_cells_tool`: Hücreleri birleştir
- `unmerge_excel_cells_tool`: Hücreleri ayır

### Word Araçları
- `read_word_text_tool`: Belge metnini oku
- `append_word_text_tool`: Paragraf ekle
- `replace_word_text_tool`: Bul ve değiştir

## 🔒 Ortam Değişkenleri

`backend` dizininde bir `.env` dosyası oluşturun:

```env
OPENAI_API_KEY=sk-...anahtarınız-buraya...
```

## 🐛 Sorun Giderme

### Excel Dosya İmza Hatası
"Corrupted zip or bug: unexpected signature" hatası alırsanız:
- Dosyanın geçerli bir Excel dosyası olduğundan emin olun
- Dosyayı yeniden yüklemeyi deneyin
- Detaylı hata mesajları için tarayıcı konsolunu kontrol edin

### Backend Bağlantı Sorunları
- Backend'in 8000 portunda çalıştığını doğrulayın
- CORS ayarlarının localhost:3000'e izin verdiğini kontrol edin
- OPENAI_API_KEY'in doğru ayarlandığından emin olun

### Frontend Derleme Hataları
- Next.js önbelleğini temizleyin: `rm -rf .next`
- Bağımlılıkları yeniden yükleyin: `rm -rf node_modules && npm install`

## 📝 Örnek Komutlar

```
Kullanıcı: "İlk sayfanın yapısını oku"
Kullanıcı: "Ad, Yaş, Şehir başlıklarıyla bir başlık satırı ekle"
Kullanıcı: "1. satırı kalın yap ve mavi arka plan ver"
Kullanıcı: "B2 hücresini 25 olarak ayarla"
Kullanıcı: "C sütununu sil"
Kullanıcı: "A1:D1 hücrelerini birleştir"
Kullanıcı: "Word belgesinde 'taslak' kelimelerini 'nihai' ile değiştir"
```

## 🤝 Katkıda Bulunma

Bu kişisel bir projedir. Kendi kullanımınız için fork'layabilir ve değiştirebilirsiniz.

## 📄 Lisans

MIT Lisansı - bu projeyi dilediğiniz gibi kullanabilirsiniz.

## 🔮 Gelecek Geliştirmeler

- [ ] PDF dosyaları desteği
- [ ] Tek oturumda birden fazla dosya düzenleme
- [ ] Farklı formatlarda dosya dışa aktarma
- [ ] İşbirlikçi düzenleme
- [ ] Versiyon geçmişi
- [ ] Daha gelişmiş Excel formülleri ve grafikleri
- [ ] Word belgesi stillendirme (fontlar, başlıklar, vb.)

---

**OpenAI GPT, LangGraph ve Next.js ile ❤️ ile yapıldı**
