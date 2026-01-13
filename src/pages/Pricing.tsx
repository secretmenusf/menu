import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlanCard from '@/components/subscription/PlanCard';
import { subscriptionPlans, planBenefits } from '@/data/plans';
import { ShareButton } from '@/components/social/ShareButton';
import { SEOHead, pageSEO, schemas } from '@/components/seo/SEOHead';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        {...pageSEO.pricing}
        url="https://sfsecretmenu.com/pricing"
        schema={schemas.breadcrumb([
          { name: 'Home', url: 'https://sfsecretmenu.com' },
          { name: 'Pricing', url: 'https://sfsecretmenu.com/pricing' },
        ])}
      />

      <Header />

      <main className="pt-32 pb-24">
        {/* Back link */}
        <div className="container mx-auto px-6 mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            BACK TO HOME
          </Link>
        </div>

        {/* Section header */}
        <div className="container mx-auto px-6 max-w-4xl text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-6">
            MEMBERSHIP TIERS
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Join the inner circle. Experience curated culinary excellence
            delivered to your door.
          </p>
          <ShareButton
            title="SF Secret Menu - Membership Plans"
            text="Check out the membership tiers for SF Secret Menu - chef-crafted meals delivered weekly"
            variant="outline"
            size="sm"
          />
        </div>

        {/* Plans grid */}
        <div className="container mx-auto px-6 max-w-6xl mb-24">
          <div className="grid md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* Benefits section */}
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="border border-border/30 rounded-lg p-8 md:p-12 bg-card/20">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Sparkles size={20} className="text-muted-foreground" />
              <h2 className="font-display text-xl tracking-[0.2em] text-foreground">
                ALL MEMBERSHIPS INCLUDE
              </h2>
              <Sparkles size={20} className="text-muted-foreground" />
            </div>

            <ul className="grid md:grid-cols-2 gap-4">
              {planBenefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 font-body text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/50" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ teaser */}
        <div className="container mx-auto px-6 max-w-4xl mt-16 text-center">
          <p className="font-body text-sm text-muted-foreground/60">
            Questions about our service?{' '}
            <Link
              to="/support"
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
              Contact our concierge team
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
