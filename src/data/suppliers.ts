// Bay Area Supplier Partners

export interface Supplier {
  id: string;
  name: string;
  location: string;
  category: string;
  description: string;
  logoUrl?: string;
  website?: string;
}

export const suppliers: Supplier[] = [
  {
    id: 'rancho-gordo',
    name: 'Rancho Gordo',
    location: 'Napa, California',
    category: 'Heirloom Beans & Grains',
    description: 'Heritage beans and grains grown using traditional methods',
    website: 'https://www.ranchogordo.com',
  },
  {
    id: 'lakeside-organic',
    name: 'Lakeside Organic Gardens',
    location: 'Watsonville, California',
    category: 'Organic Produce',
    description: 'Certified organic vegetables from the Pajaro Valley',
    website: 'https://www.lakesideorganic.com',
  },
  {
    id: 'monterey-fish',
    name: 'Monterey Fish Market',
    location: 'Monterey, California',
    category: 'Sustainable Seafood',
    description: 'Wild-caught, sustainably sourced seafood from local waters',
    website: 'https://www.montereyfish.com',
  },
  {
    id: 'cream-co',
    name: 'Cream Co.',
    location: 'Oakland, California',
    category: 'Artisan Dairy',
    description: 'Small-batch artisan dairy and specialty ingredients',
    website: 'https://www.creamco.com',
  },
  {
    id: 'point-reyes',
    name: 'Point Reyes Farmstead',
    location: 'Point Reyes, California',
    category: 'Artisan Cheese',
    description: 'Award-winning cheeses from pasture-raised cows',
    website: 'https://www.pointreyescheese.com',
  },
  {
    id: 'cowgirl-creamery',
    name: 'Cowgirl Creamery',
    location: 'Petaluma, California',
    category: 'Organic Cheese',
    description: 'Organic, sustainable artisan cheeses',
    website: 'https://www.cowgirlcreamery.com',
  },
  {
    id: 'marys-chicken',
    name: "Mary's Free Range",
    location: 'Sanger, California',
    category: 'Pasture-Raised Poultry',
    description: 'Free-range, air-chilled chicken raised humanely',
    website: 'https://www.maryschickens.com',
  },
  {
    id: 'strauss',
    name: 'Strauss Family Creamery',
    location: 'Marshall, California',
    category: 'Organic Dairy',
    description: 'Certified organic milk from grass-fed cows',
    website: 'https://www.strausfamilycreamery.com',
  },
  {
    id: 'brokaw',
    name: 'Brokaw Ranch',
    location: 'Santa Paula, California',
    category: 'Organic Avocados',
    description: 'Premium organic avocados and citrus',
    website: 'https://www.bfrench.com',
  },
  {
    id: 'hodo',
    name: 'Hodo Foods',
    location: 'Oakland, California',
    category: 'Artisan Tofu',
    description: 'Handcrafted organic tofu and plant proteins',
    website: 'https://www.hodofoods.com',
  },
];

// Our standards/values
export interface Standard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  highlight?: boolean;
}

export const standards: Standard[] = [
  {
    id: 'protein',
    title: '40–60g',
    subtitle: 'Quality Protein',
    description: 'Every meal delivers optimal protein from grass-fed, pasture-raised, and wild-caught sources.',
    icon: 'Beef',
    highlight: true,
  },
  {
    id: 'organic',
    title: '100%',
    subtitle: 'Organic Produce',
    description: 'All produce is certified organic and pesticide-free. No exceptions.',
    icon: 'Leaf',
    highlight: true,
  },
  {
    id: 'no-processed',
    title: 'Zero',
    subtitle: 'Processed Ingredients',
    description: 'No refined sugars, artificial additives, or hidden junk. Just real food.',
    icon: 'Ban',
  },
  {
    id: 'no-seed-oils',
    title: 'No',
    subtitle: 'Seed Oils',
    description: 'We cook exclusively with avocado oil, olive oil, and grass-fed butter.',
    icon: 'Droplets',
  },
  {
    id: 'banned',
    title: '60+',
    subtitle: 'Banned Ingredients',
    description: 'Our strict blacklist includes ingredients most "healthy" brands still use.',
    icon: 'ShieldX',
    highlight: true,
  },
  {
    id: 'glass',
    title: 'Glass',
    subtitle: 'Reusable Containers',
    description: 'Microplastic-free glass jars. Better for you, better for the planet.',
    icon: 'Container',
  },
  {
    id: 'meat',
    title: 'Nutrient',
    subtitle: 'Dense Proteins',
    description: 'Grass-fed beef, pasture-raised poultry, wild-caught seafood. Always.',
    icon: 'Fish',
  },
  {
    id: 'fiber',
    title: '8g+',
    subtitle: 'Fiber Per Meal',
    description: 'High fiber stabilizes blood sugar and supports metabolic health.',
    icon: 'Wheat',
    highlight: true,
  },
];

// Certifications
export const certifications = [
  {
    id: 'usda-organic',
    name: 'USDA Organic',
    description: 'Certified organic ingredients',
  },
  {
    id: 'certified-humane',
    name: 'Certified Humane',
    description: 'Humanely raised animal products',
  },
  {
    id: 'grass-fed',
    name: '100% Grass-Fed',
    description: 'Grass-fed and grass-finished beef',
  },
];
