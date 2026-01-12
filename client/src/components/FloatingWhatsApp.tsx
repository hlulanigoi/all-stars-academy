import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/27679454998?text=Hi,%20I%E2%80%99d%20like%20to%20enroll%20for%20extra%20classes"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-black/20 hover:scale-110 hover:shadow-xl transition-all duration-300 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ y: -5 }}
    >
      <MessageCircle size={32} fill="white" className="text-white" />
      <span className="absolute right-full mr-4 bg-white text-primary px-4 py-2 rounded-xl shadow-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Chat with us!
      </span>
    </motion.a>
  );
}
