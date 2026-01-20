import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeedOfLife3D from '@/components/SeedOfLife3D';
import { Button } from '@/components/ui/button';
import { FileText, Download, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const pressHighlights = [
  {
    stat: '98%',
    label: 'Organic Ingredients',
    description: 'Nearly all ingredients sourced from certified organic farms',
  },
  {
    stat: '30+',
    label: 'Weekly Menu Items',
    description: 'Rotating chef-crafted meals each week',
  },
  {
    stat: '4.9★',
    label: 'Customer Rating',
    description: 'Based on 127+ verified reviews',
  },
  {
    stat: '2024',
    label: 'Founded',
    description: 'San Francisco, California',
  },
];

const Press = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="mb-8">
              <SeedOfLife3D size={64} />
            </div>
            <h1 className="font-display font-semibold text-4xl md:text-5xl tracking-[0.15em] mb-6">
              PRESS & MEDIA
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-xl mx-auto">
              Resources for journalists, bloggers, and media professionals.
            </p>
          </div>

          {/* Quick Facts */}
          <section className="mb-20">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-8 text-center">QUICK FACTS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pressHighlights.map((item) => (
                <div key={item.label} className="p-6 border border-border rounded-2xl bg-card/30 text-center">
                  <p className="font-display text-3xl text-foreground mb-2">{item.stat}</p>
                  <p className="font-display text-xs tracking-wider text-foreground mb-2">{item.label}</p>
                  <p className="font-body text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* About */}
          <section className="mb-20">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-8">ABOUT SECRET MENU</h2>
            <div className="p-8 border border-border rounded-3xl bg-card/30">
              <p className="font-body text-lg text-foreground/80 leading-relaxed mb-6">
                Secret Menu is San Francisco's premier organic meal delivery service, offering chef-crafted
                meals made with 98% organic, locally sourced ingredients. Founded with the mission to transform
                everyday dining into an act of discovery, Secret Menu delivers restaurant-quality meals
                directly to customers' doors throughout the Bay Area.
              </p>
              <p className="font-body text-lg text-foreground/80 leading-relaxed">
                Unlike conventional meal delivery services, Secret Menu operates on a rotating weekly menu
                model, featuring 30+ thoughtfully curated dishes that change with the seasons. Every meal
                is prepared fresh daily by trained chefs using time-honored techniques and premium ingredients.
              </p>
            </div>
          </section>

          {/* Quote */}
          <section className="mb-20">
            <div className="p-10 border border-foreground/10 rounded-3xl bg-gradient-to-b from-card/50 to-transparent text-center">
              <Quote className="w-10 h-10 mx-auto mb-6 text-foreground/20" />
              <blockquote className="font-body text-xl italic text-foreground/80 mb-6 max-w-2xl mx-auto">
                "We don't just deliver food. We deliver rituals. Moments of pause in a fast-paced world.
                An invitation to slow down, savor, and reconnect with the primal act of nourishment."
              </blockquote>
              <p className="font-display text-sm tracking-wider text-muted-foreground">
                — Chef Antje, Founder
              </p>
            </div>
          </section>

          {/* Press Kit */}
          <section className="mb-20">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-8">PRESS KIT</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 border border-border rounded-3xl bg-card/30">
                <FileText className="w-8 h-8 mb-4 text-foreground" />
                <h3 className="font-display text-lg tracking-wider mb-2">COMPANY FACT SHEET</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  Key statistics, milestones, and company information.
                </p>
                <Button variant="outline" size="sm" className="font-display tracking-wider" asChild>
                  <a href="mailto:press@secretmenusf.com?subject=Press%20Kit%20Request">
                    REQUEST <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
              <div className="p-8 border border-border rounded-3xl bg-card/30">
                <Download className="w-8 h-8 mb-4 text-foreground" />
                <h3 className="font-display text-lg tracking-wider mb-2">BRAND ASSETS</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  Logos, images, and brand guidelines for media use.
                </p>
                <Button variant="outline" size="sm" className="font-display tracking-wider" asChild>
                  <Link to="/brand">
                    VIEW ASSETS <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center p-12 border border-border rounded-3xl bg-card/30">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-4">MEDIA INQUIRIES</h2>
            <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
              For press inquiries, interviews, or additional information, please contact our media team.
            </p>
            <Button size="lg" className="font-display tracking-wider" asChild>
              <a href="mailto:press@secretmenusf.com">
                CONTACT PRESS TEAM
              </a>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Press;
