"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

type FormInputs = {
  name: string;
  email: string;
  phone: string;
  service: string;
  plan: string;
  message: string;
};

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    // Construct WhatsApp message
    const message = `*Royal Fitness Inquiry*%0A%0A*Name:* ${data.name}%0A*Email:* ${data.email}%0A*Phone:* ${data.phone}%0A*Interested In:* ${data.service}%0A*Selected Plan:* ${data.plan}%0A*Message:* ${data.message}`;
    
    const whatsappUrl = `https://wa.me/917479649999?text=${message}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center"
      >
        <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h3 className="text-3xl mb-4 uppercase tracking-wider">Message Received!</h3>
        <p className="text-gray-400 font-nunito mb-8 max-w-md mx-auto">
          Thank you for reaching out. A Royal Fitness consultant will contact you within 
          the next 24 hours to forge your legend.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="btn-outline"
        >
          Send Another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 md:p-12 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] font-bebas text-gray-400">Full Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full bg-charcoal border border-white/10 rounded px-4 py-3 font-nunito focus:border-primary outline-none transition-colors"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-secondary text-[10px] uppercase font-bold">{errors.name.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] font-bebas text-gray-400">Email Address</label>
          <input
            {...register("email", { 
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
            })}
            className="w-full bg-charcoal border border-white/10 rounded px-4 py-3 font-nunito focus:border-primary outline-none transition-colors"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-secondary text-[10px] uppercase font-bold">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] font-bebas text-gray-400">Phone Number</label>
          <input
            {...register("phone", { required: "Phone is required" })}
            className="w-full bg-charcoal border border-white/10 rounded px-4 py-3 font-nunito focus:border-primary outline-none transition-colors"
            placeholder="+91 74796 49999"
          />
          {errors.phone && <p className="text-secondary text-[10px] uppercase font-bold">{errors.phone.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] font-bebas text-gray-400">Interested In</label>
          <select
            {...register("service")}
            className="w-full bg-charcoal border border-white/10 rounded px-4 py-3 font-nunito focus:border-primary outline-none transition-colors appearance-none"
          >
            <option value="General Gym">General Gym Access</option>
            <option value="Personal Training">Personal Training</option>
            <option value="CrossFit">CrossFit Box</option>
            <option value="Yoga">Yoga & Wellness</option>
            <option value="Transformation">Transformation Program</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] font-bebas text-gray-400">Membership Plan</label>
          <select
            {...register("plan")}
            className="w-full bg-charcoal border border-white/10 rounded px-4 py-3 font-nunito focus:border-primary outline-none transition-colors appearance-none"
          >
            <option value="Basic">Basic Plan (₹1,500/mo)</option>
            <option value="Pro">Pro Plan (₹2,500/mo)</option>
            <option value="Elite">Elite Plan (₹4,500/mo)</option>
            <option value="Trial">Single Session / Trial</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] font-bebas text-gray-400">Message</label>
        <textarea
          {...register("message", { required: "Message is required" })}
          rows={4}
          className="w-full bg-charcoal border border-white/10 rounded px-4 py-3 font-nunito focus:border-primary outline-none transition-colors resize-none"
          placeholder="Tell us about your fitness goals..."
        />
        {errors.message && <p className="text-secondary text-[10px] uppercase font-bold">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-xl"
      >
        {isSubmitting ? (
          <div className="w-6 h-6 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            SEND MESSAGE <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
}
