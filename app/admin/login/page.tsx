"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Dumbbell, AlertTriangle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-nunito">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/gym-login-bg.png')" }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70" />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(230,57,70,0.08),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      
      <div className="relative w-full max-w-md p-8 mx-4 glass-card border border-white/10 glow-primary">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary flex items-center justify-center rounded-sm rotate-45 mb-4 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Dumbbell size={28} className="-rotate-45 text-charcoal" />
          </div>
          <h2 className="text-3xl font-bebas tracking-wide text-white">
            ROYAL <span className="text-primary">FITNESS</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-semibold text-xs">
            Membership Control Panel
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-secondary shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-gray-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@royalfitness.com"
                className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors font-nunito"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-3 pl-10 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors font-nunito"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 rounded-lg flex items-center justify-center font-bold tracking-widest text-sm mt-4 hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "AUTHENTICATING..." : "ACCESS PANEL"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">
            Demo Credentials
          </p>
          <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-xs text-gray-400 space-y-1 inline-block text-left w-full">
            <div>
              <span className="font-semibold text-gray-300">Email:</span>{" "}
              <code className="text-primary font-mono">admin@royalfitness.com</code>
            </div>
            <div>
              <span className="font-semibold text-gray-300">Password:</span>{" "}
              <code className="text-primary font-mono">adminpassword</code>
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-2 italic">
            *Credentials will seed automatically on your first login attempt.
          </p>
        </div>
      </div>
    </div>
  );
}
