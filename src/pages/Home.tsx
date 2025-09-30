import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ServiceCard from "@/components/ServiceCard";
import { ChevronLeft, ChevronRight, CheckCircle, Users, Clock, Shield, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

import { useServices } from '@/hooks/useServices';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { services, getServicesByCategory } = useServices();

  const heroServices = getServicesByCategory('Home').slice(0, 3).map(service => ({
    title: service.name,
    description: service.description,
    image: service.image_url || "/lovable-uploads/130a581b-75f6-44d1-a316-42881950a64e.png",
    price: `AED ${service.base_price}`,
    duration: `${service.duration_minutes} minutes`,
    features: service.features,
    href: `/booking/${service.id}`
  }));

  const heroImages = [
    "/lovable-uploads/9c656186-628c-46d9-b263-7e372f0a8bf7.png",
    "/lovable-uploads/00d8abb5-8a1c-40c2-87ee-3aa6583cf8cf.png",
    "/lovable-uploads/78a49ba5-8cb9-40d9-b04e-d409d61b4935.png",
    "/lovable-uploads/9470a896-617e-4470-8f48-1b686adc6cc3.png",
    "/lovable-uploads/painting.png",
    "/lovable-uploads/f44c00a2-be13-45d3-a1f6-b197c16afabb.png",
    "/lovable-uploads/130a581b-75f6-44d1-a316-42881950a64e.png",
    "/lovable-uploads/5a4a612f-8971-4ca5-b85c-298b721a9f60.png"
  ];

  // Use dynamic services from database
  const featuredServices = getServicesByCategory('Home').slice(0, 3);

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
      <section className="relative bg-gradient-hero text-white section-regular">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-secondary text-secondary-foreground">
                  #1 Home Service Provider in UAE
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Your Property,
                  <span className="block text-secondary">Our Priority</span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  We go beyond delivering services — we provide peace of mind. Whether it's a home, office,
                  or holiday home, our commitment is to care for every space with reliability, transparency,
                  and attention to detail. With us, you can trust that your property is always in safe and professional hands.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground" onClick={() => window.location.href = '/contact'}>
                  Book Service Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white hover:text-primary" onClick={() => window.location.href = '/services/professional'}>
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
              <Carousel className="w-full">
                <CarouselContent>
                  {heroImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={image}
                        alt={`Professional cleaning service ${index + 1}`}
                        className="rounded-2xl shadow-strong w-full h-[400px] lg:h-[500px] object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="text-primary left-4" />
                <CarouselNext className="text-primary right-4" />
              </Carousel>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-medium animate-fade-in">
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
      <section className="section-compact bg-muted/30">
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
              {featuredServices.map((service, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <ServiceCard
                    title={service.name}
                    description={service.description}
                    image={service.image_url || "/lovable-uploads/130a581b-75f6-44d1-a316-42881950a64e.png"}
                    duration={`${Math.round(service.duration_minutes / 60)} hours`}
                    features={service.features}
                    href={
                      service.name === "AC Duct Cleaning" 
                        ? "/services/professional/ac-duct-cleaning"
                        : service.name === "Deep Cleaning"
                        ? "/services/professional/deep-cleaning"
                        : service.name === "Pest Control"
                        ? "/services/professional/pest-control"
                        : `/service-booking?service=${service.id}`
                    }
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => window.location.href = '/services/professional'}>
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-compact">
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
      <section className="bg-gradient-primary text-white section-compact">
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
              <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground" onClick={() => window.location.href = '/services/professional'}>
                Book Service Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white hover:text-primary">
                <a href="tel:971600562624" target="_blank" rel="noopener noreferrer">
                  Call: 600 562 624
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;