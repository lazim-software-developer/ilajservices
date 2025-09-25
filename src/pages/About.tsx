import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, Users, Award, Clock, ChevronDown, Star, Shield, Target, Heart, Lightbulb } from "lucide-react";
import { useState } from "react";

const About = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const stats = [
    { number: "95k", label: "Services Completed" },
    { number: "4.6", label: "Google Rating", icon: "⭐" },
    { number: "100%", label: "Tailored Solutions" },
    { number: "20+", label: "Years Experience" }
  ];

  const coreValues = [
    {
      icon: Heart,
      title: "Care with Heart",
      description: "Every service is delivered with the same dedication we'd give to our own homes."
    },
    {
      icon: Shield,
      title: "Trust You Can Feel",
      description: "Insured, bonded, and transparent — giving you peace of mind at every step."
    },
    {
      icon: Star,
      title: "Excellence in Every Detail",
      description: "From spotless finishes to complete checklists, perfection is in the little things."
    },
    {
      icon: CheckCircle,
      title: "Always Here for You",
      description: "Flexible, dependable, and ready to serve whenever and wherever you need us."
    },
    {
      icon: Lightbulb,
      title: "Honesty at the Core",
      description: "Clear pricing, open communication, and integrity guide all that we do."
    },
    {
      icon: Users,
      title: "Creating Comfort, Building Smiles",
      description: "More than cleaning — we create spaces that feel welcoming, safe, and alive."
    }
  ];

  const faqs = [
    {
      question: "What services does ILAJ provide?",
      answer: "ILAJ offers a wide range of home and community services including maid service, deep cleaning, pest control, AC maintenance, and holiday home housekeeping in Dubai."
    },
    {
      question: "How do I book a service with ILAJ?",
      answer: "You can easily book through our website, WhatsApp, or by calling our customer care team. We'll confirm your slot instantly."
    },
    {
      question: "Are your staff trained and verified?",
      answer: "Yes, All our staff are professionally trained, background-checked, and supervised to ensure reliable and quality service."
    },
    {
      question: "Do you provide same-day services?",
      answer: "Yes, depending on availability. For urgent requests, we try to assign a team within a few hours."
    },
    {
      question: "How transparent is your pricing?",
      answer: "Our pricing is clear and upfront — no hidden charges. Quotes are shared before the service starts."
    },
    {
      question: "Do I need to provide cleaning supplies?",
      answer: "Not at all. Our team arrives with professional equipment and eco-friendly cleaning products."
    },
    {
      question: "Can I schedule recurring services?",
      answer: "Yes. You can book weekly, bi-weekly, or monthly services at discounted rates for hassle-free regular care."
    },
    {
      question: "Do you provide services for holiday homes and commercial spaces?",
      answer: "Yes, apart from residential cleaning, we specialize in holiday home housekeeping, office cleaning, and facility maintenance."
    },
    {
      question: "How can I contact ILAJ for support?",
      answer: "You can reach us via phone, WhatsApp, or email. Our customer care team will assist you within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            About ILAJ Services
          </Badge>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            About ILAJ Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            At ILAJ, it's not just about what we do; it's about the trust we build, the peace of mind we deliver, 
            and the relationships we nurture—one service at a time.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.icon && <span className="mr-2">{stat.icon}</span>}
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Our Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                At ILAJ, we bring over 20 years of experience in developing, maintaining, and managing 
                properties across the UAE. As part of a group of companies with expertise in every aspect 
                of property management, we ensure seamless, end-to-end service delivery for every client.
              </p>
              <p>
                Born from a vision to provide on-demand services that protect both customers and service 
                providers, we understand the UAE's unique market needs and tailor each solution to individual 
                requirements. Every service we offer carries the care, trust, and attention that comes from 
                decades of experience, giving our clients not just a service—but true peace of mind.
              </p>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
              alt="Professional cleaning team"
              className="rounded-2xl shadow-medium w-full"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <Card className="p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl text-primary flex items-center gap-3">
                <Target className="h-8 w-8" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-muted-foreground text-lg">
                To provide reliable, tailored on-demand services that protect both customers and service providers.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl text-primary flex items-center gap-3">
                <Award className="h-8 w-8" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-muted-foreground text-lg">
                To redefine on-demand property services in the UAE through trust, care, and excellence.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values Section */}
        <div className="mb-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Every client has a story — a family to care for, guests to welcome, or a workplace to inspire. At ILAJ, we honor those unique needs with heartfelt service, delivering the comfort of convenience, the assurance of flexibility, and the promise of consistency you can always count on.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="text-center group hover:shadow-medium transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about our services
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <Collapsible 
                  open={openFAQ === index} 
                  onOpenChange={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <CollapsibleTrigger className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                    <ChevronDown className={`h-5 w-5 transition-transform ${openFAQ === index ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-6 pb-6 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-primary rounded-2xl text-white p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            Experience the ILAJ Difference
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust ILAJ for reliable, professional services. 
            Your property is our priority.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
              <a href="/services/professional-services">Book Service Now</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <a href="/contact">Contact Us Today</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;