import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import SeedOfLife3D from './SeedOfLife3D';
import ConnectWallet from './ConnectWallet';
import { UserMenu } from './auth/UserMenu';
import { useTheme } from '@/components/theme-provider';
import { Search, Menu, Moon, Sun, Info, Palette, Mail, FileText, Users } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  const goToMenu = () => {
    navigate('/menu');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : ''
      }`}
    >
      {/* Subtle header bar background like Locale */}
      <div className={`mx-4 mt-4 rounded-2xl transition-all duration-500 ${
        scrolled ? 'bg-transparent mx-0 mt-0 rounded-none' : 'bg-muted/80 backdrop-blur-sm'
      }`}>
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo with dropdown menu (left-click) and context menu (right-click) */}
        <ContextMenu>
          <ContextMenuTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-3 focus:outline-none">
                  {/* 3D Seed of Life logo */}
                  <div className="transition-transform duration-300 group-hover:scale-110 group-data-[state=open]:scale-110">
                    <SeedOfLife3D size={48} />
                  </div>
                  {/* Brand text that appears on hover */}
                  <span className="font-display font-semibold text-sm tracking-[0.3em] text-foreground overflow-hidden transition-all duration-300 max-w-0 group-hover:max-w-[200px] group-data-[state=open]:max-w-[200px] whitespace-nowrap">
                    SECRET MENU
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 bg-card border-border"
              >
                <DropdownMenuItem
                  onClick={() => navigate('/menu')}
                  className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
                >
                  MENU
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/chef')}
                  className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
                >
                  THE CHEF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/about')}
                  className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
                >
                  ABOUT
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/reviews')}
                  className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
                >
                  REVIEWS
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/zoo-ngo')}
                  className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
                >
                  HEALING FARM
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={() => navigate('/compare')}
                  className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
                >
                  COMPARE
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/pricing')}
                  className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
                >
                  PRICING
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={() => navigate('/referrals')}
                  className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
                >
                  REFERRALS
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/gift-cards')}
                  className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
                >
                  GIFT CARDS
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56 bg-card border-border">
            <ContextMenuItem
              onClick={toggleTheme}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              {theme === 'dark' ? (
                <><Sun size={14} className="mr-2" /> LIGHT MODE</>
              ) : (
                <><Moon size={14} className="mr-2" /> DARK MODE</>
              )}
            </ContextMenuItem>
            <ContextMenuSeparator className="bg-border" />
            <ContextMenuItem
              onClick={() => navigate('/about')}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              <Info size={14} className="mr-2" /> ABOUT
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => navigate('/brand')}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              <Palette size={14} className="mr-2" /> BRAND
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => navigate('/press')}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              <FileText size={14} className="mr-2" /> PRESS
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => navigate('/contact')}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              <Mail size={14} className="mr-2" /> CONTACT
            </ContextMenuItem>
            <ContextMenuSeparator className="bg-border" />
            <ContextMenuItem
              onClick={() => navigate('/invite')}
              className="font-display text-xs tracking-[0.2em] cursor-pointer focus:bg-accent"
            >
              <Users size={14} className="mr-2" /> INVITE FRIENDS
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={goToMenu}
            className={`font-display text-xs tracking-[0.15em] text-foreground/70 hover:text-foreground transition-colors px-4 py-2 rounded-full ${scrolled ? 'hover:bg-foreground/5' : ''}`}
          >
            MENU
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className={`font-display text-xs tracking-[0.15em] text-foreground/70 hover:text-foreground transition-colors px-4 py-2 rounded-full ${scrolled ? 'hover:bg-foreground/5' : ''}`}
          >
            PRICING
          </button>
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
              document.dispatchEvent(event);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-foreground/70 hover:text-foreground transition-colors rounded-full ${scrolled ? 'hover:bg-foreground/5' : ''}`}
            title="Quick search (⌘K)"
          >
            <Search size={14} />
            <span className="font-body text-xs text-foreground/50">⌘K</span>
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('Theme toggle clicked, current theme:', theme);
              toggleTheme();
            }}
            className={`flex items-center justify-center w-9 h-9 text-foreground/70 hover:text-foreground transition-colors rounded-full ${scrolled ? 'hover:bg-foreground/5' : 'hover:bg-foreground/10'}`}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
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
              <div className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => navigate('/menu')}
                  className="font-display text-sm tracking-[0.2em] text-foreground text-left"
                >
                  MENU
                </button>
                <button
                  onClick={() => navigate('/chef')}
                  className="font-display text-sm tracking-[0.2em] text-foreground text-left"
                >
                  THE CHEF
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="font-display text-sm tracking-[0.2em] text-foreground text-left"
                >
                  ABOUT
                </button>
                <button
                  onClick={() => navigate('/reviews')}
                  className="font-display text-sm tracking-[0.2em] text-foreground text-left"
                >
                  REVIEWS
                </button>
                <div className="border-t border-border my-2" />
                <button
                  onClick={() => navigate('/compare')}
                  className="font-display text-sm tracking-[0.2em] text-foreground text-left"
                >
                  COMPARE
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="font-display text-sm tracking-[0.2em] text-foreground text-left"
                >
                  PRICING
                </button>
                <div className="border-t border-border my-2" />
                <button
                  onClick={() => navigate('/referrals')}
                  className="font-display text-sm tracking-[0.2em] text-foreground text-left"
                >
                  REFERRALS
                </button>
                <button
                  onClick={() => navigate('/gift-cards')}
                  className="font-display text-sm tracking-[0.2em] text-foreground text-left"
                >
                  GIFT CARDS
                </button>
                <div className="border-t border-border my-2" />
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
                <button
                  type="button"
                  onClick={() => {
                    console.log('Mobile theme toggle clicked, current theme:', theme);
                    toggleTheme();
                  }}
                  className="flex items-center gap-2 font-display text-sm tracking-[0.2em] text-foreground text-left"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
                </button>
                <div className="border-t border-border pt-4">
                  <UserMenu />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      </div>
    </header>
  );
};

export default Header;
