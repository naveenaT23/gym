"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Bell,
  LogOut,
  TrendingUp,
  Award,
  ChevronRight,
  Menu,
  X,
  User,
  Globe,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Attendance", href: "/admin/attendance", icon: Calendar },
  { name: "Membership Plans", href: "/admin/plans", icon: Award },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Reports", href: "/admin/reports", icon: TrendingUp },
  { name: "Website Content", href: "/admin/content", icon: Globe },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Profile", href: "/admin/profile", icon: User },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("Gym Owner");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin_theme") as "light" | "dark" || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("light", savedTheme === "light");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("admin_theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    // Prevent fetching if on the login page
    if (pathname === "/admin/login") return;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setAdminName(data.user.name);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-charcoal text-white flex font-nunito">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-charcoal-dark border-r border-white/10 shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm rotate-45">
            <span className="-rotate-45 font-bebas text-charcoal text-2xl font-bold">R</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-2xl tracking-tighter text-white">
              ROYAL <span className="text-primary">FITNESS</span>
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold -mt-1">
              Admin Portal
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? "bg-primary text-charcoal font-bold animate-pulse-once"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={isActive ? "text-charcoal" : "text-primary"} />
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${
                    isActive ? "text-charcoal" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-gray-500"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-primary/30">
              <User size={16} className="text-primary" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold truncate">{adminName}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Administrator
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-secondary/20 hover:text-secondary border border-white/10 rounded-lg text-sm transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile Toggle Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar for Mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-charcoal-dark border-r border-white/10 flex flex-col z-50 transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm rotate-45">
              <span className="-rotate-45 font-bebas text-charcoal text-2xl font-bold">R</span>
            </div>
            <span className="font-bebas text-2xl tracking-tighter text-white">
              ROYAL <span className="text-primary">FITNESS</span>
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-white hover:text-primary cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary text-charcoal font-bold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={isActive ? "text-charcoal" : "text-primary"} />
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <ChevronRight size={16} className={isActive ? "text-charcoal" : "text-gray-500"} />
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-primary/30">
              <User size={16} className="text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">{adminName}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                Administrator
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-secondary/20 hover:text-secondary border border-white/10 rounded-lg text-sm transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-charcoal/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white hover:text-primary transition-colors focus:outline-none cursor-pointer"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bebas tracking-wide text-white">
              {menuItems.find((item) => pathname === item.href)?.name || "Management Console"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden md:flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider border border-primary/30 px-3 py-1.5 rounded bg-primary/5 hover:bg-primary hover:text-charcoal transition-all"
            >
              Visit Website
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 border border-white/10 transition-all hover:scale-105 cursor-pointer"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <Link
              href="/admin/notifications"
              className="relative p-2 text-gray-400 hover:text-white rounded-full bg-white/5 border border-white/10 transition-all hover:scale-105"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
