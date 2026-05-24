import { Check, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MembershipCardProps {
  type: string;
  price: string;
  description: string;
  features: string[];
  notIncluded: string[];
  highlight?: boolean;
}

export function MembershipCard({ 
  type, 
  price, 
  description, 
  features, 
  notIncluded, 
  highlight 
}: MembershipCardProps) {
  return (
    <div className={cn(
      "glass-card p-8 relative flex flex-col h-full",
      highlight ? "border-primary border-2 scale-105 shadow-[0_0_30px_rgba(212,175,55,0.15)] z-10" : "border-white/5"
    )}>
      {highlight && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-charcoal px-4 py-1 font-bebas text-sm tracking-widest rounded-full uppercase">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-3xl mb-2">{type}</h3>
        <p className="text-gray-400 font-nunito text-sm leading-relaxed">{description}</p>
      </div>

      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-5xl font-bebas text-primary">₹{price}</span>
        <span className="text-gray-500 font-nunito text-sm uppercase tracking-widest">/ Month</span>
      </div>

      <div className="space-y-4 mb-12 grow">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <Check size={18} className="text-primary mt-0.5 shrink-0" />
            <span className="text-sm text-gray-300 font-nunito">{feature}</span>
          </div>
        ))}
        {notIncluded.map((feature, i) => (
          <div key={i} className="flex items-start gap-3 opacity-50">
            <X size={18} className="text-gray-600 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-500 font-nunito">{feature}</span>
          </div>
        ))}
      </div>

      <Link 
        href="/contact" 
        className={cn(
          "w-full text-center py-4 font-bebas text-xl tracking-widest uppercase transition-all duration-300",
          highlight ? "bg-primary text-charcoal hover:bg-white" : "bg-white/5 text-white hover:bg-white hover:text-charcoal"
        )}
      >
        Choose Plan
      </Link>
    </div>
  );
}
