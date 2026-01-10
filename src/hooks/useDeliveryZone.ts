import { useState, useCallback, useMemo } from 'react';
import {
  DeliveryZone,
  deliveryZones,
  getZoneByZipCode,
  isZipCodeSupported,
  getAllSupportedZipCodes
} from '@/data/deliveryZones';

export interface UseDeliveryZoneResult {
  zone: DeliveryZone | null;
  isSupported: boolean;
  isChecking: boolean;
  error: string | null;
  checkZipCode: (zipCode: string) => void;
  reset: () => void;
  allZones: DeliveryZone[];
  supportedZipCodes: string[];
}

export const useDeliveryZone = (): UseDeliveryZoneResult => {
  const [zone, setZone] = useState<DeliveryZone | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const supportedZipCodes = useMemo(() => getAllSupportedZipCodes(), []);

  const checkZipCode = useCallback((zipCode: string) => {
    setIsChecking(true);
    setError(null);

    // Clean and validate zip code
    const cleanZip = zipCode.trim().replace(/\D/g, '').slice(0, 5);

    if (cleanZip.length !== 5) {
      setError('Please enter a valid 5-digit zip code');
      setZone(null);
      setIsSupported(false);
      setIsChecking(false);
      return;
    }

    // Simulate brief check delay for UX
    setTimeout(() => {
      const foundZone = getZoneByZipCode(cleanZip);
      const supported = isZipCodeSupported(cleanZip);

      setZone(foundZone);
      setIsSupported(supported);

      if (!supported) {
        setError('Sorry, we do not currently deliver to this area');
      }

      setIsChecking(false);
    }, 300);
  }, []);

  const reset = useCallback(() => {
    setZone(null);
    setIsSupported(false);
    setIsChecking(false);
    setError(null);
  }, []);

  return {
    zone,
    isSupported,
    isChecking,
    error,
    checkZipCode,
    reset,
    allZones: deliveryZones,
    supportedZipCodes
  };
};

// Extract zip code from address string
export const extractZipCode = (address: string): string | null => {
  const zipMatch = address.match(/\b\d{5}(-\d{4})?\b/);
  return zipMatch ? zipMatch[0].slice(0, 5) : null;
};
