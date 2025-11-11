import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'News', href: '/news' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Returns', href: '/returns' },
      { name: 'Shipping Info', href: '/shipping' },
    ],
    categories: [
      { name: 'Drivetrain', href: '/category/drivetrain' },
      { name: 'Wheels & Tires', href: '/category/wheels' },
      { name: 'Brakes', href: '/category/brakes' },
      { name: 'Accessories', href: '/category/accessories' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Refund Policy', href: '/refund' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/people/Pedal-India/61557798781166/#' },
    { name: 'Twitter', icon: Twitter, href: 'https://www.facebook.com/people/Pedal-India/61557798781166/#' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/jatin.bhagwani/?hl=en' },
    { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@jatinbhagwani8259?app=desktop' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2 md:mb-4">
              Stay Ahead, Gear the Pack
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
              Get exclusive offers, bike care tips, and be first to know about new arrivals and cycling events.
            </p>
            <div className="flex max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-r-none border-r-0 bg-muted/50 text-sm"
              />
              <Button className="rounded-l-none bg-primary hover:bg-primary/90 text-sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-3 md:mb-6">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs md:text-sm">P</span>
              </div>
              <span className="text-base md:text-xl font-bold text-foreground">PedalBharat</span>
            </Link>
            
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-6 max-w-md">
              Your trusted partner for premium cycling gear. From professional racers to weekend warriors, 
              we provide the equipment that elevates your performance.
            </p>

            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center space-x-2 md:space-x-3 text-muted-foreground text-xs md:text-sm">
                <Phone className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span>+91 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3 text-muted-foreground text-xs md:text-sm">
                <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span>support@pedalbharat.com</span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3 text-muted-foreground text-xs md:text-sm">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span>Mumbai, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-sm md:text-base text-foreground mb-2 md:mb-4">Company</h4>
            <ul className="space-y-1 md:space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-sm md:text-base text-foreground mb-2 md:mb-4">Support</h4>
            <ul className="space-y-1 md:space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="font-semibold text-sm md:text-base text-foreground mb-2 md:mb-4">Categories</h4>
            <ul className="space-y-1 md:space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
            <div className="text-muted-foreground text-xs md:text-sm">
              © 2024 PedalBharat. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Legal Links */}
              <div className="hidden md:flex items-center space-x-4">
                {footerLinks.legal.map((link) => (
                  <Link 
                    key={link.name}
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;