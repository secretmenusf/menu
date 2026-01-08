import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import chefPortrait from '@/assets/chef-antje.jpg';

const Chef = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Chef Section */}
          <div className="text-center mb-16">
            <span className="text-foreground text-3xl mb-4 block">☽</span>
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-8">
              THE CHEF
            </h1>
            
            {/* Portrait */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 bg-foreground/10 blur-2xl rounded-full" />
              <div className="relative w-full h-full rounded-full overflow-hidden border border-border">
                <img 
                  src={chefPortrait} 
                  alt="Chef A.K.W." 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Bio */}
            <div className="max-w-2xl mx-auto">
              <p className="font-body text-lg text-foreground/80 leading-relaxed">
                Bay Area native chef A.K.W. is a world traveler. After spending years overseas in Central and South America, Europe, Africa, the Middle East and Asia, she has returned to share her favorite dishes with gastronomic precision.
              </p>
              <p className="font-display text-sm tracking-[0.2em] text-muted-foreground mt-6">
                MENU TO CHANGE RAPIDLY
              </p>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <Gallery />
      </main>

      <Footer />
    </div>
  );
};

export default Chef;
