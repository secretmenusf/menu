/**
 * Competitor Comparison Data
 *
 * Honest comparison showing where SF Secret Menu excels
 * and how we differ from other meal delivery options.
 */

export interface CompetitorFeature {
  name: string;
  secretMenu: string | boolean;
  competitors: Record<string, string | boolean>;
  highlight?: boolean; // Feature where we significantly excel
}

export interface Competitor {
  id: string;
  name: string;
  category: 'delivery' | 'meal-kit' | 'prepared' | 'premium';
  logo?: string;
  tagline: string;
  priceRange: string;
  description: string;
}

export const competitors: Competitor[] = [
  {
    id: 'ubereats',
    name: 'UberEats / DoorDash',
    category: 'delivery',
    tagline: 'Restaurant delivery apps',
    priceRange: '$15-40/meal',
    description: 'On-demand restaurant delivery with wide selection but inconsistent quality.',
  },
  {
    id: 'hellofresh',
    name: 'HelloFresh / Blue Apron',
    category: 'meal-kit',
    tagline: 'DIY meal kits',
    priceRange: '$9-12/serving',
    description: 'Pre-portioned ingredients with recipes. You do the cooking.',
  },
  {
    id: 'marley-spoon',
    name: 'Marley Spoon',
    category: 'meal-kit',
    tagline: 'Martha Stewart meal kits',
    priceRange: '$9-14/serving',
    description: 'Premium meal kits with Martha Stewart recipes. Still requires cooking.',
  },
  {
    id: 'factor',
    name: 'Factor / Freshly',
    category: 'prepared',
    tagline: 'Heat-and-eat prepared meals',
    priceRange: '$11-15/meal',
    description: 'Pre-made meals shipped frozen. Microwave to serve.',
  },
  {
    id: 'trifecta',
    name: 'Trifecta Nutrition',
    category: 'prepared',
    tagline: 'Fitness-focused meal prep',
    priceRange: '$12-16/meal',
    description: 'Macro-counted meals for athletes. Functional but not gourmet.',
  },
  {
    id: 'thistle',
    name: 'Thistle',
    category: 'premium',
    tagline: 'Plant-forward prepared meals',
    priceRange: '$12-16/meal',
    description: 'Health-focused meals with organic ingredients. Bay Area based.',
  },
  {
    id: 'sakara',
    name: 'Sakara Life',
    category: 'premium',
    tagline: 'Luxury plant-based wellness',
    priceRange: '$70-100/day',
    description: 'Ultra-premium plant-based program. Beautiful but extremely expensive.',
  },
  {
    id: 'erewhon',
    name: 'Erewhon Market',
    category: 'premium',
    tagline: 'Luxury organic grocery',
    priceRange: '$18-35/meal',
    description: 'Celebrity-favorite LA market. Premium prepared foods, pickup only.',
  },
];

export const comparisonCategories = [
  {
    id: 'ingredients',
    name: 'Ingredient Quality',
    icon: 'Leaf',
    features: [
      {
        name: '98% Organic Ingredients',
        secretMenu: true,
        competitors: {
          'ubereats': false,
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': 'Partial',
          'thistle': 'Mostly',
          'sakara': true,
          'erewhon': true,
        },
        highlight: true,
      },
      {
        name: 'Locally-Sourced Produce',
        secretMenu: true,
        competitors: {
          'ubereats': 'Varies',
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': false,
          'thistle': 'Partial',
          'sakara': 'Partial',
          'erewhon': true,
        },
        highlight: true,
      },
      {
        name: 'No Preservatives or Additives',
        secretMenu: true,
        competitors: {
          'ubereats': 'Varies',
          'hellofresh': true,
          'marley-spoon': true,
          'factor': false,
          'trifecta': false,
          'thistle': true,
          'sakara': true,
          'erewhon': true,
        },
      },
      {
        name: 'Pasture-Raised Meats',
        secretMenu: true,
        competitors: {
          'ubereats': 'Rarely',
          'hellofresh': false,
          'marley-spoon': 'Some',
          'factor': false,
          'trifecta': 'Some',
          'thistle': 'N/A',
          'sakara': 'N/A',
          'erewhon': true,
        },
        highlight: true,
      },
      {
        name: 'Wild-Caught Seafood',
        secretMenu: true,
        competitors: {
          'ubereats': 'Varies',
          'hellofresh': 'Some',
          'marley-spoon': 'Some',
          'factor': 'Some',
          'trifecta': true,
          'thistle': true,
          'sakara': 'N/A',
          'erewhon': true,
        },
      },
      {
        name: 'Non-GMO Verified',
        secretMenu: true,
        competitors: {
          'ubereats': false,
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': false,
          'thistle': true,
          'sakara': true,
          'erewhon': true,
        },
      },
    ],
  },
  {
    id: 'preparation',
    name: 'Preparation & Quality',
    icon: 'ChefHat',
    features: [
      {
        name: 'Professional Chef Prepared',
        secretMenu: true,
        competitors: {
          'ubereats': 'Varies',
          'hellofresh': false,
          'marley-spoon': false,
          'factor': 'Kitchen Staff',
          'trifecta': 'Kitchen Staff',
          'thistle': 'Kitchen Staff',
          'sakara': true,
          'erewhon': true,
        },
        highlight: true,
      },
      {
        name: 'Made Fresh Daily',
        secretMenu: true,
        competitors: {
          'ubereats': true,
          'hellofresh': 'You Cook',
          'marley-spoon': 'You Cook',
          'factor': false,
          'trifecta': false,
          'thistle': true,
          'sakara': true,
          'erewhon': true,
        },
        highlight: true,
      },
      {
        name: 'Never Frozen',
        secretMenu: true,
        competitors: {
          'ubereats': 'Varies',
          'hellofresh': true,
          'marley-spoon': true,
          'factor': false,
          'trifecta': false,
          'thistle': true,
          'sakara': true,
          'erewhon': true,
        },
        highlight: true,
      },
      {
        name: 'No Microwave Required',
        secretMenu: true,
        competitors: {
          'ubereats': true,
          'hellofresh': true,
          'marley-spoon': true,
          'factor': false,
          'trifecta': false,
          'thistle': 'Some',
          'sakara': true,
          'erewhon': true,
        },
      },
      {
        name: 'Restaurant-Quality Presentation',
        secretMenu: true,
        competitors: {
          'ubereats': 'Varies',
          'hellofresh': 'DIY',
          'marley-spoon': 'DIY',
          'factor': false,
          'trifecta': false,
          'thistle': 'Simple',
          'sakara': true,
          'erewhon': true,
        },
        highlight: true,
      },
    ],
  },
  {
    id: 'service',
    name: 'Service & Experience',
    icon: 'Heart',
    features: [
      {
        name: 'Personal Chef Experience',
        secretMenu: true,
        competitors: {
          'ubereats': false,
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': false,
          'thistle': false,
          'sakara': 'Partial',
          'erewhon': false,
        },
        highlight: true,
      },
      {
        name: 'Direct Chef Communication',
        secretMenu: true,
        competitors: {
          'ubereats': false,
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': false,
          'thistle': false,
          'sakara': false,
          'erewhon': false,
        },
        highlight: true,
      },
      {
        name: 'Custom Dietary Accommodations',
        secretMenu: true,
        competitors: {
          'ubereats': 'Limited',
          'hellofresh': 'Limited',
          'marley-spoon': 'Limited',
          'factor': 'Preset Plans',
          'trifecta': 'Preset Plans',
          'thistle': 'Good',
          'sakara': 'Limited',
          'erewhon': 'Limited',
        },
        highlight: true,
      },
      {
        name: 'Same-Day Delivery',
        secretMenu: true,
        competitors: {
          'ubereats': true,
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': false,
          'thistle': true,
          'sakara': false,
          'erewhon': 'Pickup',
        },
      },
      {
        name: 'Flexible Scheduling',
        secretMenu: true,
        competitors: {
          'ubereats': true,
          'hellofresh': 'Weekly',
          'marley-spoon': 'Weekly',
          'factor': 'Weekly',
          'trifecta': 'Weekly',
          'thistle': true,
          'sakara': 'Weekly',
          'erewhon': true,
        },
      },
      {
        name: 'No Subscription Required',
        secretMenu: true,
        competitors: {
          'ubereats': true,
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': false,
          'thistle': false,
          'sakara': false,
          'erewhon': true,
        },
      },
    ],
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: 'Sparkles',
    features: [
      {
        name: 'Nutrition Labels for Every Dish',
        secretMenu: true,
        competitors: {
          'ubereats': 'Rarely',
          'hellofresh': true,
          'marley-spoon': true,
          'factor': true,
          'trifecta': true,
          'thistle': true,
          'sakara': true,
          'erewhon': 'Partial',
        },
      },
      {
        name: 'Health Score Rating',
        secretMenu: true,
        competitors: {
          'ubereats': false,
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': false,
          'thistle': false,
          'sakara': false,
          'erewhon': false,
        },
        highlight: true,
      },
      {
        name: 'Healing-Focused Ingredients',
        secretMenu: true,
        competitors: {
          'ubereats': false,
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': false,
          'thistle': 'Some',
          'sakara': true,
          'erewhon': 'Some',
        },
        highlight: true,
      },
      {
        name: 'Anti-Inflammatory Focus',
        secretMenu: true,
        competitors: {
          'ubereats': false,
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': 'Some',
          'thistle': true,
          'sakara': true,
          'erewhon': 'Some',
        },
      },
      {
        name: 'Gut Health Consideration',
        secretMenu: true,
        competitors: {
          'ubereats': false,
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': false,
          'thistle': true,
          'sakara': true,
          'erewhon': 'Some',
        },
      },
    ],
  },
  {
    id: 'sustainability',
    name: 'Sustainability',
    icon: 'Recycle',
    features: [
      {
        name: 'Eco-Friendly Packaging',
        secretMenu: true,
        competitors: {
          'ubereats': 'Rarely',
          'hellofresh': 'Improving',
          'marley-spoon': 'Improving',
          'factor': 'Some',
          'trifecta': 'Some',
          'thistle': true,
          'sakara': true,
          'erewhon': true,
        },
      },
      {
        name: 'Carbon-Conscious Delivery',
        secretMenu: true,
        competitors: {
          'ubereats': false,
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': false,
          'thistle': true,
          'sakara': 'Partial',
          'erewhon': 'N/A',
        },
      },
      {
        name: 'Support Local Farmers',
        secretMenu: true,
        competitors: {
          'ubereats': 'Varies',
          'hellofresh': false,
          'marley-spoon': false,
          'factor': false,
          'trifecta': false,
          'thistle': true,
          'sakara': 'Some',
          'erewhon': true,
        },
        highlight: true,
      },
      {
        name: 'Minimal Food Waste',
        secretMenu: true,
        competitors: {
          'ubereats': false,
          'hellofresh': true,
          'marley-spoon': true,
          'factor': true,
          'trifecta': true,
          'thistle': true,
          'sakara': true,
          'erewhon': 'Partial',
        },
      },
    ],
  },
];

// Value propositions
export const valueProps = [
  {
    title: 'Personal Chef, Not a Factory',
    description: 'Your meals are crafted by a trained chef who knows your preferences, not assembled on a production line.',
    icon: 'ChefHat',
    image: '/images/chef-kitchen.jpeg',
  },
  {
    title: 'Ingredients That Heal',
    description: 'Every ingredient is chosen for both flavor and nutritional benefit. Food as medicine, food as art.',
    icon: 'Heart',
    image: '/images/ingredients-heal.jpg',
  },
  {
    title: 'Never Compromised',
    description: 'Made fresh with real prep time. No microwave required, no freezer burn, no compromises.',
    icon: 'Flame',
    image: '/images/fresh-meat.jpg',
  },
  {
    title: 'Know Your Farmer',
    description: 'We source from local Bay Area farms and producers we personally know and trust.',
    icon: 'Leaf',
    image: '/images/know-your-farmer.jpg',
  },
  {
    title: 'Transparent Nutrition',
    description: 'Full nutrition facts and health scores for every dish. Know exactly what you\'re eating.',
    icon: 'Search',
    image: '/images/transparent-nutrition.jpg',
  },
  {
    title: 'Flexibility Without Commitment',
    description: 'No subscriptions required. Order when you want, skip when you don\'t. Your schedule, your rules.',
    icon: 'Calendar',
    image: '/images/flexibility.jpg',
  },
];

// Quick comparison stats
export const quickStats = [
  { label: 'Organic', secretMenu: '98%', average: '~15%' },
  { label: 'Local Sourcing', secretMenu: '90%+', average: '~5%' },
  { label: 'Made Fresh', secretMenu: 'Daily', average: 'Weekly/Frozen' },
  { label: 'Chef Prepared', secretMenu: 'Always', average: 'Rarely' },
  { label: 'Preservatives', secretMenu: 'Never', average: 'Usually' },
  { label: 'Customization', secretMenu: 'Full', average: 'Limited' },
];

// Testimonial quotes about switching
export const switcherTestimonials = [
  {
    quote: "I tried every meal kit service. HelloFresh was convenient but boring. Factor was fast but tasted like hospital food. Secret Menu is the first time I've actually looked forward to dinner.",
    author: "Sarah K.",
    previous: "HelloFresh, Factor",
  },
  {
    quote: "As someone who used to spend $50/day on Erewhon prepared foods, this is the same quality at half the price, delivered to my door.",
    author: "Marcus T.",
    previous: "Erewhon Market",
  },
  {
    quote: "I was skeptical about another meal service after Sakara's astronomical prices. Secret Menu delivers the same wellness-focused approach without the $500/week price tag.",
    author: "Jennifer L.",
    previous: "Sakara Life",
  },
];
