import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface PropertySelection {
  type: string;
  quantity: number;
  pricePerUnit: number;
}

export default function HolidayHomeBooking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const packageType = searchParams.get("package") || "onetime";
  
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [properties, setProperties] = useState<PropertySelection[]>([]);

  const packageData = {
    onetime: {
      title: "One-Time Cleaning",
      subtitle: "One-time Service",
      basePrice: 180,
      sessions: 1
    },
    basic: {
      title: "Basic Pack",
      subtitle: "5 cleaning Service",
      basePrice: 750,
      sessions: 5
    },
    mid: {
      title: "Mid Pack",
      subtitle: "10 cleaning Service",
      basePrice: 1200,
      sessions: 10
    }
  };

  const packageInfo = packageData[packageType as keyof typeof packageData] || packageData.onetime;

  const propertyTypes = [
    { type: "Studio", price: 180 },
    { type: "1 BR", price: 200 },
    { type: "2 BR", price: 230 },
    { type: "3 BR", price: 250 },
    { type: "4 BR", price: 280 },
    { type: "2 BR Villa", price: 240 },
    { type: "3 BR Villa", price: 260 },
    { type: "4 BR Villa", price: 290 },
    { type: "5 BR Villa", price: 320 }
  ];

  const addPropertyType = (type: string, price: number) => {
    const existing = properties.find(p => p.type === type);
    if (existing) {
      toast.error(`${type} is already added`);
      return;
    }
    setProperties([...properties, { type, quantity: 1, pricePerUnit: price }]);
  };

  const removePropertyType = (type: string) => {
    setProperties(properties.filter(p => p.type !== type));
  };

  const updateQuantity = (type: string, delta: number) => {
    setProperties(properties.map(p => {
      if (p.type === type) {
        const newQuantity = Math.max(1, Math.min(100, p.quantity + delta));
        return { ...p, quantity: newQuantity };
      }
      return p;
    }));
  };

  const setQuantityDirectly = (type: string, value: string) => {
    const numValue = parseInt(value) || 1;
    const clampedValue = Math.max(1, Math.min(100, numValue));
    setProperties(properties.map(p => 
      p.type === type ? { ...p, quantity: clampedValue } : p
    ));
  };

  const calculateTotal = () => {
    return properties.reduce((sum, p) => sum + (p.quantity * p.pricePerUnit), 0);
  };

  const handleConfirmBooking = () => {
    if (!customerName || !customerPhone) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    if (properties.length === 0) {
      toast.error("Please select at least one property type");
      return;
    }

    const message = `*Holiday Home Booking*\n\n*Package:* ${packageInfo.title}\n*Sessions:* ${packageInfo.sessions}\n\n*Customer Details:*\nName: ${customerName}\nEmail: ${customerEmail || "Not provided"}\nPhone: ${customerPhone}\n\n*Properties:*\n${properties.map(p => `${p.type} x ${p.quantity} = AED ${p.quantity * p.pricePerUnit}`).join("\n")}\n\n*Total Amount:* AED ${calculateTotal()}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/971600562624?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/services/holiday-home")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Holiday Home
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{packageInfo.title}</CardTitle>
            <p className="text-muted-foreground">{packageInfo.subtitle}</p>
            <p className="text-2xl font-bold text-primary mt-2">Starting AED {packageInfo.basePrice}</p>
          </CardHeader>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Property Types & Quantities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {propertyTypes.map((pt) => (
                <Button
                  key={pt.type}
                  variant="outline"
                  onClick={() => addPropertyType(pt.type, pt.price)}
                  disabled={properties.some(p => p.type === pt.type)}
                  className="justify-start"
                >
                  {pt.type} - AED {pt.price}
                </Button>
              ))}
            </div>

            {properties.length > 0 && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Selected Properties</h3>
                {properties.map((property) => (
                  <div key={property.type} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{property.type}</p>
                      <p className="text-sm text-muted-foreground">AED {property.pricePerUnit} per unit</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(property.type, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={property.quantity}
                        onChange={(e) => setQuantityDirectly(property.type, e.target.value)}
                        className="w-20 text-center"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(property.type, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePropertyType(property.type)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+971 XXX XXX XXX"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {properties.map((property) => (
              <div key={property.type} className="flex justify-between">
                <span>{property.type} x {property.quantity}</span>
                <span className="font-medium">AED {property.quantity * property.pricePerUnit}</span>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">AED {calculateTotal()}</span>
            </div>
            <Button
              className="w-full bg-gradient-primary hover:bg-primary-hover"
              onClick={handleConfirmBooking}
              disabled={properties.length === 0}
            >
              Confirm Booking
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
