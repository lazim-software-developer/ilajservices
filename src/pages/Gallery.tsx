import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Gallery = () => {
  const galleryItems = {
    "deep-cleaning": [
      {
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
        title: "Kitchen Deep Clean - Before & After",
        description: "Complete kitchen transformation with degreasing and sanitization"
      },
      {
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
        title: "Bathroom Deep Clean",
        description: "Mold removal and complete bathroom sanitization"
      },
      {
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
        title: "Living Room Deep Clean",
        description: "Comprehensive cleaning including furniture and floor care"
      }
    ],
    "ac-service": [
      {
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
        title: "AC Unit Maintenance",
        description: "Professional AC cleaning and maintenance service"
      },
      {
        image: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&h=400&fit=crop",
        title: "AC Coil Cleaning",
        description: "Detailed coil cleaning for improved efficiency"
      },
      {
        image: "https://images.unsplash.com/photo-1631450002405-1ad2078e6b34?w=600&h=400&fit=crop",
        title: "Duct Cleaning Process",
        description: "Professional duct cleaning for better air quality"
      }
    ],
    "upholstery": [
      {
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
        title: "Sofa Deep Cleaning",
        description: "Professional upholstery cleaning with stain removal"
      },
      {
        image: "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=600&h=400&fit=crop",
        title: "Carpet Restoration",
        description: "Steam cleaning and stain treatment for carpets"
      },
      {
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
        title: "Curtain Cleaning",
        description: "Professional curtain and drape cleaning service"
      }
    ],
    "corporate": [
      {
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
        title: "Office Cleaning",
        description: "Professional office cleaning and maintenance"
      },
      {
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop",
        title: "Conference Room Setup",
        description: "Corporate space preparation and maintenance"
      },
      {
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
        title: "Commercial Space",
        description: "Large-scale commercial cleaning solutions"
      }
    ]
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Our Work Gallery
          </Badge>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            See Our Quality in Action
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of completed projects and see the transformation 
            we bring to homes and offices across the UAE.
          </p>
        </div>

        {/* Gallery Tabs */}
        <Tabs defaultValue="deep-cleaning" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="deep-cleaning">Home Services</TabsTrigger>
            <TabsTrigger value="ac-service">Holiday Home Care</TabsTrigger>
            <TabsTrigger value="upholstery">Corporate Care</TabsTrigger>
            <TabsTrigger value="corporate">Our Heroes</TabsTrigger>
          </TabsList>

          {Object.entries(galleryItems).map(([category, items]) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                  <Card key={index} className="group overflow-hidden hover:shadow-medium transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-secondary rounded-2xl text-#085B86 p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-#085B86/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have experienced the ILAJ difference. 
            Book your service today and see the quality for yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-#085B86 text-secondary font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              Book Service Now
            </button>
            <button className="px-8 py-3 border border-#085B86 text-#085B86 rounded-lg hover:bg-white hover:text-secondary transition-colors">
              Get Free Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;