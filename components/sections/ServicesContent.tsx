"use client";

import { ServicesGrid } from "@/components/sections/ServicesGrid";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { motion } from "framer-motion";

export function ServicesContent() {
  return (
    <div className="pt-24 min-h-screen bg-charcoal">
      <PageHero 
        subtitle="Train Like a Legend"
        title="ELITE FITNESS SERVICES"
        description="We offer a comprehensive range of fitness disciplines designed to cater to everyone from beginners to professional athletes."
        imageUrl="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
      />

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container mx-auto">
          <ServicesGrid />
        </div>
      </section>

      {/* Why Training Matters */}
      <section className="section-padding bg-charcoal-light border-y border-white/5">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl mb-8 uppercase">NOT JUST A WORKOUT, <br /><span className="text-primary italic">A LIFESTYLE</span></h2>
            <p className="text-gray-400 font-nunito leading-relaxed mb-8">
              At Royal Fitness, we believe that fitness should be integrated into your 
              daily life seamlessly. Our trainers don&apos;t just count reps; they educate 
              you on proper form, mindset, and the &quot;why&quot; behind every movement.
            </p>
            <div className="space-y-4">
              {[
                { label: "Scientific Approach", desc: "Every program is backed by sports science.", num: "01" },
                { label: "Premium Equipment", desc: "Top-tier brands for maximum efficiency.", num: "02" },
                { label: "Elite Community", desc: "Surround yourself with success-driven people.", num: "03" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-charcoal transition-all">
                    <span className="font-bebas text-xl">{item.num}</span>
                  </div>
                  <div>
                    <h4 className="text-lg">{item.label}</h4>
                    <p className="text-gray-500 font-nunito text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-square relative overflow-hidden rounded-xl border-4 border-white/5 group shadow-2xl"
          >
            <Image 
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop" 
              alt="Gym Motivation" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
