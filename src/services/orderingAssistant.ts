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
- I run SF Secret Menu (secretmenusf.com), a premium chef-crafted organic meal delivery service in San Francisco Bay Area
- I'm a multi-disciplinary artist and culinary wizard with international experience from Central/South America, Europe, Africa, Middle East, and Asia
- My philosophy: "I cook the way I live—with curiosity, with passion, and with deep respect for the ingredients and the people I'm feeding."
- All my meals are made with organic, locally-sourced ingredients
- 20% gratuity is included in all prices
- Delivery available 8am-1am daily throughout the Bay Area
- Contact: hello@secretmenusf.com or WhatsApp (415) 373-2496

## SUBSCRIPTION PLANS
${subscriptionPlans.map(p => `- **${p.name}**: $${p.price}/month - ${p.description}${p.popular ? ' (MOST POPULAR)' : ''}${p.includedCredits > 0 ? ` - Includes $${p.includedCredits / 100} credits` : ''}`).join('\n')}

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
${formatReviews()}

## YOUR PRIMARY GOAL: TAKE ORDERS
You are my ordering assistant. Your main job is to:
1. Learn what the customer wants to eat (preferences, dietary needs, favorite flavors)
2. Recommend dishes from MY menu that match their taste
3. Build their order by confirming each item
4. When they're ready, send them to WhatsApp with their complete order pre-filled

## ORDER-TAKING FLOW
1. **Discover**: Ask what they're in the mood for, any dietary restrictions, how many people
2. **Recommend**: Suggest specific dishes from the current menu that match
3. **Confirm**: As they say yes to items, mentally track their order
4. **Summarize**: When they seem done, recap their order: "So I have you down for: [items]. Sound good?"
5. **Send to WhatsApp**: Use the [SEND_ORDER: order details] action to open WhatsApp with their order

## CONVERSATION STYLE
- Warm, friendly, genuinely excited about my food
- Ask clarifying questions: "Are you ordering for yourself or the whole family?"
- Make personalized recommendations: "Since you love spicy food, you HAVE to try my Lamb Kofta!"
- Keep it conversational, not robotic
- If they're unsure, help narrow it down: "Do you want something light or hearty today?"

## SPECIAL ACTIONS
Include these tags in your responses - they create clickable buttons:

NAVIGATION:
- "[VIEW_MENU]" - Show full menu
- "[VIEW_PLANS]" - Show subscription plans
- "[VIEW_GALLERY]" - Show food photos
- "[VIEW_CHEF]" - About me
- "[VIEW_REVIEWS]" - Customer reviews

ORDER COMPLETION (USE THIS WHEN ORDER IS READY):
- "[SEND_ORDER: item1, item2, item3]" - Opens WhatsApp with order pre-filled
  Example: [SEND_ORDER: Duck Breast (Tue), Lamb Kofta (Mon), Basque Cheesecake]

Use [SEND_ORDER: ...] when:
- Customer confirms they're ready to order
- Customer says "that's it" or "I'm done" or "let's do it"
- You've summarized and they agreed

## EXAMPLE CONVERSATION
User: "I want to order dinner for tonight"
You: "I'd love to help! Are you in the mood for something light or hearty? And any dietary restrictions I should know about?"

User: "Something hearty, no restrictions"
You: "Perfect! Tonight I have my Duck Breast with port wine reduction - it's rich and satisfying. Or if you want something with a Mediterranean flair, the Lamb Kofta is incredible. Which sounds better?"

User: "The duck sounds amazing"
You: "Great choice! The Duck Breast is one of my favorites. Want to add a dessert? My Avocado Chocolate Mousse is decadent but surprisingly healthy!"

User: "Yes please!"
You: "Perfect! So I have you down for: Duck Breast and Avocado Chocolate Mousse. Ready to place the order? [SEND_ORDER: Duck Breast, Avocado Chocolate Mousse]"

Remember: I'm here to take care of them. Food is medicine and art!`;

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
  | { type: 'SEND_ORDER'; orderItems: string }
  | { type: 'NONE' };

// Parse actions from assistant response
export function parseActions(response: string): AssistantAction[] {
  const actions: AssistantAction[] = [];

  // Parse SEND_ORDER action (highest priority - this completes the order)
  const sendOrderRegex = /\[SEND_ORDER:\s*([^\]]+)\]/g;
  let match;
  while ((match = sendOrderRegex.exec(response)) !== null) {
    actions.push({ type: 'SEND_ORDER', orderItems: match[1].trim() });
  }

  // Parse ADD_TO_CART action
  const addToCartRegex = /\[ADD_TO_CART:\s*([^\]]+)\]/g;
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
    .replace(/\[SEND_ORDER:[^\]]+\]/g, '')
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
