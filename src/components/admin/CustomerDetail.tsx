import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Mail, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  walletAddress?: string;
  subscriptionStatus: 'active' | 'paused' | 'cancelled' | 'none';
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  orders: Array<{
    id: string;
    total: number;
    status: string;
    date: Date;
  }>;
}

interface CustomerDetailProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

const subscriptionColors: Record<Customer['subscriptionStatus'], string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  paused: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  none: 'bg-muted text-muted-foreground border-muted-foreground/20',
};

export function CustomerDetail({ customer, isOpen, onClose }: CustomerDetailProps) {
  if (!customer) return null;

  const initials = customer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">CUSTOMER PROFILE</DialogTitle>
          <DialogDescription>View customer details and order history</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg font-display">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{customer.name}</h3>
              <p className="text-sm text-muted-foreground">
                Customer since {format(customer.createdAt, 'MMMM yyyy')}
              </p>
              <Badge variant="outline" className={subscriptionColors[customer.subscriptionStatus]}>
                {customer.subscriptionStatus === 'none'
                  ? 'No Subscription'
                  : customer.subscriptionStatus}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-2 text-sm sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{customer.address}</span>
              </div>
            )}
            {customer.walletAddress && (
              <div className="flex items-center gap-2 text-sm sm:col-span-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-xs truncate">{customer.walletAddress}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold font-display">{customer.totalOrders}</div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold font-display">
                  ${customer.totalSpent.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm tracking-[0.1em]">ORDER HISTORY</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-display text-xs tracking-wider">ORDER</TableHead>
                      <TableHead className="font-display text-xs tracking-wider">DATE</TableHead>
                      <TableHead className="font-display text-xs tracking-wider">TOTAL</TableHead>
                      <TableHead className="font-display text-xs tracking-wider">STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell className="text-sm">
                          {format(order.date, 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="font-mono">${order.total}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No orders yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
