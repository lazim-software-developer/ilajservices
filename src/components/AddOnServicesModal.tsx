import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AddOnService {
  id: string;
  name: string;
  price: number;
  description: string;
  recommended?: boolean;
  category: string;
}

interface AddOnServicesModalProps {
  mainService: string;
  customerType: 'B2C' | 'Corporate' | 'Holiday Home';
  selectedAddOns: string[];
  onAddOnsChange: (addOns: string[]) => void;
  children: React.ReactNode;
}

const AddOnServicesModal = ({ 
  mainService, 
  customerType, 
  selectedAddOns, 
  onAddOnsChange, 
  children 
}: AddOnServicesModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedAddOns, setTempSelectedAddOns] = useState<string[]>(selectedAddOns);

  // Standardized add-on services
  const allAddOnServices: AddOnService[] = [
    {
      id: "pest-control",
      name: "Pest Control",
      price: 200,
      description: "Comprehensive pest control solutions to eliminate and prevent pest infestations",
      recommended: true,
      category: "Maintenance"
    },
    {
      id: "upholstery-sofa-cleaning",
      name: "Upholstery (Sofa) Cleaning", 
      price: 100,
      description: "Specialized cleaning for sofas and furniture using advanced stain removal techniques",
      recommended: false,
      category: "Cleaning"
    },
    {
      id: "carpet-cleaning",
      name: "Carpet Cleaning",
      price: 80,
      description: "Professional carpet cleaning service to remove deep stains and restore carpet freshness",
      recommended: false,
      category: "Cleaning"
    },
    {
      id: "kitchen-deep-cleaning",
      name: "Kitchen Deep Cleaning",
      price: 120,
      description: "Thorough kitchen cleaning including appliances, cabinets, and deep degreasing",
      recommended: true,
      category: "Cleaning"
    },
    {
      id: "bathroom-deep-cleaning", 
      name: "Bathroom Deep Cleaning",
      price: 100,
      description: "Complete bathroom sanitization and deep cleaning with mold and mildew removal",
      recommended: true,
      category: "Cleaning"
    }
  ];

  // Filter out services based on customer type and main service
  const getAvailableAddOns = () => {
    // Don't show add-ons for Corporate and Holiday Home bookings
    if (customerType === 'Corporate' || customerType === 'Holiday Home') {
      return [];
    }

    // Filter out the main service from add-ons (if customer is booking it individually)
    const mainServiceId = mainService.toLowerCase().replace(/\s+/g, '-').replace(/[()&]/g, '');
    
    return allAddOnServices.filter(addon => {
      // Don't show the same service as an add-on if it's the main service
      return addon.id !== mainServiceId;
    });
  };

  const availableAddOns = getAvailableAddOns();

  const handleAddOnToggle = (addOnId: string, checked: boolean) => {
    if (checked) {
      setTempSelectedAddOns([...tempSelectedAddOns, addOnId]);
    } else {
      setTempSelectedAddOns(tempSelectedAddOns.filter(id => id !== addOnId));
    }
  };

  const handleSave = () => {
    onAddOnsChange(tempSelectedAddOns);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedAddOns(selectedAddOns);
    setIsOpen(false);
  };

  const totalAddOnPrice = tempSelectedAddOns.reduce((total, addonId) => {
    const addon = availableAddOns.find(a => a.id === addonId);
    return total + (addon?.price || 0);
  }, 0);

  const recommendedAddOns = availableAddOns.filter(addon => addon.recommended);
  const otherAddOns = availableAddOns.filter(addon => !addon.recommended);

  // Don't render anything if no add-ons are available
  if (availableAddOns.length === 0) {
    return <>{children}</>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add-On Services
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enhance your {mainService} service with these popular add-ons
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recommended Add-ons */}
          {recommendedAddOns.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-primary">Recommended for You</h3>
                <Badge className="bg-secondary text-secondary-foreground">Popular Choice</Badge>
              </div>
              <div className="space-y-3">
                {recommendedAddOns.map((addon) => (
                  <Card key={addon.id} className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            id={addon.id}
                            checked={tempSelectedAddOns.includes(addon.id)}
                            onCheckedChange={(checked) => handleAddOnToggle(addon.id, checked as boolean)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <label htmlFor={addon.id} className="font-medium cursor-pointer">
                                {addon.name}
                              </label>
                              <Badge variant="outline" className="text-xs">
                                {addon.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {addon.description}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-primary text-primary-foreground ml-3">
                          AED {addon.price}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Other Add-ons */}
          {otherAddOns.length > 0 && (
            <div>
              {recommendedAddOns.length > 0 && <Separator />}
              <h3 className="font-semibold mb-4">Other Add-On Services</h3>
              <div className="space-y-3">
                {otherAddOns.map((addon) => (
                  <Card key={addon.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            id={addon.id}
                            checked={tempSelectedAddOns.includes(addon.id)}
                            onCheckedChange={(checked) => handleAddOnToggle(addon.id, checked as boolean)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <label htmlFor={addon.id} className="font-medium cursor-pointer">
                                {addon.name}
                              </label>
                              <Badge variant="outline" className="text-xs">
                                {addon.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {addon.description}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-secondary text-secondary-foreground ml-3">
                          AED {addon.price}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Why add these services?</p>
                  <p className="text-muted-foreground">
                    Save time and money by bundling services together. Our trained professionals 
                    can complete multiple tasks in one visit, reducing scheduling hassle.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer with total and actions */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {tempSelectedAddOns.length} add-on{tempSelectedAddOns.length !== 1 ? 's' : ''} selected
            </div>
            <div className="font-semibold">
              Total Add-ons: AED {totalAddOnPrice}
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover">
              Add to Service ({tempSelectedAddOns.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddOnServicesModal;
