const ContactSection = () => {
  return (
    <section id="contact" className="relative py-32 bg-void">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <span className="text-primary text-3xl mb-6 block">⊛</span>
        
        <h2 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-mystical mb-4">
          SEEK ENTRY
        </h2>
        
        <p className="font-body text-lg text-muted-foreground mb-12">
          The Order convenes only for those who know how to ask
        </p>

        <div className="space-y-8 mb-16">
          <div className="border border-primary/20 p-8 bg-card/50">
            <p className="font-display text-xs tracking-[0.3em] text-primary/70 mb-4">RESERVATIONS</p>
            <p className="font-body text-xl text-foreground">
              Speak your intention to the void
            </p>
            <a 
              href="mailto:enter@thesecretmenu.com" 
              className="inline-block font-body text-lg text-primary hover:text-gold-light transition-colors mt-2"
            >
              enter@thesecretmenu.com
            </a>
          </div>

          <div className="border border-primary/20 p-8 bg-card/50">
            <p className="font-display text-xs tracking-[0.3em] text-primary/70 mb-4">LOCATION</p>
            <p className="font-body text-lg text-foreground/80 italic">
              Revealed upon confirmation of your reservation
            </p>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Somewhere between the seen and unseen
            </p>
          </div>
        </div>

        {/* Hours */}
        <div className="border-t border-primary/10 pt-8">
          <p className="font-display text-xs tracking-[0.3em] text-primary/70 mb-4">THE HOURS</p>
          <div className="font-body text-foreground/70 space-y-1">
            <p>Wednesday through Saturday</p>
            <p className="text-primary">When the clock strikes the witching hour</p>
            <p className="text-sm text-muted-foreground">(Seatings at 7pm and 9pm)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
