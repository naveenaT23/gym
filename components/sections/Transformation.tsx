"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export function Transformation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const xBefore = useTransform(scrollYProgress, [0.3, 0.5], ["0%", "-100%"]);
  const xAfter = useTransform(scrollYProgress, [0.3, 0.5], ["100%", "0%"]);

  return (
    <section ref={containerRef} className="py-24 bg-charcoal overflow-hidden relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary font-nunito font-bold uppercase tracking-widest text-xs mb-4 block"
            >
              Real Results
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl mb-8 leading-tight"
            >
              THE <span className="text-primary">ULTIMATE</span><br />TRANSFORMATION
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 font-nunito text-lg mb-8 leading-relaxed"
            >
              We don&apos;t just build muscles; we rebuild mindsets. Our proven 
              strategies and elite environment have helped thousands of individuals 
              reach their peak physical form.
            </motion.p>
            <div className="space-y-6">
              {[
                { label: "Weight Loss", value: "10,000+ kgs Lost" },
                { label: "Muscle Gain", value: "5,000+ Active Gains" },
              ].map((item, i) => (
                <div key={i} className="border-l-2 border-primary pl-6">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-2xl font-bebas text-white tracking-widest">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 border-primary/20">
            {/* Before Stage */}
            <motion.div 
              style={{ x: xBefore }}
              className="absolute inset-0 z-20 pointer-events-none"
            >
               <div className="absolute top-4 left-4 z-30 bg-charcoal/80 backdrop-blur-md px-3 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">Before</div>
               <Image 
                src="/images/before_transformation.png"
                alt="Before Training"
                fill
                className="object-cover object-top"
               />
            </motion.div>

            {/* After Stage */}
            <motion.div 
              style={{ x: xAfter }}
              className="absolute inset-0 z-10"
            >
              <div className="absolute top-4 right-4 z-30 bg-primary px-3 py-1 rounded text-[10px] font-bold text-charcoal uppercase tracking-widest">After</div>
              <Image 
                src="/images/after_transformation.png"
                alt="After Training"
                fill
                className="object-cover object-top"
               />
            </motion.div>

            {/* Reveal Overlay Center Line */}
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-primary/30 z-30 opacity-50" />
          </div>
        </div>
      </div>
      
      {/* Decorative Parallax Text */}
      <motion.div 
        initial={{ x: "0%" }}
        whileInView={{ x: "-10%" }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 text-[20vw] font-bebas text-white/[0.01] select-none pointer-events-none whitespace-nowrap"
      >
        TRANSFORMATION GLORY JOURNEY POWER STRENGTH
      </motion.div>
    </section>
  );
}
