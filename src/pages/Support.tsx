import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Support = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

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

          {/* Contact Form */}
          <section id="contact" className="mb-16">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-8 text-center">CONTACT US</h2>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-display tracking-[0.1em] mb-2">NAME</label>
                  <Input
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-[0.1em] mb-2">EMAIL</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="rounded-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-display tracking-[0.1em] mb-2">SUBJECT</label>
                <Input
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="What's this about?"
                  required
                  className="rounded-full"
                />
              </div>
              <div>
                <label className="block text-xs font-display tracking-[0.1em] mb-2">MESSAGE</label>
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us more..."
                  required
                  rows={5}
                  className="rounded-3xl"
                />
              </div>
              <div className="text-center">
                <Button type="submit" className="rounded-full px-12">
                  SEND MESSAGE
                </Button>
              </div>
            </form>
            <div className="mt-8 text-center space-y-2 font-body text-sm text-muted-foreground">
              <p>
                <a href="mailto:hello@sfsecretmenu.com" className="hover:text-foreground transition-colors">
                  hello@sfsecretmenu.com
                </a>
                {' · '}
                <a href="tel:+13235551234" className="hover:text-foreground transition-colors">
                  (323) 555-1234
                </a>
              </p>
              <p className="text-muted-foreground/60">Response time: Within 24 hours</p>
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
                  We exclusively accept cryptocurrency payments. Connect your wallet (MetaMask, WalletConnect, 
                  Coinbase Wallet, etc.) to pay with ETH or supported tokens on Ethereum mainnet or L2s.
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
          <section id="refund" className="mb-12">
            <div className="p-8 border border-border rounded-2xl">
              <h3 className="font-display text-xl tracking-[0.1em] mb-4">REFUND POLICY</h3>
              <div className="font-body text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Not satisfied? Contact us within 24 hours of delivery for a full refund or credit 
                  toward your next order. We stand behind every dish that leaves our kitchen.
                </p>
                <p>
                  Refunds are processed back to your original wallet and typically complete within 3-5 business days.
                </p>
              </div>
            </div>
          </section>

          <section id="privacy" className="mb-12">
            <div className="p-8 border border-border rounded-2xl">
              <h3 className="font-display text-xl tracking-[0.1em] mb-4">PRIVACY POLICY</h3>
              <div className="font-body text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Your data is sacred. We collect only what's necessary: wallet address (for payments), 
                  delivery address, and contact information.
                </p>
                <p>
                  We never share your personal information with third parties. All payment data is 
                  encrypted and handled securely through blockchain transactions.
                </p>
              </div>
            </div>
          </section>

          <section id="terms" className="mb-12">
            <div className="p-8 border border-border rounded-2xl">
              <h3 className="font-display text-xl tracking-[0.1em] mb-4">TERMS OF SERVICE</h3>
              <div className="font-body text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  By using Secret Menu, you agree to these terms. You must be at least 18 years old 
                  and have a valid crypto wallet to use our services.
                </p>
                <p>
                  All orders are subject to availability. Payments are final once confirmed on the blockchain. 
                  We are not responsible for delays caused by incorrect addresses or recipient unavailability.
                </p>
                <p>
                  Secret Menu is not liable for allergic reactions or adverse effects from food consumption. 
                  Please review all ingredients carefully.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
