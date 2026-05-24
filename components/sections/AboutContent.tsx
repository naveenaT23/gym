"use client";

import Image from "next/image";
import { TrainerCard } from "@/components/ui/TrainerCard";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { motion } from "framer-motion";

const trainers = [
  {
    name: "Vikram Singh",
    specialty: "Elite Strength Coach",
    certifications: ["ACE Certified", "ISSA Professional"],
    imageUrl: "/images/trainer1.png",
  },
  {
    name: "Arjun Reddy",
    specialty: "CrossFit & HIIT Expert",
    certifications: ["CrossFit Level 2", "NASM CPT"],
    imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Priya Sharma",
    specialty: "Yoga & Wellness Coach",
    certifications: ["RYT 500", "Nutrition Specialist"],
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
  },
];

export function AboutContent() {
  return (
    <div className="pt-24 min-h-screen bg-charcoal outline-none">
      <PageHero 
        subtitle="Our Journey"
        title="BUILT FOR PASSION"
        description="From a small training club to the premier fitness destination in Andhra Pradesh. Discover the legend behind Royal Fitness."
        imageUrl="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Story & Founders */}
      <section className="section-padding">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-primary translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
            <div className="aspect-[4/5] relative overflow-hidden rounded-sm shadow-2xl">
              <Image 
                src="/images/owner.png" 
                alt="Gym Owner" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 glass-card p-6 border-l-4 border-primary">
              <h4 className="text-2xl mb-1">Rohan Varma</h4>
              <p className="text-primary font-nunito text-xs uppercase tracking-widest font-bold">Founder & Head Coach</p>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl"
            >
              FORGING A <span className="text-primary italic">LEGACY</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 font-nunito leading-relaxed text-lg italic border-l-2 border-primary pl-6"
            >
              &quot;Royal Fitness was born from a simple belief: every individual has a legend 
              waiting to be forged. We didn&apos;t just want to build a gym; we wanted to build 
              a temple for transformation.&quot;
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 font-nunito leading-relaxed"
            >
              Founded in 2014 in Pendurthi, Royal Fitness Gym started as a small strength 
              training club and evolved into the premier fitness destination of North 
              Andhra. Our commitment to high-quality equipment and rigorous training 
              standards has made us the gold standard in the region.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Modern High-End Equipment",
                "Certified Elite Trainers",
                "Community-Driven Atmosphere",
                "Science-Based Training",
                "Personalized Nutrition",
                "Results Guaranteed"
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3 text-sm font-nunito font-semibold"
                >
                  <CheckCircle2 className="text-primary" size={18} />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-charcoal-light">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 border border-white/5 bg-charcoal rounded-xl hover:border-primary/30 transition-colors group"
          >
            <h3 className="text-3xl text-primary mb-6 group-hover:translate-x-2 transition-transform">OUR MISSION</h3>
            <p className="text-gray-400 font-nunito text-lg leading-relaxed">
              To empower our community through elite-level fitness guidance and a world-class 
              training environment, enabling every member to achieve their physical and 
              mental potential.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-12 border border-white/5 bg-charcoal rounded-xl hover:border-secondary/30 transition-colors group"
          >
            <h3 className="text-3xl text-secondary mb-6 group-hover:translate-x-2 transition-transform">OUR VISION</h3>
            <p className="text-gray-400 font-nunito text-lg leading-relaxed">
              To be the most impactful fitness brand in India, recognized for producing real 
              transformations and fostering a culture of discipline, strength, and excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-nunito font-bold uppercase tracking-widest text-xs mb-4 block">
              The Experts
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl">
              MEET OUR <span className="text-primary italic">LEGENDARY</span> TEAM
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {trainers.map((trainer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <TrainerCard {...trainer} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
