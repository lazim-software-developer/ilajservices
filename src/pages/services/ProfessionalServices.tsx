import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UpdatedServiceCard from "@/components/UpdatedServiceCard";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { getProfessionalServices } from "@/services/api";
import type { Service } from "@/services/api";

const ProfessionalServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await getProfessionalServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

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
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted h-48 rounded-t-lg"></div>
                <div className="bg-muted/50 h-32 rounded-b-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {services.map((service, index) => (
              <UpdatedServiceCard 
                key={service.id || index} 
                id={service.id}
                title={service.name}
                description={service.description}
                image={service.image}
                price={`AED ${service.basePrice}`}
                duration={service.duration}
                features={service.features}
                href={`/booking/${service.id}`}
                serviceType={service.serviceType}
                customerType="B2C"
              />
            ))}
          </div>
        )}

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