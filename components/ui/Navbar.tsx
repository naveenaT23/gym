"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Membership", href: "/membership" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-charcoal/90 backdrop-blur-md py-4 shadow-lg border-b border-white/10" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm rotate-45 group-hover:rotate-0 transition-transform duration-300">
            <span className="-rotate-45 group-hover:rotate-0 transition-transform duration-300 font-bebas text-charcoal text-2xl font-bold">R</span>
          </div>
          <span className="font-bebas text-2xl tracking-tighter text-white">
            ROYAL <span className="text-primary">FITNESS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <motion.nav 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
          className="hidden md:flex items-center gap-8"
        >
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              variants={{
                hidden: { opacity: 0, y: -10 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <Link
                href={link.href}
                className={cn(
                  "font-nunito font-semibold text-sm uppercase tracking-wider transition-colors hover:text-primary relative group",
                  pathname === link.href ? "text-primary" : "text-white"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            </motion.div>
          ))}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              show: { opacity: 1, scale: 1 }
            }}
          >
            <Link href="/membership" className="btn-primary py-2 px-6 text-sm shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
              Join Now
            </Link>
          </motion.div>
        </motion.nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-charcoal-light border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "font-bebas text-2xl tracking-wide",
                    pathname === link.href ? "text-primary" : "text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/membership" onClick={() => setIsOpen(false)} className="btn-primary text-center">
                Join Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
