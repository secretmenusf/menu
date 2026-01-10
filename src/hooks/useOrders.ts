import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useOrderContext, Order, OrderStatus, PaymentStatus } from '@/contexts/OrderContext';

// Type aliases for Supabase tables
type DbOrder = Tables<'orders'>;
type DbOrderInsert = TablesInsert<'orders'>;
type DbOrderUpdate = TablesUpdate<'orders'>;

// Map database order to application Order type
function mapDbOrderToOrder(dbOrder: DbOrder): Order {
  return {
    id: dbOrder.id,
    userId: dbOrder.user_id,
    menuWeekId: dbOrder.menu_week_id,
    items: [], // Items loaded separately or from order_items table
    status: dbOrder.status as OrderStatus,
    paymentStatus: dbOrder.payment_status as PaymentStatus,
    paymentMethod: dbOrder.payment_method as 'stripe' | 'crypto',
    totalCents: dbOrder.total_cents,
    deliveryDetails: {
      address: '', // Would be in a separate table or JSON field
      city: '',
      zipCode: '',
      notes: dbOrder.delivery_notes || undefined,
    },
    createdAt: new Date(dbOrder.created_at),
    updatedAt: new Date(dbOrder.updated_at),
  };
}

// Map application Order to database insert type
function mapOrderToDbInsert(order: Partial<Order>, userId: string): DbOrderInsert {
  return {
    user_id: userId,
    menu_week_id: order.menuWeekId!,
    status: order.status || 'confirmed',
    payment_status: order.paymentStatus || 'pending',
    payment_method: order.paymentMethod || 'stripe',
    total_cents: order.totalCents || 0,
    delivery_notes: order.deliveryDetails?.notes || null,
    stripe_payment_id: null,
    wallet_tx_hash: null,
  };
}

interface UseOrdersOptions {
  userId?: string;
}

export function useOrders({ userId }: UseOrdersOptions = {}) {
  const queryClient = useQueryClient();
  const { setOrderHistory, setCurrentOrder, updateOrderStatus: updateContextStatus } = useOrderContext();
  const [error, setError] = useState<string | null>(null);

  // Fetch all orders for a user
  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const mappedOrders = data.map(mapDbOrderToOrder);
      setOrderHistory(mappedOrders);
      return mappedOrders;
    },
    enabled: !!userId,
  });

  // Fetch a single order by ID
  const fetchOrder = useCallback(
    async (orderId: string): Promise<Order | null> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      const order = mapDbOrderToOrder(data);
      setCurrentOrder(order);
      return order;
    },
    [setCurrentOrder]
  );

  // Create a new order
  const createOrderMutation = useMutation({
    mutationFn: async ({
      order,
      userId,
    }: {
      order: Partial<Order>;
      userId: string;
    }): Promise<Order> => {
      const dbOrder = mapOrderToDbInsert(order, userId);

      const { data, error } = await supabase
        .from('orders')
        .insert(dbOrder)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapDbOrderToOrder(data);
    },
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders', userId] });
      setCurrentOrder(newOrder);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // Update an existing order
  const updateOrderMutation = useMutation({
    mutationFn: async ({
      orderId,
      updates,
    }: {
      orderId: string;
      updates: DbOrderUpdate;
    }): Promise<Order> => {
      const { data, error } = await supabase
        .from('orders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapDbOrderToOrder(data);
    },
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders', userId] });
      if (updatedOrder.status) {
        updateContextStatus(updatedOrder.id!, updatedOrder.status);
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // Update order status specifically
  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      return updateOrderMutation.mutateAsync({
        orderId,
        updates: { status },
      });
    },
    [updateOrderMutation]
  );

  // Update payment status
  const updatePaymentStatus = useCallback(
    async (
      orderId: string,
      paymentStatus: PaymentStatus,
      paymentDetails?: { stripePaymentId?: string; walletTxHash?: string }
    ) => {
      return updateOrderMutation.mutateAsync({
        orderId,
        updates: {
          payment_status: paymentStatus,
          stripe_payment_id: paymentDetails?.stripePaymentId || null,
          wallet_tx_hash: paymentDetails?.walletTxHash || null,
        },
      });
    },
    [updateOrderMutation]
  );

  // Cancel an order
  const cancelOrder = useCallback(
    async (orderId: string) => {
      return updateOrderStatus(orderId, 'cancelled');
    },
    [updateOrderStatus]
  );

  // Get orders by status
  const getOrdersByStatus = useCallback(
    (status: OrderStatus) => {
      return orders.filter((order) => order.status === status);
    },
    [orders]
  );

  // Get active orders (not delivered or cancelled)
  const getActiveOrders = useCallback(() => {
    return orders.filter(
      (order) => order.status !== 'delivered' && order.status !== 'cancelled'
    );
  }, [orders]);

  return {
    // Data
    orders,
    error,

    // Loading states
    isLoadingOrders,
    isCreating: createOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,

    // Actions
    fetchOrder,
    createOrder: createOrderMutation.mutateAsync,
    updateOrder: updateOrderMutation.mutateAsync,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    refetchOrders,

    // Helpers
    getOrdersByStatus,
    getActiveOrders,
  };
}

export default useOrders;
