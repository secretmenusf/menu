import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  UtensilsCrossed,
  ShoppingCart,
  CreditCard,
  User,
  Settings,
  HelpCircle,
  MessageCircle,
  LogOut,
  Gift,
  Users,
  Search,
  Keyboard,
  Image,
} from 'lucide-react';

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const pages = [
    { icon: Home, label: 'Home', shortcut: 'G H', action: () => navigate('/') },
    { icon: Image, label: 'Gallery', shortcut: 'G L', action: () => { navigate('/'); setTimeout(() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
    { icon: UtensilsCrossed, label: 'Menu', shortcut: 'G M', action: () => navigate('/menu') },
    { icon: ShoppingCart, label: 'Order', shortcut: 'G O', action: () => navigate('/order') },
    { icon: CreditCard, label: 'Pricing', shortcut: 'G P', action: () => navigate('/pricing') },
    { icon: HelpCircle, label: 'FAQ', shortcut: 'G F', action: () => navigate('/faq') },
    { icon: MessageCircle, label: 'Support', shortcut: 'G S', action: () => navigate('/support') },
    { icon: Gift, label: 'Gift Cards', shortcut: 'G G', action: () => navigate('/gift-cards') },
  ];

  const userPages = user ? [
    { icon: User, label: 'Profile', shortcut: 'G U', action: () => navigate('/profile') },
    { icon: Settings, label: 'Settings', shortcut: 'G ,', action: () => navigate('/profile/settings') },
    { icon: Users, label: 'Referrals', shortcut: 'G R', action: () => navigate('/referrals') },
    { icon: ShoppingCart, label: 'My Orders', shortcut: 'G Y', action: () => navigate('/my-orders') },
  ] : [];

  const actions = [
    { icon: ShoppingCart, label: 'Place Order', action: () => navigate('/order') },
    { icon: MessageCircle, label: 'Contact Support', action: () => window.open('https://wa.me/14153732496', '_blank') },
  ];

  if (user) {
    actions.push({ icon: LogOut, label: 'Sign Out', action: () => signOut() });
  } else {
    actions.push({ icon: User, label: 'Sign In', action: () => navigate('/login') });
    actions.push({ icon: User, label: 'Join', action: () => navigate('/signup') });
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border-border bg-card">
        <CommandInput placeholder="Search pages, actions..." className="border-0" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Pages">
            {pages.map((page) => (
              <CommandItem
                key={page.label}
                onSelect={() => runCommand(page.action)}
                className="cursor-pointer"
              >
                <page.icon className="mr-2 h-4 w-4" />
                <span>{page.label}</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  {page.shortcut}
                </kbd>
              </CommandItem>
            ))}
          </CommandGroup>

          {userPages.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Account">
                {userPages.map((page) => (
                  <CommandItem
                    key={page.label}
                    onSelect={() => runCommand(page.action)}
                    className="cursor-pointer"
                  >
                    <page.icon className="mr-2 h-4 w-4" />
                    <span>{page.label}</span>
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      {page.shortcut}
                    </kbd>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />
          <CommandGroup heading="Actions">
            {actions.map((action) => (
              <CommandItem
                key={action.label}
                onSelect={() => runCommand(action.action)}
                className="cursor-pointer"
              >
                <action.icon className="mr-2 h-4 w-4" />
                <span>{action.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Help">
            <CommandItem className="cursor-default">
              <Keyboard className="mr-2 h-4 w-4" />
              <span className="text-muted-foreground text-xs">
                Press <kbd className="px-1 bg-muted rounded">↑</kbd> <kbd className="px-1 bg-muted rounded">↓</kbd> to navigate, <kbd className="px-1 bg-muted rounded">Enter</kbd> to select, <kbd className="px-1 bg-muted rounded">Esc</kbd> to close
              </span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default CommandPalette;
