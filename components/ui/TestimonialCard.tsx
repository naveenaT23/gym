import { Star, Quote } from "lucide-react";
import Image from "next/image";

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export function TestimonialCard({ name, role, quote, rating }: TestimonialCardProps) {
  return (
    <div className="glass-card p-10 relative overflow-hidden group">
      <Quote className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/20 transition-colors" size={60} />
      
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "fill-primary text-primary" : "text-gray-600"} 
          />
        ))}
      </div>

      <p className="text-gray-300 font-nunito italic mb-8 relative z-10 leading-relaxed">
        &quot;{quote}&quot;
      </p>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-charcoal-light border border-primary/20">
          <div className="w-full h-full flex items-center justify-center font-bebas text-primary text-xl">
            {name[0]}
          </div>
        </div>
        <div>
          <h4 className="font-bebas text-lg leading-none mb-1">{name}</h4>
          <p className="text-primary text-xs uppercase tracking-widest font-bold">{role}</p>
        </div>
      </div>
    </div>
  );
}
