"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}

export function ServiceCard({ title, description, icon: Icon, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="glass-card p-8 group flex flex-col h-full items-start"
    >
      <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
        <Icon className="text-primary group-hover:text-charcoal transition-colors duration-300" size={32} />
      </div>
      <h3 className="text-2xl mb-4 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-gray-400 font-nunito text-sm leading-relaxed mb-8 grow">
        {description}
      </p>
      <Link 
        href="/services" 
        className="text-primary font-nunito font-bold text-xs uppercase tracking-widest flex items-center gap-2 group/link"
      >
        Learn More 
        <span className="group-hover/link:translate-x-2 transition-transform duration-300">→</span>
      </Link>
    </motion.div>
  );
}
