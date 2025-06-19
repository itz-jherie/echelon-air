import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { 
  Plane, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className="bg-gradient-to-b from-background to-black/90 pt-16 pb-8">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-3">
                  <Plane className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Echelon Air</h2>
              </div>
              <p className="text-muted-foreground">
                Redefining private aviation with unmatched luxury, efficiency, and personalized service.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                {[
                  { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
                  { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
                  { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
                  { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" }
                ].map((social) => (
                  <a 
                    key={social.label}
                    href="#" 
                    aria-label={social.label}
                    className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-foreground">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "Our Fleet", href: "/jets" },
                  { name: "Services", href: "/services" },
                  { name: "About Us", href: "/about" },
                  { name: "Testimonials", href: "/#testimonials" },
                  { name: "Contact", href: "/contact" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-foreground">Services</h3>
              <ul className="space-y-3">
                {[
                  { name: "Private Charter", href: "/services/charter" },
                  { name: "Corporate Travel", href: "/services/corporate" },
                  { name: "Concierge Service", href: "/services/concierge" },
                  { name: "Membership", href: "/membership" },
                  { name: "Jet Management", href: "/services/management" }
                ].map((service) => (
                  <li key={service.name}>
                    <Link 
                      href={service.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-foreground">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    8800 Aviation Blvd<br />
                    Suite 200<br />
                    Los Angeles, CA 90045
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-primary shrink-0" />
                  <a href="tel:+18885551234" className="text-muted-foreground hover:text-primary transition-colors">
                    +1 (888) 555-1234
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-primary shrink-0" />
                  <a href="mailto:info@echelonair.com" className="text-muted-foreground hover:text-primary transition-colors">
                    info@echelonair.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="border-t border-muted/30 pt-8 pb-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-3 text-center text-foreground">Subscribe to Our Newsletter</h3>
              <p className="text-muted-foreground text-center text-sm mb-4">
                Stay updated with our latest offers and aviation insights
              </p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 rounded-md bg-muted text-foreground border border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <Button type="submit" className="whitespace-nowrap">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t border-muted/30 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {currentYear} Echelon Air. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;