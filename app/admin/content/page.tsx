"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Save,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Edit3,
  Star,
  Phone,
  MapPin,
  Clock,
  Info,
} from "lucide-react";

// ─────────── Types ───────────
interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

interface StatItem {
  label: string;
  value: string;
  icon: string;
}

// ─────────── Helpers ───────────
const generateId = () => Math.random().toString(36).substring(2, 9);

// ─────────── Tab Button ───────────
function TabBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
        active
          ? "bg-primary text-charcoal shadow-[0_0_15px_rgba(212,175,55,0.25)]"
          : "text-gray-400 hover:text-white hover:bg-white/5 border border-white/5"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

// ─────────── Section: Hero ───────────
function HeroSection({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-5">
      <SectionInfo text="Controls the text and call-to-action buttons displayed on the Home page hero banner." />
      <Field label="Top Badge Text" value={data.badge} onChange={(v) => onChange({ ...data, badge: v })} placeholder="e.g. Est. 2014 • Pendurthi, AP" />
      <Field label="Main Headline" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} placeholder="e.g. FORGE YOUR LEGEND" />
      <Field
        label="Subheading / Tagline"
        value={data.subtext}
        onChange={(v) => onChange({ ...data, subtext: v })}
        multiline
        placeholder="Brief description displayed below the headline..."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Primary CTA Button" value={data.ctaPrimary} onChange={(v) => onChange({ ...data, ctaPrimary: v })} placeholder="e.g. Start Training" />
        <Field label="Secondary CTA Button" value={data.ctaSecondary} onChange={(v) => onChange({ ...data, ctaSecondary: v })} placeholder="e.g. Explore Services" />
      </div>
    </div>
  );
}

// ─────────── Section: About ───────────
function AboutSection({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const updateStat = (index: number, field: string, value: string) => {
    const updated = [...(data.stats || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, stats: updated });
  };

  const addStat = () => {
    onChange({ ...data, stats: [...(data.stats || []), { label: "", value: "", icon: "star" }] });
  };

  const removeStat = (index: number) => {
    const updated = [...(data.stats || [])];
    updated.splice(index, 1);
    onChange({ ...data, stats: updated });
  };

  return (
    <div className="space-y-5">
      <SectionInfo text="Manages the About page text, mission statement, vision, and the stats bar displayed on the homepage." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Section Subtitle" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="e.g. Our Story" />
        <Field label="Section Title" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="e.g. Built for Champions" />
      </div>
      <Field label="Main Description" value={data.description} onChange={(v) => onChange({ ...data, description: v })} multiline rows={4} placeholder="About section main text..." />
      <Field label="Mission Statement" value={data.mission} onChange={(v) => onChange({ ...data, mission: v })} multiline placeholder="Your gym's mission..." />
      <Field label="Vision Statement" value={data.vision} onChange={(v) => onChange({ ...data, vision: v })} multiline placeholder="Your gym's vision..." />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Key Stats</label>
          <button onClick={addStat} className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-white transition-colors cursor-pointer">
            <Plus size={12} /> Add Stat
          </button>
        </div>
        {(data.stats || []).map((stat: StatItem, i: number) => (
          <div key={i} className="grid grid-cols-12 gap-3 items-center bg-white/5 rounded-lg p-3 border border-white/5">
            <div className="col-span-4">
              <input
                value={stat.value}
                onChange={(e) => updateStat(i, "value", e.target.value)}
                placeholder="e.g. 1500+"
                className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary font-mono"
              />
            </div>
            <div className="col-span-7">
              <input
                value={stat.label}
                onChange={(e) => updateStat(i, "label", e.target.value)}
                placeholder="e.g. Active Members"
                className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
            <button onClick={() => removeStat(i)} className="col-span-1 text-gray-500 hover:text-secondary transition-colors flex justify-center cursor-pointer">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────── Section: Services ───────────
function ServicesSection({ data, onChange }: { data: ServiceItem[]; onChange: (d: any) => void }) {
  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addItem = () => {
    onChange([...data, { id: generateId(), title: "", description: "", icon: "dumbbell" }]);
  };

  const removeItem = (index: number) => {
    const updated = [...data];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <SectionInfo text="Manage all gym service cards displayed on the Services page. You can add, edit, or remove services." />
      <div className="flex justify-end">
        <button onClick={addItem} className="btn-primary py-2 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Service
        </button>
      </div>
      {data.map((item, i) => (
        <CollapsibleCard
          key={item.id || i}
          title={item.title || `Service ${i + 1}`}
          onRemove={() => removeItem(i)}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Service Title" value={item.title} onChange={(v) => updateItem(i, "title", v)} placeholder="e.g. Strength & Conditioning" />
              <Field label="Icon Key" value={item.icon} onChange={(v) => updateItem(i, "icon", v)} placeholder="e.g. dumbbell, zap, heart, user" />
            </div>
            <Field label="Description" value={item.description} onChange={(v) => updateItem(i, "description", v)} multiline placeholder="Service description..." />
          </div>
        </CollapsibleCard>
      ))}
    </div>
  );
}

// ─────────── Section: Testimonials ───────────
function TestimonialsSection({ data, onChange }: { data: TestimonialItem[]; onChange: (d: any) => void }) {
  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addItem = () => {
    onChange([...data, { id: generateId(), name: "", role: "", text: "", rating: 5 }]);
  };

  const removeItem = (index: number) => {
    const updated = [...data];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <SectionInfo text="Manage customer testimonials and reviews displayed on the homepage. All reviews reflect your gym's reputation." />
      <div className="flex justify-end">
        <button onClick={addItem} className="btn-primary py-2 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
          <Plus size={14} /> Add Testimonial
        </button>
      </div>
      {data.map((item, i) => (
        <CollapsibleCard
          key={item.id || i}
          title={item.name || `Review ${i + 1}`}
          onRemove={() => removeItem(i)}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Customer Name" value={item.name} onChange={(v) => updateItem(i, "name", v)} placeholder="e.g. Ravi Kumar" />
              <Field label="Role / Achievement" value={item.role} onChange={(v) => updateItem(i, "role", v)} placeholder="e.g. Lost 18 kg in 4 months" />
            </div>
            <Field label="Review Text" value={item.text} onChange={(v) => updateItem(i, "text", v)} multiline rows={3} placeholder="Customer review..." />
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => updateItem(i, "rating", star)}
                    className={`transition-colors cursor-pointer ${star <= item.rating ? "text-primary" : "text-gray-600"}`}
                  >
                    <Star size={16} fill={star <= item.rating ? "#D4AF37" : "none"} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleCard>
      ))}
    </div>
  );
}

// ─────────── Section: Contact ───────────
function ContactSection({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-5">
      <SectionInfo text="Update the gym's contact info displayed across the website and in the footer." />
      <Field label="Full Address" value={data.address} onChange={(v) => onChange({ ...data, address: v })} multiline placeholder="Gym address..." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Phone Number" value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="e.g. 074796 49999" />
        <Field label="WhatsApp Number" value={data.whatsapp} onChange={(v) => onChange({ ...data, whatsapp: v })} placeholder="e.g. 917479649999 (with country code)" />
      </div>
      <Field label="Email Address" value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder="e.g. info@royalfitnessgym.com" />
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Clock size={12} /> Opening Hours
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
          <Field
            label="Mon – Sat"
            value={data.hours?.weekdays}
            onChange={(v) => onChange({ ...data, hours: { ...(data.hours || {}), weekdays: v } })}
            placeholder="e.g. 5:00 AM - 10:00 PM"
          />
          <Field
            label="Sunday"
            value={data.hours?.sunday}
            onChange={(v) => onChange({ ...data, hours: { ...(data.hours || {}), sunday: v } })}
            placeholder="e.g. 6:00 AM - 8:00 PM"
          />
          <Field
            label="Elite Members"
            value={data.hours?.elite}
            onChange={(v) => onChange({ ...data, hours: { ...(data.hours || {}), elite: v } })}
            placeholder="e.g. Open 24/7 for Elite Members"
          />
        </div>
      </div>
      <Field label="Google Maps Embed URL (Optional)" value={data.mapUrl} onChange={(v) => onChange({ ...data, mapUrl: v })} placeholder="https://maps.google.com/embed?..." />
    </div>
  );
}

// ─────────── Section: Gym Info ───────────
function GymSection({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-5">
      <SectionInfo text="Core brand identity displayed across the website's header, footer, and metadata." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Gym Name" value={data.name} onChange={(v) => onChange({ ...data, name: v })} placeholder="e.g. Royal Fitness Gym" />
        <Field label="Tagline / Slogan" value={data.tagline} onChange={(v) => onChange({ ...data, tagline: v })} placeholder="e.g. Forge Your Legend" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Established Year" value={data.established} onChange={(v) => onChange({ ...data, established: v })} placeholder="e.g. 2014" />
        <Field label="Location" value={data.location} onChange={(v) => onChange({ ...data, location: v })} placeholder="e.g. Pendurthi, AP" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Social Media Links</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
          <Field label="Instagram" value={data.social?.instagram} onChange={(v) => onChange({ ...data, social: { ...(data.social || {}), instagram: v } })} placeholder="https://instagram.com/..." />
          <Field label="Facebook" value={data.social?.facebook} onChange={(v) => onChange({ ...data, social: { ...(data.social || {}), facebook: v } })} placeholder="https://facebook.com/..." />
          <Field label="YouTube" value={data.social?.youtube} onChange={(v) => onChange({ ...data, social: { ...(data.social || {}), youtube: v } })} placeholder="https://youtube.com/..." />
        </div>
      </div>
    </div>
  );
}

// ─────────── Reusable Components ───────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea
          rows={rows}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary font-sans resize-y"
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary"
        />
      )}
    </div>
  );
}

function SectionInfo({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/15 rounded-lg p-3">
      <Info size={14} className="text-primary shrink-0 mt-0.5" />
      <p className="text-[10px] text-gray-400 font-sans leading-normal">{text}</p>
    </div>
  );
}

function CollapsibleCard({
  title,
  children,
  onRemove,
}: {
  title: string;
  children: React.ReactNode;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card border border-white/8 overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          <Edit3 size={13} className="text-primary" />
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Remove this item?")) onRemove();
            }}
            className="p-1.5 hover:bg-secondary/10 text-gray-500 hover:text-secondary rounded transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
          {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
        </div>
      </div>
      {open && <div className="p-4 border-t border-white/5 space-y-3">{children}</div>}
    </div>
  );
}

// ─────────── Main Page ───────────
const TABS = [
  { key: "hero", label: "Hero", icon: Globe },
  { key: "about", label: "About", icon: Info },
  { key: "services", label: "Services", icon: Edit3 },
  { key: "testimonials", label: "Reviews", icon: Star },
  { key: "contact", label: "Contact", icon: Phone },
  { key: "gym", label: "Gym Info", icon: MapPin },
];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: activeTab, data: content[activeTab] }),
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (sectionData: any) => {
    setContent((prev) => ({ ...prev, [activeTab]: sectionData }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Loading Website Content...</p>
      </div>
    );
  }

  const renderSection = () => {
    const d = content[activeTab];
    switch (activeTab) {
      case "hero":
        return <HeroSection data={d || {}} onChange={updateSection} />;
      case "about":
        return <AboutSection data={d || {}} onChange={updateSection} />;
      case "services":
        return <ServicesSection data={d || []} onChange={updateSection} />;
      case "testimonials":
        return <TestimonialsSection data={d || []} onChange={updateSection} />;
      case "contact":
        return <ContactSection data={d || {}} onChange={updateSection} />;
      case "gym":
        return <GymSection data={d || {}} onChange={updateSection} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-300">Website Content Manager</h2>
          <p className="text-xs text-gray-500">
            Edit and update all public-facing content on your gym website — no coding required.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchContent}
            className="flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-white/20 bg-white/5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <RefreshCw size={13} /> Reload
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary py-2 px-5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={14} /> Saving...
              </>
            ) : (
              <>
                <Save size={14} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {status === "success" && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <p className="text-xs text-gray-200 font-semibold">
            <span className="capitalize">{activeTab}</span> section saved successfully! Changes are now live on your website.
          </p>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2.5 p-3.5 bg-secondary/10 border border-secondary/20 rounded-lg">
          <AlertTriangle size={16} className="text-secondary" />
          <p className="text-xs text-gray-200 font-semibold">Failed to save changes. Please try again.</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <TabBtn
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </div>

      {/* Content Editor */}
      <div className="glass-card p-6 border-white/5">
        {renderSection()}
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between glass-card p-4 border-white/5">
        <p className="text-xs text-gray-500">
          ✦ Changes to <span className="text-primary font-semibold capitalize">{activeTab}</span> will be live after saving.
          {" "}The website must be rebuilt or the page refreshed to see the changes.
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary py-2 px-5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={14} /> Saving...
            </>
          ) : (
            <>
              <Save size={14} /> Save {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
            </>
          )}
        </button>
      </div>
    </div>
  );
}
