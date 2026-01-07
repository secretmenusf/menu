import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SeedOfLife3D from './SeedOfLife3D';

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
        scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo with dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center gap-3 focus:outline-none">
              {/* 3D Seed of Life logo */}
              <div className="transition-transform duration-300 group-hover:scale-110 group-data-[state=open]:scale-110">
                <SeedOfLife3D size={32} />
              </div>
              {/* Brand text that appears on hover */}
              <span className="font-display text-sm tracking-[0.3em] text-foreground overflow-hidden transition-all duration-300 max-w-0 group-hover:max-w-[200px] group-data-[state=open]:max-w-[200px] whitespace-nowrap">
                SECRET MENU
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="w-56 bg-card border-border"
          >
            <DropdownMenuItem 
              onClick={() => scrollToSection('hero')}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              HOME
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              onClick={() => scrollToSection('menu')}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              THE OFFERINGS
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => scrollToSection('about')}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              THE KEEPER
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => scrollToSection('contact')}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              SEEK ENTRY
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-12">
          <button
            onClick={() => scrollToSection('about')}
            className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            CHEF
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            ORDER
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
