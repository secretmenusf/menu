import { useMemo } from 'react';
import { Clock, MapPin, Truck, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DriverLocation } from '@/hooks/useDeliveryTracking';

interface DeliveryETAProps {
  estimatedArrival?: Date | null;
  driverLocation?: DriverLocation | null;
  distanceRemaining?: number | null; // in meters
  isLive?: boolean;
  compact?: boolean;
}

// Format time remaining
function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Arriving now';

  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

// Format distance
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

// Calculate progress percentage based on time
function calculateProgress(arrival: Date, totalEstimatedMinutes: number = 30): number {
  const now = new Date();
  const remaining = arrival.getTime() - now.getTime();
  const totalMs = totalEstimatedMinutes * 60 * 1000;
  const elapsed = totalMs - remaining;
  const progress = Math.min(100, Math.max(0, (elapsed / totalMs) * 100));
  return progress;
}

export function DeliveryETA({
  estimatedArrival,
  driverLocation,
  distanceRemaining,
  isLive = false,
  compact = false,
}: DeliveryETAProps) {
  // Calculate time remaining
  const timeInfo = useMemo(() => {
    if (!estimatedArrival) return null;

    const now = new Date();
    const remaining = estimatedArrival.getTime() - now.getTime();
    const formatted = formatTimeRemaining(remaining);
    const progress = calculateProgress(estimatedArrival);
    const arrivalTime = estimatedArrival.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });

    return { remaining, formatted, progress, arrivalTime };
  }, [estimatedArrival]);

  // Format distance
  const distanceFormatted = useMemo(() => {
    if (!distanceRemaining) return null;
    return formatDistance(distanceRemaining);
  }, [distanceRemaining]);

  if (!estimatedArrival && !driverLocation) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 rounded-lg bg-gold/5 border border-gold/20">
        <div className="p-2 rounded-full bg-gold/20">
          <Clock size={18} className="text-gold" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {timeInfo && (
              <span className="font-display text-lg tracking-wider text-gold">
                {timeInfo.formatted}
              </span>
            )}
            {isLive && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          {timeInfo && (
            <p className="font-body text-xs text-muted-foreground">
              ETA {timeInfo.arrivalTime}
            </p>
          )}
        </div>
        {distanceFormatted && (
          <div className="text-right">
            <span className="font-display text-sm tracking-wider text-muted-foreground">
              {distanceFormatted}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-border/30 bg-card/30">
      <CardContent className="p-6">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* ETA Section */}
          {timeInfo && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-gold/20">
                  <Clock size={24} className="text-gold" />
                </div>
                <div>
                  <p className="font-display text-xs tracking-wider text-muted-foreground">
                    ESTIMATED ARRIVAL
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-3xl tracking-wider text-gold">
                      {timeInfo.formatted}
                    </span>
                    {isLive && (
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <Progress value={timeInfo.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Started</span>
                  <span>ETA {timeInfo.arrivalTime}</span>
                </div>
              </div>
            </div>
          )}

          {/* Distance & Driver Section */}
          <div className="space-y-4">
            {distanceFormatted && (
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-secondary">
                  <MapPin size={24} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="font-display text-xs tracking-wider text-muted-foreground">
                    DISTANCE REMAINING
                  </p>
                  <span className="font-display text-2xl tracking-wider text-foreground">
                    {distanceFormatted}
                  </span>
                </div>
              </div>
            )}

            {/* Driver info */}
            {driverLocation && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30 border border-border/30">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <Truck size={18} className="text-gold" />
                </div>
                <div className="flex-1">
                  <p className="font-body text-sm text-foreground">
                    Driver on the way
                  </p>
                  {driverLocation.speed && driverLocation.speed > 0 && (
                    <p className="font-body text-xs text-muted-foreground">
                      {Math.round(driverLocation.speed)} km/h
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Navigation
                    size={14}
                    style={{
                      transform: `rotate(${driverLocation.heading || 0}deg)`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Arriving soon notification */}
        {timeInfo && timeInfo.remaining > 0 && timeInfo.remaining <= 5 * 60 * 1000 && (
          <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-green-500" />
              <p className="font-body text-sm text-foreground">
                Driver is almost there! Please be ready to receive your order.
              </p>
            </div>
          </div>
        )}

        {/* Arrived */}
        {timeInfo && timeInfo.remaining <= 0 && (
          <div className="mt-4 p-4 rounded-lg bg-gold/10 border border-gold/20">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-gold" />
              <p className="font-body text-sm text-foreground">
                Your driver has arrived or is arriving shortly.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DeliveryETA;
