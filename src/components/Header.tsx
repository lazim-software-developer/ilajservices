import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Menu, Phone, Mail } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const services = [
    {
      title: "Professional Home Service",
      href: "/services/professional",
      items: []
      // items: [
      //   "Maid Service", "Deep Cleaning", "Upholstery Cleaning", "Carpet Cleaning",
      //   "Kitchen Deep Cleaning", "Bathroom Deep Cleaning", "AC Service", "AC Coil Cleaning",
      //   "AC Duct Cleaning", "AC Duct & Coil Cleaning", "Pest Control", "Painting", "Packers & Movers"
      // ]
    },
    {
      title: "Holiday Home",
      href: "/services/holiday-home",
      items: []
      // items: [
      //   "One-Time Cleaning", "Basic Pack", "Standard Pack", "Custom-Tailored Pack"
      // ]
    },
    {
      title: "Corporate Solution",
      href: "/services/corporate",
      items: []
      // items: [
      //   "Basic Cleaning", "Deep Cleaning", "Premium Cleaning", "Other Services"
      // ]
    }
  ];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact", href: "/contact" },
    // { name: "Admin", href: "/admin" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <a href="tel:971600562624" target="_blank" rel="noopener noreferrer">
                <span>600 562624</span>
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>info@ilaj.ae</span>
            </div>
          </div>
          <div className="text-muted-foreground">
            Available 9-6 Mon-Sat | 1001, Suntech Tower, DSO, Dubai
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/lovable-uploads/01b6ec03-1f3a-4290-aa3a-52202a2236e8.webp"
              alt="Ilaj Services"
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">ILAJ</h1>
              <p className="text-xs text-muted-foreground">Services at Doorstep</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                  <Link
                    to={link.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.href ? 'text-primary' : 'text-foreground'
                      }`}
                  >
                    {link.name}
                  </Link>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <NavigationMenuTrigger className={`text-sm font-medium ${
                  location.pathname.startsWith('/services') ? 'text-primary' : ''
                }`}>
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  {/* <div className="grid w-[600px] gap-6 p-6 md:w-[800px] md:grid-cols-3"> */}
                  <div className="flex flex-col w-[200px] gap-6 p-6 md:w-[200px]">
                    {services.map((service) => (
                      <div key={service.title} className="space-y-6">
                        <Link
                          to={service.href}
                          className="block text-sm font-medium leading-none text-primary hover:underline"
                        >
                          {service.title}
                        </Link>
                        {/* <ul className="space-y-1">
                          {service.items.slice(0, 4).map((item) => (
                            <li key={item}>
                              <Link
                                to={`${service.href}/${item.toLowerCase().replace(/\s+/g, '-').replace(/[()&]/g, '')}`}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                          {service.items.length > 4 && (
                            <li>
                              <Link
                                to={service.href}
                                className="text-xs text-secondary hover:underline"
                              >
                                +{service.items.length - 4} more services
                              </Link>
                            </li>
                          )}
                        </ul> */}
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button */}
          <Button className="hidden md:flex bg-gradient-secondary hover:bg-secondary-hover" onClick={() => window.location.href = '/services/professional'}>
            Book Now
          </Button>

          {/* Mobile menu trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.href ? 'text-primary' : 'text-foreground'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="border-t pt-4">
                  <h3 className="px-4 py-2 text-sm font-semibold text-primary">Services</h3>
                  {services.map((service) => (
                    <div key={service.title} className="ml-4 space-y-2">
                      <Link
                        to={service.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-1 text-sm font-medium text-foreground hover:text-primary"
                      >
                        {service.title}
                      </Link>
                    </div>
                  ))}
                </div>

                <Button className="mt-4 bg-gradient-secondary hover:bg-secondary-hover" onClick={() => window.location.href = '/services/professional'}>
                  Book Now
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;