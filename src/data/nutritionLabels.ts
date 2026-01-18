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

// Sample nutrition labels for key dishes - matching gallery items
export const nutritionLabels: NutritionLabels = {
  "Seared Duck Breast": {
    dishName: "Seared Duck Breast",
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
    allergens: [],
    certifications: ["Organic", "Pasture-Raised", "Non-GMO"]
  },
  "Albóndigas": {
    dishName: "Albóndigas",
    ingredients: [
      "grass-fed beef", "ground pork", "onion", "garlic", "tomato sauce", 
      "manchego cheese", "Spanish paprika", "herbs"
    ],
    nutrition: {
      calories: 425,
      protein: 32,
      carbs: 18,
      fat: 26,
      fiber: 3,
      sodium: 720,
      sugar: 6,
      servingSize: "6 meatballs (300g)",
      servings: 1
    },
    health: {
      healthScore: 7,
      benefits: ["Complete protein", "Rich in zinc", "Traditional Spanish recipe", "Satisfying comfort food"],
      considerations: ["Contains dairy", "Moderate sodium"],
      dietaryHighlights: ["High protein", "Gluten-free", "Mediterranean"]
    },
    allergens: ["dairy"],
    certifications: ["Organic", "Grass-Fed", "Non-GMO"]
  },
  "Golden Sweet Potato Gnocchi": {
    dishName: "Golden Sweet Potato Gnocchi",
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
      dietaryHighlights: ["Vegetarian", "High fiber", "House-made"]
    },
    allergens: ["gluten", "dairy", "eggs", "tree nuts"],
    certifications: ["Organic", "Local", "House-made"]
  },
  "Zucchini Carpaccio": {
    dishName: "Zucchini Carpaccio",
    ingredients: [
      "organic zucchini", "pine nuts", "fresh mint", "lemon", 
      "extra virgin olive oil", "sea salt", "black pepper"
    ],
    nutrition: {
      calories: 145,
      protein: 4,
      carbs: 8,
      fat: 12,
      fiber: 3,
      sodium: 85,
      sugar: 4,
      servingSize: "1 plate (200g)",
      servings: 1
    },
    health: {
      healthScore: 9,
      benefits: ["Low calorie", "High in antioxidants", "Heart-healthy fats", "Refreshing and light"],
      considerations: ["Tree nuts"],
      dietaryHighlights: ["Vegan", "Gluten-free", "Dairy-free", "Raw"]
    },
    allergens: ["tree nuts"],
    certifications: ["Organic", "Vegan", "Raw", "Non-GMO"]
  },
  "Miso Glazed Cod": {
    dishName: "Miso Glazed Cod",
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
  "Chicken Piccata": {
    dishName: "Chicken Piccata",
    ingredients: [
      "organic chicken breast", "flour", "white wine", "lemon", "butter", 
      "capers", "angel hair pasta", "parsley", "olive oil"
    ],
    nutrition: {
      calories: 485,
      protein: 38,
      carbs: 35,
      fat: 22,
      fiber: 2,
      sodium: 650,
      sugar: 3,
      servingSize: "1 plate (350g)",
      servings: 1
    },
    health: {
      healthScore: 7,
      benefits: ["High protein", "Classic Italian flavors", "Good source of B vitamins"],
      considerations: ["Contains gluten", "Moderate calorie content"],
      dietaryHighlights: ["High protein", "Traditional Italian"]
    },
    allergens: ["gluten", "dairy"],
    certifications: ["Organic", "Free-Range"]
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
      dietaryHighlights: ["Gluten-free", "Crustless", "Vegetarian"]
    },
    allergens: ["dairy", "eggs"],
    certifications: ["Organic", "Local Dairy"]
  },
  "Crab Cakes": {
    dishName: "Crab Cakes",
    ingredients: [
      "fresh Dungeness crab", "panko breadcrumbs", "mayonnaise", 
      "dijon mustard", "asparagus", "corn", "lemon", "herbs"
    ],
    nutrition: {
      calories: 385,
      protein: 28,
      carbs: 18,
      fat: 24,
      fiber: 4,
      sodium: 680,
      sugar: 4,
      servingSize: "2 cakes (280g)",
      servings: 1
    },
    health: {
      healthScore: 8,
      benefits: ["High protein", "Rich in minerals", "Sustainable seafood", "Omega-3 fatty acids"],
      considerations: ["Higher sodium", "Contains shellfish"],
      dietaryHighlights: ["High protein", "Seafood", "Gluten-free option available"]
    },
    allergens: ["shellfish", "eggs"],
    certifications: ["Sustainable", "Wild-Caught", "Local"]
  },
  "Spanish Gildas": {
    dishName: "Spanish Gildas",
    ingredients: [
      "Spanish anchovies", "Manzanilla olives", "Guindilla peppers", 
      "extra virgin olive oil"
    ],
    nutrition: {
      calories: 45,
      protein: 3,
      carbs: 1,
      fat: 4,
      fiber: 0,
      sodium: 420,
      sugar: 0,
      servingSize: "3 pieces (30g)",
      servings: 1
    },
    health: {
      healthScore: 8,
      benefits: ["Heart-healthy omega-3s", "Authentic Spanish flavors", "Low calorie", "Rich in healthy fats"],
      considerations: ["High sodium", "Strong flavors"],
      dietaryHighlights: ["Gluten-free", "Dairy-free", "Keto-friendly", "Traditional"]
    },
    allergens: ["fish"],
    certifications: ["Traditional Spanish", "Sustainable"]
  },
  "Butternut Squash Soup": {
    dishName: "Butternut Squash Soup",
    ingredients: [
      "roasted butternut squash", "coconut cream", "onion", "ginger", 
      "nutmeg", "sage", "vegetable broth", "olive oil"
    ],
    nutrition: {
      calories: 185,
      protein: 4,
      carbs: 28,
      fat: 8,
      fiber: 6,
      sodium: 480,
      sugar: 8,
      servingSize: "1 bowl (300ml)",
      servings: 1
    },
    health: {
      healthScore: 9,
      benefits: ["High in vitamin A", "Anti-inflammatory", "Fiber-rich", "Warming spices"],
      considerations: [],
      dietaryHighlights: ["Vegan", "Gluten-free", "Dairy-free", "Comfort food"]
    },
    allergens: [],
    certifications: ["Organic", "Vegan", "Local"]
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
