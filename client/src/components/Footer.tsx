import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold">
              <span className="text-white">All Stars</span>{" "}
              <span className="text-secondary">Excellency Academy</span>
            </h3>
            <p className="text-white/80 leading-relaxed max-w-xs">
              Building Tomorrow’s Legacy Today. We are committed to empowering learners through quality education and dedicated mentorship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-secondary font-display">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Subjects', 'Pricing', 'Schedule', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="text-white/80 hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-secondary font-display">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/80">
                <MapPin className="shrink-0 text-secondary mt-1" size={18} />
                <span>Ha Ramavhoya,<br />Next to Traffic Department</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Phone className="shrink-0 text-secondary" size={18} />
                <a href="tel:0769454998" className="hover:text-secondary">076 945 4998</a>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Phone className="shrink-0 text-secondary" size={18} />
                <a href="tel:0609244815" className="hover:text-secondary">060 924 4815</a>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Mail className="shrink-0 text-secondary" size={18} />
                <a href="mailto:info@allstarsacademy.co.za" className="hover:text-secondary">info@allstarsacademy.co.za</a>
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-secondary font-display">Connect</h4>
            <div className="flex gap-4 mb-6">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="bg-white/10 p-2 rounded-lg hover:bg-secondary hover:text-primary transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} All Stars Excellency Academy. All rights reserved.
            </p>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
          <p>Designed with excellence for educational success.</p>
        </div>
      </div>
    </footer>
  );
}
