"use client";

import { ContactForm } from "@/components/ui/ContactForm";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { motion } from "framer-motion";

export function ContactContent() {
  return (
    <div className="pt-24 min-h-screen bg-charcoal outline-none">
      <PageHero 
        subtitle="Connect With Us"
        title="JOIN THE ROYAL FAMILY"
        description="Ready to transform? Drop us a message or visit our state-of-the-art facility in Pendurthi. We're here to help you forge your legend."
        imageUrl="https://images.unsplash.com/photo-1543285198-3af15c4592ce?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="section-padding bg-charcoal-light">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/3 space-y-12"
            >
              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: "Our Location",
                    content: "Sarada Nagar, Karmika Nagar, Pendurthi,\nChinnamusidivada, AP 531173"
                  },
                  {
                    icon: Phone,
                    title: "Call Us",
                    content: "074796 49999\nAvailable Mon-Sat 5AM-10PM"
                  },
                  {
                    icon: Mail,
                    title: "Email Us",
                    content: "info@royalfitnessgym.com\nSupport response in 24h"
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 border border-primary/20">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bebas text-xl tracking-wider mb-1">{item.title}</h4>
                      <p className="text-gray-400 font-nunito text-sm whitespace-pre-line">
                        {item.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div>
                <h4 className="font-bebas text-xl tracking-wider mb-4">Follow Our Progress</h4>
                <div className="flex gap-4">
                  {[Instagram, Facebook, Youtube].map((Icon, i) => (
                    <motion.a 
                      key={i}
                      whileHover={{ scale: 1.1, backgroundColor: "#D4AF37", color: "#121212" }}
                      href="#" 
                      className="w-10 h-10 bg-white/5 text-white transition-colors flex items-center justify-center rounded-sm border border-white/10"
                    >
                      <Icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form Section */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-2/3"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[500px] w-full relative grayscale hover:grayscale-0 transition-all duration-700">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d963.5508045462046!2d83.20630308735551!3d17.808158408119343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39671e322d0247%3A0x56090080cf411e68!2sRoyal%20Fitness%20Gym!5e1!3m2!1sen!2sin!4v1777192037655!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-charcoal to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-charcoal to-transparent pointer-events-none" />
      </section>
    </div>
  );
}
