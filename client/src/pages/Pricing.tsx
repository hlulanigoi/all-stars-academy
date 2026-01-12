import { SectionHeading } from "@/components/SectionHeading";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="container mx-auto px-4">
        <SectionHeading title="Investment in Excellence" subtitle="Pricing Plans" />
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          
          {/* Extra Classes Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-2 rounded-bl-xl">
              GRADES 8-12
            </div>
            <h3 className="text-3xl font-display font-bold text-primary mb-2">Extra Classes</h3>
            <p className="text-gray-500 mb-8">Supplementary support for current students</p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Registration Fee</span>
                <span className="font-bold text-primary text-lg">FREE</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">1 Subject</span>
                <span className="font-bold text-primary text-2xl">R200<span className="text-sm font-normal text-gray-500">/pm</span></span>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
                <span className="font-semibold text-gray-900 flex items-center gap-2">
                  <Star size={16} className="text-secondary fill-secondary" /> 2 Subjects
                </span>
                <span className="font-bold text-primary text-2xl">R300<span className="text-sm font-normal text-gray-500">/pm</span></span>
              </div>
            </div>

            <a href="https://wa.me/27679454998?text=Hi,%20I%E2%80%99d%20like%20to%20register%20for%20Extra%20Classes" target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-bold shadow-lg">
                Register for Extra Classes
              </Button>
            </a>
          </div>

          {/* Matric Rewrite Card */}
          <div className="bg-primary text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-secondary text-primary text-xs font-bold px-4 py-2 rounded-bl-xl uppercase tracking-wider">
              Popular Choice
            </div>
            
            <h3 className="text-3xl font-display font-bold text-white mb-2">Matric Rewrite</h3>
            <p className="text-white/60 mb-8">Comprehensive full-time support</p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10">
                <span className="font-semibold text-white/90">Registration Fee</span>
                <span className="font-bold text-secondary text-lg">R400</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border-b border-white/10">
                  <span className="text-white/80">1 Subject</span>
                  <span className="font-bold text-2xl">R350<span className="text-sm font-normal text-white/50">/pm</span></span>
                </div>
                <div className="flex items-center justify-between p-3 border-b border-white/10">
                  <span className="text-white/80">2 Subjects</span>
                  <span className="font-bold text-2xl">R650<span className="text-sm font-normal text-white/50">/pm</span></span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Star size={16} className="text-secondary fill-secondary" /> 3 Subjects
                  </span>
                  <span className="font-bold text-secondary text-3xl">R900<span className="text-sm font-normal text-white/50">/pm</span></span>
                </div>
              </div>
            </div>

            <ul className="space-y-3 mb-8 text-sm text-white/80">
              <li className="flex items-center gap-2"><Check size={16} className="text-secondary" /> Full syllabus coverage</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-secondary" /> Weekly assessments</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-secondary" /> Exam preparation workshops</li>
            </ul>

            <a href="https://wa.me/27679454998?text=Hi,%20I%E2%80%99d%20like%20to%20register%20for%20Matric%20Rewrite" target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-secondary hover:bg-white text-primary hover:text-primary h-12 text-lg font-bold shadow-lg transition-colors">
                Register for Rewrite
              </Button>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
