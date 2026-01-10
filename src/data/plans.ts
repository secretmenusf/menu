// Subscription plans for SF Secret Menu
// Premium meal delivery service tiers

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'month';
  description: string;
  features: string[];
  popular: boolean;
  mealsPerWeek: number;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'essential',
    name: 'Essential',
    price: 395,
    period: 'month',
    description: 'Perfect for a taste',
    mealsPerWeek: 2,
    features: [
      '2 meals per week',
      '1 delivery day',
      'Weekly menu rotation',
      'Standard delivery window',
    ],
    popular: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 595,
    period: 'month',
    description: 'Our most popular plan',
    mealsPerWeek: 3,
    features: [
      '3 meals per week',
      '2 delivery days',
      'Weekly menu rotation',
      'Priority delivery window',
      'Dietary customization',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 895,
    period: 'month',
    description: 'The complete experience',
    mealsPerWeek: 5,
    features: [
      '5 meals per week',
      '3 delivery days',
      'Desserts included',
      'VIP delivery scheduling',
      'Chef special requests',
      'Priority support',
    ],
    popular: false,
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
  'Fresh, locally-sourced ingredients',
  'Dietary modifications available',
  'Cancel or pause anytime',
  '20% gratuity included',
];
