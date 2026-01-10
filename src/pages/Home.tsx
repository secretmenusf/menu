import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Gallery from '@/components/Gallery';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import MenuSection from '@/components/MenuSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <HeroSection />
        <Gallery />
        <ReviewsSection />
        <MenuSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
