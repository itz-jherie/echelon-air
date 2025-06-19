"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Plane
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const navItems = [
    { 
      name: 'Home', 
      href: '/' 
    },
    { 
      name: 'Our Fleet', 
      href: '/jets',
      children: [
        { name: 'Light Jets', href: '/jets/light' },
        { name: 'Midsize Jets', href: '/jets/midsize' },
        { name: 'Heavy Jets', href: '/jets/heavy' }
      ]
    },
    { 
      name: 'Services', 
      href: '/services',
      children: [
        { name: 'Private Charter', href: '/services/charter' },
        { name: 'Corporate Travel', href: '/services/corporate' },
        { name: 'Concierge Service', href: '/services/concierge' },
        { name: 'Jet Management', href: '/services/management' }
      ]
    },
    { 
      name: 'Membership', 
      href: '/membership' 
    },
    { 
      name: 'About Us', 
      href: '/about' 
    },
    { 
      name: 'Contact', 
      href: '/contact' 
    }
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b border-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-3">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Echelon Air</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.children ? (
                  <div>
                    <button 
                      className="flex items-center text-foreground hover:text-primary transition-colors"
                      onClick={() => toggleDropdown(index)}
                    >
                      {item.name}
                      <ChevronDown size={16} className="ml-1" />
                    </button>
                    <div className="absolute mt-2 w-48 bg-background/95 backdrop-blur-sm rounded-md shadow-lg py-1 z-50 text-foreground border border-muted/30 hidden group-hover:block">
                      {item.children.map((child, childIndex) => (
                        <Link 
                          key={childIndex} 
                          href={child.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link 
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Book Now Button */}
          <div className="hidden md:block">
            <Button asChild>
              <Link href='/'>Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              className="text-foreground hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-4 space-y-3 border-t border-muted/30">
          {navItems.map((item, index) => (
            <div key={index} className="block">
              {item.children ? (
                <>
                  <button 
                    className="flex items-center w-full text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => toggleDropdown(index)}
                  >
                    {item.name}
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  <div className={`pl-4 ${activeDropdown === index ? 'block' : 'hidden'}`}>
                    {item.children.map((child, childIndex) => (
                      <Link 
                        key={childIndex} 
                        href={child.href}
                        className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link 
                  href={item.href}
                  className="block text-foreground hover:text-primary transition-colors py-2"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-2">
            <Button asChild className="w-full">
              <Link href={'/'}>Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;