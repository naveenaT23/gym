"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Award, Users, CreditCard, Loader2, Download, Printer, Percent } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area
} from "recharts";

interface Stats {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  upcomingRenewals: number;
}

interface ChartItem {
  name: string;
  members: number;
  revenue: number;
}

interface PlanPopularity {
  name: string;
  count: number;
  revenue: number;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [planPopularity, setPlanPopularity] = useState<PlanPopularity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setStats(data.stats);
            setChartData(data.chartData);

            // Calculate Plan Popularity from fetched customer list
            const custRes = await fetch("/api/customers");
            if (custRes.ok) {
              const custData = await custRes.json();
              const customers = custData.customers || [];
              
              const popularityMap: { [key: string]: { count: number; revenue: number } } = {};
              customers.forEach((c: any) => {
                const plan = c.membershipPlan;
                if (!popularityMap[plan]) {
                  popularityMap[plan] = { count: 0, revenue: 0 };
                }
                popularityMap[plan].count += 1;
                popularityMap[plan].revenue += c.amountPaid;
                
                // Add renewals to total revenue for this plan
                if (c.renewalHistory) {
                  c.renewalHistory.slice(1).forEach((r: any) => {
                    popularityMap[plan].revenue += r.amountPaid;
                  });
                }
              });

              const popularityList = Object.keys(popularityMap).map((k) => ({
                name: k,
                count: popularityMap[k].count,
                revenue: popularityMap[k].revenue,
              }));
              
              // Sort by count descending
              popularityList.sort((a, b) => b.count - a.count);
              setPlanPopularity(popularityList);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Compute summary stats
  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalRegistrations = chartData.reduce((acc, curr) => acc + curr.members, 0);
  const averageARPU = totalRegistrations > 0 ? Math.round(totalRevenue / totalRegistrations) : 0;

  // Print Report utility
  const handlePrintReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Compiling Reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in print:p-0 print:bg-white print:text-black">
      {/* Page header (hidden on print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-300">Gym Performance Reports</h2>
          <p className="text-xs text-gray-500 font-sans">Analyze member registrations, track revenue growth, and evaluate popular packages.</p>
        </div>
        <button
          onClick={handlePrintReport}
          className="flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-white/20 bg-white/5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Printer size={15} /> Print Summary
        </button>
      </div>

      {/* Printable Gym Header */}
      <div className="hidden print:block border-b-2 border-primary pb-4 mb-6">
        <h1 className="text-3xl font-bold font-bebas tracking-wide text-charcoal">ROYAL FITNESS GYM</h1>
        <p className="text-sm font-nunito text-gray-500">Business & Member Analytics Statement — {new Date().toLocaleDateString("en-IN")}</p>
      </div>

      {/* Reports Overview KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-white/5 print:border-black/10 print:bg-gray-50 print:text-black">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-[10px] font-bold uppercase tracking-wider print:text-gray-600">Total period revenue</span>
            <CreditCard size={18} className="text-emerald-500" />
          </div>
          <h3 className="text-3xl font-bebas text-white mt-2 print:text-black">₹{totalRevenue}</h3>
          <p className="text-[10px] text-gray-400 mt-1 print:text-gray-500">Sum of registrations and renewals (6mo)</p>
        </div>

        <div className="glass-card p-6 border-white/5 print:border-black/10 print:bg-gray-50 print:text-black">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-[10px] font-bold uppercase tracking-wider print:text-gray-600">New period registrations</span>
            <Users size={18} className="text-primary" />
          </div>
          <h3 className="text-3xl font-bebas text-white mt-2 print:text-black">{totalRegistrations} members</h3>
          <p className="text-[10px] text-gray-400 mt-1 print:text-gray-500">Total new accounts opened (6mo)</p>
        </div>

        <div className="glass-card p-6 border-white/5 print:border-black/10 print:bg-gray-50 print:text-black">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-[10px] font-bold uppercase tracking-wider print:text-gray-600">Avg Revenue per signup</span>
            <Percent size={18} className="text-amber-500" />
          </div>
          <h3 className="text-3xl font-bebas text-white mt-2 print:text-black">₹{averageARPU}</h3>
          <p className="text-[10px] text-gray-400 mt-1 print:text-gray-500">Average ticket size per registered member</p>
        </div>
      </div>

      {/* Visual Analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:space-y-8">
        {/* Member growth */}
        <div className="glass-card p-6 border-white/5 print:border-black/10 print:shadow-none print:bg-white print:text-black page-break-after">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-6 print:text-black">New registrations trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReportMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="members" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorReportMembers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Growth */}
        <div className="glass-card p-6 border-white/5 print:border-black/10 print:shadow-none print:bg-white print:text-black">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-6 print:text-black">Monthly cash flow (INR)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} unit="₹" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Plan Performance Matrix */}
      <div className="glass-card p-6 border-white/5 print:border-black/10 print:shadow-none print:bg-white print:text-black">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-6 flex items-center gap-2 print:text-black">
          <Award size={18} className="text-primary" />
          Plan Performance & Revenue Matrix
        </h3>

        {planPopularity.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No plan distributions loaded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 print:border-black/20 text-gray-500 print:text-gray-600 text-xs font-bold uppercase">
                  <th className="pb-3">Membership Plan</th>
                  <th className="pb-3 text-center">Registrants Count</th>
                  <th className="pb-3 text-right">Cumulative Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-black/10 text-sm">
                {planPopularity.map((plan, i) => (
                  <tr key={i} className="hover:bg-white/5 print:hover:bg-transparent">
                    <td className="py-3.5 font-semibold text-gray-200 print:text-black capitalize">{plan.name}</td>
                    <td className="py-3.5 text-center font-mono">{plan.count}</td>
                    <td className="py-3.5 text-right font-mono text-emerald-500 font-bold">₹{plan.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
