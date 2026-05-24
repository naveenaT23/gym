"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
  Plus,
  Loader2,
  PhoneCall,
  UserPlus
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Stats {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  upcomingRenewals: number;
}

interface Member {
  _id: string;
  fullName: string;
  membershipPlan: string;
  paymentStatus: string;
  expiryDate: string;
  createdAt: string;
}

interface ChartItem {
  name: string;
  members: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [upcomingList, setUpcomingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, customersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/customers?active=active"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(statsData.stats);
            setChartData(statsData.chartData);
            setRecentMembers(statsData.recentMembers);
          }
        }

        if (customersRes.ok) {
          const custData = await customersRes.json();
          if (custData.success) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const sevenDays = new Date();
            sevenDays.setDate(today.getDate() + 7);

            const upcoming = custData.customers
              .filter((c: any) => {
                const exp = new Date(c.expiryDate);
                return exp >= today && exp <= sevenDays;
              })
              .slice(0, 5);
            setUpcomingList(upcoming);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
          Loading Analytics...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Members",
      value: stats?.totalMembers || 0,
      icon: Users,
      color: "border-primary/20",
      iconColor: "text-primary",
      glow: "hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]",
    },
    {
      title: "Active Plans",
      value: stats?.activeMembers || 0,
      icon: UserCheck,
      color: "border-emerald-500/20",
      iconColor: "text-emerald-500",
      glow: "hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    },
    {
      title: "Expired Plans",
      value: stats?.expiredMembers || 0,
      icon: UserX,
      color: "border-secondary/20",
      iconColor: "text-secondary",
      glow: "hover:shadow-[0_0_15px_rgba(230,57,70,0.15)]",
    },
    {
      title: "Upcoming Renewals",
      value: stats?.upcomingRenewals || 0,
      icon: Calendar,
      color: "border-amber-500/20",
      iconColor: "text-amber-500",
      glow: "hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 md:p-8 border-white/5">
        <div>
          <h2 className="text-3xl font-bebas tracking-wide text-white">
            Welcome back, <span className="text-primary">Admin</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Here&apos;s a breakdown of your gym memberships and cash flow today.
          </p>
        </div>
        <Link
          href="/admin/customers?add=true"
          className="btn-primary py-2.5 px-6 rounded-lg text-sm flex items-center justify-center gap-2 self-start md:self-center cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Member</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`glass-card p-6 border ${card.color} ${card.glow} relative overflow-hidden group`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                    {card.title}
                  </p>
                  <h3 className="text-4xl font-bebas text-white group-hover:scale-105 transition-transform duration-300">
                    {card.value}
                  </h3>
                </div>
                <div className={`p-3 bg-white/5 rounded-lg border border-white/10 ${card.iconColor}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold uppercase tracking-wider text-gray-300">
              New Registrations (Last 6 Months)
            </h3>
            <span className="text-xs text-primary font-semibold flex items-center gap-1">
              <UserPlus size={14} /> Member Growth
            </span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1A1A", borderColor: "#333", color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="members"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMembers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold uppercase tracking-wider text-gray-300">
              Revenue Tracking (Last 6 Months)
            </h3>
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              <TrendingUp size={14} /> Cash Flow
            </span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} unit="₹" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1A1A", borderColor: "#333", color: "#fff" }}
                  formatter={(value: any) => [`₹${value}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 border-white/5">
          <h3 className="text-lg font-bold uppercase tracking-wider text-gray-300 mb-6 flex items-center gap-2">
            <Calendar className="text-amber-500" size={20} />
            Upcoming Expirations (Next 7 Days)
          </h3>
          {upcomingList.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              No memberships expiring in the next 7 days.
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingList.map((customer) => {
                const expDate = new Date(customer.expiryDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                });
                return (
                  <div
                    key={customer._id}
                    className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-sm tracking-normal capitalize">{customer.fullName}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {customer.membershipPlan} • Expiry:{" "}
                        <span className="text-amber-500 font-semibold">{expDate}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`https://wa.me/${customer.whatsAppNumber.replace(/\D/g, "")}`}
                        target="_blank"
                        className="p-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-lg transition-all"
                        title="Chat on WhatsApp"
                      >
                        <PhoneCall size={16} />
                      </Link>
                      <Link
                        href="/admin/customers?renew=true"
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-charcoal text-xs font-bold uppercase tracking-wider rounded transition-all"
                      >
                        Renew
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card p-6 border-white/5">
          <h3 className="text-lg font-bold uppercase tracking-wider text-gray-300 mb-6 flex items-center gap-2">
            <Users className="text-primary" size={20} />
            Recent Signups
          </h3>
          {recentMembers.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">No members registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 text-xs font-bold uppercase">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {recentMembers.map((member) => (
                    <tr key={member._id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold capitalize">{member.fullName}</td>
                      <td className="py-3 text-gray-400 text-xs">{member.membershipPlan}</td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                            member.paymentStatus === "Paid"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : member.paymentStatus === "Partial"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-secondary/10 text-secondary border border-secondary/20"
                          }`}
                        >
                          {member.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href="/admin/customers"
                          className="text-xs text-primary font-bold uppercase tracking-wider group-hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
