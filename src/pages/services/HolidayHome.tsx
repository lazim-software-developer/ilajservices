import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, Shield, Clock } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const HolidayHome = () => {
  const packages = [
    {
      title: "One-Time Cleaning",
      price: "AED 180",
      originalPrice: "AED 240",
      description: "One-time Service",
      features: [
        "1 cleaning Session",
        "Save AED 60"
      ],
      popular: false
    },
    {
      title: "Basic Pack",
      price: "AED 500",
      originalPrice: "AED 1080",
      description: "5 cleaning Service",
      features: [
        "5 Check-out cleanings",
        "AED 100 per cleaning",
        "Valid for 6 months",
        "Flexible scheduling",
        "Special Price for Additional Services",
        "Save AED 580"
      ],
      popular: false
    },
    {
      title: "Mid Pack",
      price: "AED 900",
      originalPrice: "AED 1800",
      description: "10 cleaning Service",
      features: [
        "10 Check-out cleanings",
        "AED 90 per cleaning",
        "Valid for 6 months",
        "Flexible scheduling",
        "Dedicated account manager",
        "Special Price for additional Services",
        "Save AED 900"
      ],
      popular: true
    },
    {
      title: "Custom-Tailored Pack",
      price: "Contact Us",
      originalPrice: "Special Price",
      description: "Annual Contract",
      features: [
        "Valid for 12 months",
        "Flexible scheduling",
        "Dedicated account manager",
        "Dedicated Housekeeping Team",
        "Special Price for additional Services"
      ],
      popular: false
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
          <p className="text-center text-muted-foreground mb-12">Save money and schedule anytime with our flexible bulk packages</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-secondary shadow-medium scale-105' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-secondary text-secondary-foreground px-4">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.title}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">{pkg.price}</div>
                    {pkg.originalPrice && pkg.originalPrice !== pkg.price && (
                      <div className="text-sm text-muted-foreground line-through">{pkg.originalPrice}</div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))
                    }
                  </ul>
                  <Button
                    className={`w-full ${pkg.popular ? 'bg-secondary hover:bg-secondary-hover' : 'bg-primary hover:bg-primary-hover'}`}
                    onClick={() => {
                      if (pkg.title === "Custom-Tailored Pack") {
                        window.open('https://wa.me/971600562624', '_blank');
                      } else {
                        const serviceId = pkg.title.toLowerCase().replace(/[\s-]+/g, '-').replace(/[^\w-]/g, '');
                        window.location.href = `/services/holiday-home/${serviceId}`;
                      }
                    }}
                  >
                    {pkg.title === "Custom-Tailored Pack" ? "Contact Us" : "Select Package"}
                  </Button>
                </CardContent>
              </Card>
            ))
            }
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
        <div className="bg-gradient-secondary rounded-2xl text-white p-8 lg:p-12 text-center">
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
        </div>
      </div>
    </div>
  );
};

export default HolidayHome;
