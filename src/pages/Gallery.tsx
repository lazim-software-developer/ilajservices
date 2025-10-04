import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Gallery = () => {
  const galleryItems = {
    "deep-cleaning": [
      {
        image: "/lovable-uploads/bestmaidserviceindubai.png",
        title: "Kitchen Deep Clean"
      },
      {
        image: "/lovable-uploads/bathroom_deep_cleaning.png",
        title: "Bathroom Deep Clean"
      },
      {
        image: "/lovable-uploads/130a581b-75f6-44d1-a316-42881950a64e.png",
        title: "Living Room Deep Clean"
      }
    ],
    "ac-service": [
      {
        image: "/lovable-uploads/gallary_images/holiday_home_cleaning.jpg",
        title: "Trusted housekeeping for homes that welcome"
      },
      {
        image: "/lovable-uploads/gallary_images/holiday_home.jpg",
        title: "Your property, our promise of excellence."
      },
      {
        image: "/lovable-uploads/gallary_images/holiday_home_cleaning_out_view.jpg",
        title: "Spotless spaces, stress-free living"
      }
    ],
    "upholstery": [
      {
        image: "/lovable-uploads/corporate_cleaning_1.png",
        title: "Office Cleaning Service"
      },
      {
        image: "/lovable-uploads/corporate_cleaning_2.png",
        title: "Corporate Workspace Cleaning"
      },
      {
        image: "/lovable-uploads/corporate_cleaning_3.png",
        title: "Professional Office Maintenance"
      }
    ],
    "corporate": [
      {
        image: "lovable-uploads/dubaicleaningcompany.jpg",
        title: "Super Heroes"
      },
      {
        image: "lovable-uploads/best cleaning company in dubai.jpg",
        title: "Rewarded Excellence"
      },
      {
        image: "lovable-uploads/airbnbcleaning.jpg",
        title: "Skilled Professionals"
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
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>


        {/* CTA Section */}
        <div className="bg-gradient-primary mt rounded-2xl text-white p-8 lg:p-12 text-center mt-16">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have experienced the ILAJ difference.
            Book your service today and see the quality for yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground" onClick={() => window.location.href = '/services/professional'}>
              Book Service Now
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

export default Gallery;