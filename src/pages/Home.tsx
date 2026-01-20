import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HomeMenuPreview from '@/components/HomeMenuPreview';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import MenuSection from '@/components/MenuSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { SEOHead, pageSEO, schemas } from '@/components/seo/SEOHead';
import { TrustBadgesSection } from '@/components/social-proof/TrustBadges';
import { StatsSection } from '@/components/social-proof/StatsBar';
import { HowItWorksSection } from '@/components/HowItWorks';
import { DeliveryZoneChecker } from '@/components/DeliveryZoneChecker';
import { GuaranteeBadges } from '@/components/social-proof/TrustBadges';
import StandardsSection from '@/components/StandardsSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        {...pageSEO.home}
        url="https://sfsecretmenu.com"
        schema={schemas.localBusiness}
      />

      <Header />

      <main>
        {/* Hero with CTA */}
        <HeroSection />

        {/* Trust Badges - Organic, Local, Fresh, Certified */}
        <TrustBadgesSection />

        {/* Menu Preview - condensed view */}
        <HomeMenuPreview />

        {/* Stats - Rating, Meals Delivered, Happy Members */}
        <StatsSection />

        {/* Our Standards & Bay Area Suppliers */}
        <StandardsSection />

        {/* How It Works - 5 step process */}
        <HowItWorksSection />

        {/* Delivery Zone Checker */}
        <section className="py-16 bg-gradient-to-b from-card/50 to-background">
          <div className="container mx-auto px-6">
            <DeliveryZoneChecker />
          </div>
        </section>

        {/* About Chef Antje */}
        <AboutSection />

        {/* Weekly Menu & Pricing */}
        <MenuSection />

        {/* Guarantees */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-10">
              <p className="font-display text-xs tracking-[0.3em] text-amber-500 mb-2">
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
      </main>

      <Footer />
    </div>
  );
};

export default Home;
