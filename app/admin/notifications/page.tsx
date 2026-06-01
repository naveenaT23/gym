"use client";

import { useState, useEffect } from "react";
import { Bell, RefreshCw, Loader2, Info, MessageSquare, User, Clock } from "lucide-react";

interface LogItem {
  _id: string;
  customerName: string;
  mobileNumber: string;
  type: "7_days_before" | "3_days_before" | "on_expiry" | "after_expiry" | "manual";
  status: "Sent" | "Failed" | "Pending";
  sentAt: string;
  error?: string;
}

export default function NotificationsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expiringMembers, setExpiringMembers] = useState<any[]>([]);
  const [loadingExpiring, setLoadingExpiring] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        const mapped = (data.logs || []).map((log: any) => ({
          _id: log._id,
          customerName: log.customerName || "Unknown",
          mobileNumber: log.mobile || "—",
          type: log.messageType || "manual",
          status: log.sentStatus || "Failed",
          sentAt: log.sentAt,
          error: log.errorMessage || "",
        }));
        setLogs(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiringMembers = async () => {
    setLoadingExpiring(true);
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const warningLimit = new Date();
        warningLimit.setDate(today.getDate() + 7);
        const filtered = (data.customers || []).filter(
          (m: any) => new Date(m.expiryDate) <= warningLimit
        );
        filtered.sort(
          (a: any, b: any) =>
            new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );
        setExpiringMembers(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExpiring(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchExpiringMembers();
  }, []);

  const getAlertLabel = (type: string) => {
    switch (type) {
      case "7_days_before": return "7 Days Before Expiry";
      case "3_days_before": return "3 Days Before Expiry";
      case "on_expiry":     return "On Expiry Date";
      case "after_expiry":  return "After Expiry Follow-up";
      default:              return "Manual Reminder";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "7_days_before": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "3_days_before": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "on_expiry":     return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "after_expiry":  return "bg-red-500/10 text-red-400 border-red-500/20";
      default:              return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-300">Notifications</h2>
          <p className="text-xs text-gray-500 mt-0.5">Monitor expiry alerts and automation message history.</p>
        </div>
        <button
          onClick={() => { fetchLogs(); fetchExpiringMembers(); }}
          className="flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-white/20 bg-white/5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── Members Near Expiry ─────────────────────────────────────────────── */}
      <div className="glass-card p-6 border-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Bell size={18} className="text-amber-500" /> Members Near Plan Expiry
          </h3>
          <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
            {expiringMembers.length} Alert(s)
          </span>
        </div>

        {loadingExpiring ? (
          <div className="flex items-center justify-center py-8 gap-2">
            <Loader2 className="animate-spin text-primary" size={20} />
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Loading...</p>
          </div>
        ) : expiringMembers.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">
            No members are currently within their plan expiry window (7 days).
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs font-bold uppercase">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Join Date</th>
                  <th className="pb-3">Expiry Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {expiringMembers.map((m) => {
                  const daysLeft = Math.ceil(
                    (new Date(m.expiryDate).getTime() - new Date().setHours(0, 0, 0, 0)) /
                      (1000 * 60 * 60 * 24)
                  );
                  return (
                    <tr key={m._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold capitalize">{m.fullName}</td>
                      <td className="py-3 font-mono text-xs text-gray-400">{m.mobileNumber}</td>
                      <td className="py-3">
                        <span className="text-xs px-2 py-0.5 bg-white/5 rounded border border-white/10 text-gray-300">
                          {m.packageType || "Custom"}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-gray-400">
                        {new Date(m.joiningDate).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                        })}
                      </td>
                      <td className="py-3 text-xs font-semibold text-amber-500">
                        {new Date(m.expiryDate).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                        })}
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          daysLeft < 0
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : daysLeft === 0
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {daysLeft < 0 ? "Expired" : daysLeft === 0 ? "Expires Today" : `${daysLeft}d Left`}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <a
                          href={`https://wa.me/${m.whatsAppNumber?.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-all inline-flex items-center cursor-pointer"
                        >
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Who Received Expiry Messages ────────────────────────────────────── */}
      <div className="glass-card p-6 border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            Who Received Expiry Automation Messages
          </h3>
          <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
            {logs.length} Sent
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="animate-spin text-primary" size={28} />
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Loading records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
            <MessageSquare size={36} className="opacity-20" />
            <p className="text-sm">No automation messages have been sent yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log._id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <User size={16} className="text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white capitalize text-sm">{log.customerName}</p>
                  <p className="text-xs text-gray-500 font-mono">{log.mobileNumber}</p>
                </div>

                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border shrink-0 ${getTypeColor(log.type)}`}>
                  {getAlertLabel(log.type)}
                </span>

                <div className="flex items-center gap-1 text-[11px] text-gray-500 shrink-0">
                  <Clock size={11} />
                  {new Date(log.sentAt).toLocaleString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
                    log.status === "Sent"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {log.status}
                  </span>
                  {log.status === "Failed" && log.error && (
                    <div className="relative group cursor-help text-red-400">
                      <Info size={14} />
                      <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block bg-charcoal-dark border border-white/10 rounded p-2 text-[10px] text-gray-300 w-52 shadow-xl z-20 whitespace-normal leading-relaxed">
                        {log.error}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
