const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="text-foreground text-2xl">△</span>
          <span className="font-display text-sm tracking-[0.3em] text-foreground">SECRET MENU</span>
        </div>
        
        <p className="font-body text-xs text-muted-foreground/50 italic">
          "What is concealed shall be revealed to those who seek"
        </p>
        
        <div className="mt-8 flex justify-center gap-8">
          <a href="#" className="text-muted-foreground/40 hover:text-foreground transition-colors text-lg">
            ◯
          </a>
          <a href="#" className="text-muted-foreground/40 hover:text-foreground transition-colors text-lg">
            ◯
          </a>
          <a href="#" className="text-muted-foreground/40 hover:text-foreground transition-colors text-lg">
            ◯
          </a>
        </div>
        
        <p className="mt-8 font-body text-xs text-muted-foreground/30">
          © MMXXIV · All mysteries reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
