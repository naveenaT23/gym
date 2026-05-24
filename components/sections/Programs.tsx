"use client";

import { motion } from "framer-motion";
import { Dumbbell, Activity, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

const programs = [
  {
    title: "Elite Strength",
    tag: "High Intensity",
    icon: Dumbbell,
    image: "/images/weight_training.png",
    features: ["Heavy Compound Lifts", "Personalized Coaching", "Strength Tracking"]
  },
  {
    title: "Body Sculpt",
    tag: "Aesthetics",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
    features: ["Isolation Exercises", "Hypertrophy focus", "Muscle Definition"]
  },
  {
    title: "Combat Fitness",
    tag: "Conditioning",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop",
    features: ["Kickboxing Drills", "Cardio Blast", "Functional Agility"]
  },
  {
    title: "Total Wellness",
    tag: "Balance",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070&auto=format&fit=crop",
    features: ["Yoga & Mobility", "Nutrition Guidance", "Mental Resilience"]
  }
];

export function Programs() {
  return (
    <section className="py-24 bg-charcoal-light relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-nunito font-bold uppercase tracking-widest text-xs mb-4 block">
            Specialized Training
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl">
            OUR <span className="text-primary">ELITE</span> PROGRAMS
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative h-[400px] rounded-2xl overflow-hidden glass-card border-none"
            >
              <Image 
                src={program.image}
                alt={program.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.3] group-hover:brightness-[0.4]"
              />
              
              {/* Gold Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent z-10" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-charcoal transition-colors">
                    <program.icon size={24} />
                  </div>
                  <div>
                    <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">{program.tag}</span>
                    <h3 className="text-3xl font-bebas tracking-wider">{program.title}</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {program.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-2">
                       <div className="w-1 h-1 bg-primary rounded-full" />
                       <span className="text-xs text-gray-300 font-nunito">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Figma Pulse */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0, 0.2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl p-events-none"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
