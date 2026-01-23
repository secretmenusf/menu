/**
 * Site Configuration
 *
 * Supports two site variants:
 * - secretmenusf.com: SF-focused local delivery site
 * - secretmenu.vip: Global expansion / VIP site
 *
 * Set VITE_SITE_VARIANT in .env to switch between them
 */

export type SiteVariant = 'sf' | 'vip';

// Determine site variant from environment or hostname
function getSiteVariant(): SiteVariant {
  // Check environment variable first
  const envVariant = import.meta.env.VITE_SITE_VARIANT;
  if (envVariant === 'vip' || envVariant === 'sf') {
    return envVariant;
  }

  // Auto-detect from hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('secretmenu.vip') || hostname.includes('vip')) {
      return 'vip';
    }
  }

  // Default to SF
  return 'sf';
}

export const SITE_VARIANT = getSiteVariant();
export const IS_VIP_SITE = SITE_VARIANT === 'vip';
export const IS_SF_SITE = SITE_VARIANT === 'sf';

// Site-specific configuration
export const siteConfig = {
  sf: {
    name: 'SF Secret Menu',
    tagline: 'Chef-Crafted Meals Delivered',
    domain: 'secretmenusf.com',
    url: 'https://secretmenusf.com',
    email: {
      support: 'support@secretmenusf.com',
      hello: 'hello@secretmenusf.com',
      press: 'press@secretmenusf.com',
      legal: 'legal@secretmenusf.com',
      privacy: 'privacy@secretmenusf.com',
    },
    social: {
      twitter: '@secretmenusf',
      instagram: '@secretmenusf',
    },
    features: {
      delivery: true,
      localOnly: true,
      serviceArea: 'San Francisco',
      showGlobalExpansion: true,
    },
    theme: {
      accent: 'mystical', // Purple/gold
    },
  },
  vip: {
    name: 'Secret Menu',
    tagline: 'Global Culinary Excellence',
    domain: 'secretmenu.vip',
    url: 'https://secretmenu.vip',
    email: {
      support: 'support@secretmenu.vip',
      hello: 'hello@secretmenu.vip',
      press: 'press@secretmenu.vip',
      legal: 'legal@secretmenu.vip',
      privacy: 'privacy@secretmenu.vip',
    },
    social: {
      twitter: '@secretmenuvip',
      instagram: '@secretmenuvip',
    },
    features: {
      delivery: true,
      localOnly: false,
      serviceArea: 'Global',
      showGlobalExpansion: true,
      showCityVoting: true,
    },
    theme: {
      accent: 'gold', // More luxurious
    },
  },
} as const;

// Get current site config
export const currentSite = siteConfig[SITE_VARIANT];

// Helper functions
export function getSiteUrl(path: string = ''): string {
  return `${currentSite.url}${path}`;
}

export function getSiteEmail(type: keyof typeof currentSite.email): string {
  return currentSite.email[type];
}

export function isSFSite(): boolean {
  return SITE_VARIANT === 'sf';
}

export function isVIPSite(): boolean {
  return SITE_VARIANT === 'vip';
}

// Export for convenience
export default currentSite;
