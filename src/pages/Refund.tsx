import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Refund = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="font-display text-4xl tracking-[0.2em] text-foreground mb-8 text-center">
            REFUND POLICY
          </h1>
          <p className="text-muted-foreground text-center mb-12">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">OUR COMMITMENT</h2>
              <p className="font-body text-muted-foreground">
                At Secret Menu, we take pride in the quality of our chef-crafted meals. Your satisfaction is our priority. If you're not completely happy with your order, we want to make it right.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">REFUND ELIGIBILITY</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <p>You may be eligible for a refund or replacement if:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your order was not delivered</li>
                  <li>Items were missing from your order</li>
                  <li>Food quality did not meet our standards</li>
                  <li>You received the wrong items</li>
                  <li>Food arrived in an unsafe condition</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">HOW TO REQUEST A REFUND</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <p>To request a refund:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact us within 24 hours of delivery</li>
                  <li>Provide your order number and details of the issue</li>
                  <li>Include photos if applicable (quality issues, wrong items)</li>
                  <li>Reach out via WhatsApp at +1 (415) 373-2496 or email support@sfsecretmenu.com</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">REFUND PROCESS</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refund requests are reviewed within 48 hours</li>
                  <li>Approved refunds are processed within 5-7 business days</li>
                  <li>Cryptocurrency refunds will be sent to the original wallet address</li>
                  <li>Refund amounts may be subject to network transaction fees</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">NON-REFUNDABLE SITUATIONS</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <p>Refunds may not be provided for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Change of mind after order confirmation</li>
                  <li>Incorrect delivery address provided by customer</li>
                  <li>Failure to receive delivery due to unavailability</li>
                  <li>Taste preferences (our menu descriptions are accurate)</li>
                  <li>Requests made more than 24 hours after delivery</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">ORDER CANCELLATION</h2>
              <div className="font-body text-muted-foreground space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Orders may be cancelled up to 24 hours before scheduled delivery</li>
                  <li>Cancellations made less than 24 hours in advance may incur a 50% fee</li>
                  <li>Same-day cancellations are non-refundable</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">CONTACT US</h2>
              <p className="font-body text-muted-foreground">
                For refund inquiries, please contact us at{' '}
                <a href="mailto:support@sfsecretmenu.com" className="text-foreground hover:underline">
                  support@sfsecretmenu.com
                </a>
                {' '}or via WhatsApp at +1 (415) 373-2496.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Refund;
