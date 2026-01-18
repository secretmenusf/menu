// Enhanced Order Types and Functions for Gallery Menu Items
// Handles the new MenuItem interface with full details

import { MenuItem, getAllOrderableItems, getMenuItemsByTag } from './menus';

export interface OrderItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  selectedModifications?: string[];
  specialInstructions?: string;
  image?: string;
  tags?: ('gf' | 'df' | 'v' | 'vg')[];
}

export interface OrderSummary {
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  gratuity: number;
  total: number;
  estimatedTime: number; // minutes
}

// Convert MenuItem to OrderItem
export function menuItemToOrderItem(menuItem: MenuItem, quantity: number = 1): OrderItem {
  return {
    id: menuItem.id,
    name: menuItem.name,
    description: menuItem.description,
    price: menuItem.price,
    quantity,
    image: menuItem.image,
    tags: menuItem.tags,
  };
}

// Calculate order summary
export function calculateOrderSummary(orderItems: OrderItem[]): OrderSummary {
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 75 ? 0 : 10; // Free delivery over $75
  const gratuity = subtotal * 0.20; // 20% included
  const total = subtotal + delivery + gratuity;
  
  // Estimate preparation time based on item complexity
  const estimatedTime = Math.max(30, orderItems.reduce((maxTime, item) => {
    const menuItem = getAllOrderableItems().find(m => m.id === item.id);
    const itemTime = menuItem?.prepTime || 30;
    return Math.max(maxTime, itemTime);
  }, 0));

  return {
    items: orderItems,
    subtotal,
    delivery,
    gratuity,
    total,
    estimatedTime,
  };
}

// Get featured menu items for homepage/gallery
export function getFeaturedMenuItems(): MenuItem[] {
  return getAllOrderableItems()
    .filter(item => item.price >= 25) // Premium items
    .sort((a, b) => b.price - a.price)
    .slice(0, 12);
}

// Get quick order suggestions
export function getQuickOrderSuggestions(): MenuItem[] {
  const appetizers = getAllOrderableItems().filter(item => item.price <= 18);
  const mains = getAllOrderableItems().filter(item => item.price > 18 && item.price <= 35);
  const desserts = getAllOrderableItems().filter(item => 
    item.name.toLowerCase().includes('chocolate') || 
    item.name.toLowerCase().includes('cake') ||
    item.name.toLowerCase().includes('pudding')
  );
  
  return [
    ...appetizers.slice(0, 3),
    ...mains.slice(0, 3),
    ...desserts.slice(0, 2),
  ];
}

// Get dietary-specific recommendations
export function getDietaryRecommendations(tag: 'gf' | 'df' | 'v' | 'vg'): MenuItem[] {
  return getMenuItemsByTag(tag).slice(0, 8);
}

// Create a balanced meal suggestion
export function createBalancedMeal(): MenuItem[] {
  const items = getAllOrderableItems();
  
  // Try to get one from each category
  const appetizer = items.find(item => item.price <= 18);
  const main = items.find(item => item.price > 18 && item.price <= 40);
  const side = items.find(item => 
    item.name.toLowerCase().includes('salad') || 
    item.name.toLowerCase().includes('soup')
  );
  const dessert = items.find(item => 
    item.name.toLowerCase().includes('chocolate') || 
    item.name.toLowerCase().includes('cake')
  );

  return [appetizer, main, side, dessert].filter(Boolean) as MenuItem[];
}

// Chef's special recommendations
export function getChefSpecials(): MenuItem[] {
  const specialIds = [
    'seared-duck-breast',
    'miso-glazed-cod', 
    'golden-sweet-potato-gnocchi',
    'basque-cheesecake',
    'spanish-gildas',
    'duck-confit'
  ];
  
  return getAllOrderableItems().filter(item => specialIds.includes(item.id));
}

// Get items by price range
export function getItemsByPriceRange(min: number, max: number): MenuItem[] {
  return getAllOrderableItems().filter(item => item.price >= min && item.price <= max);
}

// Search function
export function searchMenuItems(query: string): MenuItem[] {
  const lowercaseQuery = query.toLowerCase();
  return getAllOrderableItems().filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.description?.toLowerCase().includes(lowercaseQuery) ||
    item.ingredients?.some(ingredient => ingredient.toLowerCase().includes(lowercaseQuery))
  );
}

// Format price for display
export function formatPrice(price: number): string {
  return `$${price.toFixed(0)}`;
}

// Generate WhatsApp order message
export function generateWhatsAppMessage(orderSummary: OrderSummary, customerInfo?: { name?: string; phone?: string; email?: string; address?: string }): string {
  const itemsList = orderSummary.items.map(item => 
    `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
  ).join('\n');

  let message = `🍽️ *SF SECRET MENU ORDER*\n\n`;
  message += `📦 *Items:*\n${itemsList}\n\n`;
  message += `💰 *Subtotal:* ${formatPrice(orderSummary.subtotal)}\n`;
  if (orderSummary.delivery > 0) {
    message += `🚚 *Delivery:* ${formatPrice(orderSummary.delivery)}\n`;
  }
  message += `💝 *Gratuity (included):* ${formatPrice(orderSummary.gratuity)}\n`;
  message += `💳 *Total:* ${formatPrice(orderSummary.total)}\n\n`;
  message += `⏱️ *Est. Prep Time:* ${orderSummary.estimatedTime} minutes\n\n`;
  
  if (customerInfo?.address) {
    message += `📍 *Delivery Address:*\n${customerInfo.address}\n\n`;
  }
  
  if (customerInfo?.email) {
    message += `👤 *Customer:* ${customerInfo.email}\n`;
  }
  
  message += `Please confirm this order and provide delivery details!`;
  
  return message;
}

export default {
  menuItemToOrderItem,
  calculateOrderSummary,
  getFeaturedMenuItems,
  getQuickOrderSuggestions,
  getDietaryRecommendations,
  createBalancedMeal,
  getChefSpecials,
  getItemsByPriceRange,
  searchMenuItems,
  formatPrice,
  generateWhatsAppMessage,
};