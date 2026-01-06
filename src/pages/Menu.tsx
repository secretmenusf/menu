import { Link } from 'react-router-dom';
import MenuItem from '@/components/MenuItem';
import SeedOfLife from '@/components/SeedOfLife';

const menuItems = [
  {
    name: "THE PHILOSOPHER'S STONE",
    description: "Aged bone marrow, black truffle essence, gold leaf, charred sourdough",
    price: "32",
    symbol: "◈",
    ritual: "Served with a flame that reveals the hidden text beneath"
  },
  {
    name: "MIDNIGHT'S VEIL",
    description: "Squid ink risotto, forbidden rice, charred octopus, smoke",
    price: "45",
    symbol: "◉",
    ritual: "The dish arrives concealed; only your breath unveils it"
  },
  {
    name: "THE ALCHEMIST'S GARDEN",
    description: "Foraged greens, edible flowers, 23-year aged balsamic, herb ash",
    price: "28",
    symbol: "❋",
    ritual: "Each element represents a stage of transformation"
  },
  {
    name: "EMBER & SHADOW",
    description: "Wagyu beef heart, burnt onion purée, black garlic, blood orange",
    price: "58",
    symbol: "◆",
    ritual: "Carved tableside by candlelight"
  },
  {
    name: "THE HERMETIC SEAL",
    description: "Duck confit, foie gras terrine, fig essence, ancient grain crackers",
    price: "52",
    symbol: "⬡",
    ritual: "Opened only when the key phrase is spoken"
  },
  {
    name: "CELESTIAL WATERS",
    description: "Oysters three ways, champagne mignonette, caviar, crystallized sea",
    price: "48",
    symbol: "◇",
    ritual: "Presented under a dome of aromatic mist"
  },
];

const desserts = [
  {
    name: "THE FINAL REVELATION",
    description: "Dark chocolate sphere, molten gold center, salt of the earth",
    price: "24",
    symbol: "⬢",
    ritual: "Shattered to reveal the treasure within"
  },
  {
    name: "ETERNAL FLAME",
    description: "Crème brûlée noire, activated charcoal, vanilla from the old world",
    price: "18",
    symbol: "✧",
    ritual: "The torch is passed to the seeker"
  },
];

const drinks = [
  {
    name: "THE VOID",
    description: "Activated charcoal lemonade, elderflower, black salt rim",
    price: "14",
    symbol: "●",
    ritual: "Stare into it; it stares back"
  },
  {
    name: "LIQUID GOLD",
    description: "Turmeric, ginger, oat milk, honey from hidden hives",
    price: "12",
    symbol: "◉",
    ritual: "Best consumed during golden hour"
  },
];

const Menu = () => {
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
            <Link to="/chef" className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
              THE KEEPER
            </Link>
            <Link to="/entry" className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
              SEEK ENTRY
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Section header */}
          <div className="text-center mb-20">
            <SeedOfLife size={48} className="text-foreground mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-foreground mb-4">
              THE OFFERINGS
            </h1>
            <p className="font-body text-lg text-muted-foreground italic">
              Each dish contains secrets known only to the initiated
            </p>
          </div>

          {/* Main courses */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-border" />
              <h2 className="font-display text-xs tracking-[0.3em] text-muted-foreground">MAIN RITES</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
            </div>
          </div>

          {/* Desserts */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-border" />
              <h2 className="font-display text-xs tracking-[0.3em] text-muted-foreground">FINAL RITES</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            <div className="space-y-2">
              {desserts.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
            </div>
          </div>

          {/* Drinks */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-border" />
              <h2 className="font-display text-xs tracking-[0.3em] text-muted-foreground">ELIXIRS</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            <div className="space-y-2">
              {drinks.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center">
            <p className="font-body text-sm text-muted-foreground/60 tracking-wide">
              A gratuity of 20% is included for all who partake
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Menu;
