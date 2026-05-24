"use client";

import { motion } from "framer-motion";
import { MembershipCard } from "@/components/ui/MembershipCard";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    type: "Basic Plan",
    price: "999",
    description: "Ideal for beginners starting their journey.",
    features: [
      "Access to Gym Hall",
      "Standard Equipment",
      "Locker Facility",
      "Mobile App Support",
      "Free Consultation",
    ],
    notIncluded: [
      "Personal Trainer",
      "Nutrition Planning",
      "24/7 Priority Access",
      "Monthly Assessment",
    ],
  },
  {
    type: "Pro Plan",
    price: "1,499",
    description: "Perfect for serious fitness enthusiasts.",
    features: [
      "All Basic Features",
      "Unlimited Group Classes",
      "CrossFit Box Access",
      "Cardio Zone Access",
      "Monthly Assessment",
      "Discount on Supplements",
    ],
    notIncluded: [
      "Personal Trainer",
      "24/7 Priority Access",
    ],
    highlight: true,
  },
  {
    type: "Elite Plan",
    price: "2,499",
    description: "The complete premium experience for legends.",
    features: [
      "All Pro Features",
      "Dedicated Personal Trainer",
      "Customized Diet Plans",
      "24/7 Priority Access",
      "Massage Therapy (1/mo)",
      "Laundry Service",
      "VIP Locker Room",
    ],
    notIncluded: [],
  },
];

const faqs = [
  {
    question: "Is there a registration fee?",
    answer: "Yes, there is a one-time registration fee of ₹500 for all new members which covers your membership card and welcome kit.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Absolutely! You can upgrade your plan at any time. The difference in the monthly fee will be calculated on a pro-rata basis.",
  },
  {
    question: "Do you offer family discounts?",
    answer: "Yes, we offer a 10% discount for families of 3 or more members enrolling together.",
  },
  {
    question: "What are your 24/7 access rules?",
    answer: "Elite members get a personalized biometric key that allows access even outside regular staffed hours. Safety monitoring is always active.",
  },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left hover:text-primary transition-colors focus:outline-none"
      >
        <span className="text-xl font-nunito font-semibold">{question}</span>
        {isOpen ? <Minus className="text-primary" /> : <Plus className="text-primary" />}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-gray-400 font-nunito leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

import { PageHero } from "@/components/ui/PageHero";

export default function MembershipPage() {
  return (
    <div className="pt-24 min-h-screen bg-charcoal outline-none">
      <PageHero 
        subtitle="Pricing & Plans"
        title="INVEST IN YOURSELF"
        description="Choose the plan that fits your goals. No hidden contracts, just pure transformation with elite 24/7 access."
        imageUrl="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Pricing Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 max-w-7xl mx-auto items-center">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <MembershipCard {...plan} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-charcoal-light border-y border-white/5">
        <div className="container mx-auto overflow-x-auto">
          <h2 className="text-4xl mb-12 text-center uppercase tracking-wider">Feature <span className="text-primary">Comparison</span></h2>
          <table className="w-full text-left font-nunito min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 font-bebas text-2xl tracking-wider uppercase">Features</th>
                <th className="py-4 text-primary text-center">BASIC</th>
                <th className="py-4 text-primary text-center">PRO</th>
                <th className="py-4 text-primary text-center">ELITE</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {[
                ["Access to Gym Hall", "Y", "Y", "Y"],
                ["Locker Facility", "Y", "Y", "Y"],
                ["Group Classes", "N", "Y", "Y"],
                ["CrossFit Access", "N", "Y", "Y"],
                ["Personal Trainer", "N", "N", "Y"],
                ["24/7 Priority Access", "N", "N", "Y"],
                ["Diet Planning", "N", "N", "Y"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 font-semibold">{row[0]}</td>
                  <td className="py-4 text-center">{row[1] === "Y" ? "✓" : "—"}</td>
                  <td className="py-4 text-center">{row[2] === "Y" ? "✓" : "—"}</td>
                  <td className="py-4 text-center">{row[3] === "Y" ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl uppercase tracking-wider">Frequently Asked <span className="text-primary">Questions</span></h2>
          </div>
          <div className="glass-card p-4 md:p-8">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} {...faq} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
