import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="text-foreground text-3xl">△</span>
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.15em] mt-6 mb-4">
              ABOUT SECRET MENU
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              A culinary experience for those who seek more than just a meal.
            </p>
          </div>

          {/* Story */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-6 text-center">OUR STORY</h2>
            <div className="space-y-6 font-body text-foreground/80 leading-relaxed">
              <p>
                Secret Menu was born from the belief that dining should be an experience of discovery. 
                Founded in San Francisco's vibrant culinary scene, we deliver chef-crafted meals that 
                transform the ordinary into the extraordinary.
              </p>
              <p>
                Each week, our rotating menu features carefully curated dishes prepared with locally 
                sourced ingredients and ancient cooking techniques passed down through generations. 
                Every meal tells a story—of the land, the season, and the hands that prepared it.
              </p>
              <p>
                We don't just deliver food. We deliver rituals. Moments of pause in a fast-paced world. 
                An invitation to slow down, savor, and reconnect with the primal act of nourishment.
              </p>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-8 text-center">OUR VALUES</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 border border-border rounded-2xl">
                <span className="text-3xl mb-4 block">◯</span>
                <h3 className="font-display text-lg tracking-[0.1em] mb-2">QUALITY</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Only the finest locally-sourced, seasonal ingredients make it into our kitchen.
                </p>
              </div>
              <div className="text-center p-6 border border-border rounded-2xl">
                <span className="text-3xl mb-4 block">△</span>
                <h3 className="font-display text-lg tracking-[0.1em] mb-2">CRAFT</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Every dish is prepared by hand with intention, care, and centuries of wisdom.
                </p>
              </div>
              <div className="text-center p-6 border border-border rounded-2xl">
                <span className="text-3xl mb-4 block">☆</span>
                <h3 className="font-display text-lg tracking-[0.1em] mb-2">MYSTERY</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Let each week's menu surprise and delight. Trust the journey.
                </p>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="text-center">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-6">DELIVERY AREA</h2>
            <p className="font-body text-muted-foreground mb-2">
              Currently serving the greater San Francisco Bay Area
            </p>
            <p className="font-body text-sm text-muted-foreground/60">
              Delivery hours: 8am – 1am daily
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
