import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Shield } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  price?: string;
  rating?: number;
  duration?: string;
  features?: string[];
  href: string;
}

const ServiceCard = ({ 
  title, 
  description, 
  image, 
  price, 
  rating = 4.8, 
  duration,
  features = [],
  href 
}: ServiceCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span>{rating}</span>
          </div>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {duration && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        )}
        
        {features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{features.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <Button 
          className="w-full bg-gradient-primary hover:bg-primary-hover transition-all duration-300"
          onClick={() => window.location.href = href}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;