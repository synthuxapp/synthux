# synthux — Feature Roadmap (v1.5 → v3.0)

> Kaynak: `synthux_analysis.md` stratejik öneriler + yol haritası  
> Sıralama: **Kolaydan zora**, tahmini effort ile

---

## Phase 1 — Quick Wins (v1.5)
> Mevcut mimariyi değiştirmeden, küçük eklemeler.

### 0. ✅ Chrome Web Store Yayını — *İncelemede*
**Effort:** ~3 gün | **Etki:** Kritik | **Gönderim:** 24 Nisan 2026

Extension'ı Chrome Web Store'da yayınlamak — kullanıcıların "Load unpacked" yapmadan kurabilmesi.

- Chrome Developer hesabı ($5 tek seferlik)
- Privacy policy sayfası hazırla (synthux.app/privacy)
- Store listing: açıklama, 5 screenshot, promotional banner
- Manifest permissions justification yazısı (host_permissions, activeTab, sidePanel)
- `content_security_policy` gözden geçir
- İlk review süreci: 1–3 iş günü (AI + sayfa erişimi titiz incelenir)
- Store badge'ini website + README'ye ekle

> ⚠️ **Dikkat:** AI + DOM erişimi olan extension'lar Chrome review'da titiz inceleniyor. Privacy policy ve izin açıklamaları eksiksiz olmalı.

**Bağımlılık:** Yok — mevcut extension yayına hazır

---

### 1. 📋 Actionable Code Fixes
**Effort:** ~2 gün | **Etki:** Yüksek

Raporda sadece "sorun var" demek yerine, her bulgu için somut CSS/HTML düzeltme kodu önermek.

- `analyzer.js` prompt'una "Provide a concrete code fix for each issue" talimatı ekle
- Report component'a `code-block` render desteği ekle
- Mevcut `report-generator.js` markdown çıktısına code snippet formatı ekle

**Bağımlılık:** Yok — prompt engineering + UI ekleme

---

### 2. 🏷️ Önceliklendirme Matrisi (Impact × Effort)
**Effort:** ~2 gün | **Etki:** Yüksek

Her bulguyu 2×2 matrise yerleştir: "kolay düzeltme + yüksek etki" önce gösterilsin.

- AI prompt'a `priority` (high/medium/low) ve `fix_effort` (easy/moderate/hard) alanları ekle
- Report component'a priority badge ve sıralama filtresi ekle
- "Quick Win" etiketi ile kolay-yüksek etki itemları vurgula

**Bağımlılık:** Yok — prompt + UI

---

### 3. 📄 PDF Rapor Dışa Aktarma
**Effort:** ~3 gün | **Etki:** Orta

Markdown yerine profesyonel PDF rapor indirme.

- `jsPDF` veya `html2pdf.js` kütüphanesi ekle (~50KB)
- Mevcut markdown'ı HTML'e dönüştür → PDF'e render et
- Synthux logosu + header/footer + skor kartı ile branded template
- "Download design-change.md" yanına "Download PDF" butonu

**Bağımlılık:** Yok — client-side kütüphane

---

### 4. 🔑 BYOK API Key Desteği (OpenAI, Gemini, Claude)
**Effort:** ~4 gün | **Etki:** Çok Yüksek

Kullanıcının kendi API anahtarını girerek güçlü modeller kullanabilmesi.

- Settings'e "API Provider" seçici (Ollama / OpenAI / Gemini / Claude)
- Her provider için endpoint + auth konfigürasyonu
- `ai-client.js`'e provider adapter pattern ekle
- API key'i `chrome.storage.local`'da sakla (cihazdan çıkmaz)
- Token maliyet tahmini gösterimi (model başına $/1K token)

#### 💰 Maliyet Hesaplama — [`aicost`](https://github.com/ufhouck/aicost) Entegrasyonu

Token maliyet hesaplaması için kendi `aicost` projemizi kullanacağız:

- **`data/pricing.json`** — 50+ model fiyat veritabanı (haftalık otomatik güncelleme)
- **Döviz çevirisi** — TRY, EUR vb. yerel para birimine çeviri
- **Platform fee** — OpenRouter (%5.5) gibi aggregator ücretlerini hesaba kat
- **Direct vs Aggregator** karşılaştırma

**Entegrasyon planı:**
1. `pricing.json`'ı extension'a bundle et veya GitHub raw URL'den periyodik çek
2. Analiz sonrası raporda "Bu analiz X TRY tutardı" hesabını göster
3. Settings'te "Currency" seçici ekle (USD / TRY / EUR)
4. Ollama kullanıcıları için "Bu analiz ücretsiz — lokal AI kullanıyorsunuz ✓" notu

**Bağımlılık:** Yok — yeni adapter modülü

---

## Phase 2 — Core Improvements (v1.6–v1.7)
> Mevcut özellikleri derinleştiren, orta zorlukta eklemeler.

### 5. ♿ WCAG Full Audit Modülü
**Effort:** ~5 gün | **Etki:** Yüksek

Mevcut temel erişilebilirlik kontrolünü tam WCAG 2.2 AA/AAA audit'ine genişlet.

- `axe-core` kütüphanesini content script'e entegre et (~80KB)
- WCAG seviye filtreleme (A / AA / AAA)
- Kontrast oranı hesaplama + renk önerileri
- Klavye navigasyon testi (tab order map)
- Raporda ayrı "Accessibility" bölümü

**Bağımlılık:** Content script genişletme

---

### 6. 👥 Custom Sentetik Kullanıcı Profilleri
**Effort:** ~4 gün | **Etki:** Orta-Yüksek

Kullanıcının kendi persona'larını oluşturabilmesi.

- Profil oluşturma formu: isim, yaş, teknoloji seviyesi, engel durumu, amaç
- Profilleri `chrome.storage.local`'da kaydet
- Scanner component'a custom profil listesi ekle
- Analyzer prompt'unu dinamik profil tanımıyla genişlet

**Bağımlılık:** Yok — UI + prompt

---

### 7. 🔄 Zaman İçi Karşılaştırma (History Diff)
**Effort:** ~5 gün | **Etki:** Yüksek

"Geçen hafta vs bu hafta" — sürekli iyileştirme takibi.

- Mevcut report history'yi karşılaştırma için kullan
- Aynı URL'nin farklı tarihli raporlarını eşle
- Score diff gösterimi (↑↓ oklar, renk kodlu)
- Heuristik bazlı trend grafik (basit sparkline)
- History tab'ına "Compare" butonu

**Bağımlılık:** Mevcut history sistemi yeterli, UI eklemesi

---

### 8. 📸 Annotated Screenshot
**Effort:** ~6 gün | **Etki:** Çok Yüksek

Ekran görüntüsü üzerinde sorunlu alanları işaretleyen görsel çıktı.

- AI'dan element selector + bounding box bilgisi iste
- Content script'ten element koordinatlarını al
- Canvas veya SVG overlay ile screenshot üzerine annotation çiz
- Raporda tıklanabilir "sorunlu alan" haritası
- PDF raporuna annotated screenshot ekle

**Bağımlılık:** Content script + AI prompt genişletme

---

## Phase 3 — Advanced Features (v2.0)
> Mimari değişiklik gerektiren, büyük özellikler.

### 9. 🎭 Walkthrough Mode
**Effort:** ~8 gün | **Etki:** Çok Yüksek

Sentetik kullanıcının siteyi adım adım "gezdiğini" gösteren animasyonlu demo.

- AI'dan "user journey steps" (click targets, scroll points) iste
- Content script ile sayfada highlight + scroll animasyonu
- Side panel'de adım adım narration (bulgu + açıklama)
- Kayıt/replay mekanizması
- Müşteri sunumlarında çok etkili

**Bağımlılık:** Content script genişletme, yeni component

---

### 10. 🆚 Rakip Karşılaştırma (2 URL)
**Effort:** ~7 gün | **Etki:** Yüksek

İki URL'yi yan yana analiz edip karşılaştırma raporu üret.

- "Compare" modu: 2 URL girişi
- Her iki sayfayı sırayla tara + analiz et
- Heuristik bazlı yan yana skor tablosu
- Güçlü/zayıf yanlar diff raporu
- Markdown + PDF çıktı desteği

**Bağımlılık:** Mevcut analiz pipeline'ı yeterli, UI + orchestration

---

### 11. 📱 Multi-page User Flow Analizi
**Effort:** ~8 gün | **Etki:** Yüksek

Tek sayfa yerine çok sayfalı akışları (signup → dashboard → settings) sıralı analiz.

- URL listesi veya sitemap girişi
- Sıralı sayfa tarama + flow-bazlı heuristik (tutarlılık, geçiş kalitesi)
- Flow diagram (mermaid) oluşturma
- Sayfa-arası tutarlılık skoru

**Bağımlılık:** Analyzer refactor (multi-step orchestration)

---

### 12. 🧩 Plugin Kural Ekosistemi (Community Rule Packs)
**Effort:** ~10 gün | **Etki:** Çok Yüksek (uzun vadede)

Topluluk tarafından oluşturulan sektörel UX kural setleri.

- JSON-bazlı rule pack formatı tanımla
- Marketplace UI: browse, install, rate
- GitHub repo'dan rule pack yükleme (URL ile)
- Built-in paketler: e-commerce checkout, SaaS onboarding, fintech
- Community contribution rehberi

**Bağımlılık:** Rule engine refactor, yeni component

---

### 13. ⚡ WebGPU / Browser-Native AI
**Effort:** ~12 gün | **Etki:** Orta (gelecek)

Ollama gerektirmeden tarayıcı içinde AI çalıştırma.

- Chrome Built-in AI (Gemini Nano) veya WebGPU + ONNX runtime
- Ollama yerine tarayıcı-native model kullanımı
- Fallback chain: Browser AI → Ollama → BYOK API
- Model boyutu ve doğruluk trade-off yönetimi

**Bağımlılık:** Chrome API olgunluğu, deneysel

---

## Phase 4 — Platform Expansion (v3.0)
> Yeni platformlara taşıma.

### 14. 🎨 Figma Plugin
**Effort:** ~15+ gün | **Etki:** Yüksek (farklı kitle)

Figma tasarım aşamasında UX audit.

- Figma Plugin API ile frame/component tarama
- Design token analizi (spacing, color, typography tutarlılığı)
- Heuristik bazlı tasarım değerlendirmesi
- Figma UI (widget) ile sonuç gösterimi
- Ayrı repo veya monorepo yapısı

**Bağımlılık:** Tamamen yeni codebase, en son yapılacak

---

## Özet Tablo

| # | Özellik | Effort | Phase | Etki |
|:---|:---|:---|:---|:---|
| 0 | Chrome Web Store Yayını | ~3 gün | v1.5 | 🔴 Kritik |
| 1 | Actionable Code Fixes | ~2 gün | v1.5 | 🟢 Yüksek |
| 2 | Önceliklendirme Matrisi | ~2 gün | v1.5 | 🟢 Yüksek |
| 3 | PDF Rapor | ~3 gün | v1.5 | 🟡 Orta |
| 4 | BYOK API Key | ~4 gün | v1.5 | 🟢 Çok Yüksek |
| 5 | WCAG Full Audit | ~5 gün | v1.6 | 🟢 Yüksek |
| 6 | Custom Profiller | ~4 gün | v1.6 | 🟡 Orta-Yüksek |
| 7 | History Diff | ~5 gün | v1.7 | 🟢 Yüksek |
| 8 | Annotated Screenshot | ~6 gün | v1.7 | 🟢 Çok Yüksek |
| 9 | Walkthrough Mode | ~8 gün | v2.0 | 🟢 Çok Yüksek |
| 10 | Rakip Karşılaştırma | ~7 gün | v2.0 | 🟢 Yüksek |
| 11 | Multi-page Flow | ~8 gün | v2.0 | 🟢 Yüksek |
| 12 | Plugin Kural Ekosistemi | ~10 gün | v2.0 | 🟢 Çok Yüksek |
| 13 | WebGPU Browser AI | ~12 gün | v2.0 | 🟡 Orta |
| 14 | Figma Plugin | ~15+ gün | v3.0 | 🟢 Yüksek |
