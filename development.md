# synthux — Development Log & Technical Notes

Bu dosya, **synthux** projesinin geliştirme geçmişini, mimari kararlarını ve yapılan teknik iyileştirmeleri takip etmek için tutulmaktadır.

---

## 📅 9 Kasım 2026 — v2.1.1 Sürümü (Apple Intelligence macOS FoundationModels, Chrome Built-in AI & Website UX/SEO Yenilemesi)

### 1.  Apple Intelligence (`FoundationModels.framework` — macOS 26 / 27) Entegrasyonu
- **Native Swift Köprüsü (`mcp/apple-fm-bridge.swift`, `mcp/dist/apple-fm-bridge.swift`):**
  - macOS 26 ve macOS 27 (Apple Silicon Neural Engine) üzerindeki yerleşik `FoundationModels` çatısını (`SystemLanguageModel.default`, `LanguageModelSession`, `GenerationOptions` ve macOS 27'deki `PrivateCloudComputeLanguageModel`) doğrudan çağıran bağımsız Swift CLI köprüsü geliştirildi.
  - Desteklenen yerleşik modeller:
    1. `apple-on-device` — Apple Intelligence On-Device (`AFM 3 Core`, %100 cihaz içi, sıfır veri çıkışı)
    2. `apple-pcc` — Apple Private Cloud Compute (macOS 27.0+)
    3. `apple-content-tagging` — Apple Intelligence Content Tagging (`SystemLanguageModel(useCase: .contentTagging)`)
- **MCP Sunucusu Yerel HTTP Köprüsü (`mcp/server.js`):**
  - `http://127.0.0.1:17483` üzerinde çalışan `synthux-mcp` sunucusuna ilk çağrıda `apple-fm-bridge.swift` dosyasını otomatik derleyip `/tmp/synthux-apple-fm-cache/synthux-apple-fm` olarak önbelleğe alan `ensureAppleFmBinary()` mekanizması eklendi.
  - **Yeni Endpoint'ler:** `GET /apple-fm/status` ve `POST /apple-fm/generate`.
  - **Geriye Dönük Uyumluluk:** Mevcut `v2.1.0` eklentilerinin dahi doğrudan çalışabilmesi için `127.0.0.1:17483` üzerinde **Ollama uyumlu** (`/api/tags`, `/api/version`, `/api/show`, `/api/generate`) ve **OpenAI uyumlu** (`/v1/models`, `/v1/chat/completions`) endpoint'ler eklendi.

---

### 2. 🌐 Chrome Built-in AI (`window.LanguageModel` — Gemini Nano Prompt API) Entegrasyonu
- **Tarayıcı İçi Doğrudan Sağlayıcı (`extension/core/providers.js`, `extension/core/ai-client.js`, `extension/core/cost-calculator.js`):**
  - Chrome 138+ içindeki `globalThis.LanguageModel` (ve geriye dönük `globalThis.ai.languageModel`) Prompt API'sini kullanan `chromeai` sağlayıcısı eklendi; hiçbir harici sunucuya veya API anahtarına ihtiyaç duymadan doğrudan tarayıcı içinde UX denetimi çalıştırır.
  - Yerleşik modellerin (`apple` ve `chromeai`) context penceresi sınırlarını aşmamak için `checkVisionSupport` fonksiyonunda base64 ekran görüntüsü gönderimi otomatik devre dışı bırakıldı.
- **Sidepanel Ayarlar Arayüzü (`src/sidepanel/components/synthux-settings.js`):**
  - Sağlayıcı seçimine ** Apple Intelligence (macOS)** ve **🌐 Chrome Built-in AI** eklendi (`Free — On-Device`), tek tıkla bağlantı testi ve adım adım kurulum rehberleri eklendi.

---

### 3. Website (`synthux.app`) Görsel, Navigasyon, Karşılaştırma ve 6-Dil SEO Güncellemeleri
- **7 Çözüm Sayfası Hero Görsellerinin Yenilenmesi (`website/assets/solutions/*.svg`):**
  - Tüm çözüm sayfalarındaki hero SVG görselleri `520×320` native boyutta, yüksek kontrastlı (`13px–20px` okunaklı tipografi) ve minimal 2 kartlı düzende yeniden tasarlandı; `firebase.json` önbellek başlıkları (`max-age=3600, must-revalidate`) ve `?v=2.1.3` sorgusu ile tarayıcı önbelleği yenilendi.
- **Navigasyon Menüsü Hover İyileştirmesi (`website/style.css`, `website/script.js`):**
  - Solutions açılır menüsündeki görünmez hover köprüsü (`::before`) genişletildi ve fare geçişlerinde menünün aniden kapanmasını önleyen `180ms` gecikmeli `mouseenter`/`mouseleave` hover-intent mekanizması eklendi.
- **3 Sütunlu Karşılaştırma Tablosu (`Local AI` vs `Cloud API (BYOK)` vs `MCP Agent`):**
  - Ana sayfadaki karşılaştırma tablosu gerçekçi 2026 süreleri ve yeni **MCP Agent (`v2.1` Single-pass)** sütunu ile 6 dilde güncellendi.
- **6 Dil (`en`, `tr`, `de`, `zh`, `fr`, `it`), `llms.txt`, `sitemap.xml` ve `Schema.org`:**
  - 7 çözüm sayfasının tamamında 6 dil çevirileri tamamlandı; `website/llms.txt`, `website/sitemap.xml` ve JSON-LD `SoftwareApplication` / `FAQPage` şemaları `v2.1.1` sürümüyle senkronize edildi.
- **Yayınlanan Paketler (`v2.1.1`):**
  - **npm Paketi:** `synthux-mcp@2.1.1` (`https://www.npmjs.com/package/synthux-mcp`)
  - **Chrome Web Store Paketi:** `synthux-extension-v2.1.1.zip` (ana dizinde hazır)
  - **GitHub Release:** `https://github.com/synthuxapp/synthux/releases/tag/v2.1.1`
  - **Firebase Hosting:** `https://synthux.app`

---

## 📅 9 Kasım 2026 — v2.1.0 Sürümü (MCP Server & Chrome Extension Agent Bridge)

### 1. Model Context Protocol (MCP) Sunucusu (`mcp/` — `synthux-mcp@2.1.0`)
- **Çift Aktarım Katmanı (Stdio + Streamable HTTP) (`mcp/server.js`, `mcp/dist/cli.js`):**
  - Sıfır harici bağımlılıklı, JSON-RPC 2.0 uyumlu MCP sunucusu oluşturuldu.
  - **Stdio (`npx -y synthux-mcp`):** Google Antigravity (Gemini 4 Argon), Claude Desktop, Claude Code, Cursor ve Windsurf gibi masaüstü ajanlarla doğrudan `stdin`/`stdout` üzerinden haberleşir.
  - **Streamable HTTP (`http://127.0.0.1:17483/mcp`):** Yerel LLM sunucuları ve HTTP tabanlı MCP istemcileri için yerel endpoint sağlar.
  - **Çoklu Süreç Uyumluluğu (Multi-Instance Coexistence):** `17483` portu başka bir `synthux-mcp` süreci tarafından dinleniyorsa, yeni başlatılan `stdio` süreçleri hata vermek yerine araç çağrılarını mevcut yerel köprüye (`http://127.0.0.1:17483/mcp`) şeffaf biçimde yönlendirir.
- **14 MCP Aracı (Tool) ve 4 Kaynak (Resource):**
  - Tarayıcı ve sekme yönetimi: `get_extension_status`, `list_browser_tabs`, `open_and_audit_url`
  - Canlı sayfa tarama ve erişilebilirlik: `scan_page_ux_context`, `run_wcag_audit`
  - UX ve Heuristik denetim: `run_ux_audit` (`quick`, `deep`, `custom` modları, Sektörel Kural Paketleri ve Sentetik Personalar)
  - **Agent-Brain Modu (Ekstra API Anahtarsız Değerlendirme):** `prepare_external_audit` ve `submit_external_audit` araçlarıyla masaüstü AI ajanının (Antigravity / Gemini 4 Argon, Claude, Cursor, Codex) canlı DOM + WCAG + ekran görüntüsü verisini kendi LLM beyniyle değerlendirip ürettiği v2.0 raporunu Chrome Yan Paneline senkronize etmesi sağlandı.
  - Çok sayfalı akış ve canlı görsel katmanlar: `start_flow_analysis`, `toggle_heatmap`, `highlight_issue`, `capture_annotated_screenshot`
  - Yapılandırma ve geçmiş: `manage_rule_packs`, `manage_personas`, `configure_ai_provider`, `get_report_history`
- **Bağımsız npm Paketi (`mcp/package.json`, `esbuild.config.js`):**
  - `npm run build` sırasında `mcp/server.js` ve çekirdek modüller `mcp/dist/cli.js` olarak paketlenir, `extension/rules/*.json` kural paketleri `mcp/rules/` altına kopyalanır ve npm üzerinde `synthux-mcp@2.1.0` olarak yayınlanır.

---

### 2. Chrome Eklentisi MV3 WebSocket Köprüsü ve Uygulama İçi Ayarlar
- **MV3 Service Worker Köprüsü (`extension/core/mcp-bridge.js`, `extension/background/service-worker.js`):**
  - `ws://127.0.0.1:17483/ws` üzerinden yerel MCP sunucusuna otomatik bağlanan, kopma durumunda yeniden bağlanan ve heartbeat destekleyen `MCPBridge` sınıfı eklendi.
  - Harici ajanların ürettiği raporları Chrome Yan Paneline ve `synthux_reports` geçmişine kaydeden `saveCompletedReport` entegrasyonu yapıldı.
- **Uygulama İçi MCP Ayar Kartı (`src/sidepanel/components/synthux-settings.js`, `src/sidepanel/app.js`):**
  - **Settings → MCP Agent Bridge** kartı: Köprü açma/kapatma anahtarı (`mcpEnabled`), canlı bağlantı rozeti (`Connected · 127.0.0.1:17483` / `Standby`), opsiyonel eşleştirme tokenı (`SYNTHUX_MCP_TOKEN`) alanı ve tek tıkla kopyalanabilir `mcp_config.json` / Streamable HTTP kurulum rehberi eklendi.
  - Yan panel üst barına canlı `Connected · MCP` / `MCP Agent Ready` rozeti eklendi.

---

### 3. Gizlilik, Güvenlik Sıkılaştırması ve Otomatik E2E Test Paketi
- **Loopback ve Origin CSRF Koruması (`SECURITY.md`, `PRIVACY.md`):**
  - Sunucu ve eklenti köprüsü yalnızca `127.0.0.1` / `localhost` adreslerinde çalışır (`isLoopbackWsUrl` koruması).
  - `isAllowedOrigin` güvenlik duvarı ile `http://` ve `https://` web sayfalarından gelebilecek tüm Cross-Site WebSocket Hijacking (CSWSH) ve CSRF istekleri `403 Forbidden` ile engellenir.
  - Tarayıcıdaki BYOK API anahtarları (`gemini`, `openai`, `claude`) MCP yanıtlarında tamamen maskelenir ve dışarı aktarılmaz.
- **Otomatik Test Paketi (`mcp/test-suite.js` — `npm run test:mcp`):**
  - 16 uçtan uca test senaryosu (JSON-RPC 2.0 protokolü, Streamable HTTP, Origin/URL güvenlik duvarları, Sektörel Kural Paketleri, özel JSON kural paketi, personalar, WCAG, Antigravity Agent-Brain değerlendirme döngüsü, canlı WebSocket eklenti köprüsü ve `stdio` alt süreç testi) eklendi.

---

### 4. Website (`synthux.app`), Yayınlama ve Dağıtım Bilgileri (`v2.1.0`)
- **7. SEO Çözüm Sayfası (`website/solutions/mcp-agentic-ux-audit.html` & `website/assets/solutions/mcp-agentic-ux.svg`):**
  - 6 dilde (`en`, `tr`, `de`, `zh`, `fr`, `it`) yeni çözüm sayfası, navigasyon menüsü, ana sayfa özellik kartı (`feature13`) ve `website/sitemap.xml` / `website/llms.txt` güncellemeleri yapıldı ve `synthux.app` (Firebase Hosting) üzerine deploy edildi.
- **Yayınlanan Paketler:**
  - **npm Paketi:** `synthux-mcp@2.1.0` (`https://www.npmjs.com/package/synthux-mcp` — `npx -y synthux-mcp`)
  - **Chrome Web Store Paketi:** `synthux-v2.1.0.zip` ve `v2.1.0-release-notes.md` (EN & TR mağaza metinleri)
  - **GitHub Release:** `https://github.com/synthuxapp/synthux/releases/tag/v2.1.0`
  - **Firebase Hosting:** `https://synthux-app.web.app` / `https://synthux.app` (`ufuk@ufukaydin.com`)

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

### 5. Website SEO Çözüm & Persona Sayfaları ve Navigasyon Yenilemesi (`website/`)
- **SEO Odaklı 6 Çözüm & Persona Sayfası (`website/solutions/*.html`):**
  - Sitenin 6 dil desteğine (`en`, `tr`, `de`, `zh`, `fr`, `it`) ve koyu/açık tema sistemine tam uyumlu, emojisiz, kurumsal ve teknik mimari diyagramlı (`website/assets/solutions/*.svg` — 16:9 vektörel illüstrasyonlar) 6 ayrı SEO açılış sayfası oluşturuldu:
    1. `website/solutions/defense-air-gapped-ux.html` — **Savunma Sanayii, Askeri Sistemler (C4ISR) & Banka İntranetleri** (Air-Gapped, %100 Offline Ollama yerel AI UX denetimi)
    2. `website/solutions/fintech-banking-ux.html` — **Fintech, Dijital Bankacılık & Ödeme Sistemleri** (`fintech.json` kural paketi, komisyon/kur şeffaflığı, geri alınamaz işlem onayları)
    3. `website/solutions/ecommerce-ux-audit.html` — **E-Ticaret & Checkout Dönüşüm Optimizasyonu** (`ecommerce.json` kural paketi, sepet terk nedenleri, üyesiz ödeme sürtünmesi)
    4. `website/solutions/saas-dashboard-ux.html` — **SaaS, B2B Dashboard & Kurumsal Web Uygulamaları** (`saas.json` kural paketi, yüksek yoğunluklu tablolar, boş durum onboarding)
    5. `website/solutions/accessibility-wcag-audit.html` — **WCAG 2.2 AA Erişilebilirlik & Uyumluluk Denetimi** (`axe-core` + AI Ekran Okuyucu / Klavye Personası simülasyonu, EAA & Section 508)
    6. `website/solutions/user-flow-personas.html` — **Çok Sayfalı Kullanıcı Akışları (Flow Builder) & Sentetik Personalar** (`First-Time Visitor`, `Power User`, `Accessibility User` + 5 özel persona)
  - Ana sayfaya (`website/index.html`) `#solutions` minimal modülü ve hedef rol/persona hapları eklendi; `website/sitemap.xml` (7 URL) ve `website/llms.txt` güncellendi.
- **Masaüstü & Mobil Web Navigasyon UX/UI Yenilemesi (`website/style.css`, `website/script.js`, `website/index.html`):**
  - **Masaüstü (`>= 901px`):** 3 bölgeli üst bar (`.nav-brand` logo + `v2.0` rozeti, `.nav-center` ortalanmış hap menü ve 2 sütunlu simetrik `Solutions` hover/click mega dropdown menüsü, `.nav-actions` SVG ikonlu tema seçici, dil seçici, `GitHub` ve `Add to Chrome` CTA).
  - **Mobil Web (`<= 900px`):** Uzun dil çevirilerinde taşmayı önleyen hamburger/kapat butonu (`.nav-mobile-toggle`) ve `backdrop-filter` sabit kapsayıcı kısıtlamasını aşan tam ekran (`calc(100dvh - 57px)`) kaydırılabilir mobil çekmece menüsü (`.nav-mobile-drawer`).
- **Temizlik & Kırık Bağlantı Düzeltmeleri:**
  - Ana sayfa ve tüm çözüm detay sayfalarından `#support` (ETH / SOL cüzdan bağış) modülü kaldırıldı.
  - Footer `Resources` sütununda ve `llms.txt` içinde 404 döndüren `docs/getting-started.md` (`Documentation` ve `Getting Started`) linkleri kaldırıldı.

---

### 6. Yayınlama, Paketleme ve Dağıtım Bilgileri
- **Chrome Web Store Paketi:** `synthux-v2.0.0.zip` (55 dosya, `manifest.json` v2.0.0) ve `v2.0.0-release-notes.md` oluşturuldu.
- **Firebase Hosting:**
  - Proje ID: `synthux-app` (`https://synthux-app.web.app` / `https://synthux.app`)
  - Yetkili Hesap: `ufuk@ufukaydin.com`
  - Dağıtım Komutu: `npx --offline firebase-tools deploy --only hosting`
- **GitHub:**
  - Repo: `https://github.com/synthuxapp/synthux.git` (`main` branch, commit `315d109`)

