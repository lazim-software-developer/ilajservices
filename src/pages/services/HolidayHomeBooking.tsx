import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, ArrowLeft, CheckCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const packageData = {
    onetime: {
      title: "One-Time Cleaning",
      subtitle: "One-time Service",
      basePrice: 180,
      sessions: 1,
      scope: "Assessment of office cleaning requirements, performing all essential cleaning duties within allotted time, prioritizing high-traffic areas and common contact surfaces, summarizing completed activities.",
      inclusions: [
        "Complete cleaning with professional materials and equipment",
        "Linen & amenities setup (provided by the holiday home operator)",
        "Trash removal and disposal",
        "Unit inspection with a detailed report",
        "Premium after-cleaning air fragrance",
        "Before, during, and after cleaning photos & Vidoes for records"
      ],
      exclusions: [
        "Repairs & Maintenance",
        "Laundry & Linen (unless included in package)",
        "Moving heavy furniture or re-arranging interiors.",
        "Organizing or handling guests’ personal belongings, valuables, or private storage"
      ],
      terms: [
        "Bookings must be made at least 24 hours in advance",
        "Linen and amenities to be provided by the customer at the site",
        "Full payment required before service delivery",
        "Service issues must be reported within 24 hours"
      ]
    },
    basic: {
      title: "Basic Pack",
      subtitle: "5 cleaning Service",
      basePrice: 750,
      sessions: 5,
      scope: "Complete office cleaning assessment and execution, AC system inspection and maintenance, priority cleaning of high-contact areas, detailed reporting of cleaning and AC service activities.",
      inclusions: [
        "Complete cleaning with professional materials and equipment",
        "Linen & amenities setup (provided by the holiday home operator)",
        "Trash removal and disposal",
        "Unit inspection with a detailed report",
        "Premium after-cleaning air fragrance",
        "Dedicated Service relationship Manager",
        "Before, during, and after cleaning photos & Vidoes for records"
      ],
      exclusions: [
        "Repairs & Maintenance",
        "Laundry & Linen (unless included in package)",
        "Moving heavy furniture or re-arranging interiors.",
        "Organizing or handling guests’ personal belongings, valuables, or private storage"
      ],
      terms: [
        "Bookings must be made at least 24 hours in advance",
        "Linen and amenities to be provided by the customer at the site",
        "Full payment required before service delivery",
        "Service issues must be reported within 24 hours"
      ]
    },
    mid: {
      title: "Mid Pack",
      subtitle: "10 cleaning Service",
      basePrice: 1200,
      sessions: 10,
      scope: "Full facility management including cleaning assessment, AC system comprehensive maintenance, pest control inspection and treatment, duct cleaning and sanitization, complete reporting of all services.",
      inclusions: [
        "Complete cleaning with professional materials and equipment",
        "Linen & amenities setup (provided by the holiday home operator)",
        "Trash removal and disposal",
        "Unit inspection with a detailed report",
        "Premium after-cleaning air fragrance",
        "Dedicated Service relationship Manager",
        "Before, during, and after cleaning photos & Vidoes for records"
      ],
      exclusions: [
        "Repairs & Maintenance",
        "Laundry & Linen (unless included in package)",
        "Moving heavy furniture or re-arranging interiors.",
        "Organizing or handling guests’ personal belongings, valuables, or private storage"
      ],
      terms: [
        "Bookings must be made at least 24 hours in advance",
        "Linen and amenities to be provided by the customer at the site",
        "Full payment required before service delivery",
        "Service issues must be reported within 24 hours"
      ]
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

  // Initialize with the first property type (Studio) selected
  useEffect(() => {
    if (properties.length === 0) {
      setProperties([{ type: propertyTypes[0].type, quantity: 1, pricePerUnit: propertyTypes[0].price }]);
    }
  }, []);

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

  const calculateSubtotal = () => {
    return properties.reduce((sum, p) => sum + (p.quantity * p.pricePerUnit * packageInfo.sessions), 0);
  };

  const calculateTotal = () => {
    if (properties.length === 0) {
      return 0;
    }
    const subtotal = calculateSubtotal();
    return subtotal + subtotal * 0.05; // Adding 5% VAT
  };

  const handleConfirmBooking = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    if (properties.length === 0) {
      toast.error("Please select at least one property type");
      return;
    }

    // Prepare service details for email
    const propertiesText = properties.map(p =>
      `${p.type} x ${p.quantity} = AED ${p.quantity * p.pricePerUnit}`
    ).join('\n');

    const serviceDetails = `Package: ${packageInfo.title}
Sessions: ${packageInfo.sessions}

Properties:
${propertiesText}`;

    // Send email via edge function
    try {
      const { data, error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          customerName,
          customerEmail: customerEmail || "",
          customerPhone,
          serviceType: packageInfo.title,
          serviceDetails,
          totalAmount: calculateTotal(),
          bookingType: 'holiday-home'
        }
      });

      if (error) {
        console.error("Error sending email:", error);
        toast.error("Booking created but email notification failed");
      } else {
        console.log("Email sent successfully:", data);
      }
    } catch (error) {
      console.error("Error invoking email function:", error);
    }

    // Open WhatsApp
    const message = `*Holiday Home Booking*\n\n*Package:* ${packageInfo.title}\n*Sessions:* ${packageInfo.sessions}\n\n*Customer Details:*\nName: ${customerName}\nEmail: ${customerEmail || "Not provided"}\nPhone: ${customerPhone}\n\n*Properties:*\n${properties.map(p => `${p.type} x ${p.quantity} = AED ${p.quantity * p.pricePerUnit}`).join("\n")}\n\n*Total Amount:* AED ${calculateTotal()}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/971600562624?text=${encodedMessage}`, "_blank");

    toast.success("Booking confirmed! Email sent to info@ilaj.ae");
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
            {properties.length > 0 && (
              <div className="flex justify-between">
                <span>{packageInfo.title} ({packageInfo.sessions} sessions, {properties.map(p => p.type).join(", ")})</span>
              </div>
            )}
            {properties.map((property) => (
              <div key={property.type} className="flex justify-between">
                <span>{property.type} x {property.quantity}</span>
                <span className="font-medium">AED {property.quantity * property.pricePerUnit * packageInfo.sessions}</span>
              </div>
            ))}
            {properties.length > 0 && (
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">AED {calculateSubtotal()}</span>
              </div>
            )}
            {properties.length > 0 && (
              <div className="flex justify-between">
                <span>VAT (5%)</span>
                <span className="font-medium">AED {calculateSubtotal() * 0.05}</span>
              </div>
            )}
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
        {/* Service Details (moved to bottom) */}
        <Card className="mt-8">
          <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle>Service Details & Terms</CardTitle>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Scope of Work */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Scope of Work</h3>
                  <p className="text-muted-foreground">{packageInfo.scope}</p>
                </div>

                {/* Inclusions */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-green-600">Inclusions</h3>
                  <ul className="space-y-2">
                    {packageInfo.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-red-600">Exclusions</h3>
                  <ul className="space-y-2">
                    {packageInfo.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-4 h-4 border-2 border-red-600 rounded-full mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Terms & Conditions */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Terms & Conditions</h3>
                  <ul className="space-y-2">
                    {packageInfo.terms.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
}