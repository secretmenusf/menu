import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrderContext, OrderStatus } from '@/contexts/OrderContext';

// Delivery driver location
export interface DriverLocation {
  lat: number;
  lng: number;
  heading?: number; // Direction in degrees
  speed?: number; // Speed in km/h
  updatedAt: Date;
}

// Delivery tracking state
export interface DeliveryTrackingState {
  orderId: string;
  status: OrderStatus;
  driverLocation: DriverLocation | null;
  estimatedArrival: Date | null;
  distanceRemaining: number | null; // in meters
  isLive: boolean;
}

// Status step for progress display
export interface StatusStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: Date;
  isComplete: boolean;
  isCurrent: boolean;
}

// Order status progression
const STATUS_ORDER: OrderStatus[] = [
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
];

// Get readable labels for statuses
const STATUS_LABELS: Record<OrderStatus, { label: string; description: string }> = {
  draft: { label: 'Draft', description: 'Order not yet submitted' },
  confirmed: { label: 'Confirmed', description: 'Your order has been received' },
  preparing: { label: 'Preparing', description: 'Chef is preparing your meals' },
  out_for_delivery: { label: 'On the Way', description: 'Driver is heading to you' },
  delivered: { label: 'Delivered', description: 'Enjoy your meal!' },
  cancelled: { label: 'Cancelled', description: 'Order was cancelled' },
};

interface UseDeliveryTrackingOptions {
  orderId: string;
  enabled?: boolean;
}

export function useDeliveryTracking({
  orderId,
  enabled = true,
}: UseDeliveryTrackingOptions) {
  const { updateOrderStatus } = useOrderContext();

  const [tracking, setTracking] = useState<DeliveryTrackingState>({
    orderId,
    status: 'confirmed',
    driverLocation: null,
    estimatedArrival: null,
    distanceRemaining: null,
    isLive: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Subscribe to order status changes via Supabase realtime
  useEffect(() => {
    if (!enabled || !orderId) return;

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newStatus = payload.new.status as OrderStatus;
          setTracking((prev) => ({
            ...prev,
            status: newStatus,
          }));
          updateOrderStatus(orderId, newStatus);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'CHANNEL_ERROR') {
          setError('Failed to connect to delivery updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, enabled, updateOrderStatus]);

  // Simulate driver location updates when out for delivery
  // In production, this would come from a real-time driver tracking service
  useEffect(() => {
    if (tracking.status !== 'out_for_delivery') {
      setTracking((prev) => ({
        ...prev,
        driverLocation: null,
        isLive: false,
      }));
      return;
    }

    // Simulate initial driver location
    const baseLocation = {
      lat: 37.7749, // San Francisco coordinates
      lng: -122.4194,
    };

    const initialLocation: DriverLocation = {
      ...baseLocation,
      heading: 45,
      speed: 0,
      updatedAt: new Date(),
    };

    setTracking((prev) => ({
      ...prev,
      driverLocation: initialLocation,
      isLive: true,
      estimatedArrival: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes
      distanceRemaining: 3500, // 3.5 km
    }));

    // Simulate periodic location updates
    const interval = setInterval(() => {
      setTracking((prev) => {
        if (!prev.driverLocation || prev.status !== 'out_for_delivery') {
          return prev;
        }

        // Simulate movement
        const newDistance = Math.max(0, (prev.distanceRemaining || 3500) - 150);
        const eta = new Date(Date.now() + (newDistance / 3500) * 20 * 60 * 1000);

        return {
          ...prev,
          driverLocation: {
            lat: prev.driverLocation.lat + (Math.random() - 0.5) * 0.002,
            lng: prev.driverLocation.lng + (Math.random() - 0.5) * 0.002,
            heading: Math.floor(Math.random() * 360),
            speed: 25 + Math.random() * 15,
            updatedAt: new Date(),
          },
          estimatedArrival: eta,
          distanceRemaining: newDistance,
        };
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [tracking.status]);

  // Get status steps for progress display
  const getStatusSteps = useCallback((): StatusStep[] => {
    const currentIndex = STATUS_ORDER.indexOf(tracking.status);

    return STATUS_ORDER.map((status, index) => ({
      status,
      ...STATUS_LABELS[status],
      isComplete: index < currentIndex,
      isCurrent: index === currentIndex,
    }));
  }, [tracking.status]);

  // Get progress percentage (0-100)
  const getProgressPercentage = useCallback((): number => {
    const currentIndex = STATUS_ORDER.indexOf(tracking.status);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / STATUS_ORDER.length) * 100;
  }, [tracking.status]);

  // Format ETA for display
  const formatETA = useCallback((): string | null => {
    if (!tracking.estimatedArrival) return null;

    const now = new Date();
    const diff = tracking.estimatedArrival.getTime() - now.getTime();

    if (diff <= 0) return 'Arriving now';

    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }, [tracking.estimatedArrival]);

  // Format distance for display
  const formatDistance = useCallback((): string | null => {
    if (tracking.distanceRemaining === null) return null;

    if (tracking.distanceRemaining < 1000) {
      return `${Math.round(tracking.distanceRemaining)} m`;
    }

    return `${(tracking.distanceRemaining / 1000).toFixed(1)} km`;
  }, [tracking.distanceRemaining]);

  // Check if order is trackable (has real-time updates)
  const isTrackable = useCallback((): boolean => {
    return (
      tracking.status === 'out_for_delivery' ||
      tracking.status === 'preparing' ||
      tracking.status === 'confirmed'
    );
  }, [tracking.status]);

  return {
    // State
    tracking,
    error,
    isConnected,

    // Status helpers
    getStatusSteps,
    getProgressPercentage,
    isTrackable,

    // Display formatters
    formatETA,
    formatDistance,

    // Raw status info
    statusLabels: STATUS_LABELS,
  };
}

export default useDeliveryTracking;
