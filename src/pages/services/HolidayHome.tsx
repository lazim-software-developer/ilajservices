import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, Shield, Clock } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const HolidayHome = () => {
  const packages = [
    {
      title: "One-Time Cleaning",
      price: "AED 200",
      description: "Perfect for single property preparation",
      features: [
        "Complete property cleaning",
        "Linen change & arrangement",
        "Bathroom sanitization",
        "Kitchen deep clean",
        "Floor mopping & vacuuming",
        "Balcony/Outdoor cleaning"
      ],
      popular: false
    },
    {
      title: "Basic Pack",
      price: "AED 350/month",
      description: "Essential monthly maintenance",
      features: [
        "Bi-weekly cleaning service",
        "Linen management",
        "Basic maintenance check",
        "Guest checkout cleaning",
        "Property condition report",
        "Emergency response"
      ],
      popular: false
    },
    {
      title: "Standard Pack",
      price: "AED 550/month",
      description: "Comprehensive property management",
      features: [
        "Weekly cleaning service",
        "Complete linen service",
        "Monthly deep cleaning",
        "Guest welcome preparation",
        "Maintenance coordination",
        "Property inspection reports",
        "24/7 emergency support"
      ],
      popular: true
    },
    {
      title: "Custom-Tailored Pack",
      price: "From AED 700",
      description: "Fully customized to your needs",
      features: [
        "Flexible cleaning schedule",
        "Personalized service plan",
        "Premium linen options",
        "Concierge services",
        "Guest experience management",
        "Property upgrade suggestions",
        "Dedicated account manager"
      ],
      popular: false
    }
  ];

  const whatsIncluded = [
    "Professional cleaning team",
    "Eco-friendly cleaning products",
    "Quality bed linen & towels",
    "Bathroom essentials restocking",
    "Kitchen amenities check",
    "Property security inspection",
    "Guest preparation checklist",
    "Damage assessment report"
  ];

  const termsConditions = [
    "Minimum 3-month contract for monthly packages",
    "24-hour notice required for service cancellation",
    "Additional charges apply for excessive cleaning requirements",
    "Property access details must be provided in advance",
    "Damage beyond normal wear will be charged separately",
    "Service areas limited to Dubai, Abu Dhabi, and Sharjah"
  ];

  const pricingBySize = [
    { size: "Studio (up to 500 sq ft)", basic: "AED 200", standard: "AED 300", premium: "AED 400" },
    { size: "1 Bedroom (500-800 sq ft)", basic: "AED 250", standard: "AED 350", premium: "AED 450" },
    { size: "2 Bedroom (800-1200 sq ft)", basic: "AED 350", standard: "AED 450", premium: "AED 550" },
    { size: "3+ Bedroom (1200+ sq ft)", basic: "AED 450", standard: "AED 550", premium: "AED 650" }
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
            Professional Holiday Home Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete property management and cleaning services for holiday homes, short-term rentals,
            and vacation properties. Keep your guests happy and your property pristine.
          </p>
        </div>

        {/* Service Packages */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Service Package</h2>
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
                  <div className="text-2xl font-bold text-primary">{pkg.price}</div>
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
                  >
                    Select Package
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
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-primary">Pre-Arrival Preparation</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Complete property cleaning</li>
                  <li>• Fresh linen setup</li>
                  <li>• Amenities restocking</li>
                  <li>• Quality inspection</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">During Stay Support</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 24/7 emergency response</li>
                  <li>• Maintenance coordination</li>
                  <li>• Guest service support</li>
                  <li>• Issue resolution</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">Post-Checkout Process</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Damage assessment</li>
                  <li>• Deep cleaning service</li>
                  <li>• Inventory check</li>
                  <li>• Report generation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing by Property Size */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing by Property Size</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4">Property Size</th>
                      <th className="text-left p-4">Basic Clean</th>
                      <th className="text-left p-4">Standard Clean</th>
                      <th className="text-left p-4">Premium Clean</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingBySize.map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-4 font-medium">{row.size}</td>
                        <td className="p-4 text-primary font-semibold">{row.basic}</td>
                        <td className="p-4 text-primary font-semibold">{row.standard}</td>
                        <td className="p-4 text-primary font-semibold">{row.premium}</td>
                      </tr>
                    ))
                    }
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

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
            Get started today and ensure your guests have the perfect experience.
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
