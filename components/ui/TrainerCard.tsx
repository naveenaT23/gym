import { Instagram, Facebook, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TrainerCardProps {
  name: string;
  specialty: string;
  certifications: string[];
  imageUrl: string;
}

export function TrainerCard({ name, specialty, certifications, imageUrl }: TrainerCardProps) {
  return (
    <div className="glass-card group overflow-hidden">
      <div className="relative h-[400px] overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Social Links on Hover */}
        <div className="absolute bottom-6 left-6 flex gap-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
          <Link href="#" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-charcoal hover:bg-white transition-colors">
            <Instagram size={16} />
          </Link>
          <Link href="#" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-charcoal hover:bg-white transition-colors">
            <Facebook size={16} />
          </Link>
          <Link href="#" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-charcoal hover:bg-white transition-colors">
            <Twitter size={16} />
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <h4 className="text-2xl mb-1 group-hover:text-primary transition-colors">{name}</h4>
        <p className="text-primary font-nunito text-xs uppercase tracking-widest font-bold mb-4">{specialty}</p>
        <div className="flex flex-wrap gap-2">
          {certifications.map((cert, i) => (
            <span key={i} className="text-[10px] font-nunito font-semibold bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-400">
              {cert}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
