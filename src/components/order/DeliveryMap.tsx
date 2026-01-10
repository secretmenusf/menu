import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DriverLocation } from '@/hooks/useDeliveryTracking';

interface DeliveryMapProps {
  driverLocation?: DriverLocation | null;
  destinationAddress?: string;
  destinationCoords?: { lat: number; lng: number };
  className?: string;
}

// Placeholder map component
// In production, integrate with Mapbox or Google Maps
export function DeliveryMap({
  driverLocation,
  destinationAddress,
  destinationCoords,
  className = '',
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(14);

  // Calculate center point between driver and destination
  const center = driverLocation && destinationCoords
    ? {
        lat: (driverLocation.lat + destinationCoords.lat) / 2,
        lng: (driverLocation.lng + destinationCoords.lng) / 2,
      }
    : driverLocation || destinationCoords || { lat: 37.7749, lng: -122.4194 };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 1, 18));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 1, 10));

  return (
    <Card className={`border-border/30 bg-card/30 overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-sm tracking-[0.15em] flex items-center gap-2">
            <Navigation size={16} className="text-gold" />
            LIVE TRACKING
          </CardTitle>
          {driverLocation && (
            <span className="flex items-center gap-1.5 text-xs text-green-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Map container - placeholder for actual map integration */}
        <div
          ref={mapRef}
          className="relative w-full h-64 sm:h-80 bg-obsidian overflow-hidden"
        >
          {/* Map placeholder with grid */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* San Francisco map hint text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground/30">
              <MapPin size={48} className="mx-auto mb-2" />
              <p className="font-display text-sm tracking-wider">
                San Francisco
              </p>
            </div>
          </div>

          {/* Driver marker */}
          {driverLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                // Position based on relative coords (simplified for placeholder)
                left: '40%',
                top: '60%',
              }}
            >
              <div className="relative">
                {/* Pulse ring */}
                <div className="absolute inset-0 w-12 h-12 -ml-3 -mt-3 rounded-full bg-gold/20 animate-ping" />
                {/* Driver icon */}
                <div className="relative w-6 h-6 rounded-full bg-gold flex items-center justify-center shadow-lg">
                  <Navigation
                    size={14}
                    className="text-background"
                    style={{
                      transform: `rotate(${driverLocation.heading || 0}deg)`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Destination marker */}
          {destinationCoords && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-full z-10"
              style={{
                // Position based on relative coords (simplified for placeholder)
                left: '70%',
                top: '35%',
              }}
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <MapPin size={16} className="text-background" />
                </div>
                <div className="w-0.5 h-3 bg-green-500" />
              </div>
            </div>
          )}

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomIn}
              className="w-8 h-8"
            >
              <ZoomIn size={14} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomOut}
              className="w-8 h-8"
            >
              <ZoomOut size={14} />
            </Button>
          </div>

          {/* Map attribution placeholder */}
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground/50">
            Map data placeholder
          </div>
        </div>

        {/* Destination address */}
        {destinationAddress && (
          <div className="p-4 border-t border-border/30">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-xs tracking-wider text-muted-foreground">
                  DELIVERING TO
                </p>
                <p className="font-body text-foreground mt-0.5">
                  {destinationAddress}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No driver location message */}
        {!driverLocation && (
          <div className="p-4 border-t border-border/30 text-center">
            <p className="font-body text-sm text-muted-foreground">
              Driver location will appear when order is out for delivery
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Instructions for production implementation
export const MapIntegrationNotes = `
To integrate with Mapbox or Google Maps:

1. Mapbox:
   - Install: npm install mapbox-gl react-map-gl
   - Get API key from https://account.mapbox.com/
   - Add VITE_MAPBOX_TOKEN to .env

2. Google Maps:
   - Install: npm install @react-google-maps/api
   - Get API key from https://console.cloud.google.com/
   - Add VITE_GOOGLE_MAPS_KEY to .env

Example Mapbox integration:
\`\`\`tsx
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

<Map
  mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
  initialViewState={{
    longitude: center.lng,
    latitude: center.lat,
    zoom: 14
  }}
  style={{ width: '100%', height: 320 }}
  mapStyle="mapbox://styles/mapbox/dark-v11"
>
  {driverLocation && (
    <Marker longitude={driverLocation.lng} latitude={driverLocation.lat}>
      <NavigationIcon />
    </Marker>
  )}
</Map>
\`\`\`
`;

export default DeliveryMap;
