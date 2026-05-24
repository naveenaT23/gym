"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Loader2, Link2, Info, HelpCircle, Check, Copy } from "lucide-react";

interface Templates {
  "7_days_before": string;
  "3_days_before": string;
  "on_expiry": string;
  "after_expiry": string;
}

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [templates, setTemplates] = useState<Templates>({
    "7_days_before": "",
    "3_days_before": "",
    "on_expiry": "",
    "after_expiry": "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            setWebhookUrl(data.settings.pabbly_webhook_url || "");
            if (data.settings.whatsapp_templates) {
              setTemplates(data.settings.whatsapp_templates);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("idle");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pabbly_webhook_url: webhookUrl,
          whatsapp_templates: templates,
        }),
      });

      if (res.ok) {
        setSaveStatus("success");
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateChange = (key: keyof Templates, val: string) => {
    setTemplates((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const copySamplePayload = () => {
    const payload = JSON.stringify({
      event: "expiry_reminder",
      type: "7_days_before",
      customerId: "60c72b2f9b1d8b0015f8a329",
      customerName: "Rahul Sharma",
      mobileNumber: "917479649999",
      whatsAppNumber: "917479649999",
      planName: "Quarterly Plan",
      expiryDate: "2026-06-30T15:20:12Z",
      formattedExpiryDate: "30/06/2026",
      message: "Hello Rahul Sharma, your gym membership plan will expire in 7 days on 30/06/2026. Kindly renew your membership to continue your Grinding. Thank you!"
    }, null, 2);

    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Loading Configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-300">Integration Settings</h2>
          <p className="text-xs text-gray-500">Configure Pabbly Connect webhooks, customize WhatsApp messaging templates, and view payload specifications.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Config inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pabbly Connection Card */}
          <div className="glass-card p-6 border-white/5 space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <Link2 className="text-primary" size={18} />
              Pabbly Webhook Integration
            </h3>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pabbly Webhook URL</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://connect.pabbly.com/workflow/sendmail/..."
                className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary font-mono"
              />
              <p className="text-[10px] text-gray-500 font-sans mt-1">
                Enter your Pabbly Webhook Trigger URL. Webhook dispatches event payloads when customer logs are added, updated, deleted, renewed, or when automated expiry checks execute.
              </p>
            </div>
          </div>

          {/* WhatsApp Templates Editor */}
          <div className="glass-card p-6 border-white/5 space-y-6">
            <h3 className="text-base font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <Settings className="text-primary" size={18} />
              Customize Reminder Templates
            </h3>

            <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-xs text-gray-400 flex items-start gap-2.5">
              <Info className="text-primary shrink-0 mt-0.5" size={16} />
              <div className="font-sans leading-normal">
                You can use dynamic merge tags in templates:
                <ul className="list-disc pl-4 mt-1.5 space-y-1 font-mono text-[10px] text-primary">
                  <li>{"{{customer_name}}"} - Inserts member&apos;s full name</li>
                  <li>{"{{expiry_date}}"} - Inserts membership expiration date (DD/MM/YYYY)</li>
                  <li>{"{{plan_name}}"} - Inserts membership plan name</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              {/* 7 Days Template */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">7 Days Before Expiry</label>
                <textarea
                  rows={2}
                  value={templates["7_days_before"]}
                  onChange={(e) => handleTemplateChange("7_days_before", e.target.value)}
                  placeholder="Insert template message..."
                  className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary font-sans"
                />
              </div>

              {/* 3 Days Template */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">3 Days Before Expiry</label>
                <textarea
                  rows={2}
                  value={templates["3_days_before"]}
                  onChange={(e) => handleTemplateChange("3_days_before", e.target.value)}
                  placeholder="Insert template message..."
                  className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary font-sans"
                />
              </div>

              {/* On Expiry Template */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">On Expiry Day</label>
                <textarea
                  rows={2}
                  value={templates["on_expiry"]}
                  onChange={(e) => handleTemplateChange("on_expiry", e.target.value)}
                  placeholder="Insert template message..."
                  className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary font-sans"
                />
              </div>

              {/* After Expiry Follow-up */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">After Expiry (3-Day Follow-up)</label>
                <textarea
                  rows={2}
                  value={templates["after_expiry"]}
                  onChange={(e) => handleTemplateChange("after_expiry", e.target.value)}
                  placeholder="Insert template message..."
                  className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div>
                {saveStatus === "success" && (
                  <span className="text-xs text-emerald-500 font-semibold">Settings saved successfully!</span>
                )}
                {saveStatus === "error" && (
                  <span className="text-xs text-secondary font-semibold">Failed to update settings. Try again.</span>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary py-2.5 px-6 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={14} /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save Configuration
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Setup Guides */}
        <div className="space-y-6">
          {/* Pabbly Workflow Help */}
          <div className="glass-card p-6 border-white/5 space-y-4 text-xs font-sans">
            <h3 className="text-base font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <HelpCircle className="text-primary" size={18} />
              Setup Guide
            </h3>
            
            <div className="space-y-3 leading-relaxed text-gray-400">
              <p>
                To automate your WhatsApp reminder process, follow these simple Pabbly Connect steps:
              </p>
              <ol className="list-decimal pl-4 space-y-2 text-gray-300">
                <li>Create a new workflow in Pabbly Connect.</li>
                <li>Choose <strong>Webhook</strong> as the Trigger app.</li>
                <li>Copy the webhook URL generated by Pabbly and paste it into the field on the left.</li>
                <li>
                  Click <strong>Copy Sample Payload</strong> below, and paste it into Pabbly&apos;s test panel to capture the structure.
                </li>
                <li>
                  Add an action step in Pabbly. Select your WhatsApp API provider (e.g. Twilio, WhatsApp Cloud API, Meta Developer).
                </li>
                <li>Map the variables to template tags and test delivery.</li>
                <li>
                  <strong>Optional (Google Sheets):</strong> Add a Google Sheets action to append/update row fields whenever the customer is registered or renewed.
                </li>
              </ol>

              <button
                type="button"
                onClick={copySamplePayload}
                className="flex items-center justify-center gap-1.5 w-full mt-4 py-2 border border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied Payload!" : "Copy Sample Payload"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
