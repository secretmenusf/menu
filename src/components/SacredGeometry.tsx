const SacredGeometry = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rotating outer geometry */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 animate-rotate-slow"
        viewBox="0 0 400 400"
      >
        {/* Metatron's Cube outer circles */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const x = 200 + 100 * Math.cos((angle * Math.PI) / 180);
          const y = 200 + 100 * Math.sin((angle * Math.PI) / 180);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="50"
              fill="none"
              stroke="hsl(43 74% 49%)"
              strokeWidth="0.5"
              className="line-draw"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          );
        })}
        {/* Center circle */}
        <circle
          cx="200"
          cy="200"
          r="50"
          fill="none"
          stroke="hsl(43 74% 49%)"
          strokeWidth="0.5"
        />
        {/* Connecting lines forming hexagram */}
        <polygon
          points="200,100 287,150 287,250 200,300 113,250 113,150"
          fill="none"
          stroke="hsl(43 74% 49%)"
          strokeWidth="0.5"
        />
        <polygon
          points="200,100 287,250 113,250"
          fill="none"
          stroke="hsl(43 74% 49%)"
          strokeWidth="0.3"
        />
        <polygon
          points="200,300 287,150 113,150"
          fill="none"
          stroke="hsl(43 74% 49%)"
          strokeWidth="0.3"
        />
      </svg>

      {/* Inner rotating triangle */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-30"
        viewBox="0 0 200 200"
        style={{ animation: 'rotate-slow 40s linear infinite reverse' }}
      >
        <polygon
          points="100,20 180,160 20,160"
          fill="none"
          stroke="hsl(43 74% 49%)"
          strokeWidth="1"
        />
        {/* All-seeing eye in center */}
        <ellipse cx="100" cy="110" rx="25" ry="15" fill="none" stroke="hsl(43 74% 49%)" strokeWidth="0.8" />
        <circle cx="100" cy="110" r="8" fill="hsl(43 74% 49% / 0.3)" stroke="hsl(43 74% 49%)" strokeWidth="0.5" />
        <circle cx="100" cy="110" r="3" fill="hsl(43 74% 49%)" />
      </svg>

      {/* Ambient particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse-slow"
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
