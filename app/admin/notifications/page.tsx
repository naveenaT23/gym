"use client";

import { useState, useEffect } from "react";
import { Bell, RefreshCw, Loader2, AlertCircle, CheckCircle2, Play, Info } from "lucide-react";

interface LogItem {
  _id: string;
  customerName: string;
  mobileNumber: string;
  whatsAppNumber: string;
  planName: string;
  expiryDate: string;
  type: "7_days_before" | "3_days_before" | "on_expiry" | "after_expiry" | "manual";
  message: string;
  status: "Sent" | "Failed" | "Pending";
  sentAt: string;
  error?: string;
}

export default function NotificationsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const triggerCron = async () => {
    if (!confirm("This will trigger a manual check of all customer accounts expiring in 7 days, 3 days, today, or expired 3 days ago, and dispatch reminders to Pabbly. Continue?")) return;
    
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/cron/check-expiry", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncResult({
          success: true,
          count: data.processedCount,
          details: data.logs || []
        });
        fetchLogs();
      } else {
        setSyncResult({ success: false, error: data.error || "Failed to trigger automated check." });
      }
    } catch (err: any) {
      setSyncResult({ success: false, error: err.message || "Network error. Please try again." });
    } finally {
      setSyncing(false);
    }
  };

  const getAlertLabel = (type: string) => {
    switch (type) {
      case "7_days_before":
        return "7 Days Before Expiry";
      case "3_days_before":
        return "3 Days Before Expiry";
      case "on_expiry":
        return "On Expiry Date";
      case "after_expiry":
        return "After Expiry Follow-up";
      default:
        return "Manual Reminder";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-300">WhatsApp Automation Hub</h2>
          <p className="text-xs text-gray-500">Monitor message logs, check delivery status, and manually initiate cron updates.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchLogs}
            className="flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-white/20 bg-white/5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <RefreshCw size={14} /> Refresh Logs
          </button>
          <button
            onClick={triggerCron}
            disabled={syncing}
            className="btn-primary py-2 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {syncing ? (
              <>
                <Loader2 className="animate-spin" size={14} /> Running Sync...
              </>
            ) : (
              <>
                <Play size={14} /> Run Expiry Check
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sync Execution Results Panel */}
      {syncResult && (
        <div
          className={`p-5 rounded-xl border animate-fade-in ${
            syncResult.success
              ? "bg-emerald-500/10 border-emerald-500/20 text-white"
              : "bg-secondary/10 border-secondary/20 text-white"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            {syncResult.success ? (
              <CheckCircle2 className="text-emerald-500" size={24} />
            ) : (
              <AlertCircle className="text-secondary" size={24} />
            )}
            <div>
              <h3 className="font-bold text-sm tracking-normal">
                {syncResult.success ? "Check Completed Successfully" : "Sync Execution Failed"}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {syncResult.success
                  ? `Processed check. Dispatched ${syncResult.count} reminders.`
                  : syncResult.error}
              </p>
            </div>
          </div>

          {syncResult.success && syncResult.details.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2 max-h-40 overflow-y-auto">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Dispatched Logs:</span>
              {syncResult.details.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs bg-white/5 p-2 rounded">
                  <span className="capitalize font-semibold">{item.customerName}</span>
                  <span className="text-[10px] text-gray-400">{getAlertLabel(item.type)}</span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      item.status === "Sent" ? "bg-emerald-500/10 text-emerald-500" : "bg-secondary/10 text-secondary"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Logs Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Loading notification logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-card py-20 text-center text-gray-500 border-white/5">
          No automated reminders logged yet.
        </div>
      ) : (
        <div className="glass-card border-white/5 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 text-gray-500 text-xs font-bold uppercase">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">WhatsApp No</th>
                <th className="p-4">Notification Type</th>
                <th className="p-4">Message Preview</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-xs text-gray-400">
                    {new Date(log.sentAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                  <td className="p-4 font-bold capitalize">{log.customerName}</td>
                  <td className="p-4 font-mono text-xs text-gray-400">{log.whatsAppNumber}</td>
                  <td className="p-4 text-xs text-gray-300 font-semibold">{getAlertLabel(log.type)}</td>
                  <td className="p-4 text-xs text-gray-400 max-w-xs truncate" title={log.message}>
                    {log.message}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          log.status === "Sent"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-secondary/10 text-secondary border border-secondary/20"
                        }`}
                      >
                        {log.status}
                      </span>
                      {log.status === "Failed" && log.error && (
                        <div className="relative group cursor-help text-secondary">
                          <Info size={14} />
                          <div className="absolute bottom-full mb-1 right-0 hidden group-hover:block bg-charcoal-dark border border-white/10 rounded p-2 text-[10px] text-gray-300 w-48 shadow-xl z-20 whitespace-normal leading-normal font-sans">
                            {log.error}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
