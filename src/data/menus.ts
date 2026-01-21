// Enhanced Menu data for Secret Menu - Weekly rotating menus
// All dishes now match gallery images with full details, nutrition, and ordering capability

export interface MenuItemOption {
  id: string;
  name: string;
  priceModifier: number;  // positive for add-ons, negative for reductions
  category?: 'portion' | 'add-on' | 'side' | 'protein' | 'extra' | 'dietary';
  image?: string;  // optional image for the option
  allowMultiple?: boolean;  // if true, can select multiple quantities
  maxQuantity?: number;  // max quantity if allowMultiple is true
}

// Standard protein and customization options for vegetarian/salad dishes
export const vegetarianCustomizations: MenuItemOption[] = [
  { id: 'add-chicken', name: 'Add Grilled Free-Range Organic Chicken (+200g)', priceModifier: 8, category: 'protein', allowMultiple: true, maxQuantity: 5 },
  { id: 'add-steak', name: 'Add Grilled Grass-Fed Sirloin Steak (+200g)', priceModifier: 12, category: 'protein', allowMultiple: true, maxQuantity: 5 },
  { id: 'add-salmon', name: 'Add Pan-Seared Wild Caught Salmon (+200g)', priceModifier: 10, category: 'protein', allowMultiple: true, maxQuantity: 5 },
  { id: 'add-tofu', name: 'Add Marinated Teriyaki Tofu (+200g)', priceModifier: 5, category: 'protein', allowMultiple: true, maxQuantity: 5 },
  { id: 'add-sweet-potatoes', name: 'Add Sweet Potatoes', priceModifier: 3, category: 'extra', allowMultiple: true, maxQuantity: 5 },
  { id: 'add-artichoke-hearts', name: 'Add Artichoke Hearts', priceModifier: 2, category: 'extra', allowMultiple: true, maxQuantity: 5 },
  { id: 'add-avocado', name: 'Add Avocado', priceModifier: 3, category: 'extra', allowMultiple: true, maxQuantity: 5 },
  { id: 'add-artisan-bread', name: 'Add Artisan Bread Slice', priceModifier: 2, category: 'side', allowMultiple: true, maxQuantity: 10 }
];

// Standard potato substitution options for dishes with mashed potatoes
export const potatoSubstitutions: MenuItemOption[] = [
  { id: 'sub-roasted-potatoes', name: 'Sub for Roasted Rosemary Garlic Potatoes', priceModifier: 2, category: 'side' },
  { id: 'sub-fingerling-potatoes', name: 'Sub for Crispy Fingerling Potatoes', priceModifier: 2, category: 'side' },
  { id: 'sub-polenta', name: 'Sub for Creamy Polenta', priceModifier: 2, category: 'side' }
];

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  ingredients?: string[];
  tags?: ('gf' | 'df' | 'v' | 'vg')[];  // gluten-free, dairy-free, vegetarian, vegan
  price: number;
  image?: string;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    servingSize: string;
  };
  allergens?: string[];
  prepTime?: number; // minutes
  difficulty?: 'easy' | 'medium' | 'challenging';
  orderable: boolean;
  options?: MenuItemOption[];
  sortPriority?: number; // Lower = higher priority for meal prep display (1-100)
}

export interface DayMenu {
  day: string;
  lunch: MenuItem;
  dinner: MenuItem[];
  dessert: MenuItem | null;
}

export interface WeekMenu {
  id: string;
  startDate: string;  // ISO date string
  endDate: string;
  theme?: string;
  days: DayMenu[];
}

// Gallery Menu Items - All orderable dishes matching the images
export const galleryMenuItems: MenuItem[] = [
  {
    id: 'roasted-lamb-leg',
    name: 'Roasted Lamb Leg',
    description: 'Herb-crusted lamb with pomegranate glaze, roasted potatoes, and fresh mint sauce',
    ingredients: ['lamb leg', 'pomegranate molasses', 'rosemary', 'garlic', 'potatoes', 'fresh mint', 'yogurt', 'olive oil', 'butter', 'salt', 'black pepper'],
    tags: ['gf'],
    price: 44,
    sortPriority: 1,
    image: '/images/menu/plated/roastedlambleg.png',
    nutrition: { calories: 820, protein: 60, carbs: 42, fat: 48, fiber: 6, servingSize: '1 plate (575g)' },
    allergens: ['dairy'],
    prepTime: 120,
    difficulty: 'challenging',
    orderable: true,
    options: [
      { id: 'double-meat', name: 'Double Meat (+200g)', priceModifier: 18, category: 'protein' },
      { id: 'sub-roasted-veggies', name: 'Sub Roasted Potatoes for Roasted Veggies', priceModifier: 0, category: 'side' },
      { id: 'sub-mashed-potatoes', name: 'Sub Roasted Potatoes for Mashed Potatoes', priceModifier: 2, category: 'side' },
      { id: 'add-beet-salad', name: 'Side of Beet Salad', priceModifier: 9, category: 'side' },
      { id: 'add-garden-salad', name: 'Garden Salad', priceModifier: 8, category: 'side' },
      { id: 'double-salad', name: 'Double Salad', priceModifier: 6, category: 'side' },
      { id: 'double-potatoes', name: 'Double Potatoes', priceModifier: 7, category: 'side' },
      { id: 'add-chili-crunch', name: 'Chili Crunch', priceModifier: 3, category: 'add-on' },
      { id: 'add-chili-crunch-jar', name: 'Chili Crunch Jar', priceModifier: 16, category: 'add-on' }
    ]
  },
  {
    id: 'smashed-asian-cucumbers',
    name: 'Smashed Asian Cucumbers',
    description: 'Refreshing smashed cucumbers with garlic, chili oil, sesame, and rice vinegar',
    ingredients: ['Persian cucumbers', 'garlic', 'chili oil', 'sesame seeds', 'rice vinegar', 'soy sauce'],
    tags: ['vg', 'gf', 'df'],
    price: 11,
    sortPriority: 2,
    image: '/images/menu/plated/Smashedasiancucumbers.png',
    nutrition: { calories: 120, protein: 3, carbs: 12, fat: 8, fiber: 2, servingSize: '1 plate (250g)' },
    allergens: ['soy', 'sesame'],
    prepTime: 10,
    difficulty: 'easy',
    orderable: true,
    options: [
      ...vegetarianCustomizations.filter(opt =>
        opt.id !== 'add-sweet-potatoes' &&
        opt.id !== 'add-artichoke-hearts' &&
        opt.id !== 'add-artisan-bread'
      ),
      { id: 'add-jasmine-rice', name: 'Add Side of Organic Jasmine Rice', priceModifier: 4, category: 'side', allowMultiple: true, maxQuantity: 5 }
    ]
  },
  {
    id: 'spaghetti-meatballs',
    name: 'Spaghetti with Meatballs',
    description: 'House-made beef and pork meatballs in marinara over fresh pasta with garlic bread',
    ingredients: ['fresh spaghetti', 'beef', 'pork', 'marinara sauce', 'parmesan', 'garlic bread', 'basil'],
    tags: [],
    price: 28,
    sortPriority: 3,
    image: '/images/menu/plated/spaghettiw_meatballsandgarlicbread.png',
    nutrition: { calories: 820, protein: 42, carbs: 78, fat: 38, fiber: 6, servingSize: '1 plate (600g) - comes with 3 jumbo meatballs' },
    allergens: ['gluten', 'dairy', 'eggs'],
    prepTime: 45,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'extra-meatballs', name: '+ 3 Jumbo Meatballs', priceModifier: 8, category: 'protein', allowMultiple: true, maxQuantity: 3 },
      { id: 'extra-garlic-bread', name: 'Extra Garlic Bread', priceModifier: 4, category: 'side' },
      { id: 'add-garden-salad', name: 'Add Garden Salad', priceModifier: 8, category: 'side' },
      { id: 'extra-parmesan', name: 'Extra Parmesan', priceModifier: 2, category: 'add-on' },
      { id: 'add-chili-crunch', name: 'Chili Crunch', priceModifier: 3, category: 'add-on' },
      { id: 'add-chili-crunch-jar', name: 'Chili Crunch Jar', priceModifier: 16, category: 'add-on' }
    ]
  },
  {
    id: 'steak-salad',
    name: 'Steak Salad',
    description: 'Grilled grass-fed steak over mixed greens with blue cheese, fennel, microgreens, avocado, and pomegranate seeds with honey mustard vinaigrette',
    ingredients: ['grass-fed steak', 'mixed greens', 'blue cheese', 'fennel', 'microgreens', 'avocado', 'pomegranate seeds', 'honey mustard vinaigrette', 'olive oil', 'salt', 'black pepper'],
    tags: ['gf'],
    price: 30,
    sortPriority: 4,
    image: '/images/menu/plated/steaksalad.png',
    nutrition: { calories: 720, protein: 50, carbs: 24, fat: 48, fiber: 8, servingSize: '1 bowl (480g)' },
    allergens: ['dairy'],
    prepTime: 20,
    difficulty: 'easy',
    orderable: true,
    options: [
      { id: 'double-steak', name: 'Double Steak (+200g)', priceModifier: 16, category: 'protein' },
      { id: 'add-avocado', name: 'Add Avocado', priceModifier: 3, category: 'extra' },
      { id: 'extra-blue-cheese', name: 'Extra Blue Cheese', priceModifier: 3, category: 'add-on' },
      { id: 'add-artisan-bread', name: 'Add Artisan Bread Slice', priceModifier: 2, category: 'side', allowMultiple: true, maxQuantity: 5 },
      { id: 'add-chili-crunch', name: 'Chili Crunch', priceModifier: 3, category: 'add-on' },
      { id: 'add-chili-crunch-jar', name: 'Chili Crunch Jar', priceModifier: 16, category: 'add-on' }
    ]
  },
  {
    id: 'zucchini-carpaccio',
    name: 'Zucchini Carpaccio',
    description: 'Paper-thin zucchini ribbons with pine nuts, mint, shaved parmesan, extra virgin olive oil, and lemon vinaigrette',
    ingredients: ['organic zucchini', 'pine nuts', 'fresh mint', 'shaved parmesan', 'lemon', 'extra virgin olive oil', 'sea salt', 'black pepper'],
    tags: ['v', 'gf'],
    price: 16,
    sortPriority: 61,
    image: '/images/menu/plated/zuchinicarpaccio.png',
    nutrition: { calories: 390, protein: 16, carbs: 24, fat: 30, fiber: 10, servingSize: '2 servings (600g)' },
    allergens: ['tree nuts', 'dairy'],
    prepTime: 15,
    difficulty: 'easy',
    orderable: true,
    options: [...vegetarianCustomizations]
  },
  {
    id: 'sunday-roast',
    name: 'Sunday Roast',
    description: 'Traditional herb-crusted roast beef with smashed potatoes, roasted vegetables, and gravy',
    ingredients: ['grass-fed beef roast', 'smashed potatoes', 'carrots', 'roasted potatoes', 'Brussels sprouts', 'beef drippings', 'fresh herbs', 'butter', 'olive oil', 'red wine', 'flour', 'salt', 'black pepper'],
    tags: ['gf'],
    price: 40,
    sortPriority: 17,
    image: '/images/menu/plated/sundayroast.png',
    nutrition: { calories: 850, protein: 62, carbs: 58, fat: 46, fiber: 9, servingSize: '1 plate (700g)' },
    allergens: [],
    prepTime: 120,
    difficulty: 'challenging',
    orderable: true,
    options: [
      { id: 'yorkshire-pudding', name: 'Add Yorkshire Pudding', priceModifier: 12, category: 'add-on', image: '/images/menu/plated/yorkshirepudding.png' },
      { id: 'extra-gravy', name: 'Extra Gravy', priceModifier: 3, category: 'add-on' },
      { id: 'sub-mashed-potatoes', name: 'Substitute Smashed Potatoes for Mashed Potatoes', priceModifier: 2, category: 'side' },
      { id: 'sub-fingerling-potatoes', name: 'Substitute Smashed Potatoes for Crispy Fingerling Potatoes', priceModifier: 2, category: 'side' },
      { id: 'sub-polenta', name: 'Substitute Smashed Potatoes for Creamy Polenta', priceModifier: 2, category: 'side' },
      { id: 'half-portion', name: '1/2 Portion of Meat', priceModifier: -8, category: 'portion' },
      { id: 'double-portion', name: 'Double Portion of Meat', priceModifier: 16, category: 'portion' },
      { id: 'artisan-bread', name: 'Add Artisan Bread Slice', priceModifier: 2, category: 'side' }
    ]
  },
  {
    id: 'spinach-salad',
    name: 'Spinach Walnut Apple Salad',
    description: 'Baby spinach with Pink Lady apples, candied walnuts, and goat cheese crumbles, with balsamic vinaigrette',
    ingredients: ['baby spinach', 'Pink Lady apples', 'candied walnuts', 'goat cheese', 'balsamic vinaigrette'],
    tags: ['v', 'gf'],
    price: 18,
    sortPriority: 35,
    image: '/images/menu/plated/spinachsalad.png',
    nutrition: { calories: 428, protein: 15, carbs: 30, fat: 27, fiber: 8, servingSize: '1 bowl (375g)' },
    allergens: ['dairy', 'tree nuts'],
    prepTime: 10,
    difficulty: 'easy',
    orderable: true,
    options: [...vegetarianCustomizations]
  },
  {
    id: 'spanish-gildas',
    name: 'Spanish Gildas',
    description: 'Traditional pintxo with anchovy, stuffed sweet pepper with goat cheese, and pickled pepperoncini on a toothpick',
    ingredients: ['Spanish anchovies', 'sweet peppers', 'goat cheese', 'pepperoncini', 'extra virgin olive oil'],
    tags: ['gf'],
    price: 9,
    sortPriority: 66,
    image: '/images/menu/plated/spanishgildass.png',
    nutrition: { calories: 68, protein: 5, carbs: 2, fat: 6, fiber: 0, servingSize: '1 serving: 3 pieces' },
    allergens: ['fish', 'dairy'],
    prepTime: 5,
    difficulty: 'easy',
    orderable: true,
    options: [
      { id: 'add-6-gildas', name: 'Add 6 More Pieces', priceModifier: 10, category: 'extra', allowMultiple: true, maxQuantity: 5 }
    ]
  },
  {
    id: 'sourdough-bread',
    name: 'Artisan Sourdough',
    description: 'House-made sourdough with sea salt and olive oil',
    ingredients: ['organic flour', 'sourdough starter', 'sea salt', 'water', 'extra virgin olive oil'],
    tags: ['vg', 'df'],
    price: 9,
    sortPriority: 67,
    image: '/images/menu/plated/sourdough.png',
    nutrition: { calories: 360, protein: 12, carbs: 72, fat: 5, fiber: 3, servingSize: '4 slices (150g)' },
    allergens: ['gluten'],
    prepTime: 24, // includes rising time
    difficulty: 'challenging',
    orderable: true,
    options: [
      { id: 'whole-loaf', name: 'Purchase Whole Loaf', priceModifier: 10, category: 'portion' }
    ]
  },
  {
    id: 'shepherds-pie',
    name: "Old-Fashioned Irish Shepherd's Pie",
    description: 'Classic lamb, beef, and vegetable stew topped with creamy mashed potatoes',
    ingredients: ['ground lamb', 'ground beef', 'carrots', 'peas', 'onions', 'potatoes', 'butter', 'milk', 'thyme', 'rosemary', 'olive oil', 'salt', 'black pepper'],
    tags: [],
    price: 26,
    sortPriority: 27,
    image: '/images/menu/plated/shepardspie.png',
    nutrition: { calories: 720, protein: 44, carbs: 55, fat: 38, fiber: 8, servingSize: '1 portion (550g)' },
    allergens: ['dairy'],
    prepTime: 90,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'add-house-salad', name: 'Add House Salad', priceModifier: 6, category: 'side' },
      { id: 'add-grilled-zucchini', name: 'Add Grilled Zucchini', priceModifier: 8, category: 'side' }
    ]
  },
  {
    id: 'seared-duck-breast',
    name: 'Seared Duck Breast',
    description: 'Pan-seared duck breast with port wine reduction, silky carrots, and arugula salad with vinaigrette',
    ingredients: ['duck breast', 'port wine', 'shallots', 'butter', 'carrots', 'thyme', 'honey', 'arugula', 'olive oil', 'balsamic vinegar', 'salt', 'black pepper'],
    tags: ['gf'],
    price: 32,
    sortPriority: 14,
    image: '/images/menu/plated/searedduckbreast.png',
    nutrition: { calories: 620, protein: 46, carbs: 26, fat: 38, fiber: 5, servingSize: '1 plate (500g)' },
    allergens: [],
    prepTime: 45,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'extra-duck-breast', name: 'Extra Duck Breast (+200g)', priceModifier: 16, category: 'protein', allowMultiple: true, maxQuantity: 3 },
      { id: 'add-mashed-potatoes', name: 'Add Mashed Potatoes', priceModifier: 8, category: 'side' },
      { id: 'add-smashed-potatoes', name: 'Add Smashed Garlic and Rosemary Potatoes', priceModifier: 8, category: 'side' }
    ]
  },
  {
    id: 'rice-pudding-cherries',
    name: 'Rice Pudding with Candied Cherries',
    description: 'Creamy vanilla rice pudding topped with candied cherries and cinnamon',
    ingredients: ['arborio rice', 'whole milk', 'heavy cream', 'vanilla bean', 'sugar', 'candied cherries', 'cinnamon'],
    tags: ['v', 'gf'],
    price: 11,
    sortPriority: 74,
    image: '/images/menu/plated/ricepuddingwcandiedcherries-2.png',
    nutrition: { calories: 473, protein: 9, carbs: 68, fat: 15, fiber: 2, servingSize: '1 bowl (300g)' },
    allergens: ['dairy'],
    prepTime: 60,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'padron-peppers',
    name: 'Padrón Peppers',
    description: 'Blistered Spanish peppers with sea salt and olive oil',
    ingredients: ['Padrón peppers', 'extra virgin olive oil', 'coarse sea salt'],
    tags: ['vg', 'gf', 'df'],
    price: 11,
    sortPriority: 65,
    image: '/images/menu/plated/padronepeppers.png',
    nutrition: { calories: 128, protein: 3, carbs: 8, fat: 11, fiber: 3, servingSize: '1 portion (180g)' },
    allergens: [],
    prepTime: 10,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'miso-glazed-cod',
    name: 'Miso Glazed Black Cod',
    description: 'Nobu-inspired miso glazed black cod (250-300g) with caramelized eggplant, candied carrots, and jasmine rice',
    ingredients: ['black cod', 'white miso', 'mirin', 'sake', 'sugar', 'caramelized eggplant', 'candied carrots', 'jasmine rice', 'ginger', 'scallions', 'sesame oil', 'butter', 'salt'],
    tags: ['gf'],
    price: 48,
    sortPriority: 5,
    image: '/images/menu/plated/misoglazedcod.png',
    nutrition: { calories: 750, protein: 40, carbs: 65, fat: 37, fiber: 6, servingSize: '1 plate (650g)' },
    allergens: ['fish', 'soy'],
    prepTime: 30,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'extra-black-cod', name: 'Extra Black Cod (250-300g)', priceModifier: 25, category: 'protein' }
    ]
  },
  {
    id: 'sesame-crusted-tuna-tataki',
    name: 'Sesame Crusted Tuna Tataki',
    description: 'Seared ahi tuna with pistachio, sesame, and macadamia crust, served with cilantro lime aioli, brown rice, smashed cucumber salad, and edamame garnished with green onions',
    ingredients: ['ahi tuna', 'pistachios', 'sesame seeds', 'macadamia nuts', 'cilantro', 'lime', 'aioli', 'brown rice', 'cucumber', 'rice vinegar', 'edamame', 'green onions', 'soy sauce', 'sesame oil', 'garlic', 'ginger', 'salt'],
    tags: ['gf', 'df'],
    price: 38,
    sortPriority: 6,
    image: '/images/menu/plated/sesamecrustedtunataki.png',
    nutrition: { calories: 780, protein: 58, carbs: 52, fat: 38, fiber: 8, servingSize: '1 plate (550g)' },
    allergens: ['fish', 'tree nuts', 'sesame', 'soy', 'eggs'],
    prepTime: 25,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'extra-tuna', name: 'Extra Tuna (200g)', priceModifier: 14, category: 'protein' },
      { id: 'sub-white-rice', name: 'Sub Brown Rice for White Rice', priceModifier: 0, category: 'side' },
      { id: 'sub-cauliflower-rice', name: 'Sub Brown Rice for Cauliflower Rice', priceModifier: 2, category: 'side' },
      { id: 'extra-aioli', name: 'Extra Cilantro Lime Aioli', priceModifier: 2, category: 'add-on' },
      { id: 'add-avocado', name: 'Add Avocado', priceModifier: 4, category: 'add-on' }
    ]
  },
  {
    id: 'grilled-cheese-tomato-soup',
    name: 'Grilled Cheese & Tomato Soup',
    description: 'Classic comfort combo with aged cheddar, Gruyère, and jack cheese on sourdough with creamy tomato bisque soup',
    ingredients: ['sourdough bread', 'aged cheddar', 'Gruyère', 'jack cheese', 'butter', 'tomatoes', 'cream', 'basil', 'garlic', 'onion'],
    tags: ['v'],
    price: 21,
    sortPriority: 44,
    image: '/images/menu/plated/grilledcheesew-tomatosoup.png',
    nutrition: { calories: 728, protein: 27, carbs: 63, fat: 42, fiber: 6, servingSize: '1 combo (600g)' },
    allergens: ['dairy', 'gluten'],
    prepTime: 25,
    difficulty: 'easy',
    orderable: true,
    options: [
      ...vegetarianCustomizations.filter(opt => opt.id !== 'add-sweet-potatoes' && opt.id !== 'add-artichoke-hearts'),
      { id: 'add-garden-salad', name: 'Add Garden Salad', priceModifier: 6, category: 'side' }
    ]
  },
  {
    id: 'golden-sweet-potato-gnocchi',
    name: 'Golden Sweet Potato Gnocchi',
    description: 'House-made sweet potato gnocchi with sage brown butter and toasted hazelnuts',
    ingredients: ['sweet potatoes', 'flour', 'egg', 'sage', 'butter', 'hazelnuts', 'parmesan', 'nutmeg', 'olive oil', 'salt', 'black pepper'],
    tags: ['v'],
    price: 28,
    sortPriority: 28,
    image: '/images/menu/plated/goldensweetpotatognocchi.png',
    nutrition: { calories: 680, protein: 16, carbs: 80, fat: 32, fiber: 8, servingSize: '1 plate (475g)' },
    allergens: ['gluten', 'dairy', 'eggs', 'tree nuts'],
    prepTime: 90,
    difficulty: 'challenging',
    orderable: true,
    options: [
      ...vegetarianCustomizations.filter(opt =>
        opt.id !== 'add-steak' &&
        opt.id !== 'add-tofu' &&
        opt.id !== 'add-sweet-potatoes' &&
        opt.id !== 'add-artichoke-hearts' &&
        opt.id !== 'add-avocado'
      ),
      { id: 'double-portion', name: 'Make It Double Portion', priceModifier: 16, category: 'portion' }
    ]
  },
  {
    id: 'garlic-noodles',
    name: 'Crispy Shrimp & Fried Garlic Noodles',
    description: 'Asian-style fried garlic noodles with crispy shrimp, hoisin glaze, and scallions',
    ingredients: ['fresh noodles', 'shrimp', 'fried garlic', 'garlic', 'hoisin sauce', 'soy sauce', 'sesame oil', 'scallions', 'cilantro', 'vegetable oil', 'salt', 'white pepper'],
    tags: ['df'],
    price: 24,
    sortPriority: 3,
    image: '/images/menu/plated/garlicnoodles.png',
    nutrition: { calories: 650, protein: 32, carbs: 82, fat: 22, fiber: 5, servingSize: '1 bowl (480g)' },
    allergens: ['gluten', 'soy', 'shellfish'],
    prepTime: 20,
    difficulty: 'easy',
    orderable: true,
    options: [
      { id: 'double-shrimp', name: 'Double Shrimp (+200g)', priceModifier: 14, category: 'protein' },
      { id: 'extra-fried-egg', name: 'Extra Fried Egg', priceModifier: 3, category: 'add-on' },
      { id: 'no-spicy', name: 'No Spicy', priceModifier: 0, category: 'dietary' }
    ]
  },
  {
    id: 'duck-confit',
    name: 'Duck Confit',
    description: '48-hour duck confit leg with roasted veggies and French lentil salad',
    ingredients: ['duck leg', 'duck fat', 'garlic', 'thyme', 'roasted vegetables', 'French lentils', 'mixed herbs', 'lemon', 'olive oil', 'shallots', 'Dijon mustard', 'salt', 'black pepper'],
    tags: ['gf', 'df'],
    price: 34,
    sortPriority: 13,
    image: '/images/menu/plated/duckconfit.png',
    nutrition: { calories: 850, protein: 50, carbs: 42, fat: 54, fiber: 8, servingSize: '1 plate (600g)' },
    allergens: [],
    prepTime: 180, // slow cooking
    difficulty: 'challenging',
    orderable: true,
    options: [
      { id: 'extra-duck-leg', name: 'Extra Duck Confit Leg (+200g)', priceModifier: 16, category: 'protein', allowMultiple: true, maxQuantity: 5 },
      { id: 'add-mashed-potatoes', name: 'Add Mashed Potatoes', priceModifier: 9, category: 'side' },
      { id: 'add-smashed-potatoes', name: 'Add Garlic Rosemary Smashed Potatoes', priceModifier: 7, category: 'side' }
    ]
  },
  {
    id: 'crispy-persian-rice',
    name: 'Crispy Persian Rice with Heirloom Beef',
    description: 'Traditional crispy golden tahdig made with heirloom saffron and grass-fed beef',
    ingredients: ['basmati rice', 'grass-fed beef', 'heirloom saffron', 'butter', 'yogurt', 'olive oil', 'turmeric', 'cinnamon', 'salt', 'black pepper'],
    tags: ['gf'],
    price: 36,
    sortPriority: 12,
    image: '/images/menu/plated/crispypersianrice.png',
    nutrition: { calories: 680, protein: 38, carbs: 68, fat: 28, fiber: 3, servingSize: '1 portion (450g)' },
    allergens: ['dairy'],
    prepTime: 45,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'beet-hummus-pita', name: 'Beet Hummus Side w/ Pita', priceModifier: 7, category: 'side' },
      { id: 'garlic-hummus-pita', name: 'Garlic Hummus Side w/ Pita', priceModifier: 7, category: 'side' },
      { id: 'lemony-hummus-pita', name: 'Lemony Hummus Side w/ Pita', priceModifier: 7, category: 'side' },
      { id: 'add-chili-crunch', name: 'Chili Crunch', priceModifier: 3, category: 'add-on' },
      { id: 'add-chili-crunch-jar', name: 'Chili Crunch Jar', priceModifier: 16, category: 'add-on' }
    ]
  },
  {
    id: 'caprese-sandwich',
    name: 'Caprese Sandwich',
    description: 'Crispy panini with mozzarella, sun-dried tomatoes, and pesto with lemony pesto sauce on the side',
    ingredients: ['ciabatta bread', 'mozzarella', 'sun-dried tomatoes', 'pesto', 'lemony pesto sauce', 'olive oil'],
    tags: ['v'],
    price: 22,
    sortPriority: 39,
    image: '/images/menu/plated/crazycaprese.png',
    nutrition: { calories: 720, protein: 32, carbs: 58, fat: 42, fiber: 4, servingSize: '1 sandwich (350g)' },
    allergens: ['dairy'],
    prepTime: 15,
    difficulty: 'easy',
    orderable: true,
    options: [...vegetarianCustomizations]
  },
  {
    id: 'crab-cakes',
    name: 'Crab Cakes',
    description: 'Dungeness crab cakes with asparagus, corn salad, and zesty lemon tartar sauce',
    ingredients: ['Dungeness crab', 'panko breadcrumbs', 'mayonnaise', 'Dijon mustard', 'asparagus', 'corn', 'lemon', 'tartar sauce', 'butter', 'olive oil', 'egg', 'Old Bay seasoning', 'salt', 'black pepper'],
    tags: [],
    price: 34,
    sortPriority: 51,
    image: '/images/menu/plated/crabcakes.png',
    nutrition: { calories: 620, protein: 44, carbs: 32, fat: 38, fiber: 5, servingSize: '3 cakes (450g)' },
    allergens: ['shellfish', 'eggs'],
    prepTime: 30,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'chocolate-chip-cookies',
    name: 'Chocolate Chip Cookies',
    description: 'Classic brown butter chocolate chip cookies with sea salt',
    ingredients: ['flour', 'brown butter', 'brown sugar', 'eggs', 'dark chocolate chips', 'vanilla', 'sea salt'],
    tags: ['v'],
    price: 10,
    sortPriority: 75,
    image: '/images/menu/plated/chocolatechipcookies.png',
    nutrition: { calories: 400, protein: 5, carbs: 52, fat: 20, fiber: 2, servingSize: '3 cookies (90g)' },
    allergens: ['gluten', 'dairy', 'eggs'],
    prepTime: 25,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'chicken-piccata',
    name: 'Chicken Piccata',
    description: 'Pan-seared chicken piccata with a lemon-white wine butter sauce, fried capers, and a blistered kalamata and cherry tomato sauce over linguini',
    ingredients: ['chicken breast', 'flour', 'white wine', 'lemon', 'butter', 'fried capers', 'kalamata olives', 'cherry tomatoes', 'linguini', 'parsley', 'olive oil', 'garlic', 'salt', 'black pepper'],
    tags: [],
    price: 30,
    sortPriority: 23,
    image: '/images/menu/plated/chickenpicatta.png',
    nutrition: { calories: 750, protein: 55, carbs: 58, fat: 34, fiber: 4, servingSize: '1 plate (550g)' },
    allergens: ['gluten', 'dairy'],
    prepTime: 30,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'chicken-paella',
    name: 'Chicken and Chorizo Paella',
    description: 'Traditional Spanish paella with saffron rice, chicken, and vegetables',
    ingredients: ['bomba rice', 'chicken thighs', 'chorizo', 'saffron', 'green beans', 'lima beans', 'red pepper', 'garlic', 'olive oil', 'chicken broth', 'smoked paprika', 'salt', 'black pepper'],
    tags: ['gf', 'df'],
    price: 34,
    sortPriority: 22,
    image: '/images/menu/plated/chickenpaella.png',
    nutrition: { calories: 720, protein: 48, carbs: 62, fat: 32, fiber: 6, servingSize: '1 portion (625g)' },
    allergens: [],
    prepTime: 45,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'chicken-caesar-wrap',
    name: 'Chicken Caesar Wrap',
    description: 'Grilled chicken caesar salad with fried capers wrapped in a spinach tortilla with beet hummus, garlic hummus, and vegetable crudités',
    ingredients: ['grilled chicken', 'romaine lettuce', 'parmesan', 'Caesar dressing', 'fried capers', 'spinach tortilla', 'beet hummus', 'garlic hummus', 'vegetable crudités', 'olive oil', 'lemon juice', 'salt', 'black pepper'],
    tags: [],
    price: 18,
    sortPriority: 45,
    image: '/images/menu/plated/chickencaesarwrap.png',
    nutrition: { calories: 780, protein: 50, carbs: 56, fat: 42, fiber: 7, servingSize: '1 wrap (475g)' },
    allergens: ['gluten', 'dairy', 'eggs'],
    prepTime: 15,
    difficulty: 'easy',
    orderable: true,
    options: [
      { id: 'remove-chicken', name: 'Remove Grilled Chicken', priceModifier: 0, category: 'dietary' }
    ]
  },
  {
    id: 'butternut-squash-soup',
    name: 'Butternut Squash Soup',
    description: 'Roasted butternut squash soup with coconut cream and spices',
    ingredients: ['butternut squash', 'coconut cream', 'onion', 'ginger', 'nutmeg', 'sage', 'vegetable broth'],
    tags: ['vg', 'gf', 'df'],
    price: 17,
    sortPriority: 43,
    image: '/images/menu/plated/butternutsquashsoup.png',
    nutrition: { calories: 300, protein: 6, carbs: 42, fat: 14, fiber: 8, servingSize: '1 bowl (450ml)' },
    allergens: [],
    prepTime: 45,
    difficulty: 'easy',
    orderable: true,
    options: [
      ...vegetarianCustomizations.filter(opt =>
        opt.id !== 'add-steak' &&
        opt.id !== 'add-tofu' &&
        opt.id !== 'add-sweet-potatoes' &&
        opt.id !== 'add-artichoke-hearts' &&
        opt.id !== 'add-avocado'
      ),
      { id: 'add-garden-salad', name: 'Add Garden Salad', priceModifier: 6, category: 'side' },
      { id: 'add-half-grilled-cheese', name: 'Add Half Grilled Cheese', priceModifier: 10, category: 'side' }
    ]
  },
  {
    id: 'bulgur-salad',
    name: 'Bulgur Salad',
    description: 'Mediterranean bulgur salad with herbs, vegetables, and lemon dressing',
    ingredients: ['bulgur wheat', 'tomatoes', 'cucumber', 'parsley', 'mint', 'lemon juice', 'olive oil', 'onion'],
    tags: ['vg', 'df'],
    price: 17,
    sortPriority: 38,
    image: '/images/menu/plated/bulgursalad.png',
    nutrition: { calories: 368, protein: 12, carbs: 63, fat: 12, fiber: 15, servingSize: '1 bowl (375g)' },
    allergens: ['gluten'],
    prepTime: 20,
    difficulty: 'easy',
    orderable: true,
    options: [...vegetarianCustomizations]
  },
  {
    id: 'bulgogi-bowl',
    name: 'Bulgogi Bowl',
    description: 'Korean marinated beef with steamed rice, pickled vegetables, and gochujang',
    ingredients: ['grass-fed beef', 'gochujang', 'sesame oil', 'garlic', 'soy sauce', 'steamed rice', 'pickled vegetables', 'sesame seeds'],
    tags: ['df'],
    price: 28,
    sortPriority: 1,
    image: '/images/menu/plated/bulgulgibowls.png',
    nutrition: { calories: 728, protein: 53, carbs: 72, fat: 27, fiber: 6, servingSize: '1 bowl (525g)' },
    allergens: ['soy', 'sesame'],
    prepTime: 25,
    difficulty: 'easy',
    orderable: true,
    options: [
      { id: 'double-meat', name: 'Double Meat (+200g)', priceModifier: 12, category: 'protein' },
      { id: 'add-soy-egg', name: 'Add Soy Marinated Egg', priceModifier: 3, category: 'add-on' },
      { id: 'extra-kimchi', name: 'Extra Kimchi', priceModifier: 3, category: 'add-on' },
      { id: 'add-chili-crunch', name: 'Chili Crunch', priceModifier: 3, category: 'add-on' },
      { id: 'add-chili-crunch-jar', name: 'Chili Crunch Jar', priceModifier: 16, category: 'add-on' }
    ]
  },
  {
    id: 'beet-salad',
    name: 'Roasted Beet Salad',
    description: 'Roasted beets with goat cheese, walnuts, and arugula',
    ingredients: ['golden beets', 'red beets', 'goat cheese', 'walnuts', 'arugula', 'balsamic vinaigrette'],
    tags: ['v', 'gf'],
    price: 19,
    sortPriority: 37,
    image: '/images/menu/plated/beetsalad.png',
    nutrition: { calories: 480, protein: 15, carbs: 33, fat: 33, fiber: 8, servingSize: '1 bowl (375g)' },
    allergens: ['dairy', 'tree nuts'],
    prepTime: 60, // roasting time
    difficulty: 'easy',
    orderable: true,
    options: [...vegetarianCustomizations]
  },
  {
    id: 'basque-cheesecake',
    name: 'Basque Burnt Cheesecake',
    description: 'Burnt Basque Cheesecake with caramelized top',
    ingredients: ['cream cheese', 'heavy cream', 'eggs', 'sugar', 'vanilla bean', 'sea salt'],
    tags: ['v', 'gf'],
    price: 14,
    sortPriority: 71,
    image: '/images/menu/plated/basquecheesecake.png',
    nutrition: { calories: 510, protein: 9, carbs: 39, fat: 36, fiber: 0, servingSize: '1 slice (180g)' },
    allergens: ['dairy', 'eggs'],
    prepTime: 75,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'arugula-artichoke-salad',
    name: 'Arugula Artichoke Salad',
    description: 'Peppery arugula with marinated artichoke hearts and lemon dressing',
    ingredients: ['arugula', 'artichoke hearts', 'lemon', 'olive oil', 'sunflower seeds', 'pecorino', 'sweet onion'],
    tags: ['v', 'gf'],
    price: 18,
    sortPriority: 33,
    image: '/images/menu/plated/arugulasaladw-artichoke.png',
    nutrition: { calories: 278, protein: 12, carbs: 18, fat: 21, fiber: 9, servingSize: '1 bowl (300g)' },
    allergens: ['dairy'],
    prepTime: 15,
    difficulty: 'easy',
    orderable: true,
    options: [
      ...vegetarianCustomizations,
      { id: 'add-salmon', name: 'Add Line Caught Salmon (+200g)', priceModifier: 15, category: 'protein' },
      { id: 'add-poached-eggs', name: 'Add 2 Poached Eggs', priceModifier: 7, category: 'protein' }
    ]
  },
  {
    id: 'albondigas',
    name: 'Albóndigas',
    description: 'Spanish meatballs made from grass fed beef and local ground pork in rich saffron almond cream sauce and crispy fingerling potatoes',
    ingredients: ['ground beef', 'ground pork', 'onion', 'garlic', 'saffron', 'almonds', 'cream', 'fingerling potatoes', 'herbs', 'olive oil', 'butter', 'breadcrumbs', 'egg', 'salt', 'black pepper'],
    tags: [],
    price: 26,
    sortPriority: 26,
    image: '/images/menu/plated/albondigas.png',
    nutrition: { calories: 680, protein: 50, carbs: 28, fat: 42, fiber: 5, servingSize: '8 meatballs (480g)' },
    allergens: ['dairy'],
    prepTime: 45,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'sub-veal', name: 'Sub Veal for Ground Pork', priceModifier: 5, category: 'protein' },
      { id: 'sub-mashed-potatoes', name: 'Sub Fingerling Potatoes for Mashed Potatoes', priceModifier: 2, category: 'side' },
      { id: 'sub-roasted-potatoes', name: 'Sub Fingerling Potatoes for Roasted Rosemary Garlic Potatoes', priceModifier: 2, category: 'side' },
      { id: 'sub-polenta', name: 'Sub Fingerling Potatoes for Creamy Polenta', priceModifier: 2, category: 'side' },
      { id: 'add-zucchini-carpaccio', name: 'Add Zucchini Carpaccio Side', priceModifier: 9, category: 'side' },
      { id: 'add-roasted-veggies', name: 'Add Mixed Roasted Veggies', priceModifier: 8, category: 'side' },
      { id: 'add-garden-salad', name: 'Add Garden Salad', priceModifier: 9, category: 'side' }
    ]
  },
  // Week of Jan 26 items
  {
    id: 'arroz-con-pollo',
    name: 'Arroz con Pollo',
    description: 'Classic Cuban chicken and saffron rice with bell peppers and olives',
    ingredients: ['chicken thighs', 'bomba rice', 'saffron', 'bell peppers', 'olives', 'sofrito', 'chicken broth'],
    tags: ['gf', 'df'],
    price: 28,
    sortPriority: 24,
    image: '/images/menu/plated/arrozconpollo.png',
    nutrition: { calories: 620, protein: 45, carbs: 58, fat: 22, fiber: 4, servingSize: '1 plate (550g)' },
    allergens: [],
    prepTime: 50,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'double-chicken', name: 'Double Chicken (+200g)', priceModifier: 10, category: 'protein' }
    ]
  },
  {
    id: 'beef-cheek-quesadilla',
    name: 'Beef Cheek Quesadilla',
    description: 'Slow-braised beef cheeks with melted jack cheese, Oaxacan cheese, and aged cheddar, with fresh guacamole and pico de gallo on side',
    ingredients: ['beef cheeks', 'flour tortilla', 'jack cheese', 'Oaxacan cheese', 'aged cheddar', 'guacamole', 'pico de gallo', 'cilantro', 'butter', 'sour cream', 'lime', 'salt', 'black pepper'],
    tags: [],
    price: 24,
    sortPriority: 48,
    image: '/images/menu/plated/beefcheekquesadilla.png',
    nutrition: { calories: 780, protein: 46, carbs: 48, fat: 48, fiber: 7, servingSize: '1 quesadilla (450g)' },
    allergens: ['gluten', 'dairy'],
    prepTime: 25,
    difficulty: 'easy',
    orderable: true,
    options: [
      { id: 'double-meat', name: 'Double Meat (+200g)', priceModifier: 10, category: 'protein' },
      { id: 'side-guac', name: 'Side of Guac', priceModifier: 4, category: 'side' },
      { id: 'pint-guac', name: 'Pint of Guac', priceModifier: 15, category: 'side' },
      { id: 'extra-salsa', name: 'Extra Salsa', priceModifier: 1, category: 'add-on' }
    ]
  },
  {
    id: 'braised-beef-cheeks',
    name: 'Braised Beef Cheeks',
    description: 'Fall-apart tender beef cheeks with parsnip purée and charred scallion gremolata',
    ingredients: ['beef cheeks', 'red wine', 'parsnips', 'scallions', 'herbs', 'garlic', 'butter', 'olive oil', 'beef stock', 'heavy cream', 'salt', 'black pepper'],
    tags: ['gf'],
    price: 38,
    sortPriority: 18,
    image: '/images/menu/plated/beefcheeks.png',
    nutrition: { calories: 820, protein: 60, carbs: 36, fat: 50, fiber: 7, servingSize: '1 plate (525g)' },
    allergens: ['dairy'],
    prepTime: 180,
    difficulty: 'challenging',
    orderable: true,
    options: [
      { id: 'double-meat', name: 'Double Meat (+200g)', priceModifier: 16, category: 'protein' },
      { id: 'add-garden-salad', name: 'Side Garden Salad', priceModifier: 8, category: 'side' },
      { id: 'add-roasted-veggies', name: 'Roasted Veggies', priceModifier: 9, category: 'side' }
    ]
  },
  {
    id: 'blackened-fish-tacos',
    name: 'Blackened Fish Tacos',
    description: 'Cajun-spiced white fish with cabbage slaw, chipotle crema, and fresh lime',
    ingredients: ['white fish', 'cajun spices', 'cabbage', 'chipotle crema', 'lime', 'corn tortillas', 'cilantro', 'vegetable oil', 'butter', 'garlic', 'salt', 'black pepper'],
    tags: ['gf'],
    price: 26,
    sortPriority: 52,
    image: '/images/menu/plated/Blackenedfishtacos.png',
    nutrition: { calories: 580, protein: 42, carbs: 46, fat: 26, fiber: 7, servingSize: '3 tacos (420g)' },
    allergens: ['fish', 'dairy'],
    prepTime: 25,
    difficulty: 'easy',
    orderable: true,
    options: [
      { id: 'double-fish', name: 'Double Fish (+200g)', priceModifier: 10, category: 'protein' },
      { id: 'extra-tortillas', name: '3 Extra Tortillas', priceModifier: 3, category: 'add-on' },
      { id: 'side-guac', name: 'Side of Guac', priceModifier: 4, category: 'side' },
      { id: 'pint-guac', name: 'Pint of Guac', priceModifier: 15, category: 'side' },
      { id: 'extra-salsa', name: 'Extra Salsa', priceModifier: 1, category: 'add-on' },
      { id: 'extra-chipotle-crema', name: 'Extra Chipotle Crema', priceModifier: 2, category: 'add-on' },
      { id: 'no-spicy', name: 'No Spicy', priceModifier: 0, category: 'dietary' }
    ]
  },
  {
    id: 'blueberry-muffins',
    name: 'Blueberry Muffins',
    description: 'Freshly baked muffins bursting with organic blueberries and topped with blueberry crumble',
    ingredients: ['flour', 'organic blueberries', 'butter', 'sugar', 'eggs', 'vanilla', 'blueberry crumble'],
    tags: ['v'],
    price: 9,
    sortPriority: 77,
    image: '/images/menu/plated/blueberrymuffins.png',
    nutrition: { calories: 320, protein: 5, carbs: 48, fat: 12, fiber: 2, servingSize: '2 muffins (180g)' },
    allergens: ['gluten', 'dairy', 'eggs'],
    prepTime: 35,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'burrata-salad',
    name: 'Burrata Salad',
    description: 'Creamy burrata with heirloom tomatoes, fresh basil, and aged balsamic',
    ingredients: ['burrata cheese', 'heirloom tomatoes', 'fresh basil', 'balsamic reduction', 'olive oil', 'flaky salt'],
    tags: ['v', 'gf'],
    price: 24,
    sortPriority: 34,
    image: '/images/menu/plated/burratasalad.png',
    nutrition: { calories: 420, protein: 18, carbs: 14, fat: 34, fiber: 3, servingSize: '1 plate (350g)' },
    allergens: ['dairy'],
    prepTime: 10,
    difficulty: 'easy',
    orderable: true,
    options: [
      ...vegetarianCustomizations,
      { id: 'add-salmon', name: 'Add Line Caught Salmon (+200g)', priceModifier: 12, category: 'protein' }
    ]
  },
  {
    id: 'charred-carrots',
    name: 'Charred Carrots',
    description: 'Fire-roasted rainbow carrots with yogurt tahini sauce and fresh herbs',
    ingredients: ['rainbow carrots', 'Greek yogurt', 'tahini', 'fresh herbs', 'olive oil', 'za\'atar'],
    tags: ['v', 'gf'],
    price: 15,
    sortPriority: 62,
    image: '/images/menu/plated/charredcarrots.png',
    nutrition: { calories: 280, protein: 8, carbs: 28, fat: 16, fiber: 8, servingSize: '1 plate (300g)' },
    allergens: ['dairy', 'sesame'],
    prepTime: 25,
    difficulty: 'easy',
    orderable: true,
    options: [
      ...vegetarianCustomizations,
      { id: 'add-quinoa', name: 'Add Quinoa', priceModifier: 4, category: 'side' }
    ]
  },
  {
    id: 'churros',
    name: 'Churros',
    description: 'Crispy golden churros dusted with cinnamon sugar, served with chocolate sauce',
    ingredients: ['flour', 'butter', 'eggs', 'cinnamon', 'sugar', 'dark chocolate', 'cream'],
    tags: ['v'],
    price: 12,
    sortPriority: 76,
    image: '/images/menu/plated/churros.png',
    nutrition: { calories: 420, protein: 6, carbs: 52, fat: 22, fiber: 2, servingSize: '4 churros (200g)' },
    allergens: ['gluten', 'dairy', 'eggs'],
    prepTime: 30,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'crab-rangoons',
    name: 'Crab Rangoons',
    description: 'Crispy wontons filled with Dungeness crab and cream cheese, with sweet chili sauce',
    ingredients: ['Dungeness crab', 'cream cheese', 'wonton wrappers', 'scallions', 'sweet chili sauce'],
    tags: [],
    price: 18,
    sortPriority: 53,
    image: '/images/menu/plated/crabrangoons.png',
    nutrition: { calories: 380, protein: 18, carbs: 32, fat: 20, fiber: 1, servingSize: '6 pieces (210g)' },
    allergens: ['shellfish', 'dairy', 'gluten'],
    prepTime: 25,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'add-chili-crunch', name: 'Chili Crunch', priceModifier: 3, category: 'add-on' },
      { id: 'add-chili-crunch-jar', name: 'Chili Crunch Jar', priceModifier: 16, category: 'add-on' }
    ]
  },
  {
    id: 'crispy-taiwanese-pork-chop',
    name: 'Crispy Taiwanese Pork Chop',
    description: 'Golden fried pork chop with five-spice, served with pickled vegetables and rice',
    ingredients: ['pork chop', 'five-spice powder', 'soy sauce', 'jasmine rice', 'pickled vegetables', 'fried shallots', 'vegetable oil', 'cornstarch', 'egg', 'garlic', 'salt', 'white pepper'],
    tags: ['df'],
    price: 26,
    sortPriority: 4,
    image: '/images/menu/plated/crispytaiwaneseporkchop.png',
    nutrition: { calories: 750, protein: 46, carbs: 60, fat: 36, fiber: 4, servingSize: '1 plate (500g)' },
    allergens: ['gluten', 'soy'],
    prepTime: 30,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'double-pork-chop', name: 'Double Pork Chop (+200g)', priceModifier: 16, category: 'protein' },
      { id: 'extra-fried-egg', name: 'Extra Fried Egg', priceModifier: 3, category: 'add-on' },
      { id: 'extra-jasmine-rice', name: 'Extra Jasmine Rice', priceModifier: 3, category: 'side' },
      { id: 'add-chili-crunch', name: 'Chili Crunch', priceModifier: 3, category: 'add-on' },
      { id: 'add-chili-crunch-jar', name: 'Chili Crunch Jar', priceModifier: 16, category: 'add-on' },
      { id: 'no-spicy', name: 'No Spicy', priceModifier: 0, category: 'dietary' }
    ]
  },
  {
    id: 'egg-salad-sandwich',
    name: 'Egg Salad Sandwich',
    description: 'Classic creamy egg salad on artisan sourdough with fresh herbs and microgreens',
    ingredients: ['eggs', 'mayonnaise', 'Dijon mustard', 'chives', 'sourdough bread', 'microgreens'],
    tags: ['v'],
    price: 17,
    sortPriority: 46,
    image: '/images/menu/plated/eggsaladsandwich.png',
    nutrition: { calories: 520, protein: 22, carbs: 42, fat: 30, fiber: 3, servingSize: '1 sandwich (350g)' },
    allergens: ['eggs', 'gluten'],
    prepTime: 15,
    difficulty: 'easy',
    orderable: true,
    options: [
      ...vegetarianCustomizations,
      { id: 'add-salmon', name: 'Add Line Caught Salmon (+200g)', priceModifier: 14, category: 'protein' }
    ]
  },
  {
    id: 'italian-wedding-soup',
    name: 'Italian Wedding Soup',
    description: 'Classic Italian soup with mini meatballs, escarole, and orzo in rich chicken broth',
    ingredients: ['mini meatballs', 'escarole', 'orzo', 'chicken broth', 'parmesan', 'carrots', 'celery'],
    tags: [],
    price: 19,
    sortPriority: 42,
    image: '/images/menu/plated/italianweddingsoup.png',
    nutrition: { calories: 380, protein: 24, carbs: 32, fat: 18, fiber: 4, servingSize: '1 bowl (450ml)' },
    allergens: ['gluten', 'dairy'],
    prepTime: 45,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'add-chili-crunch', name: 'Chili Crunch', priceModifier: 3, category: 'add-on' },
      { id: 'add-chili-crunch-jar', name: 'Chili Crunch Jar', priceModifier: 16, category: 'add-on' }
    ]
  },
  {
    id: 'lamb-carnitas-enchiladas',
    name: 'Lamb Carnitas Enchiladas',
    description: 'Slow-cooked lamb carnitas wrapped in corn tortillas with salsa verde, queso fresco, and jack cheese',
    ingredients: ['lamb shoulder', 'corn tortillas', 'salsa verde', 'queso fresco', 'jack cheese', 'onion', 'cilantro', 'crema', 'lard', 'cumin', 'oregano', 'garlic', 'salt', 'black pepper'],
    tags: ['gf'],
    price: 30,
    sortPriority: 21,
    image: '/images/menu/plated/Lambcarnitasenchiladas.png',
    nutrition: { calories: 780, protein: 52, carbs: 46, fat: 44, fiber: 7, servingSize: '3 enchiladas (520g)' },
    allergens: ['dairy'],
    prepTime: 180,
    difficulty: 'challenging',
    orderable: true,
    options: [
      { id: 'sub-pork-carnitas', name: 'Sub for Pork Carnitas', priceModifier: 2, category: 'protein' },
      { id: 'extra-enchilada', name: 'Extra Enchilada', priceModifier: 7, category: 'add-on', allowMultiple: true, maxQuantity: 5 },
      { id: 'add-rice-beans', name: 'Add Rice and Black Beans', priceModifier: 8, category: 'side' },
      { id: 'add-sweet-plantains', name: 'Add Sweet Plantains', priceModifier: 6, category: 'side' },
      { id: 'double-cheese', name: 'Double Cheese', priceModifier: 6, category: 'add-on' },
      { id: 'add-habanero-sauce', name: 'Habanero Sauce', priceModifier: 3, category: 'add-on' },
      { id: 'habanero-sauce-bottle', name: 'Habanero Sauce Bottle', priceModifier: 20, category: 'add-on' },
      { id: 'extra-salsa-verde', name: 'Extra Salsa Verde', priceModifier: 3, category: 'add-on' },
      { id: 'extra-cilantro', name: 'Extra Cilantro', priceModifier: 0, category: 'add-on' },
      { id: 'no-spicy', name: 'No Spicy', priceModifier: 0, category: 'dietary' }
    ]
  },
  {
    id: 'panzanella-salad',
    name: 'Panzanella Salad',
    description: 'Tuscan bread salad with heirloom tomatoes, cucumber, red onion, and basil vinaigrette',
    ingredients: ['ciabatta bread', 'heirloom tomatoes', 'cucumber', 'red onion', 'basil', 'red wine vinegar', 'olive oil'],
    tags: ['vg', 'df'],
    price: 20,
    sortPriority: 36,
    image: '/images/menu/plated/panzanellasalad.png',
    nutrition: { calories: 340, protein: 8, carbs: 42, fat: 16, fiber: 5, servingSize: '1 bowl (400g)' },
    allergens: ['gluten'],
    prepTime: 20,
    difficulty: 'easy',
    orderable: true,
    options: [
      ...vegetarianCustomizations,
      { id: 'add-grilled-salmon', name: 'Add Grilled Salmon (+200g)', priceModifier: 12, category: 'protein' }
    ]
  },
  {
    id: 'porchetta',
    name: 'Porchetta',
    description: 'Melt-in-your-mouth Italian roasted pork with crispy skin, polenta and wild mushrooms',
    ingredients: ['pork belly', 'pork loin', 'fennel', 'garlic', 'rosemary', 'polenta', 'wild mushrooms', 'olive oil', 'butter', 'white wine', 'salt', 'black pepper'],
    tags: ['gf'],
    price: 36,
    sortPriority: 16,
    image: '/images/menu/plated/porchetta.png',
    nutrition: { calories: 880, protein: 54, carbs: 38, fat: 58, fiber: 5, servingSize: '1 plate (550g)' },
    allergens: [],
    prepTime: 240,
    difficulty: 'challenging',
    orderable: true,
    options: [
      { id: 'double-meat', name: 'Double Meat (+200g)', priceModifier: 16, category: 'protein' },
      { id: 'extra-gremolata', name: 'Extra Gremolata', priceModifier: 3, category: 'add-on' },
      { id: 'sub-roasted-potatoes', name: 'Sub Polenta for Roasted Rosemary Garlic Potatoes', priceModifier: 0, category: 'side' },
      { id: 'sub-mashed-potatoes', name: 'Sub Polenta for Mashed Potatoes', priceModifier: 2, category: 'side' },
      { id: 'sub-fingerling-potatoes', name: 'Sub Polenta for Crispy Fingerling Potatoes', priceModifier: 2, category: 'side' },
      { id: 'sub-garden-salad', name: 'Sub Polenta for Garden Salad', priceModifier: 0, category: 'side' },
      { id: 'add-garden-salad', name: 'Add Garden Salad', priceModifier: 8, category: 'side' },
      { id: 'add-roasted-veggies', name: 'Add Roasted Veggies', priceModifier: 9, category: 'side' },
      { id: 'extra-polenta', name: 'Extra Polenta', priceModifier: 4, category: 'side' },
      { id: 'add-chili-crunch', name: 'Chili Crunch', priceModifier: 3, category: 'add-on' },
      { id: 'add-chili-crunch-jar', name: 'Chili Crunch Jar', priceModifier: 16, category: 'add-on' }
    ]
  },
  {
    id: 'roasted-kale',
    name: 'Roasted Kale Chips',
    description: 'Crispy roasted kale with garlic, lemon zest, paprika, and toasted almonds',
    ingredients: ['lacinato kale', 'garlic', 'lemon zest', 'paprika', 'almonds', 'olive oil', 'sea salt'],
    tags: ['vg', 'gf', 'df'],
    price: 13,
    sortPriority: 63,
    image: '/images/menu/plated/roastedkale.png',
    nutrition: { calories: 180, protein: 8, carbs: 16, fat: 12, fiber: 6, servingSize: '2 servings (200g)' },
    allergens: ['tree nuts'],
    prepTime: 15,
    difficulty: 'easy',
    orderable: true,
    options: [
      ...vegetarianCustomizations,
      { id: 'add-chipotle-aioli', name: 'Add Smoky Chipotle Aioli', priceModifier: 3, category: 'add-on' }
    ]
  },
  {
    id: 'steak-green-beans',
    name: 'Steak with Green Beans & Almonds',
    description: 'Pan-seared grass-fed steak with sautéed green beans, toasted almonds, mashed potatoes, and herb butter',
    ingredients: ['grass-fed ribeye', 'green beans', 'almonds', 'mashed potatoes', 'herb butter', 'shallots', 'garlic', 'olive oil', 'heavy cream', 'salt', 'black pepper'],
    tags: ['gf'],
    price: 42,
    sortPriority: 11,
    image: '/images/menu/plated/steakw_greenbeansalmonds.png',
    nutrition: { calories: 920, protein: 54, carbs: 38, fat: 62, fiber: 5, servingSize: '1 plate (580g)' },
    allergens: ['dairy', 'tree nuts'],
    prepTime: 25,
    difficulty: 'medium',
    orderable: true,
    options: [
      { id: 'double-meat', name: 'Double Meat (+200g)', priceModifier: 16, category: 'protein' },
      { id: 'sub-roasted-veggies', name: 'Sub Mashed Potatoes for Roasted Veggies', priceModifier: 0, category: 'side' },
      { id: 'sub-smashed-potatoes', name: 'Sub Mashed Potatoes for Smashed Rosemary Garlic Potatoes', priceModifier: 0, category: 'side' },
      { id: 'sub-fingerling-potatoes', name: 'Sub Mashed Potatoes for Crispy Fingerling Potatoes', priceModifier: 2, category: 'side' },
      { id: 'sub-polenta', name: 'Sub Mashed Potatoes for Creamy Polenta', priceModifier: 2, category: 'side' },
      { id: 'add-beet-salad', name: 'Side of Beet Salad', priceModifier: 9, category: 'side' },
      { id: 'add-garden-salad', name: 'Garden Salad', priceModifier: 8, category: 'side' }
    ]
  },
  {
    id: 'strawberry-shortcake',
    name: 'Strawberry Shortcake',
    description: 'Light vanilla sponge layered with fresh strawberries and whipped cream',
    ingredients: ['flour', 'eggs', 'fresh strawberries', 'heavy cream', 'vanilla', 'sugar'],
    tags: ['v'],
    price: 12,
    sortPriority: 73,
    image: '/images/menu/plated/strawberryshortcake.png',
    nutrition: { calories: 380, protein: 6, carbs: 48, fat: 18, fiber: 2, servingSize: '1 slice (200g)' },
    allergens: ['gluten', 'dairy', 'eggs'],
    prepTime: 45,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'thai-basil-chicken',
    name: 'Thai Basil Chicken',
    description: 'Stir-fried chicken with Thai basil, chilies, and garlic over jasmine rice with a fried egg',
    ingredients: ['chicken thighs', 'Thai basil', 'chilies', 'garlic', 'fish sauce', 'jasmine rice', 'egg', 'vegetable oil', 'oyster sauce', 'soy sauce', 'sugar', 'salt', 'white pepper'],
    tags: ['gf', 'df'],
    price: 26,
    sortPriority: 2,
    image: '/images/menu/plated/thaifriedbasilchicken.png',
    nutrition: { calories: 720, protein: 48, carbs: 58, fat: 32, fiber: 4, servingSize: '1 plate (520g)' },
    allergens: ['fish', 'eggs'],
    prepTime: 25,
    difficulty: 'easy',
    orderable: true,
    options: [
      { id: 'double-chicken', name: 'Double Chicken (+200g)', priceModifier: 10, category: 'protein' },
      { id: 'sub-tofu', name: 'Sub Tofu for Chicken', priceModifier: 0, category: 'protein' },
      { id: 'extra-fried-egg', name: 'Extra Fried Egg', priceModifier: 3, category: 'add-on' },
      { id: 'extra-jasmine-rice', name: 'Extra Jasmine Rice', priceModifier: 3, category: 'side' },
      { id: 'add-chili-crunch', name: 'Chili Crunch', priceModifier: 3, category: 'add-on' },
      { id: 'add-chili-crunch-jar', name: 'Chili Crunch Jar', priceModifier: 16, category: 'add-on' },
      { id: 'no-spicy', name: 'No Spicy', priceModifier: 0, category: 'dietary' }
    ]
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream',
    ingredients: ['ladyfingers', 'mascarpone', 'espresso', 'eggs', 'cocoa powder', 'marsala wine'],
    tags: ['v'],
    price: 13,
    sortPriority: 72,
    image: '/images/menu/plated/tiramisu.png',
    nutrition: { calories: 420, protein: 8, carbs: 42, fat: 24, fiber: 1, servingSize: '1 slice (180g)' },
    allergens: ['gluten', 'dairy', 'eggs'],
    prepTime: 30,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'tofu-avocado-salad',
    name: 'Tofu Avocado Salad',
    description: 'Air-chilled tofu with ripe avocado, sesame ginger dressing, chili crunch, and soy-based dipping sauce',
    ingredients: ['air-chilled tofu', 'avocado', 'sesame seeds', 'ginger', 'chili crunch', 'soy dipping sauce', 'rice vinegar', 'edamame', 'sesame oil', 'scallions', 'salt'],
    tags: ['vg', 'gf', 'df'],
    price: 22,
    sortPriority: 32,
    image: '/images/menu/plated/tofuavocadosalad.png',
    nutrition: { calories: 480, protein: 24, carbs: 30, fat: 32, fiber: 14, servingSize: '1 bowl (425g)' },
    allergens: ['soy', 'sesame'],
    prepTime: 20,
    difficulty: 'easy',
    orderable: true,
    options: [...vegetarianCustomizations]
  },
  {
    id: 'lemon-miso-detox-soup',
    name: 'Zesty Lemon Miso Detox Soup',
    description: 'Healing miso broth with lemon, ginger, shrimp, and fresh vegetables',
    ingredients: ['white miso', 'lemon', 'ginger', 'shrimp', 'bok choy', 'shiitake mushrooms', 'scallions'],
    tags: ['gf', 'df'],
    price: 19,
    sortPriority: 41,
    image: '/images/menu/plated/zestylemonmisodetoxsoup.png',
    nutrition: { calories: 280, protein: 24, carbs: 22, fat: 10, fiber: 4, servingSize: '1 bowl (450ml)' },
    allergens: ['shellfish', 'soy'],
    prepTime: 25,
    difficulty: 'easy',
    orderable: true,
    options: [
      { id: 'extra-bone-broth', name: 'Extra Bone Broth Side', priceModifier: 8, category: 'side' },
      { id: 'double-shrimp', name: 'Double Shrimp (+200g)', priceModifier: 10, category: 'protein' }
    ]
  },
  {
    id: 'falafel-mezze-plate',
    name: 'Falafel Mezze Plate',
    description: 'Crispy house-made falafel with garlic hummus, beet hummus, tabbouleh, vegetable crudités, saffron rice, and warm pita',
    ingredients: ['chickpeas', 'fresh herbs', 'garlic hummus', 'beet hummus', 'tabbouleh', 'vegetable crudités', 'saffron rice', 'pita bread', 'olive oil', 'tahini', 'cumin', 'coriander', 'salt', 'black pepper'],
    tags: ['vg', 'df'],
    price: 26,
    sortPriority: 47,
    image: '/images/menu/plated/falafelmezeplate.png',
    nutrition: { calories: 680, protein: 22, carbs: 72, fat: 36, fiber: 18, servingSize: '1 plate (500g)' },
    allergens: ['gluten', 'sesame'],
    prepTime: 30,
    difficulty: 'medium',
    orderable: true,
    options: [...vegetarianCustomizations]
  }
];

export interface DayMenu {
  day: string;
  lunch: MenuItem;
  dinner: MenuItem[];
  dessert: MenuItem | null;
}

export interface WeekMenu {
  id: string;
  startDate: string;  // ISO date string
  endDate: string;
  theme?: string;
  days: DayMenu[];
}

// Helper function to get menu item by ID
function getMenuItem(id: string): MenuItem {
  const item = galleryMenuItems.find(item => item.id === id);
  if (!item) {
    // Fallback for items not yet in gallery
    return {
      id: id,
      name: id.replace(/-/g, ' '),
      description: '',
      tags: [],
      price: 25,
      orderable: true
    };
  }
  return item;
}

// Week 1: Jan 6-10, 2026 (Current) - Updated with gallery items
const week1: WeekMenu = {
  id: 'week-2026-01-06',
  startDate: '2026-01-06',
  endDate: '2026-01-10',
  theme: 'Winter Comfort',
  days: [
    {
      day: 'MON',
      lunch: getMenuItem('arugula-artichoke-salad'),
      dinner: [
        getMenuItem('golden-sweet-potato-gnocchi'),
        getMenuItem('zucchini-carpaccio')
      ],
      dessert: getMenuItem('rice-pudding-cherries')
    },
    {
      day: 'TUE',
      lunch: getMenuItem('crab-cakes'),
      dinner: [
        getMenuItem('seared-duck-breast')
      ],
      dessert: {
        id: 'avocado-chocolate-mousse',
        name: 'Avocado Chocolate Mousse',
        description: 'Silky chocolate mousse made with avocado and coconut cream',
        ingredients: ['avocado', 'raw cacao', 'maple syrup', 'coconut cream', 'vanilla'],
        tags: ['gf', 'df', 'vg'],
        price: 14,
        orderable: true
      }
    },
    {
      day: 'WED',
      lunch: getMenuItem('arugula-artichoke-salad'),
      dinner: [
        getMenuItem('shepherds-pie'),
        getMenuItem('spinach-salad')
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: getMenuItem('chicken-paella'),
      dinner: [
        getMenuItem('miso-glazed-cod')
      ],
      dessert: getMenuItem('basque-cheesecake')
    },
    {
      day: 'FRI',
      lunch: getMenuItem('butternut-squash-soup'),
      dinner: [
        getMenuItem('chicken-piccata')
      ],
      dessert: getMenuItem('chocolate-chip-cookies')
    }
  ]
};

// Week 2: Jan 13-17, 2026 - Mediterranean Journey
const week2: WeekMenu = {
  id: 'week-2026-01-13',
  startDate: '2026-01-13',
  endDate: '2026-01-17',
  theme: 'Mediterranean Journey',
  days: [
    {
      day: 'MON',
      lunch: { 
        id: 'greek-lentil-soup',
        name: 'Greek Lentil Soup', 
        description: 'With crusty sourdough', 
        tags: ['v', 'df'],
        price: 18,
        orderable: true
      },
      dinner: [
        getMenuItem('albondigas') // Spanish meatballs work for Mediterranean
      ],
      dessert: {
        id: 'orange-panna-cotta',
        name: 'Orange Blossom Panna Cotta',
        description: 'With pistachios',
        price: 14,
        orderable: true
      }
    },
    {
      day: 'TUE',
      lunch: {
        id: 'falafel-bowl',
        name: 'Falafel Bowl',
        description: 'Hummus, tabbouleh, pickled turnips',
        tags: ['v', 'df'],
        price: 22,
        orderable: true
      },
      dinner: [
        {
          id: 'branzino-papillote',
          name: 'Branzino en Papillote',
          description: 'Olives, capers, cherry tomatoes, herbs',
          tags: ['gf', 'df'],
          price: 34,
          orderable: true
        }
      ],
      dessert: {
        id: 'baklava-bites',
        name: 'Baklava Bites',
        description: 'Honey, walnuts, phyllo',
        price: 12,
        orderable: true
      }
    },
    {
      day: 'WED',
      lunch: {
        id: 'shakshuka',
        name: 'Shakshuka',
        description: 'Poached eggs in spiced tomato, crusty bread',
        tags: ['v'],
        price: 20,
        orderable: true
      },
      dinner: [
        getMenuItem('chicken-paella') // Spanish paella fits Mediterranean
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: getMenuItem('spanish-gildas'),
      dinner: [
        {
          id: 'grilled-octopus',
          name: 'Grilled Octopus',
          description: 'Crispy potatoes, smoked paprika aioli',
          tags: ['gf'],
          price: 32,
          orderable: true
        }
      ],
      dessert: {
        id: 'greek-yogurt-figs',
        name: 'Greek Yogurt with Honey & Figs',
        description: '',
        tags: ['gf', 'v'],
        price: 12,
        orderable: true
      }
    },
    {
      day: 'FRI',
      lunch: {
        id: 'mezze-platter',
        name: 'Mezze Platter',
        description: 'Baba ganoush, muhammara, labneh, warm pita',
        tags: ['v'],
        price: 24,
        orderable: true
      },
      dinner: [
        {
          id: 'herb-crusted-lamb',
          name: 'Herb-Crusted Rack of Lamb',
          description: 'Ratatouille, rosemary jus',
          tags: ['gf', 'df'],
          price: 42,
          orderable: true
        }
      ],
      dessert: null
    }
  ]
};

// Week 3: Jan 18-24, 2026
const week3: WeekMenu = {
  id: 'week-2026-01-18',
  startDate: '2026-01-18',
  endDate: '2026-01-24',
  theme: 'Global Flavors',
  days: [
    {
      day: 'SAT',
      lunch: getMenuItem('lemon-miso-detox-soup'),
      dinner: [
        getMenuItem('crab-rangoons'),
        getMenuItem('thai-basil-chicken')
      ],
      dessert: getMenuItem('blueberry-muffins')
    },
    {
      day: 'SUN',
      lunch: getMenuItem('egg-salad-sandwich'),
      dinner: [
        getMenuItem('roasted-lamb-leg'),
        getMenuItem('charred-carrots')
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: getMenuItem('beef-cheek-quesadilla'),
      dinner: [
        getMenuItem('steak-salad')
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: getMenuItem('arroz-con-pollo'),
      dinner: [
        getMenuItem('lamb-carnitas-enchiladas')
      ],
      dessert: getMenuItem('churros')
    },
    {
      day: 'WED',
      lunch: getMenuItem('spaghetti-meatballs'),
      dinner: [
        getMenuItem('steak-green-beans'),
        getMenuItem('burrata-salad')
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: getMenuItem('burrata-salad'),
      dinner: [
        getMenuItem('porchetta'),
        getMenuItem('roasted-kale')
      ],
      dessert: getMenuItem('tiramisu')
    },
    {
      day: 'FRI',
      lunch: getMenuItem('blackened-fish-tacos'),
      dinner: [
        getMenuItem('braised-beef-cheeks'),
        getMenuItem('smashed-asian-cucumbers')
      ],
      dessert: getMenuItem('strawberry-shortcake')
    }
  ]
};

// Week 4: Jan 26-30, 2026
const week4: WeekMenu = {
  id: 'week-2026-01-26',
  startDate: '2026-01-26',
  endDate: '2026-01-30',
  theme: 'Global Comfort',
  days: [
    {
      day: 'MON',
      lunch: getMenuItem('lemon-miso-detox-soup'),
      dinner: [
        getMenuItem('thai-basil-chicken'),
        getMenuItem('tofu-avocado-salad')
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: getMenuItem('egg-salad-sandwich'),
      dinner: [
        getMenuItem('roasted-lamb-leg'),
        getMenuItem('charred-carrots')
      ],
      dessert: getMenuItem('churros')
    },
    {
      day: 'WED',
      lunch: getMenuItem('falafel-mezze-plate'),
      dinner: [
        getMenuItem('braised-beef-cheeks'),
        getMenuItem('roasted-kale')
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: getMenuItem('arroz-con-pollo'),
      dinner: [
        getMenuItem('lamb-carnitas-enchiladas'),
        getMenuItem('smashed-asian-cucumbers')
      ],
      dessert: getMenuItem('tiramisu')
    },
    {
      day: 'FRI',
      lunch: getMenuItem('italian-wedding-soup'),
      dinner: [
        getMenuItem('porchetta'),
        getMenuItem('panzanella-salad')
      ],
      dessert: getMenuItem('strawberry-shortcake')
    }
  ]
};

// Week 5: Feb 1-7, 2026
const week5: WeekMenu = {
  id: 'week-2026-02-01',
  startDate: '2026-02-01',
  endDate: '2026-02-07',
  theme: 'Asian Fusion',
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Tuna Poke Bowl', description: 'With edamame, pickled ginger, avocado, black sesame, and scallions', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Duck Ramen', description: 'With shiitake mushrooms, rich house-made bone broth, and scallions', tags: ['df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Salmon Cherry Tomato Curry', description: 'With steamed jasmine rice', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Miso-Butter Chicken', description: 'With grapefruit', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Greek Chicken', description: 'With cucumber feta salad', tags: ['gf'] },
      dinner: [
        { name: 'Grass-Fed Filet', description: 'With mashed potatoes and steamed carrots', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Ras el Hanout Chickpea Spinach Stew', description: 'Optional: add chorizo', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Smashed Beef Kebab', description: 'With cucumber mint yogurt and freshly made pitas' }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Dan Dan Noodle Salad', description: 'Spicy Sichuan flavors' },
      dinner: [
        { name: 'Butternut Squash Ravioli', description: 'With brown butter, sage, and Pecorino Romano', tags: ['v'] }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Crispy Coconut Asparagus Green Bean Salad', description: 'Fresh and crunchy', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Hoisin Garlic Noodles', description: 'With pink jumbo prawns', tags: ['df'] }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Chicken Red Lentil Soup', description: 'With lemony yogurt', tags: ['gf'] },
      dinner: [
        { name: 'Stuffed Poblano Peppers', description: 'With chicken tinga', tags: ['gf'] }
      ],
      dessert: null
    }
  ]
};

// Week 6: Feb 8-14, 2026 (Valentine's Week)
const week6: WeekMenu = {
  id: 'week-2026-02-08',
  startDate: '2026-02-08',
  endDate: '2026-02-14',
  theme: "Valentine's Romance",
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Whipped Tofu', description: 'With roasted broccolini, crispy garlic chili crunch, and cold soba noodles with edamame', tags: ['v', 'df'] },
      dinner: [
        { name: 'Pepper Steak and Celery Stir-Fry', description: 'With lemon and steamed rice', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Italian Wedding Soup', description: 'Classic comfort' },
      dinner: [
        { name: '12-Hour Braised Beef Lasagna', description: 'With béchamel, mozzarella, and Parmigiano-Reggiano' }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Creamy Butternut Squash Coconut Noodle Soup', description: 'Warming and rich', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Chicken Cordon Bleu', description: 'With scalloped potatoes' }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Aloo Gobi', description: 'With fresh turmeric daal soup and basmati rice', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Lamb Biryani', description: 'With tempered spices, saffron, and rose water', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Crêpes', description: 'With Gruyère and ham or Gruyère and mushrooms, served with a side salad', tags: ['v'] },
      dinner: [
        { name: 'Eastern European Beef Cabbage Rolls', description: 'With crusty artisan bread' }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Savory Cheddar Scones', description: 'Or Cheddar Bacon Scones with onion jam and radicchio salad' },
      dinner: [
        { name: "Mom's Meatloaf", description: 'With marinara sauce and cauliflower mash', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Chicken Kale Caesar Salad', description: 'Classic with a twist', tags: ['gf'] },
      dinner: [
        { name: 'Roast Lamb Shoulder', description: 'With spring vegetables', tags: ['gf', 'df'] }
      ],
      dessert: null
    }
  ]
};

// Week 7: Feb 15-21, 2026
const week7: WeekMenu = {
  id: 'week-2026-02-15',
  startDate: '2026-02-15',
  endDate: '2026-02-21',
  theme: 'Mediterranean & Beyond',
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Peruvian Ceviche', description: 'With leche de tigre and plantain chips', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Lentil Salad', description: 'With roasted vegetables, beef kofta, and saffron rice', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Four Cheese Gnocchi', description: 'With side of arugula salad', tags: ['v'] },
      dinner: [
        { name: 'Lamb Rack', description: 'With pistachio-mint crust and turnip purée', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Korean Soy Garlic Chicken Thighs', description: 'With kimchi, pickled vegetables, and steamed rice', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Spring Chicken', description: 'Red pepper sun-dried tomato hummus, brown lentils, and roasted cauliflower', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Pomegranate Greens Salad', description: 'With halloumi croutons and a spiced orange vinaigrette', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Aglio e Olio Pan Seared Cod', description: 'With creamy polenta', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Thai Style Salmon Salad', description: 'Fresh and vibrant', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Pad See Ew "Drunken Noodles"', description: 'With chicken or pork and fried egg' }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Roasted Cauliflower Green Salad', description: 'With green goddess dressing (add chicken +$5)', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Classic Chicken Pot Pie', description: 'Comfort food perfection' }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Crispy Potato Galette', description: 'With crème fraîche, scallions, capers, smoked salmon, and fresh herbs', tags: ['gf'] },
      dinner: [
        { name: 'Fall-Apart Lamb Shoulder', description: 'With roast acorn squash on herbed white bean mash with chili, mint, and pistachio butter', tags: ['gf'] }
      ],
      dessert: null
    }
  ]
};

// Week 8: Feb 22-28, 2026
const week8: WeekMenu = {
  id: 'week-2026-02-22',
  startDate: '2026-02-22',
  endDate: '2026-02-28',
  theme: 'Comfort Classics',
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Cheese Soufflé', description: 'With endive salad', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Grilled Grass-Fed Steak', description: 'With tomatoes, pistachios, cumin, scallions, slow-roasted sweet potato, and chimichurri', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Grilled Cheese Sandwich', description: 'On artisan bread with tomato soup', tags: ['v'] },
      dinner: [
        { name: 'Roasted Beet and Pistachio Salad', description: 'With horseradish crème fraîche and gently poached spring chicken', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Crispy Brussels Sprouts', description: 'With pesto mac and cheese', tags: ['v'] },
      dinner: [
        { name: 'Veal and Chicken Cannelloni', description: 'With béchamel sauce and truffle' }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Indonesian Nasi Goreng', description: 'Fried rice with shrimp and vegetables', tags: ['df'] },
      dinner: [
        { name: 'Grilled Salmon', description: 'With charred cabbage, lemon, capers and white bean puree', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Grilled Zucchini Salad', description: 'With lemon-herb vinaigrette, smoky cauliflower steaks, and beet salad', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Duck Confit', description: 'With roasted potatoes and raw asparagus salad with walnuts and Parmesan', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Salmon Carpaccio', description: 'With sourdough crackers, blistered Padrón peppers, and beet salad', tags: ['gf'] },
      dinner: [
        { name: 'Porchetta', description: 'With sweet apple glaze, parsnip purée, and fennel apple slaw', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Mandarin Fennel Burrata Salad', description: 'With gently poached cod and white beans', tags: ['gf'] },
      dinner: [
        { name: 'Duck Ragu', description: 'With fresh pappardelle pasta in our famous marinara sauce' }
      ],
      dessert: null
    }
  ]
};

// Week 9: Mar 1-7, 2026
const week9: WeekMenu = {
  id: 'week-2026-03-01',
  startDate: '2026-03-01',
  endDate: '2026-03-07',
  theme: 'International Journey',
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Burmese Tea Leaf Salad', description: 'With mixed nuts and grilled chicken', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Lomo Saltado', description: 'Peruvian sirloin beef cubes with stir-fried tomatoes and French fries', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Fig Carpaccio', description: 'With pine nuts, blue cheese, arugula, duck prosciutto, lemon, and artisan bread', tags: ['gf'] },
      dinner: [
        { name: 'Bangers and Mash', description: 'Local beef sausage, mashed potatoes, and rich gravy', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Portuguese Octopus Salad', description: 'Salada de polvo with olive oil, potatoes, fresh herbs, tomatoes, and cucumber', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Portuguese Carne Assada', description: 'Traditional Azorean braised beef with small red potatoes, chouriço, and onions', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Thai Papaya Salad', description: 'With peanuts and shrimp', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Massaman Thai Curry', description: 'With duck breast and steamed jasmine rice', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Scotch Egg', description: 'With honey mustard sauce and balsamic vinaigrette', tags: ['gf'] },
      dinner: [
        { name: 'Beef Wellington', description: 'With gravy, smashed potatoes, and roasted carrots' }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Bavarian Pretzel', description: 'With house-made sauerkraut, mustard, bratwurst, and German potato salad' },
      dinner: [
        { name: 'Veal Vienna Schnitzel', description: 'With spätzle and gravy' }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Italian Panini', description: 'Roasted bell peppers, eggplant, goat cheese, and zesty basil pesto', tags: ['v'] },
      dinner: [
        { name: 'Chicken Piccata', description: 'Sautéed in bright lemon-white wine butter sauce with fried capers and fresh parsley over angel hair pasta' }
      ],
      dessert: null
    }
  ]
};

// Week 10: Mar 8-14, 2026
const week10: WeekMenu = {
  id: 'week-2026-03-08',
  startDate: '2026-03-08',
  endDate: '2026-03-14',
  theme: 'Spring Preview',
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Crispy Potato Wedges', description: 'With whipped pesto feta, slow-roasted salmon, and green olive chutney', tags: ['gf'] },
      dinner: [
        { name: '24-Hour Adobo Crispy Pork Belly', description: 'With fried basil and steamed rice', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Roasted Cauliflower Butternut Squash Soup', description: 'With side of artisan bread', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Pork Chop', description: 'In apple cider reduction with polenta and sautéed greens', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Hearty Chicken Bone Broth Soup', description: 'With red cabbage salad', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Eggplant Parmesan', description: 'With balsamic-roasted Brussels sprouts, panzanella salad, and artisan bread', tags: ['v'] }
      ],
      dessert: null
    }
  ]
};

export const allMenus: WeekMenu[] = [week1, week2, week3, week4]; // Additional weeks can be added

export const getCurrentWeekMenu = (): WeekMenu => {
  const today = new Date();
  const currentMenu = allMenus.find(menu => {
    const start = new Date(menu.startDate);
    const end = new Date(menu.endDate);
    end.setHours(23, 59, 59);
    return today >= start && today <= end;
  });
  return currentMenu || allMenus[0];
};

export const getUpcomingMenus = (count: number = 4): WeekMenu[] => {
  const today = new Date();
  return allMenus
    .filter(menu => new Date(menu.startDate) >= today)
    .slice(0, count);
};

// Get all orderable menu items
export const getAllOrderableItems = (): MenuItem[] => {
  return galleryMenuItems.filter(item => item.orderable);
};

// Get menu items by category/tags
export const getMenuItemsByTag = (tag: 'gf' | 'df' | 'v' | 'vg'): MenuItem[] => {
  return galleryMenuItems.filter(item => item.tags?.includes(tag));
};

// Get menu items by price range
export const getMenuItemsByPrice = (minPrice: number, maxPrice: number): MenuItem[] => {
  return galleryMenuItems.filter(item => item.price >= minPrice && item.price <= maxPrice);
};

// Search menu items by name or description
export const searchMenuItems = (query: string): MenuItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return galleryMenuItems.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.description?.toLowerCase().includes(lowercaseQuery) ||
    item.ingredients?.some(ingredient => ingredient.toLowerCase().includes(lowercaseQuery))
  );
};

// Get featured items (high-value items)
export const getFeaturedItems = (): MenuItem[] => {
  return galleryMenuItems.filter(item => item.price >= 30 && item.orderable);
};

export const dietaryInfo = {
  gf: { label: 'Gluten-Free', icon: 'GF' },
  df: { label: 'Dairy-Free', icon: 'DF' },
  v: { label: 'Vegetarian', icon: 'V' },
  vg: { label: 'Vegan', icon: 'VG' }
};

export const pricingInfo = {
  averagePrice: 24,
  priceRange: '8-42',
  note: 'All dishes are made with organic, locally-sourced ingredients. Dietary modifications available on request at no extra charge.'
};
