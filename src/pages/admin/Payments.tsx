import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DollarSign, CreditCard, Wallet, Search, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

interface Payment {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  method: 'card' | 'crypto';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  txHash?: string;
  createdAt: Date;
}

const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    orderId: 'ORD-001',
    customer: 'Alex Chen',
    amount: 950,
    method: 'card',
    status: 'completed',
    createdAt: new Date(),
  },
  {
    id: 'PAY-002',
    orderId: 'ORD-002',
    customer: 'Maria Santos',
    amount: 1200,
    method: 'crypto',
    status: 'completed',
    txHash: '0x1234...5678',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'PAY-003',
    orderId: 'ORD-003',
    customer: 'James Wilson',
    amount: 900,
    method: 'card',
    status: 'pending',
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'PAY-004',
    orderId: 'ORD-004',
    customer: 'Emily Davis',
    amount: 1500,
    method: 'crypto',
    status: 'failed',
    createdAt: new Date(Date.now() - 259200000),
  },
  {
    id: 'PAY-005',
    orderId: 'ORD-005',
    customer: 'Michael Brown',
    amount: 1100,
    method: 'card',
    status: 'refunded',
    createdAt: new Date(Date.now() - 345600000),
  },
];

const statusColors: Record<Payment['status'], string> = {
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  refunded: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

export default function Payments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(search.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(search.toLowerCase()) ||
      payment.customer.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalRevenue = mockPayments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = mockPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const refundedAmount = mockPayments
    .filter((p) => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-[0.1em] mb-2">PAYMENTS</h1>
          <p className="text-muted-foreground font-body">
            View payment history and transactions
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
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">
                  ${totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <ArrowUpRight className="h-3 w-3" />
                  Total Revenue
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">
                  ${pendingAmount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <ArrowDownRight className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">
                  ${refundedAmount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Refunded</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Wallet className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">
                  {mockPayments.filter((p) => p.method === 'crypto').length}
                </div>
                <p className="text-xs text-muted-foreground">Crypto Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">FILTERS</CardTitle>
          <CardDescription>Filter transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
              </SelectContent>
            </Select>

            {(search || statusFilter !== 'all' || methodFilter !== 'all') && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setMethodFilter('all');
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">
            TRANSACTIONS ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-display text-xs tracking-wider">ID</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">ORDER</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">CUSTOMER</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">AMOUNT</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">METHOD</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">STATUS</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">DATE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                    <TableCell className="font-mono text-sm">{payment.orderId}</TableCell>
                    <TableCell>{payment.customer}</TableCell>
                    <TableCell className="font-mono font-medium">
                      ${payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payment.method === 'crypto' ? (
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="capitalize">{payment.method}</span>
                      </div>
                      {payment.txHash && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {payment.txHash}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[payment.status]}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(payment.createdAt, 'MMM d, yyyy HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
