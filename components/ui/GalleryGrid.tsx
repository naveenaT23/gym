"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

const categories = ["All", "Equipment", "Training", "Events", "Transformations"];

const items = [
  { id: 1, category: "Equipment", url: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH2mVjigT20oMQYApvt5phnFgX8ateO2o-CRO8yKT8L1sPxNoID0o-gDjtTeOrCrznXUqMqm6Aic2__9JYZLI08v275nmj8CCSkrh6yIZAWOR8u_QNKJyrCJVJlfT6078PyWrI=s0" },
  { id: 2, category: "Training", url: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFKUd72Z8xW2zLEJZA0Vqx11KansFRmwsNzE5R3poyWY5tsFEE78BEf0X3oS--xKUrbewNrNCKqeKDyEUissWbxAP9U0cC-L6OUTafP1nXuEKRxkASeQYIaFKNlm92t-k3-TXns=s0" },
  { id: 3, category: "Equipment", url: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHjPEOJHLKd5Xk-_6ALPKHUtigvmQPYXArCV4wzfIvaJn_lvTDDjIOg2mtdbGAtSFMnjc5s-yBjFt1wGjBQf4e5J4YZSXuGkltvwXkBjpo73gbLm5jrJhLYj9VrN0vhU0Cmw6-o=s0" },
  { id: 4, category: "Transformations", url: "/images/after_transformation.png" },
  { id: 5, category: "Training", url: "/images/before_transformation.png" },
  { id: 6, category: "Equipment", url: "/images/weight_training.png" },
  { id: 7, category: "Training", url: "/images/trainer1.png" },
  { id: 8, category: "Events", url: "/images/owner.png" },
];

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredItems = activeCategory === "All" 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="container mx-auto">
      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-2 font-bebas text-xl tracking-wider border transition-all duration-300 rounded-sm ${
              activeCategory === cat 
                ? "bg-primary border-primary text-charcoal" 
                : "bg-transparent border-white/20 text-white hover:border-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg bg-charcoal-light shadow-lg"
              onClick={() => setSelectedImage(item.url)}
            >
              <Image
                src={item.url}
                alt={item.category}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-full text-charcoal scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Maximize2 size={24} />
                </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-charcoal/80 backdrop-blur-sm text-primary px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border border-primary/20">
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-charcoal-dark/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video md:aspect-auto md:h-full overflow-hidden rounded-lg shadow-2xl border border-white/5"
            >
              <Image
                src={selectedImage}
                alt="Enlarged gallery view"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
