// The SECRET secret menu - California-inspired classics
// Only revealed via Konami code: ↑↑↓↓←→←→ Enter Space

export interface SecretMenuItem {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  image: string;
  category: 'burger' | 'sides' | 'drinks' | 'dessert' | 'special';
  tags: string[];
  inspiration?: string;
}

export const SECRET_SECRET_MENU: SecretMenuItem[] = [
  // BURGERS
  {
    id: 'animal-style-burger',
    name: 'Animal Style Smash',
    description: 'Double patty, grilled onions, mustard-fried, special sauce, pickles',
    longDescription: 'Two smashed beef patties cooked in mustard, topped with caramelized grilled onions, hand-spread pickles, extra special sauce, and melted American cheese on a butter-toasted bun.',
    price: 24,
    image: '/images/gallery/animal-burger.jpg',
    category: 'burger',
    tags: ['GF-option', 'Signature'],
    inspiration: 'In-N-Out',
  },
  {
    id: 'flying-dutchman',
    name: 'The Flying Dutchman',
    description: 'Two patties, two cheese slices, nothing else',
    longDescription: 'Pure protein perfection. Two beef patties with two slices of melted American cheese. No bun, no vegetables, no distractions.',
    price: 18,
    image: '/images/gallery/flying-dutchman.jpg',
    category: 'burger',
    tags: ['GF', 'Keto', 'Protein'],
    inspiration: 'In-N-Out',
  },
  {
    id: 'protein-style',
    name: 'Protein Style Wrap',
    description: 'Any burger wrapped in crisp butter lettuce',
    longDescription: 'Your burger of choice wrapped in fresh, crisp hand-leafed butter lettuce. All the flavor, none of the carbs.',
    price: 22,
    image: '/images/gallery/protein-style.jpg',
    category: 'burger',
    tags: ['GF', 'Keto', 'Low-Carb'],
    inspiration: 'In-N-Out',
  },
  {
    id: '4x4',
    name: 'The 4×4',
    description: 'Four patties, four cheese slices, all the fixings',
    longDescription: 'For the truly hungry. Four beef patties, four slices of American cheese, lettuce, tomato, onion, and our special spread.',
    price: 32,
    image: '/images/gallery/4x4-burger.jpg',
    category: 'burger',
    tags: ['Massive', 'Challenge'],
    inspiration: 'In-N-Out',
  },

  // SIDES
  {
    id: 'animal-fries',
    name: 'Animal Style Fries',
    description: 'Fries smothered in cheese, grilled onions & special sauce',
    longDescription: 'Fresh-cut fries topped with melted American cheese, caramelized grilled onions, and our house-made special sauce.',
    price: 12,
    image: '/images/gallery/animal-fries.jpg',
    category: 'sides',
    tags: ['V', 'Shareable'],
    inspiration: 'In-N-Out',
  },
  {
    id: 'well-done-fries',
    name: 'Well-Done Fries',
    description: 'Extra crispy, golden perfection',
    longDescription: 'Our fresh-cut fries cooked extra long for maximum crispiness. Perfectly golden and irresistibly crunchy.',
    price: 8,
    image: '/images/gallery/well-done-fries.jpg',
    category: 'sides',
    tags: ['V', 'GF', 'Crispy'],
    inspiration: 'In-N-Out',
  },
  {
    id: 'cheese-fries',
    name: 'Cheese Fries',
    description: 'Fries with two slices of melted American',
    longDescription: 'Fresh-cut fries generously topped with two slices of melted American cheese.',
    price: 10,
    image: '/images/gallery/cheese-fries.jpg',
    category: 'sides',
    tags: ['V', 'Classic'],
    inspiration: 'In-N-Out',
  },

  // DRINKS
  {
    id: 'neapolitan-shake',
    name: 'Neapolitan Shake',
    description: 'Chocolate, vanilla & strawberry swirled together',
    longDescription: 'The best of all worlds - rich chocolate, creamy vanilla, and fresh strawberry hand-spun into one glorious shake.',
    price: 9,
    image: '/images/gallery/neapolitan-shake.jpg',
    category: 'drinks',
    tags: ['V', 'Sweet', 'Classic'],
    inspiration: 'In-N-Out',
  },
  {
    id: 'root-beer-float',
    name: 'Root Beer Float',
    description: 'Vanilla shake meets root beer',
    longDescription: 'Creamy vanilla shake floated in ice-cold root beer. A nostalgic California classic.',
    price: 8,
    image: '/images/gallery/root-beer-float.jpg',
    category: 'drinks',
    tags: ['V', 'Sweet', 'Nostalgic'],
    inspiration: 'In-N-Out',
  },
  {
    id: 'venice-cold-brew',
    name: 'Venice Cold Brew',
    description: '24-hour steeped, served over ice with oat milk',
    longDescription: 'Slow-steeped for 24 hours, this smooth, rich cold brew is served over hand-cut ice with a splash of house-made oat milk.',
    price: 7,
    image: '/images/gallery/venice-cold-brew.jpg',
    category: 'drinks',
    tags: ['V', 'DF', 'Caffeinated'],
    inspiration: "Menotti's Venice",
  },
  {
    id: 'dirty-chai',
    name: 'The Dirty Chai',
    description: 'Spiced chai with a double shot of espresso',
    longDescription: 'House-made spiced chai meets double-shot espresso. The perfect balance of spice and caffeine.',
    price: 8,
    image: '/images/gallery/dirty-chai.jpg',
    category: 'drinks',
    tags: ['V', 'Caffeinated', 'Spiced'],
    inspiration: "Menotti's Venice",
  },

  // DESSERTS
  {
    id: 'pup-patty',
    name: 'Pup Patty',
    description: 'Plain unsalted patty for your four-legged friend',
    longDescription: 'A plain, unseasoned beef patty made especially for your furry companion. Because everyone deserves a treat.',
    price: 4,
    image: '/images/gallery/pup-patty.jpg',
    category: 'special',
    tags: ['Dog-Friendly', 'GF', 'DF'],
    inspiration: 'In-N-Out',
  },
  {
    id: 'basque-burnt',
    name: 'Basque Burnt Cheesecake',
    description: 'Caramelized top, creamy center, no crust',
    longDescription: 'Our signature crustless cheesecake with a deeply caramelized top and impossibly creamy interior. A San Sebastian classic.',
    price: 14,
    image: '/images/gallery/basque-cheesecake.jpg',
    category: 'dessert',
    tags: ['GF', 'Signature', 'Rich'],
    inspiration: 'La Viña, San Sebastián',
  },

  // SPECIALS
  {
    id: 'wish-burger',
    name: 'The Wish Burger',
    description: 'Veggie burger - all the fixings, no meat',
    longDescription: 'For those who wish for something different. Grilled onions, lettuce, tomato, and special sauce on a toasted bun.',
    price: 14,
    image: '/images/gallery/wish-burger.jpg',
    category: 'burger',
    tags: ['V', 'Veggie'],
    inspiration: 'In-N-Out',
  },
  {
    id: 'grilled-cheese',
    name: 'Grilled Cheese',
    description: 'Two slices of cheese, toasted bun, that\'s it',
    longDescription: 'Simple perfection. Two slices of American cheese melted between a butter-toasted bun.',
    price: 10,
    image: '/images/gallery/grilled-cheese-secret.jpg',
    category: 'burger',
    tags: ['V', 'Simple', 'Classic'],
    inspiration: 'In-N-Out',
  },
  {
    id: 'roadkill-fries',
    name: 'Roadkill Fries',
    description: 'Animal fries topped with a chopped burger patty',
    longDescription: 'Animal style fries taken to the next level with a chopped burger patty mixed in. Absolute carnage in the best way.',
    price: 16,
    image: '/images/gallery/roadkill-fries.jpg',
    category: 'sides',
    tags: ['Massive', 'Indulgent'],
    inspiration: 'In-N-Out (unofficial)',
  },
];

export const SECRET_CATEGORIES = [
  { id: 'all', name: 'ALL' },
  { id: 'burger', name: 'BURGERS' },
  { id: 'sides', name: 'SIDES' },
  { id: 'drinks', name: 'DRINKS' },
  { id: 'dessert', name: 'DESSERT' },
  { id: 'special', name: 'SPECIALS' },
];

export default SECRET_SECRET_MENU;
