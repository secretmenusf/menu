// Subscription plans for SF Secret Menu
// Conversion-focused 4-tier structure
// Updated pricing as of 2026

export type SubscriptionTier = 'access' | 'plus' | 'solodev' | 'hackerhouse';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  period: 'month';
  description: string;
  tagline: string;
  features: string[];
  notIncluded?: string[];
  popular: boolean;
  // Access controls
  canViewSecretMenu: boolean;
  canOrderDelivery: boolean;
  canCustomizeOrders: boolean;
  canAccessArchives: boolean;
  canAccessSecretSecretMenu: boolean;
  canAccessChefAI: boolean;
  canCookAtHome: boolean;
  // Credits (can be used for food OR AI)
  includedCredits: number; // in cents - universal credits
  aiCreditsIncluded: number; // AI chat messages/month (-1 = unlimited)
  creditDiscountPercent: number;
  deliveryFee: number; // in cents, 0 = free
  maxMembers: number; // for organizations/households (-1 = unlimited)
  // CTA
  ctaText: string;
  // Payment integration
  stripePriceId?: string;
}

// Delivery fee
export const DELIVERY_FEE_CENTS = 1000; // $10 delivery fee

export const SERVICE_AREAS = ['San Francisco', 'SF', 'Bay Area'] as const;
export type ServiceArea = typeof SERVICE_AREAS[number];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'access',
    name: 'Access',
    price: 29,
    period: 'month',
    description: 'Unlock the menu + ordering',
    tagline: 'For anyone who wants in',
    features: [
      'Full weekly menu access (members-only)',
      'Order next week\'s menu (SF Bay Area)',
      'Menu archives',
      'Chef AI included',
    ],
    notIncluded: ['Meals + delivery fees not included'],
    popular: false,
    canViewSecretMenu: true,
    canOrderDelivery: true,
    canCustomizeOrders: false,
    canAccessArchives: true,
    canAccessSecretSecretMenu: false,
    canAccessChefAI: true,
    canCookAtHome: true,
    includedCredits: 0,
    aiCreditsIncluded: 100,
    creditDiscountPercent: 0,
    deliveryFee: DELIVERY_FEE_CENTS,
    maxMembers: 1,
    ctaText: 'Unlock Access',
    stripePriceId: 'price_access_2026',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 79,
    period: 'month',
    description: 'Includes a meal + delivery',
    tagline: 'Best for trying it without thinking',
    features: [
      'Everything in Access',
      'Monthly meal credit (~1 meal)',
      'Delivery included for credited meal',
      'Early access to limited items',
      'Chef AI included',
    ],
    notIncluded: ['Additional meals paid at checkout'],
    popular: true,
    canViewSecretMenu: true,
    canOrderDelivery: true,
    canCustomizeOrders: true,
    canAccessArchives: true,
    canAccessSecretSecretMenu: true,
    canAccessChefAI: true,
    canCookAtHome: true,
    includedCredits: 3500, // ~$35 for 1 meal + delivery
    aiCreditsIncluded: 200,
    creditDiscountPercent: 0,
    deliveryFee: DELIVERY_FEE_CENTS, // But first delivery covered by credits
    maxMembers: 2,
    ctaText: 'Start Plus',
    stripePriceId: 'price_plus_2026',
  },
  {
    id: 'solodev',
    name: 'Solo Dev',
    price: 399,
    period: 'month',
    description: 'Power user plan (1 person)',
    tagline: 'For the "I want this handled" lifestyle',
    features: [
      'Everything in Plus',
      'Larger monthly meal credit',
      'Priority customization + VIP delivery',
      'Direct support line',
      'Chef AI (4x usage, buy more anytime)',
    ],
    popular: false,
    canViewSecretMenu: true,
    canOrderDelivery: true,
    canCustomizeOrders: true,
    canAccessArchives: true,
    canAccessSecretSecretMenu: true,
    canAccessChefAI: true,
    canCookAtHome: true,
    includedCredits: 35000, // $350 worth
    aiCreditsIncluded: 400, // 4x base (100 * 4)
    creditDiscountPercent: 10,
    deliveryFee: 0, // Free delivery
    maxMembers: 2,
    ctaText: 'Go Solo Dev',
    stripePriceId: 'price_solodev_2026',
  },
  {
    id: 'hackerhouse',
    name: 'Hacker House',
    price: 999,
    period: 'month',
    description: 'Feed the house',
    tagline: 'Built for teams / group living',
    features: [
      'Everything in Solo Dev',
      'Multiple house members (shared access)',
      'Shared credit pool + per-person dietary profiles',
      'House-level delivery coordination',
      'Dedicated concierge support',
      'Chef AI (8x usage for all, buy more anytime)',
    ],
    popular: false,
    canViewSecretMenu: true,
    canOrderDelivery: true,
    canCustomizeOrders: true,
    canAccessArchives: true,
    canAccessSecretSecretMenu: true,
    canAccessChefAI: true,
    canCookAtHome: true,
    includedCredits: 90000, // $900 worth
    aiCreditsIncluded: 800, // 8x base (100 * 8)
    creditDiscountPercent: 20,
    deliveryFee: 0, // Free delivery
    maxMembers: -1, // Unlimited
    ctaText: 'Run a Hacker House',
    stripePriceId: 'price_hackerhouse_2026',
  },
];

// Expansion cities
export interface City {
  name: string;
  country: string;
  status: 'active' | 'coming_soon' | 'voting';
  launchDate?: string;
  votes?: number;
}

export const expansionCities: City[] = [
  // Active
  { name: 'San Francisco', country: 'USA', status: 'active' },
  // Coming Soon - USA
  { name: 'Los Angeles', country: 'USA', status: 'coming_soon', launchDate: 'Q2 2026' },
  { name: 'New York City', country: 'USA', status: 'coming_soon', launchDate: 'Q3 2026' },
  { name: 'Chicago', country: 'USA', status: 'coming_soon', launchDate: 'Q3 2026' },
  { name: 'Miami', country: 'USA', status: 'coming_soon', launchDate: 'Q4 2026' },
  { name: 'Kansas City', country: 'USA', status: 'coming_soon', launchDate: 'Q4 2026' },
  { name: 'Austin', country: 'USA', status: 'voting', votes: 0 },
  { name: 'Seattle', country: 'USA', status: 'voting', votes: 0 },
  { name: 'Denver', country: 'USA', status: 'voting', votes: 0 },
  { name: 'Boston', country: 'USA', status: 'voting', votes: 0 },
  // International - Coming Soon
  { name: 'London', country: 'UK', status: 'coming_soon', launchDate: '2027' },
  { name: 'Paris', country: 'France', status: 'coming_soon', launchDate: '2027' },
  // International - Voting
  { name: 'Milan', country: 'Italy', status: 'voting', votes: 0 },
  { name: 'Venice', country: 'Italy', status: 'voting', votes: 0 },
  { name: 'Gstaad', country: 'Switzerland', status: 'voting', votes: 0 },
  { name: 'Barcelona', country: 'Spain', status: 'voting', votes: 0 },
  { name: 'Amsterdam', country: 'Netherlands', status: 'voting', votes: 0 },
  { name: 'Berlin', country: 'Germany', status: 'voting', votes: 0 },
  { name: 'Tokyo', country: 'Japan', status: 'voting', votes: 0 },
  { name: 'Singapore', country: 'Singapore', status: 'voting', votes: 0 },
  { name: 'Dubai', country: 'UAE', status: 'voting', votes: 0 },
  { name: 'Sydney', country: 'Australia', status: 'voting', votes: 0 },
  { name: 'Toronto', country: 'Canada', status: 'voting', votes: 0 },
  { name: 'Mexico City', country: 'Mexico', status: 'voting', votes: 0 },
];

export const getPlanById = (id: SubscriptionTier): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.id === id);
};

export const getPopularPlan = (): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.popular);
};

export const getMinimumDeliveryPlan = (): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.canOrderDelivery);
};

export const planBenefits = [
  'Weekly menu drops curated by Chef Antje',
  'Chef AI included in every plan',
  'Order ahead for next week (fresh sourcing)',
  'Cancel or pause anytime',
  'SF Bay Area delivery ($10, or free on higher plans)',
];

// Tier comparison for access control
export const canAccessFeature = (
  userTier: SubscriptionTier | null,
  feature: keyof Pick<SubscriptionPlan,
    'canViewSecretMenu' | 'canOrderDelivery' | 'canCustomizeOrders' |
    'canAccessArchives' | 'canAccessSecretSecretMenu' | 'canAccessChefAI' | 'canCookAtHome'
  >
): boolean => {
  if (!userTier) return false;
  const plan = getPlanById(userTier);
  if (!plan) return false;
  return plan[feature];
};

// Check if user is in a delivery service area
export const isInServiceArea = (city: string): boolean => {
  const normalized = city.toLowerCase();
  return normalized.includes('san francisco') ||
    normalized === 'sf' ||
    normalized.includes('bay area');
};

// Calculate delivery fee for a tier
export const getDeliveryFee = (tier: SubscriptionTier | null): number => {
  if (!tier) return DELIVERY_FEE_CENTS;
  const plan = getPlanById(tier);
  return plan?.deliveryFee ?? DELIVERY_FEE_CENTS;
};

// Calculate credit discount for a tier
export const getCreditDiscount = (tier: SubscriptionTier | null): number => {
  if (!tier) return 0;
  const plan = getPlanById(tier);
  return plan?.creditDiscountPercent ?? 0;
};
