import { useParams } from "react-router-dom";
import GamifiedServiceBooking from "@/components/GamifiedServiceBooking";
import CorporateServiceBooking from "@/components/CorporateServiceBooking";

const ServiceBooking = () => {
  const { serviceId } = useParams();

  // Mock service data - in real app, this would come from API based on serviceId
  const getServiceData = (serviceId: string) => {
    const services = {
      "maid-service": {
        title: "Maid Service",
        description: "Professional and reliable maid service for regular home maintenance and cleaning.",
        basePrice: 34,
        image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop",
        duration: "1-12 hours",
        category: "Professional Service",
        serviceType: "maid-service"
      },
      "deep-cleaning": {
        title: "Deep Cleaning Service",
        description: "Complete deep cleaning for your home with professional equipment and eco-friendly products.",
        basePrice: 345,
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
        duration: "3-4 hours",
        category: "Professional Service",
        serviceType: "deep-cleaning"
      },
      "upholstery-cleaning": {
        title: "Upholstery (Sofa) Cleaning",
        description: "Professional sofa and upholstery cleaning service with fabric and leather care options.",
        basePrice: 30,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
        duration: "1-2 hours",
        category: "Professional Service",
        serviceType: "upholstery-cleaning"
      },
      "carpet-cleaning": {
        title: "Carpet Cleaning",
        description: "Deep carpet cleaning service for all carpet sizes and types.",
        basePrice: 75,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        duration: "1-2 hours",
        category: "Professional Service",
        serviceType: "carpet-cleaning"
      },
      "mattress-cleaning": {
        title: "Mattress Cleaning",
        description: "Professional mattress cleaning and sanitization service.",
        basePrice: 115,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
        duration: "1-2 hours",
        category: "Professional Service",
        serviceType: "mattress-cleaning"
      },
      "kitchen-deep-cleaning": {
        title: "Kitchen Deep Cleaning",
        description: "Comprehensive kitchen deep cleaning service for all kitchen sizes.",
        basePrice: 170,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
        duration: "2-3 hours",
        category: "Professional Service",
        serviceType: "kitchen-deep-cleaning"
      },
      "bathroom-deep-cleaning": {
        title: "Bathroom Deep Cleaning",
        description: "Professional bathroom deep cleaning and sanitization service.",
        basePrice: 170,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
        duration: "1-2 hours",
        category: "Professional Service",
        serviceType: "bathroom-deep-cleaning"
      },
      "ac-service": {
        title: "AC Service",
        description: "Complete air conditioning maintenance and servicing.",
        basePrice: 150,
        image: "https://images.unsplash.com/photo-1631545806606-96de675bad51?w=600&h=400&fit=crop",
        duration: "1-2 hours",
        category: "Professional Service",
        serviceType: "ac-service"
      },
      "ac-coil-cleaning": {
        title: "AC Coil Cleaning",
        description: "Professional AC coil cleaning service for optimal performance.",
        basePrice: 375,
        image: "https://images.unsplash.com/photo-1631545806606-96de675bad51?w=600&h=400&fit=crop",
        duration: "1-2 hours",
        category: "Professional Service",
        serviceType: "ac-coil-cleaning"
      },
      "ac-duct-cleaning": {
        title: "AC Duct Cleaning",
        description: "Professional AC duct cleaning and sanitization service.",
        basePrice: 350,
        image: "https://images.unsplash.com/photo-1631545806606-96de675bad51?w=600&h=400&fit=crop",
        duration: "2-3 hours",
        category: "Professional Service",
        serviceType: "ac-duct-cleaning"
      },
      "ac-duct-coil-cleaning": {
        title: "AC Duct & Coil Cleaning",
        description: "Combined AC duct and coil cleaning service for complete maintenance.",
        basePrice: 475,
        image: "https://images.unsplash.com/photo-1631545806606-96de675bad51?w=600&h=400&fit=crop",
        duration: "2-4 hours",
        category: "Professional Service",
        serviceType: "ac-duct-coil-cleaning"
      },
      "pest-control": {
        title: "Pest Control",
        description: "Comprehensive pest control services including general, mosquito, bedbug, and rodent control.",
        basePrice: 120,
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
        duration: "1-2 hours",
        category: "Professional Service",
        serviceType: "pest-control"
      },
      "painting": {
        title: "Painting Service",
        description: "Professional painting services for apartments and villas.",
        basePrice: 600,
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
        duration: "1-3 days",
        category: "Professional Service",
        serviceType: "painting"
      },
      "packers-movers": {
        title: "Packers & Movers",
        description: "Professional packing and moving services for Dubai and Abu Dhabi regions.",
        basePrice: 743,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        duration: "4-8 hours",
        category: "Professional Service",
        serviceType: "packers-movers"
      },
      "handyman": {
        title: "Handyman Service",
        description: "Professional handyman services for home repairs and maintenance.",
        basePrice: 150,
        image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop",
        duration: "Per hour",
        category: "Professional Service",
        serviceType: "handyman"
      },
      // Corporate Services
      "basic-package": {
        title: "Basic Package",
        description: "Essential office cleaning service - 4 visits per month with 2 hours per visit for comprehensive office maintenance.",
        basePrice: 272,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
        duration: "2 hours per visit",
        category: "Corporate Service",
        serviceType: "basic-package"
      },
      "essential-package": {
        title: "Essential Package", 
        description: "Complete cleaning with AC maintenance - Monthly cleaning service plus quarterly AC servicing for optimal office environment.",
        basePrice: 256,
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop",
        duration: "2 hours cleaning + AC service",
        category: "Corporate Service",
        serviceType: "essential-package"
      },
      "comprehensive-package": {
        title: "Comprehensive Package",
        description: "All-inclusive facility management - Complete cleaning, AC maintenance, pest control, and duct cleaning for total office care.",
        basePrice: 240,
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop", 
        duration: "Complete facility management",
        category: "Corporate Service",
        serviceType: "comprehensive-package"
      },
      // Holiday Home Services
      "one-time-cleaning": {
        title: "One-Time Cleaning",
        description: "One-time Service - Professional holiday home cleaning with premium after-cleaning air fragrance.",
        basePrice: 180,
        image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop",
        duration: "2-3 hours",
        category: "Holiday Home Service",
        serviceType: "one-time-cleaning"
      },
      "basic-pack": {
        title: "Basic Pack",
        description: "5 cleaning Service - Check-out cleanings with flexible scheduling and special price for additional services.",
        basePrice: 500,
        image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop",
        duration: "Valid for 6 months",
        category: "Holiday Home Service",
        serviceType: "basic-pack"
      },
      "mid-pack": {
        title: "Mid Pack",
        description: "10 cleaning Service - Check-out cleanings with dedicated account manager and special pricing.",
        basePrice: 900,
        image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop",
        duration: "Valid for 6 months",
        category: "Holiday Home Service",
        serviceType: "mid-pack"
      }
    };

    return services[serviceId as keyof typeof services] || services["deep-cleaning"];
  };

  const serviceData = getServiceData(serviceId || "deep-cleaning");

  // Check if this is a corporate service
  const isCorporateService = ['basic-package', 'essential-package', 'comprehensive-package'].includes(serviceId || '');
  
  // Check if this is a holiday home service
  const isHolidayHomeService = ['one-time-cleaning', 'basic-pack', 'mid-pack'].includes(serviceId || '');

  if (isCorporateService) {
    return <CorporateServiceBooking serviceData={serviceData} />;
  }
  
  if (isHolidayHomeService) {
    return <GamifiedServiceBooking serviceData={serviceData} />;
  }

  return <GamifiedServiceBooking serviceData={serviceData} />;
};

export default ServiceBooking;