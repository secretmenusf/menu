// Enhanced Menu data for Secret Menu - Weekly rotating menus
// All dishes now match gallery images with full details, nutrition, and ordering capability

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
    id: 'zucchini-carpaccio',
    name: 'Zucchini Carpaccio',
    description: 'Paper-thin zucchini ribbons with pine nuts, mint, and lemon vinaigrette',
    ingredients: ['organic zucchini', 'pine nuts', 'fresh mint', 'lemon', 'extra virgin olive oil', 'sea salt', 'black pepper'],
    tags: ['v', 'gf', 'df'],
    price: 18,
    image: '/images/menu/new/zuchinicarpaccio.png',
    nutrition: { calories: 145, protein: 4, carbs: 8, fat: 12, fiber: 3, servingSize: '1 plate (200g)' },
    allergens: ['tree nuts'],
    prepTime: 15,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'sunday-roast',
    name: 'Sunday Roast',
    description: 'Traditional herb-crusted roast beef with Yorkshire pudding, roasted vegetables, and gravy',
    ingredients: ['grass-fed beef roast', 'Yorkshire pudding', 'carrots', 'potatoes', 'Brussels sprouts', 'beef drippings', 'flour', 'herbs'],
    tags: ['df'],
    price: 42,
    image: '/images/menu/new/sundayroast.png',
    nutrition: { calories: 685, protein: 48, carbs: 35, fat: 38, fiber: 6, servingSize: '1 plate (450g)' },
    allergens: ['gluten'],
    prepTime: 120,
    difficulty: 'challenging',
    orderable: true
  },
  {
    id: 'spinach-salad',
    name: 'Spinach Walnut Apple Salad',
    description: 'Baby spinach with Honeycrisp apples, candied walnuts, and goat cheese crumbles',
    ingredients: ['baby spinach', 'Honeycrisp apples', 'candied walnuts', 'goat cheese', 'dried cranberries', 'balsamic vinaigrette'],
    tags: ['v', 'gf'],
    price: 16,
    image: '/images/menu/new/spinachsalad.png',
    nutrition: { calories: 285, protein: 12, carbs: 22, fat: 18, fiber: 5, servingSize: '1 bowl (250g)' },
    allergens: ['dairy', 'tree nuts'],
    prepTime: 10,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'spanish-gildas',
    name: 'Spanish Gildas',
    description: 'Traditional pintxo with anchovy, olive, and pickled pepper on toothpick',
    ingredients: ['Spanish anchovies', 'Manzanilla olives', 'Guindilla peppers', 'extra virgin olive oil'],
    tags: ['gf', 'df'],
    price: 8,
    image: '/images/menu/new/spanishgildass.png',
    nutrition: { calories: 45, protein: 3, carbs: 1, fat: 4, fiber: 0, servingSize: '3 pieces (30g)' },
    allergens: ['fish'],
    prepTime: 5,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'sourdough-bread',
    name: 'Artisan Sourdough',
    description: 'House-made sourdough with sea salt and olive oil',
    ingredients: ['organic flour', 'sourdough starter', 'sea salt', 'water', 'extra virgin olive oil'],
    tags: ['v', 'df'],
    price: 12,
    image: '/images/menu/new/sourdough.png',
    nutrition: { calories: 240, protein: 8, carbs: 48, fat: 3, fiber: 2, servingSize: '3 slices (100g)' },
    allergens: ['gluten'],
    prepTime: 24, // includes rising time
    difficulty: 'challenging',
    orderable: true
  },
  {
    id: 'shepherds-pie',
    name: "Shepherd's Pie",
    description: 'Classic lamb and vegetable stew topped with creamy mashed potatoes',
    ingredients: ['ground lamb', 'carrots', 'peas', 'onions', 'potatoes', 'butter', 'milk', 'thyme', 'rosemary'],
    tags: [],
    price: 28,
    image: '/images/menu/new/shepardspie.png',
    nutrition: { calories: 485, protein: 32, carbs: 38, fat: 24, fiber: 6, servingSize: '1 portion (350g)' },
    allergens: ['dairy'],
    prepTime: 90,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'seared-duck-breast',
    name: 'Seared Duck Breast',
    description: 'Pan-seared duck breast with port wine reduction and silky carrots',
    ingredients: ['duck breast', 'port wine', 'shallots', 'butter', 'carrots', 'thyme', 'honey'],
    tags: ['gf', 'df'],
    price: 38,
    image: '/images/menu/new/searedduckbreast.png',
    nutrition: { calories: 485, protein: 38, carbs: 18, fat: 28, fiber: 4, servingSize: '1 plate (320g)' },
    allergens: [],
    prepTime: 45,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'rice-pudding-cherries',
    name: 'Rice Pudding with Candied Cherries',
    description: 'Creamy vanilla rice pudding topped with candied cherries and cinnamon',
    ingredients: ['arborio rice', 'whole milk', 'heavy cream', 'vanilla bean', 'sugar', 'candied cherries', 'cinnamon'],
    tags: ['v', 'gf'],
    price: 14,
    image: '/images/menu/new/ricepuddingwcandiedcherries-2.png',
    nutrition: { calories: 285, protein: 8, carbs: 42, fat: 10, fiber: 1, servingSize: '1 cup (200g)' },
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
    tags: ['v', 'gf', 'df'],
    price: 12,
    image: '/images/menu/new/padronepeppers.png',
    nutrition: { calories: 85, protein: 2, carbs: 6, fat: 7, fiber: 2, servingSize: '1 portion (120g)' },
    allergens: [],
    prepTime: 10,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'miso-glazed-cod',
    name: 'Miso Glazed Cod',
    description: 'Nobu-inspired miso glazed black cod with bok choy and jasmine rice',
    ingredients: ['black cod', 'white miso', 'mirin', 'sake', 'sugar', 'bok choy', 'jasmine rice', 'ginger', 'scallions'],
    tags: ['gf', 'df'],
    price: 36,
    image: '/images/menu/new/misoglazedcod.png',
    nutrition: { calories: 425, protein: 32, carbs: 38, fat: 16, fiber: 3, servingSize: '1 plate (350g)' },
    allergens: ['fish', 'soy'],
    prepTime: 30,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'grilled-cheese-tomato-soup',
    name: 'Grilled Cheese & Tomato Soup',
    description: 'Classic comfort combo with aged cheddar on sourdough and creamy tomato soup',
    ingredients: ['sourdough bread', 'aged cheddar', 'butter', 'tomatoes', 'cream', 'basil', 'garlic', 'onion'],
    tags: ['v'],
    price: 18,
    image: '/images/menu/new/grilledcheesew:tomatosoup.png',
    nutrition: { calories: 485, protein: 18, carbs: 42, fat: 28, fiber: 4, servingSize: '1 combo (400g)' },
    allergens: ['dairy', 'gluten'],
    prepTime: 25,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'golden-sweet-potato-gnocchi',
    name: 'Golden Sweet Potato Gnocchi',
    description: 'House-made sweet potato gnocchi with sage brown butter and toasted walnuts',
    ingredients: ['sweet potatoes', 'flour', 'egg', 'sage', 'butter', 'walnuts', 'parmesan', 'nutmeg'],
    tags: ['v'],
    price: 26,
    image: '/images/menu/new/goldensweetpotatognocchi.png',
    nutrition: { calories: 445, protein: 12, carbs: 52, fat: 22, fiber: 6, servingSize: '1 plate (300g)' },
    allergens: ['gluten', 'dairy', 'eggs', 'tree nuts'],
    prepTime: 90,
    difficulty: 'challenging',
    orderable: true
  },
  {
    id: 'garlic-noodles',
    name: 'Hoisin Garlic Noodles',
    description: 'Asian-style garlic noodles with hoisin glaze and scallions',
    ingredients: ['fresh noodles', 'garlic', 'hoisin sauce', 'soy sauce', 'sesame oil', 'scallions', 'cilantro'],
    tags: ['df'],
    price: 22,
    image: '/images/menu/new/garlicnoodles.png',
    nutrition: { calories: 385, protein: 12, carbs: 58, fat: 12, fiber: 3, servingSize: '1 bowl (300g)' },
    allergens: ['gluten', 'soy'],
    prepTime: 20,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'duck-confit',
    name: 'Duck Confit',
    description: 'Slow-cooked duck leg with roasted potatoes and fresh herb salad',
    ingredients: ['duck leg', 'duck fat', 'garlic', 'thyme', 'potatoes', 'mixed herbs', 'lemon', 'olive oil'],
    tags: ['gf', 'df'],
    price: 34,
    image: '/images/menu/new/duckconfit.png',
    nutrition: { calories: 565, protein: 35, carbs: 28, fat: 38, fiber: 4, servingSize: '1 plate (380g)' },
    allergens: [],
    prepTime: 180, // slow cooking
    difficulty: 'challenging',
    orderable: true
  },
  {
    id: 'crispy-persian-rice',
    name: 'Crispy Persian Rice',
    description: 'Traditional tahdig with golden crispy bottom and saffron',
    ingredients: ['basmati rice', 'saffron', 'butter', 'yogurt', 'salt'],
    tags: ['v', 'gf'],
    price: 16,
    image: '/images/menu/new/crispypersianrice.png',
    nutrition: { calories: 285, protein: 6, carbs: 52, fat: 6, fiber: 1, servingSize: '1 portion (200g)' },
    allergens: ['dairy'],
    prepTime: 45,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'crazy-caprese',
    name: 'Crazy Caprese',
    description: 'Elevated caprese with heirloom tomatoes, burrata, and basil oil',
    ingredients: ['heirloom tomatoes', 'burrata cheese', 'fresh basil', 'basil oil', 'balsamic reduction', 'flaky salt'],
    tags: ['v', 'gf'],
    price: 20,
    image: '/images/menu/new/crazycaprese.png',
    nutrition: { calories: 265, protein: 14, carbs: 12, fat: 20, fiber: 3, servingSize: '1 plate (250g)' },
    allergens: ['dairy'],
    prepTime: 15,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'crab-cakes',
    name: 'Crab Cakes',
    description: 'Dungeness crab cakes with asparagus and corn salad',
    ingredients: ['Dungeness crab', 'panko breadcrumbs', 'mayonnaise', 'dijon mustard', 'asparagus', 'corn', 'lemon'],
    tags: ['gf'],
    price: 32,
    image: '/images/menu/new/crabcakes.png',
    nutrition: { calories: 385, protein: 28, carbs: 18, fat: 24, fiber: 4, servingSize: '2 cakes (280g)' },
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
    price: 12,
    image: '/images/menu/new/chocolatechipcookies.png',
    nutrition: { calories: 185, protein: 3, carbs: 24, fat: 9, fiber: 1, servingSize: '2 cookies (60g)' },
    allergens: ['gluten', 'dairy', 'eggs'],
    prepTime: 25,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'chicken-piccata',
    name: 'Chicken Piccata',
    description: 'Pan-seared chicken in lemon-white wine butter sauce with capers over angel hair',
    ingredients: ['chicken breast', 'flour', 'white wine', 'lemon', 'butter', 'capers', 'angel hair pasta', 'parsley'],
    tags: [],
    price: 28,
    image: '/images/menu/new/chickenpicatta.png',
    nutrition: { calories: 485, protein: 38, carbs: 35, fat: 22, fiber: 2, servingSize: '1 plate (350g)' },
    allergens: ['gluten', 'dairy'],
    prepTime: 30,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'chicken-paella',
    name: 'Chicken Paella',
    description: 'Traditional Spanish paella with saffron rice, chicken, and vegetables',
    ingredients: ['bomba rice', 'chicken', 'saffron', 'green beans', 'lima beans', 'red pepper', 'garlic', 'olive oil'],
    tags: ['gf', 'df'],
    price: 32,
    image: '/images/menu/new/chickenpaella.png',
    nutrition: { calories: 445, protein: 32, carbs: 45, fat: 16, fiber: 4, servingSize: '1 portion (400g)' },
    allergens: [],
    prepTime: 45,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'chicken-harissa',
    name: 'Chicken Harissa',
    description: 'Spiced chicken with North African harissa, couscous, and roasted vegetables',
    ingredients: ['chicken thighs', 'harissa paste', 'couscous', 'zucchini', 'bell peppers', 'onion', 'cilantro'],
    tags: ['df'],
    price: 26,
    image: '/images/menu/new/chickenharissa.png',
    nutrition: { calories: 425, protein: 35, carbs: 38, fat: 18, fiber: 5, servingSize: '1 plate (350g)' },
    allergens: ['gluten'],
    prepTime: 40,
    difficulty: 'medium',
    orderable: true
  },
  {
    id: 'chicken-caesar-wrap',
    name: 'Chicken Caesar Wrap',
    description: 'Grilled chicken Caesar salad wrapped in a spinach tortilla',
    ingredients: ['grilled chicken', 'romaine lettuce', 'parmesan', 'Caesar dressing', 'croutons', 'spinach tortilla'],
    tags: [],
    price: 16,
    image: '/images/menu/new/chickencaesarwrap.png',
    nutrition: { calories: 485, protein: 32, carbs: 35, fat: 25, fiber: 4, servingSize: '1 wrap (300g)' },
    allergens: ['gluten', 'dairy', 'eggs'],
    prepTime: 15,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'caesar-wrap',
    name: 'Caesar Wrap',
    description: 'Classic Caesar salad wrapped in a flour tortilla',
    ingredients: ['romaine lettuce', 'parmesan', 'Caesar dressing', 'croutons', 'flour tortilla'],
    tags: ['v'],
    price: 14,
    image: '/images/menu/new/caesarwrap.png',
    nutrition: { calories: 385, protein: 12, carbs: 42, fat: 20, fiber: 4, servingSize: '1 wrap (250g)' },
    allergens: ['gluten', 'dairy', 'eggs'],
    prepTime: 10,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'butternut-squash-soup',
    name: 'Butternut Squash Soup',
    description: 'Roasted butternut squash soup with coconut cream and spices',
    ingredients: ['butternut squash', 'coconut cream', 'onion', 'ginger', 'nutmeg', 'sage', 'vegetable broth'],
    tags: ['v', 'gf', 'df'],
    price: 16,
    image: '/images/menu/new/butternutsquashsoup.png',
    nutrition: { calories: 185, protein: 4, carbs: 28, fat: 8, fiber: 6, servingSize: '1 bowl (300ml)' },
    allergens: [],
    prepTime: 45,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'bulgur-salad',
    name: 'Bulgur Salad',
    description: 'Mediterranean bulgur salad with herbs, vegetables, and lemon dressing',
    ingredients: ['bulgur wheat', 'tomatoes', 'cucumber', 'parsley', 'mint', 'lemon juice', 'olive oil', 'onion'],
    tags: ['v', 'df'],
    price: 16,
    image: '/images/menu/new/bulgursalad.png',
    nutrition: { calories: 245, protein: 8, carbs: 42, fat: 8, fiber: 10, servingSize: '1 bowl (250g)' },
    allergens: ['gluten'],
    prepTime: 20,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'bulgur-gi-bowls',
    name: 'Bulgur GI Bowls',
    description: 'Low glycemic index bulgur bowls with roasted vegetables and tahini',
    ingredients: ['bulgur wheat', 'roasted vegetables', 'chickpeas', 'tahini', 'lemon', 'olive oil', 'herbs'],
    tags: ['v', 'df'],
    price: 20,
    image: '/images/menu/new/bulgulgibowls.png',
    nutrition: { calories: 365, protein: 14, carbs: 48, fat: 16, fiber: 12, servingSize: '1 bowl (350g)' },
    allergens: ['gluten', 'sesame'],
    prepTime: 30,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'beet-salad',
    name: 'Roasted Beet Salad',
    description: 'Roasted beets with goat cheese, walnuts, and arugula',
    ingredients: ['golden beets', 'red beets', 'goat cheese', 'walnuts', 'arugula', 'balsamic vinaigrette'],
    tags: ['v', 'gf'],
    price: 18,
    image: '/images/menu/new/beetsalad.png',
    nutrition: { calories: 285, protein: 12, carbs: 22, fat: 18, fiber: 5, servingSize: '1 bowl (250g)' },
    allergens: ['dairy', 'tree nuts'],
    prepTime: 60, // roasting time
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'basque-cheesecake',
    name: 'Basque Burnt Cheesecake',
    description: 'Crustless burnt Basque cheesecake with caramelized top',
    ingredients: ['cream cheese', 'heavy cream', 'eggs', 'sugar', 'vanilla bean', 'sea salt'],
    tags: ['v', 'gf'],
    price: 16,
    image: '/images/menu/new/basquecheesecake.png',
    nutrition: { calories: 380, protein: 7, carbs: 28, fat: 28, fiber: 0, servingSize: '1 slice (120g)' },
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
    price: 16,
    image: '/images/menu/new/arugulasaladw:artichoke.png',
    nutrition: { calories: 185, protein: 8, carbs: 12, fat: 14, fiber: 6, servingSize: '1 bowl (200g)' },
    allergens: ['dairy'],
    prepTime: 15,
    difficulty: 'easy',
    orderable: true
  },
  {
    id: 'albondigas',
    name: 'Albóndigas',
    description: 'Spanish meatballs in rich tomato sauce with manchego cheese',
    ingredients: ['ground beef', 'ground pork', 'onion', 'garlic', 'tomato sauce', 'manchego cheese', 'herbs'],
    tags: ['gf'],
    price: 24,
    image: '/images/menu/new/albondigas.png',
    nutrition: { calories: 425, protein: 32, carbs: 18, fat: 26, fiber: 3, servingSize: '6 meatballs (300g)' },
    allergens: ['dairy'],
    prepTime: 45,
    difficulty: 'medium',
    orderable: true
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
      lunch: getMenuItem('chicken-harissa'),
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
        getMenuItem('chicken-harissa') // Moroccan-style fits Mediterranean
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
      lunch: { name: 'Healing Miso Lemon Ginger Shrimp Detox Broth', description: 'Optional organic tofu, vegan chipotle kale chips available', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Shrimp & Veggie Pan Fried Spring Rolls', description: 'With tofu avocado salad' },
        { name: 'Stir Fried Basil Chicken', description: 'With steamed jasmine rice and fried egg', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'SUN',
      lunch: { name: 'Lemon Arugula Pasta Salad', description: 'With egg salad sandwich on artisan sourdough' },
      dinner: [
        { name: 'Roasted Lamb Leg', description: 'Pomegranate glaze, roasted potatoes, fresh mint sauce', tags: ['gf', 'df'] },
        { name: 'Charred Carrots', description: 'Yogurt tahini sauce and fresh herbs', tags: ['v', 'gf'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Beef Cheek Quesadillas', description: 'With fresh guacamole and pico de gallo' },
      dinner: [
        { name: 'Lettuce Wraps', description: 'Steak carne asada, cotija cheese, cilantro lime aioli, avocado and pickled onions', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Irresistible Cuban Arroz con Pollo', description: 'Classic Cuban chicken and rice', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Lamb Carnitas Enchiladas', description: 'With salsa verde and queso fresco' }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Fresh Spaghetti', description: 'With crushed tomatoes, anchovies, olives and capers', tags: ['df'] },
      dinner: [
        { name: 'Tuscan Artichoke Tomato Salad', description: 'With grilled local grass fed steak', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Cannellini Soup', description: 'With artisan focaccia, heirloom tomato, basil and burrata', tags: ['v'] },
      dinner: [
        { name: 'Porchetta', description: 'Melt in your mouth, with polenta and wild mushrooms', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'California Chicken Salad', description: 'Microgreens, feta, avocado, artichoke hearts and fennel', tags: ['gf'] },
      dinner: [
        { name: 'Braised Beef Cheeks', description: 'With parsnip purée and charred scallion gremolata', tags: ['gf', 'df'] }
      ],
      dessert: null
    }
  ]
};

// Week 4: Jan 25-31, 2026
const week4: WeekMenu = {
  id: 'week-2026-01-25',
  startDate: '2026-01-25',
  endDate: '2026-01-31',
  theme: 'Latin Inspirations',
  days: [
    {
      day: 'SAT',
      lunch: { name: 'Jennifer Aniston Salad', description: 'Chickpeas, cucumbers, pistachios, herbs, feta and lemon dressing', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Slow Cooked Beef Ragu Bolognese', description: 'Red wine tomato reduction with fresh egg yolk pappardelle, shaved pecorino and sourdough garlic bread' }
      ],
      dessert: null
    },
    {
      day: 'SUN',
      lunch: { name: 'Italian Tortellini Pasta Salami Salad', description: 'Classic Italian flavors' },
      dinner: [
        { name: 'Cuban Beef Picadillo', description: 'With black beans and savory plantains', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Chicken Tinga Empanadas', description: 'With chimichurri dipping sauce' },
      dinner: [
        { name: 'Cuban Beef Picadillo', description: 'With black beans and savory plantains', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Brazilian Moqueca', description: 'Tangy Brazilian fish stew with tomato, coconut milk and bell peppers', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Ropa Vieja', description: 'Cuban slow cooked beef with black beans and sweet plantains', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Vegan Cheesy Potato Empanadas', description: 'With cashew cheese, fried potatoes, fried basil and sundried tomatoes', tags: ['v', 'df'] },
      dinner: [
        { name: 'Creamy Tuscan Chicken', description: 'With angel hair pasta' }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Onigiri Sandwiches', description: 'Sesame scallion egg mayo and spicy sustainable tuna', tags: ['df'] },
      dinner: [
        { name: 'Chicken or Pork Katsu', description: 'With gravy, chopped cabbage and steamed rice' }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Spanish Tortilla', description: 'Caramelized onions, confit potatoes, green onions. Add caviar +$75', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Tuna Tataki', description: 'Pistachio, almond, and macadamia crust with steamed veggies', tags: ['gf', 'df'] }
      ],
      dessert: null
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
      lunch: { name: 'Tuna Poke Bowl', description: 'Edamame, pickled ginger, avocado, black sesame, scallions', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Duck Ramen', description: 'With shiitake and rich housemade bone broth, scallions', tags: ['df'] }
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
        { name: 'Grass Fed Filet', description: 'With mashed potatoes and steamed carrots', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Ras el Hanout Chickpea Spinach Stew', description: 'Optional add chorizo', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Smashed Beef Kebab', description: 'With cucumber mint yogurt and freshly made pitas' }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Dan Dan Noodle Salad', description: 'Spicy Sichuan flavors' },
      dinner: [
        { name: 'Butternut Squash Ravioli', description: 'With brown butter sage and pecorino romano', tags: ['v'] }
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
      lunch: { name: 'Whipped Tofu', description: 'With roasted broccolini, crispy garlic chili crunch and cold soba noodles with edamame', tags: ['v', 'df'] },
      dinner: [
        { name: 'Pepper Steak Celery Stir-Fry', description: 'With lemon and steamed rice', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Italian Wedding Soup', description: 'Classic comfort' },
      dinner: [
        { name: '12 Hour Braised Beef Lasagne', description: 'With bechamel, mozzarella and Parmigiano Reggiano' }
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
      lunch: { name: 'Aloo Gobi', description: 'With fresh turmeric-dahl soup and basmati rice', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Lamb Biryani', description: 'With tempered spices, saffron and rose water', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Crepes', description: 'With Gruyere and Ham or Gruyere and Mushrooms, side salad', tags: ['v'] },
      dinner: [
        { name: 'Eastern European Beef Cabbage Rolls', description: 'With crusty artisan bread' }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Savory Cheddar Scones', description: 'Or Cheddar Bacon Scones with onion jam and radicchio salad' },
      dinner: [
        { name: "Moms' Meatloaf", description: 'With marinara sauce and cauliflower mash', tags: ['gf'] }
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
        { name: 'Lentil Salad', description: 'With roasted veggies, beef kofta and saffron rice', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Four Cheese Gnocchi', description: 'With side of arugula salad', tags: ['v'] },
      dinner: [
        { name: 'Lamb Rack', description: 'With pistachio mint crust and turnip puree', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Korean Soy Garlic Chicken Thighs', description: 'With kimchi, pickled veggies and steamed rice', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Spring Chicken', description: 'Red pepper sun dried tomato hummus, brown lentils and roasted cauliflower', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Pomegranate Greens Salad', description: 'With halloumi croutons and spiced orange vinaigrette', tags: ['v', 'gf'] },
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
      lunch: { name: 'Roasted Cauliflower Green Salad', description: 'With green goddess dressing. Add chicken +$5', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Classic Chicken Pot Pie', description: 'Comfort food perfection' }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Crispy Potato Galette', description: 'With crème fraîche, scallions, capers, smoked salmon and fresh fraise', tags: ['gf'] },
      dinner: [
        { name: 'Fall-Apart Lamb Shoulder', description: 'With roast acorn squash on herbed white bean mash with chili, mint and pistachio butter', tags: ['gf'] }
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
        { name: 'Grilled Grass Fed Steak', description: 'With tomatoes, pistachios, cumin, scallions, slow roasted sweet potato and chimichurri', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Grilled Cheese Sandwich', description: 'On artisan bread with tomato soup', tags: ['v'] },
      dinner: [
        { name: 'Roasted Beet & Pistachio Salad', description: 'With horseradish crème fraîche and gently poached spring chicken', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Crispy Brussels Sprouts', description: 'With pesto mac and cheese', tags: ['v'] },
      dinner: [
        { name: 'Veal and Chicken Cannelloni', description: 'With bechamel sauce and truffle' }
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
      lunch: { name: 'Grilled Zucchini Salad', description: 'With lemon-herb vinaigrette, smoky cauliflower steaks and beet salad', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Duck Confit', description: 'With roasted potatoes and raw asparagus salad with walnuts and parmesan', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Salmon Carpaccio', description: 'With sourdough crackers, blistered padrón peppers and beet salad', tags: ['gf'] },
      dinner: [
        { name: 'Porchetta', description: 'With sweet apple glaze, parsnip puree and fennel apple slaw', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Mandarin Fennel Burrata Salad', description: 'With gentle poached cod and white beans', tags: ['gf'] },
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
        { name: 'Lomo Saltado', description: 'Peruvian sirloin beef cubes with stir fried tomatoes and french fries', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Fig Carpaccio', description: 'With pine nuts, blue cheese, arugula, duck prosciutto, lemon and artisan bread', tags: ['gf'] },
      dinner: [
        { name: 'Bangers and Mash', description: 'Local beef sausage, mashed potatoes and rich gravy', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Portuguese Octopus Salad', description: 'Salada de Polvo with olive oil, potatoes, fresh herbs, tomatoes and cucumber', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Portuguese Carne Assada', description: 'Traditional Azorean braised beef with small red potatoes, chouriço and onions', tags: ['gf', 'df'] }
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
        { name: 'Beef Wellington', description: 'With gravy, smashed potatoes and roasted carrots' }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Bavarian Pretzel', description: 'With housemade sauerkraut, mustard, bratwurst and German potato salad' },
      dinner: [
        { name: 'Veal Vienna Schnitzel', description: 'With spätzle and gravy' }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Italian Panini', description: 'Roasted bell peppers, eggplant, goat cheese and zesty basil pesto', tags: ['v'] },
      dinner: [
        { name: 'Chicken Piccata', description: 'Sautéed in bright lemon-white wine butter sauce, fried capers, fresh parsley over angel hair pasta' }
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
      lunch: { name: 'Crispy Potato Wedges', description: 'With whipped pesto feta, slow roasted salmon and green olive chutney', tags: ['gf'] },
      dinner: [
        { name: '24 Hour Adobo Crispy Pork Belly', description: 'With fried basil and steamed rice', tags: ['gf', 'df'] }
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
        { name: 'Eggplant Parmesan', description: 'With balsamic roasted brussels sprouts, panzanella salad and artisan bread', tags: ['v'] }
      ],
      dessert: null
    }
  ]
};

export const allMenus: WeekMenu[] = [week1, week2]; // Additional weeks can be added

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
