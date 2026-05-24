"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, motion } from "framer-motion";

interface StatCounterProps {
  end: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export function StatCounter({ end, label, suffix = "", duration = 2 }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-center group">
      <div className="text-4xl md:text-5xl font-bebas text-primary mb-2 group-hover:scale-110 transition-transform">
        {count}{suffix}
      </div>
      <div className="text-gray-400 font-nunito uppercase tracking-tighter text-sm font-bold">
        {label}
      </div>
    </div>
  );
}
