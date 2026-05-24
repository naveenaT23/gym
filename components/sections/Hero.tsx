"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const words = "FORGE YOUR LEGEND".split(" ");

  return (
    <section 
      ref={containerRef}
      className="relative h-[110vh] flex items-center justify-center overflow-hidden bg-charcoal"
    >
      {/* Parallax Background Layer */}
      <motion.div 
        style={{ y: yBg, scale }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-charcoal/10 z-10" />
        
        <Image 
          src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2070&auto=format&fit=crop"
          alt="Royal Fitness Gym Interior"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* Floating UI Accents (Figma Style) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full"
        />
      </div>

      {/* Content Layer */}
      <motion.div 
        style={{ y: yText, opacity }}
        className="container mx-auto px-6 relative z-20 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1 border border-primary/30 rounded-full text-primary font-nunito font-bold uppercase tracking-[0.3em] text-[10px] mb-8 bg-primary/5 backdrop-blur-sm">
            Est. 2014 • Pendurthi, AP
          </span>
          
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] mb-8 leading-[0.85] font-bebas flex flex-wrap justify-center gap-x-6 gap-y-2">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2 + (i * 0.1),
                  ease: [0.2, 0.65, 0.3, 0.9]
                }}
                className={word === "LEGEND" ? "text-primary drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] italic" : "text-white"}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="max-w-xl mx-auto text-gray-400 font-nunito text-lg mb-12 leading-relaxed"
          >
            Experience the gold standard of fitness. Elite equipment, expert guidance, 
            and a community built on grit and glory.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/membership" className="btn-primary w-full sm:w-auto px-12 group relative overflow-hidden">
              <span className="relative z-10">Start Training</span>
              <motion.div 
                className="absolute inset-0 bg-white"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <Link href="/services" className="flex items-center gap-3 text-white font-bebas text-xl tracking-widest hover:text-primary transition-colors group">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary transition-colors">
                <Play size={16} className="fill-white group-hover:fill-primary ml-1" />
              </div>
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-10 left-11/12 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-bebas text-[10px] tracking-[0.3em] text-gray-500 uppercase rotate-90 mb-8">Scroll</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
}
