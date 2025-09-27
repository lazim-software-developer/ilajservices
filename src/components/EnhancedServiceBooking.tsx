import { useMemo, useState } from "react";
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
import { CalendarIcon, Clock, Plus, Minus, CheckCircle, X, Info } from "lucide-react";
import { format, formatISO } from "date-fns";
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
  /** Called with all data when user clicks Proceed to Payment */
  onSubmit?: (payload: BookingPayload) => void;
}

type FormState = {
  schedule: {
    date?: Date;
    time?: string;
  };
  selections: {
    unitType?: string;
    customizations: Record<string, any>;
    addOns: string[]; // addon ids
  };
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    unitNumber?: string;
    buildingName?: string;
    location: string;
    landmark?: string;
  };
};

type BookingPayload = {
  service: {
    title: string;
    serviceType?: string;
    category: string;
    description: string;
    image: string;
    basePrice: number;
    duration: string;
  };
  schedule: {
    date: string;        // yyyy-mm-dd
    time: string;        // e.g. "10:00 AM"
    datetimeISO: string; // combined ISO
  };
  selections: {
    unitType?: string;
    customizations: Record<string, any>;
    addOns: Array<{ id: string; name: string; price: number }>;
  };
  pricing: {
    baseService: number;
    addOnsTotal: number;
    grandTotal: number;
    currency: "AED";
    breakdown: Array<{ label: string; amount: number }>;
  };
  customer: FormState["customer"];
  meta: { createdAtISO: string };
};

const EnhancedServiceBooking = ({ serviceData, onSubmit }: ServiceBookingProps) => {
  // ---------- SINGLE STATE ----------
  const [form, setForm] = useState<FormState>({
    schedule: { date: undefined, time: undefined },
    selections: { unitType: undefined, customizations: {}, addOns: [] },
    customer: {
      fullName: "",
      phone: "",
      email: "",
      unitNumber: "",
      buildingName: "",
      location: "",
      landmark: "",
    },
  });

  // tiny helpers
  const update = <K extends keyof FormState>(key: K, value: Partial<FormState[K]>) => {
    setForm((prev) => ({ ...prev, [key]: { ...prev[key], ...value } }));
  };

  const setCustomization = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      selections: {
        ...prev.selections,
        customizations: { ...prev.selections.customizations, [key]: value },
      },
    }));
  };

  const toggleAddon = (id: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      selections: {
        ...prev.selections,
        addOns: checked
          ? [...prev.selections.addOns, id]
          : prev.selections.addOns.filter((x) => x !== id),
      },
    }));
  };

  // ---------- CONFIG ----------
  const getServiceConfig = () => {
    const { title, serviceType } = serviceData;

    switch (serviceType || title.toLowerCase()) {
      case "maid-service":
        return {
          customOptions: {
            maids: { min: 1, max: 8, price: 80 },
            hours: { min: 1, max: 12, price: 20 },
          },
          basePrice: 80,
        };

      case "deep-cleaning":
        return {
          unitTypes: [
            { label: "Studio", price: 150 },
            { label: "1 BR", price: 200 },
            { label: "2 BR", price: 275 },
            { label: "3 BR", price: 350 },
            { label: "4 BR", price: 425 },
            { label: "5 BR", price: 500 },
            { label: "2 BR Villa", price: 400 },
            { label: "3 BR Villa", price: 475 },
            { label: "4 BR Villa", price: 550 },
            { label: "5 BR Villa", price: 625 },
            { label: "Penthouse", price: 700 },
          ],
        };

      case "kitchen-deep-cleaning":
        return {
          unitTypes: [
            { label: "Studio", price: 175 },
            { label: "1 BR", price: 275 },
            { label: "2 BR", price: 275 },
            { label: "3 BR", price: 275 },
            { label: "4 BR", price: 275 },
            { label: "5 BR", price: 300 },
            { label: "2 BR Villa", price: 310 },
            { label: "3 BR Villa", price: 310 },
            { label: "4 BR Villa", price: 310 },
            { label: "5 BR Villa", price: 310 },
            { label: "Penthouse", price: 310 },
          ],
        };

      case "upholstery-sofa-cleaning":
        return {
          customOptions: { seats: { min: 1, max: 20, price: 25 } },
          basePrice: 100,
        };

      case "carpet-cleaning":
        return {
          customOptions: {
            size: [
              { label: "Small", price: 50 },
              { label: "Medium", price: 80 },
              { label: "Large", price: 120 },
              { label: "Extra Large", price: 200 },
            ],
            quantity: { min: 1, max: 10, multiplier: true },
          },
        };

      case "bathroom-deep-cleaning":
        return {
          customOptions: { bathrooms: { min: 1, max: 5, price: 100 } },
          basePrice: 100,
        };

      case "ac-coil-cleaning":
        return {
          customOptions: { units: { min: 1, max: 8, price: 80 } },
          basePrice: 80,
        };

      default:
        return {
          unitTypes: [
            { label: "Studio", price: 200 },
            { label: "1 BR", price: 250 },
            { label: "2 BR", price: 350 },
            { label: "3 BR", price: 450 },
            { label: "4 BR", price: 550 },
            { label: "5 BR", price: 650 },
            { label: "2 BR Villa", price: 500 },
            { label: "3 BR Villa", price: 600 },
            { label: "4 BR Villa", price: 700 },
            { label: "5 BR Villa", price: 800 },
            { label: "Penthouse", price: 900 },
          ],
        };
    }
  };

  const serviceConfig = useMemo(getServiceConfig, [serviceData]);

  // ---------- CONSTANTS ----------
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
    { id: "mattress-cleaning", name: "Mattress Sanitization", price: 35 },
  ];

  const inclusions = [
    "Professional trained staff",
    "All cleaning equipment provided",
    "Eco-friendly cleaning products",
    "Quality assurance guarantee",
    "Insurance coverage",
    "Post-service inspection",
  ];

  const exclusions = [
    "Repair or maintenance work",
    "Moving heavy furniture",
    "Cleaning of valuable items",
    "Pest control treatment",
    "Electrical work",
  ];

  // ---------- PRICING ----------
  const { grandTotal, addOnsTotal, baseService } = useMemo(() => {
    let total = serviceConfig.basePrice ?? serviceData.basePrice;

    // unit-based
    if (serviceConfig.unitTypes && form.selections.unitType) {
      const u = serviceConfig.unitTypes.find((x) => x.label === form.selections.unitType);
      if (u) total = u.price;
    }

    // custom options
    const cz = form.selections.customizations;
    if ((serviceConfig as any).customOptions) {
      Object.entries(cz).forEach(([key, value]) => {
        const option: any = (serviceConfig as any).customOptions[key];
        if (!option || value == null) return;

        if (Array.isArray(option)) {
          const selected = option.find((o: any) => o.label === value);
          if (selected) {
            const qty = Number(cz.quantity ?? 1);
            total = selected.price * qty;
          }
        } else if (option.multiplier && key === "quantity") {
          total *= Number(value);
        } else if (option.price) {
          total += option.price * Number(value);
        }
      });
    }

    // add-ons
    const addTotal = form.selections.addOns.reduce((sum, id) => {
      const a = addOnOptions.find((x) => x.id === id);
      return sum + (a?.price ?? 0);
    }, 0);

    return { grandTotal: total + addTotal, addOnsTotal: addTotal, baseService: total };
  }, [form, serviceConfig, serviceData.basePrice]);

  // ---------- SUBMIT ----------
  const handleSubmit = () => {
    // minimal validation
    if (!form.customer.fullName.trim()) return alert("Please enter your full name.");
    if (!form.customer.phone.trim()) return alert("Please enter your phone number.");
    if (!form.customer.location.trim()) return alert("Please provide your location.");
    if (!form.schedule.date) return alert("Please select a preferred date.");
    if (!form.schedule.time) return alert("Please select a preferred time.");
    console.log("fpr,,,,mmm", form);
    // 12h -> 24h + ISO combine
    const [time, mer] = (form.schedule.time as string).split(" ");
    const [hhRaw, mmRaw] = time.split(":");
    const hh = Number(hhRaw);
    const mm = Number(mmRaw ?? 0);
    const isPM = (mer || "").toUpperCase().startsWith("P");
    const h24 = (hh % 12) + (isPM ? 12 : 0);

    const combined = new Date(form.schedule.date!);
    combined.setHours(h24, mm, 0, 0);

    const payload: BookingPayload = {
      service: {
        title: serviceData.title,
        serviceType: serviceData.serviceType,
        category: serviceData.category,
        description: serviceData.description,
        image: serviceData.image,
        basePrice: serviceData.basePrice,
        duration: serviceData.duration,
      },
      schedule: {
        date: format(form.schedule.date!, "yyyy-MM-dd"),
        time: form.schedule.time!,
        datetimeISO: formatISO(combined),
      },
      selections: {
        unitType: form.selections.unitType,
        customizations: form.selections.customizations,
        addOns: form.selections.addOns.map((id) => {
          const a = addOnOptions.find((x) => x.id === id)!;
          return { id: a.id, name: a.name, price: a.price };
        }),
      },
      pricing: {
        baseService,
        addOnsTotal,
        grandTotal,
        currency: "AED",
        breakdown: [
          { label: "Base Service", amount: baseService },
          ...form.selections.addOns.map((id) => {
            const a = addOnOptions.find((x) => x.id === id)!;
            return { label: a.name, amount: a.price };
          }),
        ],
      },
      customer: {
        fullName: form.customer.fullName.trim(),
        phone: form.customer.phone.trim(),
        email: form.customer.email?.trim() || "",
        unitNumber: form.customer.unitNumber?.trim() || "",
        buildingName: form.customer.buildingName?.trim() || "",
        location: form.customer.location.trim(),
        landmark: form.customer.landmark?.trim() || "",
      },
      meta: { createdAtISO: new Date().toISOString() },
    };

    if (onSubmit) {
      onSubmit(payload);
    } else {
      // fallback demo
      alert("Proceeding with payload:\n\n" + JSON.stringify(payload, null, 2));
    }
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
                        From AED {serviceConfig.basePrice ?? serviceData.basePrice}
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
                <TabsTrigger value="terms">T&amp;C</TabsTrigger>
              </TabsList>

              <TabsContent value="customize" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customize Your Service</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Unit Selection */}
                    {serviceConfig.unitTypes && (
                      <div>
                        <Label>Property Type</Label>
                        <Select onValueChange={(v) => update("selections", { unitType: v })}>
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
                    {(serviceConfig as any).customOptions &&
                      Object.entries((serviceConfig as any).customOptions).map(([key, option]: any) => (
                        <div key={key}>
                          <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                          {Array.isArray(option) ? (
                            <Select onValueChange={(v) => setCustomization(key, v)}>
                              <SelectTrigger>
                                <SelectValue placeholder={`Select ${key}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {option.map((opt: any, idx: number) => (
                                  <SelectItem key={idx} value={opt.label}>
                                    {opt.label} - AED {opt.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  setCustomization(
                                    key,
                                    Math.max(option.min, (form.selections.customizations[key] ?? option.min) - 1)
                                  )
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-16 text-center font-medium">
                                {form.selections.customizations[key] ?? option.min}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  setCustomization(
                                    key,
                                    Math.min(option.max, (form.selections.customizations[key] ?? option.min) + 1)
                                  )
                                }
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

                    {/* Date & Time */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Preferred Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {form.schedule.date ? format(form.schedule.date, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={form.schedule.date}
                              onSelect={(d) => update("schedule", { date: d })}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>Preferred Time</Label>
                        <Select onValueChange={(v) => update("schedule", { time: v })}>
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
                                checked={form.selections.addOns.includes(addon.id)}
                                onCheckedChange={(c) => toggleAddon(addon.id, !!c)}
                              />
                              <label htmlFor={addon.id} className="font-medium cursor-pointer">
                                {addon.name}
                              </label>
                            </div>
                            <Badge className="bg-secondary text-secondary-foreground">+AED {addon.price}</Badge>
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
                          <Input
                            id="customerName"
                            placeholder="Enter your full name"
                            value={form.customer.fullName}
                            onChange={(e) => update("customer", { fullName: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            placeholder="600 562624"
                            value={form.customer.phone}
                            onChange={(e) => update("customer", { phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="info@ilaj.ae"
                            value={form.customer.email}
                            onChange={(e) => update("customer", { email: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="unitNumber">Unit Number</Label>
                          <Input
                            id="unitNumber"
                            placeholder="Apartment/Villa number"
                            value={form.customer.unitNumber}
                            onChange={(e) => update("customer", { unitNumber: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="buildingName">Building Name</Label>
                        <Input
                          id="buildingName"
                          placeholder="Building or complex name"
                          value={form.customer.buildingName}
                          onChange={(e) => update("customer", { buildingName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Textarea
                          id="location"
                          placeholder="Street, area, city, emirate"
                          rows={2}
                          value={form.customer.location}
                          onChange={(e) => update("customer", { location: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input
                          id="landmark"
                          placeholder="Nearby landmark for easy location"
                          value={form.customer.landmark}
                          onChange={(e) => update("customer", { landmark: e.target.value })}
                        />
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
                      Terms &amp; Conditions
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
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Service</span>
                    <span>AED {baseService}</span>
                  </div>
                  {form.selections.addOns.map((addonId) => {
                    const addon = addOnOptions.find((a) => a.id === addonId);
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
                    <span className="text-primary">AED {grandTotal}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Actions */}
            <Button
              size="lg"
              className="w-full bg-gradient-primary hover:bg-primary-hover text-lg py-6"
              onClick={handleSubmit}
            >
              Proceed to Payment - AED {grandTotal}
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
