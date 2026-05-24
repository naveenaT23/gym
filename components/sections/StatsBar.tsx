"use client";

import { StatCounter } from "@/components/ui/StatCounter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const xBg = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  const stats = [
    { end: 1500, label: "Active Members", suffix: "+" },
    { end: 50, label: "Modern Equipment", suffix: "+" },
    { end: 15, label: "Elite Trainers", suffix: "" },
    { end: 10, label: "Years Active", suffix: "+" },
  ];

  return (
    <section ref={containerRef} className="bg-charcoal-light py-16 border-y border-white/5 relative overflow-hidden">
      {/* Decorative text background with parallax */}
      <motion.div 
        style={{ x: xBg }}
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[120px] font-bebas text-white/[0.02] select-none pointer-events-none w-[200%] text-left"
      >
        ESTABLISHED 2014 • ELITE PERFORMANCE • RESULTS DRIVEN • FORGE YOUR LEGEND
      </motion.div>

      <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {stats.map((stat, index) => (
          <StatCounter key={index} {...stat} />
        ))}
      </div>
    </section>
  );
}
