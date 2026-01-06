const Footer = () => {
  return (
    <footer className="py-12 bg-void border-t border-primary/10">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6">
          <span className="text-primary text-2xl">△</span>
        </div>
        
        <p className="font-display text-sm tracking-[0.3em] text-muted-foreground mb-4">
          THE SECRET MENU
        </p>
        
        <p className="font-body text-xs text-muted-foreground/50 italic">
          "What is concealed shall be revealed to those who seek"
        </p>
        
        <div className="mt-8 flex justify-center gap-8">
          <a href="#" className="text-muted-foreground/40 hover:text-primary transition-colors text-lg">
            ◯
          </a>
          <a href="#" className="text-muted-foreground/40 hover:text-primary transition-colors text-lg">
            ◯
          </a>
          <a href="#" className="text-muted-foreground/40 hover:text-primary transition-colors text-lg">
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
