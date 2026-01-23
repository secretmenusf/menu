// Subscription plans for SF Secret Menu
// Premium meal delivery service tiers
// Updated pricing as of 2026

export type SubscriptionTier = 'explorer' | 'member' | 'pro' | 'developer' | 'startup';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  period: 'month';
  description: string;
  tagline: string;
  features: string[];
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
  aiCreditsIncluded: number; // AI chat messages/month
  creditDiscountPercent: number;
  deliveryFee: number; // in cents, 0 = free
  maxMembers: number; // for organizations/households
  // Payment integration
  stripePriceId?: string;
}

// Credit pricing
export const CREDIT_PRICING = {
  foodCreditRate: 100, // 1 cent = 1 credit for food
  aiCreditRate: 10, // 10 credits = 1 AI message (~$0.10)
  bulkDiscounts: [
    { minAmount: 5000, discount: 5 }, // $50+ = 5% off
    { minAmount: 10000, discount: 10 }, // $100+ = 10% off
    { minAmount: 25000, discount: 15 }, // $250+ = 15% off
    { minAmount: 50000, discount: 20 }, // $500+ = 20% off
  ],
};

export const DELIVERY_FEE_CENTS = 1000; // $10 delivery fee

export const SERVICE_AREAS = ['San Francisco'] as const;
export type ServiceArea = typeof SERVICE_AREAS[number];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    price: 9,
    period: 'month',
    description: 'Browse menus & get recipes',
    tagline: 'Perfect for food enthusiasts anywhere',
    features: [
      'Browse weekly secret menus',
      'Chef Antje AI cooking assistant (50 messages/mo)',
      'Get recipes to cook at home',
      'Nutrition guidance & meal planning',
      'Email support',
    ],
    popular: false,
    canViewSecretMenu: true,
    canOrderDelivery: false,
    canCustomizeOrders: false,
    canAccessArchives: false,
    canAccessSecretSecretMenu: false,
    canAccessChefAI: true,
    canCookAtHome: true,
    includedCredits: 0,
    aiCreditsIncluded: 50,
    creditDiscountPercent: 0,
    deliveryFee: DELIVERY_FEE_CENTS,
    maxMembers: 1,
    stripePriceId: 'price_explorer_2026',
  },
  {
    id: 'member',
    name: 'Member',
    price: 29,
    period: 'month',
    description: 'Unlock delivery in SF',
    tagline: 'Minimum to order delivery',
    features: [
      'Everything in Explorer',
      'Order next week\'s menu for delivery',
      'Access to secret menu items',
      'Archive of past weekly menus',
      '100 AI messages/month',
      'Priority email support',
    ],
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
    stripePriceId: 'price_member_2026',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    period: 'month',
    description: 'Credits included',
    tagline: 'Best value for regular ordering',
    features: [
      'Everything in Member',
      '$50 universal credits (food or AI)',
      'Customize orders after payment',
      'Access to secret secret menu',
      '200 AI messages/month',
      'Direct chef communication',
      'Flexible delivery windows',
    ],
    popular: true,
    canViewSecretMenu: true,
    canOrderDelivery: true,
    canCustomizeOrders: true,
    canAccessArchives: true,
    canAccessSecretSecretMenu: true,
    canAccessChefAI: true,
    canCookAtHome: true,
    includedCredits: 5000, // $50
    aiCreditsIncluded: 200,
    creditDiscountPercent: 0,
    deliveryFee: DELIVERY_FEE_CENTS,
    maxMembers: 2,
    stripePriceId: 'price_pro_2026',
  },
  {
    id: 'developer',
    name: 'Developer',
    price: 399,
    period: 'month',
    description: 'Feed a developer',
    tagline: '~2 meals/day, 5 days/week',
    features: [
      'Everything in Pro',
      '$350 in universal credits',
      '10% credit discount on orders',
      'Unlimited AI messages',
      'Custom dietary profiles',
      'VIP delivery scheduling',
      'Free delivery',
      'Dedicated support line',
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
    aiCreditsIncluded: -1, // Unlimited
    creditDiscountPercent: 10,
    deliveryFee: 0, // Free delivery
    maxMembers: 2,
    stripePriceId: 'price_developer_2026',
  },
  {
    id: 'startup',
    name: 'Startup',
    price: 999,
    period: 'month',
    description: 'Hacker house & teams',
    tagline: 'Feed your whole team',
    features: [
      'Everything in Developer',
      '$900 in universal credits',
      'Unlimited team members',
      '20% credit discount on all orders',
      'Team credit allocation',
      'On-demand ordering for members',
      'Unlimited AI for all members',
      'Dedicated account manager',
      'Custom event catering',
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
    aiCreditsIncluded: -1, // Unlimited
    creditDiscountPercent: 20,
    deliveryFee: 0, // Free delivery
    maxMembers: -1, // Unlimited
    stripePriceId: 'price_startup_2026',
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
  'Curated by Chef Antje, world-class private chef',
  'Fresh, locally-sourced ingredients from Bay Area farms',
  'Complete dietary modifications available',
  'Cancel or pause anytime, no commitments',
  'New menu every week, forever',
  'Eco-friendly packaging and delivery',
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
  return SERVICE_AREAS.some(area =>
    area.toLowerCase() === city.toLowerCase() ||
    city.toLowerCase().includes('san francisco') ||
    city.toLowerCase() === 'sf'
  );
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
