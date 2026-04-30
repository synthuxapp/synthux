/**
 * synthux — Synthetic User Profiles
 * 
 * Defines personas for AI-driven UX evaluation.
 * Each profile has a unique perspective that influences how heuristics are evaluated.
 */

export const PROFILES = {
  'first-time': {
    id: 'first-time',
    icon: '🆕',
    name: {
      en: 'First-Time Visitor',
      tr: 'İlk Kez Gelen Ziyaretçi'
    },
    description: {
      en: 'A user who has never visited this website before. They are in exploration mode, unfamiliar with the site\'s navigation, terminology, and layout.',
      tr: 'Bu web sitesini daha önce hiç ziyaret etmemiş bir kullanıcı. Keşif modunda, sitenin navigasyonu, terminolojisi ve düzeni hakkında bilgi sahibi değil.'
    },
    systemPrompt: `You are a first-time visitor who has never seen this website before. You are:
- Unfamiliar with the site's navigation, layout, and terminology
- Trying to understand what this site/product does within the first few seconds
- Looking for clear visual hierarchy and obvious entry points
- Easily confused by jargon, abbreviations, or insider language
- Expecting intuitive navigation without needing external help
- Judging trustworthiness based on design quality and professionalism

When evaluating, focus on:
- First impressions and clarity of purpose
- Navigation discoverability
- Terminology accessibility
- Visual hierarchy effectiveness
- Call-to-action clarity
- Error prevention for unfamiliar users`,

    priorityHeuristics: [
      'visibility-of-system-status',
      'match-real-world',
      'recognition-over-recall',
      'aesthetic-minimalist'
    ],
    weight: 1.0
  },

  'power-user': {
    id: 'power-user',
    icon: '👨‍💻',
    name: {
      en: 'Power User',
      tr: 'Uzman Kullanıcı'
    },
    description: {
      en: 'An experienced user who values speed and efficiency above all. They look for keyboard shortcuts, advanced features, and gets frustrated by unnecessary steps.',
      tr: 'Hız ve verimliliğe her şeyin üstünde değer veren deneyimli bir kullanıcı. Klavye kısayolları, gelişmiş özellikler arar ve gereksiz adımlardan rahatsız olur.'
    },
    systemPrompt: `You are an experienced power user who values speed and efficiency above everything. You are:
- Impatient with unnecessary steps, confirmations, or animations
- Looking for keyboard shortcuts, batch actions, and quick access features
- Expecting consistent behavior across similar interactive elements
- Frustrated by lack of undo/redo or recovery options
- Wanting customization and flexibility in workflows
- Expecting search functionality and filtering options

When evaluating, focus on:
- Efficiency of common tasks
- Keyboard accessibility and shortcuts
- Consistency of UI patterns
- Undo/redo availability
- Search and filtering capabilities
- Customization options
- Error recovery speed`,

    priorityHeuristics: [
      'flexibility-efficiency',
      'consistency-standards',
      'error-recovery',
      'user-control-freedom'
    ],
    weight: 1.0
  },

  'accessibility': {
    id: 'accessibility',
    icon: '♿',
    name: {
      en: 'Accessibility User',
      tr: 'Erişilebilirlik Kullanıcısı'
    },
    description: {
      en: 'A user who relies on assistive technologies like screen readers and keyboard-only navigation. They have low vision and need high contrast and clear structure.',
      tr: 'Ekran okuyucu ve yalnızca klavye navigasyonu gibi yardımcı teknolojilere güvenen bir kullanıcı. Düşük görme kapasitesine sahip, yüksek kontrast ve net yapı gerektirir.'
    },
    systemPrompt: `You are a user who relies on assistive technologies. You are:
- Using a screen reader (like JAWS, NVDA, or VoiceOver) to navigate
- Navigating entirely with keyboard (Tab, Enter, Arrow keys, Escape)
- Dependent on proper heading structure for page comprehension
- Needing high color contrast (WCAG AA: 4.5:1 minimum)
- Requiring all interactive elements to have accessible names
- Expecting all images to have descriptive alt text
- Needing clear focus indicators to know where you are on the page
- Requiring form fields to have associated labels

When evaluating, focus on:
- Semantic HTML structure (headings, landmarks, lists)
- ARIA roles and labels completeness
- Keyboard navigability (Tab order, focus management)
- Color contrast ratios
- Alternative text for images
- Form accessibility (labels, error messages)
- Focus indicator visibility
- Skip navigation links`,

    priorityHeuristics: [
      'error-prevention',
      'help-documentation',
      'visibility-of-system-status',
      'recognition-over-recall'
    ],
    weight: 1.0
  }
};

/**
 * Get profile by ID (built-in or custom)
 */
export function getProfile(id) {
  return PROFILES[id] || null;
}

/**
 * Get profile by ID — checks custom profiles too
 */
export async function getProfileAsync(id) {
  if (PROFILES[id]) return PROFILES[id];
  const customs = await getCustomProfiles();
  return customs.find(p => p.id === id) || null;
}

/**
 * Get all profile IDs (built-in only)
 */
export function getProfileIds() {
  return Object.keys(PROFILES);
}

/**
 * Get profiles for display (localized names and descriptions)
 */
export function getProfilesForDisplay(lang = 'en') {
  return Object.values(PROFILES).map(p => ({
    id: p.id,
    icon: p.icon,
    name: p.name[lang] || p.name.en,
    description: p.description[lang] || p.description.en
  }));
}

// ─── Custom Profiles ─────────────────────────────────────────────────────────

const MAX_CUSTOM_PROFILES = 5;

/**
 * Get custom profiles from storage
 */
export async function getCustomProfiles() {
  try {
    const data = await chrome.storage.local.get({ customProfiles: [] });
    return data.customProfiles || [];
  } catch {
    return [];
  }
}

/**
 * Save a new custom profile (max 5)
 */
export async function saveCustomProfile(profile) {
  const customs = await getCustomProfiles();
  if (customs.length >= MAX_CUSTOM_PROFILES) {
    throw new Error(`Maximum ${MAX_CUSTOM_PROFILES} custom profiles allowed`);
  }

  const newProfile = {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    icon: '👤',
    custom: true,
    name: { en: profile.name, tr: profile.name },
    description: { en: profile.description || '', tr: profile.description || '' },
    // Custom persona attributes
    ageRange: profile.ageRange || '25-35',
    techLevel: profile.techLevel || 'medium',
    disabilities: profile.disabilities || [],
    goal: profile.goal || '',
    priorityHeuristics: profile.priorityHeuristics || [],
    weight: 1.0,
    // Generate system prompt from attributes
    systemPrompt: buildCustomSystemPrompt(profile)
  };

  customs.push(newProfile);
  await chrome.storage.local.set({ customProfiles: customs });
  return newProfile;
}

/**
 * Delete a custom profile by ID
 */
export async function deleteCustomProfile(id) {
  const customs = await getCustomProfiles();
  const filtered = customs.filter(p => p.id !== id);
  await chrome.storage.local.set({ customProfiles: filtered });
  return filtered;
}

/**
 * Get all profiles: built-in + custom (async)
 */
export async function getAllProfiles() {
  const builtIn = Object.values(PROFILES);
  const customs = await getCustomProfiles();
  return [...builtIn, ...customs];
}

/**
 * Build a system prompt from custom profile attributes
 */
export function buildCustomSystemPrompt(profile) {
  const techLabels = {
    low: 'not very comfortable with technology, prefers simple interfaces',
    medium: 'moderately comfortable with technology, uses common apps regularly',
    high: 'very tech-savvy, comfortable with complex interfaces and shortcuts'
  };

  const ageLabels = {
    '18-25': 'a young adult (18-25) who is digitally native',
    '25-35': 'an adult (25-35) with regular internet experience',
    '35-50': 'a middle-aged adult (35-50) with moderate tech familiarity',
    '50-65': 'an older adult (50-65) who may prefer larger text and simpler layouts',
    '65+': 'a senior user (65+) who needs high contrast, large click targets, and simple navigation'
  };

  const disabilityDescriptions = {
    vision: 'low vision — needs high contrast, large text, and screen reader support',
    hearing: 'hearing impairment — relies on captions and visual cues instead of audio',
    motor: 'motor disability — uses keyboard or switch device, needs large click targets',
    cognitive: 'cognitive disability — needs simple language, clear structure, and minimal distractions',
    none: 'no disabilities'
  };

  const age = ageLabels[profile.ageRange] || ageLabels['25-35'];
  const tech = techLabels[profile.techLevel] || techLabels['medium'];
  const disabilities = (profile.disabilities || []).length > 0
    ? profile.disabilities.map(d => disabilityDescriptions[d] || d).join('; ')
    : disabilityDescriptions.none;
  const goal = profile.goal || 'browsing the page to accomplish a task';

  return `You are ${age}. You are ${tech}.
Your accessibility needs: ${disabilities}.
Your goal on this page: ${goal}.

When evaluating this web page, adopt this persona fully. Consider:
- How would someone with your age, tech level, and abilities experience this page?
- Are there barriers that would prevent you from accomplishing your goal?
- Is the language, layout, and interaction design appropriate for your profile?
- Would you feel confident, confused, or frustrated using this page?

Evaluate from YOUR perspective — not as a generic user.`;
}
