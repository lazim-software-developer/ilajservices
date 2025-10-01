import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, Shield, Clock } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const HolidayHome = () => {
  const packages = [
    {
      title: "One-Time Cleaning",
      price: "180",
      subtitle: "One-time Service",
      features: [
        "Valid for 6 months",
        "Flexible scheduling",
        "Special Price for Additional Services"
      ],
      href: "/services/holiday-home/booking?package=onetime"
    },
    {
      title: "Basic Pack",
      price: "750",
      subtitle: "5 cleaning Service",
      features: [
        "Valid for 6 months",
        "Flexible scheduling",
        "Special Price for Additional Services"
      ],
      href: "/services/holiday-home/booking?package=basic"
    },
    {
      title: "Mid Pack",
      price: "1,200",
      subtitle: "10 cleaning Service",
      features: [
        "Valid for 6 months",
        "Flexible scheduling",
        "Dedicated account manager",
        "Special Price for additional Services"
      ],
      href: "/services/holiday-home/booking?package=mid"
    }
  ];

  const whatsIncluded = [
    "Complete cleaning with professional materials and equipment",
    "Premium after-cleaning air fragrance",
    "Linen & amenities setup (provided by the holiday home operator)",
    "Unit inspection with a detailed report",
    "Before, during, and after cleaning photos for records"
  ];

  const termsConditions = [
    "Bookings must be made at least 24 hours in advance",
    "Linen and amenities to be provided by the customer",
    "Full payment required before service delivery",
    "Any service-related issues must be reported within 24 hours of completion"
  ];

  const sopSteps = [
    {
      title: "Pre-Cleaning Preparation",
      subtitle: "Complete turnover cleaning between guests",
      items: [
        "Confirm booking and service scope",
        "Gather all cleaning supplies and equipment", 
        "Inspect property condition before starting"
      ]
    },
    {
      title: "Cleaning Execution", 
      subtitle: "Ongoing maintenance and upkeep",
      items: [
        "Dusting, vacuuming, and mopping of all rooms",
        "Deep cleaning of kitchen and bathrooms",
        "Glass, mirror, and surface polishing",
        "Trash removal and disposal"
      ]
    },
    {
      title: "Linen & Amenities Setup",
      subtitle: "",
      items: [
        "Bed-making with fresh linen (provided by operator)",
        "Placement of towels and amenities as per checklist",
        "Arrangement of living area to guest-ready standards"
      ]
    },
    {
      title: "Finishing Touches",
      subtitle: "",
      items: [
        "Application of premium air fragrance",
        "Final inspection of all rooms for quality assurance",
        "Capturing \"after-cleaning\" photos for reporting"
      ]
    },
    {
      title: "Post-Service Reporting",
      subtitle: "",
      items: [
        "Detailed housekeeping report with before & after images",
        "Notification of any damages or maintenance concerns",
        "Customer confirmation and feedback request"
      ]
    }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Trusted by Property Managers",
      description: "Over 500 holiday homes managed successfully with 99% client satisfaction rate."
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Rigorous quality checks and guest-ready standards for every property."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Adapt to your booking calendar with last-minute cleaning requests."
    },
    {
      icon: Star,
      title: "Guest Experience Focus",
      description: "Creating memorable first impressions for your guests with attention to detail."
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
              <BreadcrumbPage>Holiday Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-secondary/10 text-secondary border-secondary/20">
            Holiday Home Management
          </Badge>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Holiday Home Housekeeping
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Keeping your holiday home spotless is our priority. At ILAJ, we provide tailored housekeeping solutions designed for holiday home operators — from one-time cleaning to ongoing packages that ensure every guest walks into a fresh, welcoming space.
          </p>
        </div>

        {/* Service Packages */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">Holiday Home Housekeeping Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">{pkg.title}</CardTitle>
                  <p className="text-muted-foreground mb-2">{pkg.subtitle}</p>
                  <div className="text-3xl font-bold text-primary mb-4">
                    Starting AED {pkg.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-gradient-primary hover:bg-primary-hover"
                    onClick={() => window.location.href = pkg.href}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary">What's Included in Every Service</h2>
            <p className="text-muted-foreground">Standard features across all our holiday home packages</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {whatsIncluded.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))
            }
          </div>
        </div>

        {/* ILAJ Housekeeping SOP */}
        <Card className="mb-20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">🧹 ILAJ Housekeeping SOP</CardTitle>
            <p className="text-center text-muted-foreground">
              Our housekeeping services follow a structured Standard Operating Procedure to guarantee consistency and quality across every property
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sopSteps.map((step, index) => (
                <div key={index} className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-primary">{step.title}</h4>
                    {step.subtitle && (
                      <p className="text-sm text-muted-foreground italic">{step.subtitle}</p>
                    )}
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {step.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* Why Property Managers Choose ILAJ */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Property Managers Choose ILAJ</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((reason, index) => (
              <Card key={index} className="text-center group hover:shadow-medium transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <reason.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{reason.title}</h3>
                  <p className="text-muted-foreground text-sm">{reason.description}</p>
                </CardContent>
              </Card>
            ))
            }
          </div>
        </div>

        {/* Terms & Conditions */}
        <Card className="mb-20">
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {termsConditions.map((term, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{term}</span>
                </li>
              ))
              }
            </ul>
          </CardContent>
        </Card>

        {/* CTA Section */}
        {/* <div className="bg-gradient-secondary rounded-2xl text-white p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            Ready to Maximize Your Property's Potential?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of property managers who trust ILAJ for their holiday home management.
            While booking any package, you can request additional services on the next page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-secondary hover:bg-gray-50">
              Get Custom Quote
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary">
              Schedule Consultation
            </Button>
          </div>
        </div> */}
        
                <div className="bg-gradient-primary rounded-2xl text-white p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            Ready to Maximize Your Property's Potential?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of property managers who trust ILAJ for their holiday home management.
            While booking any package, you can request additional services on the next page.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
              Schedule Site Visit
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Get Custom Proposal
            </Button>
          </div> */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground" onClick={() => window.location.href = '/services/professional'}>
              Book Service Online
            </Button>
            <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white hover:text-primary">
              <a href="tel:971600562624" target="_blank" rel="noopener noreferrer">
                Contact Us Today
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayHome;
