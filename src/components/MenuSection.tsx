import MenuItem from './MenuItem';

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

const MenuSection = () => {
  return (
    <section id="menu" className="relative py-32 bg-void">
      {/* Decorative top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="text-primary text-3xl mb-4 block">☽</span>
          <h2 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-4">
            THE OFFERINGS
          </h2>
          <p className="font-body text-lg text-muted-foreground italic">
            Each dish contains secrets known only to the initiated
          </p>
        </div>

        {/* Main courses */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-primary/20" />
            <h3 className="font-display text-sm tracking-[0.3em] text-primary/70">MAIN RITES</h3>
            <div className="flex-1 h-px bg-primary/20" />
          </div>
          
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Desserts */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-primary/20" />
            <h3 className="font-display text-sm tracking-[0.3em] text-primary/70">FINAL RITES</h3>
            <div className="flex-1 h-px bg-primary/20" />
          </div>
          
          <div className="space-y-2">
            {desserts.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-20 text-center">
          <p className="font-body text-sm text-muted-foreground/60 tracking-wide">
            A gratuity of 20% is included for all who partake in the mysteries
          </p>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
