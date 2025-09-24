import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, MapPin, Star, Plus, Minus, ShoppingCart, Sparkles, Gift, Zap, Target, Trophy, Gamepad2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface GamifiedServiceBookingProps {
  serviceData: {
    title: string;
    description: string;
    basePrice: number;
    image: string;
    duration: string;
    category: string;
    serviceType?: string;
  };
}

const GamifiedServiceBooking = ({ serviceData }: GamifiedServiceBookingProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    buildingName: "",
    location: "",
    unitNumber: "",
    landmark: ""
  });
  
  const [addOns, setAddOns] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [hours, setHours] = useState(2);
  const [propertyType, setPropertyType] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [carpetSize, setCarpetSize] = useState("");
  const [numberOfCarpets, setNumberOfCarpets] = useState(1);
  const [numberOfBathrooms, setNumberOfBathrooms] = useState(1);
  const [numberOfUnits, setNumberOfUnits] = useState(1);
  const [showDiscountAnimation, setShowDiscountAnimation] = useState(false);
  const [showAddOnPulse, setShowAddOnPulse] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"
  ];

  const availableAddOns = (() => {
    const baseAddOns = [
      "Deep Carpet Clean",
      "Window Cleaning", 
      "Appliance Clean",
      "Sanitization",
      "Upholstery Treatment"
    ];
    
    // Add service-specific add-ons
    if (serviceData.serviceType === "packers-movers") {
      return [
        ...baseAddOns,
        "Half Truck",
        "Full Truck"
      ];
    }
    
    return [...baseAddOns, "Pest Control Add-on"];
  })();

  const propertyTypes = [
    "Studio", "1 BR", "2 BR", "3 BR", "4 BR", "5 BR",
    "2 BR villa", "3 BR villa", "4 BR villa", "5 BR villa", "Penthouse"
  ];

  const calculatePrice = () => {
    let basePrice = serviceData.basePrice;
    
    // Service-specific pricing logic
    switch (serviceData.serviceType) {
      case "maid-service":
        // Base price is per hour with materials option
        const materialsCost = addOns.includes("materials") ? 11 : 0;
        basePrice = (basePrice + materialsCost) * quantity * hours;
        break;
        
      case "deep-cleaning":
        const deepCleaningPrices = {
          "Studio": 345, "1 BR": 460, "2 BR": 570, "3 BR": 685, "4 BR": 860,
          "1 BR villa": 745, "2 BR villa": 915, "3 BR villa": 1145, "4 BR villa": 1370, "5 BR villa": 1830
        };
        basePrice = deepCleaningPrices[propertyType as keyof typeof deepCleaningPrices] || basePrice;
        break;
        
      case "upholstery-cleaning":
        const fabricType = addOns.includes("leather") ? 46 : 30;
        basePrice = fabricType * numberOfSeats;
        break;
        
      case "carpet-cleaning":
        const carpetPrices = { "Small": 75, "Medium": 105, "Large": 150 };
        basePrice = (carpetPrices[carpetSize as keyof typeof carpetPrices] || 75) * numberOfCarpets;
        break;
        
      case "mattress-cleaning":
        const mattressPrices = { "Single": 115, "Queen": 175, "King": 185 };
        basePrice = mattressPrices[propertyType as keyof typeof mattressPrices] || 115;
        break;
        
      case "kitchen-deep-cleaning":
        const kitchenPrices = { "Small": 170, "Medium": 230, "Large": 345 };
        basePrice = kitchenPrices[propertyType as keyof typeof kitchenPrices] || 170;
        break;
        
      case "bathroom-deep-cleaning":
        basePrice = 170 * numberOfBathrooms;
        break;
        
      case "pest-control":
        const pestType = addOns.includes("mosquito-fly") ? "mosquito" : 
                        addOns.includes("bedbug") ? "bedbug" : 
                        addOns.includes("rodent") ? "rodent" : "general";
                        
        const pestPrices = {
          general: {
            "Studio": 120, "1 BR": 120, "2 BR": 150, "3 BR": 180, "4 BR": 240, "5 BR": 276,
            "1 BR villa": 180, "2 BR villa": 228, "3 BR villa": 288, "4 BR villa": 348, "5 BR villa": 408
          },
          mosquito: {
            "Studio": 150, "1 BR": 150, "2 BR": 200, "3 BR": 240, "4 BR": 280, "5 BR": 350,
            "2 BR villa": 270, "3 BR villa": 300, "4 BR villa": 370, "5 BR villa": 380
          },
          bedbug: {
            "Studio": 144, "1 BR": 156, "2 BR": 180, "3 BR": 228, "4 BR": 276, "5 BR": 300,
            "1 BR villa": 240, "2 BR villa": 324, "3 BR villa": 348, "4 BR villa": 420, "5 BR villa": 480
          },
          rodent: {
            "Studio": 170, "1 BR": 170, "2 BR": 250, "3 BR": 280, "4 BR": 320, "5 BR": 350,
            "1 BR villa": 230, "2 BR villa": 265, "3 BR villa": 300, "4 BR villa": 350, "5 BR villa": 380
          }
        };
        basePrice = pestPrices[pestType][propertyType as keyof typeof pestPrices[typeof pestType]] || 120;
        break;
        
      case "ac-service":
        basePrice = 150 * numberOfUnits;
        break;
        
      case "ac-duct-cleaning":
        basePrice = 350 * numberOfUnits;
        break;
        
      case "ac-coil-cleaning":
        basePrice = 375 * numberOfUnits;
        break;
        
      case "ac-duct-coil-cleaning":
        basePrice = 475 * numberOfUnits;
        break;
        
      case "painting":
        const paintingPrices = {
          "Studio": 600, "1 BR": 840, "2 BR": 1200, "3 BR": 1680, "4 BR": 2450, "5 BR": 2800,
          "1 BR villa": 1450, "2 BR villa": 1920, "3 BR villa": 2400, "4 BR villa": 3150, "5 BR villa": 3850
        };
        basePrice = paintingPrices[propertyType as keyof typeof paintingPrices] || 600;
        break;
        
      case "packers-movers":
        const region = addOns.includes("abudhabi") ? "abudhabi" : "dubai";
        const moversPrices = {
          dubai: {
            "Studio": 743, "1 BR": 943, "2 BR": 1657, "3 BR": 1900, "4 BR": 3095, "5 BR": 4571,
            "2 BR villa": 1857, "3 BR villa": 2810, "4 BR villa": 3762, "5 BR villa": 4714
          },
          abudhabi: {
            "Studio": 1229, "1 BR": 1610, "2 BR": 1895, "3 BR": 3324, "4 BR": 3800,
            "2 BR villa": 2371, "3 BR villa": 3514, "4 BR villa": 4752, "5 BR villa": 5657
          }
        };
        basePrice = moversPrices[region][propertyType as keyof typeof moversPrices[typeof region]] || 743;
        
        // Add truck costs
        if (addOns.includes("half-truck")) {
          basePrice += region === "dubai" ? 367 : 810;
        }
        if (addOns.includes("full-truck")) {
          basePrice += region === "dubai" ? 629 : 1238;
        }
        break;
        
      case "handyman":
        basePrice = 150 * hours;
        break;
        
      default:
        basePrice = serviceData.basePrice;
    }
    
    // Add-ons pricing (excluding service-specific ones handled above)
    const addonPricing = {
      "Deep Carpet Clean": 100,
      "Window Cleaning": 150,
      "Appliance Clean": 200,
      "Sanitization": 120,
      "Upholstery Treatment": 180,
      "Pest Control Add-on": 250
    };
    
    const addOnTotal = addOns.reduce((total, addon) => {
      // Handle service-specific add-ons separately in service logic above
      const serviceSpecificAddOns = ["materials", "leather", "mosquito-fly", "bedbug", "rodent", "abudhabi", "half-truck", "full-truck"];
      
      if (!serviceSpecificAddOns.includes(addon.toLowerCase().replace(/\s/g, '-'))) {
        return total + (addonPricing[addon as keyof typeof addonPricing] || 0);
      }
      
      // Handle truck add-ons for packers-movers
      if (addon === "Half Truck") {
        const region = addOns.includes("abudhabi") ? "abudhabi" : "dubai";
        return total + (region === "dubai" ? 367 : 810);
      }
      if (addon === "Full Truck") {
        const region = addOns.includes("abudhabi") ? "abudhabi" : "dubai";
        return total + (region === "dubai" ? 629 : 1238);
      }
      
      return total;
    }, 0);
    
    return basePrice + addOnTotal;
  };

  const calculateDiscount = (total: number) => {
    if (total >= 1000) return 0.07; // 7% discount
    if (total >= 500) return 0.05; // 5% discount
    return 0;
  };

  const getFinalPrice = () => {
    const subtotal = calculatePrice();
    const discount = calculateDiscount(subtotal);
    return subtotal * (1 - discount);
  };

  const getDiscountAmount = () => {
    const subtotal = calculatePrice();
    const discount = calculateDiscount(subtotal);
    return subtotal * discount;
  };

  // Gamification: Track progress
  useEffect(() => {
    let steps = 0;
    if (selectedDate) steps++;
    if (selectedTime) steps++;
    if (customerInfo.name) steps++;
    if (customerInfo.phone) steps++;
    if (propertyType || quantity > 1 || hours > 2) steps++;
    
    if (steps > completedSteps) {
      setCompletedSteps(steps);
      if (steps === 5) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      toast({
        title: `Step ${steps}/5 Complete! 🎉`,
        description: "You're making great progress!",
      });
    }
  }, [selectedDate, selectedTime, customerInfo.name, customerInfo.phone, propertyType, quantity, hours]);

  // Effect to show discount animations
  useEffect(() => {
    const subtotal = calculatePrice();
    if (subtotal >= 400 && subtotal < 1000) {
      setShowDiscountAnimation(true);
      setTimeout(() => setShowDiscountAnimation(false), 4000);
    }
  }, [calculatePrice()]);

  // Effect to pulse add-ons
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAddOnPulse(true);
      setTimeout(() => setShowAddOnPulse(false), 1000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const renderCustomizationOptions = () => {
    switch (serviceData.serviceType) {
      case "maid-service":
        return (
          <div className="space-y-6">
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                Materials Included
              </Label>
              <div className="mt-2 space-y-2">
                <div 
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    !addOns.includes("materials") ? "border-secondary bg-secondary/10" : "border-muted"
                  )}
                  onClick={() => {
                    if (addOns.includes("materials")) {
                      setAddOns(addOns.filter(item => item !== "materials"));
                    }
                  }}
                >
                  <div className="font-medium">Without Materials - AED 34/hour</div>
                  <div className="text-sm text-muted-foreground">You provide cleaning materials</div>
                </div>
                <div 
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    addOns.includes("materials") ? "border-secondary bg-secondary/10" : "border-muted"
                  )}
                  onClick={() => {
                    if (!addOns.includes("materials")) {
                      setAddOns([...addOns, "materials"]);
                    }
                  }}
                >
                  <div className="font-medium">With Materials - AED 45/hour</div>
                  <div className="text-sm text-muted-foreground">We bring professional cleaning materials</div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                Number of Maids (1-8)
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="hover:scale-110 transition-transform"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="bg-primary/10 rounded-lg px-6 py-3 font-bold text-xl text-primary animate-pulse">
                  {quantity}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.min(8, quantity + 1))}
                  className="hover:scale-110 transition-transform"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="animate-fade-in delay-200">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                Hours (1-12)
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setHours(Math.max(1, hours - 1))}
                  className="hover:scale-110 transition-transform"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="bg-secondary/10 rounded-lg px-6 py-3 font-bold text-xl text-secondary animate-pulse">
                  {hours}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setHours(Math.min(12, hours + 1))}
                  className="hover:scale-110 transition-transform"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case "upholstery-cleaning":
        return (
          <div className="space-y-6">
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold">Material Type</Label>
              <div className="mt-2 space-y-2">
                <div 
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    !addOns.includes("leather") ? "border-secondary bg-secondary/10" : "border-muted"
                  )}
                  onClick={() => {
                    if (addOns.includes("leather")) {
                      setAddOns(addOns.filter(item => item !== "leather"));
                    }
                  }}
                >
                  <div className="font-medium">Fabric - AED 30 per seat</div>
                </div>
                <div 
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    addOns.includes("leather") ? "border-secondary bg-secondary/10" : "border-muted"
                  )}
                  onClick={() => {
                    if (!addOns.includes("leather")) {
                      setAddOns([...addOns.filter(item => item !== "leather"), "leather"]);
                    }
                  }}
                >
                  <div className="font-medium">Leather - AED 46 per seat</div>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                Number of Seats
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setNumberOfSeats(Math.max(1, numberOfSeats - 1))}
                  className="hover:scale-110 transition-transform"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="bg-primary/10 rounded-lg px-6 py-3 font-bold text-xl text-primary animate-pulse">
                  {numberOfSeats}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setNumberOfSeats(numberOfSeats + 1)}
                  className="hover:scale-110 transition-transform"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case "carpet-cleaning":
        return (
          <div className="space-y-6">
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold">Carpet Size</Label>
              <Select onValueChange={setCarpetSize}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select carpet size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Small (5x10 ft) - AED 75</SelectItem>
                  <SelectItem value="Medium">Medium (8x12 ft) - AED 105</SelectItem>
                  <SelectItem value="Large">Large (10x15 ft) - AED 150</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="animate-fade-in delay-200">
              <Label className="text-lg font-semibold">Number of Carpets</Label>
              <div className="flex items-center gap-4 mt-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setNumberOfCarpets(Math.max(1, numberOfCarpets - 1))}
                  className="hover:scale-110 transition-transform"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="bg-primary/10 rounded-lg px-6 py-3 font-bold text-xl text-primary animate-pulse">
                  {numberOfCarpets}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setNumberOfCarpets(numberOfCarpets + 1)}
                  className="hover:scale-110 transition-transform"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case "mattress-cleaning":
        return (
          <div className="animate-fade-in">
            <Label className="text-lg font-semibold">Mattress Size</Label>
            <Select onValueChange={setPropertyType}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select mattress size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single - AED 115</SelectItem>
                <SelectItem value="Queen">Queen Size - AED 175</SelectItem>
                <SelectItem value="King">King Size - AED 185</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "kitchen-deep-cleaning":
        return (
          <div className="animate-fade-in">
            <Label className="text-lg font-semibold">Kitchen Size</Label>
            <Select onValueChange={setPropertyType}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select kitchen size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Small">Small (Below 100 sq.ft) - AED 170</SelectItem>
                <SelectItem value="Medium">Medium (100-200 sq.ft) - AED 230</SelectItem>
                <SelectItem value="Large">Large (Above 200 sq.ft) - AED 345</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "bathroom-deep-cleaning":
        return (
          <div className="animate-fade-in">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-secondary" />
              Number of Bathrooms (1-5) - AED 170 each
            </Label>
            <div className="flex items-center gap-4 mt-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setNumberOfBathrooms(Math.max(1, numberOfBathrooms - 1))}
                className="hover:scale-110 transition-transform"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="bg-primary/10 rounded-lg px-6 py-3 font-bold text-xl text-primary animate-pulse">
                {numberOfBathrooms}
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setNumberOfBathrooms(Math.min(5, numberOfBathrooms + 1))}
                className="hover:scale-110 transition-transform"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "pest-control":
        return (
          <div className="space-y-6">
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold">Pest Control Type</Label>
              <div className="mt-2 space-y-2">
                <div 
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    !addOns.some(addon => ["mosquito-fly", "bedbug", "rodent"].includes(addon)) ? "border-secondary bg-secondary/10" : "border-muted"
                  )}
                  onClick={() => {
                    setAddOns(addOns.filter(item => !["mosquito-fly", "bedbug", "rodent"].includes(item)));
                  }}
                >
                  <div className="font-medium">General Pest Control</div>
                </div>
                {[
                  { key: "mosquito-fly", label: "Mosquito & Fly Control" },
                  { key: "bedbug", label: "Bedbug Control" },
                  { key: "rodent", label: "Rodent/Rat Control" }
                ].map(({ key, label }) => (
                  <div 
                    key={key}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      addOns.includes(key) ? "border-secondary bg-secondary/10" : "border-muted"
                    )}
                    onClick={() => {
                      const filtered = addOns.filter(item => !["mosquito-fly", "bedbug", "rodent"].includes(item));
                      setAddOns([...filtered, key]);
                    }}
                  >
                    <div className="font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold">Property Type</Label>
              <Select onValueChange={setPropertyType}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "packers-movers":
        return (
          <div className="space-y-6">
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold">Region</Label>
              <div className="mt-2 space-y-2">
                <div 
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    !addOns.includes("abudhabi") ? "border-secondary bg-secondary/10" : "border-muted"
                  )}
                  onClick={() => {
                    setAddOns(addOns.filter(item => item !== "abudhabi"));
                  }}
                >
                  <div className="font-medium">Dubai Region</div>
                </div>
                <div 
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    addOns.includes("abudhabi") ? "border-secondary bg-secondary/10" : "border-muted"
                  )}
                  onClick={() => {
                    if (!addOns.includes("abudhabi")) {
                      setAddOns([...addOns, "abudhabi"]);
                    }
                  }}
                >
                  <div className="font-medium">Abu Dhabi Region</div>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold">Property Type</Label>
              <Select onValueChange={setPropertyType}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "handyman":
        return (
          <div className="animate-fade-in delay-200">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" />
              Hours - AED 150/hour
            </Label>
            <div className="flex items-center gap-4 mt-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setHours(Math.max(1, hours - 1))}
                className="hover:scale-110 transition-transform"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="bg-secondary/10 rounded-lg px-6 py-3 font-bold text-xl text-secondary animate-pulse">
                {hours}
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setHours(hours + 1)}
                className="hover:scale-110 transition-transform"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      default:
        // For AC services and others that need unit/property selection
        if (["ac-service", "ac-duct-cleaning", "ac-coil-cleaning", "ac-duct-coil-cleaning"].includes(serviceData.serviceType || "")) {
          return (
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                Number of AC Units (1-8)
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setNumberOfUnits(Math.max(1, numberOfUnits - 1))}
                  className="hover:scale-110 transition-transform"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="bg-primary/10 rounded-lg px-6 py-3 font-bold text-xl text-primary animate-pulse">
                  {numberOfUnits}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setNumberOfUnits(Math.min(8, numberOfUnits + 1))}
                  className="hover:scale-110 transition-transform"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        }
        
        return (
          <div className="animate-fade-in">
            <Label className="text-lg font-semibold">Property Type</Label>
            <Select onValueChange={setPropertyType}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select your property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-muted/30 to-muted/10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="animate-bounce text-6xl">🎉</div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold">Service Customization Quest</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium">{completedSteps}/5 Complete</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(completedSteps / 5) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={serviceData.image}
                  alt={serviceData.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge className="bg-secondary mb-2">{serviceData.category}</Badge>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">{serviceData.title}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{serviceData.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customization Section */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-secondary animate-spin" />
                  Customize Your Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderCustomizationOptions()}
              </CardContent>
            </Card>

            {/* Add-ons Section */}
            <Card className={cn("transition-all duration-500", showAddOnPulse && "ring-2 ring-secondary animate-pulse")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary animate-spin" />
                  Enhance Your Experience
                  <Badge className="bg-gradient-to-r from-secondary to-secondary-hover text-white animate-bounce">
                    Popular!
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableAddOns.map((addon, index) => (
                    <div 
                      key={addon} 
                      className={cn(
                        "relative p-4 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer group",
                        addOns.includes(addon) 
                          ? "border-secondary bg-secondary/10 shadow-lg ring-2 ring-secondary/20" 
                          : "border-muted hover:border-secondary/50 hover:shadow-md",
                        showAddOnPulse && index % 2 === 0 && "animate-pulse"
                      )}
                      onClick={() => {
                        const checked = !addOns.includes(addon);
                        if (checked) {
                          setAddOns([...addOns, addon]);
                          toast({
                            title: "Add-on Added! 🎉",
                            description: `${addon} has been added to your service`,
                          });
                        } else {
                          setAddOns(addOns.filter(item => item !== addon));
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={addon}
                          checked={addOns.includes(addon)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={addon} className="text-sm font-medium cursor-pointer">
                            {addon}
                          </Label>
                          <div className="text-xs text-muted-foreground mt-1">
                            AED {(() => {
                              const addonPricing = {
                                "Deep Carpet Clean": 100,
                                "Window Cleaning": 150,
                                "Appliance Clean": 200,
                                "Sanitization": 120,
                                "Upholstery Treatment": 180,
                                "Pest Control Add-on": 250,
                                "Half Truck": addOns.includes("abudhabi") ? 810 : 367,
                                "Full Truck": addOns.includes("abudhabi") ? 1238 : 629
                              };
                              return addonPricing[addon as keyof typeof addonPricing] || 0;
                            })()}
                          </div>
                        </div>
                        {addOns.includes(addon) && (
                          <Zap className="h-4 w-4 text-secondary animate-bounce" />
                        )}
                      </div>
                      {index === 0 && showAddOnPulse && (
                        <div className="absolute -top-2 -right-2">
                          <Gift className="h-6 w-6 text-secondary animate-bounce" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Select Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Your Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      placeholder="Enter your full name" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="600 562624" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      placeholder="info@ilaj.ae" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitNumber">Unit Number</Label>
                    <Input 
                      id="unitNumber" 
                      value={customerInfo.unitNumber}
                      onChange={(e) => setCustomerInfo({...customerInfo, unitNumber: e.target.value})}
                      placeholder="Apartment/Villa number" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="buildingName">Building Name</Label>
                  <Input 
                    id="buildingName" 
                    value={customerInfo.buildingName}
                    onChange={(e) => setCustomerInfo({...customerInfo, buildingName: e.target.value})}
                    placeholder="Building or complex name" 
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Textarea 
                    id="location"
                    value={customerInfo.location}
                    onChange={(e) => setCustomerInfo({...customerInfo, location: e.target.value})}
                    placeholder="Street, area, city, emirate"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input 
                    id="landmark" 
                    value={customerInfo.landmark}
                    onChange={(e) => setCustomerInfo({...customerInfo, landmark: e.target.value})}
                    placeholder="Nearby landmark" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Price Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>AED {calculatePrice()}</span>
                </div>
                {getDiscountAmount() > 0 && (
                  <div className="flex justify-between text-green-600 animate-pulse">
                    <span className="flex items-center gap-1">
                      <Gift className="h-4 w-4" />
                      Discount ({calculateDiscount(calculatePrice()) * 100}%)
                    </span>
                    <span>-AED {getDiscountAmount().toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total Price</span>
                  <span className="text-lg font-semibold text-primary">AED {getFinalPrice().toFixed(2)}</span>
                </div>
              </div>
              
              {/* Discount Animation */}
              {showDiscountAnimation && calculatePrice() < 1000 && (
                <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 p-4 rounded-lg border border-secondary/30 animate-bounce">
                  <div className="flex items-center gap-2 text-secondary">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">
                      Add AED {(1000 - calculatePrice()).toFixed(2)} more to get 7% discount!
                    </span>
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover transition-all duration-300 transform hover:scale-105" 
                size="lg"
                disabled={!selectedDate || !selectedTime || !customerInfo.name || !customerInfo.phone}
                onClick={() => {
                  // Navigate to payment gateway
                  toast({
                    title: "Redirecting to Payment 💳",
                    description: "Please wait while we prepare your secure payment...",
                  });
                  // Here you would redirect to payment gateway
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Proceed to Payment
              </Button>
              
              <div className="text-center text-xs text-muted-foreground">
                🔒 Secure payment powered by trusted partners
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GamifiedServiceBooking;