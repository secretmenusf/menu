import { useState } from 'react';

interface MenuItemProps {
  name: string;
  description: string;
  price: string;
  symbol: string;
  ritual?: string;
}

const MenuItem = ({ name, description, price, symbol, ritual }: MenuItemProps) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="group relative py-8 border-b border-border cursor-pointer"
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-muted-foreground text-lg">{symbol}</span>
            <h3 className="font-display text-xl tracking-[0.1em] text-foreground group-hover:text-foreground/80 transition-colors duration-300">
              {name}
            </h3>
          </div>
          <p className="font-body text-lg text-muted-foreground pl-10">
            {description}
          </p>
          {ritual && (
            <p
              className={`font-body text-sm italic text-foreground/50 pl-10 mt-2 transition-all duration-500 ${
                revealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              ✧ {ritual}
            </p>
          )}
        </div>
        <span className="font-display text-lg text-muted-foreground tracking-wider">
          {price}
        </span>
      </div>
      
      {/* Hover line effect */}
      <div className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-500 group-hover:w-full" />
    </div>
  );
};

export default MenuItem;
