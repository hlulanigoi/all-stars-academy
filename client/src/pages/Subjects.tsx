import { SectionHeading } from "@/components/SectionHeading";
import { Calculator, FlaskConical, Dna, BookOpen, Atom } from "lucide-react";
import { motion } from "framer-motion";

const SUBJECTS = [
  {
    grade: "Grade 8 - 9",
    items: [
      { name: "Mathematics", icon: Calculator, color: "bg-blue-100 text-blue-600" },
      { name: "Natural Sciences", icon: Dna, color: "bg-green-100 text-green-600" },
    ]
  },
  {
    grade: "Grade 10 - 12",
    items: [
      { name: "Mathematics", icon: Calculator, color: "bg-blue-100 text-blue-600" },
      { name: "Physical Sciences", icon: Atom, color: "bg-purple-100 text-purple-600" },
      { name: "Accounting", icon: BookOpen, color: "bg-orange-100 text-orange-600" },
      { name: "Life Sciences", icon: Dna, color: "bg-green-100 text-green-600" },
    ]
  },
  {
    grade: "Matric Rewrite",
    items: [
      { name: "Full Syllabus Support", icon: BookOpen, color: "bg-secondary/20 text-primary" },
      { name: "Exam Prep", icon: FlaskConical, color: "bg-secondary/20 text-primary" },
    ]
  }
];

export default function Subjects() {
  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading title="Our Curriculum" subtitle="Subjects We Offer" />
        
        <div className="space-y-16 max-w-5xl mx-auto">
          {SUBJECTS.map((level, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gray-200 flex-1"></div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-primary">{level.grade}</h3>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {level.items.map((subject, sIdx) => (
                  <div key={sIdx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-secondary/30 transition-all flex items-center gap-6 group">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${subject.color} group-hover:scale-110 transition-transform duration-300`}>
                      <subject.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-primary mb-1">{subject.name}</h4>
                      <p className="text-sm text-gray-500">Expert tuition & support</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
