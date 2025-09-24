import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ServiceCard from "@/components/ServiceCard";
import { ChevronLeft, ChevronRight, CheckCircle, Users, Clock, Shield, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroServices = [
    {
      title: "Deep Cleaning Service",
      description: "Complete deep cleaning for your home with professional equipment and eco-friendly products.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
      price: "AED 150",
      rating: 4.9,
      duration: "3-4 hours",
      features: ["Deep Kitchen Clean", "Bathroom Sanitization", "Floor Care"],
      href: "/services/professional/deep-cleaning"
    },
    {
      title: "AC Service & Maintenance",
      description: "Professional AC cleaning, maintenance, and repair services for optimal performance.",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
      price: "AED 120",
      rating: 4.8,
      duration: "2-3 hours",
      features: ["Coil Cleaning", "Filter Replacement", "Performance Check"],
      href: "/services/professional/ac-service"
    },
    {
      title: "Maid Service",
      description: "Reliable and professional maid service for regular home maintenance and cleaning.",
      image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop",
      price: "AED 80",
      rating: 4.7,
      duration: "2-6 hours",
      features: ["Regular Cleaning", "Flexible Schedule", "Trained Staff"],
      href: "/services/professional/maid-service"
    },
    {
      title: "Carpet & Upholstery Cleaning",
      description: "Specialized cleaning for carpets, sofas, and upholstery using advanced techniques.",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
      price: "AED 100",
      rating: 4.8,
      duration: "1-2 hours",
      features: ["Stain Removal", "Fabric Protection", "Quick Dry"],
      href: "/services/professional/upholstery-cleaning"
    },
    {
      title: "Pest Control Service",
      description: "Comprehensive pest control solutions to keep your home safe and pest-free.",
      image: "https://images.unsplash.com/photo-1572020525351-3ca5c5962200?w=600&h=400&fit=crop",
      price: "AED 200",
      rating: 4.9,
      duration: "1-2 hours",
      features: ["Safe Chemicals", "Long-lasting", "Follow-up Service"],
      href: "/services/professional/pest-control"
    },
    {
      title: "Holiday Home Management",
      description: "Complete property management and maintenance for holiday homes and short-term rentals.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      price: "AED 300",
      rating: 4.9,
      duration: "Flexible",
      features: ["Property Check", "Guest Prep", "Maintenance"],
      href: "/services/holiday-home"
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Customers" },
    { icon: CheckCircle, value: "50,000+", label: "Services Completed" },
    { icon: Clock, value: "24/7", label: "Support Available" },
    { icon: Star, value: "4.8", label: "Average Rating" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Licensed & Insured",
      description: "All our staff are licensed, insured, and background-verified for your peace of mind."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book services at your convenience with flexible timing options and same-day availability."
    },
    {
      icon: CheckCircle,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee with free re-service if you're not completely satisfied."
    },
    {
      icon: Star,
      title: "Professional Team",
      description: "Experienced and trained professionals using eco-friendly products and modern equipment."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-secondary text-secondary-foreground">
                  #1 Home Service Provider in UAE
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Professional Services
                  <span className="block text-secondary">At Your Doorstep</span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  From deep cleaning to AC maintenance, pest control to holiday home management - 
                  we bring professional services directly to your door.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
                  Book Service Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  View All Services
                </Button>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-secondary" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=600&fit=crop" 
                alt="Professional cleaning service"
                className="rounded-2xl shadow-strong w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-medium">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 rounded-full p-2">
                    <CheckCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-primary">Service Guaranteed</div>
                    <div className="text-sm text-muted-foreground">100% Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Featured Services
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-primary">
              Services in Spotlight
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our most popular professional services, trusted by thousands of customers across UAE
            </p>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {heroServices.map((service, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <ServiceCard {...service} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20">
              Why Choose ILAJ
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-primary">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the difference with our professional, reliable, and customer-focused approach
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-medium transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Experience Professional Service?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of satisfied customers who trust ILAJ for all their home service needs. 
              Book your service today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
                Book Service Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Call: +971 XX XXX XXXX
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;