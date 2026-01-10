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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Clock, MapPin, Phone, User } from 'lucide-react';
import { format } from 'date-fns';
import type { Delivery } from './DeliveryBoard';

interface Driver {
  id: string;
  name: string;
  phone: string;
  activeDeliveries: number;
  status: 'available' | 'busy' | 'offline';
}

interface DriverAssignmentProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign?: (deliveryId: string, driverId: string) => void;
}

const mockDrivers: Driver[] = [
  { id: 'DRV-001', name: 'John Smith', phone: '+1 415 555 1001', activeDeliveries: 2, status: 'available' },
  { id: 'DRV-002', name: 'Sarah Lee', phone: '+1 415 555 1002', activeDeliveries: 3, status: 'busy' },
  { id: 'DRV-003', name: 'Mike Johnson', phone: '+1 415 555 1003', activeDeliveries: 0, status: 'available' },
  { id: 'DRV-004', name: 'Emma Wilson', phone: '+1 415 555 1004', activeDeliveries: 0, status: 'offline' },
];

const driverStatusColors: Record<Driver['status'], string> = {
  available: 'bg-green-500/10 text-green-500 border-green-500/20',
  busy: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  offline: 'bg-muted text-muted-foreground border-muted-foreground/20',
};

export function DriverAssignment({ delivery, isOpen, onClose, onAssign }: DriverAssignmentProps) {
  const [selectedDriver, setSelectedDriver] = useState<string>('');

  if (!delivery) return null;

  const handleAssign = () => {
    if (selectedDriver) {
      onAssign?.(delivery.id, selectedDriver);
      setSelectedDriver('');
      onClose();
    }
  };

  const availableDrivers = mockDrivers.filter((d) => d.status !== 'offline');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">ASSIGN DRIVER</DialogTitle>
          <DialogDescription>Assign a driver to this delivery</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Delivery Details */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">{delivery.orderId}</span>
              <Badge variant="outline">{delivery.items} items</Badge>
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
              {delivery.customer.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{delivery.customer.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Driver Selection */}
          <div className="space-y-3">
            <Label className="font-display text-xs tracking-wider">SELECT DRIVER</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a driver" />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {driver.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{driver.name}</span>
                      <Badge
                        variant="outline"
                        className={driverStatusColors[driver.status]}
                      >
                        {driver.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {driver.activeDeliveries} active
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Driver Info */}
          {selectedDriver && (
            <div className="p-4 border rounded-lg space-y-2">
              {(() => {
                const driver = mockDrivers.find((d) => d.id === selectedDriver);
                if (!driver) return null;
                return (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {driver.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-muted-foreground">{driver.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span>
                        Status:{' '}
                        <Badge variant="outline" className={driverStatusColors[driver.status]}>
                          {driver.status}
                        </Badge>
                      </span>
                      <span>Active Deliveries: {driver.activeDeliveries}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedDriver}>
            Assign Driver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
