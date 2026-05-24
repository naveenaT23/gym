"use client";

import { useState, useEffect } from "react";
import { User, Lock, Save, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setName(data.user.name);
            setEmail(data.user.email);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setMessage("");

    if (newPassword && newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("New passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword: newPassword ? currentPassword : undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Profile settings updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to update profile.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-300">Profile Settings</h2>
        <p className="text-xs text-gray-500">Edit your administrator personal details and update security passwords.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 border-white/5 space-y-5">
        {status === "success" && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-2.5">
            <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-gray-200">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg flex items-start gap-2.5">
            <AlertTriangle className="text-secondary shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-gray-200">{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2 border-b border-white/5 pb-2">
            <User size={16} className="text-primary" /> Personal Information
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Admin Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2 border-b border-white/5 pb-2">
            <Lock size={16} className="text-primary" /> Update Password
          </h3>

          <p className="text-[10px] text-gray-500 font-sans -mt-1 leading-normal">
            Leave these fields blank if you do not wish to update your administrator access credentials password.
          </p>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary py-2.5 px-6 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={14} /> Saving...
              </>
            ) : (
              <>
                <Save size={14} /> Update Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
