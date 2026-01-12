import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-primary to-primary opacity-50"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Unsplash Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
          {/* classroom students learning */}
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80" 
            alt="Students in classroom" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-2 px-6 rounded-full bg-secondary/10 border border-secondary/30 text-secondary font-bold tracking-widest text-sm mb-6 uppercase backdrop-blur-sm">
              Est. 2016
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
              All Stars <span className="text-secondary">Excellency</span> <br /> Academy
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-light mb-10 max-w-2xl mx-auto italic font-display">
              "Building Tomorrow’s Legacy Today"
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://wa.me/27679454998?text=Hi,%20I%E2%80%99d%20like%20to%20enroll%20for%20extra%20classes" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-secondary text-primary hover:bg-white hover:text-primary font-bold text-lg px-8 h-14 rounded-full shadow-xl shadow-secondary/20 transition-all hover:scale-105">
                  Enroll Now on WhatsApp
                </Button>
              </a>
              <Link href="/about">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white font-medium text-lg px-8 h-14 rounded-full backdrop-blur-sm">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-secondary rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* HIGHLIGHTS SECTION */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-20">
            {/* Subject Card */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary mb-3">Our Subjects</h3>
              <p className="text-gray-600 mb-6">Comprehensive curriculum covering Mathematics, Physical Sciences, and more for Grades 8-12.</p>
              <Link href="/subjects">
                <span className="inline-flex items-center text-primary font-bold hover:text-secondary cursor-pointer group-hover:translate-x-1 transition-transform">
                  View Curriculum <ArrowRight size={16} className="ml-2" />
                </span>
              </Link>
            </motion.div>

            {/* Pricing Card */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-primary transition-colors duration-300 text-secondary-foreground">
                <Tag size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary mb-3">Affordable Pricing</h3>
              <p className="text-gray-600 mb-6">Quality education shouldn't break the bank. Flexible packages for extra classes and rewrites.</p>
              <Link href="/pricing">
                <span className="inline-flex items-center text-primary font-bold hover:text-secondary cursor-pointer group-hover:translate-x-1 transition-transform">
                  Check Rates <ArrowRight size={16} className="ml-2" />
                </span>
              </Link>
            </motion.div>

            {/* Schedule Card */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300 text-accent">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary mb-3">Class Schedule</h3>
              <p className="text-gray-600 mb-6">Structured timetables designed to maximize learning time without overwhelming students.</p>
              <Link href="/schedule">
                <span className="inline-flex items-center text-primary font-bold hover:text-secondary cursor-pointer group-hover:translate-x-1 transition-transform">
                  View Timetable <ArrowRight size={16} className="ml-2" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <SectionHeading title="Ready to Excel?" light subtitle="Join the Legacy" />
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Secure your spot today and take the first step towards academic excellence. Our expert tutors are ready to guide you.
          </p>
          <a href="https://wa.me/27679454998?text=Hi,%20I%E2%80%99d%20like%20to%20enroll%20for%20extra%20classes" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-secondary text-primary hover:bg-white hover:text-primary font-bold text-lg px-12 py-8 rounded-full shadow-2xl transition-all hover:scale-105">
              Start Registration
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
