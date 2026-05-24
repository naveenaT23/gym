import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-fixed bg-center scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-charcoal/30" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-5xl md:text-7xl mb-8 text-white drop-shadow-lg">
          START YOUR <span className="text-charcoal bg-white px-4 inline-block -rotate-2">FREE</span> TRIAL TODAY
        </h2>
        <p className="max-w-2xl mx-auto text-white/90 font-nunito text-xl mb-12 font-semibold">
          Don&apos;t wait for tomorrow. Your journey to greatness begins with a single step. 
          Join us and forge your legend.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/contact" className="px-10 py-4 bg-charcoal text-white font-bebas text-2xl tracking-widest hover:bg-white hover:text-charcoal transition-all duration-300 rounded-sm">
            Contact Us
          </Link>
          <Link href="/membership" className="px-10 py-4 bg-white text-charcoal font-bebas text-2xl tracking-widest hover:bg-charcoal hover:text-white transition-all duration-300 rounded-sm">
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
