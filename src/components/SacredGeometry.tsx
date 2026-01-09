import SeedOfLife3D from './SeedOfLife3D';

const SacredGeometry = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large rotating Seed of Life in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40">
        <SeedOfLife3D size={500} />
      </div>

      {/* Ambient particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-foreground/10 rounded-full animate-pulse-slow"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SacredGeometry;
