import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CalendarIcon, Clock, MapPin, Star, Plus, Minus, ShoppingCart, Sparkles, Gift, Zap, Target, Trophy, Gamepad2, Info, CheckCircle, XCircle, Clipboard } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", 
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  // Function to get minimum date (22 hours from now)
  const getMinimumDate = () => {
    const now = new Date();
    const minDate = new Date(now.getTime() + (22 * 60 * 60 * 1000)); // 22 hours from now
    return minDate;
  };

  const getServiceDetails = (serviceType: string) => {
    const serviceDetails = {
      "maid-service": {
        description: "Home is where the heart is but is that any good with all the dust lying around? Get your home squeaky clean and revive that furniture shine with our highly-experienced maids.",
        scopeOfWork: [
          "Assessment of works to be carried out upon arrival and following client-specific instructions and requests.",
          "Performing all the essential duties within the allotted time period and prioritizing delicate tasks as a primary.",
          "Covering all other general duties such as folding clothes, arranging any used items upon completion of the primary tasks.",
          "Summarize and check-list all the performed activities upon job completion."
        ],
        inclusions: [
          "Bed makeovers",
          "Bathroom and kitchen cleaning",
          "Cleaning of carpets and sofas",
          "Mopping floors with disinfectant including balcony areas",
          "Ironing clothes, laundry activities, disposing of trash and other household-related tasks"
        ],
        exclusions: [
          "Use of cleaning materials and tools such as vacuum cleaner, broom, etc. (unless the customer opts for 'with material' package)",
          "Any tasks relating to the use of heavy equipment, such as ladders or cleaning of heightened areas, high windows, ceiling, etc."
        ]
      },
      "deep-cleaning": {
        description: "Recover your home to its 'day-one' state with our rigorous deep cleaning offerings. Expect a sparkly clean house from tip to toe.",
        scopeOfWork: [
          "Conduct a survey of the premises for recommended methods of application and assess any areas that require urgent attention.",
          "Initiating the cleaning works with the required equipment and chemicals while heeding utmost care to sensitive areas or items.",
          "Use of machinery and its sensitivity for the scrubbing of floor tiles, marble or tiled surfaces and various types of furniture.",
          "Upon completion, a thorough inspection and report will be documented of all the tasks carried out during the deep cleaning session."
        ],
        inclusions: [
          "Comprehensive auto floor scrubbing in all areas with the use of safe cleaning disinfectants",
          "Deep cleaning in the bathroom, kitchen and balcony floors, walls and other surfaces",
          "High-pressure dry vacuuming of sofas, curtains, carpets and other fabrics",
          "Internal cleaning of cabinets, cupboards and other storage facilities"
        ],
        exclusions: [
          "Use of any particular cleaning chemicals suggested or provided by the customer",
          "Full carpet floors or other special treatments are subject to site survey and inspection only"
        ]
      }
    };
    
    return serviceDetails[serviceType as keyof typeof serviceDetails] || serviceDetails["deep-cleaning"];
  };

  // Effect to update progress
  useEffect(() => {
    const steps = [
      selectedDate ? 1 : 0,
      selectedTime ? 1 : 0,
      customerInfo.name && customerInfo.phone && customerInfo.location ? 1 : 0
    ];
    setCompletedSteps(steps.reduce((sum, step) => sum + step, 0));
  }, [selectedDate, selectedTime, customerInfo]);

  const calculatePrice = () => {
    const serviceType = serviceData.serviceType || serviceData.title.toLowerCase().replace(/\s+/g, '-');
    let baseAmount = serviceData.basePrice;

    switch (serviceType) {
      case 'maid-service':
        baseAmount = 80 * quantity * hours;
        break;
      
      case 'deep-cleaning':
        const propertyPricing = {
          "Studio": 150,
          "1 BR": 200,
          "2 BR": 275,
          "3 BR": 350,
          "4 BR": 425,
          "5 BR": 500,
          "2 BR Villa": 400,
          "3 BR Villa": 475,
          "4 BR Villa": 550,
          "5 BR Villa": 625,
          "Penthouse": 700
        };
        baseAmount = propertyPricing[propertyType as keyof typeof propertyPricing] || 200;
        break;

      case 'upholstery-sofa-cleaning':
        baseAmount = numberOfSeats * 25 + 75;
        break;

      case 'carpet-cleaning':
        const carpetPricing = { "Small": 50, "Medium": 80, "Large": 120, "Extra Large": 200 };
        baseAmount = (carpetPricing[carpetSize as keyof typeof carpetPricing] || 80) * numberOfCarpets;
        break;

      case 'kitchen-deep-cleaning':
        const kitchenPricing = {
          "Studio": 175, "1 BR": 275, "2 BR": 275, "3 BR": 275, "4 BR": 275, "5 BR": 300,
          "2 BR Villa": 310, "3 BR Villa": 310, "4 BR Villa": 310, "5 BR Villa": 310, "Penthouse": 310
        };
        baseAmount = kitchenPricing[propertyType as keyof typeof kitchenPricing] || 275;
        break;

      case 'bathroom-deep-cleaning':
        baseAmount = numberOfBathrooms * 100;
        break;

      case 'ac-service':
        baseAmount = numberOfUnits * 120;
        break;

      case 'ac-coil-cleaning':
        baseAmount = numberOfUnits * 80;
        break;

      case 'ac-duct-cleaning':
        baseAmount = numberOfUnits * 200;
        break;

      case 'ac-duct-coil-cleaning':
        baseAmount = numberOfUnits * 280;
        break;

      case 'pest-control':
        baseAmount = 200;
        break;

      case 'painting':
        baseAmount = 15; // per sqft
        break;

      case 'packers-movers':
        baseAmount = 500;
        break;

      default:
        baseAmount = serviceData.basePrice;
    }

    return Math.max(baseAmount, 50); // Minimum price
  };

  const renderCustomizationOptions = () => {
    const serviceType = serviceData.serviceType || serviceData.title.toLowerCase().replace(/\s+/g, '-');
    
    switch (serviceType) {
      case 'maid-service':
        return (
          <div className="space-y-4">
            <div>
              <Label>Number of Maids</Label>
              <div className="flex items-center gap-3 mt-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(8, quantity + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">AED 80 per maid</span>
              </div>
            </div>
            <div>
              <Label>Duration (Hours)</Label>
              <div className="flex items-center gap-3 mt-2">
                <Button variant="outline" size="icon" onClick={() => setHours(Math.max(1, hours - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{hours}</span>
                <Button variant="outline" size="icon" onClick={() => setHours(Math.min(12, hours + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">per hour</span>
              </div>
            </div>
          </div>
        );

      case 'deep-cleaning':
      case 'kitchen-deep-cleaning':
        return (
          <div>
            <Label>Property Type</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select your property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Studio">Studio</SelectItem>
                <SelectItem value="1 BR">1 Bedroom</SelectItem>
                <SelectItem value="2 BR">2 Bedroom</SelectItem>
                <SelectItem value="3 BR">3 Bedroom</SelectItem>
                <SelectItem value="4 BR">4 Bedroom</SelectItem>
                <SelectItem value="5 BR">5 Bedroom</SelectItem>
                <SelectItem value="2 BR Villa">2 BR Villa</SelectItem>
                <SelectItem value="3 BR Villa">3 BR Villa</SelectItem>
                <SelectItem value="4 BR Villa">4 BR Villa</SelectItem>
                <SelectItem value="5 BR Villa">5 BR Villa</SelectItem>
                <SelectItem value="Penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'upholstery-sofa-cleaning':
        return (
          <div>
            <Label>Number of Seats</Label>
            <div className="flex items-center gap-3 mt-2">
              <Button variant="outline" size="icon" onClick={() => setNumberOfSeats(Math.max(1, numberOfSeats - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{numberOfSeats}</span>
              <Button variant="outline" size="icon" onClick={() => setNumberOfSeats(Math.min(20, numberOfSeats + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground ml-2">AED 25 per seat</span>
            </div>
          </div>
        );

      case 'carpet-cleaning':
        return (
          <div className="space-y-4">
            <div>
              <Label>Carpet Size</Label>
              <Select value={carpetSize} onValueChange={setCarpetSize}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select carpet size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Small (AED 50)</SelectItem>
                  <SelectItem value="Medium">Medium (AED 80)</SelectItem>
                  <SelectItem value="Large">Large (AED 120)</SelectItem>
                  <SelectItem value="Extra Large">Extra Large (AED 200)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Number of Carpets</Label>
              <div className="flex items-center gap-3 mt-2">
                <Button variant="outline" size="icon" onClick={() => setNumberOfCarpets(Math.max(1, numberOfCarpets - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{numberOfCarpets}</span>
                <Button variant="outline" size="icon" onClick={() => setNumberOfCarpets(Math.min(10, numberOfCarpets + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 'bathroom-deep-cleaning':
        return (
          <div>
            <Label>Number of Bathrooms</Label>
            <div className="flex items-center gap-3 mt-2">
              <Button variant="outline" size="icon" onClick={() => setNumberOfBathrooms(Math.max(1, numberOfBathrooms - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{numberOfBathrooms}</span>
              <Button variant="outline" size="icon" onClick={() => setNumberOfBathrooms(Math.min(5, numberOfBathrooms + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground ml-2">AED 100 per bathroom</span>
            </div>
          </div>
        );

      case 'ac-service':
      case 'ac-coil-cleaning':
      case 'ac-duct-cleaning':
      case 'ac-duct-coil-cleaning':
        return (
          <div>
            <Label>Number of AC Units</Label>
            <div className="flex items-center gap-3 mt-2">
              <Button variant="outline" size="icon" onClick={() => setNumberOfUnits(Math.max(1, numberOfUnits - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{numberOfUnits}</span>
              <Button variant="outline" size="icon" onClick={() => setNumberOfUnits(Math.min(8, numberOfUnits + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                {serviceType === 'ac-service' ? 'AED 120 per unit' :
                 serviceType === 'ac-coil-cleaning' ? 'AED 80 per unit' :
                 serviceType === 'ac-duct-cleaning' ? 'AED 200 per unit' :
                 'AED 280 per unit'}
              </span>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Standard service configuration</p>
          </div>
        );
    }
  };

  const handlePayment = async () => {
    if (!selectedDate || !customerInfo.name || !customerInfo.phone || !customerInfo.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: calculatePrice(),
          serviceName: serviceData.title,
          customerData: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            location: customerInfo.location
          }
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const currentServiceDetails = getServiceDetails(serviceData.serviceType || serviceData.title.toLowerCase().replace(/\s+/g, '-'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500", 
                completedSteps >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                1
              </div>
              <span className="text-sm font-medium">Service Details</span>
            </div>
            <div className={cn("h-1 w-12 transition-all duration-500", 
              completedSteps >= 2 ? "bg-primary" : "bg-muted")} />
            <div className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500", 
                completedSteps >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                2
              </div>
              <span className="text-sm font-medium">Schedule</span>
            </div>
            <div className={cn("h-1 w-12 transition-all duration-500", 
              completedSteps >= 3 ? "bg-primary" : "bg-muted")} />
            <div className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500", 
                completedSteps >= 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                3
              </div>
              <span className="text-sm font-medium">Customer Info</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={serviceData.image} 
                  alt={serviceData.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge className="bg-white/20 text-white border-white/30 mb-2">
                    {serviceData.category}
                  </Badge>
                  <h1 className="text-2xl font-bold">{serviceData.title}</h1>
                  <p className="text-white/90">{serviceData.description}</p>
                </div>
              </div>
            </Card>

            {/* Service Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  Customize Your Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderCustomizationOptions()}
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-secondary" />
                  Schedule Your Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal mt-2">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < getMinimumDate()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 22 hours advance booking required
                    </p>
                  </div>
                  <div>
                    <Label>Preferred Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input 
                      id="customerName" 
                      placeholder="Enter your full name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      placeholder="600 562624"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="info@ilaj.ae"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitNumber">Unit Number</Label>
                    <Input 
                      id="unitNumber" 
                      placeholder="Apartment/Villa number"
                      value={customerInfo.unitNumber}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, unitNumber: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="buildingName">Building Name</Label>
                  <Input 
                    id="buildingName" 
                    placeholder="Building or complex name"
                    value={customerInfo.buildingName}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, buildingName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Textarea 
                    id="location"
                    placeholder="Street, area, city, emirate"
                    rows={2}
                    value={customerInfo.location}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea 
                    id="specialRequests"
                    placeholder="Any special requirements or instructions"
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="description">
                    <AccordionTrigger>Service Description</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {currentServiceDetails.description}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="scope">
                    <AccordionTrigger>Scope of Work</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        {currentServiceDetails.scopeOfWork.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="inclusions">
                    <AccordionTrigger className="text-green-600">What's Included</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        {currentServiceDetails.inclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="exclusions">
                    <AccordionTrigger className="text-red-600">What's Not Included</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        {currentServiceDetails.exclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Card className={cn("sticky top-4 transition-all duration-500", showCelebration && "ring-2 ring-secondary animate-pulse")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Price Summary
                  {showCelebration && <Sparkles className="h-5 w-5 text-secondary animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Service Cost</span>
                    <span className="font-semibold">AED {calculatePrice()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Total Amount</span>
                      <span className="font-bold text-xl text-primary">AED {calculatePrice()}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-primary hover:bg-primary-hover text-lg py-6"
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing || !selectedDate || !customerInfo.name || !customerInfo.phone || !customerInfo.location}
                >
                  {isProcessing ? "Processing..." : `Book Now - AED ${calculatePrice()}`}
                </Button>
                
                <div className="text-center space-y-1">
                  <p className="text-xs text-muted-foreground">Secure payment powered by Stripe</p>
                  <p className="text-xs text-muted-foreground">100% satisfaction guaranteed</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardContent className="p-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">Need Help?</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Call: +971 600 562624</p>
                  <p className="text-xs text-muted-foreground">Available: Mon-Sun, 8:00 AM - 10:00 PM</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <span>Chat on WhatsApp</span>
                </Button>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <Trophy className="h-6 w-6 text-secondary mx-auto" />
                    <p className="text-xs font-medium">5000+ Happy Customers</p>
                  </div>
                  <div className="space-y-1">
                    <Star className="h-6 w-6 text-secondary mx-auto" />
                    <p className="text-xs font-medium">4.9/5 Rating</p>
                  </div>
                  <div className="space-y-1">
                    <CheckCircle className="h-6 w-6 text-secondary mx-auto" />
                    <p className="text-xs font-medium">Verified Professionals</p>
                  </div>
                  <div className="space-y-1">
                    <Clock className="h-6 w-6 text-secondary mx-auto" />
                    <p className="text-xs font-medium">On-Time Service</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamifiedServiceBooking;