// Monochrome supplier logos - styled to match brand aesthetic

export const RanchoGordoLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 120 40" className={className} fill="currentColor">
    <text x="60" y="16" textAnchor="middle" fontFamily="serif" fontSize="11" fontWeight="700" letterSpacing="0.5">
      RANCHO
    </text>
    <text x="60" y="30" textAnchor="middle" fontFamily="serif" fontSize="13" fontWeight="700" letterSpacing="1">
      GORDO
    </text>
    <line x1="20" y1="34" x2="100" y2="34" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

export const LakesideOrganicLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 140 40" className={className} fill="currentColor">
    <text x="70" y="15" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="600" letterSpacing="2">
      LAKESIDE
    </text>
    <text x="70" y="28" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="300" letterSpacing="3">
      ORGANIC
    </text>
    <text x="70" y="37" textAnchor="middle" fontFamily="sans-serif" fontSize="6" letterSpacing="1.5">
      GARDENS
    </text>
  </svg>
);

export const MontereyFishLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 140 40" className={className} fill="currentColor">
    <text x="70" y="14" textAnchor="middle" fontFamily="serif" fontSize="12" fontWeight="700" fontStyle="italic">
      Monterey
    </text>
    <text x="70" y="28" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="600" letterSpacing="2">
      FISH MARKET
    </text>
    <path d="M30 33 Q70 38 110 33" stroke="currentColor" fill="none" strokeWidth="0.5" />
  </svg>
);

export const CreamCoLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} fill="currentColor">
    <text x="50" y="22" textAnchor="middle" fontFamily="serif" fontSize="16" fontWeight="700" letterSpacing="1">
      Cream Co.
    </text>
    <circle cx="50" cy="32" r="2" fill="currentColor" />
  </svg>
);

export const PointReyesLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 130 40" className={className} fill="currentColor">
    <text x="65" y="14" textAnchor="middle" fontFamily="serif" fontSize="10" fontWeight="400" letterSpacing="1">
      POINT REYES
    </text>
    <text x="65" y="28" textAnchor="middle" fontFamily="serif" fontSize="12" fontWeight="700" letterSpacing="0.5">
      FARMSTEAD
    </text>
    <text x="65" y="37" textAnchor="middle" fontFamily="sans-serif" fontSize="6" letterSpacing="2">
      CHEESE COMPANY
    </text>
  </svg>
);

export const CowgirlCreameryLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 130 40" className={className} fill="currentColor">
    <text x="65" y="16" textAnchor="middle" fontFamily="serif" fontSize="13" fontWeight="700" fontStyle="italic">
      Cowgirl
    </text>
    <text x="65" y="30" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="600" letterSpacing="2">
      CREAMERY
    </text>
    <path d="M25 8 L35 3 L30 10 Z" fill="currentColor" opacity="0.7" />
  </svg>
);

export const MarysChickenLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 120 40" className={className} fill="currentColor">
    <text x="60" y="16" textAnchor="middle" fontFamily="script, cursive" fontSize="16" fontWeight="400">
      Mary's
    </text>
    <text x="60" y="30" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="600" letterSpacing="2">
      FREE RANGE
    </text>
    <line x1="25" y1="34" x2="95" y2="34" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

export const StraussLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 130 40" className={className} fill="currentColor">
    <text x="65" y="15" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="700" letterSpacing="2">
      STRAUS
    </text>
    <text x="65" y="27" textAnchor="middle" fontFamily="serif" fontSize="9" fontWeight="400" letterSpacing="0.5">
      Family Creamery
    </text>
    <rect x="20" y="32" width="90" height="1" fill="currentColor" opacity="0.5" />
  </svg>
);

export const BrokawLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 120 40" className={className} fill="currentColor">
    <text x="60" y="18" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fontWeight="700" letterSpacing="3">
      BROKAW
    </text>
    <text x="60" y="30" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight="400" letterSpacing="2">
      RANCH COMPANY
    </text>
  </svg>
);

export const HodoLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} fill="currentColor">
    <text x="50" y="24" textAnchor="middle" fontFamily="sans-serif" fontSize="18" fontWeight="800" letterSpacing="4">
      HODO
    </text>
    <text x="50" y="34" textAnchor="middle" fontFamily="sans-serif" fontSize="6" fontWeight="400" letterSpacing="1">
      FOODS
    </text>
  </svg>
);

// Certification logos
export const USDAOrganicLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 60 60" className={className} fill="currentColor">
    <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="2" />
    <text x="30" y="22" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="700">
      USDA
    </text>
    <text x="30" y="34" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight="600">
      ORGANIC
    </text>
    <path d="M20 42 Q30 48 40 42" stroke="currentColor" fill="none" strokeWidth="1" />
  </svg>
);

export const CertifiedHumaneLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 80 60" className={className} fill="currentColor">
    <rect x="5" y="10" width="70" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <text x="40" y="28" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight="700" letterSpacing="1">
      CERTIFIED
    </text>
    <text x="40" y="40" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="600" letterSpacing="0.5">
      HUMANE
    </text>
    <circle cx="40" cy="16" r="3" fill="currentColor" />
  </svg>
);

export const GrassFedLogo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 70 60" className={className} fill="currentColor">
    <ellipse cx="35" cy="30" rx="32" ry="26" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <text x="35" y="26" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight="700">
      100%
    </text>
    <text x="35" y="36" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="600" letterSpacing="0.5">
      GRASS-FED
    </text>
    {/* Grass blades */}
    <path d="M20 48 L22 42 L24 48" stroke="currentColor" fill="none" strokeWidth="1" />
    <path d="M33 48 L35 40 L37 48" stroke="currentColor" fill="none" strokeWidth="1" />
    <path d="M46 48 L48 42 L50 48" stroke="currentColor" fill="none" strokeWidth="1" />
  </svg>
);

// Logo map for easy access
export const supplierLogos: Record<string, React.FC<{ className?: string }>> = {
  'rancho-gordo': RanchoGordoLogo,
  'lakeside-organic': LakesideOrganicLogo,
  'monterey-fish': MontereyFishLogo,
  'cream-co': CreamCoLogo,
  'point-reyes': PointReyesLogo,
  'cowgirl-creamery': CowgirlCreameryLogo,
  'marys-chicken': MarysChickenLogo,
  'strauss': StraussLogo,
  'brokaw': BrokawLogo,
  'hodo': HodoLogo,
};

export const certificationLogos: Record<string, React.FC<{ className?: string }>> = {
  'usda-organic': USDAOrganicLogo,
  'certified-humane': CertifiedHumaneLogo,
  'grass-fed': GrassFedLogo,
};
