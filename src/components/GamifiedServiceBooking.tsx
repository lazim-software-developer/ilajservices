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

  const availableAddOns = [
    "Deep Carpet Clean",
    "Window Cleaning", 
    "Appliance Clean",
    "Sanitization",
    "Upholstery Treatment",
    "Pest Control Add-on"
  ];

  const propertyTypes = [
    "Studio", "1 BR", "2 BR", "3 BR", "4 BR", "5 BR",
    "2 BR villa", "3 BR villa", "4 BR villa", "5 BR villa", "Penthouse"
  ];

  const calculatePrice = () => {
    let basePrice = serviceData.basePrice;
    
    // Service-specific pricing logic
    switch (serviceData.serviceType) {
      case "maid-service":
        basePrice = basePrice * quantity * hours;
        break;
      case "upholstery-cleaning":
        basePrice = basePrice * numberOfSeats;
        break;
      case "carpet-cleaning":
        const carpetPrices = { Small: 50, Medium: 75, Large: 100, "Extra Large": 150 };
        basePrice = carpetPrices[carpetSize as keyof typeof carpetPrices] * numberOfCarpets || basePrice;
        break;
      case "kitchen-deep-cleaning":
        const kitchenPrices = {
          "Studio": 175, "1 BR": 275, "2 BR": 275, "3 BR": 275, "4 BR": 275, "5 BR": 300,
          "2 BR villa": 310, "3 BR villa": 310, "4 BR villa": 310, "5 BR villa": 310, "Penthouse": 310
        };
        basePrice = kitchenPrices[propertyType as keyof typeof kitchenPrices] || basePrice;
        break;
      case "bathroom-deep-cleaning":
        basePrice = basePrice * numberOfBathrooms;
        break;
      case "ac-coil-cleaning":
        basePrice = basePrice * numberOfUnits;
        break;
      default:
        if (propertyType) {
          const propertyMultipliers = {
            "Studio": 1, "1 BR": 1.2, "2 BR": 1.5, "3 BR": 1.8, "4 BR": 2.1, "5 BR": 2.5,
            "2 BR villa": 2.8, "3 BR villa": 3.2, "4 BR villa": 3.6, "5 BR villa": 4, "Penthouse": 4.5
          };
          basePrice = basePrice * (propertyMultipliers[propertyType as keyof typeof propertyMultipliers] || 1);
        }
    }
    
    // Add-ons pricing
    const addonPricing = {
      "Deep Carpet Clean": 100,
      "Window Cleaning": 150,
      "Appliance Clean": 200,
      "Sanitization": 120,
      "Upholstery Treatment": 180,
      "Pest Control Add-on": 250
    };
    
    const addOnTotal = addOns.reduce((total, addon) => {
      return total + (addonPricing[addon as keyof typeof addonPricing] || 0);
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
                  <SelectItem value="Small">Small - AED 50</SelectItem>
                  <SelectItem value="Medium">Medium - AED 75</SelectItem>
                  <SelectItem value="Large">Large - AED 100</SelectItem>
                  <SelectItem value="Extra Large">Extra Large - AED 150</SelectItem>
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

      case "bathroom-deep-cleaning":
        return (
          <div className="animate-fade-in">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-secondary" />
              Number of Bathrooms (1-5)
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

      case "ac-coil-cleaning":
        return (
          <div className="animate-fade-in">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-secondary" />
              Number of Units (1-8)
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

      default:
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
                                "Pest Control Add-on": 250
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