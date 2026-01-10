import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';

export interface Delivery {
  id: string;
  orderId: string;
  customer: {
    name: string;
    address: string;
    phone?: string;
  };
  driver?: {
    id: string;
    name: string;
  };
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  scheduledTime: Date;
  items: number;
}

interface DeliveryBoardProps {
  deliveries: Delivery[];
  onSelectDelivery?: (delivery: Delivery) => void;
}

const statusColumns: { key: Delivery['status']; label: string; color: string }[] = [
  { key: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { key: 'assigned', label: 'Assigned', color: 'bg-blue-500' },
  { key: 'picked_up', label: 'Picked Up', color: 'bg-purple-500' },
  { key: 'in_transit', label: 'In Transit', color: 'bg-orange-500' },
  { key: 'delivered', label: 'Delivered', color: 'bg-green-500' },
];

function DeliveryCard({
  delivery,
  onClick,
}: {
  delivery: Delivery;
  onClick?: () => void;
}) {
  const initials = delivery.customer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{delivery.customer.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{delivery.orderId}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {delivery.items} items
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{delivery.customer.address}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{format(delivery.scheduledTime, 'h:mm a')}</span>
          </div>
          {delivery.driver && (
            <div className="flex items-center gap-2 text-xs">
              <User className="h-3 w-3 text-muted-foreground" />
              <span>{delivery.driver.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DeliveryBoard({ deliveries, onSelectDelivery }: DeliveryBoardProps) {
  const getDeliveriesByStatus = (status: Delivery['status']) =>
    deliveries.filter((d) => d.status === status);

  return (
    <div className="grid grid-cols-5 gap-4 h-[calc(100vh-300px)] min-h-[500px]">
      {statusColumns.map((column) => {
        const columnDeliveries = getDeliveriesByStatus(column.key);

        return (
          <div key={column.key} className="flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                  <CardTitle className="font-display text-xs tracking-[0.1em]">
                    {column.label.toUpperCase()}
                  </CardTitle>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {columnDeliveries.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-2">
                <ScrollArea className="h-full">
                  <div className="space-y-2 pr-2">
                    {columnDeliveries.map((delivery) => (
                      <DeliveryCard
                        key={delivery.id}
                        delivery={delivery}
                        onClick={() => onSelectDelivery?.(delivery)}
                      />
                    ))}
                    {columnDeliveries.length === 0 && (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        No deliveries
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
