"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export function PageHero({ title, subtitle, description, imageUrl }: PageHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[60vh] flex items-center overflow-hidden bg-charcoal"
    >
      {/* Background Parallax Layer */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-charcoal/40 z-10" />
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          priority 
          className="object-cover"
        />
      </motion.div>

      <div className="container mx-auto px-6 relative z-20">
        <motion.div 
          style={{ y: yText, opacity }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <span className="text-primary font-nunito font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
            {subtitle}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
            {title.split(" ").map((word, i) => (
              <span key={i} className={i === title.split(" ").length - 1 ? "text-primary italic" : "text-white"}>
                {word}{" "}
              </span>
            ))}
          </h1>
          <p className="text-gray-400 font-nunito text-lg max-w-xl leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/50 via-white/5 to-transparent" />
    </section>
  );
}
