"use client";

import { 
  Dumbbell, 
  Activity, 
  Zap, 
  Flower2, 
  UserSquare, 
  Utensils, 
  Flame, 
  Waves 
} from "lucide-react";
import { ServiceCard } from "@/components/ui/ServiceCard";

const services = [
  {
    title: "Weight Training",
    description: "Build raw power and muscle mass with our extensive collection of free weights, plate-loaded machines, and expert strength coaching.",
    icon: Dumbbell,
  },
  {
    title: "Cardio Zone",
    description: "Boost your endurance with state-of-the-art treadmills, ellipticals, and stationary bikes in an air-conditioned environment.",
    icon: Activity,
  },
  {
    title: "CrossFit Box",
    description: "High-intensity functional movements designed to push you to your absolute limit. Kettlebells, ropes, and rowers await.",
    icon: Zap,
  },
  {
    title: "Yoga Studio",
    description: "Find your balance and improve flexibility in our serene yoga sessions led by experienced practitioners in a calm setting.",
    icon: Flower2,
  },
  {
    title: "Personal Training",
    description: "One-on-one sessions tailored to your specific goals, body type, and fitness level. Get the attention you deserve.",
    icon: UserSquare,
  },
  {
    title: "Nutrition Plans",
    description: "Customized diet strategies and supplement guidance to fuel your workouts and ensure maximum transformation results.",
    icon: Utensils,
  },
  {
    title: "Kickboxing",
    description: "Learn technique while burning massive calories in our high-energy kickboxing and combat fitness classes.",
    icon: Flame,
  },
  {
    title: "Recovery Zone",
    description: "Post-workout recovery is crucial. Access our specialized stretching areas and wellness consultation services.",
    icon: Waves,
  },
];

export function ServicesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service, index) => (
        <ServiceCard key={index} {...service} index={index} />
      ))}
    </div>
  );
}
