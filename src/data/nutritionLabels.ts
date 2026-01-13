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

export const nutritionLabels: NutritionLabels = {};
