import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SeedOfLife from '@/components/SeedOfLife';

const Entry = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic will be added with backend
    console.log('Login:', { email, password });
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Invite code logic will be added with backend
    console.log('Invite code:', inviteCode);
  };

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
            <Link to="/chef" className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
              CHEF
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-6 max-w-md">
          <div className="text-center mb-12">
            <SeedOfLife size={60} className="text-foreground mx-auto mb-6" />
            <h1 className="font-display text-3xl tracking-[0.2em] text-foreground mb-4">
              ORDER
            </h1>
            <p className="font-body text-muted-foreground">
              Access members-only weekly delivery
            </p>
          </div>

          <div className="border border-border bg-card p-8 rounded-2xl">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-background border border-border mb-8 rounded-full p-1">
                <TabsTrigger 
                  value="login" 
                  className="font-display text-xs tracking-[0.15em] rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
                >
                  LOGIN
                </TabsTrigger>
                <TabsTrigger 
                  value="invite"
                  className="font-display text-xs tracking-[0.15em] rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
                >
                  INVITE CODE
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                      EMAIL
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-background border-border focus:border-foreground font-body rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                      PASSWORD
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-background border-border focus:border-foreground font-body rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full font-display text-xs tracking-[0.2em] bg-foreground text-background hover:bg-foreground/90 rounded-full"
                  >
                    ENTER
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="invite">
                <form onSubmit={handleInvite} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                      INVITE CODE
                    </label>
                    <Input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="Enter your invitation code"
                      className="bg-background border-border focus:border-foreground font-body text-center tracking-widest rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  
                  <p className="font-body text-sm text-muted-foreground text-center">
                    Invitation codes are shared by existing members
                  </p>
                  
                  <Button 
                    type="submit" 
                    className="w-full font-display text-xs tracking-[0.2em] bg-foreground text-background hover:bg-foreground/90 rounded-full"
                  >
                    VALIDATE
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Hours */}
          <div className="mt-12 text-center border-t border-border pt-8">
            <p className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-4">DELIVERY HOURS</p>
            <div className="font-body text-foreground/70 space-y-1">
              <p>8am – 1am daily</p>
              <p className="text-sm text-muted-foreground">SF Bay Area only</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Entry;
