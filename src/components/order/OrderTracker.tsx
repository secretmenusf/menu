import { useMemo } from 'react';
import {
  Clock,
  ChefHat,
  Truck,
  CheckCircle2,
  Circle,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { OrderStatus } from '@/contexts/OrderContext';
import { useDeliveryTracking, StatusStep } from '@/hooks/useDeliveryTracking';

// Status step icons
const STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
  draft: Circle,
  confirmed: CheckCircle2,
  preparing: ChefHat,
  out_for_delivery: Truck,
  delivered: CheckCircle2,
  cancelled: Circle,
};

interface OrderTrackerProps {
  orderId: string;
  initialStatus?: OrderStatus;
  showMap?: boolean;
  compact?: boolean;
}

// Single step in the progress tracker
function TrackerStep({
  step,
  isLast,
}: {
  step: StatusStep;
  isLast: boolean;
}) {
  const Icon = STATUS_ICONS[step.status];

  return (
    <div className="flex items-start gap-3">
      {/* Icon and line */}
      <div className="flex flex-col items-center">
        <div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center shrink-0
            transition-colors duration-300
            ${
              step.isComplete
                ? 'bg-green-500/20 text-green-500'
                : step.isCurrent
                ? 'bg-gold/20 text-gold animate-pulse'
                : 'bg-secondary text-muted-foreground'
            }
          `}
        >
          <Icon size={20} />
        </div>
        {!isLast && (
          <div
            className={`
              w-0.5 h-12 mt-1
              ${step.isComplete ? 'bg-green-500/50' : 'bg-border'}
            `}
          />
        )}
      </div>

      {/* Content */}
      <div className="pt-2 pb-6">
        <p
          className={`
            font-display text-sm tracking-wider
            ${step.isCurrent ? 'text-gold' : step.isComplete ? 'text-foreground' : 'text-muted-foreground'}
          `}
        >
          {step.label}
        </p>
        <p className="font-body text-sm text-muted-foreground mt-0.5">
          {step.description}
        </p>
        {step.timestamp && (
          <p className="font-body text-xs text-muted-foreground mt-1">
            {step.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
}

// Compact progress bar version
function CompactTracker({
  steps,
  progress,
}: {
  steps: StatusStep[];
  progress: number;
}) {
  const currentStep = steps.find((s) => s.isCurrent);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentStep && (
            <>
              {(() => {
                const Icon = STATUS_ICONS[currentStep.status];
                return <Icon size={18} className="text-gold" />;
              })()}
              <span className="font-display text-sm tracking-wider text-foreground">
                {currentStep.label}
              </span>
            </>
          )}
        </div>
        <span className="font-body text-xs text-muted-foreground">
          Step {steps.findIndex((s) => s.isCurrent) + 1} of {steps.length}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="font-body text-sm text-muted-foreground">
        {currentStep?.description}
      </p>
    </div>
  );
}

export function OrderTracker({
  orderId,
  initialStatus,
  showMap = true,
  compact = false,
}: OrderTrackerProps) {
  const {
    tracking,
    getStatusSteps,
    getProgressPercentage,
    formatETA,
    formatDistance,
    isConnected,
  } = useDeliveryTracking({ orderId });

  const steps = getStatusSteps();
  const progress = getProgressPercentage();
  const eta = formatETA();
  const distance = formatDistance();

  // Check if order is in transit
  const isInTransit = tracking.status === 'out_for_delivery';

  if (compact) {
    return (
      <Card className="border-border/30 bg-card/30">
        <CardContent className="py-4">
          <CompactTracker steps={steps} progress={progress} />

          {/* ETA info for in-transit orders */}
          {isInTransit && eta && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gold" />
                <span className="font-display text-sm tracking-wider">
                  {eta}
                </span>
              </div>
              {distance && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span className="font-body text-sm text-muted-foreground">
                    {distance} away
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/30 bg-card/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-sm tracking-[0.15em]">
            ORDER STATUS
          </CardTitle>
          {isConnected && tracking.isLive && (
            <span className="flex items-center gap-1.5 text-xs text-green-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress steps */}
        <div className="space-y-0">
          {steps.map((step, index) => (
            <TrackerStep
              key={step.status}
              step={step}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* In-transit details */}
        {isInTransit && (
          <div className="mt-6 pt-6 border-t border-border/30">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* ETA */}
              {eta && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gold/5 border border-gold/20">
                  <div className="p-2 rounded-full bg-gold/20">
                    <Clock size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-display text-xs tracking-wider text-muted-foreground">
                      ESTIMATED ARRIVAL
                    </p>
                    <p className="font-display text-xl tracking-wider text-gold">
                      {eta}
                    </p>
                  </div>
                </div>
              )}

              {/* Distance */}
              {distance && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <div className="p-2 rounded-full bg-secondary">
                    <MapPin size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-display text-xs tracking-wider text-muted-foreground">
                      DISTANCE
                    </p>
                    <p className="font-display text-xl tracking-wider text-foreground">
                      {distance}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Driver info placeholder */}
            {tracking.driverLocation && (
              <div className="mt-4 p-4 rounded-lg bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Truck size={18} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-foreground">Driver en route</p>
                    <p className="font-body text-sm text-muted-foreground">
                      Your order is on its way
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delivered message */}
        {tracking.status === 'delivered' && (
          <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-green-500" />
              <div>
                <p className="font-display text-sm tracking-wider text-foreground">
                  Order Delivered
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  Enjoy your meal!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default OrderTracker;
