import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Support = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="text-foreground text-3xl">?</span>
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.15em] mt-6 mb-4">
              SUPPORT
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              We're here to help with any questions about your Secret Menu experience.
            </p>
          </div>

          {/* Contact */}
          <section className="mb-16 text-center">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-6">CONTACT US</h2>
            <div className="space-y-4 font-body text-foreground/80">
              <p>
                <span className="text-muted-foreground">Email:</span>{' '}
                <a href="mailto:support@secretmenu.sf" className="hover:text-primary transition-colors">
                  support@secretmenu.sf
                </a>
              </p>
              <p>
                <span className="text-muted-foreground">Phone:</span>{' '}
                <a href="tel:+14155551234" className="hover:text-primary transition-colors">
                  (415) 555-1234
                </a>
              </p>
              <p className="text-sm text-muted-foreground/60">
                Response time: Within 24 hours
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-8 text-center">FAQ</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-border rounded-2xl px-6">
                <AccordionTrigger className="font-display text-sm tracking-[0.05em]">
                  How does the weekly menu work?
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  Each week, Chef Antje creates a new curated menu. You can view the current week's offerings 
                  on our Menu page and place orders for delivery. The menu changes every Monday at midnight.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border rounded-2xl px-6">
                <AccordionTrigger className="font-display text-sm tracking-[0.05em]">
                  What are your delivery hours?
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  We deliver from 8am to 1am daily throughout the San Francisco Bay Area. 
                  Orders placed after 1am will be scheduled for the next delivery window.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border rounded-2xl px-6">
                <AccordionTrigger className="font-display text-sm tracking-[0.05em]">
                  Do you accommodate dietary restrictions?
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  Yes! Each menu item is labeled for vegetarian (🌿) and gluten-free (✧) options. 
                  For severe allergies or other dietary needs, please contact us directly before ordering.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border rounded-2xl px-6">
                <AccordionTrigger className="font-display text-sm tracking-[0.05em]">
                  How do subscriptions work?
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  Subscribe to receive automatic weekly deliveries of our chef's selection. 
                  Cancel or pause anytime. Subscribers receive priority delivery windows and exclusive dishes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border rounded-2xl px-6">
                <AccordionTrigger className="font-display text-sm tracking-[0.05em]">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  We accept all major credit cards through Stripe, as well as cryptocurrency payments 
                  via connected wallets. All transactions are secure and encrypted.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-border rounded-2xl px-6">
                <AccordionTrigger className="font-display text-sm tracking-[0.05em]">
                  Can I modify or cancel my order?
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  Orders can be modified or cancelled up to 2 hours before the scheduled delivery time. 
                  Contact support or manage your orders through your account dashboard.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Policies */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-border rounded-2xl">
              <h3 className="font-display text-lg tracking-[0.1em] mb-4">REFUND POLICY</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Not satisfied? Contact us within 24 hours of delivery for a full refund or credit 
                toward your next order. We stand behind every dish that leaves our kitchen.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl">
              <h3 className="font-display text-lg tracking-[0.1em] mb-4">PRIVACY</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Your data is sacred. We never share your personal information with third parties. 
                All payment data is encrypted and handled by trusted payment processors.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
