import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import AddOnServicesModal from "@/components/AddOnServicesModal";

interface ServiceCardProps {
  id?: string;
  title: string;
  description: string;
  image: string;
  price: string;
  rating?: number;
  duration: string;
  features: string[];
  href?: string;
  serviceType?: string;
  customerType?: 'B2C' | 'Corporate' | 'Holiday Home';
}

const UpdatedServiceCard = ({ 
  id,
  title, 
  description, 
  image, 
  price, 
  rating = 4.8, 
  duration, 
  features, 
  href,
  serviceType,
  customerType = 'B2C'
}: ServiceCardProps) => {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const handleAddOnsChange = (addOns: string[]) => {
    setSelectedAddOns(addOns);
  };

  const shouldShowAddOns = customerType === 'B2C';

  return (
    <Card className="group overflow-hidden hover:shadow-medium transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img 
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-primary border-0">
            {price}
          </Badge>
        </div>
        {rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </div>
          
          <div className="space-y-2 mb-6">
            {features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3 mt-auto">
          {shouldShowAddOns ? (
            <div className="grid grid-cols-2 gap-2">
              <Link to={href || '#'}>
                <Button size="sm" className="w-full bg-primary hover:bg-primary-hover">
                  Book Now
                </Button>
              </Link>
              <AddOnServicesModal
                mainService={title}
                customerType={customerType}
                selectedAddOns={selectedAddOns}
                onAddOnsChange={handleAddOnsChange}
              >
                <Button size="sm" variant="outline" className="w-full">
                  <Plus className="h-3 w-3 mr-1" />
                  Add-ons
                </Button>
              </AddOnServicesModal>
            </div>
          ) : (
            <Link to={href || '#'}>
              <Button size="sm" className="w-full bg-primary hover:bg-primary-hover">
                Book Now
              </Button>
            </Link>
          )}
          
          {selectedAddOns.length > 0 && (
            <div className="text-xs text-muted-foreground text-center">
              {selectedAddOns.length} add-on{selectedAddOns.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdatedServiceCard;