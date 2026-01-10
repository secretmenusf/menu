import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeliveryBoard, type Delivery } from '@/components/admin/DeliveryBoard';
import { DriverAssignment } from '@/components/admin/DriverAssignment';
import { DeliveryUpdate } from '@/components/admin/DeliveryUpdate';
import { Calendar, Truck, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const mockDeliveries: Delivery[] = [
  {
    id: 'DEL-001',
    orderId: 'ORD-001',
    customer: { name: 'Alex Chen', address: '123 Mission St, SF', phone: '+1 415 555 0123' },
    status: 'pending',
    scheduledTime: new Date(new Date().setHours(12, 0)),
    items: 4,
  },
  {
    id: 'DEL-002',
    orderId: 'ORD-002',
    customer: { name: 'Maria Santos', address: '456 Market St, SF' },
    driver: { id: 'DRV-001', name: 'John Smith' },
    status: 'assigned',
    scheduledTime: new Date(new Date().setHours(13, 30)),
    items: 6,
  },
  {
    id: 'DEL-003',
    orderId: 'ORD-003',
    customer: { name: 'James Wilson', address: '789 Valencia St, SF', phone: '+1 415 555 0456' },
    driver: { id: 'DRV-002', name: 'Sarah Lee' },
    status: 'picked_up',
    scheduledTime: new Date(new Date().setHours(14, 0)),
    items: 3,
  },
  {
    id: 'DEL-004',
    orderId: 'ORD-004',
    customer: { name: 'Emily Davis', address: '321 Hayes St, SF' },
    driver: { id: 'DRV-001', name: 'John Smith' },
    status: 'in_transit',
    scheduledTime: new Date(new Date().setHours(11, 30)),
    items: 8,
  },
  {
    id: 'DEL-005',
    orderId: 'ORD-005',
    customer: { name: 'Michael Brown', address: '654 Polk St, SF', phone: '+1 415 555 0789' },
    driver: { id: 'DRV-003', name: 'Mike Johnson' },
    status: 'delivered',
    scheduledTime: new Date(new Date().setHours(10, 0)),
    items: 5,
  },
  {
    id: 'DEL-006',
    orderId: 'ORD-006',
    customer: { name: 'Sarah Johnson', address: '987 Divisadero St, SF' },
    status: 'pending',
    scheduledTime: new Date(new Date().setHours(15, 0)),
    items: 2,
  },
  {
    id: 'DEL-007',
    orderId: 'ORD-007',
    customer: { name: 'David Kim', address: '147 Fillmore St, SF' },
    driver: { id: 'DRV-002', name: 'Sarah Lee' },
    status: 'in_transit',
    scheduledTime: new Date(new Date().setHours(12, 30)),
    items: 4,
  },
];

export default function Deliveries() {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [view, setView] = useState<'board' | 'list'>('board');

  const stats = {
    total: mockDeliveries.length,
    pending: mockDeliveries.filter((d) => d.status === 'pending').length,
    inProgress: mockDeliveries.filter((d) =>
      ['assigned', 'picked_up', 'in_transit'].includes(d.status)
    ).length,
    completed: mockDeliveries.filter((d) => d.status === 'delivered').length,
  };

  const handleSelectDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    if (delivery.status === 'pending') {
      setIsAssignOpen(true);
    } else {
      setIsUpdateOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-[0.1em] mb-2">DELIVERIES</h1>
          <p className="text-muted-foreground font-body">
            Today, {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as 'board' | 'list')}>
            <TabsList>
              <TabsTrigger value="board" className="font-display text-xs tracking-wider">
                BOARD
              </TabsTrigger>
              <TabsTrigger value="list" className="font-display text-xs tracking-wider">
                LIST
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Truck className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Board */}
      {view === 'board' ? (
        <DeliveryBoard deliveries={mockDeliveries} onSelectDelivery={handleSelectDelivery} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-sm tracking-[0.1em]">
              ALL DELIVERIES
            </CardTitle>
            <CardDescription>Click on a delivery to manage it</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  onClick={() => handleSelectDelivery(delivery)}
                  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-mono text-sm">{delivery.orderId}</p>
                      <p className="text-sm text-muted-foreground">{delivery.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {format(delivery.scheduledTime, 'h:mm a')}
                    </span>
                    <span className="text-xs capitalize px-2 py-1 rounded-full bg-muted">
                      {delivery.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Driver Assignment Modal */}
      <DriverAssignment
        delivery={selectedDelivery}
        isOpen={isAssignOpen}
        onClose={() => {
          setIsAssignOpen(false);
          setSelectedDelivery(null);
        }}
        onAssign={(deliveryId, driverId) => {
          console.log('Assign driver:', deliveryId, driverId);
        }}
      />

      {/* Delivery Update Modal */}
      <DeliveryUpdate
        delivery={selectedDelivery}
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedDelivery(null);
        }}
        onUpdateStatus={(deliveryId, status, notes) => {
          console.log('Update delivery:', deliveryId, status, notes);
        }}
      />
    </div>
  );
}
