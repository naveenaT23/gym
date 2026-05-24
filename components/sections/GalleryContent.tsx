"use client";

import { GalleryGrid } from "@/components/ui/GalleryGrid";
import { PageHero } from "@/components/ui/PageHero";
import { motion } from "framer-motion";

export function GalleryContent() {
  return (
    <div className="pt-24 min-h-screen bg-charcoal outline-none">
      <PageHero 
        subtitle="Visual Experience"
        title="THE ROYAL GALLERY"
        description="See the intensity, the dedication, and the results. Our facility is designed to inspire greatness in every member."
        imageUrl="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Grid Section */}
      <section className="py-20 px-6">
        <GalleryGrid />
      </section>

      {/* Video Section Placeholder */}
      <section className="section-padding bg-charcoal-light border-y border-white/5">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-4xl md:text-5xl mb-8">WORKOUT <span className="text-primary italic">REELS</span></h2>
              <p className="text-gray-400 font-nunito text-lg leading-relaxed mb-8">
                Experience the energy of Royal Fitness through our cinematic workout reels. 
                Follow us on Instagram for daily motivation and training tips.
              </p>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-primary font-bebas text-2xl hover:text-white transition-colors"
              >
                Follow on Instagram @royalfitnessgym
              </a>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 aspect-video w-full glass-card flex items-center justify-center relative overflow-hidden group border-primary/20 shadow-2xl"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
              <button className="w-20 h-20 bg-primary/90 text-charcoal rounded-full flex items-center justify-center shadow-2xl relative z-10 hover:scale-110 hover:bg-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
