import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
  image: string;
  duration: string;
  features: string[];
  isActive: boolean;
  serviceType?: string;
}

export interface AddOnService {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  isActive: boolean;
}

// Service data - will be moved to database later
const mockServices: Service[] = [
  {
    id: "maid-service",
    name: "Maid Service", 
    category: "Professional Home Service",
    basePrice: 80,
    description: "Professional and reliable maid service for regular home maintenance and cleaning.",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop",
    duration: "2-6 hours",
    features: ["Regular Cleaning", "Flexible Schedule", "Trained Staff"],
    isActive: true,
    serviceType: "maid-service"
  },
  {
    id: "deep-cleaning",
    name: "Deep Cleaning",
    category: "Professional Home Service", 
    basePrice: 150,
    description: "Comprehensive deep cleaning service for your entire home using professional equipment.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    duration: "3-4 hours",
    features: ["Deep Kitchen Clean", "Bathroom Sanitization", "Floor Care"],
    isActive: true,
    serviceType: "deep-cleaning"
  },
  {
    id: "upholstery-sofa-cleaning",
    name: "Upholstery (Sofa) Cleaning",
    category: "Professional Home Service",
    basePrice: 100,
    description: "Specialized cleaning for sofas and furniture using advanced stain removal techniques.",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
    duration: "1-2 hours", 
    features: ["Stain Removal", "Fabric Protection", "Quick Dry"],
    isActive: true,
    serviceType: "upholstery-sofa-cleaning"
  },
  {
    id: "carpet-cleaning",
    name: "Carpet Cleaning",
    category: "Professional Home Service",
    basePrice: 80,
    description: "Professional carpet cleaning service to remove deep stains and restore carpet freshness.",
    image: "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=600&h=400&fit=crop",
    duration: "1-2 hours",
    features: ["Steam Cleaning", "Stain Treatment", "Fast Drying"],
    isActive: true,
    serviceType: "carpet-cleaning"
  },
  {
    id: "kitchen-deep-cleaning",
    name: "Kitchen Deep Cleaning",
    category: "Professional Home Service",
    basePrice: 120,
    description: "Thorough kitchen cleaning including appliances, cabinets, and deep degreasing.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    duration: "2-3 hours",
    features: ["Appliance Clean", "Degreasing", "Sanitization"],
    isActive: true,
    serviceType: "kitchen-deep-cleaning"
  },
  {
    id: "bathroom-deep-cleaning", 
    name: "Bathroom Deep Cleaning",
    category: "Professional Home Service",
    basePrice: 100,
    description: "Complete bathroom sanitization and deep cleaning with mold and mildew removal.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
    duration: "1-2 hours",
    features: ["Mold Removal", "Tile Cleaning", "Sanitization"],
    isActive: true,
    serviceType: "bathroom-deep-cleaning"
  },
  {
    id: "ac-service",
    name: "AC Service", 
    category: "Professional Home Service",
    basePrice: 120,
    description: "Complete AC maintenance including cleaning, filter replacement, and performance check.",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
    duration: "2-3 hours",
    features: ["Filter Replacement", "Performance Check", "Gas Top-up"],
    isActive: true,
    serviceType: "ac-service"
  },
  {
    id: "pest-control",
    name: "Pest Control",
    category: "Professional Home Service",
    basePrice: 200,
    description: "Comprehensive pest control solutions to eliminate and prevent pest infestations.",
    image: "https://images.unsplash.com/photo-1572020525351-3ca5c5962200?w=600&h=400&fit=crop",
    duration: "1-2 hours",
    features: ["Safe Chemicals", "Long-lasting", "Follow-up Service"],
    isActive: true,
    serviceType: "pest-control"
  }
];

// Add-on services data
const mockAddOnServices: AddOnService[] = [
  {
    id: "pest-control",
    name: "Pest Control", 
    price: 200,
    description: "Comprehensive pest control solutions to eliminate and prevent pest infestations",
    category: "Maintenance",
    isActive: true
  },
  {
    id: "upholstery-sofa-cleaning",
    name: "Upholstery (Sofa) Cleaning",
    price: 100,
    description: "Specialized cleaning for sofas and furniture using advanced stain removal techniques",
    category: "Cleaning",
    isActive: true
  },
  {
    id: "carpet-cleaning", 
    name: "Carpet Cleaning",
    price: 80,
    description: "Professional carpet cleaning service to remove deep stains and restore carpet freshness",
    category: "Cleaning",
    isActive: true
  },
  {
    id: "kitchen-deep-cleaning",
    name: "Kitchen Deep Cleaning",
    price: 120,
    description: "Thorough kitchen cleaning including appliances, cabinets, and deep degreasing",
    category: "Cleaning",
    isActive: true
  },
  {
    id: "bathroom-deep-cleaning",
    name: "Bathroom Deep Cleaning",
    price: 100,
    description: "Complete bathroom sanitization and deep cleaning with mold and mildew removal",
    category: "Cleaning", 
    isActive: true
  }
];

// API functions (currently using mock data, will connect to Supabase later)
export const getServices = async (): Promise<Service[]> => {
  // TODO: Replace with actual Supabase query
  // const { data, error } = await supabase.from('services').select('*').eq('isActive', true);
  return mockServices.filter(service => service.isActive);
};

export const getServicesByCategory = async (category: string): Promise<Service[]> => {
  // TODO: Replace with actual Supabase query  
  // const { data, error } = await supabase.from('services').select('*').eq('category', category).eq('isActive', true);
  return mockServices.filter(service => service.category === category && service.isActive);
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  // TODO: Replace with actual Supabase query
  // const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
  return mockServices.find(service => service.id === id) || null;
};

export const getAddOnServices = async (): Promise<AddOnService[]> => {
  // TODO: Replace with actual Supabase query
  // const { data, error } = await supabase.from('addon_services').select('*').eq('isActive', true);
  return mockAddOnServices.filter(addon => addon.isActive);
};

export const getProfessionalServices = async (): Promise<Service[]> => {
  return getServicesByCategory("Professional Home Service");
};

export const getHolidayHomeServices = async (): Promise<Service[]> => {
  return getServicesByCategory("Holiday Home");
};

export const getCorporateServices = async (): Promise<Service[]> => {
  return getServicesByCategory("Corporate Solution");
};

// Service categories for navigation
export const getServiceCategories = () => {
  return [
    {
      title: "Professional Home Service",
      href: "/services/professional",
      description: "Comprehensive home maintenance and cleaning services"
    },
    {
      title: "Holiday Home",
      href: "/services/holiday-home", 
      description: "Specialized cleaning for holiday properties"
    },
    {
      title: "Corporate Solution",
      href: "/services/corporate",
      description: "Professional cleaning for offices and commercial spaces"
    }
  ];
};