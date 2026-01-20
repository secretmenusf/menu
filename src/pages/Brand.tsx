import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeedOfLife3D from '@/components/SeedOfLife3D';
import SeedOfLife from '@/components/SeedOfLife';
import { Download, Palette, Type, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Brand = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="mb-8">
              <SeedOfLife3D size={72} />
            </div>
            <h1 className="font-display font-semibold text-4xl md:text-5xl tracking-[0.15em] mb-6">
              BRAND ASSETS
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-xl mx-auto">
              Guidelines and assets for press, partners, and collaborators.
            </p>
          </div>

          {/* Logo Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <Image className="w-5 h-5 text-foreground" />
              <h2 className="font-display text-2xl tracking-[0.1em]">LOGO</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-12 border border-border rounded-3xl bg-card/30 flex flex-col items-center">
                <div className="mb-6">
                  <SeedOfLife3D size={120} />
                </div>
                <p className="font-display text-sm tracking-wider text-muted-foreground mb-4">PRIMARY LOGO</p>
                <p className="font-body text-xs text-muted-foreground mb-4">Seed of Life Symbol</p>
              </div>
              <div className="p-12 border border-border rounded-3xl bg-foreground flex flex-col items-center">
                <div className="mb-6">
                  <SeedOfLife size={120} className="text-background" />
                </div>
                <p className="font-display text-sm tracking-wider text-background/60 mb-4">INVERTED</p>
                <p className="font-body text-xs text-background/60 mb-4">For dark backgrounds</p>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <Type className="w-5 h-5 text-foreground" />
              <h2 className="font-display text-2xl tracking-[0.1em]">TYPOGRAPHY</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 border border-border rounded-3xl bg-card/30">
                <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4">DISPLAY FONT</p>
                <p className="font-display text-4xl tracking-[0.1em] mb-4">Zalando Sans Expanded</p>
                <p className="font-body text-sm text-muted-foreground">
                  Used for headings, navigation, and brand statements.
                </p>
              </div>
              <div className="p-8 border border-border rounded-3xl bg-card/30">
                <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4">BODY FONT</p>
                <p className="font-body text-4xl mb-4">Geist</p>
                <p className="font-body text-sm text-muted-foreground">
                  Used for body text, descriptions, and UI elements.
                </p>
              </div>
            </div>
          </section>

          {/* Colors */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <Palette className="w-5 h-5 text-foreground" />
              <h2 className="font-display text-2xl tracking-[0.1em]">COLORS</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-full aspect-square rounded-2xl bg-foreground mb-4" />
                <p className="font-display text-xs tracking-wider">PRIMARY</p>
                <p className="font-body text-xs text-muted-foreground">#FAFAFA</p>
              </div>
              <div className="text-center">
                <div className="w-full aspect-square rounded-2xl bg-[#0a0a0a] border border-border mb-4" />
                <p className="font-display text-xs tracking-wider">BACKGROUND</p>
                <p className="font-body text-xs text-muted-foreground">#0A0A0A</p>
              </div>
              <div className="text-center">
                <div className="w-full aspect-square rounded-2xl bg-amber-500 mb-4" />
                <p className="font-display text-xs tracking-wider">ACCENT</p>
                <p className="font-body text-xs text-muted-foreground">#F59E0B</p>
              </div>
              <div className="text-center">
                <div className="w-full aspect-square rounded-2xl bg-emerald-500 mb-4" />
                <p className="font-display text-xs tracking-wider">SUCCESS</p>
                <p className="font-body text-xs text-muted-foreground">#10B981</p>
              </div>
            </div>
          </section>

          {/* Brand Voice */}
          <section className="mb-20">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-8">BRAND VOICE</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border border-border rounded-2xl">
                <h3 className="font-display text-sm tracking-wider mb-3">MYSTICAL</h3>
                <p className="font-body text-sm text-muted-foreground">
                  We embrace the sacred nature of food and nourishment.
                </p>
              </div>
              <div className="p-6 border border-border rounded-2xl">
                <h3 className="font-display text-sm tracking-wider mb-3">ELEVATED</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Premium quality without pretension. Accessible luxury.
                </p>
              </div>
              <div className="p-6 border border-border rounded-2xl">
                <h3 className="font-display text-sm tracking-wider mb-3">INTENTIONAL</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Every detail is considered. Nothing is accidental.
                </p>
              </div>
            </div>
          </section>

          {/* Download */}
          <section className="text-center p-12 border border-border rounded-3xl bg-card/30">
            <Download className="w-8 h-8 mx-auto mb-6 text-foreground" />
            <h2 className="font-display text-2xl tracking-[0.1em] mb-4">DOWNLOAD ASSETS</h2>
            <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
              Need our logo or brand assets? Contact us for a complete brand kit.
            </p>
            <Button size="lg" className="font-display tracking-wider" asChild>
              <a href="mailto:hello@secretmenusf.com?subject=Brand%20Assets%20Request">
                REQUEST BRAND KIT
              </a>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Brand;
