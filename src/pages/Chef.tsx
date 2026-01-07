import { Link } from 'react-router-dom';
import SeedOfLife from '@/components/SeedOfLife';
import ConnectWallet from '@/components/ConnectWallet';
import chefPortrait from '@/assets/chef-antje.jpg';

const Chef = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <SeedOfLife size={32} className="text-foreground transition-transform duration-300 group-hover:scale-110" />
            <span className="font-display text-sm tracking-[0.3em] text-foreground">SECRET MENU</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link to="/menu" className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
              MENU
            </Link>
            <Link to="/entry" className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
              ORDER
            </Link>
            <ConnectWallet />
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Portrait area */}
            <div className="relative">
              <div className="aspect-[3/4] bg-card border border-border rounded-2xl relative overflow-hidden">
                <img 
                  src={chefPortrait} 
                  alt="Chef Antje Worring" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Subtle overlay frame */}
                <div className="absolute inset-0 border-[8px] border-background/20 rounded-2xl" />
              </div>
              
              {/* Name plaque */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background border border-border rounded-full px-8 py-3">
                <p className="font-display text-sm tracking-[0.3em] text-foreground">ANTJE WORRING</p>
              </div>
            </div>

            {/* Bio content */}
            <div className="space-y-8">
              <div>
                <SeedOfLife size={36} className="text-foreground mb-4" />
                <h1 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-foreground mb-2">
                  THE CHEF
                  <span className="block text-muted-foreground text-2xl mt-1">of Culinary Mysteries</span>
                </h1>
              </div>
              
              <div className="w-24 h-px bg-border" />
              
              <div className="space-y-6 font-body text-lg text-foreground/80 leading-relaxed">
                <p>
                  <span className="text-foreground font-semibold">Antje Worring</span> discovered the ancient 
                  connection between food and consciousness during her years studying in the hidden 
                  kitchens of Vienna, the spice temples of Marrakech, and the forest monasteries of Kyoto.
                </p>
                
                <p>
                  Her culinary philosophy draws from the esoteric traditions of the old masters—where 
                  every ingredient carries meaning, every technique holds intention, and every meal 
                  becomes a ritual of transformation.
                </p>
                
                <p className="italic text-muted-foreground">
                  "Cooking is alchemy. We take the raw materials of the earth and transmute them into 
                  something that nourishes not just the body, but the soul. Each dish I create is a 
                  cipher—those who taste with awareness will receive the message."
                </p>
              </div>

              {/* Credentials */}
              <div className="pt-6 border-t border-border">
                <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4">INITIATIONS</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="border border-border rounded-full px-4 py-2">L'Institut Noir, Vienna</span>
                  <span className="border border-border rounded-full px-4 py-2">Temple Culinaire, Fès</span>
                  <span className="border border-border rounded-full px-4 py-2">Shōjin Ryōri, Kōyasan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chef;
