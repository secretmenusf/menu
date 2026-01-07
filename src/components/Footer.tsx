import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-foreground text-2xl">△</span>
              <span className="font-display text-sm tracking-[0.3em] text-foreground">SECRET MENU</span>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Chef-crafted meals delivered to your door. San Francisco Bay Area.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-xs tracking-[0.2em] text-foreground mb-4">NAVIGATE</h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link to="/menu" className="text-muted-foreground hover:text-foreground transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/chef" className="text-muted-foreground hover:text-foreground transition-colors">
                  The Chef
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/entry" className="text-muted-foreground hover:text-foreground transition-colors">
                  Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-xs tracking-[0.2em] text-foreground mb-4">SUPPORT</h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help & FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:support@secretmenu.sf" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xs tracking-[0.2em] text-foreground mb-4">CONTACT</h4>
            <ul className="space-y-3 font-body text-sm text-muted-foreground">
              <li>
                <a href="mailto:support@secretmenu.sf" className="hover:text-foreground transition-colors">
                  support@secretmenu.sf
                </a>
              </li>
              <li>
                <a href="tel:+14155551234" className="hover:text-foreground transition-colors">
                  (415) 555-1234
                </a>
              </li>
              <li className="text-muted-foreground/60">
                Delivery: 8am – 1am daily
              </li>
              <li className="text-muted-foreground/60">
                San Francisco Bay Area
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border mb-8" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-muted-foreground/50 italic">
            "What is concealed shall be revealed to those who seek"
          </p>
          
          <p className="font-body text-xs text-muted-foreground/30">
            © MMXXIV Secret Menu · All mysteries reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
