import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="font-display text-4xl tracking-[0.2em] text-foreground mb-8 text-center">
            PRIVACY POLICY
          </h1>
          <p className="text-muted-foreground text-center mb-12">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">1. INFORMATION WE COLLECT</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact information (name, email, phone number)</li>
                  <li>Delivery address</li>
                  <li>Payment information (processed securely via third-party providers)</li>
                  <li>Wallet address (for cryptocurrency payments)</li>
                  <li>Order history and preferences</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">2. HOW WE USE YOUR INFORMATION</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Send order confirmations and delivery updates</li>
                  <li>Communicate about promotions and new menu items</li>
                  <li>Improve our services and customer experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">3. INFORMATION SHARING</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <p>We do not sell your personal information. We may share information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery partners to fulfill your orders</li>
                  <li>Payment processors to complete transactions</li>
                  <li>Service providers who assist our operations</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">4. DATA SECURITY</h2>
              <p className="font-body text-muted-foreground">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">5. YOUR RIGHTS</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">6. CONTACT US</h2>
              <p className="font-body text-muted-foreground">
                For privacy-related inquiries, contact us at{' '}
                <a href="mailto:privacy@sfsecretmenu.com" className="text-foreground hover:underline">
                  privacy@sfsecretmenu.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
