import { useState, useEffect } from 'react';
import { MapPin, Check, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDeliveryZone, extractZipCode } from '@/hooks/useDeliveryZone';
import { cn } from '@/lib/utils';

interface ZoneCheckerProps {
  onZoneConfirmed?: (zone: { id: string; name: string; fee: number } | null) => void;
  className?: string;
  initialAddress?: string;
}

export const ZoneChecker = ({ onZoneConfirmed, className, initialAddress = '' }: ZoneCheckerProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [zipCode, setZipCode] = useState('');
  const { zone, isSupported, isChecking, error, checkZipCode, reset } = useDeliveryZone();

  // Extract zip code from address as user types
  useEffect(() => {
    const extracted = extractZipCode(address);
    if (extracted && extracted !== zipCode) {
      setZipCode(extracted);
    }
  }, [address, zipCode]);

  // Notify parent when zone changes
  useEffect(() => {
    if (onZoneConfirmed) {
      onZoneConfirmed(zone);
    }
  }, [zone, onZoneConfirmed]);

  const handleCheck = () => {
    if (zipCode) {
      checkZipCode(zipCode);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
    if (zone) {
      reset();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && zipCode.length === 5) {
      handleCheck();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Address Input */}
      <div className="space-y-2">
        <Label className="font-display text-xs tracking-wider text-muted-foreground">
          DELIVERY ADDRESS
        </Label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            className="pl-10 bg-transparent"
          />
        </div>
      </div>

      {/* Zip Code Input */}
      <div className="space-y-2">
        <Label className="font-display text-xs tracking-wider text-muted-foreground">
          ZIP CODE
        </Label>
        <div className="flex gap-2">
          <Input
            value={zipCode}
            onChange={handleZipCodeChange}
            onKeyDown={handleKeyDown}
            placeholder="94102"
            className="bg-transparent flex-1"
            maxLength={5}
          />
          <Button
            onClick={handleCheck}
            disabled={zipCode.length !== 5 || isChecking}
            variant="outline"
            className="font-display text-xs tracking-wider"
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'CHECK'
            )}
          </Button>
        </div>
      </div>

      {/* Result Display */}
      {zone && isSupported && (
        <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-display text-sm tracking-wider text-foreground">
                {zone.name}
              </p>
              <p className="font-body text-sm text-muted-foreground mt-1">
                {zone.fee === 0 ? (
                  <span className="text-primary">Free delivery</span>
                ) : (
                  <span>${zone.fee} delivery fee</span>
                )}
              </p>
              {zone.estimatedMinutes && (
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Estimated delivery: {zone.estimatedMinutes} minutes
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && !isChecking && (
        <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <X className="h-4 w-4 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="font-body text-sm text-muted-foreground">
                {error}
              </p>
              <p className="font-body text-xs text-muted-foreground mt-2">
                Contact us for special delivery arrangements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Zone List (collapsed by default) */}
      <details className="group">
        <summary className="font-display text-xs tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          VIEW ALL DELIVERY ZONES
        </summary>
        <div className="mt-3 space-y-2 pl-2 border-l border-border/30">
          {['sf-downtown', 'sf-mission', 'sf-marina'].map((id) => (
            <div key={id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {id === 'sf-downtown' ? 'SF Downtown' : id === 'sf-mission' ? 'Mission/Castro' : 'Marina/Presidio'}
              </span>
              <span className="text-primary font-display text-xs">FREE</span>
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sunset/Richmond</span>
            <span className="font-display text-xs">$5</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Oakland / Berkeley</span>
            <span className="font-display text-xs">$10</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Peninsula</span>
            <span className="font-display text-xs">$15</span>
          </div>
        </div>
      </details>
    </div>
  );
};

export default ZoneChecker;
