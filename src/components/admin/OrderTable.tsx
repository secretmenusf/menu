import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { MoreHorizontal, Eye, Edit, RefreshCcw } from 'lucide-react';

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: 'card' | 'crypto';
  deliveryDate: Date;
  createdAt: Date;
}

interface OrderTableProps {
  orders: Order[];
  onViewOrder?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
  onRefundOrder?: (order: Order) => void;
}

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  preparing: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  out_for_delivery: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const paymentStatusColors: Record<Order['paymentStatus'], string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  paid: 'bg-green-500/10 text-green-500 border-green-500/20',
  refunded: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function OrderTable({ orders, onViewOrder, onEditOrder, onRefundOrder }: OrderTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const toggleOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleAll = () => {
    setSelectedOrders((prev) =>
      prev.length === orders.length ? [] : orders.map((o) => o.id)
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedOrders.length === orders.length && orders.length > 0}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead className="font-display text-xs tracking-wider">ORDER</TableHead>
            <TableHead className="font-display text-xs tracking-wider">CUSTOMER</TableHead>
            <TableHead className="font-display text-xs tracking-wider">ITEMS</TableHead>
            <TableHead className="font-display text-xs tracking-wider">TOTAL</TableHead>
            <TableHead className="font-display text-xs tracking-wider">STATUS</TableHead>
            <TableHead className="font-display text-xs tracking-wider">PAYMENT</TableHead>
            <TableHead className="font-display text-xs tracking-wider">DELIVERY</TableHead>
            <TableHead className="font-display text-xs tracking-wider">DATE</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={() => toggleOrder(order.id)}
                />
              </TableCell>
              <TableCell className="font-mono text-sm">{order.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{order.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                </div>
              </TableCell>
              <TableCell className="text-center">{order.items}</TableCell>
              <TableCell className="font-mono">${order.total}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[order.status]}>
                  {order.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className={paymentStatusColors[order.paymentStatus]}>
                    {order.paymentStatus}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">
                    {order.paymentMethod}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {format(order.deliveryDate, 'MMM d')}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(order.createdAt, 'MMM d, HH:mm')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="font-display text-xs tracking-wider">
                      Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewOrder?.(order)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditOrder?.(order)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Order
                    </DropdownMenuItem>
                    {order.paymentStatus === 'paid' && (
                      <DropdownMenuItem
                        onClick={() => onRefundOrder?.(order)}
                        className="text-red-500"
                      >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Refund
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
