import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, MessageSquare, Users } from "lucide-react";
import { redirect } from "react-router-dom";
import EmailForm from '@/components/EmailForm';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["600 562624"],
      description: "Available Mon-Sat: 9AM-6PM"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      details: ["600 562624"],
      redirect: "971600562624",
      description: "Response within 24 hours"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@ilaj.ae"],
      description: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["1001, Suntech Tower, DSO, Dubai"],
      description: "Our office location"
    }
  ];

  const services = [
    "Deep Cleaning",
    "AC Service & Maintenance",
    "Maid Service",
    "Carpet & Upholstery Cleaning",
    "Pest Control",
    "Holiday Home Management",
    "Corporate Cleaning",
    "Painting Services",
    "Packers & Movers",
    "Handyman Services",
    "Other"
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Get in Touch
          </Badge>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Contact ILAJ Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to book a service or have questions? We're here to help.
            Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const getClickHandler = () => {
              switch (info.title) {
                case "Call Us":
                  return () => window.open(`tel:${info.details[0].replace(/\s/g, '')}`);
                case "WhatsApp":
                  return () => window.open(`https://wa.me/${info.redirect}?text=Hi! I'd like to know more about your services.`);
                case "Email Us":
                  return () => window.open(`mailto:${info.details[0]}`);
                case "Visit Us":
                  return () => window.open(`https://maps.google.com/?q=${encodeURIComponent(info.details[0])}`);
                default:
                  return () => { };
              }
            };

            return (
              <Card
                key={index}
                className="text-center group hover:shadow-medium transition-all duration-300 cursor-pointer"
                onClick={getClickHandler()}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <info.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{info.title}</h3>
                  <div className="space-y-1 mb-2">
                    {info.details.map((detail, i) => (
                      <p key={i} className="font-medium text-foreground">{detail}</p>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Form & Map */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
              </div>

              <div>
                <Label htmlFor="service">Service Interested In</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service, index) => (
                      <SelectItem key={index} value={service.toLowerCase().replace(/\s+/g, '-')}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter your location (Dubai, Abu Dhabi, etc.)" />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your requirements, preferred timing, or any special requests..."
                  rows={4}
                />
              </div>

              <Button className="w-full bg-gradient-primary hover:bg-primary-hover">
                Send Message
              </Button>
            </CardContent>
          </Card> */}
          <EmailForm />

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Booking */}
            <Card className="bg-gradient-primary text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Quick Booking</h3>
                <p className="text-Deep blue-green/90 mb-6">
                  Need immediate service? Call us directly for same-day booking and emergency services.
                </p>
                <div className="space-y-3">
                  <Button
                    // className="w-full border-white text-primary hover:bg-white hover:text-primary"
                    className="w-full bg-white text-primary hover:bg-Vibrant orange/90"
                    onClick={() => window.open('tel:600562624')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now: 600 562624
                  </Button>
                  {/* <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white hover:text-primary">
              <a href="tel:971600562624" target="_blank" rel="noopener noreferrer">
                Contact Us Today
              </a>
            </Button> */}
                  <Button
                    variant="outline"
                    className="w-full border-Vibrant orange text-primary hover:bg-Vibrant orange hover:text-primary"
                    onClick={() => window.open('https://wa.me/600562624?text=Hi! I\'d like to know more about your services.')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-primary rounded-2xl text-white p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-[white]/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers across the UAE. Book your service today
            and experience the ILAJ difference.
          </p>
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

export default Contact;