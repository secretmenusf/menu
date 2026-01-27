import { Globe, Leaf, Heart, Sparkles, WheatOff, Brain } from 'lucide-react';
import chefPortrait from '@/assets/chef-antje.jpg';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-32 bg-card sacred-geometry">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Portrait area */}
          <div className="relative flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-foreground/10 blur-2xl rounded-full" />
              {/* Image container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-border">
                <img
                  src={chefPortrait}
                  alt="Chef Antje"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name plaque */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border px-8 py-3 rounded-full">
              <p className="font-display text-sm tracking-[0.3em] text-foreground">Antje</p>
            </div>
          </div>

          {/* Bio content */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-mystical mb-2">
                Antje
                <span className="block text-muted-foreground text-2xl mt-1">Culinary Alchemist</span>
              </h2>
            </div>

            <div className="w-24 h-px bg-border" />

            <div className="space-y-6 font-body text-lg text-foreground/80 leading-relaxed">
              <p>
                Multi-disciplinary artist and culinary wizard, <span className="text-foreground font-semibold">Antje</span> brings
                her globe-trotting adventures and international flair to the Bay Area—crafting
                gourmet, organic meals that nourish body and soul.
              </p>

              <p>
                Her approach to cooking is intuitive and intentional. Every dish honors quality
                ingredients and dietary wellness, drawing on flavors absorbed from kitchens
                across continents. Food, for her, is medicine and art.
              </p>

              <p className="italic text-muted-foreground">
                "I cook the way I live—with curiosity, with passion, and with deep respect for the
                ingredients and the people I'm feeding. Every meal is an invitation to slow down
                and heal."
              </p>
            </div>

            {/* Credentials */}
            <div className="pt-6 border-t border-border">
              <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4">ESSENCE</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2 border border-border px-4 py-2 rounded-full"><Globe className="h-4 w-4" /> Global Kitchen</span>
                <span className="flex items-center gap-2 border border-border px-4 py-2 rounded-full"><Leaf className="h-4 w-4" /> Organic</span>
                <span className="flex items-center gap-2 border border-border px-4 py-2 rounded-full"><Heart className="h-4 w-4" /> Healing Foods</span>
                <span className="flex items-center gap-2 border border-border px-4 py-2 rounded-full"><Sparkles className="h-4 w-4" /> Fusion</span>
                <span className="flex items-center gap-2 border border-border px-4 py-2 rounded-full"><WheatOff className="h-4 w-4" /> Gluten Free</span>
                <span className="flex items-center gap-2 border border-border px-4 py-2 rounded-full"><Brain className="h-4 w-4" /> Focus-Enhancing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
