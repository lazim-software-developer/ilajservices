import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Building, Building2, ArrowRight, Sparkles, Shield, Star } from 'lucide-react';

const Services = () => {
  const services = [
    {
      id: 'professional',
      title: 'Professional Home Services',
      description: 'Comprehensive cleaning, pest control, AC maintenance, and handyman solutions to keep your home in top condition.',
      icon: Home,
      image: '/lovable-uploads/bestmaidserviceindubai.webp',
      link: '/services/professional',
      gradient: 'from-primary/10 to-primary/5'
    },
    {
      id: 'holiday-home',
      title: 'Holiday Home Solutions',
      description: 'Full-service holiday home management: guest handling, housekeeping, fit-out, and design to deliver 5-star experiences.',
      icon: Building,
      image: '/lovable-uploads/airbnbcleaning.jpg',
      link: '/services/holiday-home',
      gradient: 'from-accent/10 to-accent/5'
    },
    {
      id: 'corporate',
      title: 'Corporate Solutions',
      description: 'Facility management for offices, residential towers, and corporate properties to ensure smooth operations.',
      icon: Building2,
      image: '/lovable-uploads/dubaicleaningcompany.jpg',
      link: '/services/corporate',
      gradient: 'from-secondary/10 to-secondary/5'
    }
  ];

  return (
    <div className="services-page min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Floating Animation Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-32 right-20 w-3 h-3 bg-accent/30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-60 right-1/3 w-5 h-5 bg-accent/20 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Tailored Excellence</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-8 animate-fade-in">
            Our Services – Tailored for Every Need
          </h1>
          
          <div className="max-w-4xl mx-auto space-y-4 text-lg text-muted-foreground animate-fade-in" style={{animationDelay: '0.3s'}}>
            <p>At ILAJ, we bring professional expertise to every space — from homes to holiday rentals to corporate properties.</p>
            <p>Our services are designed to simplify upkeep, maximize comfort, and deliver consistent 5-star experiences.</p>
            <p>Choose the solution that fits your lifestyle or business, and let us take care of the rest.</p>
          </div>
        </div>
      </section>

      {/* Service Tiles */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id} 
                  className={`group relative overflow-hidden bg-gradient-to-br ${service.gradient} border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-scale-in cursor-pointer`}
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <Link to={service.link} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pb-6">
                      <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                        {service.description}
                      </CardDescription>
                      
                      <Button 
                        variant="ghost" 
                        className="group/btn w-full justify-between bg-primary/10 hover:bg-primary hover:text-white border-0 transition-all duration-300"
                      >
                        <span>Explore Services</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Description */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 via-background to-accent/5">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Serving Every Home and Business with Care
            </h2>
            <Star className="w-8 h-8 text-accent animate-pulse" />
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in">
            At ILAJ, we provide a wide range of services designed for all types of households and business models. 
            From individual homeowners to investors and corporate entities, our mission is to deliver reliable upkeep 
            assistance that protects your property, enhances value, and creates a healthier, more comfortable environment.
          </p>
        </div>
      </section>

      {/* Magical Sparkle Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;