import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { Order } from './OrderTable';

interface OrderActionsProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, status: Order['status']) => void;
  onAddNote?: (orderId: string, note: string) => void;
  onRefund?: (orderId: string) => void;
}

const statusOptions: { value: Order['status']; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function OrderActions({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddNote,
  onRefund,
}: OrderActionsProps) {
  const [status, setStatus] = useState<Order['status']>(order?.status || 'pending');
  const [note, setNote] = useState('');
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  if (!order) return null;

  const handleUpdateStatus = () => {
    onUpdateStatus?.(order.id, status);
    onClose();
  };

  const handleAddNote = () => {
    if (note.trim()) {
      onAddNote?.(order.id, note);
      setNote('');
    }
  };

  const handleRefund = () => {
    onRefund?.(order.id);
    setShowRefundConfirm(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider">
              ORDER {order.id}
            </DialogTitle>
            <DialogDescription>
              Manage order status, add notes, or process refunds.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Order Summary */}
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Customer</span>
                <span className="text-sm font-medium">{order.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm">{order.customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-sm font-mono font-medium">${order.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Delivery Date</span>
                <span className="text-sm">{format(order.deliveryDate, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment</span>
                <Badge variant="outline" className="capitalize">
                  {order.paymentMethod} - {order.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Update Status */}
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider">UPDATE STATUS</Label>
              <div className="flex gap-2">
                <Select value={status} onValueChange={(v) => setStatus(v as Order['status'])}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleUpdateStatus} disabled={status === order.status}>
                  Update
                </Button>
              </div>
            </div>

            {/* Add Note */}
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider">ADD NOTE</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add internal notes about this order..."
                className="resize-none"
                rows={3}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddNote}
                disabled={!note.trim()}
              >
                Add Note
              </Button>
            </div>

            {/* Refund */}
            {order.paymentStatus === 'paid' && (
              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => setShowRefundConfirm(true)}
                  className="w-full"
                >
                  Process Refund
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Confirmation */}
      <Dialog open={showRefundConfirm} onOpenChange={setShowRefundConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider">
              CONFIRM REFUND
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to refund ${order.total} to {order.customer.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRefund}>
              Confirm Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
