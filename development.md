# synthux — Development Log & Technical Notes

Bu dosya, **synthux** projesinin geliştirme geçmişini, mimari kararlarını, yapılan teknik iyileştirmeleri ve kalan yol haritası maddelerini takip etmek için tutulmaktadır.

---

## 📅 2 Kasım 2026 — v2.0.0 Sürümü

### 1. Kod Analizi ve Hata Düzeltmeleri (Bug Fixes)
- **Annotated Screenshot Yatay Kaydırma (ScrollX) Hatası (`extension/core/screenshot.js`):**
  - Sayfa yatay kaydırıldığında (`window.scrollX > 0`) element koordinatlarından `scrollX` çıkarıldığı için işaretçilerin (marker) kaymasına neden olan hesaplama düzeltildi (`captureVisibleTab` yalnızca görünür viewport'u yakaladığı için `rect.left` doğrudan viewport'a göredir).
  - Sayfa kenarlarına yakın elementlerin numara rozetlerinin (badge) canvas dışına taşmasını önlemek için `Math.max` / `Math.min` sınırlandırması (clamping) eklendi.
- **Akıl Yürütme (Reasoning) Modelleri `<think>` Bloğu Temizliği (`extension/core/heuristics.js`, `extension/core/flow-manager.js`):**
  - `deepseek-r1`, `qwen3.8` ve `gemma4` gibi 2026 modellerinin JSON çıktısı öncesinde ürettiği `<think>...</think>` bloklarını otomatik temizleyen sanitizer eklendi.
- **Flow Builder Sayfa Önizleme Görseli (`extension/core/flow-manager.js`):**
  - Açık sekmelerden Flow tuvaline sayfa eklendiğinde `scannedInfo.screenshot` verisinin `thumbnail` alanına atanmaması nedeniyle oluşan boş önizleme sorunu giderildi.
- **Flow Builder Maliyet Özeti (Receipt Modal) (`extension/flow/flow-toolbar.js`):**
  - `providerLabel` haritasında eksik olan `claude: 'Claude'` tanımı eklendi.
- **Ollama CORS Hata Bildirimi (`src/sidepanel/app.js`):**
  - Arka plan mesajlarında `message.errorType` yerine `message.payload?.errorType === 'cors'` kontrolü düzeltilerek CORS hata rehberinin doğru tetiklenmesi sağlandı.
- **Sağ Tık Menüsü (Context Menu) İzin ve Kaydı (`extension/manifest.json`, `extension/background/service-worker.js`):**
  - `"contextMenus"` izni `manifest.json`'a eklendi ve `"Analyze in synthux Flow"` sağ tık menüsü `service-worker.js` içinde güvenli şekilde kayıt altına alındı.
- **Build & Chunk Temizliği (`esbuild.config.js`):**
  - Her derleme öncesinde `extension/sidepanel/chunks` klasöründeki eski hash'li chunk dosyalarının (`fs.rmSync`) otomatik silinmesi sağlandı.

---

### 2. 2026 Lokal LLM Güncellemeleri (Ollama)
- Varsayılan lokal model **`gemma4`** (`ollama pull gemma4`) olarak güncellendi (`analyzer.js`, `ai-client.js`, `service-worker.js`, `synthux-settings.js`).
- Ayarlar paneli, Onboarding rehberi, Website (6 dil) ve `README.md` üzerindeki model önerileri 2026 ailesine güncellendi:
  - **`gemma4`** (Varsayılan — Vision + UX Analizi)
  - **`gemma4:e4b`** (Hafif / Düşük RAM cihazlar için)
  - **`qwen3.8`** & **`qwen3.5`** (Güçlü yapılandırılmış JSON ve çok dilli analiz)
  - **`llama4:scout`** (Çok modlu / Multimodal vizyon analizi)
  - **`deepseek-r1`** (Derin akıl yürütme / Reasoning)

---

### 3. Sektörel Kural Paketleri ve Özel JSON Eklenti Ekosistemi (#12)
- **Yerleşik Kural Paketleri (`extension/rules/`):**
  1. `nielsen-10.json` — **Nielsen's 10 Heuristics** (Evrensel kullanılabilirlik)
  2. `ecommerce.json` — **E-Commerce & Checkout UX** (Sepet, ödeme adımları, fiyat/kargo şeffaflığı, üyesiz ödeme, ürün galerisi, filtreleme ve güven sinyalleri)
  3. `saas.json` — **SaaS & Dashboard UX** (Boş durumlar & onboarding, veri yoğunluğu, toplu işlemler & kısayollar, rol/yetki netliği, yıkıcı işlem korumaları)
  4. `fintech.json` — **Fintech & Banking UX** (Komisyon/kur şeffaflığı, işlem onayı ve geri alınamazlık uyarıları, oturum güvenliği, sayısal girdi formatlama)
- **Özel JSON Kural Paketi Yükleyici (`extension/core/heuristics.js`, `src/sidepanel/components/synthux-scanner.js`):**
  - Kullanıcıların kendi `.json` kural paketlerini doğrulamayla (`validateRulePack`) içe aktarabilmesi (`chrome.storage.local` altında `synthux_custom_rule_packs`), silebilmesi ve tek tıkla örnek JSON şablonu indirebilmesi sağlandı.

---

### 4. Gelişmiş Raporlama — Enhanced Reporting v2.0 (PDF & Markdown)
- **Markdown Raporları (`extension/core/report-generator.js`, `extension/flow/flow-results-panel.js`):**
  - Yönetici Özeti (Executive Summary) ve kural paketi rozeti
  - Heuristik Kırılım Tablosu (skor, durum, kritik/orta/düşük dağılımı)
  - Önceliklendirilmiş Aksiyon Planı (`P0 Immediate`, `P1 High Priority`, `P2 Backlog`)
  - Flow Builder çoklu sayfa raporlarında Sayfa Skor Karşılaştırma Matrisi
- **PDF Raporları (`extension/core/pdf-export.js`):**
  - Kapak ve özet kartında kullanılan Kural Paketi bilgisi
  - **Executive Summary & Prioritized Action Plan (P0 / P1 / P2)** tablosu
  - **Annotated Visual Audit** sayfası (numaralı sorun işaretçilerini içeren tam ekran görüntüsünün PDF'e gömülmesi)
  - Flow PDF raporlarında **Page Score Comparison Matrix** ve **Prioritized Flow Action Plan** bölümleri

---

### 5. Yayınlama, Paketleme ve Dağıtım Bilgileri
- **Chrome Web Store Paketi:** `synthux-v2.0.0.zip` (55 dosya, `manifest.json` v2.0.0) ve `v2.0.0-release-notes.md` oluşturuldu.
- **Firebase Hosting:**
  - Proje ID: `synthux-app` (`https://synthux-app.web.app`)
  - Yetkili Hesap: `ufuk@ufukaydin.com`
  - Dağıtım Komutu: `npx --offline firebase-tools deploy --only hosting --project synthux-app`
- **GitHub:**
  - Repo: `https://github.com/synthuxapp/synthux.git` (`main` branch, commit `78b2a3f`)

---

## 🗺️ Kalan Yol Haritası Maddeleri (Sonraki Sürümler İçin)

| Durum | Özellik | Kaynak | Açıklama |
|:---:|:---|:---|:---|
| ✅ | **Sektörel Kural Paketleri & Plugin Ekosistemi (#12)** | `v2.0.0` | E-Ticaret, SaaS, Fintech paketleri + Özel JSON içe aktarma |
| ✅ | **Enhanced Reporting (PDF & Markdown v2.0)** | `v2.0.0` | Executive Summary, P0/P1/P2 Aksiyon Planı, Annotated Visual Audit PDF |
| ✅ | **2026 Local LLM Lineup** | `v2.0.0` | Gemma 4, Qwen 3.8/3.5, Llama 4 Scout, DeepSeek R1 + `<think>` sanitizer |
| ⬜ | **synthux insights** | `README.md` | NNGroup ve Baymard Institute araştırmalarını çekip kanıt bazlı öneri sunma |
| ⬜ | **Walkthrough Mode (#9)** | `docs/implementation-plan2.md` | Sentetik kullanıcının sayfayı adım adım gezdiği animasyonlu rehber turu |
| ⬜ | **Zaman İçi Karşılaştırma / History Diff (#7)** | `docs/implementation-plan2.md` | Aynı URL'nin farklı tarihli raporlarını karşılaştırma ve skor trendi |
| ⬜ | **Rakip Karşılaştırma — 2 URL (#10)** | `docs/implementation-plan2.md` | İki URL'yi yan yana analiz edip heuristik bazlı karşılaştırma raporu üretme |
| ⬜ | **WebGPU / Browser-Native AI (#13)** | `docs/implementation-plan2.md` | Ollama gerektirmeden tarayıcı içi AI (Gemini Nano / WebGPU) desteği |
| ⬜ | **Figma Plugin (#14)** | `docs/implementation-plan2.md` | Tasarım aşamasında Figma içinde UX audit (Phase 4 / v3.0) |
