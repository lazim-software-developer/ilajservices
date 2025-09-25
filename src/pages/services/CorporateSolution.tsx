import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Building, Users, Shield, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const CorporateSolution = () => {
  const navigate = useNavigate();
  const cleaningPackages = [
    {
      id: "basic-package",
      title: "Basic Package",
      subtitle: "Cleaning Only",
      price: "AED 272.00",
      frequency: "Monthly",
      description: "Essential office cleaning service - 4 visits per month",
      features: [
        "2 hours cleaning per visit",
        "4 visits per month (weekly)",
        "Desk & surface cleaning",
        "Trash removal & emptying",
        "Vacuum carpeted areas",
        "Basic restroom cleaning",
        "Kitchen area tidying",
        "Floor mopping"
      ],
      ideal: "Small offices up to 1000 sq ft",
      baseOfficeSize: "1000 SQ.FT"
    },
    {
      id: "essential-package", 
      title: "Essential Package",
      subtitle: "Cleaning + AC Maintenance",
      price: "AED 256.00",
      frequency: "Monthly + Quarterly AC",
      description: "Complete cleaning with AC maintenance service",
      features: [
        "All Basic Package services",
        "2 hours cleaning per visit",
        "4 visits per month (weekly)",
        "AC Servicing (4 times yearly)",
        "Visit every 3 months",
        "AED 150.00 per AC unit",
        "Filters & grills cleaning",
        "Thermostat checking"
      ],
      ideal: "Medium offices with AC systems",
      popular: true,
      baseOfficeSize: "1000 SQ.FT"
    },
    {
      id: "comprehensive-package",
      title: "Comprehensive Package", 
      subtitle: "Cleaning + AC + Pest Control + Duct Cleaning",
      price: "AED 240.00",
      frequency: "Complete facility management",
      description: "All-inclusive facility management solution",
      features: [
        "All Essential Package services",
        "2 hours cleaning per visit",
        "4 visits per month (weekly)",
        "AC Servicing (4 times yearly)", 
        "AED 150.00 per AC unit",
        "Pest Control (2 times yearly)",
        "AED 420.00 per year",
        "AC Duct Cleaning (yearly)",
        "AED 250.00 per unit"
      ],
      ideal: "Large corporate offices",
      baseOfficeSize: "1000 SQ.FT"
    }
  ];

  const otherServices = [
    {
      title: "Post-Construction Cleanup",
      price: "AED 20/m²",
      description: "Complete cleanup after construction or renovation work"
    },
    {
      title: "Event Cleaning",
      price: "AED 500-2000",
      description: "Pre and post-event cleaning services for corporate functions"
    },
    {
      title: "Carpet & Upholstery Maintenance",
      price: "AED 15/m²",
      description: "Professional carpet cleaning and upholstery maintenance"
    },
    {
      title: "High-Rise Window Cleaning",
      price: "AED 25/window",
      description: "Specialized window cleaning for high-rise buildings"
    },
    {
      title: "Sanitization & Disinfection",
      price: "AED 10/m²",
      description: "Professional disinfection services for health safety"
    },
    {
      title: "Facility Management",
      price: "Custom Quote",
      description: "Complete facility management and maintenance solutions"
    }
  ];

  const addOnServices = [
    { name: "Supply Restocking", price: "AED 100/month", description: "Toilet paper, hand soap, sanitizers" },
    { name: "Pantry Management", price: "AED 200/month", description: "Coffee, tea, snacks restocking" },
    { name: "Plant Care Service", price: "AED 150/month", description: "Indoor plant watering and care" },
    { name: "Floor Waxing", price: "AED 8/m²", description: "Quarterly floor waxing and polishing" },
    { name: "Pest Control", price: "AED 300/visit", description: "Monthly pest control treatment" },
    { name: "Deep Sanitization", price: "AED 12/m²", description: "Medical-grade sanitization service" }
  ];

  const corporateFeatures = [
    {
      icon: Building,
      title: "Corporate Expertise",
      description: "Specialized in office environments with understanding of business operations"
    },
    {
      icon: Users,
      title: "Trained Teams", 
      description: "Professional staff trained in corporate etiquette and confidentiality"
    },
    {
      icon: Shield,
      title: "Insured & Bonded",
      description: "Full insurance coverage and bonded staff for your peace of mind"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Work around your business hours with minimal disruption"
    }
  ];

  const pricingFactors = [
    "Square footage of the facility",
    "Frequency of service (daily, weekly, monthly)",
    "Type and complexity of cleaning required",
    "Number of restrooms and common areas",
    "Special requirements (medical facilities, food service)",
    "Location and accessibility of the building"
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
              <BreadcrumbPage>Corporate Solution</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Corporate Solutions
          </Badge>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Professional Corporate Cleaning
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive cleaning and facility management solutions for offices, corporate buildings, 
            and commercial spaces. Maintain a professional environment that impresses clients and employees.
          </p>
        </div>

        {/* Corporate Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {corporateFeatures.map((feature, index) => (
            <Card key={index} className="text-center group hover:shadow-medium transition-all duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cleaning Packages */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Cleaning Packages</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {cleaningPackages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-primary shadow-medium scale-105' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.title}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{pkg.price}</div>
                  <p className="text-sm text-muted-foreground">{pkg.frequency}</p>
                  <p className="text-sm">{pkg.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">{pkg.ideal}</Badge>
                  </div>
                  <Button 
                    className={`w-full ${pkg.popular ? 'bg-primary hover:bg-primary-hover' : 'bg-secondary hover:bg-secondary-hover'}`}
                    onClick={() => navigate(`/services/corporate/${pkg.id}`)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Other Services */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Other Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.map((service, index) => (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{service.title}</h3>
                    <Badge variant="outline" className="text-xs">{service.price}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Add-On Services */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Add-On Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOnServices.map((addon, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{addon.name}</h4>
                  <p className="text-xs text-muted-foreground">{addon.description}</p>
                </div>
                <Badge className="bg-secondary text-secondary-foreground ml-2">{addon.price}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Information */}
        <Card className="mb-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              Important Pricing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Pricing is based on several factors:</h4>
              <ul className="space-y-2">
                {pricingFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Contract Terms:</h4>
              <ul className="text-sm space-y-1">
                <li>• Minimum 6-month contract for regular services</li>
                <li>• Flexible payment terms available</li>
                <li>• 30-day notice for service modifications</li>
                <li>• Custom pricing for large facilities (10,000+ sq ft)</li>
              </ul>
            </div>
            
            <div className="text-center">
              <Button size="lg" className="bg-gradient-primary hover:bg-primary-hover">
                Request Detailed Quote
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Corporate Clients Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                "ILAJ has transformed our office environment. Professional, reliable, and always exceeding expectations."
              </p>
              <div>
                <p className="font-semibold">Sarah Al-Mahmoud</p>
                <p className="text-xs text-muted-foreground">Facility Manager, Tech Corp Dubai</p>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                "The attention to detail and flexibility with our schedule makes ILAJ our preferred cleaning partner."
              </p>
              <div>
                <p className="font-semibold">Ahmed Hassan</p>
                <p className="text-xs text-muted-foreground">Operations Director, Finance Plus</p>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                "Excellent service quality and competitive pricing. Our employees love the clean work environment."
              </p>
              <div>
                <p className="font-semibold">Maria Rodriguez</p>
                <p className="text-xs text-muted-foreground">HR Manager, Global Solutions</p>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-primary rounded-2xl text-white p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            Ready to Elevate Your Workplace?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Create a professional environment that impresses clients and boosts employee morale. 
            Let our corporate cleaning experts handle the details while you focus on your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
              Schedule Site Visit
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Get Custom Proposal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateSolution;
