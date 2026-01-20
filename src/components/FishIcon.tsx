interface FishIconProps {
  className?: string;
  size?: number;
}

const FishIcon = ({ className = "", size = 24 }: FishIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fish body - elegant curved shape matching Lucide style */}
      <path d="M6.5 12c0 0 1.5-5 6.5-5c3.5 0 6 2 8 5c-2 3-4.5 5-8 5c-5 0-6.5-5-6.5-5z" />
      {/* Tail fin */}
      <path d="M3.5 9c1 1.5 1.5 3 1.5 3s-0.5 1.5-1.5 3" />
      {/* Eye - small circle */}
      <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
};

export default FishIcon;
