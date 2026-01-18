//Subscription plans for SF Secret Menu
// Premium meal delivery service tiers
// Updated pricing as of 2026

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'month';
  description: string;
  features: string[];
  popular: boolean;
  mealsPerWeek: number;
  squarePlanId?: string; // For Square subscription integration
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'essential',
    name: 'Essential',
    price: 420,
    period: 'month',
    description: 'Perfect for a taste',
    mealsPerWeek: 2,
    features: [
      '2 gourmet meals per week',
      '1 delivery window',
      'Weekly menu rotation',
      'Standard delivery timing',
      'Email support',
    ],
    popular: false,
    squarePlanId: 'essential-plan-2026',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 650,
    period: 'month',
    description: 'Our most popular plan',
    mealsPerWeek: 3,
    features: [
      '3 gourmet meals per week',
      '2 flexible delivery windows',
      'Weekly menu rotation',
      'Priority delivery scheduling',
      'Dietary customization',
      'Direct chef communication',
    ],
    popular: true,
    squarePlanId: 'standard-plan-2026',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 950,
    period: 'month',
    description: 'The complete experience',
    mealsPerWeek: 5,
    features: [
      '5 gourmet meals per week',
      '3 flexible delivery windows',
      'Exclusive desserts included',
      'VIP delivery scheduling',
      'Custom meal requests',
      'Priority chef support',
      'Special occasion menus',
    ],
    popular: false,
    squarePlanId: 'premium-plan-2026',
  },
];

export const getPlanById = (id: string): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.id === id);
};

export const getPopularPlan = (): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.popular);
};

export const planBenefits = [
  'Curated by world-class chefs',
  'Fresh, locally-sourced ingredients from Bay Area farms',
  'Complete dietary modifications available',
  'Cancel or pause anytime, no commitments',
  '20% service gratuity included in all pricing',
  'Eco-friendly packaging and delivery',
];
