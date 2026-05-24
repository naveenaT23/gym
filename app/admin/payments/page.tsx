"use client";

import { useState, useEffect } from "react";
import { CreditCard, Loader2, Search, FileText, Download, Printer, RefreshCw, Plus, Trash2, CheckCircle, Clock } from "lucide-react";

interface PaymentItem {
  id: string;
  member_id: string;
  amount: number;
  payment_date: string;
  payment_method: "Cash" | "UPI" | "Card" | "Bank Transfer";
  invoice_id: string;
  members: {
    id: string;
    name: string;
    phone: string;
    membership_plan: string;
  } | null;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error("Fetch payments error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const memberName = p.members?.name || "";
    const memberPhone = p.members?.phone || "";
    const matchesSearch = memberName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          memberPhone.includes(searchQuery) ||
                          p.invoice_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter ? p.payment_method === methodFilter : true;
    return matchesSearch && matchesMethod;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredPayments.length === 0) return;
    
    const headers = ["Invoice ID", "Date", "Customer Name", "Contact", "Membership Plan", "Amount (INR)", "Payment Method"];
    const rows = filteredPayments.map((p) => [
      p.invoice_id,
      new Date(p.payment_date).toLocaleDateString("en-IN"),
      p.members?.name || "Unknown",
      p.members?.phone || "N/A",
      p.members?.membership_plan || "N/A",
      p.amount,
      p.payment_method
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `royal_fitness_payments_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open invoice in a new window and print it
  const handlePrintInvoice = (p: PaymentItem) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      alert("Please allow pop-ups to view invoices.");
      return;
    }

    const formattedDate = new Date(p.payment_date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - Royal Fitness Gym</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #222; margin: 0; padding: 40px; }
          .invoice-container { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); position: relative; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; }
          .logo { font-size: 28px; font-weight: bold; letter-spacing: -1px; font-family: Impact, sans-serif; }
          .logo span { color: #D4AF37; }
          .title { text-align: right; }
          .title h1 { margin: 0; font-size: 32px; font-weight: 300; color: #121212; }
          .details { margin: 40px 0; display: flex; justify-content: space-between; }
          .details div { flex: 1; }
          .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          .table th { background: #f9f9f9; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #ddd; }
          .table td { padding: 15px 12px; border-bottom: 1px solid #eee; font-size: 14px; }
          .total { margin-top: 40px; text-align: right; font-size: 18px; }
          .total span { font-weight: bold; color: #D4AF37; font-size: 22px; }
          .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
          .stamp { position: absolute; bottom: 120px; left: 50px; border: 3px double #10B981; color: #10B981; font-weight: bold; font-size: 20px; padding: 10px 20px; transform: rotate(-5deg); text-transform: uppercase; letter-spacing: 2px; }
          @media print {
            body { padding: 0; }
            .invoice-container { border: none; box-shadow: none; padding: 0; }
            .print-btn { display: none; }
          }
          .print-btn {
            background: #D4AF37; color: #121212; border: none; padding: 10px 20px; font-weight: bold; border-radius: 5px; cursor: pointer; float: right; margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Print Invoice</button>
        <div class="invoice-container">
          <div class="header">
            <div class="logo">ROYAL <span>FITNESS</span></div>
            <div class="title">
              <h1>OFFICIAL RECEIPT</h1>
              <p style="margin:5px 0 0 0;font-size:12px;color:#666;">Invoice ID: ${p.invoice_id}</p>
            </div>
          </div>
          
          <div class="details">
            <div>
              <h3 style="color:#D4AF37;margin-bottom:10px;">Billed To:</h3>
              <p style="margin: 0 0 5px 0; font-weight:bold; text-transform: capitalize;">${p.members?.name || "Unknown Member"}</p>
              <p style="margin: 0 0 5px 0;">Contact: ${p.members?.phone || "N/A"}</p>
            </div>
            <div style="text-align: right;">
              <h3 style="color:#D4AF37;margin-bottom:10px;">Gym Information:</h3>
              <p style="margin: 0 0 5px 0; font-weight: bold;">Royal Fitness Gym</p>
              <p style="margin: 0 0 5px 0;">Sarada Nagar, Pendurthi, AP</p>
              <p style="margin: 0 0 5px 0;">Date of Payment: ${formattedDate}</p>
            </div>
          </div>
 
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Payment Method</th>
                <th style="text-align: right;">Total Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Gym Membership Dues</strong><br>
                  <span style="font-size:11px;color:#777;">Plan term: ${p.members?.membership_plan || "Active Plan"}</span>
                </td>
                <td>${p.payment_method}</td>
                <td style="text-align: right; font-weight: bold;">₹${p.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
 
          <div class="total">
            Total Paid: <span>₹${p.amount.toFixed(2)}</span>
          </div>

          <div class="stamp">
            Received Paid
          </div>
 
          <div class="footer">
            Thank you for choosing Royal Fitness Gym! Keep grinding and forging your legend.<br>
            If you have any questions, please contact us at info@royalfitnessgym.com.
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-300">Transaction History</h2>
          <p className="text-xs text-gray-500">Track paid receipts, pending cash amounts, and generate customer invoices.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredPayments.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-white/20 bg-white/5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 self-start md:self-center cursor-pointer"
        >
          <Download size={15} /> Export Report
        </button>
      </div>

      {/* Local filters */}
      <div className="glass-card p-4 border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Filter by customer name, phone or invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-charcoal-dark border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-primary transition-colors"
          />
          <span className="absolute left-3 top-2.5 text-gray-500">
            <Search size={16} />
          </span>
        </div>

        <div className="flex gap-4 items-center w-full md:w-auto justify-end">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-charcoal-dark border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary text-gray-300"
          >
            <option value="">All Payment Methods</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setMethodFilter("");
              fetchPayments();
            }}
            className="p-2 hover:bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Reset Filters"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Transaction Log Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Loading transaction logs...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="glass-card py-20 text-center text-gray-500 border-white/5">
          No transactions registered for the selected parameters.
        </div>
      ) : (
        <div className="glass-card border-white/5 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 text-gray-500 text-xs font-bold uppercase">
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Membership Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-xs font-bold text-gray-400">{p.invoice_id}</td>
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(p.payment_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </td>
                  <td className="p-4 font-bold capitalize">{p.members?.name || "Unknown Member"}</td>
                  <td className="p-4 font-mono text-xs text-gray-400">{p.members?.phone || "—"}</td>
                  <td className="p-4 text-xs text-gray-300">{p.members?.membership_plan || "—"}</td>
                  <td className="p-4 font-mono text-xs font-bold text-emerald-500">₹{p.amount}</td>
                  <td className="p-4 text-xs text-gray-400">{p.payment_method}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handlePrintInvoice(p)}
                      className="px-2.5 py-1.5 hover:bg-primary hover:text-charcoal text-primary border border-primary/20 rounded transition-all flex items-center justify-center gap-1.5 ml-auto text-xs font-semibold cursor-pointer"
                    >
                      <Printer size={13} />
                      Print Receipt
                    </button>
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
