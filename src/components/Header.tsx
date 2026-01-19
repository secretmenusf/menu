import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import SeedOfLife3D from './SeedOfLife3D';
import ConnectWallet from './ConnectWallet';
import { UserMenu } from './auth/UserMenu';
import { Search, Menu } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToOrder = () => {
    navigate('/order');
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
                <SeedOfLife3D size={48} />
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
              onClick={() => navigate('/')}
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
              CHEF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={goToOrder}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              ORDER
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/gift-cards')}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              GIFT
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('about')}
            className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            CHEF
          </button>
          <button
            onClick={goToOrder}
            className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            ORDER
          </button>
          <Link
            to="/gift-cards"
            className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            GIFT
          </Link>
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
              document.dispatchEvent(event);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors border border-border/50 rounded-full hover:bg-accent"
            title="Quick search (⌘K)"
          >
            <Search size={14} />
            <span className="font-body text-xs text-muted-foreground/70">⌘K</span>
          </button>
          <UserMenu />
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background border-border">
              <div className="flex flex-col gap-6 mt-8">
                <button
                  onClick={() => scrollToSection('about')}
                  className="font-display text-sm tracking-[0.2em] text-foreground text-left"
                >
                  CHEF
                </button>
                <button
                  onClick={goToOrder}
                  className="font-display text-sm tracking-[0.2em] text-foreground text-left"
                >
                  ORDER
                </button>
                <Link
                  to="/gift-cards"
                  className="font-display text-sm tracking-[0.2em] text-foreground"
                >
                  GIFT
                </Link>
                <button
                  onClick={() => {
                    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
                    document.dispatchEvent(event);
                  }}
                  className="flex items-center gap-2 font-display text-sm tracking-[0.2em] text-foreground"
                >
                  <Search size={16} />
                  SEARCH
                  <span className="font-body text-xs text-muted-foreground ml-auto">⌘K</span>
                </button>
                <div className="border-t border-border pt-6">
                  <UserMenu />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;
