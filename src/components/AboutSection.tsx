const AboutSection = () => {
  return (
    <section id="about" className="relative py-32 bg-card sacred-geometry">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Portrait area */}
          <div className="relative">
            <div className="aspect-[3/4] bg-background border border-border relative overflow-hidden">
              {/* Stylized portrait placeholder with mystical frame */}
              <div className="absolute inset-4 border border-border" />
              <div className="absolute inset-8 border border-muted" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl text-muted-foreground mb-4">◯</div>
                  <p className="font-display text-sm tracking-[0.3em] text-muted-foreground">THE KEEPER</p>
                </div>
              </div>
              {/* Corner ornaments */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t border-l border-muted-foreground/30" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t border-r border-muted-foreground/30" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b border-l border-muted-foreground/30" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b border-r border-muted-foreground/30" />
            </div>
            
            {/* Name plaque */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border px-8 py-3">
              <p className="font-display text-sm tracking-[0.3em] text-foreground">ANTJE WORRING</p>
            </div>
          </div>

          {/* Bio content */}
          <div className="space-y-8">
            <div>
              <span className="text-foreground text-2xl">❂</span>
              <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-mystical mt-4 mb-2">
                THE KEEPER
                <span className="block text-muted-foreground text-2xl mt-1">of Culinary Mysteries</span>
              </h2>
            </div>
            
            <div className="w-24 h-px bg-border" />
            
            <div className="space-y-6 font-body text-lg text-foreground/80 leading-relaxed">
              <p>
                <span className="text-foreground font-semibold">Antje Worring</span> discovered the ancient 
                connection between food and consciousness during her years studying in the hidden 
                kitchens of Vienna, the spice temples of Marrakech, and the forest monasteries of Kyoto.
              </p>
              
              <p>
                Her culinary philosophy draws from the esoteric traditions of the old masters—where 
                every ingredient carries meaning, every technique holds intention, and every meal 
                becomes a ritual of transformation.
              </p>
              
              <p className="italic text-muted-foreground">
                "Cooking is alchemy. We take the raw materials of the earth and transmute them into 
                something that nourishes not just the body, but the soul. Each dish I create is a 
                cipher—those who taste with awareness will receive the message."
              </p>
            </div>

            {/* Credentials */}
            <div className="pt-6 border-t border-border">
              <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4">INITIATIONS</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="border border-border px-4 py-2">L'Institut Noir, Vienna</span>
                <span className="border border-border px-4 py-2">Temple Culinaire, Fès</span>
                <span className="border border-border px-4 py-2">Shōjin Ryōri, Kōyasan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
