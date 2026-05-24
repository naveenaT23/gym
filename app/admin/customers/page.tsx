"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  PhoneCall,
  Download,
  Loader2,
  X,
  Calendar,
  AlertTriangle,
  User,
  Image as ImageIcon,
  Mail,
  MapPin,
  Clipboard,
  ShieldAlert,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  FileText
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";

interface Customer {
  _id: string;
  fullName: string;
  mobileNumber: string;
  whatsAppNumber: string;
  email?: string;
  age?: number;
  gender?: string;
  address?: string;
  packageType: string;
  membershipPlan: string;
  joiningDate: string;
  expiryDate: string;
  paymentStatus: "Paid" | "Pending" | "Partial";
  amountPaid: number;
  notes?: string;
  photo?: string;
  trainerAssigned?: string;
  dietPlanUrl?: string;
  createdAt: string;
}

interface Plan {
  _id: string;
  name: string;
  durationMonths: number;
  price: number;
}

function CustomersContent() {
  const searchParams = useSearchParams();
  
  // Data States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activityFilter, setActivityFilter] = useState("");

  // Modals States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form Field States
  const [formName, setFormName] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formWhatsApp, setFormWhatsApp] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAge, setFormAge] = useState("");
  const [formGender, setFormGender] = useState("Male");
  const [formAddress, setFormAddress] = useState("");
  const [formPlan, setFormPlan] = useState("");
  const [formJoiningDate, setFormJoiningDate] = useState("");
  const [formAmountPaid, setFormAmountPaid] = useState("");
  const [formPaymentStatus, setFormPaymentStatus] = useState<"Paid" | "Pending" | "Partial">("Paid");
  const [formNotes, setFormNotes] = useState("");
  const [formPhoto, setFormPhoto] = useState("");
  const [formTrainer, setFormTrainer] = useState("");
  const [formDietPlan, setFormDietPlan] = useState("");
  
  // Upload States
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDiet, setUploadingDiet] = useState(false);
  
  // Profile Detail Sub-Tabs
  const [profileTab, setProfileTab] = useState<"info" | "payments" | "attendance" | "ai">("info");
  const [profileAttendance, setProfileAttendance] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleOpenAiTab = async () => {
    setProfileTab("ai");
    if (!selectedCustomer) return;
    
    setLoadingAi(true);
    setAiSuggestions(null);
    try {
      const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedCustomer.fullName,
          age: selectedCustomer.age,
          gender: selectedCustomer.gender,
          packageType: selectedCustomer.packageType,
          notes: selectedCustomer.notes,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  // Submitting States
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch plans and customers
  const fetchData = async () => {
    setLoading(true);
    try {
      const plansRes = await fetch("/api/plans");
      if (plansRes.ok) {
        const data = await plansRes.json();
        setPlans(data.plans || []);
      }

      const activeParam = activityFilter ? `&active=${activityFilter}` : "";
      const planParam = planFilter ? `&plan=${encodeURIComponent(planFilter)}` : "";
      const statusParam = statusFilter ? `&status=${statusFilter}` : "";
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

      const custRes = await fetch(`/api/customers?${searchParam}${planParam}${statusParam}${activeParam}`);
      if (custRes.ok) {
        const data = await custRes.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error("Fetch Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [planFilter, statusFilter, activityFilter]);

  // Handle URL Params for quick action triggers
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      openAddModal();
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  // Pre-fill fields on plan selection
  const handlePlanChange = (planName: string) => {
    setFormPlan(planName);
    const chosenPlan = plans.find((p) => p.name === planName);
    if (chosenPlan) {
      setFormAmountPaid(chosenPlan.price.toString());
    } else {
      setFormAmountPaid("");
    }
  };

  // Upload Files (Photos / Diets)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isDiet = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isDiet) setUploadingDiet(true);
    else setUploadingPhoto(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        if (isDiet) setFormDietPlan(data.url);
        else setFormPhoto(data.url);
      } else {
        alert(data.error || "File upload failed.");
      }
    } catch (err) {
      alert("Failed to upload file to server.");
    } finally {
      if (isDiet) setUploadingDiet(false);
      else setUploadingPhoto(false);
    }
  };

  // Modals Openers
  const openAddModal = () => {
    setFormName("");
    setFormMobile("");
    setFormWhatsApp("");
    setFormEmail("");
    setFormAge("");
    setFormGender("Male");
    setFormAddress("");
    setFormPlan("");
    setFormJoiningDate(new Date().toISOString().split("T")[0]);
    setFormAmountPaid("");
    setFormPaymentStatus("Paid");
    setFormNotes("");
    setFormPhoto("");
    setFormTrainer("");
    setFormDietPlan("");
    setErrorMsg("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (cust: Customer) => {
    setSelectedCustomer(cust);
    setFormName(cust.fullName);
    setFormMobile(cust.mobileNumber);
    setFormWhatsApp(cust.whatsAppNumber);
    setFormEmail(cust.email || "");
    setFormAge(cust.age?.toString() || "");
    setFormGender(cust.gender || "Male");
    setFormAddress(cust.address || "");
    setFormPlan(cust.membershipPlan);
    setFormJoiningDate(cust.joiningDate.split("T")[0]);
    setFormAmountPaid(cust.amountPaid.toString());
    setFormPaymentStatus(cust.paymentStatus);
    setFormNotes(cust.notes || "");
    setFormPhoto(cust.photo || "");
    setFormTrainer(cust.trainerAssigned || "");
    setFormDietPlan(cust.dietPlanUrl || "");
    setErrorMsg("");
    setIsEditModalOpen(true);
  };

  const openRenewModal = (cust: Customer) => {
    setSelectedCustomer(cust);
    const exp = new Date(cust.expiryDate);
    const today = new Date();
    const startDate = exp > today ? exp : today;
    
    setFormPlan("");
    setFormJoiningDate(startDate.toISOString().split("T")[0]);
    setFormAmountPaid("");
    setFormPaymentStatus("Paid");
    setErrorMsg("");
    setIsRenewModalOpen(true);
  };

  const openProfileModal = async (cust: Customer) => {
    setSelectedCustomer(cust);
    setProfileTab("info");
    setIsProfileModalOpen(true);

    // Fetch individual attendance records
    try {
      const res = await fetch(`/api/attendance?date=all`); // Modified check
      if (res.ok) {
        const data = await res.json();
        const logs = data.logs || [];
        const customerLogs = logs.filter((log: any) => log.member_id === cust._id);
        setProfileAttendance(customerLogs);
      }
    } catch (e) {
      console.error("Attendance fetch error:", e);
    }
  };

  const openIdCard = (cust: Customer) => {
    setSelectedCustomer(cust);
    setIsIdCardOpen(true);
  };

  // Submit Operations
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          phone: formMobile,
          whatsapp_number: formWhatsApp,
          email: formEmail,
          age: formAge ? Number(formAge) : 0,
          gender: formGender,
          address: formAddress,
          membership_plan: formPlan,
          join_date: formJoiningDate,
          amount_paid: Number(formAmountPaid),
          payment_status: formPaymentStatus,
          notes: formNotes,
          photo: formPhoto,
          trainer_assigned: formTrainer,
          dietPlanUrl: formDietPlan,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to register member");
      }

      setIsAddModalOpen(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/customers/${selectedCustomer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          phone: formMobile,
          whatsapp_number: formWhatsApp,
          email: formEmail,
          age: formAge ? Number(formAge) : 0,
          gender: formGender,
          address: formAddress,
          membership_plan: formPlan,
          join_date: formJoiningDate,
          amount_paid: Number(formAmountPaid),
          payment_status: formPaymentStatus,
          notes: formNotes,
          photo: formPhoto,
          trainer_assigned: formTrainer,
          dietPlanUrl: formDietPlan,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update member details");
      }

      setIsEditModalOpen(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRenewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/customers/${selectedCustomer._id}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipPlan: formPlan,
          joiningDate: formJoiningDate,
          amountPaid: Number(formAmountPaid),
          paymentStatus: formPaymentStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Renewal registration failed.");
      }

      setIsRenewModalOpen(false);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this member? All attendance logs and payment logs will be removed.")) return;
    
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        alert("Delete request failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ID Card Printer
  const handlePrintIdCard = () => {
    const printWindow = window.open("", "_blank", "width=600,height=800");
    if (!printWindow) {
      alert("Allow pop-ups to print ID Card.");
      return;
    }

    const cardHtml = `
      <html>
      <head>
        <title>Print ID Pass - Royal Fitness</title>
        <style>
          body { display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; font-family: sans-serif; }
          .badge-card {
            width: 350px; height: 520px;
            background: #111; border: 4px solid #D4AF37;
            border-radius: 15px; box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            text-align: center; color: #fff; padding: 25px; box-sizing: border-box;
            position: relative; overflow: hidden;
          }
          .title-area { font-size: 24px; font-weight: bold; margin-bottom: 25px; letter-spacing: 2px; }
          .title-area span { color: #D4AF37; }
          .photo-area { width: 130px; height: 130px; border-radius: 50%; border: 3px solid #D4AF37; margin: 0 auto 20px auto; overflow: hidden; background: #222; }
          .photo-area img { width: 100%; height: 100%; object-cover: fit; }
          .member-name { font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0; color: #fff; }
          .member-id { font-size: 10px; font-family: monospace; color: #888; margin-bottom: 20px; }
          .field-row { display: flex; justify-content: space-between; border-bottom: 1px solid #222; padding: 8px 0; font-size: 12px; }
          .field-row span { color: #aaa; }
          .field-row strong { color: #fff; }
          .qr-wrapper { margin-top: 30px; display: inline-block; padding: 10px; background: #fff; border-radius: 5px; }
          @media print {
            body { height: auto; }
            .print-btn { display: none; }
          }
          .print-btn {
            position: fixed; top: 20px; right: 20px; background: #D4AF37; color: #111; padding: 12px 24px; border: none; font-weight: bold; border-radius: 8px; cursor: pointer;
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Print Card</button>
        <div class="badge-card">
          <div class="title-area">ROYAL <span>FITNESS</span></div>
          <div class="photo-area">
            <img src="${selectedCustomer?.photo || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400"}" />
          </div>
          <div class="member-name">${selectedCustomer?.fullName}</div>
          <div class="member-id">ID: ${selectedCustomer?._id}</div>
          
          <div class="field-row">
            <span>Package Term:</span>
            <strong>${selectedCustomer?.packageType}</strong>
          </div>
          <div class="field-row">
            <span>Expiry Date:</span>
            <strong>${new Date(selectedCustomer?.expiryDate || "").toLocaleDateString("en-IN")}</strong>
          </div>
          <div class="field-row">
            <span>Phone:</span>
            <strong>${selectedCustomer?.mobileNumber}</strong>
          </div>

          <div class="qr-wrapper">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${selectedCustomer?._id}" />
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(cardHtml);
    printWindow.document.close();
  };

  // Direct Invoice Printer
  const handlePrintLatestInvoice = (cust: Customer) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      alert("Allow pop-ups to print invoices.");
      return;
    }

    const formattedDate = new Date(cust.joiningDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    const invoiceHtml = `
      <html>
      <head>
        <title>Invoice Receipt - Royal Fitness</title>
        <style>
          body { font-family: Arial, sans-serif; color: #222; padding: 40px; }
          .invoice-box { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D4AF37; padding-bottom: 15px; }
          .logo { font-size: 24px; font-weight: bold; }
          .logo span { color: #D4AF37; }
          .details { margin: 30px 0; display: flex; justify-content: space-between; font-size: 13px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th { background: #f5f5f5; text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
          .table td { padding: 12px 10px; border-bottom: 1px solid #eee; }
          .total { margin-top: 30px; text-align: right; font-size: 18px; font-weight: bold; }
          .total span { color: #D4AF37; }
          @media print {
            .print-btn { display: none; }
          }
          .print-btn {
            background: #D4AF37; border: none; padding: 10px 20px; font-weight: bold; border-radius: 5px; cursor: pointer; float: right; margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Print Invoice</button>
        <div class="invoice-box">
          <div class="header">
            <div class="logo">ROYAL <span>FITNESS</span></div>
            <h2>INVOICE</h2>
          </div>
          <div class="details">
            <div>
              <h3>Billed To:</h3>
              <p style="text-transform: capitalize; font-weight: bold;">${cust.fullName}</p>
              <p>Contact: ${cust.mobileNumber}</p>
            </div>
            <div style="text-align: right;">
              <h3>Gym Address:</h3>
              <p>Sarada Nagar, Pendurthi</p>
              <p>Date: ${formattedDate}</p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Payment Term</th>
                <th style="text-align: right;">Total Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Gym Membership Fee</strong><br><span style="font-size:11px;color:#666;">Plan: ${cust.membershipPlan}</span></td>
                <td>${cust.packageType}</td>
                <td style="text-align: right;">₹${cust.amountPaid}.00</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Amount Paid: <span>₹${cust.amountPaid}.00</span>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    if (customers.length === 0) return;
    
    const headers = ["Full Name", "Mobile", "WhatsApp", "Email", "Age", "Gender", "Address", "Plan Type", "Membership Plan", "Joining Date", "Expiry Date", "Amount Paid", "Status", "Trainer Assigned"];
    const rows = customers.map((c) => [
      c.fullName,
      c.mobileNumber,
      c.whatsAppNumber,
      c.email || "",
      c.age || "",
      c.gender || "",
      c.address || "",
      c.packageType,
      c.membershipPlan,
      new Date(c.joiningDate).toLocaleDateString("en-IN"),
      new Date(c.expiryDate).toLocaleDateString("en-IN"),
      c.amountPaid,
      c.paymentStatus,
      c.trainerAssigned || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `royal_fitness_members_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Local Pagination calculations
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const paginatedCustomers = customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header section with actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-300">Customer Roster</h2>
          <p className="text-xs text-gray-500">Manage gym member profiles, track active terms, and issue manual triggers.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            disabled={customers.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-white/20 bg-white/5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer text-gray-300 hover:text-white"
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            onClick={openAddModal}
            className="btn-primary py-2 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} /> Add Member
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search member name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-primary transition-colors"
          />
          <button type="submit" className="absolute left-3 top-2.5 text-gray-500 hover:text-white">
            <Search size={16} />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
          <select
            value={activityFilter}
            onChange={(e) => { setActivityFilter(e.target.value); setCurrentPage(1); }}
            className="bg-charcoal-dark border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary text-gray-300"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="expired">Expired Members</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => { setPlanFilter(e.target.value); setCurrentPage(1); }}
            className="bg-charcoal-dark border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary text-gray-300"
          >
            <option value="">All Plans</option>
            {plans.map((p) => (
              <option key={p._id} value={p.name}>
                {p.name}
              </option>
            ))}
            <option value="Custom">Custom Plan</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-charcoal-dark border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary text-gray-300"
          >
            <option value="">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setPlanFilter("");
              setStatusFilter("");
              setActivityFilter("");
              setCurrentPage(1);
              fetchData();
            }}
            className="p-2 hover:bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Roster Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Fetching roster details...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="glass-card py-20 text-center text-gray-500 border-white/5">
          No gym members found matching the specified parameters.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass-card border-white/5 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs font-bold uppercase">
                  <th className="p-4">Photo</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">WhatsApp / Mobile</th>
                  <th className="p-4">Membership Plan</th>
                  <th className="p-4">Joining Date</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4">Paid</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {paginatedCustomers.map((c) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const expiry = new Date(c.expiryDate);
                  const isActive = expiry >= today;

                  return (
                    <tr key={c._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="w-8 h-8 rounded-full bg-white/5 overflow-hidden border border-white/10">
                          {c.photo ? (
                            <img src={c.photo} alt={c.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xs bg-white/5">
                              {c.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold capitalize">
                        <button
                          onClick={() => openProfileModal(c)}
                          className="hover:text-primary transition-colors text-left font-bold"
                        >
                          {c.fullName}
                        </button>
                        {!isActive && (
                          <span className="ml-2 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/20">
                            Expired
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-xs">
                        {c.whatsAppNumber}
                        {c.mobileNumber !== c.whatsAppNumber && (
                          <div className="text-[9px] text-gray-500 mt-0.5 font-sans">Mobile: {c.mobileNumber}</div>
                        )}
                      </td>
                      <td className="p-4 text-xs text-gray-300 font-semibold">{c.membershipPlan}</td>
                      <td className="p-4 text-xs text-gray-400">
                        {new Date(c.joiningDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className={`p-4 text-xs font-semibold ${isActive ? "text-emerald-500" : "text-secondary"}`}>
                        {new Date(c.expiryDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-4 font-mono text-xs">₹{c.amountPaid}</td>
                      <td className="p-4">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            c.paymentStatus === "Paid"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : c.paymentStatus === "Partial"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-secondary/10 text-secondary border border-secondary/20"
                          }`}
                        >
                          {c.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => openIdCard(c)}
                          className="p-1.5 hover:bg-white/5 text-primary hover:text-white rounded border border-white/5 transition-all"
                          title="Print ID Card"
                        >
                          <Printer size={13} />
                        </button>
                        <button
                          onClick={() => handlePrintLatestInvoice(c)}
                          className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded border border-white/5 transition-all"
                          title="Print Receipt Invoice"
                        >
                          <FileText size={13} />
                        </button>
                        <a
                          href={`https://wa.me/${c.whatsAppNumber.replace(/\D/g, "")}`}
                          target="_blank"
                          className="p-1.5 hover:bg-[#25D366]/10 text-[#25D366] rounded transition-colors"
                          title="WhatsApp Chat"
                        >
                          <PhoneCall size={13} />
                        </a>
                        <button
                          onClick={() => openRenewModal(c)}
                          className="px-2.5 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-charcoal text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer"
                          title="Renew Plan"
                        >
                          Renew
                        </button>
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-1.5 hover:bg-secondary/10 text-gray-500 hover:text-secondary rounded transition-colors cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-charcoal-light/30 border border-white/5 p-4 rounded-xl">
              <span className="text-xs text-gray-500">
                Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({customers.length} total members)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 border border-white/10 hover:border-white/20 bg-white/5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer text-gray-300"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-white/10 hover:border-white/20 bg-white/5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer text-gray-300"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
         ADD / EDIT MEMBER MODALS
         ========================================== */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-charcoal-dark/50">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white">
                {isAddModalOpen ? "Register Gym Member" : "Edit Profile"}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-gray-500 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4 font-sans text-xs">
              {errorMsg && (
                <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-lg flex items-start gap-2.5">
                  <AlertTriangle className="text-secondary shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-gray-200">{errorMsg}</p>
                </div>
              )}

              {/* Row 1: Image Upload and Name */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-1 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 overflow-hidden relative group bg-white/5 flex items-center justify-center">
                    {formPhoto ? (
                      <img src={formPhoto} alt="Upload" className="w-full h-full object-cover" />
                    ) : (
                      <User size={30} className="text-gray-500" />
                    )}
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 size={16} className="animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                  <label className="text-[9px] text-primary font-bold uppercase tracking-wider mt-1.5 cursor-pointer hover:underline">
                    {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="md:col-span-3 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="rahul@gmail.com"
                        className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Age</label>
                      <input
                        type="number"
                        value={formAge}
                        onChange={(e) => setFormAge(e.target.value)}
                        placeholder="e.g. 25"
                        className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Mobile / WhatsApp / Gender */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    placeholder="919876543210"
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={formWhatsApp}
                    onChange={(e) => setFormWhatsApp(e.target.value)}
                    placeholder="919876543210"
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-primary"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Plan details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Membership Plan</label>
                  <select
                    required
                    value={formPlan}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-primary"
                  >
                    <option value="">-- Select package plan --</option>
                    {plans.map((p) => (
                      <option key={p._id} value={p.name}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                    <option value="Custom">Custom Plan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Joining Date</label>
                  <input
                    type="date"
                    required
                    value={formJoiningDate}
                    onChange={(e) => setFormJoiningDate(e.target.value)}
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Row 4: Amount / Payment status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount Paid (₹)</label>
                  <input
                    type="number"
                    required
                    value={formAmountPaid}
                    onChange={(e) => setFormAmountPaid(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Status</label>
                  <select
                    value={formPaymentStatus}
                    onChange={(e) => setFormPaymentStatus(e.target.value as any)}
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-primary"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Address, Trainer, Diet Sheet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Residential Address</label>
                  <textarea
                    rows={2}
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="e.g. Apartment, Street, City"
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trainer Assigned</label>
                    <input
                      type="text"
                      value={formTrainer}
                      onChange={(e) => setFormTrainer(e.target.value)}
                      placeholder="e.g. Vikram Singh"
                      className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 uppercase font-bold">Diet Sheet (PDF/Image):</span>
                    <label className="text-[9px] text-primary font-bold uppercase tracking-wider cursor-pointer hover:underline">
                      {uploadingDiet ? "Uploading..." : formDietPlan ? "Uploaded ✓" : "Upload File"}
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Internal Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Medical conditions, goals, etc."
                  className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 bg-charcoal-dark/20 p-2 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-white/5 border border-white/10 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> Processing...
                    </>
                  ) : isAddModalOpen ? (
                    "Register Customer"
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
         RENEW PLAN MODAL
         ========================================== */}
      {isRenewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md border border-white/10 shadow-2xl relative">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-charcoal-dark/50">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white">Renew Membership</h3>
              <button onClick={() => setIsRenewModalOpen(false)} className="text-gray-500 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRenewSubmit} className="p-6 space-y-4 font-sans text-xs">
              {errorMsg && (
                <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-lg flex items-start gap-2.5">
                  <AlertTriangle className="text-secondary shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-gray-200">{errorMsg}</p>
                </div>
              )}

              <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-xs text-gray-300 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-400">Renewing:</span>{" "}
                  <span className="font-bold text-white capitalize">{selectedCustomer.fullName}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Current Expiry:</span>{" "}
                  <span className="font-bold text-amber-500">
                    {new Date(selectedCustomer.expiryDate).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Renewal Plan</label>
                <select
                  required
                  value={formPlan}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-gray-300 focus:outline-none focus:border-primary"
                >
                  <option value="">-- Select --</option>
                  {plans.map((p) => (
                    <option key={p._id} value={p.name}>
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                  <option value="Custom">Custom Plan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Renewal Start Date</label>
                <input
                  type="date"
                  required
                  value={formJoiningDate}
                  onChange={(e) => setFormJoiningDate(e.target.value)}
                  className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount Paid (₹)</label>
                  <input
                    type="number"
                    required
                    value={formAmountPaid}
                    onChange={(e) => setFormAmountPaid(e.target.value)}
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Status</label>
                  <select
                    value={formPaymentStatus}
                    onChange={(e) => setFormPaymentStatus(e.target.value as any)}
                    className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 px-3 text-xs text-gray-300 focus:outline-none focus:border-primary"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 bg-charcoal-dark/20 p-2 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsRenewModalOpen(false)}
                  className="px-4 py-2 hover:bg-white/5 border border-white/10 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {submitting ? <Loader2 className="animate-spin" size={14} /> : "Record Renewal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
         MEMBER DETAILS PROFILE MODAL
         ========================================== */}
      {isProfileModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-charcoal-dark/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                  {selectedCustomer.photo ? (
                    <img src={selectedCustomer.photo} alt={selectedCustomer.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-primary text-lg font-bold">
                      {selectedCustomer.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase text-white tracking-wide">{selectedCustomer.fullName}</h3>
                  <p className="text-[10px] text-gray-500 font-mono">Registered ID: {selectedCustomer._id}</p>
                </div>
              </div>
              
              <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-500 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation Sub-Tabs */}
            <div className="flex border-b border-white/5 bg-charcoal-dark/20 p-1">
              <button
                onClick={() => setProfileTab("info")}
                className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  profileTab === "info" ? "border-b-2 border-primary text-primary" : "text-gray-400 hover:text-white"
                }`}
              >
                Profile Info
              </button>
              <button
                onClick={() => setProfileTab("attendance")}
                className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  profileTab === "attendance" ? "border-b-2 border-primary text-primary" : "text-gray-400 hover:text-white"
                }`}
              >
                Attendance Logs
              </button>
              <button
                onClick={handleOpenAiTab}
                className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  profileTab === "ai" ? "border-b-2 border-primary text-primary" : "text-gray-400 hover:text-white"
                }`}
              >
                AI Coach
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 font-sans text-xs">
              
              {/* Tab 1: Info panel */}
              {profileTab === "info" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase text-primary tracking-wider border-b border-white/5 pb-1">Member Specifications</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase font-bold block">Age</span>
                        <strong className="text-white text-xs">{selectedCustomer.age || "N/A"} years</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase font-bold block">Gender</span>
                        <strong className="text-white text-xs">{selectedCustomer.gender || "N/A"}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase font-bold block">Contact Phone</span>
                        <strong className="text-white text-xs font-mono">{selectedCustomer.mobileNumber}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase font-bold block">WhatsApp Contact</span>
                        <strong className="text-white text-xs font-mono">{selectedCustomer.whatsAppNumber}</strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">Email Address</span>
                      <strong className="text-white text-xs font-mono">{selectedCustomer.email || "N/A"}</strong>
                    </div>

                    <div>
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">Home Address</span>
                      <p className="text-white text-xs mt-0.5 leading-relaxed">{selectedCustomer.address || "No address on record"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase text-primary tracking-wider border-b border-white/5 pb-1">Membership Plan Status</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase font-bold block">Active Package</span>
                        <strong className="text-white text-xs">{selectedCustomer.membershipPlan}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase font-bold block">Trainer Assigned</span>
                        <strong className="text-white text-xs">{selectedCustomer.trainerAssigned || "No Trainer"}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase font-bold block">Joining Date</span>
                        <strong className="text-white text-xs font-mono">{new Date(selectedCustomer.joiningDate).toLocaleDateString("en-IN")}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase font-bold block">Expiration Date</span>
                        <strong className="text-white text-xs font-mono">{new Date(selectedCustomer.expiryDate).toLocaleDateString("en-IN")}</strong>
                      </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase font-bold block">Status badge</span>
                        {(() => {
                          const today = new Date();
                          today.setHours(0,0,0,0);
                          const exp = new Date(selectedCustomer.expiryDate);
                          const remTime = exp.getTime() - today.getTime();
                          const remDays = Math.ceil(remTime / (1000 * 60 * 60 * 24));
                          const isActive = exp >= today;

                          return (
                            <div className="mt-1 flex items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-secondary/10 text-secondary"
                              }`}>
                                {isActive ? "Active Plan" : "Plan Expired"}
                              </span>
                              <span className="text-xs text-gray-400 font-semibold font-mono">
                                {isActive ? `(${remDays} days remaining)` : `(Expired)`}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    
                    {selectedCustomer.dietPlanUrl && (
                      <div className="flex justify-between items-center border border-white/5 p-3 bg-white/5 rounded-xl">
                        <span className="font-bold text-[10px] uppercase text-gray-400">Diet Nutrition Sheet:</span>
                        <a
                          href={selectedCustomer.dietPlanUrl}
                          target="_blank"
                          className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-charcoal rounded text-[10px] font-bold uppercase transition-all"
                        >
                          View PDF/Image
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Attendance records logs */}
              {profileTab === "attendance" && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase text-primary tracking-wider border-b border-white/5 pb-1">Member Check-In & Check-Out History</h4>
                  
                  {profileAttendance.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 text-xs">
                      No attendance checks logged for this member.
                    </div>
                  ) : (
                    <div className="max-h-[250px] overflow-y-auto divide-y divide-white/5">
                      {profileAttendance.map((log: any) => {
                        const checkIn = new Date(log.check_in_time).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit"
                        });
                        const checkOut = log.check_out_time
                          ? new Date(log.check_out_time).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "Active";

                        return (
                          <div key={log.id} className="flex justify-between items-center py-2 text-xs">
                            <span className="font-mono text-gray-400">
                              {new Date(log.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                            <div className="flex gap-4">
                              <span className="text-emerald-500 font-semibold">Check-In: {checkIn}</span>
                              <span className="text-amber-500 font-semibold">Check-Out: {checkOut}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: AI Coach suggestions */}
              {profileTab === "ai" && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase text-primary tracking-wider border-b border-white/5 pb-1 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary animate-pulse" />
                    AI Personal Trainer Suggestions
                  </h4>
                  
                  {loadingAi ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Loader2 className="animate-spin text-primary" size={24} />
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Generating specialized coach advice...</p>
                    </div>
                  ) : aiSuggestions ? (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-white/5 p-4 rounded-xl bg-white/5 space-y-2">
                          <span className="font-bold text-[9px] uppercase tracking-wider text-primary">Target Goal Focus</span>
                          <p className="font-bold text-white text-xs capitalize">{aiSuggestions.target}</p>
                        </div>
                        <div className="border border-white/5 p-4 rounded-xl bg-white/5 space-y-2">
                          <span className="font-bold text-[9px] uppercase tracking-wider text-primary">Hydration & Recovery</span>
                          <ul className="list-disc pl-4 space-y-1 text-gray-300 text-[11px]">
                            {aiSuggestions.tips?.map((tip: string, i: number) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="border border-white/5 p-4 rounded-xl bg-white/5 space-y-2">
                        <span className="font-bold text-[9px] uppercase tracking-wider text-primary">AI Recommended Workout Structure</span>
                        <p className="text-gray-300 text-xs leading-relaxed">{aiSuggestions.workout}</p>
                      </div>

                      <div className="border border-white/5 p-4 rounded-xl bg-white/5 space-y-2">
                        <span className="font-bold text-[9px] uppercase tracking-wider text-primary">AI Recommended Nutrition Plan</span>
                        <p className="text-gray-300 text-xs leading-relaxed">{aiSuggestions.diet}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-500">
                      Failed to fetch recommendations.
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
         MEMBERSHIP ID CARD PRINT PREVIEW MODAL
         ========================================== */}
      {isIdCardOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm border border-white/10 shadow-2xl relative p-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-6">
              <h3 className="text-base font-bold uppercase text-white">ID Card Pass Preview</h3>
              <button onClick={() => setIsIdCardOpen(false)} className="text-gray-500 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* High fidelity Gold-Black Badge structure */}
            <div className="w-full bg-charcoal border-2 border-primary rounded-2xl p-6 text-center text-white relative shadow-xl overflow-hidden min-h-[460px]">
              
              {/* Gold watermark ring accent */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full border border-primary/10"></div>
              
              <div className="font-bebas text-2xl tracking-widest text-white mb-6">
                ROYAL <span className="text-primary font-bold">FITNESS</span>
              </div>

              <div className="w-24 h-24 rounded-full border-2 border-primary overflow-hidden mx-auto mb-4 bg-white/5">
                {selectedCustomer.photo ? (
                  <img src={selectedCustomer.photo} alt={selectedCustomer.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary text-3xl font-bold bg-white/5">
                    {selectedCustomer.fullName.charAt(0)}
                  </div>
                )}
              </div>

              <h4 className="text-lg font-bold capitalize text-white tracking-wide mb-0.5">{selectedCustomer.fullName}</h4>
              <p className="text-[9px] font-mono text-gray-500 mb-6">ID: {selectedCustomer._id}</p>

              <div className="space-y-2 text-left text-xs bg-white/5 border border-white/5 rounded-xl p-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[10px] uppercase font-bold">Package:</span>
                  <span className="font-semibold">{selectedCustomer.packageType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[10px] uppercase font-bold">Expiry Date:</span>
                  <span className="font-semibold font-mono">{new Date(selectedCustomer.expiryDate).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[10px] uppercase font-bold">Phone Number:</span>
                  <span className="font-semibold font-mono">{selectedCustomer.mobileNumber}</span>
                </div>
              </div>

              {/* Dynamic QR Check-in Code rendering */}
              <div className="inline-block p-2 bg-white rounded-lg mb-2">
                <QRCodeSVG value={selectedCustomer._id} size={70} />
              </div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest">Scannable Check-In Pass</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsIdCardOpen(false)}
                className="px-4 py-2 hover:bg-white/5 border border-white/10 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePrintIdCard}
                className="btn-primary py-2 px-5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} /> Print Card
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Loading Customer Panel...</p>
      </div>
    }>
      <CustomersContent />
    </Suspense>
  );
}
