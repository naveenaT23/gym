"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Camera,
  Search,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  UserPlus
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Html5QrcodeScanner } from "html5-qrcode";

interface Member {
  id: string;
  name: string;
  phone: string;
  package_type: string;
  expiry_date: string;
  photo?: string;
}

interface AttendanceLog {
  id: string;
  member_id: string;
  check_in_time: string;
  check_out_time: string | null;
  date: string;
  members: {
    id: string;
    name: string;
    phone: string;
    package_type: string;
  } | null;
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<"terminal" | "logs" | "analytics">("terminal");
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // Terminal states
  const [scanning, setScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [manualIdInput, setManualIdInput] = useState("");

  // Logs states
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  const scannerRef = useRef<any>(null);

  // Fetch initial data
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.customers || []);
      }
      await fetchLogs();
      await fetchAnalytics();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (dateStr?: string) => {
    const queryDate = dateStr || selectedDate;
    try {
      const res = await fetch(`/api/attendance?date=${queryDate}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/attendance/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data.analytics || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Handle camera scanning toggle
  useEffect(() => {
    if (scanning) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(
        async (decodedText) => {
          // Decoded text is member ID
          await triggerCheckIn(decodedText);
          scanner.clear();
          setScanning(false);
        },
        (error) => {
          // Ignore scanning errors as they happen every frame
        }
      );

      scannerRef.current = scanner;
    } else {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {
          // Scanner might have already cleared
        }
      }
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {
          // Cleanup
        }
      }
    };
  }, [scanning]);

  // Action triggers
  const triggerCheckIn = async (memberId: string) => {
    setStatusMessage(null);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const status = data.record.status;
        const memberName = data.record.name || "Member";
        if (status === "checked-in") {
          setStatusMessage({
            text: `Welcome, ${memberName}! Checked in successfully at ${new Date(data.record.check_in_time).toLocaleTimeString()}`,
            type: "success",
          });
        } else if (status === "checked-out") {
          setStatusMessage({
            text: `Goodbye, ${memberName}! Checked out successfully at ${new Date(data.record.check_out_time).toLocaleTimeString()}`,
            type: "info",
          });
        } else {
          setStatusMessage({
            text: `${memberName} has already completed attendance today.`,
            type: "info",
          });
        }
        fetchLogs();
        fetchAnalytics();
      } else {
        setStatusMessage({ text: data.error || "Attendance check failed.", type: "error" });
      }
    } catch (err) {
      setStatusMessage({ text: "Server connection failed.", type: "error" });
    }
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualIdInput.trim()) {
      triggerCheckIn(manualIdInput.trim());
      setManualIdInput("");
    }
  };

  // Filter members list based on query
  const filteredMembers = searchQuery
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.phone.includes(searchQuery)
      )
    : [];

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    fetchLogs(date);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
          Loading Attendance Console...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-300">Attendance Terminal</h2>
          <p className="text-xs text-gray-500">Record check-ins via QR Scanner, search registry, or view daily statistics.</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 self-start md:self-center">
          <button
            onClick={() => setActiveTab("terminal")}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "terminal" ? "bg-primary text-charcoal" : "text-gray-400 hover:text-white"
            }`}
          >
            Check-In Terminal
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "logs" ? "bg-primary text-charcoal" : "text-gray-400 hover:text-white"
            }`}
          >
            Daily Logs
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "analytics" ? "bg-primary text-charcoal" : "text-gray-400 hover:text-white"
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* TERMINAL TAB */}
      {activeTab === "terminal" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* QR Scan Column */}
          <div className="lg:col-span-5 glass-card p-6 border-white/5 flex flex-col items-center justify-center min-h-[450px]">
            <h3 className="text-lg font-bold uppercase text-gray-300 mb-4 flex items-center gap-2">
              <Camera className="text-primary animate-pulse" size={20} />
              QR Code Scanner
            </h3>

            {scanning ? (
              <div className="w-full max-w-[320px] rounded-lg overflow-hidden border-2 border-primary/50 relative bg-black">
                <div id="reader" className="w-full"></div>
                <button
                  onClick={() => setScanning(false)}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-secondary text-white text-xs font-bold uppercase rounded-lg shadow-lg hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Stop Camera
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-xl bg-white/5 w-full max-w-[320px] h-[240px]">
                <Camera className="text-gray-600 mb-4" size={48} />
                <p className="text-xs text-gray-400 mb-6">Scan customer membership cards with QR codes.</p>
                <button
                  onClick={() => setScanning(true)}
                  className="px-6 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-charcoal border border-primary/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Start Camera Scan
                </button>
              </div>
            )}

            <div className="w-full border-t border-white/5 my-6"></div>

            {/* Manual ID Input */}
            <form onSubmit={handleManualCheckIn} className="w-full max-w-[320px] space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Manual ID Check-in</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. member-1716..."
                  value={manualIdInput}
                  onChange={(e) => setManualIdInput(e.target.value)}
                  className="flex-1 bg-charcoal-dark border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-charcoal rounded-lg text-xs font-bold uppercase cursor-pointer"
                >
                  Go
                </button>
              </div>
            </form>
          </div>

          {/* Search Check-In Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status alerts */}
            {statusMessage && (
              <div
                className={`p-4 rounded-xl border flex items-center gap-3 animate-fade-in ${
                  statusMessage.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : statusMessage.type === "error"
                    ? "bg-secondary/10 border-secondary/30 text-secondary"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle size={20} className="shrink-0" />
                ) : (
                  <AlertCircle size={20} className="shrink-0" />
                )}
                <div className="text-xs font-semibold">{statusMessage.text}</div>
              </div>
            )}

            <div className="glass-card p-6 border-white/5 min-h-[380px] flex flex-col">
              <h3 className="text-lg font-bold uppercase text-gray-300 mb-4 flex items-center gap-2">
                <Search className="text-primary" size={20} />
                Search & Check-In
              </h3>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search member by name or contact number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-primary transition-colors"
                />
                <Search size={16} className="absolute left-3 top-3 text-gray-500" />
              </div>

              {searchQuery === "" ? (
                <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <UserPlus className="text-gray-700 mb-2" size={36} />
                  <p className="text-xs">Enter a name above to manually record check-ins or check-outs.</p>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-8 text-gray-500 text-xs">
                  No members found matching your search.
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto max-h-[250px] divide-y divide-white/5">
                  {filteredMembers.map((member) => {
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const expiry = new Date(member.expiry_date);
                    const isExpired = expiry < today;

                    return (
                      <div key={member.id} className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 overflow-hidden border border-white/10 shrink-0">
                            {member.photo ? (
                              <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">
                                {member.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs tracking-normal capitalize">{member.name}</h4>
                            <p className="text-[10px] text-gray-500 font-mono">
                              {member.phone} • {member.package_type}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {isExpired ? (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/20">
                              Expired Plan
                            </span>
                          ) : (
                            <button
                              onClick={() => triggerCheckIn(member.id)}
                              className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-charcoal border border-primary/20 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                            >
                              Check In / Out
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DAILY LOGS TAB */}
      {activeTab === "logs" && (
        <div className="glass-card p-6 border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
            <h3 className="text-lg font-bold uppercase text-gray-300 flex items-center gap-2">
              <Calendar className="text-primary" size={20} />
              Daily Check-in Logs
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="bg-charcoal-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary font-mono"
              />
              <button
                onClick={() => fetchLogs()}
                className="p-2 hover:bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Refresh Logs"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {logs.length === 0 ? (
            <div className="py-20 text-center text-gray-500 text-xs">
              No attendance logs found for {new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 text-xs font-bold uppercase">
                    <th className="pb-3 pl-4">Name</th>
                    <th className="pb-3">Contact</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Check-In</th>
                    <th className="pb-3">Check-Out</th>
                    <th className="pb-3 pr-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {logs.map((log) => {
                    const checkIn = new Date(log.check_in_time).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const checkOut = log.check_out_time
                      ? new Date(log.check_out_time).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—";

                    return (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 pl-4 font-bold capitalize">{log.members?.name || "Unknown Member"}</td>
                        <td className="py-3.5 text-xs font-mono text-gray-400">{log.members?.phone || "—"}</td>
                        <td className="py-3.5 text-xs text-gray-300">{log.members?.package_type || "—"}</td>
                        <td className="py-3.5 text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
                          <Clock size={13} /> {checkIn}
                        </td>
                        <td className="py-3.5 text-xs text-gray-400 font-semibold">
                          {log.check_out_time ? (
                            <span className="text-amber-500 flex items-center gap-1.5">
                              <Clock size={13} /> {checkOut}
                            </span>
                          ) : (
                            <span className="text-gray-600">Active</span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              log.check_out_time
                                ? "bg-gray-500/10 text-gray-400 border border-white/5"
                                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            }`}
                          >
                            {log.check_out_time ? "Completed" : "Checked In"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 border-white/5">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Logs (Month)</p>
              <h3 className="text-3xl font-bebas text-white">
                {analyticsData.reduce((acc, curr) => acc + curr.count, 0)}
              </h3>
            </div>
            <div className="glass-card p-6 border-white/5">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Peak Attendance Day</p>
              <h3 className="text-3xl font-bebas text-primary">
                {analyticsData.length > 0
                  ? [...analyticsData].sort((a, b) => b.count - a.count)[0]?.name || "N/A"
                  : "N/A"}
              </h3>
            </div>
            <div className="glass-card p-6 border-white/5">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Daily Average</p>
              <h3 className="text-3xl font-bebas text-white">
                {analyticsData.length > 0
                  ? Math.round(
                      analyticsData.reduce((acc, curr) => acc + curr.count, 0) / analyticsData.length
                    )
                  : 0}
              </h3>
            </div>
          </div>

          <div className="glass-card p-6 border-white/5">
            <h3 className="text-lg font-bold uppercase text-gray-300 mb-6">
              Daily Attendance Load (Last 30 Days)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="name" stroke="#666" fontSize={11} tickLine={false} />
                  <YAxis stroke="#666" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1A1A1A", borderColor: "#333", color: "#fff" }}
                    formatter={(value: any) => [value, "Check-ins"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#D4AF37"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAttendance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
