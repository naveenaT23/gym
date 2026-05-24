"use client";

import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { motion } from "framer-motion";

export function Testimonials() {
  const testimonials = [
    {
      name: "John Doe",
      role: "Bodybuilder",
      quote: "Royal Fitness has transformed my training. The atmosphere is intense and the equipment is second to none. Best gym in Pendurthi!",
      rating: 5,
    },
    {
      name: "Sarah Williams",
      role: "Fitness Enthusiast",
      quote: "The trainers here are incredibly knowledgeable. They helped me achieve my weight loss goals faster than I ever thought possible.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Athlete",
      quote: "Love the 24/7 access. As someone with a busy schedule, being able to train at 5 AM or 11 PM is a game-changer.",
      rating: 4,
    },
  ];

  return (
    <section className="section-padding bg-charcoal-light relative overflow-hidden">
      <div className="container mx-auto mb-16">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="text-left">
            <span className="text-primary font-nunito font-bold uppercase tracking-widest text-xs mb-4 block">
              Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter">
              VOICES OF OUR <br />
              <span className="text-primary italic">LEGENDS</span>
            </h2>
          </div>
          <p className="max-w-md text-gray-400 font-nunito mb-2">
            Join thousands of others who have changed their lives at Royal Fitness Gym.
          </p>
        </div>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1600] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 px-4"
        >
          {/* Double the items for seamless loop */}
          {[...testimonials, ...testimonials, ...testimonials].map((t, index) => (
            <div key={index} className="w-[350px] md:w-[450px] shrink-0">
              <TestimonialCard {...t} />
            </div>
          ))}
        </motion.div>
        
        {/* Gradient overlays for smooth fading at edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-charcoal-light to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-charcoal-light to-transparent z-10" />
      </div>
    </section>
  );
}
