import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeedOfLife3D from '@/components/SeedOfLife3D';
import { Leaf, ChefHat, Sparkles, MapPin, Clock, Mail, Phone } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-24">
            <div className="mb-8 flex justify-center">
              <SeedOfLife3D size={72} />
            </div>
            <h1 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] mb-6">
              ABOUT SECRET MENU
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A culinary experience for those who seek more than just a meal.
            </p>
          </div>

          {/* Story */}
          <section className="mb-24">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-border" />
              <h2 className="font-display text-2xl tracking-[0.15em]">OUR STORY</h2>
              <div className="h-px w-16 bg-border" />
            </div>
            <div className="space-y-8 font-body text-lg text-foreground/80 leading-relaxed max-w-3xl mx-auto">
              <p>
                Secret Menu was born from a simple belief: <span className="text-foreground font-medium">dining should be an act of discovery.</span>
              </p>
              <p>
                Founded in San Francisco's vibrant culinary scene, we create chef-crafted meals designed
                to transform the everyday into the extraordinary. Each week, our rotating menu features
                thoughtfully curated dishes made with locally sourced ingredients and time-honored
                techniques passed down through generations.
              </p>
              <p className="text-foreground italic border-l-2 border-foreground/20 pl-6">
                Every meal tells a story — of the land, the season, and the hands that prepared it.
              </p>
              <div className="space-y-2 text-center pt-4">
                <p>We don't just deliver food.</p>
                <p className="text-foreground font-medium">We deliver rituals.</p>
                <p>Moments of pause in a fast-paced world.</p>
                <p className="text-muted-foreground">An invitation to slow down, savor, and reconnect with the primal act of nourishment.</p>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-24">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px w-16 bg-border" />
              <h2 className="font-display text-2xl tracking-[0.15em]">OUR VALUES</h2>
              <div className="h-px w-16 bg-border" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-8 border border-border rounded-3xl bg-card/30 hover:border-foreground/20 transition-colors">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Leaf className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="font-display text-lg tracking-[0.15em] mb-3">QUALITY</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Only the finest locally sourced, seasonal ingredients enter our kitchen.
                </p>
              </div>
              <div className="text-center p-8 border border-border rounded-3xl bg-card/30 hover:border-foreground/20 transition-colors">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <ChefHat className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="font-display text-lg tracking-[0.15em] mb-3">CRAFT</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Every dish is prepared by hand with intention, care, and deep respect for tradition.
                </p>
              </div>
              <div className="text-center p-8 border border-border rounded-3xl bg-card/30 hover:border-foreground/20 transition-colors">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="font-display text-lg tracking-[0.15em] mb-3">MYSTERY</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Let each week's menu surprise and delight. Trust the journey.
                </p>
              </div>
            </div>
          </section>

          {/* Delivery Area */}
          <section className="mb-24">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px w-16 bg-border" />
              <h2 className="font-display text-2xl tracking-[0.15em]">DELIVERY AREA</h2>
              <div className="h-px w-16 bg-border" />
            </div>
            <div className="text-center p-10 border border-border rounded-3xl bg-card/30">
              <div className="flex items-center justify-center gap-2 text-foreground mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-body text-lg">Currently serving the greater San Francisco Bay Area</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-body">Delivery Hours: 8:00 AM – 1:00 AM, daily</span>
              </div>
            </div>
          </section>

          {/* Mission Statement */}
          <section className="mb-24 text-center">
            <div className="p-12 border border-foreground/10 rounded-3xl bg-gradient-to-b from-card/50 to-transparent">
              <div className="mb-6 flex justify-center">
                <SeedOfLife3D size={48} />
              </div>
              <h2 className="font-display font-semibold text-2xl tracking-[0.15em] mb-4">SECRET MENU</h2>
              <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6">
                Nourishing body, mind, and soul with organic, locally sourced ingredients held to the highest standards.
              </p>
              <p className="font-display text-sm tracking-[0.2em] text-foreground/60">
                Food as medicine. Food as art.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-border" />
              <h2 className="font-display text-2xl tracking-[0.15em]">CONTACT</h2>
              <div className="h-px w-16 bg-border" />
            </div>
            <div className="space-y-4">
              <a href="mailto:hello@secretmenusf.com" className="flex items-center justify-center gap-2 text-foreground hover:text-foreground/70 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="font-body">hello@secretmenusf.com</span>
              </a>
              <a href="tel:+14153732496" className="flex items-center justify-center gap-2 text-foreground hover:text-foreground/70 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-body">(415) 373-2496</span>
              </a>
              <p className="font-body text-sm text-muted-foreground pt-4">
                San Francisco, CA
              </p>
            </div>
          </section>

          {/* Quote */}
          <div className="mt-24 text-center">
            <p className="font-body italic text-muted-foreground">
              "What is concealed shall be revealed to those who seek."
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
