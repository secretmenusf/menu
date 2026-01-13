/**
 * Nutrition Labels for SF Secret Menu
 *
 * Each dish has:
 * - Estimated ingredients (organic, locally-sourced)
 * - Full nutrition facts
 * - Health score (1-10)
 * - Benefits, considerations, allergens
 * - Certifications (Organic, Non-GMO, etc.)
 *
 * To regenerate with AI: npx tsx scripts/generateNutrition.ts
 */

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sodium: number; // mg
  sugar: number; // grams
  servingSize: string;
  servings: number;
}

export interface HealthInfo {
  healthScore: number; // 1-10
  benefits: string[];
  considerations: string[];
  dietaryHighlights: string[];
}

export interface NutritionLabel {
  dishName: string;
  ingredients: string[];
  nutrition: NutritionInfo;
  health: HealthInfo;
  allergens: string[];
  certifications: string[]; // organic, non-gmo, etc
}

export type NutritionLabels = Record<string, NutritionLabel>;

// Sample nutrition labels for key dishes
export const nutritionLabels: NutritionLabels = {
  "Duck Breast": {
    dishName: "Duck Breast",
    ingredients: [
      "organic duck breast", "port wine", "shallots", "thyme", "butter",
      "heirloom carrots", "olive oil", "sea salt", "black pepper"
    ],
    nutrition: {
      calories: 485,
      protein: 38,
      carbs: 18,
      fat: 28,
      fiber: 4,
      sodium: 580,
      sugar: 8,
      servingSize: "1 plate (320g)",
      servings: 1
    },
    health: {
      healthScore: 8,
      benefits: ["High protein", "Rich in iron", "Good source of B vitamins", "Anti-inflammatory omega-3s"],
      considerations: ["Higher in saturated fat"],
      dietaryHighlights: ["Gluten-free", "Keto-friendly", "Paleo-approved"]
    },
    allergens: ["dairy"],
    certifications: ["Organic", "Pasture-Raised", "Non-GMO"]
  },
  "Lamb Kofta": {
    dishName: "Lamb Kofta",
    ingredients: [
      "grass-fed lamb", "cumin", "coriander", "mint", "garlic", "onion",
      "organic cucumber", "Greek yogurt", "tahini", "flatbread"
    ],
    nutrition: {
      calories: 520,
      protein: 35,
      carbs: 32,
      fat: 28,
      fiber: 5,
      sodium: 720,
      sugar: 6,
      servingSize: "1 plate (380g)",
      servings: 1
    },
    health: {
      healthScore: 7,
      benefits: ["Complete protein", "Probiotic yogurt", "Mediterranean spices", "Anti-inflammatory"],
      considerations: ["Contains gluten (flatbread)", "Moderate sodium"],
      dietaryHighlights: ["High protein", "Mediterranean diet"]
    },
    allergens: ["gluten", "dairy"],
    certifications: ["Organic", "Grass-Fed", "Non-GMO"]
  },
  "Sweet Potato Gnocchi": {
    dishName: "Sweet Potato Gnocchi",
    ingredients: [
      "organic sweet potato", "flour", "egg", "sage", "brown butter",
      "walnuts", "parmesan", "nutmeg", "sea salt"
    ],
    nutrition: {
      calories: 445,
      protein: 12,
      carbs: 52,
      fat: 22,
      fiber: 6,
      sodium: 480,
      sugar: 8,
      servingSize: "1 plate (300g)",
      servings: 1
    },
    health: {
      healthScore: 7,
      benefits: ["Complex carbohydrates", "Rich in vitamin A", "Brain-healthy walnuts", "Good fiber"],
      considerations: ["Contains gluten", "Higher carb content"],
      dietaryHighlights: ["Vegetarian", "High fiber"]
    },
    allergens: ["gluten", "dairy", "eggs", "tree nuts"],
    certifications: ["Organic", "Local"]
  },
  "Avocado Chocolate Mousse": {
    dishName: "Avocado Chocolate Mousse",
    ingredients: [
      "organic avocado", "raw cacao", "maple syrup", "coconut cream",
      "vanilla extract", "sea salt", "cacao nibs"
    ],
    nutrition: {
      calories: 285,
      protein: 4,
      carbs: 28,
      fat: 20,
      fiber: 8,
      sodium: 45,
      sugar: 16,
      servingSize: "1 cup (150g)",
      servings: 1
    },
    health: {
      healthScore: 9,
      benefits: ["Heart-healthy fats", "Antioxidant-rich cacao", "Natural sweetener", "High fiber"],
      considerations: ["Natural sugars from maple"],
      dietaryHighlights: ["Vegan", "Gluten-free", "Dairy-free", "Raw"]
    },
    allergens: [],
    certifications: ["Organic", "Vegan", "Raw", "Non-GMO"]
  },
  "Nobu-Inspired Miso Glazed Cod": {
    dishName: "Nobu-Inspired Miso Glazed Cod",
    ingredients: [
      "wild-caught black cod", "white miso", "mirin", "sake", "bok choy",
      "jasmine rice", "ginger", "scallions", "sesame oil"
    ],
    nutrition: {
      calories: 425,
      protein: 32,
      carbs: 38,
      fat: 16,
      fiber: 3,
      sodium: 890,
      sugar: 12,
      servingSize: "1 plate (350g)",
      servings: 1
    },
    health: {
      healthScore: 8,
      benefits: ["Omega-3 fatty acids", "High-quality protein", "Fermented miso benefits", "Low saturated fat"],
      considerations: ["Higher sodium from miso"],
      dietaryHighlights: ["Gluten-free", "Dairy-free", "Japanese-inspired"]
    },
    allergens: ["fish", "soy"],
    certifications: ["Wild-Caught", "Sustainable", "Non-GMO"]
  },
  "Animal Style Smash": {
    dishName: "Animal Style Smash",
    ingredients: [
      "grass-fed beef patties", "American cheese", "butter lettuce", "tomato",
      "caramelized onions", "pickles", "special sauce", "brioche bun"
    ],
    nutrition: {
      calories: 720,
      protein: 42,
      carbs: 38,
      fat: 48,
      fiber: 3,
      sodium: 1150,
      sugar: 8,
      servingSize: "1 burger (280g)",
      servings: 1
    },
    health: {
      healthScore: 5,
      benefits: ["High protein", "Iron-rich beef", "Grass-fed omega balance"],
      considerations: ["High saturated fat", "Higher sodium", "Indulgent treat"],
      dietaryHighlights: ["Grass-fed", "Indulgent"]
    },
    allergens: ["gluten", "dairy", "eggs"],
    certifications: ["Grass-Fed", "Local Beef"]
  },
  "Greek Lentil Soup": {
    dishName: "Greek Lentil Soup",
    ingredients: [
      "organic green lentils", "carrots", "celery", "onion", "garlic",
      "bay leaf", "olive oil", "red wine vinegar", "sourdough bread"
    ],
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 45,
      fat: 8,
      fiber: 16,
      sodium: 580,
      sugar: 6,
      servingSize: "1 bowl (400g)",
      servings: 1
    },
    health: {
      healthScore: 9,
      benefits: ["Plant protein powerhouse", "Excellent fiber", "Heart-healthy", "Blood sugar friendly"],
      considerations: ["Contains gluten (bread)"],
      dietaryHighlights: ["Vegan", "High fiber", "Mediterranean"]
    },
    allergens: ["gluten"],
    certifications: ["Organic", "Vegan", "Non-GMO"]
  },
  "Basque Burnt Cheesecake": {
    dishName: "Basque Burnt Cheesecake",
    ingredients: [
      "organic cream cheese", "heavy cream", "eggs", "sugar",
      "vanilla bean", "sea salt"
    ],
    nutrition: {
      calories: 380,
      protein: 7,
      carbs: 28,
      fat: 28,
      fiber: 0,
      sodium: 320,
      sugar: 24,
      servingSize: "1 slice (120g)",
      servings: 1
    },
    health: {
      healthScore: 4,
      benefits: ["Naturally gluten-free", "Rich in calcium", "Protein from eggs/cheese"],
      considerations: ["High sugar", "High saturated fat", "Special occasion treat"],
      dietaryHighlights: ["Gluten-free", "Crustless"]
    },
    allergens: ["dairy", "eggs"],
    certifications: ["Organic", "Local Dairy"]
  },
  "Branzino en Papillote": {
    dishName: "Branzino en Papillote",
    ingredients: [
      "Mediterranean sea bass", "cherry tomatoes", "kalamata olives",
      "capers", "fresh herbs", "lemon", "olive oil", "white wine"
    ],
    nutrition: {
      calories: 365,
      protein: 38,
      carbs: 12,
      fat: 18,
      fiber: 3,
      sodium: 620,
      sugar: 4,
      servingSize: "1 whole fish (320g)",
      servings: 1
    },
    health: {
      healthScore: 9,
      benefits: ["Lean protein", "Omega-3 fatty acids", "Heart-healthy Mediterranean", "Low calorie"],
      considerations: ["Contains alcohol (cooked off)"],
      dietaryHighlights: ["Gluten-free", "Dairy-free", "Paleo", "Mediterranean"]
    },
    allergens: ["fish"],
    certifications: ["Wild-Caught", "Sustainable", "Mediterranean"]
  },
  "Falafel Bowl": {
    dishName: "Falafel Bowl",
    ingredients: [
      "organic chickpeas", "fresh herbs", "garlic", "onion", "tahini",
      "hummus", "tabbouleh", "pickled turnips", "olive oil"
    ],
    nutrition: {
      calories: 485,
      protein: 16,
      carbs: 52,
      fat: 24,
      fiber: 14,
      sodium: 680,
      sugar: 6,
      servingSize: "1 bowl (380g)",
      servings: 1
    },
    health: {
      healthScore: 9,
      benefits: ["Plant-based protein", "High fiber", "Healthy fats", "Probiotic pickles"],
      considerations: [],
      dietaryHighlights: ["Vegan", "High fiber", "Plant-based", "Mediterranean"]
    },
    allergens: ["sesame"],
    certifications: ["Organic", "Vegan", "Non-GMO"]
  },
  "Sol Set": {
    dishName: "Sol Set",
    ingredients: [
      "recycled nylon", "spandex", "eco-friendly dyes"
    ],
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
      sugar: 0,
      servingSize: "1 set",
      servings: 1
    },
    health: {
      healthScore: 10,
      benefits: ["Sustainable materials", "UPF 50+ sun protection", "Eco-conscious fashion"],
      considerations: [],
      dietaryHighlights: ["Sustainable", "Brazilian-made", "Recycled materials"]
    },
    allergens: [],
    certifications: ["Sustainable", "Recycled", "UPF 50+"]
  },
  "Classic Hummus (Pint)": {
    dishName: "Classic Hummus (Pint)",
    ingredients: [
      "organic chickpeas", "tahini", "lemon juice", "garlic",
      "olive oil", "cumin", "sea salt"
    ],
    nutrition: {
      calories: 180,
      protein: 6,
      carbs: 16,
      fat: 12,
      fiber: 4,
      sodium: 280,
      sugar: 1,
      servingSize: "1/4 cup (60g)",
      servings: 8
    },
    health: {
      healthScore: 9,
      benefits: ["Plant protein", "Healthy fats", "Blood sugar friendly", "Heart healthy"],
      considerations: [],
      dietaryHighlights: ["Vegan", "Gluten-free", "High fiber"]
    },
    allergens: ["sesame"],
    certifications: ["Organic", "Vegan", "Non-GMO"]
  }
};

/**
 * Get nutrition label by dish name
 */
export function getNutritionLabel(name: string): NutritionLabel | undefined {
  return nutritionLabels[name];
}

/**
 * Get dishes by health score threshold
 */
export function getHealthyDishes(minScore: number = 7): NutritionLabel[] {
  return Object.values(nutritionLabels).filter((l) => l.health.healthScore >= minScore);
}

/**
 * Get dishes by calorie range
 */
export function getDishesByCalories(min: number, max: number): NutritionLabel[] {
  return Object.values(nutritionLabels).filter(
    (l) => l.nutrition.calories >= min && l.nutrition.calories <= max
  );
}

/**
 * Get dishes without specific allergen
 */
export function getAllergenFreeDishes(allergen: string): NutritionLabel[] {
  const lowerAllergen = allergen.toLowerCase();
  return Object.values(nutritionLabels).filter(
    (l) => !l.allergens.some((a) => a.toLowerCase().includes(lowerAllergen))
  );
}

export default nutritionLabels;
