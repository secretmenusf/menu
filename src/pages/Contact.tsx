import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeedOfLife3D from '@/components/SeedOfLife3D';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="mb-8 flex justify-center">
              <SeedOfLife3D size={64} />
            </div>
            <h1 className="font-display font-semibold text-4xl md:text-5xl tracking-[0.15em] mb-6">
              CONTACT US
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-xl mx-auto">
              We'd love to hear from you. Reach out with questions, feedback, or just to say hello.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <a
              href="mailto:hello@secretmenusf.com"
              className="p-8 border border-border rounded-3xl bg-card/30 hover:border-foreground/30 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-display text-lg tracking-[0.1em] mb-2">EMAIL</h3>
              <p className="font-body text-foreground">hello@secretmenusf.com</p>
              <p className="font-body text-sm text-muted-foreground mt-2">
                We typically respond within 24 hours
              </p>
            </a>

            <a
              href="tel:+14153732496"
              className="p-8 border border-border rounded-3xl bg-card/30 hover:border-foreground/30 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-display text-lg tracking-[0.1em] mb-2">PHONE</h3>
              <p className="font-body text-foreground">(415) 373-2496</p>
              <p className="font-body text-sm text-muted-foreground mt-2">
                Available during business hours
              </p>
            </a>

            <a
              href="https://wa.me/14153732496"
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 border border-border rounded-3xl bg-card/30 hover:border-foreground/30 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-display text-lg tracking-[0.1em] mb-2">WHATSAPP</h3>
              <p className="font-body text-foreground">Message us directly</p>
              <p className="font-body text-sm text-muted-foreground mt-2">
                Quick responses for order questions
              </p>
            </a>

            <div className="p-8 border border-border rounded-3xl bg-card/30">
              <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-display text-lg tracking-[0.1em] mb-2">LOCATION</h3>
              <p className="font-body text-foreground">San Francisco, CA</p>
              <p className="font-body text-sm text-muted-foreground mt-2">
                Serving the greater Bay Area
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="text-center p-10 border border-border rounded-3xl bg-card/30 mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-foreground" />
              <h3 className="font-display text-lg tracking-[0.1em]">DELIVERY HOURS</h3>
            </div>
            <p className="font-body text-xl text-foreground mb-2">8:00 AM – 1:00 AM</p>
            <p className="font-body text-muted-foreground">Seven days a week</p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="font-body text-muted-foreground mb-6">
              Ready to experience the difference?
            </p>
            <Button size="lg" className="font-display tracking-wider" asChild>
              <a href="/order">START YOUR ORDER</a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
