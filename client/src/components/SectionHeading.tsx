import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({ title, subtitle, alignment = "center", light = false }: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${alignment === "center" ? "text-center" : "text-left"}`}>
      {subtitle && (
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`uppercase tracking-widest text-sm font-semibold ${light ? "text-secondary" : "text-primary/80"} mb-2 block`}
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-3xl md:text-4xl lg:text-5xl font-bold font-display ${light ? "text-white" : "text-primary"}`}
      >
        {title}
      </motion.h2>
      <div className={`h-1.5 w-24 bg-secondary mt-4 rounded-full ${alignment === "center" ? "mx-auto" : ""}`} />
    </div>
  );
}
