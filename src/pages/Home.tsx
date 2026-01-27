import { Link } from 'react-router-dom';
import { Sprout, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HomeMenuPreview from '@/components/HomeMenuPreview';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { SEOHead, pageSEO, schemas } from '@/components/seo/SEOHead';
import { TrustBadgesSection } from '@/components/social-proof/TrustBadges';
import { WhyMembersJoinSection } from '@/components/WhyJoinSection';
import { DeliveryZoneChecker } from '@/components/DeliveryZoneChecker';
import { GuaranteeBadges } from '@/components/social-proof/TrustBadges';
import StandardsSection from '@/components/StandardsSection';
import PlanCard from '@/components/subscription/PlanCard';
import { subscriptionPlans } from '@/data/plans';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        {...pageSEO.home}
        url="https://secretmenusf.com"
        schema={schemas.localBusiness}
      />

      <Header />

      <main>
        {/* Hero with CTA */}
        <HeroSection />

        {/* Trust Badges - Organic, Local, Fresh, Certified */}
        <div className="relative z-10 bg-background">
        <TrustBadgesSection />

        {/* Menu Preview - condensed view */}
        <HomeMenuPreview />


        {/* Why Members Join */}
        <WhyMembersJoinSection className="py-16" />

        {/* Our Standards & Bay Area Suppliers */}
        <StandardsSection />

        {/* About Chef Antje */}
        <AboutSection />

        {/* Reviews & Testimonials */}
        <ReviewsSection />

        {/* Regenerative Healing Farm */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 max-w-7xl">
            <Link
              to="/zoo-ngo"
              className="group block border border-border/30 rounded-lg bg-card/30 hover:border-foreground/20 transition-all duration-300 overflow-hidden"
            >
              <div className="grid md:grid-cols-[1fr_1.2fr] items-center">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/zoo-ngo/biodynamic-med-herbfarm.jpg"
                    alt="Regenerative Healing Farm"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="p-8 md:p-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-emerald-500" />
                    <p className="font-display text-xs tracking-[0.3em] text-muted-foreground">
                      ZOO NGO x SECRET MENU
                    </p>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl tracking-[0.12em] text-foreground">
                    REGENERATIVE HEALING FARM
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    We've partnered with Zoo NGO to build a regenerative healing farm to grow medicinal mushrooms, adaptogenic herbs, and nutrient-dense foods
                    — restoring ecosystems while expanding food access for underserved communities.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="font-display text-xs tracking-[0.2em] text-emerald-500 group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      LEARN MORE & DONATE <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                  <p className="font-body text-[10px] text-muted-foreground">
                    501(c)(3) tax deductible · The Zoolabs Foundation · EIN #883538992
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Guarantees */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-10">
              <p className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">
                OUR PROMISE
              </p>
              <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-foreground">
                SATISFACTION GUARANTEED
              </h2>
            </div>
            <GuaranteeBadges />
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-12">
              <p className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">
                MEMBERSHIP
              </p>
              <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-foreground mb-3">
                CHOOSE YOUR PLAN
              </h2>
              <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">
                Weekly drops curated by Chef Antje. Members get access first.
                When a dish sells out, it's gone.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subscriptionPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} compact />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              >
                COMPARE ALL PLANS <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Delivery Zone Checker */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6 max-w-7xl">
            <DeliveryZoneChecker />
          </div>
        </section>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
