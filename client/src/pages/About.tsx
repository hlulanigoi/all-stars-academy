import { SectionHeading } from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { Award, Users, Target, Phone } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <SectionHeading title="About Our Academy" subtitle="Who We Are" light />
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Founded in 2016 with a singular mission: to empower learners and build a legacy of academic success.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-display font-bold text-primary mb-6">Our Mission & Vision</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 bg-secondary/20 rounded-xl flex items-center justify-center text-primary">
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Our Mission</h4>
                    <p className="text-gray-600 leading-relaxed">To empower learners through rigorous academic support, mentorship, and a commitment to excellence.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Our Vision</h4>
                    <p className="text-gray-600 leading-relaxed">Building tomorrow's legacy today by producing top-tier graduates ready for tertiary challenges.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative shadow-lg rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* teacher instructing */}
                <img 
                  src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80" 
                  alt="Teaching session" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-secondary p-6 rounded-xl shadow-lg max-w-xs hidden md:block">
                <p className="text-primary font-bold font-display text-lg">"Excellence is not an act, but a habit."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Directors Section */}
        <div className="mt-24">
          <SectionHeading title="Meet Our Directors" subtitle="Leadership" />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Director 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-all"
            >
              <div className="w-24 h-24 bg-primary text-white rounded-full mx-auto flex items-center justify-center text-3xl font-display font-bold mb-6 shadow-lg shadow-primary/20">
                MN
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">Masakona N.C.</h3>
              <p className="text-secondary font-medium uppercase tracking-widest text-sm mb-6">Director</p>
              <div className="flex flex-col gap-2 items-center text-gray-600">
                <a href="https://wa.me/27769454998" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone size={16} /> WhatsApp: 076 945 4998
                </a>
                <a href="tel:0695045003" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone size={16} /> Call: 069 504 5003
                </a>
              </div>
            </motion.div>

            {/* Director 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-all"
            >
              <div className="w-24 h-24 bg-primary text-white rounded-full mx-auto flex items-center justify-center text-3xl font-display font-bold mb-6 shadow-lg shadow-primary/20">
                NO
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">Netshifhefhe O.</h3>
              <p className="text-secondary font-medium uppercase tracking-widest text-sm mb-6">Director</p>
              <div className="flex flex-col gap-2 items-center text-gray-600">
                <a href="tel:0609244815" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone size={16} /> Call: 060 924 4815
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
