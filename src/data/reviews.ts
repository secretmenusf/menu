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
    name: 'Sam Asher',
    rating: 5,
    text: 'The duck confit was incredible. I\'ve been ordering weekly for a few months now and the quality is always consistent. Really appreciate having good food ready after long work days.',
    date: '2026-01-05',
    mealsOrdered: ['Duck Confit', 'Persian Rice', 'Basque Cheesecake'],
  },
  {
    id: '2',
    name: 'Kathy Orel',
    rating: 5,
    text: 'Great variety each week and everything tastes fresh. The paella was a highlight. Nice to have restaurant-quality meals without having to cook.',
    date: '2026-01-03',
    mealsOrdered: ['Spanish Chicken Paella', 'Mixed Greens', 'Rice Pudding'],
  },
  {
    id: '3',
    name: 'Michael Kelling',
    rating: 5,
    text: 'Busy schedule means I don\'t have time to cook. This has been perfect - good portions, tastes great, and easy to heat up. The Basque cheesecake is a favorite.',
    date: '2025-12-28',
    mealsOrdered: ['Basque Cheesecake', 'Roast Beef', 'Mixed Beet Salad'],
  },
  {
    id: '4',
    name: 'Merve Isler',
    rating: 5,
    text: 'Chef Antje\'s meals have been a real game changer for me. I\'m really busy with work, and I\'ve tried other "chef-crafted" meal services before, but this is the first time it actually felt special. Everything tastes fresh and thoughtfully made, like true restaurant-quality food at home. And it\'s not just delicious, I genuinely feel better after eating it. It feels nourishing in a way that\'s hard to find. Having this kind of food ready during the week takes so much stress off my plate. I\'m really grateful for it.',
    date: '2025-12-08',
  },
  {
    id: '5',
    name: 'Jacques Arnoux',
    rating: 5,
    text: 'The duck was amazing.',
    date: '2026-01-18',
    mealsOrdered: ['Duck Confit'],
  },
];
