import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeedOfLife3D from '@/components/SeedOfLife3D';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Users,
  Baby,
  Heart,
  Stethoscope,
  Gift,
  MessageSquare,
  ChefHat,
  Truck,
  Leaf,
  Recycle,
  MapPin
} from 'lucide-react';

const Chef = () => {
  const whoItsFor = [
    { icon: Briefcase, text: 'Professionals who want exceptional meals without the hassle' },
    { icon: Users, text: 'Families who value real, nourishing food' },
    { icon: Baby, text: 'New parents in need of effortless, restorative meals' },
    { icon: Heart, text: 'Anyone managing food sensitivities or special diets' },
    { icon: Stethoscope, text: 'Clients recovering and focused on healing through nutrition' },
    { icon: Gift, text: 'Thoughtful hosts and gift-givers seeking something truly memorable' },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Tell Us About You',
      description: 'Share your dietary needs, preferences, schedule, and goals through a short contact form.',
      badge: 'Organic. Gluten & dairy-free options. No refined sugars.',
      icon: MessageSquare,
    },
    {
      step: '02',
      title: 'We Design Your Menu',
      description: 'Our chefs craft a custom menu tailored to your body, lifestyle, and cravings.',
      badge: 'Serving the San Francisco Bay Area.',
      icon: ChefHat,
    },
    {
      step: '03',
      title: 'We Plan the Experience',
      description: "From sourcing to plating, we handle every detail — so you don't have to.",
      badge: 'Enjoy a zero-waste, plastic-free experience with every delivery.',
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-24">
            <div className="mb-8">
              <SeedOfLife3D size={72} />
            </div>
            <h1 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl tracking-[0.1em] mb-6">
              PRIVATE CHEF, PERFECTLY PERSONAL
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Bespoke meals and culinary experiences, crafted around you — your tastes, your lifestyle, your needs.
            </p>
            <Link to="/contact">
              <Button size="lg" className="rounded-full px-10 py-6 text-lg font-semibold">
                Book Your Private Chef
              </Button>
            </Link>
          </div>

          {/* Who It's For */}
          <section className="mb-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-border" />
              <h2 className="font-display text-2xl tracking-[0.15em]">WHO IT'S FOR</h2>
              <div className="h-px w-16 bg-border" />
            </div>
            <p className="text-center font-body text-lg text-muted-foreground mb-12">
              Designed for lives that demand more.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {whoItsFor.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 border border-border rounded-2xl bg-card/30 hover:border-foreground/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  <p className="font-body text-foreground/80 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <p className="text-center font-body text-muted-foreground italic mt-10">
              If food matters to you, you belong here.
            </p>
          </section>

          {/* How It Works */}
          <section className="mb-24">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px w-16 bg-border" />
              <h2 className="font-display text-2xl tracking-[0.15em]">HOW IT WORKS</h2>
              <div className="h-px w-16 bg-border" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground/5 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-foreground/70" />
                  </div>
                  <div className="font-display text-sm tracking-[0.2em] text-muted-foreground mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="font-display text-xl tracking-[0.1em] mb-4">{item.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <span className="inline-block px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery & Experience */}
          <section className="mb-24">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px w-16 bg-border" />
              <h2 className="font-display text-2xl tracking-[0.15em]">THE EXPERIENCE</h2>
              <div className="h-px w-16 bg-border" />
            </div>

            <div className="p-10 border border-border rounded-3xl bg-card/30 text-center">
              <h3 className="font-display text-xl tracking-[0.1em] mb-6">
                We simplify your life and elevate your everyday.
              </h3>
              <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                Your meals arrive freshly prepared, beautifully portioned, and delivered directly to your fridge
                in reusable, food-safe Pyrex. When it's time to eat, simply heat, serve, and enjoy — no shopping,
                no prep, no cleanup.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">Freshly Prepared</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                  <Recycle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">Reusable Pyrex</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">Direct to Your Fridge</span>
                </div>
              </div>
            </div>
          </section>

          {/* About the Craft */}
          <section className="mb-24">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px w-16 bg-border" />
              <h2 className="font-display text-2xl tracking-[0.15em]">ABOUT THE CRAFT</h2>
              <div className="h-px w-16 bg-border" />
            </div>

            <div className="space-y-8 font-body text-lg text-foreground/80 leading-relaxed max-w-3xl mx-auto">
              <p>
                At Secret Menu, we specialize in creating <span className="text-foreground font-medium">refined,
                health-forward cuisine</span> tailored to specific dietary needs — without ever sacrificing flavor.
              </p>
              <p>
                We work exclusively with the freshest, highest-quality ingredients and design every menu around
                food allergies, sensitivities, and personal preferences. Our chefs collaborate with nutritionists
                and healthcare professionals to stay at the forefront of modern nutrition, ensuring every dish
                is as nourishing as it is unforgettable.
              </p>
              <div className="py-8 text-center border-y border-border">
                <p className="text-foreground font-medium text-xl mb-2">This is not meal prep.</p>
                <p className="text-muted-foreground italic">
                  This is a private chef, in your kitchen — without the intrusion.
                </p>
              </div>
            </div>
          </section>

          {/* Closing CTA */}
          <section className="text-center">
            <div className="p-12 border border-foreground/10 rounded-3xl bg-gradient-to-b from-card/50 to-transparent">
              <div className="flex justify-center mb-6">
                <SeedOfLife3D size={48} />
              </div>
              <h2 className="font-display font-semibold text-2xl tracking-[0.1em] mb-4">
                Ready for a chef-crafted experience designed just for you?
              </h2>
              <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
                Book your private chef today.
              </p>
              <Link to="/contact">
                <Button size="lg" className="rounded-full px-10 py-6 text-lg font-semibold">
                  Book Your Private Chef
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chef;
