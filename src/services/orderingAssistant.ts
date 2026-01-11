/**
 * SF Secret Menu - AI Ordering Assistant
 *
 * Provides intelligent ordering assistance:
 * - Menu recommendations based on preferences
 * - Dietary restriction awareness
 * - Order building and editing
 * - Information about chef, service, pricing
 * - WhatsApp order completion guidance
 */

import { hanzoGateway, type ChatMessage } from './hanzoGateway';
import { allMenus, getCurrentWeekMenu, dietaryInfo, type WeekMenu, type MenuItem } from '@/data/menus';
import { subscriptionPlans, planBenefits } from '@/data/plans';
import { reviews } from '@/data/reviews';

// System prompt - Speaking as Chef Antje directly
const ORDERING_ASSISTANT_SYSTEM_PROMPT = `You are Chef Antje, the creator and heart behind SF Secret Menu. You speak in first person as the chef herself - warm, passionate about food, and personally invested in helping customers find the perfect meals.

## ABOUT ME AND MY SERVICE
- I run SF Secret Menu, a premium chef-crafted organic meal delivery service in San Francisco
- I'm a multi-disciplinary artist and culinary wizard with international experience from Central/South America, Europe, Africa, Middle East, and Asia
- My philosophy: "I cook the way I live—with curiosity, with passion, and with deep respect for the ingredients and the people I'm feeding."
- All my meals are made with organic, locally-sourced ingredients
- 20% gratuity is included in all prices

## SUBSCRIPTION PLANS
${subscriptionPlans.map(p => `- **${p.name}**: $${p.price}/month - ${p.mealsPerWeek} meals/week${p.popular ? ' (MOST POPULAR)' : ''}`).join('\n')}

Plan Benefits:
${planBenefits.map(b => `- ${b}`).join('\n')}

## DIETARY OPTIONS
All dietary modifications are available at no extra charge:
- GF: Gluten-Free
- DF: Dairy-Free
- V: Vegetarian
- VG: Vegan

## CURRENT WEEK MENU
${formatCurrentMenu()}

## UPCOMING MENUS
${formatUpcomingMenus()}

## WHAT MY MEMBERS SAY
My members have been so kind! Here's what they're saying:
${formatReviews()}

## WHAT I CAN HELP WITH
1. **Recommend my dishes** based on your taste preferences, dietary needs, or mood
2. **Explain my menu items** - ingredients, how I prepare them, dietary tags
3. **Help build your order** - suggest complete meals, weekly selections
4. **Answer questions** about my service, background, delivery, pricing
5. **Guide you to order** via WhatsApp at (415) 373-2496 - you can reach me directly there!

## MY CONVERSATION STYLE
- I'm warm, genuinely enthusiastic about food, and personally invested in your experience
- When recommending dishes, I explain WHY I think you'd enjoy them
- If you have dietary restrictions, I proactively highlight my suitable options
- I keep responses concise but informative
- I might share a personal story about a dish if relevant
- If something goes wrong or I can't help, I direct you to reach me on WhatsApp

## SPECIAL ACTIONS
Include these action tags in your responses when appropriate - they create clickable buttons:

NAVIGATION ACTIONS:
- "[VIEW_MENU]" - Show full menu page
- "[VIEW_PLANS]" - Show subscription/pricing plans
- "[START_ORDER]" - Go to order/entry page to start ordering
- "[VIEW_GALLERY]" - Show food gallery photos
- "[VIEW_CHEF]" - Learn about Chef Antje
- "[VIEW_REVIEWS]" - See customer testimonials

ORDER ACTIONS:
- "[ADD_TO_CART: Item Name]" - When they confirm they want something
- "[CONTACT_WHATSAPP]" - Ready to complete order or need human help

Use these actions naturally in conversation:
- User asks "show me the menu" → include [VIEW_MENU]
- User wants to start ordering → include [START_ORDER]
- User asks about pricing → include [VIEW_PLANS]
- User asks about the chef → include [VIEW_CHEF]
- User wants to see food photos → include [VIEW_GALLERY]
- User wants to read reviews → include [VIEW_REVIEWS]
- User is ready to order → include [CONTACT_WHATSAPP]

## ORDERING FLOW
1. Help them explore my menu and make selections
2. Build their ideal meal plan based on their preferences
3. When ready, direct them to WhatsApp: "Ready to order? Send me your selections on WhatsApp at (415) 373-2496 - I'd love to hear from you!"

Remember: I'm here to make their culinary journey delightful. For me, food is medicine and art!`;

function formatCurrentMenu(): string {
  const current = getCurrentWeekMenu();
  let result = `**${current.theme}** (${formatDateRange(current.startDate, current.endDate)})\n`;

  current.days.forEach(day => {
    result += `\n${day.day}:\n`;
    result += `  Lunch: ${day.lunch.name}${day.lunch.tags ? ` [${day.lunch.tags.join(', ')}]` : ''}\n`;
    day.dinner.forEach(d => {
      result += `  Dinner: ${d.name}${d.tags ? ` [${d.tags.join(', ')}]` : ''}\n`;
    });
    if (day.dessert) {
      result += `  Dessert: ${day.dessert.name}${day.dessert.tags ? ` [${day.dessert.tags.join(', ')}]` : ''}\n`;
    }
  });

  return result;
}

function formatUpcomingMenus(): string {
  return allMenus.slice(0, 4).map(menu =>
    `- **${menu.theme}**: ${formatDateRange(menu.startDate, menu.endDate)}`
  ).join('\n');
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${s.toLocaleDateString('en-US', opts)} - ${e.toLocaleDateString('en-US', opts)}`;
}

function formatReviews(): string {
  return reviews.slice(0, 4).map(review =>
    `- **${review.name}** (${review.rating}★): "${review.text}"${review.mealsOrdered ? ` - Ordered: ${review.mealsOrdered.join(', ')}` : ''}`
  ).join('\n');
}

// Action types that the assistant can suggest
export type AssistantAction =
  | { type: 'ADD_TO_CART'; item: string; mealType?: string }
  | { type: 'VIEW_MENU' }
  | { type: 'VIEW_PLANS' }
  | { type: 'CONTACT_WHATSAPP' }
  | { type: 'START_ORDER' }
  | { type: 'VIEW_GALLERY' }
  | { type: 'VIEW_CHEF' }
  | { type: 'VIEW_REVIEWS' }
  | { type: 'NONE' };

// Parse actions from assistant response
export function parseActions(response: string): AssistantAction[] {
  const actions: AssistantAction[] = [];

  const addToCartRegex = /\[ADD_TO_CART:\s*([^\]]+)\]/g;
  let match;
  while ((match = addToCartRegex.exec(response)) !== null) {
    actions.push({ type: 'ADD_TO_CART', item: match[1].trim() });
  }

  if (response.includes('[VIEW_MENU]')) {
    actions.push({ type: 'VIEW_MENU' });
  }

  if (response.includes('[VIEW_PLANS]')) {
    actions.push({ type: 'VIEW_PLANS' });
  }

  if (response.includes('[CONTACT_WHATSAPP]')) {
    actions.push({ type: 'CONTACT_WHATSAPP' });
  }

  if (response.includes('[START_ORDER]')) {
    actions.push({ type: 'START_ORDER' });
  }

  if (response.includes('[VIEW_GALLERY]')) {
    actions.push({ type: 'VIEW_GALLERY' });
  }

  if (response.includes('[VIEW_CHEF]')) {
    actions.push({ type: 'VIEW_CHEF' });
  }

  if (response.includes('[VIEW_REVIEWS]')) {
    actions.push({ type: 'VIEW_REVIEWS' });
  }

  return actions.length > 0 ? actions : [{ type: 'NONE' }];
}

// Clean response by removing action tags
export function cleanResponse(response: string): string {
  return response
    .replace(/\[ADD_TO_CART:[^\]]+\]/g, '')
    .replace(/\[VIEW_MENU\]/g, '')
    .replace(/\[VIEW_PLANS\]/g, '')
    .replace(/\[CONTACT_WHATSAPP\]/g, '')
    .replace(/\[START_ORDER\]/g, '')
    .replace(/\[VIEW_GALLERY\]/g, '')
    .replace(/\[VIEW_CHEF\]/g, '')
    .replace(/\[VIEW_REVIEWS\]/g, '')
    .trim();
}

// Message interface for chat
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: AssistantAction[];
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Ordering Assistant class
class OrderingAssistantService {
  private conversationHistory: ChatMessage[] = [];

  /**
   * Send a message and get streaming response
   */
  async *chat(
    userMessage: string,
    signal?: AbortSignal
  ): AsyncGenerator<string, void, unknown> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    let fullResponse = '';

    try {
      for await (const chunk of hanzoGateway.chatStream(userMessage, {
        systemPrompt: ORDERING_ASSISTANT_SYSTEM_PROMPT,
        conversationHistory: this.conversationHistory.slice(-10), // Keep last 10 messages
        temperature: 0.7,
        maxTokens: 1024,
        signal,
      })) {
        fullResponse += chunk;
        yield chunk;
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: fullResponse,
      });
    } catch (error) {
      // Remove user message if there was an error
      this.conversationHistory.pop();
      throw error;
    }
  }

  /**
   * Send a message and get complete response (non-streaming)
   */
  async sendMessage(userMessage: string): Promise<{ content: string; actions: AssistantAction[] }> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    try {
      const response = await hanzoGateway.chat(userMessage, {
        systemPrompt: ORDERING_ASSISTANT_SYSTEM_PROMPT,
        conversationHistory: this.conversationHistory.slice(-10),
        temperature: 0.7,
        maxTokens: 1024,
      });

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
      });

      const actions = parseActions(response);
      const cleanedContent = cleanResponse(response);

      return { content: cleanedContent, actions };
    } catch (error) {
      // Remove user message if there was an error
      this.conversationHistory.pop();
      throw error;
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history for display
   */
  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Quick suggestions for starting conversation
   */
  getQuickSuggestions(): string[] {
    return [
      "What's on the menu this week?",
      "I'm vegetarian, what do you recommend?",
      "Tell me about the chef",
      "What are the subscription plans?",
      "I want something gluten-free",
      "Help me build a weekly meal plan",
    ];
  }
}

// Export singleton instance
export const orderingAssistant = new OrderingAssistantService();

// Export for testing/custom instances
export { OrderingAssistantService };
