const translations = {
  en: {
    // Nav
    navFeatures: 'Features',
    navHow: 'How It Works',
    navPrivacy: 'Privacy',
    langToggle: 'TR',

    // Hero
    heroTagline: 'AI-powered UX audit in your browser.',
    heroSubtitle: 'Open source Chrome extension that evaluates web pages using synthetic user profiles, Nielsen\'s 10 Usability Heuristics, WCAG audit, and vision analysis — powered by local AI or your own API key.',
    heroBadgePrivacy: '100% Private',
    heroBadgeOpenSource: 'Open Source',
    heroCtaInstall: 'Add to Chrome',
    heroCtaGithub: 'View on GitHub',

    // Features
    featuresTitle: 'Features',
    featuresSubtitle: 'Everything you need for comprehensive UX evaluation.',
    feature1Title: 'Multi-Provider AI',
    feature1Desc: 'Local via Ollama (free) or cloud with your own API key — Gemini, OpenAI, or Claude. BYOK, no middleman.',
    feature2Title: 'Nielsen\'s 10 Heuristics',
    feature2Desc: 'Industry-standard UX evaluation framework with weighted scoring and actionable recommendations.',
    feature3Title: 'WCAG Audit (axe-core)',
    feature3Desc: 'Automated WCAG 2.2 AA compliance testing. Violations with impact severity, affected elements, and fix references.',
    feature4Title: 'Custom User Profiles',
    feature4Desc: 'Create up to 5 custom personas with age, tech level, accessibility needs, and goals — alongside 3 built-in profiles.',
    feature5Title: 'Custom Analysis Mode',
    feature5Desc: 'Quick, Deep, or Custom — pick specific heuristics via toggle chips. Dynamic time estimates based on your selection.',
    feature6Title: 'Vision Analysis',
    feature6Desc: 'Full-page screenshot capture. AI evaluates visual hierarchy, color harmony, and CTA visibility alongside DOM data.',
    feature7Title: 'PDF & Markdown Export',
    feature7Desc: 'Professional reports with scores, code fixes, cost estimates, and priority matrix. Share with stakeholders.',
    feature8Title: 'Detailed Scoring',
    feature8Desc: '0-100 scores per heuristic with code fix suggestions, quick win indicators, and priority matrix.',
    feature9Title: 'Complete Privacy',
    feature9Desc: 'BYOK model — API keys stay in your browser. No middleman, no telemetry, no data collection.',
    feature10Title: 'Issue Heatmap',
    feature10Desc: 'Toggle a live heatmap overlay on the analyzed page. Critical issues glow red, moderate yellow, minor green — see problem density at a glance.',
    feature11Title: 'Hover-to-Highlight',
    feature11Desc: 'Hover any issue in the report to instantly highlight the affected element on the live page with severity-colored borders and tooltips.',

    // Compare
    compareTitle: 'Local vs Cloud',
    compareSubtitle: 'Choose the setup that fits your workflow.',
    compareQuick: 'Quick (3 heuristics)',
    compareDeep: 'Deep (10 heuristics)',
    compareCustom: 'Custom mode',
    compareCost: 'Cost',
    comparePrivacy: 'Privacy',
    compareSetup: 'Setup',
    compareNote: 'Times shown per profile. Selecting multiple profiles multiplies the duration proportionally.',

    // How it works
    howTitle: 'How It Works',
    howSubtitle: 'Get started in under 5 minutes.',
    howStep1Title: '1. Choose Your AI',
    howStep1Desc: 'Local (free): Install Ollama and pull a model. Cloud: Enter your Gemini, OpenAI, or Claude API key in Settings.',
    howStep2Title: '2. Add the Extension',
    howStep2Desc: 'Install synthux from the Chrome Web Store or from the GitHub repo.',
    howStep3Title: '3. Analyze Any Page',
    howStep3Desc: 'Open the side panel, select Quick, Deep, or Custom mode, and hit Analyze. Get scores, WCAG audit, code fixes, and exportable reports.',

    // Screenshot
    screenshotTitle: 'See It in Action',
    screenshotSubtitle: 'A clean, professional interface in your browser\'s side panel.',

    // Privacy
    privacyTitle: 'Privacy & Security',
    privacySubtitle: 'Built with a privacy-first architecture. No exceptions.',
    privacyItem1: 'Local mode runs entirely on your machine. Cloud mode uses your own API key directly — no middleman',
    privacyItem2: 'No telemetry, no analytics, no tracking in the extension',
    privacyItem3: 'Automated security scanning with Dependabot & CodeQL',
    privacyItem4: 'Open source — inspect every line of code yourself',
    privacyReadMore: 'Read our Privacy Policy',

    // Open Source
    ossTitle: 'Open Source',
    ossSubtitle: 'Built in the open. Contributions welcome.',
    ossDesc: 'synthux is MIT licensed. Fork it, extend it, make it yours.',
    ossCta: 'Star on GitHub',
    ossContribute: 'Contributing Guide',

    // Works With
    worksWithLabel: 'Works with',

    // Footer
    footerTagline: 'AI-powered UX audit.',
    footerResources: 'Resources',
    footerLegal: 'Legal',
    footerCommunity: 'Community',
    footerDocs: 'Documentation',
    footerChangelog: 'Changelog',
    footerGettingStarted: 'Getting Started',
    footerPrivacyPolicy: 'Privacy Policy',
    footerSecurityPolicy: 'Security Policy',
    footerLicense: 'MIT License',
    footerGithub: 'GitHub',
    footerIssues: 'Issues',
    footerContributing: 'Contributing',
    footerCopyright: '© 2026 synthux. Open source under MIT License.',
  },
  tr: {
    // Nav
    navFeatures: 'Özellikler',
    navHow: 'Nasıl Çalışır',
    navPrivacy: 'Gizlilik',
    langToggle: 'EN',

    // Hero
    heroTagline: 'Tarayıcınızda yapay zeka destekli UX denetimi.',
    heroSubtitle: 'Sentetik kullanıcı profilleri, Nielsen\'in 10 Sezgiseli, WCAG denetimi ve görsel analiz ile web sayfalarını değerlendiren açık kaynak Chrome uzantısı — yerel veya bulut AI.',
    heroBadgePrivacy: '100% Gizli',
    heroBadgeOpenSource: 'Açık Kaynak',
    heroCtaInstall: 'Chrome\'a Ekle',
    heroCtaGithub: 'GitHub\'da İncele',

    // Features
    featuresTitle: 'Özellikler',
    featuresSubtitle: 'Kapsamlı UX değerlendirmesi için ihtiyacınız olan her şey.',
    feature1Title: 'Çoklu AI Sağlayıcı',
    feature1Desc: 'Ollama ile yerel (ücretsiz) veya kendi API anahtarınızla bulut — Gemini, OpenAI veya Claude.',
    feature2Title: 'Nielsen\'in 10 Sezgiseli',
    feature2Desc: 'Ağırlıklı puanlama ve uygulanabilir önerilerle endüstri standardı UX değerlendirme çerçevesi.',
    feature3Title: 'WCAG Denetimi (axe-core)',
    feature3Desc: 'Otomatik WCAG 2.2 AA uyumluluk testi. Etki derecesi, etkilenen öğeler ve düzeltme referanslarıyla ihlaller.',
    feature4Title: 'Özel Kullanıcı Profilleri',
    feature4Desc: '3 yerleşik profilin yanında yaş, teknoloji seviyesi, erişilebilirlik ihtiyaçları ve hedeflerle 5\'e kadar özel persona oluşturun.',
    feature5Title: 'Özel Analiz Modu',
    feature5Desc: 'Hızlı, Derin veya Özel — toggle butonlarla belirli sezgiselleri seçin. Seçiminize göre dinamik süre tahmini.',
    feature6Title: 'Görsel Analiz',
    feature6Desc: 'Tam sayfa ekran görüntüsü. AI görsel hiyerarşi, renk uyumu ve CTA görünürlüğünü DOM ile birlikte değerlendirir.',
    feature7Title: 'PDF ve Markdown Dışa Aktarma',
    feature7Desc: 'Puanlar, kod düzeltmeleri, maliyet tahminleri ve öncelik matrisi ile profesyonel raporlar.',
    feature8Title: 'Detaylı Puanlama',
    feature8Desc: 'Her sezgisel için 0-100 puan, kod düzeltme önerileri, hızlı kazanım göstergeleri ve öncelik matrisi.',
    feature9Title: 'Tam Gizlilik',
    feature9Desc: 'BYOK modeli — API anahtarları tarayıcınızda kalır. Aracı yok, telemetri yok, veri toplama yok.',
    feature10Title: 'Sorun Isı Haritası',
    feature10Desc: 'Analiz edilen sayfada canlı ısı haritası açın. Kritik sorunlar kırmızı, orta sarı, düşük yeşil — sorun yoğunluğunu bir bakışta görün.',
    feature11Title: 'Üzerine Gelince Vurgulama',
    feature11Desc: 'Rapordaki herhangi bir soruna fareyle gelin, etkilenen öğeyi sayfada şiddet renkli kenarlık ve ipucu ile anında vurgulayın.',

    // Compare
    compareTitle: 'Yerel vs Bulut',
    compareSubtitle: 'İş akışınıza uygun kurulumu seçin.',
    compareQuick: 'Hızlı (3 sezgisel)',
    compareDeep: 'Derin (10 sezgisel)',
    compareCustom: 'Özel mod',
    compareCost: 'Maliyet',
    comparePrivacy: 'Gizlilik',
    compareSetup: 'Kurulum',
    compareNote: 'Süreler profil başınadır. Birden fazla profil seçmek süreyi orantılı olarak artırır.',

    // How it works
    howTitle: 'Nasıl Çalışır',
    howSubtitle: '5 dakikadan kısa sürede başlayın.',
    howStep1Title: '1. AI Seçin',
    howStep1Desc: 'Yerel (ücretsiz): Ollama kurun ve bir model çekin. Bulut: Ayarlar\'dan Gemini, OpenAI veya Claude API anahtarınızı girin.',
    howStep2Title: '2. Uzantıyı Ekleyin',
    howStep2Desc: 'synthux\'u Chrome Web Store\'dan veya GitHub deposundan yükleyin.',
    howStep3Title: '3. Sayfayı Analiz Edin',
    howStep3Desc: 'Yan paneli açın, Hızlı, Derin veya Özel modu seçin ve Analiz\'e basın. Puanlar, WCAG denetimi, kod düzeltmeleri ve raporlar alın.',

    // Screenshot
    screenshotTitle: 'Çalışırken Görün',
    screenshotSubtitle: 'Tarayıcınızın yan panelinde temiz, profesyonel bir arayüz.',

    // Privacy
    privacyTitle: 'Gizlilik ve Güvenlik',
    privacySubtitle: 'Gizlilik öncelikli mimari. İstisna yok.',
    privacyItem1: 'Yerel mod bilgisayarınızda çalışır. Bulut mod API anahtarınızı doğrudan kullanır — aracı yok',
    privacyItem2: 'Uzantıda telemetri, analitik veya takip yok',
    privacyItem3: 'Dependabot ve CodeQL ile otomatik güvenlik taraması',
    privacyItem4: 'Açık kaynak — her satır kodu kendiniz denetleyin',
    privacyReadMore: 'Gizlilik Politikamızı Okuyun',

    // Open Source
    ossTitle: 'Açık Kaynak',
    ossSubtitle: 'Açık olarak inşa edildi. Katkılarınızı bekliyoruz.',
    ossDesc: 'synthux MIT lisansı altındadır. Fork\'layın, genişletin, kendinize uyarlayın.',
    ossCta: 'GitHub\'da Yıldızlayın',
    ossContribute: 'Katkı Rehberi',

    // Works With
    worksWithLabel: 'Desteklenen Platformlar',

    // Footer
    footerTagline: 'Yapay zeka destekli UX denetimi.',
    footerResources: 'Kaynaklar',
    footerLegal: 'Yasal',
    footerCommunity: 'Topluluk',
    footerDocs: 'Dokümantasyon',
    footerChangelog: 'Değişiklik Günlüğü',
    footerGettingStarted: 'Başlangıç Rehberi',
    footerPrivacyPolicy: 'Gizlilik Politikası',
    footerSecurityPolicy: 'Güvenlik Politikası',
    footerLicense: 'MIT Lisansı',
    footerGithub: 'GitHub',
    footerIssues: 'Sorunlar',
    footerContributing: 'Katkıda Bulunma',
    footerCopyright: '© 2026 synthux. MIT Lisansı altında açık kaynak.',
  }
};

function applyLanguage(lang) {
  const t = translations[lang];
  if (!t) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  document.documentElement.lang = lang;
  localStorage.setItem('synthux-lang', lang);
}

function getLanguage() {
  return localStorage.getItem('synthux-lang') || 'en';
}

function toggleLanguage() {
  const next = getLanguage() === 'en' ? 'tr' : 'en';
  applyLanguage(next);
}
