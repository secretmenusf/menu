import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Type for the admin_orders_summary view
type AdminOrderSummary = {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_cents: number;
  delivery_notes: string | null;
  admin_notes: string | null;
  organization_name: string | null;
  billing_contact_name: string | null;
  billing_email: string | null;
  invoice_number: string | null;
  invoice_status: string | null;
  customer_name: string | null;
  customer_email: string | null;
};

// Mapped order type for components
export interface AdminOrder {
  id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  organization?: {
    name: string;
    billingContact: string;
    billingEmail: string;
  };
  items: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: 'card' | 'crypto' | 'ramp' | 'ach';
  invoiceNumber?: string;
  invoiceStatus?: string;
  deliveryNotes?: string;
  adminNotes?: string;
  deliveryDate: Date;
  createdAt: Date;
}

function mapSummaryToAdminOrder(summary: AdminOrderSummary): AdminOrder {
  return {
    id: summary.invoice_number || summary.id.slice(0, 8),
    customer: {
      name: summary.billing_contact_name || summary.customer_name || 'Unknown',
      email: summary.billing_email || summary.customer_email || '',
    },
    organization: summary.organization_name
      ? {
          name: summary.organization_name,
          billingContact: summary.billing_contact_name || '',
          billingEmail: summary.billing_email || '',
        }
      : undefined,
    items: 1, // Would need to count from line_items if available
    total: summary.total_cents / 100,
    status: summary.status as AdminOrder['status'],
    paymentStatus: summary.payment_status as AdminOrder['paymentStatus'],
    paymentMethod: summary.payment_method as AdminOrder['paymentMethod'],
    invoiceNumber: summary.invoice_number || undefined,
    invoiceStatus: summary.invoice_status || undefined,
    deliveryNotes: summary.delivery_notes || undefined,
    adminNotes: summary.admin_notes || undefined,
    deliveryDate: new Date(summary.created_at),
    createdAt: new Date(summary.created_at),
  };
}

export function useAdminOrders() {
  const queryClient = useQueryClient();

  // Fetch all orders with organization and invoice info
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_orders_summary')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data as AdminOrderSummary[]).map(mapSummaryToAdminOrder);
    },
  });

  // Fetch organizations
  const {
    data: organizations = [],
    isLoading: isLoadingOrganizations,
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw new Error(error.message);
      }

      return data as Tables<'organizations'>[];
    },
  });

  // Update order status
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  // Add admin note to order
  const addAdminNote = useMutation({
    mutationFn: async ({ orderId, note }: { orderId: string; note: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ admin_notes: note, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  // Get stats for dashboard
  const getStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersToday = orders.filter(
      (o) => new Date(o.createdAt) >= today
    );
    const revenueToday = ordersToday.reduce((sum, o) => sum + o.total, 0);
    const pendingDeliveries = orders.filter(
      (o) => o.status === 'confirmed' || o.status === 'preparing' || o.status === 'out_for_delivery'
    );

    return {
      ordersToday: ordersToday.length,
      revenueToday,
      activeOrganizations: organizations.length,
      pendingDeliveries: pendingDeliveries.length,
    };
  };

  // Get recent orders for dashboard
  const getRecentOrders = (limit = 5) => {
    return orders.slice(0, limit);
  };

  return {
    orders,
    organizations,
    isLoading,
    isLoadingOrganizations,
    error,
    refetch,
    updateOrderStatus: updateOrderStatus.mutateAsync,
    addAdminNote: addAdminNote.mutateAsync,
    getStats,
    getRecentOrders,
    isUpdating: updateOrderStatus.isPending,
  };
}

export default useAdminOrders;
