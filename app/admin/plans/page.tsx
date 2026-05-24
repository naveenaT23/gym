"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Award, Loader2, X, AlertTriangle } from "lucide-react";

interface Plan {
  _id: string;
  name: string;
  durationMonths: number;
  price: number;
  description?: string;
  isActive: boolean;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openAddModal = () => {
    setFormName("");
    setFormDuration("");
    setFormPrice("");
    setFormDescription("");
    setErrorMsg("");
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormName(plan.name);
    setFormDuration(plan.durationMonths.toString());
    setFormPrice(plan.price.toString());
    setFormDescription(plan.description || "");
    setErrorMsg("");
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      name: formName,
      durationMonths: Number(formDuration),
      price: Number(formPrice),
      description: formDescription,
    };

    const url = isEditMode ? `/api/plans/${selectedPlan?._id}` : "/api/plans";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save plan");
      }

      setIsModalOpen(false);
      fetchPlans();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const Deactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this membership plan? New customers will not be able to choose it, but existing customer history will remain unaffected.")) return;

    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPlans();
      } else {
        alert("Failed to deactivate plan");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-300">Membership Plans</h2>
          <p className="text-xs text-gray-500">Configure core packages, subscription durations, and standard pricing levels.</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary py-2 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={16} /> Create Plan
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Fetching plan items...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="glass-card py-20 text-center text-gray-500 border-white/5">
          No plans registered. Click &quot;Create Plan&quot; to define membership terms.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="glass-card p-6 border border-white/10 hover:border-primary/30 transition-all flex flex-col justify-between group hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary border border-primary/20">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base tracking-normal text-white">{plan.name}</h3>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {plan.durationMonths} {plan.durationMonths === 1 ? "Month" : "Months"} Duration
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-6 font-sans">
                  {plan.description || "Full gym access including strength training, cardio section, and general training support."}
                </p>
              </div>

              <div className="flex items-end justify-between border-t border-white/5 pt-4">
                <div>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase block">Pricing</span>
                  <span className="text-2xl font-bold font-bebas text-white">
                    ₹{plan.price}
                    <span className="text-xs text-gray-500 font-nunito tracking-normal font-semibold lowercase ml-1">
                      / term
                    </span>
                  </span>
                </div>
                <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded border border-white/5 transition-colors cursor-pointer"
                    title="Edit Plan"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => Deactivate(plan._id)}
                    className="p-2 hover:bg-secondary/10 text-gray-500 hover:text-secondary rounded border border-white/5 transition-colors cursor-pointer"
                    title="Deactivate Plan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md border border-white/10 shadow-2xl relative">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-charcoal-dark/50">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white">
                {isEditMode ? "Modify Subscription" : "Create New Plan"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-lg flex items-start gap-2.5">
                  <AlertTriangle className="text-secondary shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-gray-200">{errorMsg}</p>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plan Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Monthly Gold, Yearly Elite"
                  className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration (Months)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g. 3"
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 4000"
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Summarize key features included..."
                  className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary font-sans"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 bg-charcoal-dark/20 p-2 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 hover:bg-white/5 border border-white/10 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> Saving...
                    </>
                  ) : isEditMode ? (
                    "Save Plan"
                  ) : (
                    "Create Plan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
