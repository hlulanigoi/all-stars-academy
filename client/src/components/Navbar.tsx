import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/subjects", label: "Subjects" },
  { href: "/pricing", label: "Pricing" },
  { href: "/schedule", label: "Schedule" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-white shadow-lg border-b border-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-secondary p-2 rounded-lg text-primary shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap size={32} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg md:text-xl leading-none text-white tracking-wide group-hover:text-secondary transition-colors">
                All Stars
              </span>
              <span className="font-display font-bold text-lg md:text-xl leading-none text-secondary">
                Excellency Academy
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`text-sm font-medium tracking-wide hover:text-secondary transition-colors relative py-2
                  ${location === link.href ? "text-secondary after:w-full" : "text-white/90 after:w-0"}
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-secondary after:transition-all after:duration-300 hover:after:w-full
                `}
              >
                {link.label}
              </Link>
            ))}
            <a href="https://wa.me/27679454998?text=Hi,%20I%E2%80%99d%20like%20to%20enroll%20for%20extra%20classes" target="_blank" rel="noopener noreferrer">
              <Button className="bg-secondary text-primary hover:bg-white hover:text-primary font-bold shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5">
                Enroll Now
              </Button>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-secondary transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-primary/95 backdrop-blur-md border-t border-primary/20 absolute w-full left-0 animate-in slide-in-from-top-5">
          <div className="px-4 py-6 space-y-4 container mx-auto">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                  ${location === link.href 
                    ? "bg-secondary/20 text-secondary border-l-4 border-secondary" 
                    : "text-white hover:bg-white/10 hover:translate-x-1"}
                `}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-white/10 px-4">
              <a href="https://wa.me/27679454998?text=Hi,%20I%E2%80%99d%20like%20to%20enroll%20for%20extra%20classes" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-secondary text-primary hover:bg-white hover:text-primary font-bold py-6 text-lg">
                  Enroll Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
