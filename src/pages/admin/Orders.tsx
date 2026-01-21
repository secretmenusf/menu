import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { OrderTable, type Order } from '@/components/admin/OrderTable';
import { OrderActions } from '@/components/admin/OrderActions';
import { Search, CalendarIcon, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAdminOrders, type AdminOrder } from '@/hooks/useAdminOrders';

// Transform AdminOrder to OrderTable's Order type
function transformOrder(order: AdminOrder): Order {
  return {
    id: order.id,
    customer: {
      name: order.organization?.name || order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
    },
    items: order.items,
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod === 'ramp' || order.paymentMethod === 'ach' ? 'card' : order.paymentMethod as 'card' | 'crypto',
    deliveryDate: order.deliveryDate,
    createdAt: order.createdAt,
  };
}

export default function Orders() {
  const { orders, isLoading, updateOrderStatus, addAdminNote } = useAdminOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const transformedOrders = orders.map(transformOrder);

  const filteredOrders = transformedOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    const matchesDate =
      !dateFilter ||
      format(order.createdAt, 'yyyy-MM-dd') === format(dateFilter, 'yyyy-MM-dd');

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsActionsOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsActionsOpen(true);
  };

  const handleRefundOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsActionsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-[0.1em] mb-2">ORDERS</h1>
          <p className="text-muted-foreground font-body">
            Manage customer orders and deliveries
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">FILTERS</CardTitle>
          <CardDescription>Filter orders by status, date, or search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[180px] justify-start text-left font-normal',
                    !dateFilter && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} />
              </PopoverContent>
            </Popover>

            {/* Clear Filters */}
            {(search || statusFilter !== 'all' || dateFilter) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setDateFilter(undefined);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">
            ALL ORDERS ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <OrderTable
              orders={filteredOrders}
              onViewOrder={handleViewOrder}
              onEditOrder={handleEditOrder}
              onRefundOrder={handleRefundOrder}
            />
          )}
        </CardContent>
      </Card>

      {/* Order Actions Modal */}
      <OrderActions
        order={selectedOrder}
        isOpen={isActionsOpen}
        onClose={() => {
          setIsActionsOpen(false);
          setSelectedOrder(null);
        }}
        onUpdateStatus={async (id, status) => {
          // Find the original order ID (the full UUID)
          const originalOrder = orders.find(o => o.id === id || o.invoiceNumber === id);
          if (originalOrder) {
            await updateOrderStatus({ orderId: originalOrder.id, status });
          }
        }}
        onAddNote={async (id, note) => {
          const originalOrder = orders.find(o => o.id === id || o.invoiceNumber === id);
          if (originalOrder) {
            await addAdminNote({ orderId: originalOrder.id, note });
          }
        }}
        onRefund={(id) => {
          console.log('Refund:', id);
        }}
      />
    </div>
  );
}
