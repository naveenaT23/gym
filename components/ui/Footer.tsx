"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-charcoal-dark border-t border-white/10 pt-16 pb-8 outline-none"
    >
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm rotate-45">
              <span className="-rotate-45 font-bebas text-charcoal text-2xl font-bold">R</span>
            </div>
            <span className="font-bebas text-2xl tracking-tighter text-white">
              ROYAL <span className="text-primary">FITNESS</span>
            </span>
          </Link>
          <p className="text-gray-400 font-nunito text-sm leading-relaxed">
            Forge your legend at Royal Fitness Gym. We provide state-of-the-art equipment, 
            expert trainers, and a powerful environment to help you achieve your ultimate 
            physical potential.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center text-white hover:bg-primary hover:text-charcoal transition-all">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center text-white hover:bg-primary hover:text-charcoal transition-all">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center text-white hover:bg-primary hover:text-charcoal transition-all">
              <Youtube size={20} />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl mb-6">Quick Links</h3>
          <ul className="space-y-4 font-nunito text-gray-400 uppercase text-xs tracking-widest">
            <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
            <li><Link href="/services" className="hover:text-primary transition-colors">Our Services</Link></li>
            <li><Link href="/membership" className="hover:text-primary transition-colors">Membership Plans</Link></li>
            <li><Link href="/gallery" className="hover:text-primary transition-colors">Photo Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl mb-6">Contact Us</h3>
          <ul className="space-y-4 font-nunito text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin className="text-primary shrink-0" size={18} />
              <span>Sarada Nagar, Karmika Nagar, Pendurthi, Chinnamusidivada, AP 531173</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-primary shrink-0" size={18} />
              <span>074796 49999</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-primary shrink-0" size={18} />
              <span>info@royalfitnessgym.com</span>
            </li>
          </ul>
        </div>

        {/* Opening Hours */}
        <div>
          <h3 className="text-xl mb-6">Opening Hours</h3>
          <ul className="space-y-4 font-nunito text-sm text-gray-400">
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span>Mon - Sat</span>
              <span className="text-white">5:00 AM - 10:00 PM</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span>Sunday</span>
              <span className="text-white">6:00 AM - 8:00 PM</span>
            </li>
            <li className="flex items-center gap-2 pt-4">
              <Clock className="text-secondary" size={18} />
              <span className="text-secondary font-bold uppercase tracking-wider text-xs">Open 24/7 for Elite Members</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm font-nunito">
          © {currentYear} Royal Fitness Gym. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm font-nunito">
          Designed for Excellence. Forge Your Legend.
        </p>
      </div>

      {/* WhatsApp Floating Button */}
      <Link
        href="https://wa.me/917479649999"
        target="_blank"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </Link>
    </motion.footer>
  );
}

