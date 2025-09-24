import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, Image } from "lucide-react";

const Gallery = () => {
  const imageGallery = {
    "before-after": [
      {
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
        title: "Kitchen Deep Clean - Before & After",
        description: "Complete kitchen transformation with degreasing and sanitization",
        type: "image"
      },
      {
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
        title: "Bathroom Transformation",
        description: "Mold removal and complete bathroom sanitization",
        type: "image"
      },
      {
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
        title: "Living Room Revival",
        description: "Comprehensive cleaning including furniture and floor care",
        type: "image"
      }
    ],
    "service-videos": [
      {
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
        title: "AC Maintenance Process",
        description: "Step-by-step AC cleaning and maintenance service",
        type: "video"
      },
      {
        image: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&h=400&fit=crop",
        title: "Deep Cleaning Techniques",
        description: "Professional deep cleaning methods and equipment",
        type: "video"
      },
      {
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
        title: "Upholstery Restoration",
        description: "Advanced stain removal and fabric protection process",
        type: "video"
      }
    ],
    "team-action": [
      {
        image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop",
        title: "Professional Team at Work",
        description: "Our trained professionals delivering quality service",
        type: "image"
      },
      {
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
        title: "Corporate Cleaning Excellence",
        description: "Maintaining professional office environments",
        type: "image"
      },
      {
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
        title: "Holiday Home Setup",
        description: "Preparing vacation rentals for guests",
        type: "image"
      }
    ],
    "customer-testimonials": [
      {
        image: "https://images.unsplash.com/photo-1572020525351-3ca5c5962200?w=600&h=400&fit=crop",
        title: "Customer Success Stories",
        description: "Real testimonials from satisfied customers",
        type: "video"
      },
      {
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
        title: "Property Manager Reviews",
        description: "Holiday home managers share their experience",
        type: "video"
      },
      {
        image: "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=600&h=400&fit=crop",
        title: "Corporate Client Feedback",
        description: "Office managers discuss our services",
        type: "video"
      }
    ]
  };

  const featuredVideo = {
    thumbnail: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=600&fit=crop",
    title: "ILAJ Services - Your Property, Our Priority",
    description: "Experience the difference with professional home services across UAE"
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Image & Video Gallery
          </Badge>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            See Our Quality in Action
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of completed projects, service processes, and customer experiences 
            through images and videos showcasing the ILAJ difference.
          </p>
        </div>

        {/* Featured Video */}
        <Card className="mb-16 overflow-hidden">
          <div className="relative aspect-video">
            <img 
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary-hover text-secondary-foreground rounded-full w-20 h-20"
              >
                <Play className="h-8 w-8 ml-1" />
              </Button>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-2">{featuredVideo.title}</h3>
            <p className="text-muted-foreground">{featuredVideo.description}</p>
          </CardContent>
        </Card>

        {/* Gallery Tabs */}
        <Tabs defaultValue="before-after" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="before-after">Before & After</TabsTrigger>
            <TabsTrigger value="service-videos">Service Videos</TabsTrigger>
            <TabsTrigger value="team-action">Team in Action</TabsTrigger>
            <TabsTrigger value="customer-testimonials">Testimonials</TabsTrigger>
          </TabsList>

          {Object.entries(imageGallery).map(([category, items]) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                  <Card key={index} className="group overflow-hidden hover:shadow-medium transition-all duration-300">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {item.type === "video" && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-secondary rounded-full p-3">
                            <Play className="h-6 w-6 text-secondary-foreground" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className={`${item.type === 'video' ? 'bg-secondary' : 'bg-primary'} text-white`}>
                          {item.type === 'video' ? <Play className="h-3 w-3 mr-1" /> : <Image className="h-3 w-3 mr-1" />}
                          {item.type === 'video' ? 'Video' : 'Image'}
                        </Badge>
                      </div>
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
        <div className="mt-20 bg-gradient-secondary rounded-2xl text-white p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have experienced the ILAJ difference. 
            Book your service today and see the quality for yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-secondary hover:bg-gray-50">
              Book Service Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary">
              Get Free Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;