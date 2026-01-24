import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HomeMenuPreview from '@/components/HomeMenuPreview';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { SEOHead, pageSEO, schemas } from '@/components/seo/SEOHead';
import { TrustBadgesSection } from '@/components/social-proof/TrustBadges';
import { WhyMembersJoinSection, SimpleHowItWorksSection } from '@/components/WhyJoinSection';
import { DeliveryZoneChecker } from '@/components/DeliveryZoneChecker';
import { GuaranteeBadges } from '@/components/social-proof/TrustBadges';
import StandardsSection from '@/components/StandardsSection';

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

        {/* How It Works - Simple 4 steps */}
        <SimpleHowItWorksSection className="py-16 bg-card/30" />

        {/* Our Standards & Bay Area Suppliers */}
        <StandardsSection />

        {/* Delivery Zone Checker */}
        <section className="py-16 bg-gradient-to-b from-card/50 to-background">
          <div className="container mx-auto px-6">
            <DeliveryZoneChecker />
          </div>
        </section>

        {/* About Chef Antje */}
        <AboutSection />

        {/* Guarantees */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
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

        {/* Reviews & Testimonials */}
        <ReviewsSection />
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
