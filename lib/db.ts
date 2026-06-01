import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Supabase environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const isSupabaseConfigured = SUPABASE_URL && SUPABASE_ANON_KEY;

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE || SUPABASE_ANON_KEY)
  : null;

// Local JSON Database setup
const DB_FILE_PATH = path.join(process.cwd(), "database", "db.json");

interface LocalDB {
  admins: any[];
  members: any[];
  attendance: any[];
  payments: any[];
  notification_logs: any[];
  settings: any;
}

const DEFAULT_SETTINGS = {
  whatsappProvider: "twilio", // "twilio", "pabbly", "meta"
  twilioAccountSid: "",
  twilioAuthToken: "",
  twilioPhoneNumber: "",
  pabblyWebhookUrl: "",
  metaAccessToken: "",
  metaPhoneNumberId: "",
  ownerAlertNumber: "917479640000",
  dailyReminderTime: "09:00",
};

// Seed default mock database
const seedLocalDB = (): LocalDB => {
  return {
    admins: [
      {
        id: "admin-1",
        email: "admin@royalfitness.com",
        password_hash: "$2b$10$NrU/EYiVHcQC3oRDifrZ9.pyO3vduHGUhFt.Hxq7xEoBxrnk7uNAC", // bcrypt for adminpassword
        name: "Royal Fitness Admin",
        created_at: new Date().toISOString(),
      },
    ],
    members: [
      {
        id: "member-1",
        name: "Aman Verma",
        photo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400",
        phone: "919876543210",
        whatsapp_number: "919876543210",
        email: "aman@gmail.com",
        age: 26,
        gender: "Male",
        address: "123, Gym Lane, Delhi",
        package_type: "Yearly",
        membership_plan: "Gold Annual Package",
        join_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days ago
        expiry_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 335 days left
        payment_status: "Paid",
        amount_paid: 12000,
        notes: "Regular bodybuilding plan",
        diet_plan_url: "",
        trainer_assigned: "Vikram Singh",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "member-2",
        name: "Priya Sharma",
        photo: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400",
        phone: "919876543211",
        whatsapp_number: "919876543211",
        email: "priya@gmail.com",
        age: 24,
        gender: "Female",
        address: "456, Health Street, Delhi",
        package_type: "Monthly",
        membership_plan: "Standard Monthly Plan",
        join_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 25 days ago
        expiry_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days left (Expiring soon)
        payment_status: "Paid",
        amount_paid: 1500,
        notes: "Wants cardio exercises focus",
        diet_plan_url: "",
        trainer_assigned: "Nisha Patel",
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "member-3",
        name: "Rohan Das",
        photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=400",
        phone: "919876543212",
        whatsapp_number: "919876543212",
        email: "rohan@gmail.com",
        age: 30,
        gender: "Male",
        address: "789, Muscle Avenue, Delhi",
        package_type: "Quarterly",
        membership_plan: "Premium Quarterly Package",
        join_date: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 95 days ago
        expiry_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Expired 5 days ago
        payment_status: "Partial",
        amount_paid: 3000,
        notes: "Dues pending: ₹1000",
        diet_plan_url: "",
        trainer_assigned: "Vikram Singh",
        created_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    attendance: [],
    payments: [
      {
        id: "pay-1",
        member_id: "member-1",
        amount: 12000,
        payment_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: "UPI",
        invoice_id: "INV-2026-0001",
      },
      {
        id: "pay-2",
        member_id: "member-2",
        amount: 1500,
        payment_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: "Cash",
        invoice_id: "INV-2026-0002",
      },
      {
        id: "pay-3",
        member_id: "member-3",
        amount: 3000,
        payment_date: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: "UPI",
        invoice_id: "INV-2026-0003",
      },
    ],
    notification_logs: [],
    settings: DEFAULT_SETTINGS,
  };
};

// Global in-memory cache for local JSON database to prevent disk errors on serverless platforms like Netlify
declare global {
  var localDbCache: LocalDB | undefined;
}

// Local JSON DB Helper functions
const readLocalDB = (): LocalDB => {
  if (global.localDbCache) {
    return global.localDbCache;
  }
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (err) {
        console.warn("Could not create database directory, using in-memory:", err);
      }
    }
    
    let dbData: LocalDB;
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
      dbData = JSON.parse(content);
    } else {
      dbData = seedLocalDB();
      try {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbData, null, 2));
      } catch (err) {
        console.warn("Could not write database file, using in-memory:", err);
      }
    }
    global.localDbCache = dbData;
    return dbData;
  } catch (error) {
    console.error("Local DB read error, fallback to memory seed:", error);
    const dbData = seedLocalDB();
    global.localDbCache = dbData;
    return dbData;
  }
};

const writeLocalDB = (data: LocalDB) => {
  global.localDbCache = data;
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.warn("Local DB write error (expected on read-only serverless runtimes):", error);
  }
};

// Combined Data Service
export const dbService = {
  isSupabase() {
    return isSupabaseConfigured;
  },

  // 1. ADMIN LOGINS
  async getAdminByEmail(email: string) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("email", email)
        .single();
      if (error) return null;
      return data;
    } else {
      const db = readLocalDB();
      return db.admins.find((admin) => admin.email === email) || null;
    }
  },

  async updateAdminProfile(id: string, name: string, email: string, passwordHash?: string) {
    if (isSupabaseConfigured && supabase) {
      const updateData: any = { name, email };
      if (passwordHash) {
        updateData.password_hash = passwordHash;
      }
      const { data, error } = await supabase
        .from("admins")
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return data;
    } else {
      const db = readLocalDB();
      const adminIndex = db.admins.findIndex((admin) => admin.id === id);
      if (adminIndex === -1) throw new Error("Admin not found");
      db.admins[adminIndex].name = name;
      db.admins[adminIndex].email = email;
      if (passwordHash) {
        db.admins[adminIndex].password_hash = passwordHash;
      }
      writeLocalDB(db);
      return db.admins[adminIndex];
    }
  },

  // 2. MEMBER OPERATIONS
  async getMembers(filters?: { search?: string; plan?: string; status?: string; active?: string }) {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from("members").select("*");

      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }
      if (filters?.plan) {
        query = query.eq("package_type", filters.plan);
      }
      if (filters?.status) {
        query = query.eq("payment_status", filters.status);
      }
      if (filters?.active) {
        const today = new Date().toISOString().split("T")[0];
        if (filters.active === "active") {
          query = query.gte("expiry_date", today);
        } else if (filters.active === "expired") {
          query = query.lt("expiry_date", today);
        }
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    } else {
      const db = readLocalDB();
      let result = [...db.members];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter((m) => m.name.toLowerCase().includes(searchLower));
      }
      if (filters?.plan) {
        result = result.filter((m) => m.package_type === filters.plan);
      }
      if (filters?.status) {
        result = result.filter((m) => m.payment_status === filters.status);
      }
      if (filters?.active) {
        const todayStr = new Date().toISOString().split("T")[0];
        if (filters.active === "active") {
          result = result.filter((m) => m.expiry_date >= todayStr);
        } else if (filters.active === "expired") {
          result = result.filter((m) => m.expiry_date < todayStr);
        }
      }

      return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  },

  async getMemberById(id: string) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single();
      if (error) return null;
      return data;
    } else {
      const db = readLocalDB();
      return db.members.find((m) => m.id === id) || null;
    }
  },

  async addMember(member: {
    name: string;
    photo: string;
    phone: string;
    whatsapp_number: string;
    email: string;
    age: number;
    gender: string;
    address: string;
    package_type: string;
    membership_plan: string;
    join_date: string;
    expiry_date: string;
    payment_status: string;
    amount_paid: number;
    notes?: string;
    trainer_assigned?: string;
  }) {
    if (isSupabaseConfigured && supabase) {
      // 1. Insert Member
      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .insert([{
          name: member.name,
          photo: member.photo,
          phone: member.phone,
          whatsapp_number: member.whatsapp_number,
          email: member.email,
          age: member.age,
          gender: member.gender,
          address: member.address,
          package_type: member.package_type,
          membership_plan: member.membership_plan,
          join_date: member.join_date,
          expiry_date: member.expiry_date,
          payment_status: member.payment_status,
          amount_paid: member.amount_paid,
          notes: member.notes,
          trainer_assigned: member.trainer_assigned,
        }])
        .select("*")
        .single();

      if (memberError) throw new Error(memberError.message);

      // 2. Log initial Payment
      const invoiceId = `INV-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await supabase.from("payments").insert([{
        member_id: memberData.id,
        amount: member.amount_paid,
        payment_method: "UPI",
        invoice_id: invoiceId,
      }]);

      return memberData;
    } else {
      const db = readLocalDB();
      const newId = `member-${Date.now()}`;
      const newMember = {
        id: newId,
        ...member,
        created_at: new Date().toISOString(),
      };
      db.members.push(newMember);

      // Log payment
      const invoiceId = `INV-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
      db.payments.push({
        id: `pay-${Date.now()}`,
        member_id: newId,
        amount: member.amount_paid,
        payment_date: new Date().toISOString(),
        payment_method: "UPI",
        invoice_id: invoiceId,
      });

      writeLocalDB(db);
      return newMember;
    }
  },

  async updateMember(id: string, member: Partial<any>) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("members")
        .update(member)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return data;
    } else {
      const db = readLocalDB();
      const idx = db.members.findIndex((m) => m.id === id);
      if (idx === -1) throw new Error("Member not found");
      db.members[idx] = { ...db.members[idx], ...member };
      writeLocalDB(db);
      return db.members[idx];
    }
  },

  async renewMember(id: string, renewal: {
    package_type: string;
    membership_plan: string;
    join_date: string;
    expiry_date: string;
    amount_paid: number;
    payment_status: string;
  }) {
    if (isSupabaseConfigured && supabase) {
      // 1. Update Member Details
      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .update({
          package_type: renewal.package_type,
          membership_plan: renewal.membership_plan,
          join_date: renewal.join_date,
          expiry_date: renewal.expiry_date,
          payment_status: renewal.payment_status,
          amount_paid: renewal.amount_paid,
        })
        .eq("id", id)
        .select("*")
        .single();

      if (memberError) throw new Error(memberError.message);

      // 2. Log Payment Record
      const invoiceId = `INV-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await supabase.from("payments").insert([{
        member_id: id,
        amount: renewal.amount_paid,
        payment_method: "UPI",
        invoice_id: invoiceId,
      }]);

      return memberData;
    } else {
      const db = readLocalDB();
      const idx = db.members.findIndex((m) => m.id === id);
      if (idx === -1) throw new Error("Member not found");

      db.members[idx] = {
        ...db.members[idx],
        package_type: renewal.package_type,
        membership_plan: renewal.membership_plan,
        join_date: renewal.join_date,
        expiry_date: renewal.expiry_date,
        payment_status: renewal.payment_status,
        amount_paid: renewal.amount_paid,
      };

      // Log payment
      const invoiceId = `INV-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
      db.payments.push({
        id: `pay-${Date.now()}`,
        member_id: id,
        amount: renewal.amount_paid,
        payment_date: new Date().toISOString(),
        payment_method: "UPI",
        invoice_id: invoiceId,
      });

      writeLocalDB(db);
      return db.members[idx];
    }
  },

  async deleteMember(id: string) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return true;
    } else {
      const db = readLocalDB();
      db.members = db.members.filter((m) => m.id !== id);
      db.attendance = db.attendance.filter((a) => a.member_id !== id);
      db.payments = db.payments.filter((p) => p.member_id !== id);
      writeLocalDB(db);
      return true;
    }
  },

  // 3. ATTENDANCE MANAGEMENT
  async logAttendance(memberId: string) {
    const todayStr = new Date().toISOString().split("T")[0];
    if (isSupabaseConfigured && supabase) {
      // Check if already checked in today
      const { data: existing } = await supabase
        .from("attendance")
        .select("*")
        .eq("member_id", memberId)
        .eq("date", todayStr)
        .maybeSingle();

      if (existing) {
        if (!existing.check_out_time) {
          // Check out
          const { data, error } = await supabase
            .from("attendance")
            .update({ check_out_time: new Date().toISOString() })
            .eq("id", existing.id)
            .select("*")
            .single();
          if (error) throw new Error(error.message);
          return { ...data, status: "checked-out" };
        } else {
          return { ...existing, status: "already-completed" };
        }
      } else {
        // Check in
        const { data, error } = await supabase
          .from("attendance")
          .insert([{ member_id: memberId, date: todayStr }])
          .select("*")
          .single();
        if (error) throw new Error(error.message);
        return { ...data, status: "checked-in" };
      }
    } else {
      const db = readLocalDB();
      const existingIdx = db.attendance.findIndex(
        (a) => a.member_id === memberId && a.date === todayStr
      );

      if (existingIdx !== -1) {
        const record = db.attendance[existingIdx];
        if (!record.check_out_time) {
          record.check_out_time = new Date().toISOString();
          writeLocalDB(db);
          return { ...record, status: "checked-out" };
        } else {
          return { ...record, status: "already-completed" };
        }
      } else {
        const newRecord = {
          id: `att-${Date.now()}`,
          member_id: memberId,
          check_in_time: new Date().toISOString(),
          check_out_time: null,
          date: todayStr,
        };
        db.attendance.push(newRecord);
        writeLocalDB(db);
        return { ...newRecord, status: "checked-in" };
      }
    }
  },

  async getAttendanceLogs(dateStr?: string) {
    const targetDate = dateStr || new Date().toISOString().split("T")[0];
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("attendance")
        .select(`
          *,
          members (
            id,
            name,
            phone,
            package_type
          )
        `)
        .eq("date", targetDate)
        .order("check_in_time", { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    } else {
      const db = readLocalDB();
      const logs = db.attendance.filter((a) => a.date === targetDate);
      return logs
        .map((log) => {
          const member = db.members.find((m) => m.id === log.member_id);
          return {
            ...log,
            members: member ? { id: member.id, name: member.name, phone: member.phone, package_type: member.package_type } : null,
          };
        })
        .sort((a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime());
    }
  },

  async getMonthlyAttendanceAnalytics() {
    // Return last 30 days active count
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("attendance")
        .select("date");
      if (error) throw new Error(error.message);
      
      const counts: { [date: string]: number } = {};
      data?.forEach((row) => {
        counts[row.date] = (counts[row.date] || 0) + 1;
      });
      return counts;
    } else {
      const db = readLocalDB();
      const counts: { [date: string]: number } = {};
      db.attendance.forEach((row) => {
        counts[row.date] = (counts[row.date] || 0) + 1;
      });
      return counts;
    }
  },

  // 4. PAYMENTS & INVOICES
  async getPayments() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          members (
            id,
            name,
            phone,
            membership_plan
          )
        `)
        .order("payment_date", { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    } else {
      const db = readLocalDB();
      return db.payments
        .map((p) => {
          const member = db.members.find((m) => m.id === p.member_id);
          return {
            ...p,
            members: member ? { id: member.id, name: member.name, phone: member.phone, membership_plan: member.membership_plan } : null,
          };
        })
        .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
    }
  },

  // 5. NOTIFICATION LOGS & SETTINGS
  async getNotificationLogs() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("notification_logs")
        .select(`
          *,
          members (
            name,
            phone
          )
        `)
        .order("sent_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    } else {
      const db = readLocalDB();
      return db.notification_logs
        .map((log) => {
          const member = db.members.find((m) => m.id === log.member_id);
          return {
            ...log,
            members: member ? { name: member.name, phone: member.phone } : null,
          };
        })
        .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
    }
  },

  async logNotification(log: { member_id: string; message_type: string; sent_status: string; error_message?: string }) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("notification_logs")
        .insert([log])
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return data;
    } else {
      const db = readLocalDB();
      const newLog = {
        id: `log-${Date.now()}`,
        ...log,
        sent_at: new Date().toISOString(),
      };
      db.notification_logs.push(newLog);
      writeLocalDB(db);
      return newLog;
    }
  },

  async getSettings() {
    if (isSupabaseConfigured && supabase) {
      // In Supabase we store settings in a settings table or simple key-value. Let's do key-value fallback or JSON query
      // For simplicity, we fallback to local JSON for settings config, or fetch from settings table if it exists
      const db = readLocalDB();
      return db.settings || DEFAULT_SETTINGS;
    } else {
      const db = readLocalDB();
      return db.settings || DEFAULT_SETTINGS;
    }
  },

  async updateSettings(settings: Partial<typeof DEFAULT_SETTINGS>) {
    const db = readLocalDB();
    db.settings = { ...(db.settings || DEFAULT_SETTINGS), ...settings };
    writeLocalDB(db);
    return db.settings;
  },
};
