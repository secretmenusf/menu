// Delivery zones for SF Secret Menu
// Fee structure: $0 for core SF, $5-15 for surrounding areas

export interface DeliveryZone {
  id: string;
  name: string;
  zipCodes: string[];
  fee: number;
  estimatedMinutes?: number;
}

export const deliveryZones: DeliveryZone[] = [
  {
    id: 'sf-downtown',
    name: 'SF Downtown',
    zipCodes: ['94102', '94103', '94104', '94105', '94107', '94108', '94109', '94110', '94111'],
    fee: 0,
    estimatedMinutes: 20
  },
  {
    id: 'sf-mission',
    name: 'Mission/Castro',
    zipCodes: ['94110', '94114', '94131'],
    fee: 0,
    estimatedMinutes: 25
  },
  {
    id: 'sf-marina',
    name: 'Marina/Presidio',
    zipCodes: ['94123', '94129'],
    fee: 0,
    estimatedMinutes: 30
  },
  {
    id: 'sf-sunset',
    name: 'Sunset/Richmond',
    zipCodes: ['94116', '94118', '94121', '94122'],
    fee: 5,
    estimatedMinutes: 35
  },
  {
    id: 'oakland',
    name: 'Oakland',
    zipCodes: ['94601', '94602', '94603', '94605', '94606', '94607', '94608', '94609', '94610', '94611', '94612'],
    fee: 10,
    estimatedMinutes: 40
  },
  {
    id: 'berkeley',
    name: 'Berkeley',
    zipCodes: ['94701', '94702', '94703', '94704', '94705', '94707', '94708', '94709', '94710'],
    fee: 10,
    estimatedMinutes: 45
  },
  {
    id: 'peninsula',
    name: 'Peninsula',
    zipCodes: ['94010', '94014', '94015', '94025', '94027', '94028', '94030', '94401', '94402', '94403'],
    fee: 15,
    estimatedMinutes: 50
  },
];

// Get all supported zip codes as a flat list
export const getAllSupportedZipCodes = (): string[] => {
  const allZips = new Set<string>();
  deliveryZones.forEach(zone => {
    zone.zipCodes.forEach(zip => allZips.add(zip));
  });
  return Array.from(allZips);
};

// Find zone by zip code
export const getZoneByZipCode = (zipCode: string): DeliveryZone | null => {
  return deliveryZones.find(zone => zone.zipCodes.includes(zipCode)) || null;
};

// Check if zip code is supported
export const isZipCodeSupported = (zipCode: string): boolean => {
  return getAllSupportedZipCodes().includes(zipCode);
};
