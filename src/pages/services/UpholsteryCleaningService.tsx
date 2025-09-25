import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CheckCircle, Shield, Clock, Award } from "lucide-react";
import AddOnServicesModal from "@/components/AddOnServicesModal";

const UpholsteryCleaningService = () => {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const handleAddOnsChange = (addOns: string[]) => {
    setSelectedAddOns(addOns);
  };

  const mainService = {
    name: "Upholstery (Sofa) Cleaning",
    price: 100,
    duration: "1-2 hours",
    description: "Specialized cleaning for sofas and furniture using advanced stain removal techniques.",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop",
    features: [
      "Advanced stain removal techniques",
      "Fabric protection treatment",
      "Quick-dry technology",
      "Safe for all fabric types",
      "Professional equipment",
      "Pre-treatment assessment"
    ],
    benefits: [
      "Removes tough stains and odors",
      "Extends furniture lifespan", 
      "Allergen removal",
      "Color restoration"
    ]
  };

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
              <BreadcrumbLink href="/services/professional">Professional Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Upholstery Cleaning</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              Professional Service
            </Badge>
            <h1 className="text-3xl lg:text-5xl font-bold text-primary mb-6">
              {mainService.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {mainService.description}
            </p>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{mainService.duration}</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                AED {mainService.price}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary-hover">
                Book Now - AED {mainService.price}
              </Button>
              <AddOnServicesModal
                mainService={mainService.name}
                customerType="B2C"
                selectedAddOns={selectedAddOns}
                onAddOnsChange={handleAddOnsChange}
              >
                <Button size="lg" variant="outline">
                  Add Extra Services
                </Button>
              </AddOnServicesModal>
            </div>
            
            {selectedAddOns.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                {selectedAddOns.length} add-on service{selectedAddOns.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
          
          <div>
            <img 
              src={mainService.image}
              alt={mainService.name}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {mainService.features.map((feature, index) => (
            <Card key={index} className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Service Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {mainService.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-primary rounded-2xl text-white p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Book your {mainService.name} service today and give your furniture 
            the professional care it deserves.
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
            Book Service Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpholsteryCleaningService;