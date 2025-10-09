-- Populate services table with current website services
INSERT INTO public.services (name, category, description, base_price, duration_minutes, features, image_url, is_active, is_addon) VALUES

-- Home Services
('Deep Cleaning Service', 'Home', 'Complete deep cleaning for your home with professional equipment and eco-friendly products.', 150, 240, ARRAY['Deep Kitchen Clean', 'Bathroom Sanitization', 'Floor Care'], '/lovable-uploads/130a581b-75f6-44d1-a316-42881950a64e.webp', true, false),
('Pest Control Service', 'Home', 'Comprehensive pest control solutions to keep your home safe and pest-free.', 200, 120, ARRAY['Safe Chemicals', 'Long-lasting', 'Follow-up Service'], '/lovable-uploads/9470a896-617e-4470-8f48-1b686adc6cc3.webp', true, false),
('AC Duct Cleaning', 'Home', 'Professional AC duct cleaning service for improved air quality and system efficiency.', 250, 180, ARRAY['Deep Duct Clean', 'Improved Air Quality', 'System Efficiency'], '/lovable-uploads/ac_duct_cleaning_ilaj.webp', true, false),

-- Corporate Services  
('Office Deep Cleaning', 'Corporate', 'Comprehensive deep cleaning service for office spaces and commercial buildings.', 500, 480, ARRAY['Sanitization', 'Floor Care', 'Workspace Cleaning'], '/lovable-uploads/00d8abb5-8a1c-40c2-87ee-3aa6583cf8cf.webp', true, false),
('Corporate Maintenance', 'Corporate', 'Regular maintenance and upkeep services for corporate facilities.', 800, 360, ARRAY['Preventive Maintenance', 'Emergency Support', 'Scheduled Service'], '/lovable-uploads/9c656186-628c-46d9-b263-7e372f0a8bf7.webp', true, false),
('Facility Management', 'Corporate', 'Complete facility management solutions for businesses and offices.', 1200, 480, ARRAY['24/7 Support', 'Multi-service', 'Professional Team'], '/lovable-uploads/78a49ba5-8cb9-40d9-b04e-d409d61b4935.webp', true, false),

-- Holiday Home Services
('Holiday Home Cleaning', 'Holiday Home', 'Specialized cleaning service for vacation rentals and holiday homes.', 300, 300, ARRAY['Guest Turnover', 'Deep Clean', 'Linen Service'], '/lovable-uploads/painting.webp', true, false),
('Property Management', 'Holiday Home', 'Complete property management for holiday homes and vacation rentals.', 600, 240, ARRAY['Key Management', 'Maintenance', 'Guest Support'], '/lovable-uploads/f44c00a2-be13-45d3-a1f6-b197c16afabb.webp', true, false),
('Maintenance Service', 'Holiday Home', 'Regular maintenance and repair services for holiday properties.', 400, 180, ARRAY['Plumbing', 'Electrical', 'General Repairs'], '/lovable-uploads/5a4a612f-8971-4ca5-b85c-298b721a9f60.webp', true, false),

-- Add-on Services
('Carpet Cleaning', 'Add-on', 'Professional carpet and upholstery cleaning service.', 80, 60, ARRAY['Steam Clean', 'Stain Removal', 'Odor Treatment'], NULL, true, true),
('Window Cleaning', 'Add-on', 'Interior and exterior window cleaning service.', 60, 45, ARRAY['Streak-free', 'Safety Equipment', 'High-rise capable'], NULL, true, true),
('Appliance Cleaning', 'Add-on', 'Deep cleaning for kitchen and household appliances.', 50, 30, ARRAY['Oven Cleaning', 'Fridge Clean', 'Dishwasher Service'], NULL, true, true),
('Garden Maintenance', 'Add-on', 'Basic garden and outdoor area maintenance.', 120, 90, ARRAY['Lawn Care', 'Plant Maintenance', 'Outdoor Cleaning'], NULL, true, true),
('Pressure Washing', 'Add-on', 'High-pressure cleaning for outdoor surfaces and driveways.', 100, 60, ARRAY['Driveway Clean', 'Patio Washing', 'Exterior Walls'], NULL, true, true);