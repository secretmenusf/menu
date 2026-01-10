// Gift card options for SF Secret Menu
// Premium gift card denominations and delivery options

export interface GiftCardOption {
  id: string;
  amount: number; // in dollars
  label: string;
  popular?: boolean;
}

export interface DeliveryOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const giftCardAmounts: GiftCardOption[] = [
  {
    id: 'gc-50',
    amount: 50,
    label: '$50',
  },
  {
    id: 'gc-100',
    amount: 100,
    label: '$100',
    popular: true,
  },
  {
    id: 'gc-200',
    amount: 200,
    label: '$200',
  },
  {
    id: 'gc-500',
    amount: 500,
    label: '$500',
  },
];

export const deliveryOptions: DeliveryOption[] = [
  {
    id: 'email-now',
    label: 'Email Now',
    description: 'Deliver instantly via email',
    icon: 'mail',
  },
  {
    id: 'email-scheduled',
    label: 'Schedule for Later',
    description: 'Choose a specific date and time',
    icon: 'calendar',
  },
  {
    id: 'print',
    label: 'Print at Home',
    description: 'Download a printable PDF',
    icon: 'printer',
  },
];

export interface GiftCardData {
  amount: number;
  isCustomAmount: boolean;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message: string;
  deliveryMethod: string;
  scheduledDate?: Date;
}

export const defaultGiftCardData: GiftCardData = {
  amount: 100,
  isCustomAmount: false,
  recipientName: '',
  recipientEmail: '',
  senderName: '',
  message: '',
  deliveryMethod: 'email-now',
};

export const giftMessages = [
  'Enjoy a taste of culinary excellence!',
  'Wishing you delicious moments ahead.',
  'Here\'s to extraordinary dining experiences.',
  'May every meal be a celebration.',
  'Savor the secret, share the joy.',
];

// Gift meal plan options
export interface GiftMealPlanOption {
  id: string;
  planId: string;
  name: string;
  duration: number; // months
  price: number;
  description: string;
  features: string[];
}

export const giftMealPlanOptions: GiftMealPlanOption[] = [
  {
    id: 'gift-essential-1',
    planId: 'essential',
    name: 'Essential',
    duration: 1,
    price: 395,
    description: '1 month of Essential membership',
    features: [
      '2 meals per week',
      '1 delivery day',
      'Weekly menu rotation',
    ],
  },
  {
    id: 'gift-standard-1',
    planId: 'standard',
    name: 'Standard',
    duration: 1,
    price: 595,
    description: '1 month of Standard membership',
    features: [
      '3 meals per week',
      '2 delivery days',
      'Dietary customization',
    ],
  },
  {
    id: 'gift-premium-1',
    planId: 'premium',
    name: 'Premium',
    duration: 1,
    price: 895,
    description: '1 month of Premium membership',
    features: [
      '5 meals per week',
      'Desserts included',
      'VIP scheduling',
    ],
  },
];

export const getGiftMealPlanById = (id: string): GiftMealPlanOption | undefined => {
  return giftMealPlanOptions.find(plan => plan.id === id);
};
