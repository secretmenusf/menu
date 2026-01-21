import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { Building2, Users, FileText, Plus, Search, Loader2, DollarSign } from 'lucide-react';

type Organization = Tables<'organizations'>;
type OrganizationMember = Tables<'organization_members'>;
type OrganizationInvoice = Tables<'organization_invoices'>;

export default function Organizations() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch organizations
  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['admin-organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Organization[];
    },
  });

  // Fetch members for selected org
  const { data: members = [] } = useQuery({
    queryKey: ['admin-org-members', selectedOrg?.id],
    queryFn: async () => {
      if (!selectedOrg) return [];
      const { data, error } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', selectedOrg.id)
        .order('created_at');
      if (error) throw error;
      return data as OrganizationMember[];
    },
    enabled: !!selectedOrg,
  });

  // Fetch invoices for selected org
  const { data: invoices = [] } = useQuery({
    queryKey: ['admin-org-invoices', selectedOrg?.id],
    queryFn: async () => {
      if (!selectedOrg) return [];
      const { data, error } = await supabase
        .from('organization_invoices')
        .select('*')
        .eq('organization_id', selectedOrg.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as OrganizationInvoice[];
    },
    enabled: !!selectedOrg,
  });

  // Filter organizations
  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.billing_email.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate total revenue for an org
  const totalRevenue = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount_cents, 0);

  const billingMethodColors: Record<string, string> = {
    stripe: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    ramp: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    ach: 'bg-green-500/10 text-green-500 border-green-500/20',
    invoice: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  };

  const invoiceStatusColors: Record<string, string> = {
    draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    paid: 'bg-green-500/10 text-green-500 border-green-500/20',
    overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-[0.1em] mb-2">ORGANIZATIONS</h1>
          <p className="text-muted-foreground font-body">
            Manage corporate clients and households
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">
              {organizations.filter((o) => o.is_active).length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ramp/ACH Clients</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.filter((o) => o.billing_method === 'ramp' || o.billing_method === 'ach').length}
            </div>
            <p className="text-xs text-muted-foreground">
              corporate billing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount_cents, 0) / 100).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              from paid invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">SEARCH</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">
            ALL ORGANIZATIONS ({filteredOrgs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-display text-xs tracking-wider">NAME</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">CONTACT</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">BILLING</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">STATUS</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">CREATED</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="font-medium">{org.name}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{org.billing_contact_name || '-'}</p>
                        <p className="text-xs text-muted-foreground">{org.billing_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={billingMethodColors[org.billing_method || 'stripe']}>
                        {org.billing_method?.toUpperCase() || 'STRIPE'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={org.is_active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}>
                        {org.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(org.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrg(org);
                          setIsDetailOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Organization Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display tracking-[0.1em]">
              {selectedOrg?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedOrg?.billing_email}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
              <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Billing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-muted-foreground text-sm">Contact:</span>
                      <p>{selectedOrg?.billing_contact_name || '-'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Email:</span>
                      <p>{selectedOrg?.billing_email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Method:</span>
                      <p className="capitalize">{selectedOrg?.billing_method || 'stripe'}</p>
                    </div>
                    {selectedOrg?.notes && (
                      <div>
                        <span className="text-muted-foreground text-sm">Notes:</span>
                        <p className="text-sm">{selectedOrg.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Revenue Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold">
                      ${(totalRevenue / 100).toLocaleString()}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      from {invoices.filter((i) => i.status === 'paid').length} paid invoices
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="members" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name || '-'}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {member.can_place_orders && (
                            <Badge variant="secondary" className="text-xs">Orders</Badge>
                          )}
                          {member.can_view_invoices && (
                            <Badge variant="secondary" className="text-xs">Invoices</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {member.joined_at ? format(new Date(member.joined_at), 'MMM d, yyyy') : 'Pending'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="invoices" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono">{invoice.invoice_number}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {invoice.description || '-'}
                      </TableCell>
                      <TableCell className="font-mono">
                        ${(invoice.amount_cents / 100).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={invoiceStatusColors[invoice.status]}>
                          {invoice.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {invoice.payment_reference || invoice.payment_method || '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {invoice.paid_at
                          ? format(new Date(invoice.paid_at), 'MMM d, yyyy')
                          : format(new Date(invoice.created_at), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
