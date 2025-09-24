import { useState } from "react";
import { useParams } from "react-router-dom";
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
import { CalendarIcon, Clock, MapPin, Plus, Minus, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const ServiceBooking = () => {
  const { serviceId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const [addOns, setAddOns] = useState<string[]>([]);

  // Mock service data - in real app, this would come from API
  const serviceData = {
    title: "Deep Cleaning Service",
    description: "Complete deep cleaning for your home with professional equipment and eco-friendly products.",
    basePrice: 150,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    duration: "3-4 hours",
    features: ["Deep Kitchen Clean", "Bathroom Sanitization", "Floor Care", "Eco-friendly Products"]
  };

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

  const propertyTypes = [
    "Apartment/Flat", "Villa", "Townhouse", "Studio", "Penthouse", "Office"
  ];

  const calculateTotal = () => {
    let total = serviceData.basePrice * quantity;
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

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service Details & Booking Form */}
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
                      <Badge className="bg-primary/10 text-primary mb-2">Professional Service</Badge>
                      <h1 className="text-2xl font-bold">{serviceData.title}</h1>
                      <p className="text-muted-foreground">{serviceData.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{serviceData.duration}</span>
                      </div>
                      <div className="text-lg font-semibold text-primary">
                        AED {serviceData.basePrice}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {serviceData.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Customize Your Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type, index) => (
                          <SelectItem key={index} value={type.toLowerCase().replace(/\s+/g, '-')}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4">4+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <Label>Service Frequency</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}x</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">
                      {quantity === 1 ? "One-time service" : `${quantity} times per month`}
                    </span>
                  </div>
                </div>

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
                  <p className="text-sm text-muted-foreground mb-4">Enhance your service with these optional add-ons</p>
                  <div className="space-y-3">
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

                {/* Special Instructions */}
                <div>
                  <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                  <Textarea 
                    id="instructions"
                    placeholder="Any specific requirements, access instructions, or areas that need special attention..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary & Contact Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{serviceData.title} x{quantity}</span>
                    <span>AED {serviceData.basePrice * quantity}</span>
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

            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Enter your full name" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="+971 XX XXX XXXX" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                <div>
                  <Label htmlFor="address">Service Address *</Label>
                  <Textarea 
                    id="address"
                    placeholder="Building name, apartment number, street, area, city"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Service Guarantee */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold mb-1">100% Satisfaction Guarantee</div>
                    <p className="text-muted-foreground">
                      Not satisfied with our service? We'll come back and re-do it for free within 24 hours.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Now Button */}
            <Button 
              size="lg" 
              className="w-full bg-gradient-primary hover:bg-primary-hover text-lg py-6"
            >
              Book Now - AED {calculateTotal()}
            </Button>

            {/* Contact Info */}
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Available across UAE</span>
              </div>
              <div>Need help? Call us at +971 XX XXX XXXX</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBooking;