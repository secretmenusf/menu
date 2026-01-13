#!/usr/bin/env npx tsx
/**
 * generateNutrition.ts
 *
 * Generates nutrition labels for all menu items using Hanzo Gateway AI.
 * Usage: npx tsx scripts/generateNutrition.ts
 */

import { allMenus, type MenuItem, type WeekMenu, type DayMenu } from '../src/data/menus';
import { SECRET_SECRET_MENU, type SecretMenuItem } from '../src/data/secretSecretMenu';
import * as fs from 'fs';
import * as path from 'path';

// Types for nutrition data
interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  servingSize: string;
  servings: number;
}

interface HealthInfo {
  healthScore: number;
  benefits: string[];
  considerations: string[];
  dietaryHighlights: string[];
}

interface NutritionLabel {
  name: string;
  description: string;
  ingredients: string[];
  nutrition: NutritionFacts;
  health: HealthInfo;
  allergens: string[];
  certifications: string[];
  source: 'menu' | 'secret';
  generatedAt: string;
}

interface DishInput {
  name: string;
  description: string;
  source: 'menu' | 'secret';
}

// Configuration
const HANZO_GATEWAY_URL = 'https://gateway.hanzo.ai/v1/chat/completions';
const MODEL = 'llama3.3-70b-instruct';
const BATCH_SIZE = 10;
const OUTPUT_PATH = path.join(__dirname, '../src/data/nutritionLabels.generated.ts');

// Get API key from environment
const API_KEY = process.env.HANZO_API_KEY || process.env.OPENAI_API_KEY;

if (!API_KEY) {
  console.error('Error: HANZO_API_KEY or OPENAI_API_KEY environment variable required');
  process.exit(1);
}

/**
 * Extract all dishes from weekly menus
 */
function extractMenuDishes(): DishInput[] {
  const dishes: DishInput[] = [];
  const seen = new Set<string>();

  for (const week of allMenus) {
    for (const day of week.days) {
      // Lunch
      if (day.lunch && !seen.has(day.lunch.name)) {
        seen.add(day.lunch.name);
        dishes.push({
          name: day.lunch.name,
          description: day.lunch.description || '',
          source: 'menu',
        });
      }

      // Dinner items
      for (const dinner of day.dinner) {
        if (!seen.has(dinner.name)) {
          seen.add(dinner.name);
          dishes.push({
            name: dinner.name,
            description: dinner.description || '',
            source: 'menu',
          });
        }
      }

      // Dessert
      if (day.dessert && !seen.has(day.dessert.name)) {
        seen.add(day.dessert.name);
        dishes.push({
          name: day.dessert.name,
          description: day.dessert.description || '',
          source: 'menu',
        });
      }
    }
  }

  return dishes;
}

/**
 * Extract food items from secret menu (excluding services, plants, etc.)
 */
function extractSecretMenuDishes(): DishInput[] {
  const foodCategories = new Set(['burger', 'sides', 'drinks', 'dessert', 'special', 'pantry']);

  return SECRET_SECRET_MENU
    .filter((item) => foodCategories.has(item.category))
    .map((item) => ({
      name: item.name,
      description: item.longDescription || item.description,
      source: 'secret' as const,
    }));
}

/**
 * Build the prompt for nutrition analysis
 */
function buildPrompt(dish: DishInput): string {
  return `You are a professional nutritionist. Analyze this dish and provide nutrition information.

Dish: ${dish.name}
Description: ${dish.description}

Respond ONLY with valid JSON in this exact format (no markdown, no explanation):
{
  "ingredients": ["ingredient1", "ingredient2"],
  "nutrition": {
    "calories": 450,
    "protein": 25,
    "carbs": 35,
    "fat": 20,
    "fiber": 5,
    "sodium": 800,
    "sugar": 8,
    "servingSize": "1 plate (350g)",
    "servings": 1
  },
  "health": {
    "healthScore": 7,
    "benefits": ["high protein", "good fiber"],
    "considerations": ["moderate sodium"],
    "dietaryHighlights": ["gluten-free friendly"]
  },
  "allergens": ["dairy", "nuts"],
  "certifications": ["organic ingredients"]
}`;
}

/**
 * Call Hanzo Gateway API
 */
async function callHanzoAPI(dish: DishInput): Promise<NutritionLabel | null> {
  try {
    const response = await fetch(HANZO_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: buildPrompt(dish),
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error for "${dish.name}": ${response.status} - ${errorText}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error(`No content in response for "${dish.name}"`);
      return null;
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    }
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const parsed = JSON.parse(jsonStr);

    return {
      name: dish.name,
      description: dish.description,
      ingredients: parsed.ingredients || [],
      nutrition: parsed.nutrition || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sodium: 0,
        sugar: 0,
        servingSize: 'Unknown',
        servings: 1,
      },
      health: parsed.health || {
        healthScore: 5,
        benefits: [],
        considerations: [],
        dietaryHighlights: [],
      },
      allergens: parsed.allergens || [],
      certifications: parsed.certifications || [],
      source: dish.source,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Failed to process "${dish.name}":`, error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Process dishes in batches
 */
async function processBatches(dishes: DishInput[]): Promise<NutritionLabel[]> {
  const results: NutritionLabel[] = [];
  const total = dishes.length;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = dishes.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(total / BATCH_SIZE);

    console.log(`Processing batch ${batchNum}/${totalBatches} (${batch.length} dishes)...`);

    const batchResults = await Promise.all(batch.map(callHanzoAPI));

    for (const result of batchResults) {
      if (result) {
        results.push(result);
        console.log(`  [OK] ${result.name}`);
      }
    }

    // Small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < total) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}

/**
 * Generate TypeScript output file
 */
function generateOutputFile(labels: NutritionLabel[]): string {
  const timestamp = new Date().toISOString();

  return `// Auto-generated nutrition labels
// Generated: ${timestamp}
// Model: ${MODEL}
// Total items: ${labels.length}

export interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  servingSize: string;
  servings: number;
}

export interface HealthInfo {
  healthScore: number;
  benefits: string[];
  considerations: string[];
  dietaryHighlights: string[];
}

export interface NutritionLabel {
  name: string;
  description: string;
  ingredients: string[];
  nutrition: NutritionFacts;
  health: HealthInfo;
  allergens: string[];
  certifications: string[];
  source: 'menu' | 'secret';
  generatedAt: string;
}

export const nutritionLabels: Record<string, NutritionLabel> = ${JSON.stringify(
    Object.fromEntries(labels.map((l) => [l.name, l])),
    null,
    2
  )};

/**
 * Get nutrition label by dish name
 */
export function getNutritionLabel(name: string): NutritionLabel | undefined {
  return nutritionLabels[name];
}

/**
 * Get all labels for a source type
 */
export function getLabelsBySource(source: 'menu' | 'secret'): NutritionLabel[] {
  return Object.values(nutritionLabels).filter((l) => l.source === source);
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
`;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  console.log('=== Nutrition Label Generator ===\n');

  // Extract dishes
  console.log('Extracting dishes from menus...');
  const menuDishes = extractMenuDishes();
  console.log(`  Found ${menuDishes.length} unique menu dishes`);

  const secretDishes = extractSecretMenuDishes();
  console.log(`  Found ${secretDishes.length} secret menu food items`);

  const allDishes = [...menuDishes, ...secretDishes];
  console.log(`  Total: ${allDishes.length} dishes to process\n`);

  // Process with AI
  console.log('Generating nutrition labels with AI...\n');
  const labels = await processBatches(allDishes);

  // Report results
  const successRate = ((labels.length / allDishes.length) * 100).toFixed(1);
  console.log(`\nCompleted: ${labels.length}/${allDishes.length} (${successRate}%)`);

  if (labels.length === 0) {
    console.error('No labels generated. Check API key and network connection.');
    process.exit(1);
  }

  // Write output
  console.log(`\nWriting output to ${OUTPUT_PATH}...`);
  const output = generateOutputFile(labels);
  fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');
  console.log('Done!\n');

  // Summary stats
  const avgCalories = Math.round(
    labels.reduce((sum, l) => sum + l.nutrition.calories, 0) / labels.length
  );
  const avgHealthScore = (
    labels.reduce((sum, l) => sum + l.health.healthScore, 0) / labels.length
  ).toFixed(1);

  console.log('=== Summary ===');
  console.log(`  Total labels: ${labels.length}`);
  console.log(`  Menu items: ${labels.filter((l) => l.source === 'menu').length}`);
  console.log(`  Secret menu: ${labels.filter((l) => l.source === 'secret').length}`);
  console.log(`  Avg calories: ${avgCalories}`);
  console.log(`  Avg health score: ${avgHealthScore}/10`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
