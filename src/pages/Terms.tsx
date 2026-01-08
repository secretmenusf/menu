import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="font-display text-4xl tracking-[0.2em] text-foreground mb-8 text-center">
            TERMS OF SERVICE
          </h1>
          <p className="text-muted-foreground text-center mb-12">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">1. ACCEPTANCE OF TERMS</h2>
              <p className="font-body text-muted-foreground">
                By accessing or using Secret Menu's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">2. SERVICE DESCRIPTION</h2>
              <p className="font-body text-muted-foreground">
                Secret Menu provides chef-prepared meal delivery services in the Los Angeles area. Our menu changes regularly based on seasonal availability and chef inspiration. We reserve the right to modify, suspend, or discontinue any aspect of our service at any time.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">3. ORDERING AND PAYMENT</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Orders require a minimum purchase of $200</li>
                  <li>Payment is accepted via cryptocurrency (ETH)</li>
                  <li>All prices are in USD and converted to ETH at time of payment</li>
                  <li>Orders are confirmed via WhatsApp communication</li>
                  <li>Delivery times are estimates and may vary</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">4. DELIVERY</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery is available within the Los Angeles area</li>
                  <li>Delivery hours are 8:00 AM to 1:00 AM daily</li>
                  <li>You must provide accurate delivery information</li>
                  <li>Someone must be available to receive the order</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">5. FOOD SAFETY AND ALLERGIES</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <p>Please inform us of any food allergies or dietary restrictions when ordering. While we take precautions, our kitchen handles common allergens including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nuts and tree nuts</li>
                  <li>Dairy products</li>
                  <li>Gluten and wheat</li>
                  <li>Shellfish and fish</li>
                  <li>Eggs and soy</li>
                </ul>
                <p>We cannot guarantee completely allergen-free preparation.</p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">6. INTELLECTUAL PROPERTY</h2>
              <p className="font-body text-muted-foreground">
                All content on this website, including recipes, images, logos, and branding, is the property of Secret Menu and protected by copyright laws. Unauthorized use is prohibited.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">7. LIMITATION OF LIABILITY</h2>
              <p className="font-body text-muted-foreground">
                Secret Menu is not liable for any indirect, incidental, or consequential damages arising from use of our services. Our total liability shall not exceed the amount paid for the specific order in question.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">8. GOVERNING LAW</h2>
              <p className="font-body text-muted-foreground">
                These terms are governed by the laws of the State of California. Any disputes shall be resolved in the courts of Los Angeles County, California.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">9. CONTACT</h2>
              <p className="font-body text-muted-foreground">
                For questions about these terms, contact us at{' '}
                <a href="mailto:legal@secretmenu.xyz" className="text-foreground hover:underline">
                  legal@secretmenu.xyz
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

export default Terms;
