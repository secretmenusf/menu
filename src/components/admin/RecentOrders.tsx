import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  createdAt: Date;
}

interface RecentOrdersProps {
  orders?: Order[];
}

const defaultOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Alex Chen',
    email: 'alex@example.com',
    total: 950,
    status: 'delivered',
    createdAt: new Date(),
  },
  {
    id: 'ORD-002',
    customer: 'Maria Santos',
    email: 'maria@example.com',
    total: 1200,
    status: 'preparing',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'ORD-003',
    customer: 'James Wilson',
    email: 'james@example.com',
    total: 900,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'ORD-004',
    customer: 'Emily Davis',
    email: 'emily@example.com',
    total: 1500,
    status: 'pending',
    createdAt: new Date(Date.now() - 259200000),
  },
  {
    id: 'ORD-005',
    customer: 'Michael Brown',
    email: 'michael@example.com',
    total: 1100,
    status: 'delivered',
    createdAt: new Date(Date.now() - 345600000),
  },
];

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  preparing: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function RecentOrders({ orders = defaultOrders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-sm tracking-[0.1em]">RECENT ORDERS</CardTitle>
        <CardDescription className="font-body">Latest orders from customers</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-display text-xs tracking-wider">ORDER</TableHead>
              <TableHead className="font-display text-xs tracking-wider">CUSTOMER</TableHead>
              <TableHead className="font-display text-xs tracking-wider">TOTAL</TableHead>
              <TableHead className="font-display text-xs tracking-wider">STATUS</TableHead>
              <TableHead className="font-display text-xs tracking-wider">DATE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell className="font-mono">${order.total}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(order.createdAt, 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
