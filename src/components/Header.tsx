import { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-primary/10' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => scrollToSection('hero')}
          className="font-display text-xl tracking-[0.3em] text-primary hover:text-gold-light transition-colors"
        >
          ⊛ THE ORDER
        </button>
        
        <div className="flex items-center gap-12">
          <button
            onClick={() => scrollToSection('menu')}
            className="font-display text-sm tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors relative group"
          >
            MENU
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="font-display text-sm tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors relative group"
          >
            THE KEEPER
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="font-display text-sm tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors relative group"
          >
            SEEK ENTRY
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
