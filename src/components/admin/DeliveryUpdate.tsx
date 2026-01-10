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
import { Clock, MapPin, User, Truck } from 'lucide-react';
import { format } from 'date-fns';
import type { Delivery } from './DeliveryBoard';

interface DeliveryUpdateProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (deliveryId: string, status: Delivery['status'], notes?: string) => void;
}

const statusOptions: { value: Delivery['status']; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
];

const statusColors: Record<Delivery['status'], string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  assigned: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  picked_up: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  in_transit: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
};

export function DeliveryUpdate({ delivery, isOpen, onClose, onUpdateStatus }: DeliveryUpdateProps) {
  const [status, setStatus] = useState<Delivery['status']>(delivery?.status || 'pending');
  const [notes, setNotes] = useState('');

  if (!delivery) return null;

  const handleUpdate = () => {
    onUpdateStatus?.(delivery.id, status, notes || undefined);
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">UPDATE DELIVERY</DialogTitle>
          <DialogDescription>Update delivery status and add notes</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Delivery Details */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">{delivery.orderId}</span>
              <Badge variant="outline" className={statusColors[delivery.status]}>
                {delivery.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{delivery.customer.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{delivery.customer.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Scheduled: {format(delivery.scheduledTime, 'h:mm a')}</span>
              </div>
              {delivery.driver && (
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>Driver: {delivery.driver.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Update Status */}
          <div className="space-y-3">
            <Label className="font-display text-xs tracking-wider">UPDATE STATUS</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Delivery['status'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          statusColors[option.value].split(' ')[0]
                        }`}
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label className="font-display text-xs tracking-wider">NOTES (OPTIONAL)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add delivery notes (e.g., left at door, customer not home, etc.)"
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatus('picked_up')}
              disabled={delivery.status === 'delivered'}
            >
              Mark Picked Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatus('in_transit')}
              disabled={delivery.status === 'delivered'}
            >
              Start Delivery
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatus('delivered')}
              className="text-green-500 hover:text-green-500"
            >
              Mark Delivered
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={status === delivery.status && !notes}>
            Update Delivery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
