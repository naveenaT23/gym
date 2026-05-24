"use client";

import { Dumbbell, Clock, Users, Utensils } from "lucide-react";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { motion } from "framer-motion";

export function Features() {
  const features = [
    {
      title: "24/7 Access",
      description: "Train on your schedule. Our gym is accessible round the clock for all elite members.",
      icon: Clock,
    },
    {
      title: "Expert Trainers",
      description: "Get personalized guidance from certified professionals who care about your results.",
      icon: Users,
    },
    {
      title: "Modern Equipment",
      description: "Top-of-the-line strength and cardio machines designed for peak performance.",
      icon: Dumbbell,
    },
    {
      title: "Diet Plans",
      description: "Fuel your body with customized nutrition strategies tailored to your goals.",
      icon: Utensils,
    },
  ];

  return (
    <section className="section-padding bg-charcoal">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-nunito font-bold uppercase tracking-widest text-xs mb-4 block">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl">
            PREMIUM <span className="text-primary">EXPERIENCE</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-6" />
        </div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <ServiceCard key={index} {...feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
