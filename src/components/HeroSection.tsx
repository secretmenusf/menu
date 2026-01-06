import SacredGeometry from './SacredGeometry';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-void overflow-hidden">
      <SacredGeometry />
      
      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(0_0%_3%)_70%)]" />
      
      <div className="relative z-10 text-center px-6 animate-reveal">
        {/* Mystical symbol */}
        <div className="mb-8 text-primary text-6xl animate-float">△</div>
        
        <p className="font-body text-lg tracking-[0.5em] text-muted-foreground mb-4 uppercase">
          By Invitation Only
        </p>
        
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] text-mystical mb-6">
          THE SECRET
          <span className="block text-foreground mt-2">MENU</span>
        </h1>
        
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8" />
        
        <p className="font-body text-xl md:text-2xl text-foreground/60 italic max-w-xl mx-auto">
          "In food, as in all sacred arts, the invisible becomes visible"
        </p>
        
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative font-display text-sm tracking-[0.3em] text-primary border border-primary/30 px-10 py-4 hover:border-primary transition-all duration-500"
          >
            <span className="relative z-10">ENTER THE SANCTUM</span>
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-slow">
        <span className="font-body text-xs tracking-widest text-muted-foreground">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
