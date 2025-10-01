import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CheckCircle, Clock, Star, Shield, Zap, Users } from "lucide-react";
import { useServices } from "@/hooks/useServices";

const ProfessionalServices = () => {
  const { services: allServices, getServicesByCategory, getAddonServices, loading } = useServices();
  const homeServices = getServicesByCategory('Home');
  const addonServices = getAddonServices();

  const staticServices = [
    {
      title: "Maid Service",
      description: "Professional and reliable maid service for regular home maintenance and cleaning. AED 34/hr (without materials) or AED 45/hr (with materials).",
      image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop",
      rating: 4.7,
      duration: "Hourly",
      features: ["Regular Cleaning", "Flexible Schedule", "Trained Staff"],
      href: "/services/professional/maid-service"
    },
    {
      title: "Deep Cleaning",
      description: "Comprehensive deep cleaning service for your entire home. Apartments from AED 345, Villas from AED 745.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
      rating: 4.9,
      duration: "3-4 hours",
      features: ["Deep Kitchen Clean", "Bathroom Sanitization", "Floor Care"],
      href: "/services/professional/deep-cleaning"
    },
    {
      title: "Upholstery (Sofa) Cleaning",
      description: "Specialized cleaning for sofas and furniture. Fabric AED 30/seat, Leather AED 46/seat.",
      image: "../../../images/upholstery-cleaning.jpg",
      rating: 4.8,
      duration: "1-2 hours",
      features: ["Stain Removal", "Fabric Protection", "Quick Dry"],
      href: "/services/professional/upholstery-sofa-cleaning"
    },
    {
      title: "Carpet Cleaning",
      description: "Professional carpet cleaning service. Small (5x10ft) AED 75, Medium (8x12ft) AED 105, Large (10x15ft) AED 150.",
      image: "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=600&h=400&fit=crop",
      rating: 4.7,
      duration: "1-2 hours",
      features: ["Steam Cleaning", "Stain Treatment", "Fast Drying"],
      href: "/services/professional/carpet-cleaning"
    },
    {
      title: "Kitchen Deep Cleaning",
      description: "Thorough kitchen cleaning. Small (below 100 sq.ft) AED 170, Medium (100-200 sq.ft) AED 230, Large (above 200 sq.ft) AED 345.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
      rating: 4.8,
      duration: "2-3 hours",
      features: ["Appliance Clean", "Degreasing", "Sanitization"],
      href: "/services/professional/kitchen-deep-cleaning"
    },
    {
      title: "Bathroom Deep Cleaning",
      description: "Complete bathroom sanitization and deep cleaning. AED 170 per bathroom.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
      rating: 4.8,
      duration: "1-2 hours",
      features: ["Mold Removal", "Tile Cleaning", "Sanitization"],
      href: "/services/professional/bathroom-deep-cleaning"
    },
    {
      title: "AC Service",
      description: "Complete AC maintenance and servicing. AED 150 per AC unit.",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
      rating: 4.8,
      duration: "2-3 hours",
      features: ["Filter Replacement", "Performance Check", "Gas Top-up"],
      href: "/services/professional/ac-service"
    },
    {
      title: "AC Coil Cleaning",
      description: "Specialized AC coil cleaning to improve efficiency. AED 375 per AC unit.",
      image: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&h=400&fit=crop",
      rating: 4.7,
      duration: "1-2 hours",
      features: ["Evaporator Coil", "Condenser Coil", "Improved Efficiency"],
      href: "/services/professional/ac-coil-cleaning"
    },
    {
      title: "AC Duct Cleaning",
      description: "Professional duct cleaning to remove dust and allergens. AED 350 per AC unit.",
      image: "https://images.unsplash.com/photo-1631450002405-1ad2078e6b34?w=600&h=400&fit=crop",
      rating: 4.9,
      duration: "3-4 hours",
      features: ["Dust Removal", "Allergen Cleaning", "Better Air Quality"],
      href: "/services/professional/ac-duct-cleaning"
    },
    {
      title: "AC Duct & Coil Cleaning",
      description: "Complete AC system cleaning including both ducts and coils. AED 475 per AC unit.",
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&h=400&fit=crop",
      rating: 4.9,
      duration: "4-5 hours",
      features: ["Complete System", "Maximum Efficiency", "Health Benefits"],
      href: "/services/professional/ac-duct-coil-cleaning"
    },
    {
      title: "Pest Control",
      description: "Comprehensive pest control solutions. General pest control from AED 120, specialized treatments available.",
      image: "https://images.unsplash.com/photo-1572020525351-3ca5c5962200?w=600&h=400&fit=crop",
      rating: 4.9,
      duration: "1-2 hours",
      features: ["Safe Chemicals", "Long-lasting", "Follow-up Service"],
      href: "/services/professional/pest-control"
    },
    {
      title: "Painting",
      description: "Professional interior and exterior painting. Apartments from AED 600, Villas from AED 1,450.",
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop",
      rating: 4.8,
      duration: "1-3 days",
      features: ["Premium Paints", "Surface Preparation", "Clean Finish"],
      href: "/services/professional/painting"
    },
    {
      title: "Packers & Movers",
      description: "Professional packing and moving services. Dubai: Studio from AED 743, Abu Dhabi: Studio from AED 1,229.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      rating: 4.7,
      duration: "4-8 hours",
      features: ["Safe Packing", "Insured", "Timely Delivery"],
      href: "/services/professional/packers-movers"
    },
    {
      title: "Handyman Services",
      description: "Professional handyman services for all your home repair needs. AED 150 per hour.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
      rating: 4.8,
      duration: "Hourly",
      features: ["Expert Technicians", "All Repairs", "Flexible Scheduling"],
      href: "/services/professional/handyman"
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Professional Services</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Professional Services
          </Badge>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Professional Home Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive home maintenance and cleaning services delivered by trained professionals 
            with guaranteed quality and satisfaction.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {staticServices.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-primary rounded-2xl text-white p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            Need a Custom Service Package?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Combine multiple services or create a custom maintenance plan for your home. 
            Our team will work with you to create the perfect solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
              Get Custom Quote
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Call for Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalServices;