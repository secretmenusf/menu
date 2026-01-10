export interface Review {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
  platform?: 'twitter' | 'instagram' | 'facebook' | 'linkedin';
  socialHandle?: string;
  socialUrl?: string;
  mealsOrdered?: string[];
  imageUrl?: string;
}

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    rating: 5,
    text: 'The duck confit was absolutely transcendent. Chef Antje has created something truly magical here. This isn\'t just food delivery - it\'s an experience.',
    date: '2026-01-05',
    platform: 'twitter',
    socialHandle: '@sarahchenSF',
    socialUrl: 'https://twitter.com/sarahchenSF',
    mealsOrdered: ['Duck Confit', 'Persian Rice', 'Basque Cheesecake'],
  },
  {
    id: '2',
    name: 'Marcus Rivera',
    rating: 5,
    text: 'Finally, restaurant-quality meals at home without the hassle. The Spanish paella reminded me of Barcelona. Incredible attention to detail.',
    date: '2026-01-03',
    platform: 'instagram',
    socialHandle: '@marcuseats',
    socialUrl: 'https://instagram.com/marcuseats',
    mealsOrdered: ['Spanish Chicken Paella', 'Spanish Gildas', 'Saffron Albondigas'],
  },
  {
    id: '3',
    name: 'Emily Watson',
    rating: 5,
    text: 'Joined the secret menu last month and I\'m obsessed. The weekly variety keeps things exciting, and the quality is consistently outstanding.',
    date: '2025-12-28',
    mealsOrdered: ['Mixed Greens', 'Kale Chicken Wrap', 'Rice Pudding'],
  },
  {
    id: '4',
    name: 'David Park',
    rating: 5,
    text: 'As someone who works 60+ hour weeks, this service has been a game changer. Premium meals ready to heat. Worth every penny.',
    date: '2025-12-20',
    platform: 'linkedin',
    socialHandle: 'David Park',
    socialUrl: 'https://linkedin.com/in/davidpark',
    mealsOrdered: ['Roast Beef', 'Grilled Cheese', 'Mixed Beet Salad'],
  },
  {
    id: '5',
    name: 'Olivia Thompson',
    rating: 5,
    text: 'The Basque cheesecake alone is worth the subscription. But honestly, I haven\'t had a single disappointing meal yet. Pure culinary magic.',
    date: '2025-12-15',
    platform: 'twitter',
    socialHandle: '@oliviat_sf',
    socialUrl: 'https://twitter.com/oliviat_sf',
    mealsOrdered: ['Basque Cheesecake', 'Caprese Panini', 'Fennel Bulgur Salad'],
  },
  {
    id: '6',
    name: 'James Liu',
    rating: 5,
    text: 'Referred three friends already. The referral program is generous and the food speaks for itself. My whole office is hooked now.',
    date: '2025-12-10',
    platform: 'facebook',
    socialHandle: 'James Liu',
    socialUrl: 'https://facebook.com/jamesliu',
    mealsOrdered: ['Beef Bulgogi Bowl', 'Padrón Peppers', 'Colossal Cookies'],
  },
];
