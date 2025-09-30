import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, MapPin, Plus, Minus, CheckCircle, X, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ServiceBookingProps {
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

const EnhancedServiceBooking = ({ serviceData }: ServiceBookingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [addOns, setAddOns] = useState<string[]>([]);
  const [customizations, setCustomizations] = useState<Record<string, any>>({});

  // Service-specific configurations
  const getServiceConfig = () => {
    const { title, serviceType } = serviceData;
    
    switch (serviceType || title.toLowerCase()) {
      case 'maid-service':
        return {
          customOptions: {
            maids: { min: 1, max: 8, price: 80 },
            hours: { min: 1, max: 12, price: 20 }
          },
          basePrice: 80
        };
      
      case 'deep-cleaning':
        return {
          unitTypes: [
            { label: "Studio", price: 150 },
            { label: "1 BR", price: 200 },
            { label: "2 BR", price: 275 },
            { label: "3 BR", price: 350 },
            { label: "4 BR", price: 425 },
            { label: "2 BR Villa", price: 400 },
            { label: "3 BR Villa", price: 475 },
            { label: "4 BR Villa", price: 550 }
          ]
        };
      
      case 'kitchen-deep-cleaning':
        return {
          unitTypes: [
            { label: "Studio", price: 175 },
            { label: "1 BR", price: 275 },
            { label: "2 BR", price: 275 },
            { label: "3 BR", price: 275 },
            { label: "4 BR", price: 275 },
            { label: "2 BR Villa", price: 310 },
            { label: "3 BR Villa", price: 310 },
            { label: "4 BR Villa", price: 310 }
          ]
        };
      
      case 'upholstery-sofa-cleaning':
        return {
          customOptions: {
            seats: { min: 1, max: 20, price: 25 }
          },
          basePrice: 100
        };
      
      case 'carpet-cleaning':
        return {
          customOptions: {
            size: [
              { label: "Small", price: 50 },
              { label: "Medium", price: 80 },
              { label: "Large", price: 120 },
              { label: "Extra Large", price: 200 }
            ],
            quantity: { min: 1, max: 10, multiplier: true }
          }
        };
      
      case 'bathroom-deep-cleaning':
        return {
          customOptions: {
            bathrooms: { min: 1, max: 5, price: 100 }
          },
          basePrice: 100
        };
      
      case 'ac-coil-cleaning':
        return {
          customOptions: {
            units: { min: 1, max: 8, price: 80 }
          },
          basePrice: 80
        };
      
      default:
        return {
          unitTypes: [
            { label: "Studio", price: 200 },
            { label: "1 BR", price: 250 },
            { label: "2 BR", price: 350 },
            { label: "3 BR", price: 450 },
            { label: "4 BR", price: 550 },
            { label: "2 BR Villa", price: 500 },
            { label: "3 BR Villa", price: 600 },
            { label: "4 BR Villa", price: 700 }
          ]
        };
    }
  };

  const serviceConfig = getServiceConfig();
  
  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"
  ];

  const addOnOptions = [
    { id: "window-cleaning", name: "Window Cleaning", price: 50 },
    { id: "appliance-cleaning", name: "Appliance Deep Clean", price: 30 },
    { id: "balcony-cleaning", name: "Balcony Cleaning", price: 25 },
    { id: "cabinet-cleaning", name: "Cabinet Interior Clean", price: 40 },
    { id: "mattress-cleaning", name: "Mattress Sanitization", price: 35 }
  ];

  const inclusions = [
    "Professional trained staff",
    "All cleaning equipment provided",
    "Eco-friendly cleaning products",
    "Quality assurance guarantee",
    "Insurance coverage",
    "Post-service inspection"
  ];

  const exclusions = [
    "Repair or maintenance work",
    "Moving heavy furniture",
    "Cleaning of valuable items",
    "Pest control treatment",
    "Electrical work"
  ];

  const calculateTotal = () => {
    let total = serviceConfig.basePrice || serviceData.basePrice;
    
    // Handle unit-based pricing
    if (serviceConfig.unitTypes && customizations.unitType) {
      const selectedUnit = serviceConfig.unitTypes.find(unit => unit.label === customizations.unitType);
      if (selectedUnit) total = selectedUnit.price;
    }
    
    // Handle custom options
    if (serviceConfig.customOptions) {
      Object.entries(customizations).forEach(([key, value]) => {
        const option = serviceConfig.customOptions[key];
        if (option && value) {
          if (option.price) {
            total += option.price * (value as number);
          } else if (option.multiplier && key === 'quantity') {
            // For carpet cleaning quantity multiplier
            total *= (value as number);
          } else if (Array.isArray(option)) {
            const selectedOption = option.find(opt => opt.label === value);
            if (selectedOption) total = selectedOption.price * (customizations.quantity || 1);
          }
        }
      });
    }
    
    // Add-ons
    addOns.forEach(addonId => {
      const addon = addOnOptions.find(a => a.id === addonId);
      if (addon) total += addon.price;
    });
    
    return total;
  };

  const handleAddOnChange = (addonId: string, checked: boolean) => {
    if (checked) {
      setAddOns([...addOns, addonId]);
    } else {
      setAddOns(addOns.filter(id => id !== addonId));
    }
  };

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomizations(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <img 
                    src={serviceData.image}
                    alt={serviceData.title}
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />
                  <div className="space-y-4">
                    <div>
                      <Badge className="bg-primary/10 text-primary mb-2">{serviceData.category}</Badge>
                      <h1 className="text-2xl font-bold">{serviceData.title}</h1>
                      <p className="text-muted-foreground">{serviceData.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{serviceData.duration}</span>
                      </div>
                      <div className="text-lg font-semibold text-primary">
                        From AED {serviceConfig.basePrice || serviceData.basePrice}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Details Tabs */}
            <Tabs defaultValue="customize" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="customize">Customize</TabsTrigger>
                <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
                <TabsTrigger value="terms">T&C</TabsTrigger>
              </TabsList>

              <TabsContent value="customize" className="space-y-6">
                {/* Service Customization */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customize Your Service</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Unit Selection for applicable services */}
                    {serviceConfig.unitTypes && (
                      <div>
                        <Label>Property Type</Label>
                        <Select onValueChange={(value) => handleCustomizationChange('unitType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceConfig.unitTypes.map((unit, index) => (
                              <SelectItem key={index} value={unit.label}>
                                {unit.label} - AED {unit.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Custom Options */}
                    {serviceConfig.customOptions && Object.entries(serviceConfig.customOptions).map(([key, option]) => (
                      <div key={key}>
                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                        {Array.isArray(option) ? (
                          <Select onValueChange={(value) => handleCustomizationChange(key, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${key}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {option.map((opt, index) => (
                                <SelectItem key={index} value={opt.label}>
                                  {opt.label} - AED {opt.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleCustomizationChange(key, Math.max(option.min, (customizations[key] || option.min) - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-16 text-center font-medium">
                              {customizations[key] || option.min}
                            </span>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleCustomizationChange(key, Math.min(option.max, (customizations[key] || option.min) + 1))}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {option.price && `AED ${option.price} per ${key.slice(0, -1)}`}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Date & Time Selection */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Preferred Date</Label>
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
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>Preferred Time</Label>
                        <Select onValueChange={setSelectedTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time, index) => (
                              <SelectItem key={index} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Add-on Services */}
                    <div>
                      <Label className="text-base font-semibold">Add-on Services</Label>
                      <div className="space-y-3 mt-3">
                        {addOnOptions.map((addon) => (
                          <div key={addon.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={addon.id}
                                checked={addOns.includes(addon.id)}
                                onCheckedChange={(checked) => handleAddOnChange(addon.id, checked as boolean)}
                              />
                              <label htmlFor={addon.id} className="font-medium cursor-pointer">
                                {addon.name}
                              </label>
                            </div>
                            <Badge className="bg-secondary text-secondary-foreground">
                              +AED {addon.price}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-semibold">Customer Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customerName">Full Name *</Label>
                          <Input id="customerName" placeholder="Enter your full name" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input id="phone" placeholder="600 562624" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" placeholder="info@ilaj.ae" />
                        </div>
                        <div>
                          <Label htmlFor="unitNumber">Unit Number</Label>
                          <Input id="unitNumber" placeholder="Apartment/Villa number" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="buildingName">Building Name</Label>
                        <Input id="buildingName" placeholder="Building or complex name" />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Textarea 
                          id="location"
                          placeholder="Street, area, city, emirate"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input id="landmark" placeholder="Nearby landmark for easy location" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inclusions">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      Service Inclusions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {inclusions.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exclusions">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <X className="h-5 w-5" />
                      Service Exclusions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {exclusions.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="terms">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Terms & Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <p>• 24-hour advance booking required for all services</p>
                      <p>• Payment required upon service completion</p>
                      <p>• Cancellation allowed up to 4 hours before scheduled time</p>
                      <p>• Customer must provide clear access to service areas</p>
                      <p>• Additional charges apply for services beyond agreed scope</p>
                      <p>• 100% satisfaction guarantee - we'll re-do if not satisfied</p>
                      <p>• All staff are insured and background verified</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Total Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Service</span>
                    <span>AED {calculateTotal() - addOns.reduce((sum, id) => {
                      const addon = addOnOptions.find(a => a.id === id);
                      return sum + (addon?.price || 0);
                    }, 0)}</span>
                  </div>
                  {addOns.map(addonId => {
                    const addon = addOnOptions.find(a => a.id === addonId);
                    return addon ? (
                      <div key={addon.id} className="flex justify-between text-sm text-muted-foreground">
                        <span>{addon.name}</span>
                        <span>AED {addon.price}</span>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">AED {calculateTotal()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Actions */}
            <Button 
              size="lg" 
              className="w-full bg-gradient-primary hover:bg-primary-hover text-lg py-6"
              onClick={() => {
                if (!selectedDate || !selectedTime || !customizations.unitType) {
                  alert("Please complete all required fields");
                  return;
                }
                
                const bookingDetails = `
🏠 *ILAJ Service Booking*

📋 *Service:* ${serviceData.title}
🏘️ *Property:* ${customizations.unitType || 'N/A'}
📅 *Date:* ${selectedDate ? format(selectedDate, "PPP") : 'Not selected'}
⏰ *Time:* ${selectedTime || 'Not selected'}
💰 *Total Amount:* AED ${calculateTotal()}

👤 *Customer Details:*
Name: [Please provide]
Phone: [Please provide]
Location: [Please provide]

✅ Add-ons: ${addOns.length > 0 ? addOns.map(id => addOnOptions.find(a => a.id === id)?.name).join(', ') : 'None'}
                `.trim();
                
                const whatsappUrl = `https://wa.me/971600562624?text=${encodeURIComponent(bookingDetails)}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              Confirm Booking - AED {calculateTotal()}
            </Button>

            {/* Contact Info */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="text-center text-sm space-y-2">
                  <div className="font-semibold">Need Help?</div>
                  <div>Phone: 600 562624</div>
                  <div>WhatsApp: 600 562624</div>
                  <div>Email: info@ilaj.ae</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedServiceBooking;