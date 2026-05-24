"use client";

import { motion } from "framer-motion";

const brands = [
  "TechnoGym", "Hammer Strength", "Life Fitness", "Rogue", "Eleiko", "Precor", "Matrix"
];

export function Brands() {
  return (
    <section className="py-20 bg-charcoal border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <p className="text-center text-gray-500 font-nunito text-xs uppercase tracking-[0.4em] font-bold">
          Equipped With The Best
        </p>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-24 whitespace-nowrap px-12"
        >
          {/* First set of brands */}
          {brands.map((brand, i) => (
            <span key={i} className="text-4xl md:text-6xl font-bebas text-white/10 hover:text-primary/50 transition-colors cursor-default">
              {brand}
            </span>
          ))}
          {/* Duplicate set for seamless scrolling */}
          {brands.map((brand, i) => (
            <span key={`dup-${i}`} className="text-4xl md:text-6xl font-bebas text-white/10 hover:text-primary/50 transition-colors cursor-default">
              {brand}
            </span>
          ))}
          {/* Triplicate for large screens */}
          {brands.map((brand, i) => (
            <span key={`dup2-${i}`} className="text-4xl md:text-6xl font-bebas text-white/10 hover:text-primary/50 transition-colors cursor-default">
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
