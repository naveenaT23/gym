-- SQL Database Schema for Royal Fitness Gym Management System (Supabase / PostgreSQL)

-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed default admin account (email: admin@royalfitness.com, password: admin123)
-- Hash generated via bcrypt
INSERT INTO admins (email, password_hash, name) 
VALUES ('admin@royalfitness.com', '$2b$10$kjzbDYLe4gJUIQIVgJK5B.1XuPLpIJ6P.gfFwRDHsuIpeTzy4AAaC', 'Royal Fitness Admin')
ON CONFLICT (email) DO NOTHING;

-- 2. Create Members Table
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  photo TEXT, -- URL to member profile picture
  phone VARCHAR(20) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  age INT,
  gender VARCHAR(20),
  address TEXT,
  package_type VARCHAR(50) NOT NULL, -- "Monthly", "Quarterly", "Half-Yearly", "Yearly", "Custom"
  membership_plan VARCHAR(100) NOT NULL, -- e.g. "Gold Annual Package"
  join_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'Paid' CHECK (payment_status IN ('Paid', 'Pending', 'Partial')),
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  diet_plan_url TEXT, -- URL to uploaded diet sheet PDF/Image
  trainer_assigned VARCHAR(255), -- Name of fitness trainer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  check_out_time TIMESTAMP WITH TIME ZONE,
  date DATE DEFAULT CURRENT_DATE NOT NULL
);

-- 4. Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('Cash', 'UPI', 'Card', 'Bank Transfer')),
  invoice_id VARCHAR(100) UNIQUE NOT NULL
);

-- 5. Create Notification Logs Table
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  message_type VARCHAR(50) NOT NULL, -- "7_days_before", "3_days_before", "on_expiry"
  sent_status VARCHAR(20) NOT NULL, -- "Sent", "Failed"
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_members_expiry_date ON members(expiry_date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
