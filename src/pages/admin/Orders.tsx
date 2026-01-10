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
import { Search, CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: { name: 'Alex Chen', email: 'alex@example.com', phone: '+1234567890' },
    items: 4,
    total: 950,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    deliveryDate: new Date(),
    createdAt: new Date(),
  },
  {
    id: 'ORD-002',
    customer: { name: 'Maria Santos', email: 'maria@example.com' },
    items: 6,
    total: 1200,
    status: 'preparing',
    paymentStatus: 'paid',
    paymentMethod: 'crypto',
    deliveryDate: new Date(Date.now() + 86400000),
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'ORD-003',
    customer: { name: 'James Wilson', email: 'james@example.com' },
    items: 3,
    total: 900,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    deliveryDate: new Date(Date.now() + 172800000),
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'ORD-004',
    customer: { name: 'Emily Davis', email: 'emily@example.com' },
    items: 8,
    total: 1500,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'crypto',
    deliveryDate: new Date(Date.now() + 259200000),
    createdAt: new Date(Date.now() - 259200000),
  },
  {
    id: 'ORD-005',
    customer: { name: 'Michael Brown', email: 'michael@example.com' },
    items: 5,
    total: 1100,
    status: 'out_for_delivery',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    deliveryDate: new Date(),
    createdAt: new Date(Date.now() - 345600000),
  },
  {
    id: 'ORD-006',
    customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
    items: 2,
    total: 500,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'card',
    deliveryDate: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 432000000),
  },
];

export default function Orders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const filteredOrders = mockOrders.filter((order) => {
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
          <OrderTable
            orders={filteredOrders}
            onViewOrder={handleViewOrder}
            onEditOrder={handleEditOrder}
            onRefundOrder={handleRefundOrder}
          />
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
        onUpdateStatus={(id, status) => {
          console.log('Update status:', id, status);
        }}
        onAddNote={(id, note) => {
          console.log('Add note:', id, note);
        }}
        onRefund={(id) => {
          console.log('Refund:', id);
        }}
      />
    </div>
  );
}
