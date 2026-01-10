import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { WeekMenu, DayMenu, MenuItem } from '@/data/menus';

// Order item represents a single meal selection
export interface OrderItem {
  id: string;
  menuWeekId: string;
  dayIndex: number;
  mealType: 'lunch' | 'dinner' | 'dessert';
  item: MenuItem;
  quantity: number;
  unitPrice: number; // in cents
}

// Order status flow
export type OrderStatus =
  | 'draft'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

// Payment status
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

// Delivery details
export interface DeliveryDetails {
  address: string;
  city: string;
  zipCode: string;
  notes?: string;
  scheduledDate?: Date;
  scheduledTime?: string;
  estimatedArrival?: Date;
  driverLocation?: {
    lat: number;
    lng: number;
  };
}

// Full order state
export interface Order {
  id?: string;
  userId?: string;
  menuWeekId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'stripe' | 'crypto';
  totalCents: number;
  deliveryDetails: DeliveryDetails;
  createdAt?: Date;
  updatedAt?: Date;
}

// Cart state for building orders
export interface CartState {
  items: OrderItem[];
  menuWeekId: string | null;
  deliveryDetails: Partial<DeliveryDetails>;
}

// Order context state
interface OrderContextState {
  cart: CartState;
  currentOrder: Order | null;
  orderHistory: Order[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type OrderAction =
  | { type: 'ADD_ITEM'; payload: OrderItem }
  | { type: 'REMOVE_ITEM'; payload: string } // item id
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_MENU_WEEK'; payload: string }
  | { type: 'SET_DELIVERY_DETAILS'; payload: Partial<DeliveryDetails> }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | null }
  | { type: 'SET_ORDER_HISTORY'; payload: Order[] }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: OrderContextState = {
  cart: {
    items: [],
    menuWeekId: null,
    deliveryDetails: {},
  },
  currentOrder: null,
  orderHistory: [],
  isLoading: false,
  error: null,
};

// Reducer
function orderReducer(state: OrderContextState, action: OrderAction): OrderContextState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.cart.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingIndex >= 0) {
        const newItems = [...state.cart.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.payload.quantity,
        };
        return {
          ...state,
          cart: { ...state.cart, items: newItems },
        };
      }

      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, action.payload],
        },
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => item.id !== action.payload),
        },
      };

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: {
            ...state.cart,
            items: state.cart.items.filter((item) => item.id !== id),
          },
        };
      }
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        },
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          items: [],
          menuWeekId: null,
          deliveryDetails: {},
        },
      };

    case 'SET_MENU_WEEK':
      return {
        ...state,
        cart: { ...state.cart, menuWeekId: action.payload },
      };

    case 'SET_DELIVERY_DETAILS':
      return {
        ...state,
        cart: {
          ...state.cart,
          deliveryDetails: { ...state.cart.deliveryDetails, ...action.payload },
        },
      };

    case 'SET_CURRENT_ORDER':
      return { ...state, currentOrder: action.payload };

    case 'SET_ORDER_HISTORY':
      return { ...state, orderHistory: action.payload };

    case 'UPDATE_ORDER_STATUS': {
      const { orderId, status } = action.payload;
      return {
        ...state,
        orderHistory: state.orderHistory.map((order) =>
          order.id === orderId ? { ...order, status } : order
        ),
        currentOrder:
          state.currentOrder?.id === orderId
            ? { ...state.currentOrder, status }
            : state.currentOrder,
      };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

// Context type
interface OrderContextType extends OrderContextState {
  // Cart actions
  addItem: (item: Omit<OrderItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setMenuWeek: (menuWeekId: string) => void;
  setDeliveryDetails: (details: Partial<DeliveryDetails>) => void;

  // Order actions
  setCurrentOrder: (order: Order | null) => void;
  setOrderHistory: (orders: Order[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Computed values
  cartTotal: number;
  cartItemCount: number;
}

// Create context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Generate unique item ID
function generateItemId(item: Omit<OrderItem, 'id'>): string {
  return `${item.menuWeekId}-${item.dayIndex}-${item.mealType}-${item.item.name}`;
}

// Provider component
export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const addItem = useCallback((item: Omit<OrderItem, 'id'>) => {
    const id = generateItemId(item);
    dispatch({ type: 'ADD_ITEM', payload: { ...item, id } });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const setMenuWeek = useCallback((menuWeekId: string) => {
    dispatch({ type: 'SET_MENU_WEEK', payload: menuWeekId });
  }, []);

  const setDeliveryDetails = useCallback((details: Partial<DeliveryDetails>) => {
    dispatch({ type: 'SET_DELIVERY_DETAILS', payload: details });
  }, []);

  const setCurrentOrder = useCallback((order: Order | null) => {
    dispatch({ type: 'SET_CURRENT_ORDER', payload: order });
  }, []);

  const setOrderHistory = useCallback((orders: Order[]) => {
    dispatch({ type: 'SET_ORDER_HISTORY', payload: orders });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
  }, []);

  // Computed values
  const cartTotal = state.cart.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const cartItemCount = state.cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const value: OrderContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setMenuWeek,
    setDeliveryDetails,
    setCurrentOrder,
    setOrderHistory,
    updateOrderStatus,
    cartTotal,
    cartItemCount,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

// Hook to use order context
export function useOrderContext() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
}

// Alias for backward compatibility with existing Checkout.tsx
// This provides a simpler interface matching the existing usage pattern
export function useOrder() {
  const context = useOrderContext();

  // Transform cart items to match existing Checkout.tsx expectations
  const cart = context.cart.items.map(item => ({
    name: item.item.name,
    quantity: item.quantity,
    price: item.unitPrice / 100, // Convert cents to dollars
  }));

  const total = context.cartTotal / 100; // Convert cents to dollars

  return {
    cart,
    total,
    clearCart: context.clearCart,
    // Also expose full context for advanced usage
    ...context,
  };
}

export default OrderContext;
