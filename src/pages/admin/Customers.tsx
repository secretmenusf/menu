import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CustomerDetail, type Customer } from '@/components/admin/CustomerDetail';
import { Search, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const mockCustomers: Customer[] = [
  {
    id: 'USR-001',
    name: 'Alex Chen',
    email: 'alex@example.com',
    phone: '+1 415 555 0123',
    address: '123 Mission St, San Francisco, CA 94105',
    walletAddress: '0x1234...5678',
    subscriptionStatus: 'active',
    totalOrders: 24,
    totalSpent: 4800,
    createdAt: new Date('2024-01-15'),
    orders: [
      { id: 'ORD-001', total: 950, status: 'delivered', date: new Date() },
      { id: 'ORD-002', total: 1200, status: 'delivered', date: new Date(Date.now() - 604800000) },
    ],
  },
  {
    id: 'USR-002',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '+1 415 555 0456',
    subscriptionStatus: 'active',
    totalOrders: 18,
    totalSpent: 3600,
    createdAt: new Date('2024-02-20'),
    orders: [
      { id: 'ORD-003', total: 900, status: 'preparing', date: new Date() },
    ],
  },
  {
    id: 'USR-003',
    name: 'James Wilson',
    email: 'james@example.com',
    subscriptionStatus: 'paused',
    totalOrders: 8,
    totalSpent: 1600,
    createdAt: new Date('2024-03-10'),
    orders: [],
  },
  {
    id: 'USR-004',
    name: 'Emily Davis',
    email: 'emily@example.com',
    walletAddress: '0xabcd...efgh',
    subscriptionStatus: 'cancelled',
    totalOrders: 3,
    totalSpent: 600,
    createdAt: new Date('2024-04-05'),
    orders: [],
  },
  {
    id: 'USR-005',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+1 415 555 0789',
    address: '456 Market St, San Francisco, CA 94102',
    subscriptionStatus: 'none',
    totalOrders: 1,
    totalSpent: 950,
    createdAt: new Date('2024-05-01'),
    orders: [
      { id: 'ORD-004', total: 950, status: 'delivered', date: new Date(Date.now() - 1209600000) },
    ],
  },
];

const subscriptionColors: Record<Customer['subscriptionStatus'], string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  paused: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  none: 'bg-muted text-muted-foreground border-muted-foreground/20',
};

export default function Customers() {
  const [search, setSearch] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.id.toLowerCase().includes(search.toLowerCase());

    const matchesSubscription =
      subscriptionFilter === 'all' || customer.subscriptionStatus === subscriptionFilter;

    return matchesSearch && matchesSubscription;
  });

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-[0.1em] mb-2">CUSTOMERS</h1>
          <p className="text-muted-foreground font-body">
            Manage customer profiles and subscriptions
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-display">{mockCustomers.length}</div>
            <p className="text-xs text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-display">
              {mockCustomers.filter((c) => c.subscriptionStatus === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Active Subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-display">
              ${mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-display">
              ${Math.round(
                mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / mockCustomers.length
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Avg. Lifetime Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">FILTERS</CardTitle>
          <CardDescription>Search and filter customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscriptions</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="none">No Subscription</SelectItem>
              </SelectContent>
            </Select>

            {(search || subscriptionFilter !== 'all') && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch('');
                  setSubscriptionFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">
            ALL CUSTOMERS ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-display text-xs tracking-wider">CUSTOMER</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">EMAIL</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">SUBSCRIPTION</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">ORDERS</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">SPENT</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">JOINED</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const initials = customer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {customer.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={subscriptionColors[customer.subscriptionStatus]}
                        >
                          {customer.subscriptionStatus === 'none'
                            ? 'None'
                            : customer.subscriptionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{customer.totalOrders}</TableCell>
                      <TableCell className="font-mono">
                        ${customer.totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(customer.createdAt, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Detail Modal */}
      <CustomerDetail
        customer={selectedCustomer}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedCustomer(null);
        }}
      />
    </div>
  );
}
