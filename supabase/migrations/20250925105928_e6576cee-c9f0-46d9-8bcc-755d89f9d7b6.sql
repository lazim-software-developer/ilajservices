-- Create services table for dynamic pricing and service management
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_minutes INTEGER DEFAULT 60,
  image_url TEXT,
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_addon BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  customer_type TEXT DEFAULT 'individual' CHECK (customer_type IN ('individual', 'corporate', 'holiday_home')),
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create promo codes table
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  applicable_services UUID[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id),
  addon_services UUID[],
  booking_date DATE NOT NULL,
  booking_time TIME,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  promo_code_id UUID REFERENCES public.promo_codes(id),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enquiries table
CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT,
  location TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  assigned_to TEXT,
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create seasonal offers table
CREATE TABLE public.seasonal_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage DECIMAL(5,2),
  applicable_services UUID[],
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_offers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to services and offers
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active seasonal offers" ON public.seasonal_offers FOR SELECT USING (is_active = true);

-- Create policies for customers (users can only access their own data)
CREATE POLICY "Users can view their own customer data" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Users can insert customer data" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own customer data" ON public.customers FOR UPDATE USING (true);

-- Create policies for bookings
CREATE POLICY "Users can view bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update bookings" ON public.bookings FOR UPDATE USING (true);

-- Create policies for enquiries
CREATE POLICY "Users can view enquiries" ON public.enquiries FOR SELECT USING (true);
CREATE POLICY "Users can create enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update enquiries" ON public.enquiries FOR UPDATE USING (true);

-- Create policies for promo codes (public read for validation)
CREATE POLICY "Anyone can view active promo codes" ON public.promo_codes FOR SELECT USING (is_active = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON public.promo_codes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seasonal_offers_updated_at BEFORE UPDATE ON public.seasonal_offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default services data
INSERT INTO public.services (name, description, category, base_price, duration_minutes, features, is_addon) VALUES
-- Main services
('Home Deep Cleaning Service', 'Complete deep cleaning of your entire home including all rooms, kitchen, bathrooms, and common areas', 'professional', 150.00, 180, ARRAY['Complete home sanitization', 'Kitchen deep cleaning', 'Bathroom cleaning', 'Dusting and vacuuming'], false),
('Office Deep Cleaning', 'Professional deep cleaning service for offices and commercial spaces', 'professional', 200.00, 240, ARRAY['Workstation cleaning', 'Common area sanitization', 'Restroom deep cleaning', 'Floor care'], false),
('Move-in/Move-out Cleaning', 'Comprehensive cleaning service for property transitions', 'professional', 180.00, 200, ARRAY['Deep sanitization', 'Appliance cleaning', 'Wall and baseboard cleaning', 'Window cleaning'], false),
('Post-Construction Cleanup', 'Specialized cleaning after construction or renovation work', 'professional', 250.00, 300, ARRAY['Dust removal', 'Paint splatter cleanup', 'Window cleaning', 'Debris removal'], false),
('Event Cleanup Service', 'Quick and efficient cleanup after parties and events', 'professional', 120.00, 120, ARRAY['Party cleanup', 'Furniture rearrangement', 'Floor cleaning', 'Trash removal'], false),

-- Corporate services
('Corporate Cleaning Package', 'Regular cleaning service for corporate offices', 'corporate', 300.00, 240, ARRAY['Daily cleaning', 'Sanitization', 'Waste management', 'Restroom maintenance'], false),
('Industrial Cleaning', 'Heavy-duty cleaning for industrial facilities', 'corporate', 500.00, 360, ARRAY['Equipment cleaning', 'Floor scrubbing', 'Safety compliance', 'Specialized chemicals'], false),

-- Holiday home services
('Holiday Home Maintenance', 'Complete maintenance service for vacation properties', 'holiday_home', 400.00, 300, ARRAY['Property inspection', 'Cleaning service', 'Minor repairs', 'Garden maintenance'], false),
('Pre-Arrival Preparation', 'Preparing holiday homes for guest arrivals', 'holiday_home', 200.00, 180, ARRAY['Deep cleaning', 'Linen service', 'Restocking supplies', 'Final inspection'], false),

-- Add-on services
('Pest Control', 'Professional pest control and prevention service', 'addon', 80.00, 90, ARRAY['Inspection', 'Treatment', 'Prevention', 'Follow-up'], true),
('Upholstery (Sofa) Cleaning', 'Deep cleaning service for sofas and upholstered furniture', 'addon', 60.00, 60, ARRAY['Stain removal', 'Deep cleaning', 'Fabric protection', 'Sanitization'], true),
('Carpet Cleaning', 'Professional carpet and rug cleaning service', 'addon', 70.00, 75, ARRAY['Deep cleaning', 'Stain removal', 'Deodorizing', 'Quick drying'], true),
('Kitchen Deep Cleaning', 'Specialized deep cleaning service for kitchens', 'addon', 90.00, 120, ARRAY['Appliance cleaning', 'Grease removal', 'Cabinet cleaning', 'Sanitization'], true),
('Bathroom Deep Cleaning', 'Thorough deep cleaning service for bathrooms', 'addon', 50.00, 60, ARRAY['Tile cleaning', 'Grout cleaning', 'Fixture polishing', 'Sanitization'], true);

-- Insert sample promo codes
INSERT INTO public.promo_codes (code, description, discount_type, discount_value, min_order_amount, usage_limit, valid_until) VALUES
('WELCOME10', 'Welcome discount for new customers', 'percentage', 10.00, 100.00, 100, now() + interval '3 months'),
('SUMMER25', 'Summer seasonal discount', 'percentage', 25.00, 200.00, 50, now() + interval '2 months'),
('FIRST50', 'Fixed discount for first-time users', 'fixed', 50.00, 150.00, 200, now() + interval '6 months');

-- Insert sample seasonal offers
INSERT INTO public.seasonal_offers (title, description, discount_percentage, valid_until) VALUES
('Spring Cleaning Special', 'Get 20% off on all deep cleaning services this spring', 20.00, now() + interval '3 months'),
('Holiday Home Prep Offer', 'Special discount on holiday home preparation services', 15.00, now() + interval '2 months');