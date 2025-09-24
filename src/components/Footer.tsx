import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const services = [
    { name: "Deep Cleaning", href: "/services/professional/deep-cleaning" },
    { name: "AC Service", href: "/services/professional/ac-service" },
    { name: "Maid Service", href: "/services/professional/maid-service" },
    { name: "Pest Control", href: "/services/professional/pest-control" },
    { name: "Holiday Home", href: "/services/holiday-home" },
    { name: "Corporate Solution", href: "/services/corporate" }
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact", href: "/contact" },
    { name: "Book Service", href: "/services/professional" },
    { name: "Get Quote", href: "/contact" }
  ];


  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/01b6ec03-1f3a-4290-aa3a-52202a2236e8.png" 
                alt="ILAJ Services" 
                className="h-8 w-auto"
              />
              <div>
                <h3 className="text-xl font-bold">ILAJ</h3>
                <p className="text-xs text-primary-foreground/80">Services at Doorstep</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Professional home services across the UAE. From cleaning to maintenance, 
              we bring quality and reliability to your doorstep.
            </p>
            <div className="flex gap-3">
              <div className="bg-primary-foreground/10 hover:bg-primary-foreground/20 p-2 rounded-full cursor-pointer transition-colors">
                <Facebook className="h-4 w-4" />
              </div>
              <div className="bg-primary-foreground/10 hover:bg-primary-foreground/20 p-2 rounded-full cursor-pointer transition-colors">
                <Instagram className="h-4 w-4" />
              </div>
              <div className="bg-primary-foreground/10 hover:bg-primary-foreground/20 p-2 rounded-full cursor-pointer transition-colors">
                <Twitter className="h-4 w-4" />
              </div>
              <div className="bg-primary-foreground/10 hover:bg-primary-foreground/20 p-2 rounded-full cursor-pointer transition-colors">
                <Linkedin className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-secondary" />
                <span>600 562624</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-secondary" />
                <span>info@ilaj.ae</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-secondary mt-0.5" />
                <span>1001, Suntech Tower, DSO, Dubai</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-secondary" />
                <span>Mon-Sat: 9AM-6PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-primary-foreground/60">
              © 2024 ILAJ Services. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-primary-foreground/60">
              <Link to="/privacy" className="hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/refund" className="hover:text-primary-foreground transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;