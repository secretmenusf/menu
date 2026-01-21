import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import {
  FileText,
  Plus,
  Search,
  Loader2,
  MoreHorizontal,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Building2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Organization = Tables<'organizations'>;
type OrganizationInvoice = Tables<'organization_invoices'>;

type InvoiceWithOrg = OrganizationInvoice & {
  organization?: Organization;
};

export default function Invoices() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithOrg | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    organization_id: '',
    amount: '',
    description: '',
    payment_method: 'ramp',
    notes: '',
  });

  // Fetch organizations for dropdown
  const { data: organizations = [] } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as Organization[];
    },
  });

  // Fetch all invoices with organization data
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['admin-invoices'],
    queryFn: async () => {
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('organization_invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invoiceError) throw invoiceError;

      // Fetch organizations
      const { data: orgData } = await supabase
        .from('organizations')
        .select('*');

      const orgMap = new Map((orgData || []).map(o => [o.id, o]));

      return (invoiceData as OrganizationInvoice[]).map(inv => ({
        ...inv,
        organization: orgMap.get(inv.organization_id),
      })) as InvoiceWithOrg[];
    },
  });

  // Generate next invoice number
  const getNextInvoiceNumber = () => {
    const existingNumbers = invoices
      .map(inv => parseInt(inv.invoice_number.replace(/\D/g, '')) || 0)
      .filter(n => !isNaN(n));
    const maxNumber = Math.max(0, ...existingNumbers);
    return String(maxNumber + 1).padStart(4, '0');
  };

  // Create invoice mutation
  const createInvoice = useMutation({
    mutationFn: async (data: typeof formData) => {
      const invoiceNumber = getNextInvoiceNumber();
      const { error } = await supabase
        .from('organization_invoices')
        .insert({
          organization_id: data.organization_id,
          invoice_number: invoiceNumber,
          amount_cents: Math.round(parseFloat(data.amount) * 100),
          description: data.description,
          payment_method: data.payment_method,
          notes: data.notes,
          status: 'draft',
        });
      if (error) throw error;
      return invoiceNumber;
    },
    onSuccess: (invoiceNumber) => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
      setIsCreateOpen(false);
      setFormData({ organization_id: '', amount: '', description: '', payment_method: 'ramp', notes: '' });
      toast({
        title: 'Invoice Created',
        description: `Invoice #${invoiceNumber} has been created.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update invoice status mutation
  const updateStatus = useMutation({
    mutationFn: async ({ id, status, paymentReference }: { id: string; status: string; paymentReference?: string }) => {
      const updates: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'sent') {
        updates.sent_at = new Date().toISOString();
      } else if (status === 'paid') {
        updates.paid_at = new Date().toISOString();
        if (paymentReference) {
          updates.payment_reference = paymentReference;
        }
      }

      const { error } = await supabase
        .from('organization_invoices')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
      toast({
        title: 'Status Updated',
        description: 'Invoice status has been updated.',
      });
    },
  });

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.organization?.name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount_cents, 0);
  const totalPending = invoices
    .filter(i => i.status === 'sent' || i.status === 'draft')
    .reduce((sum, i) => sum + i.amount_cents, 0);
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    paid: 'bg-green-500/10 text-green-500 border-green-500/20',
    overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    draft: <Clock className="h-3 w-3" />,
    sent: <Send className="h-3 w-3" />,
    paid: <CheckCircle className="h-3 w-3" />,
    overdue: <AlertCircle className="h-3 w-3" />,
    cancelled: <AlertCircle className="h-3 w-3" />,
  };

  // Generate PDF content
  const generateInvoicePDF = (invoice: InvoiceWithOrg) => {
    const content = `
SF SECRET MENU - INVOICE

Invoice #: ${invoice.invoice_number}
Date: ${format(new Date(invoice.created_at), 'MMMM d, yyyy')}
Status: ${invoice.status.toUpperCase()}

BILL TO:
${invoice.organization?.name || 'N/A'}
${invoice.organization?.billing_contact_name || ''}
${invoice.organization?.billing_email || ''}

DESCRIPTION:
${invoice.description || 'Meal preparation services'}

AMOUNT DUE: $${(invoice.amount_cents / 100).toFixed(2)}

PAYMENT METHOD: ${invoice.payment_method?.toUpperCase() || 'N/A'}
${invoice.payment_reference ? `REFERENCE: ${invoice.payment_reference}` : ''}

${invoice.notes ? `NOTES:\n${invoice.notes}` : ''}

---
SF Secret Menu
San Francisco, CA
secretmenusf.com
    `.trim();

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.invoice_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Invoice Downloaded',
      description: `Invoice #${invoice.invoice_number} has been downloaded.`,
    });
  };

  // Mark as paid dialog state
  const [isPaidDialogOpen, setIsPaidDialogOpen] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [invoiceToMarkPaid, setInvoiceToMarkPaid] = useState<InvoiceWithOrg | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-[0.1em] mb-2">INVOICES</h1>
          <p className="text-muted-foreground font-body">
            Manage invoices and track Ramp/ACH payments
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${(totalPaid / 100).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${(totalPending / 100).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">FILTERS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">
            ALL INVOICES ({filteredInvoices.length})
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
                  <TableHead className="font-display text-xs tracking-wider">INVOICE #</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">ORGANIZATION</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">AMOUNT</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">STATUS</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">PAYMENT</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">DATE</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono">{invoice.invoice_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{invoice.organization?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{invoice.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      ${(invoice.amount_cents / 100).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusColors[invoice.status]} flex items-center gap-1 w-fit`}>
                        {statusIcons[invoice.status]}
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm capitalize">{invoice.payment_method || '-'}</p>
                        {invoice.payment_reference && (
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {invoice.payment_reference}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(invoice.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedInvoice(invoice);
                            setIsDetailOpen(true);
                          }}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => generateInvoicePDF(invoice)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {invoice.status === 'draft' && (
                            <DropdownMenuItem onClick={() => updateStatus.mutate({ id: invoice.id, status: 'sent' })}>
                              <Send className="mr-2 h-4 w-4" />
                              Mark as Sent
                            </DropdownMenuItem>
                          )}
                          {(invoice.status === 'sent' || invoice.status === 'draft') && (
                            <DropdownMenuItem onClick={() => {
                              setInvoiceToMarkPaid(invoice);
                              setPaymentReference(invoice.payment_method === 'ramp' ? 'Ramp Card (···· 7221)' : 'ACH Direct deposit (···· 7221)');
                              setIsPaidDialogOpen(true);
                            }}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {invoice.status === 'sent' && (
                            <DropdownMenuItem
                              onClick={() => updateStatus.mutate({ id: invoice.id, status: 'overdue' })}
                              className="text-red-500"
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Mark as Overdue
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display tracking-[0.1em]">CREATE INVOICE</DialogTitle>
            <DialogDescription>Create a new invoice for an organization</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Organization</Label>
              <Select
                value={formData.organization_id}
                onValueChange={(v) => setFormData(prev => ({ ...prev, organization_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Organic Meal Prep, Delivered Bi-Weekly"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(v) => setFormData(prev => ({ ...prev, payment_method: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ramp">Ramp Card</SelectItem>
                  <SelectItem value="ach">ACH Transfer</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="invoice">Invoice (Net 30)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createInvoice.mutate(formData)}
              disabled={!formData.organization_id || !formData.amount || createInvoice.isPending}
            >
              {createInvoice.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display tracking-[0.1em]">
              INVOICE #{selectedInvoice?.invoice_number}
            </DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Bill To</p>
                  <p className="font-medium">{selectedInvoice.organization?.name}</p>
                  <p className="text-sm">{selectedInvoice.organization?.billing_contact_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.organization?.billing_email}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={`${statusColors[selectedInvoice.status]} mb-2`}>
                    {selectedInvoice.status.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Created: {format(new Date(selectedInvoice.created_at), 'MMM d, yyyy')}
                  </p>
                  {selectedInvoice.paid_at && (
                    <p className="text-sm text-green-600">
                      Paid: {format(new Date(selectedInvoice.paid_at), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-b py-4">
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p>{selectedInvoice.description || 'Meal preparation services'}</p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="capitalize">{selectedInvoice.payment_method}</p>
                  {selectedInvoice.payment_reference && (
                    <p className="text-sm text-muted-foreground">{selectedInvoice.payment_reference}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-3xl font-bold">${(selectedInvoice.amount_cents / 100).toLocaleString()}</p>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedInvoice && generateInvoicePDF(selectedInvoice)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Paid Dialog */}
      <Dialog open={isPaidDialogOpen} onOpenChange={setIsPaidDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Invoice as Paid</DialogTitle>
            <DialogDescription>
              Enter the payment reference for Invoice #{invoiceToMarkPaid?.invoice_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Reference</Label>
              <Input
                placeholder="e.g., Ramp Card (···· 7221)"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaidDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (invoiceToMarkPaid) {
                  updateStatus.mutate({
                    id: invoiceToMarkPaid.id,
                    status: 'paid',
                    paymentReference
                  });
                  setIsPaidDialogOpen(false);
                  setInvoiceToMarkPaid(null);
                  setPaymentReference('');
                }
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
