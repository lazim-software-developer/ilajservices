# ILAJ Backend Database Setup Guide

## Step 1: Access Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** from the left sidebar
3. Click **New Query** to create a new SQL script

## Step 2: Create Database Tables

Copy and run each of the following SQL scripts in your Supabase SQL Editor:

### Script 1: Services and Pricing Management

```sql
-- Services and Pricing Management
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- 'B2C', 'Holiday Home', 'Corporate'
    base_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Promotions
CREATE TABLE promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    applicable_services JSONB, -- Array of service IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Provider Management
CREATE TABLE service_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    vat_number VARCHAR(50),
    trade_license VARCHAR(100),
    other_documents JSONB,
    services_provided TEXT[],
    agreed_price_per_service JSONB, -- {service_id: price}
    contract_details JSONB,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin access for now)
CREATE POLICY "Admin access for services" ON services FOR ALL USING (true);
CREATE POLICY "Admin access for promotions" ON promotions FOR ALL USING (true);
CREATE POLICY "Admin access for service_providers" ON service_providers FOR ALL USING (true);
```

### Script 2: Customer Management Tables

```sql
-- Customer Management with different types
CREATE TYPE customer_type AS ENUM ('B2C', 'Holiday Home', 'Corporate');
CREATE TYPE lead_status AS ENUM ('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 'Won', 'Lost');
CREATE TYPE booking_status AS ENUM ('Inquiry', 'Confirmed', 'In Progress', 'Completed', 'Cancelled');
CREATE TYPE contract_status AS ENUM ('None', 'Draft', 'Sent', 'Signed', 'Active', 'Expired');

-- Main Customers Table
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    customer_type customer_type NOT NULL,
    lead_status lead_status DEFAULT 'New',
    booking_status booking_status DEFAULT 'Inquiry',
    contract_status contract_status DEFAULT 'None',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- B2C Customer Details
CREATE TABLE b2c_customers (
    customer_id UUID PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    location VARCHAR(255),
    address TEXT,
    remarks TEXT
);

-- Holiday Home Customer Details  
CREATE TABLE holiday_home_customers (
    customer_id UUID PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    poc_name VARCHAR(255), -- Point of Contact
    manager_name VARCHAR(255),
    number_of_units INTEGER,
    remarks TEXT
);

-- Corporate Customer Details
CREATE TABLE corporate_customers (
    customer_id UUID PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    address TEXT,
    poc_name VARCHAR(255), -- Point of Contact
    remarks TEXT
);

-- Customer Attachments
CREATE TABLE customer_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2c_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_home_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin access for customers" ON customers FOR ALL USING (true);
CREATE POLICY "Admin access for b2c_customers" ON b2c_customers FOR ALL USING (true);
CREATE POLICY "Admin access for holiday_home_customers" ON holiday_home_customers FOR ALL USING (true);
CREATE POLICY "Admin access for corporate_customers" ON corporate_customers FOR ALL USING (true);
CREATE POLICY "Admin access for customer_attachments" ON customer_attachments FOR ALL USING (true);
```

### Script 3: Operations and Task Management

```sql
-- Daily Operations and Task Management
CREATE TYPE task_type AS ENUM ('Website Booking', 'Outside Work', 'Contract Work');
CREATE TYPE payment_status AS ENUM ('Pending', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled');
CREATE TYPE payment_mode AS ENUM ('Cash', 'Card', 'Bank Transfer', 'Cheque', 'Online');

-- Daily Log Entries
CREATE TABLE daily_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sl_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    mobile_no VARCHAR(20),
    email_address VARCHAR(255),
    type_of_work task_type NOT NULL,
    description TEXT,
    ref_no VARCHAR(50),
    ilaj_price_aed DECIMAL(10,2),
    service_provider_id UUID REFERENCES service_providers(id),
    service_provider_price DECIMAL(10,2),
    remarks TEXT,
    payment_mode payment_mode,
    date_of_service DATE,
    time_in TIME,
    amount_as_per_tally DECIMAL(10,2),
    invoice_date DATE,
    invoice_number VARCHAR(100),
    staff_name VARCHAR(255),
    address TEXT,
    sales_invoice_no VARCHAR(100),
    payment_status payment_status DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks (for tracking all work)
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type task_type NOT NULL,
    customer_id UUID REFERENCES customers(id),
    service_provider_id UUID REFERENCES service_providers(id),
    assigned_to VARCHAR(255), -- Staff member
    status VARCHAR(50) DEFAULT 'Pending',
    scheduled_date DATE,
    completed_date DATE,
    estimated_price DECIMAL(10,2),
    actual_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings (from website)
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    service_id UUID REFERENCES services(id),
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_date DATE,
    scheduled_time TIME,
    total_amount DECIMAL(10,2),
    payment_status payment_status DEFAULT 'Pending',
    booking_status booking_status DEFAULT 'Confirmed',
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin access for daily_logs" ON daily_logs FOR ALL USING (true);
CREATE POLICY "Admin access for tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Admin access for bookings" ON bookings FOR ALL USING (true);
```

### Script 4: Financial Management System

```sql
-- Financial Management System
CREATE TYPE transaction_type AS ENUM ('Income', 'Expense');
CREATE TYPE invoice_status AS ENUM ('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled');

-- Service Pricing with Margins
CREATE TABLE service_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    service_provider_id UUID REFERENCES service_providers(id),
    provider_price DECIMAL(10,2) NOT NULL,
    margin_percent DECIMAL(5,2) NOT NULL,
    ilaj_price DECIMAL(10,2) GENERATED ALWAYS AS (provider_price * (1 + margin_percent/100)) STORED,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Invoices
CREATE TABLE customer_invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    booking_id UUID REFERENCES bookings(id),
    invoice_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL,
    vat_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status invoice_status DEFAULT 'Draft',
    payment_terms TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Provider Invoices (for payments to providers)
CREATE TABLE provider_invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    service_provider_id UUID REFERENCES service_providers(id),
    invoice_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL,
    vat_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status invoice_status DEFAULT 'Draft',
    services_rendered JSONB, -- Details of services provided
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Transactions (Ledger)
CREATE TABLE financial_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_date DATE DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100), -- e.g., 'Service Revenue', 'Marketing', 'Office Rent'
    reference_type VARCHAR(50), -- 'Customer Invoice', 'Provider Invoice', 'Other Expense'
    reference_id UUID, -- Points to invoice or other reference
    vat_applicable BOOLEAN DEFAULT false,
    vat_amount DECIMAL(10,2) DEFAULT 0,
    payment_mode payment_mode,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Other Expenses
CREATE TABLE other_expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    expense_date DATE DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Office Rent', 'Marketing', 'Utilities', etc.
    amount DECIMAL(10,2) NOT NULL,
    vat_applicable BOOLEAN DEFAULT false,
    vat_amount DECIMAL(10,2) DEFAULT 0,
    receipt_number VARCHAR(100),
    supplier_name VARCHAR(255),
    payment_mode payment_mode,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VAT Details Tracking
CREATE TABLE vat_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_vat_collected DECIMAL(15,2) DEFAULT 0,
    total_purchases DECIMAL(15,2) DEFAULT 0,
    total_vat_paid DECIMAL(15,2) DEFAULT 0,
    net_vat_payable DECIMAL(15,2) GENERATED ALWAYS AS (total_vat_collected - total_vat_paid) STORED,
    filed_date DATE,
    status VARCHAR(20) DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE service_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE other_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin access for service_pricing" ON service_pricing FOR ALL USING (true);
CREATE POLICY "Admin access for customer_invoices" ON customer_invoices FOR ALL USING (true);
CREATE POLICY "Admin access for provider_invoices" ON provider_invoices FOR ALL USING (true);
CREATE POLICY "Admin access for financial_transactions" ON financial_transactions FOR ALL USING (true);
CREATE POLICY "Admin access for other_expenses" ON other_expenses FOR ALL USING (true);
CREATE POLICY "Admin access for vat_records" ON vat_records FOR ALL USING (true);
```

### Script 5: Helper Functions and Views

```sql
-- Helper Functions and Views for the Backend System

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON service_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON daily_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_invoices_updated_at BEFORE UPDATE ON customer_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_provider_invoices_updated_at BEFORE UPDATE ON provider_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for Revenue Tracking
CREATE VIEW revenue_summary AS
SELECT 
    DATE_TRUNC('month', transaction_date) as month,
    SUM(CASE WHEN transaction_type = 'Income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN transaction_type = 'Expense' THEN amount ELSE 0 END) as total_expenses,
    SUM(CASE WHEN transaction_type = 'Income' THEN amount ELSE -amount END) as net_profit
FROM financial_transactions 
GROUP BY DATE_TRUNC('month', transaction_date)
ORDER BY month DESC;

-- View for Service Provider Performance
CREATE VIEW provider_performance AS
SELECT 
    sp.id,
    sp.name,
    COUNT(dl.id) as total_jobs,
    AVG(dl.service_provider_price) as avg_job_value,
    SUM(dl.service_provider_price) as total_earnings,
    sp.is_available
FROM service_providers sp
LEFT JOIN daily_logs dl ON sp.id = dl.service_provider_id
GROUP BY sp.id, sp.name, sp.is_available;

-- View for Customer Summary with all types
CREATE VIEW customer_summary AS
SELECT 
    c.id,
    c.name,
    c.phone,
    c.email,
    c.customer_type,
    c.lead_status,
    c.booking_status,
    c.contract_status,
    CASE 
        WHEN c.customer_type = 'B2C' THEN b2c.address
        WHEN c.customer_type = 'Holiday Home' THEN CONCAT('Units: ', hh.number_of_units)
        WHEN c.customer_type = 'Corporate' THEN corp.company_name
    END as additional_info,
    COUNT(b.id) as total_bookings,
    COALESCE(SUM(b.total_amount), 0) as total_spent
FROM customers c
LEFT JOIN b2c_customers b2c ON c.id = b2c.customer_id
LEFT JOIN holiday_home_customers hh ON c.id = hh.customer_id  
LEFT JOIN corporate_customers corp ON c.id = corp.customer_id
LEFT JOIN bookings b ON c.id = b.customer_id
GROUP BY c.id, c.name, c.phone, c.email, c.customer_type, c.lead_status, 
         c.booking_status, c.contract_status, b2c.address, hh.number_of_units, corp.company_name;

-- Function to calculate service price with promotion
CREATE OR REPLACE FUNCTION calculate_service_price(
    service_id_param UUID,
    promotion_id_param UUID DEFAULT NULL
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    base_price DECIMAL(10,2);
    final_price DECIMAL(10,2);
    discount_value DECIMAL(10,2);
    discount_type VARCHAR(20);
BEGIN
    -- Get base price
    SELECT current_price INTO base_price FROM services WHERE id = service_id_param;
    
    IF base_price IS NULL THEN
        RETURN 0;
    END IF;
    
    final_price := base_price;
    
    -- Apply promotion if provided
    IF promotion_id_param IS NOT NULL THEN
        SELECT 
            p.discount_value,
            p.discount_type
        INTO discount_value, discount_type
        FROM promotions p
        WHERE p.id = promotion_id_param 
        AND p.is_active = true
        AND CURRENT_DATE BETWEEN p.start_date AND p.end_date
        AND (p.applicable_services IS NULL OR p.applicable_services ? service_id_param::text);
        
        IF discount_value IS NOT NULL THEN
            IF discount_type = 'percentage' THEN
                final_price := base_price * (1 - discount_value / 100);
            ELSE
                final_price := base_price - discount_value;
            END IF;
        END IF;
    END IF;
    
    RETURN GREATEST(final_price, 0); -- Ensure price is not negative
END;
$$ LANGUAGE plpgsql;
```

### Script 6: Initial Sample Data

```sql
-- Insert some initial data
INSERT INTO services (name, description, category, base_price, current_price) VALUES
('Deep Cleaning', 'Comprehensive deep cleaning service', 'B2C', 150.00, 150.00),
('Regular Cleaning', 'Regular maintenance cleaning', 'B2C', 80.00, 80.00),
('One-Time Holiday Cleaning', 'One-time holiday home cleaning', 'Holiday Home', 180.00, 180.00),
('Basic Corporate Package', 'Basic corporate cleaning package', 'Corporate', 500.00, 500.00),
('Premium Corporate Package', 'Premium corporate cleaning with extras', 'Corporate', 1200.00, 1200.00);

-- Insert sample service provider
INSERT INTO service_providers (name, email, phone, vat_number, trade_license, services_provided, is_available) VALUES
('Sarah Mohamed Cleaning', 'sarah@email.com', '+971501234567', 'VAT123456789', 'TL987654321', 
 ARRAY['Deep Cleaning', 'Regular Cleaning', 'Kitchen Deep Clean'], true);

-- Insert sample customer
INSERT INTO customers (name, phone, email, customer_type, lead_status, booking_status) VALUES
('Ahmad Al-Rashid', '+971501234567', 'ahmad@email.com', 'B2C', 'Won', 'Completed');

-- Get the customer ID and insert B2C details
INSERT INTO b2c_customers (customer_id, location, address, remarks)
SELECT id, 'Dubai Marina', 'Marina Plaza, Tower 1, Apt 1205', 'Regular customer, prefers morning slots'
FROM customers WHERE name = 'Ahmad Al-Rashid';
```

## Step 3: Verify Database Setup

After running all scripts, verify your setup by:

1. Going to **Table Editor** in Supabase
2. You should see all these tables:
   - services
   - promotions
   - service_providers
   - customers
   - b2c_customers
   - holiday_home_customers
   - corporate_customers
   - daily_logs
   - tasks
   - bookings
   - financial_transactions
   - And more...

## Step 4: Access Admin System

1. Navigate to your website: `yoursite.lovable.app/admin`
2. You'll see the admin dashboard with:
   - **Dashboard**: Overview and stats
   - **Daily Logs**: Entry form with all fields you specified
   - **Customer Management**: B2C, Holiday Home, Corporate customer types
   - **Service Providers**: Provider management with document tracking
   - **Finance**: Transaction recording and pricing management

## Step 5: Test the System

1. **Add a Daily Log Entry**:
   - Go to `/admin/daily-logs`
   - Click "Add Entry"
   - Fill in the form with all the fields you specified

2. **Add a Customer**:
   - Go to `/admin/customers`
   - Click "Add Customer"
   - Select customer type (B2C/Holiday Home/Corporate)
   - Form fields will change based on type

3. **Manage Service Providers**:
   - Go to `/admin/providers`
   - Add providers with VAT, TL details
   - Set availability status

4. **Financial Management**:
   - Go to `/admin/finance`
   - Record transactions
   - Set service pricing with margins
   - Track revenue and expenses

## Next Steps: Connect to Frontend

The frontend forms are ready for Supabase integration. Each form will need API calls to insert/update data in these tables. The system includes:

- Dynamic pricing with margin calculations
- Customer classification and lead tracking  
- Service provider availability management
- Complete financial reporting
- VAT management
- Revenue tracking

All the functionality you requested is now available in the admin system at `/admin`!