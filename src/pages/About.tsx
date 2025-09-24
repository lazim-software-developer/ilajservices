import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Award, Clock } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "We maintain the highest standards in all our services with rigorous quality checks."
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our priority. We listen, understand, and deliver accordingly."
    },
    {
      icon: Award,
      title: "Professional Excellence", 
      description: "Our trained professionals use the best equipment and eco-friendly products."
    },
    {
      icon: Clock,
      title: "Reliable Service",
      description: "On-time service delivery with flexible scheduling to match your convenience."
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
            Your Trusted Home Service Partner
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Since our establishment, ILAJ Services has been dedicated to providing exceptional 
            home maintenance and cleaning services across the UAE, bringing professional solutions 
            directly to your doorstep.
          </p>
        </div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded with a vision to revolutionize home services in the UAE, ILAJ Services 
                started as a small team passionate about bringing professional-grade cleaning 
                and maintenance services to every household.
              </p>
              <p>
                Today, we've grown into a trusted brand serving thousands of customers across 
                the Emirates, from individual homeowners to corporate clients and holiday home 
                managers. Our commitment to quality, reliability, and customer satisfaction 
                remains unchanged.
              </p>
              <p>
                What sets us apart is our attention to detail, use of eco-friendly products, 
                and a team of trained professionals who treat your home with the same care 
                they would their own.
              </p>
            </div>
            <Button className="bg-gradient-primary hover:bg-primary-hover">
              Get Started Today
            </Button>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
              alt="Professional cleaning team"
              className="rounded-2xl shadow-medium w-full"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
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

        {/* Stats Section */}
        <div className="bg-gradient-primary rounded-2xl text-white p-8 lg:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-secondary mb-2">10K+</div>
              <div className="text-white/90">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-secondary mb-2">50K+</div>
              <div className="text-white/90">Services Completed</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-secondary mb-2">24/7</div>
              <div className="text-white/90">Customer Support</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-secondary mb-2">4.8</div>
              <div className="text-white/90">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;