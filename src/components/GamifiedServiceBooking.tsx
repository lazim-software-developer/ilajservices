import { useMemo, useState, useEffect } from "react";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  CalendarIcon, Clock, MapPin, Star, Plus, Minus, ShoppingCart, Sparkles, Gift,
  Zap, Target, Trophy, Gamepad2, Info, CheckCircle, XCircle, Clipboard
} from "lucide-react";
import { format, formatISO } from "date-fns";
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
  /** Called with a full payload when user proceeds to pay */
  onSubmit?: (payload: BookingPayload) => void;
}

/** Single-source-of-truth form state */
type FormState = {
  schedule: { date?: Date; time?: string };
  customer: {
    name: string; phone: string; email: string;
    buildingName: string; location: string; unitNumber: string; landmark: string;
  };
  selections: {
    addOns: string[];                 // e.g. "materials", "leather", "Half Truck"
    propertyType?: string;            // Studio, 1 BR, etc.
    carpetSize?: string;              // Small/Medium/Large
    pestType?: "general" | "mosquito" | "bedbug" | "rodent";
    region?: "dubai" | "abudhabi";    // for movers
    customizations: {
      quantity?: number;              // maids
      hours?: number;                 // maid/handyman
      numberOfSeats?: number;         // upholstery
      numberOfCarpets?: number;       // carpet
      numberOfBathrooms?: number;     // bathroom deep clean
      numberOfUnits?: number;         // AC services
      specialRequests?: string;
      truck?: "half" | "full" | undefined; // movers
    };
  };
};

type BookingPayload = {
  service: GamifiedServiceBookingProps["serviceData"];
  schedule: { date: string; time: string; datetimeISO: string };
  customer: FormState["customer"];
  selections: {
    addOns: string[];
    propertyType?: string;
    carpetSize?: string;
    pestType?: string;
    region?: string;
    customizations: FormState["selections"]["customizations"];
  };
  pricing: {
    subtotal: number;
    discountRate: number;
    discountAmount: number;
    total: number;
    currency: "AED";
  };
  meta: { createdAtISO: string };
};

const GamifiedServiceBooking = ({ serviceData, onSubmit }: GamifiedServiceBookingProps) => {
  const { toast } = useToast();

  // ---------------- ONE FORM STATE ----------------
  const [form, setForm] = useState<FormState>({
    schedule: { date: undefined, time: "" },
    customer: {
      name: "", phone: "", email: "", buildingName: "", location: "",
      unitNumber: "", landmark: ""
    },
    selections: {
      addOns: [],
      propertyType: "",
      carpetSize: "",
      pestType: "general",
      region: "dubai",
      customizations: {
        quantity: 1, hours: 2, numberOfSeats: 1, numberOfCarpets: 1,
        numberOfBathrooms: 1, numberOfUnits: 1, specialRequests: "", truck: undefined
      }
    }
  });

  // tiny helpers
  const update = <K extends keyof FormState>(key: K, value: Partial<FormState[K]>) =>
    setForm(prev => ({ ...prev, [key]: { ...prev[key], ...value } }));

  const updateSel = (value: Partial<FormState["selections"]>) =>
    setForm(prev => ({ ...prev, selections: { ...prev.selections, ...value } }));

  const updateCz = (value: Partial<FormState["selections"]["customizations"]>) =>
    setForm(prev => ({
      ...prev,
      selections: { ...prev.selections, customizations: { ...prev.selections.customizations, ...value } }
    }));

  const toggleAddon = (name: string, checked: boolean) =>
    setForm(prev => ({
      ...prev,
      selections: {
        ...prev.selections,
        addOns: checked
          ? [...prev.selections.addOns, name]
          : prev.selections.addOns.filter(a => a !== name)
      }
    }));

  // ---------------- UI STATES (visual only) ----------------
  const [showDiscountAnimation, setShowDiscountAnimation] = useState(false);
  const [showAddOnPulse, setShowAddOnPulse] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];
  const propertyTypes = ["Studio", "1 BR", "2 BR", "3 BR", "4 BR", "5 BR", "2 BR villa", "3 BR villa", "4 BR villa", "5 BR villa", "Penthouse"];

  const getMinimumDate = () => {
    const now = new Date();
    return new Date(now.getTime() + 22 * 60 * 60 * 1000);
  };

  // ---------------- Pricing logic (using single form) ----------------
  const calculatePrice = useMemo(() => {
    return () => {
      const addOns = form.selections.addOns;
      const {
        propertyType, carpetSize, pestType = "general", region = "dubai",
        customizations: { quantity = 1, hours = 2, numberOfSeats = 1, numberOfCarpets = 1,
          numberOfBathrooms = 1, numberOfUnits = 1, truck }
      } = form.selections;

      let basePrice = serviceData.basePrice;

      switch (serviceData.serviceType) {
        case "maid-service": {
          const materialsCost = addOns.includes("materials") ? 11 : 0;
          basePrice = (basePrice + materialsCost) * quantity * hours;
          break;
        }
        case "deep-cleaning": {
          const p = {
            "Studio": 345, "1 BR": 460, "2 BR": 570, "3 BR": 685, "4 BR": 860,
            "1 BR villa": 745, "2 BR villa": 915, "3 BR villa": 1145, "4 BR villa": 1370, "5 BR villa": 1830
          };
          basePrice = (p as any)[propertyType] ?? basePrice;
          break;
        }
        case "upholstery-cleaning": {
          const perSeat = addOns.includes("leather") ? 46 : 30;
          basePrice = perSeat * numberOfSeats;
          break;
        }
        case "carpet-cleaning": {
          const p = { Small: 75, Medium: 105, Large: 150 };
          basePrice = ((p as any)[carpetSize || "Small"] ?? 75) * numberOfCarpets;
          break;
        }
        case "mattress-cleaning": {
          const p = { Single: 115, Queen: 175, King: 185 };
          basePrice = (p as any)[propertyType || "Single"] ?? 115;
          break;
        }
        case "kitchen-deep-cleaning": {
          const p = { Small: 170, Medium: 230, Large: 345 };
          basePrice = (p as any)[propertyType || "Small"] ?? 170;
          break;
        }
        case "bathroom-deep-cleaning": {
          basePrice = 170 * numberOfBathrooms;
          break;
        }
        case "pest-control": {
          const prices = {
            general: { "Studio": 120, "1 BR": 120, "2 BR": 150, "3 BR": 180, "4 BR": 240, "5 BR": 276, "1 BR villa": 180, "2 BR villa": 228, "3 BR villa": 288, "4 BR villa": 348, "5 BR villa": 408 },
            mosquito: { "Studio": 150, "1 BR": 150, "2 BR": 200, "3 BR": 240, "4 BR": 280, "5 BR": 350, "2 BR villa": 270, "3 BR villa": 300, "4 BR villa": 370, "5 BR villa": 380 },
            bedbug: { "Studio": 144, "1 BR": 156, "2 BR": 180, "3 BR": 228, "4 BR": 276, "5 BR": 300, "1 BR villa": 240, "2 BR villa": 324, "3 BR villa": 348, "4 BR villa": 420, "5 BR villa": 480 },
            rodent: { "Studio": 170, "1 BR": 170, "2 BR": 250, "3 BR": 280, "4 BR": 320, "5 BR": 350, "1 BR villa": 230, "2 BR villa": 265, "3 BR villa": 300, "4 BR villa": 350, "5 BR villa": 380 }
          } as const;
          const t = pestType as keyof typeof prices;
          basePrice = (prices[t] as any)[propertyType || "Studio"] ?? 120;
          break;
        }
        case "ac-service": basePrice = 150 * numberOfUnits; break;
        case "ac-duct-cleaning": basePrice = 350 * numberOfUnits; break;
        case "ac-coil-cleaning": basePrice = 375 * numberOfUnits; break;
        case "ac-duct-coil-cleaning": basePrice = 475 * numberOfUnits; break;
        case "painting": {
          const p = {
            "Studio": 600, "1 BR": 840, "2 BR": 1200, "3 BR": 1680, "4 BR": 2450, "5 BR": 2800,
            "1 BR villa": 1450, "2 BR villa": 1920, "3 BR villa": 2400, "4 BR villa": 3150, "5 BR villa": 3850
          };
          basePrice = (p as any)[propertyType || "Studio"] ?? 600;
          break;
        }
        case "packers-movers": {
          const prices = {
            dubai: { "Studio": 743, "1 BR": 943, "2 BR": 1657, "3 BR": 1900, "4 BR": 3095, "5 BR": 4571, "2 BR villa": 1857, "3 BR villa": 2810, "4 BR villa": 3762, "5 BR villa": 4714 },
            abudhabi: { "Studio": 1229, "1 BR": 1610, "2 BR": 1895, "3 BR": 3324, "4 BR": 3800, "2 BR villa": 2371, "3 BR villa": 3514, "4 BR villa": 4752, "5 BR villa": 5657 }
          } as const;
          basePrice = (prices as any)[region]?.[propertyType || "Studio"] ?? 743;
          if (truck === "half") basePrice += region === "dubai" ? 367 : 810;
          if (truck === "full") basePrice += region === "dubai" ? 629 : 1238;
          break;
        }
        case "handyman": basePrice = 150 * hours; break;
        default: basePrice = serviceData.basePrice;
      }

      // common add-ons (exclude ones priced in service logic)
      const addonPricing: Record<string, number> = {
        "Deep Carpet Clean": 100, "Window Cleaning": 150, "Appliance Clean": 200,
        "Sanitization": 120, "Upholstery Treatment": 180, "Pest Control Add-on": 250
      };
      const serviceSpecific = new Set(["materials", "leather", "mosquito-fly", "bedbug", "rodent", "abudhabi", "Half Truck", "Full Truck"]);
      const addOnTotal = addOns.reduce((sum, a) => {
        if (serviceSpecific.has(a)) return sum;
        return sum + (addonPricing[a] || 0);
      }, 0);

      return basePrice + addOnTotal;
    };
  }, [form, serviceData]);

  const calculateDiscount = (total: number) => (total >= 1000 ? 0.07 : total >= 500 ? 0.05 : 0);
  const subtotal = useMemo(() => calculatePrice(), [calculatePrice]);
  const discountRate = useMemo(() => calculateDiscount(subtotal), [subtotal]);
  const discountAmount = useMemo(() => subtotal * discountRate, [subtotal, discountRate]);
  const totalPrice = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  // ---------------- Gamification effects ----------------
  useEffect(() => {
    let steps = 0;
    if (form.schedule.date) steps++;
    if (form.schedule.time) steps++;
    if (form.customer.name) steps++;
    if (form.customer.phone) steps++;
    const cz = form.selections.customizations;
    if (form.selections.propertyType || (cz.quantity ?? 1) > 1 || (cz.hours ?? 2) > 2) steps++;

    if (steps > completedSteps) {
      setCompletedSteps(steps);
      if (steps === 5) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      toast({ title: `Step ${steps}/5 Complete! 🎉`, description: "You're making great progress!" });
    }
  }, [form]);

  useEffect(() => {
    if (subtotal >= 400 && subtotal < 1000) {
      setShowDiscountAnimation(true);
      const t = setTimeout(() => setShowDiscountAnimation(false), 4000);
      return () => clearTimeout(t);
    }
  }, [subtotal]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAddOnPulse(true);
      setTimeout(() => setShowAddOnPulse(false), 1000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- Service details (unchanged content) ----------------
  const getServiceDetails = (serviceType: string) => {
    /* (keep your existing large service details object exactly as-is) */
    // ... SNIPPED FOR BREVITY: paste your getServiceDetails definition here unchanged ...
    // RETURN the same object as in your original code:
    const serviceDetails = { /* ... your existing content ... */ } as any;
    return serviceDetails[serviceType] || serviceDetails["deep-cleaning"];
  };

  // ---------------- Customization UI (now updates single form) ----------------
  const renderCustomizationOptions = () => {
    const addOns = form.selections.addOns;
    switch (serviceData.serviceType) {
      case "maid-service":
        return (
          <div className="space-y-6">
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" /> Materials Included
              </Label>
              <div className="mt-2 space-y-2">
                <div
                  className={cn("p-3 rounded-lg border cursor-pointer transition-all",
                    !addOns.includes("materials") ? "border-secondary bg-secondary/10" : "border-muted")}
                  onClick={() => toggleAddon("materials", false)}
                >
                  <div className="font-medium">Without Materials - AED 34/hour</div>
                  <div className="text-sm text-muted-foreground">You provide cleaning materials</div>
                </div>
                <div
                  className={cn("p-3 rounded-lg border cursor-pointer transition-all",
                    addOns.includes("materials") ? "border-secondary bg-secondary/10" : "border-muted")}
                  onClick={() => toggleAddon("materials", true)}
                >
                  <div className="font-medium">With Materials - AED 45/hour</div>
                  <div className="text-sm text-muted-foreground">We bring professional cleaning materials</div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" /> Number of Maids (1-8)
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <Button variant="outline" size="icon"
                  onClick={() => updateCz({ quantity: Math.max(1, (form.selections.customizations.quantity ?? 1) - 1) })}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="bg-primary/10 rounded-lg px-6 py-3 font-bold text-xl text-primary animate-pulse">
                  {form.selections.customizations.quantity}
                </div>
                <Button variant="outline" size="icon"
                  onClick={() => updateCz({ quantity: Math.min(8, (form.selections.customizations.quantity ?? 1) + 1) })}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="animate-fade-in delay-200">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" /> Hours (1-12)
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <Button variant="outline" size="icon"
                  onClick={() => updateCz({ hours: Math.max(1, (form.selections.customizations.hours ?? 2) - 1) })}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="bg-secondary/10 rounded-lg px-6 py-3 font-bold text-xl text-secondary animate-pulse">
                  {form.selections.customizations.hours}
                </div>
                <Button variant="outline" size="icon"
                  onClick={() => updateCz({ hours: Math.min(12, (form.selections.customizations.hours ?? 2) + 1) })}>
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
                  className={cn("p-3 rounded-lg border cursor-pointer transition-all",
                    !addOns.includes("leather") ? "border-secondary bg-secondary/10" : "border-muted")}
                  onClick={() => toggleAddon("leather", false)}
                >
                  <div className="font-medium">Fabric - AED 30 per seat</div>
                </div>
                <div
                  className={cn("p-3 rounded-lg border cursor-pointer transition-all",
                    addOns.includes("leather") ? "border-secondary bg-secondary/10" : "border-muted")}
                  onClick={() => toggleAddon("leather", true)}
                >
                  <div className="font-medium">Leather - AED 46 per seat</div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" /> Number of Seats
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <Button variant="outline" size="icon"
                  onClick={() => updateCz({ numberOfSeats: Math.max(1, (form.selections.customizations.numberOfSeats ?? 1) - 1) })}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="bg-primary/10 rounded-lg px-6 py-3 font-bold text-xl text-primary animate-pulse">
                  {form.selections.customizations.numberOfSeats}
                </div>
                <Button variant="outline" size="icon"
                  onClick={() => updateCz({ numberOfSeats: (form.selections.customizations.numberOfSeats ?? 1) + 1 })}>
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
              <Select onValueChange={(v) => updateSel({ carpetSize: v })}>
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
                <Button variant="outline" size="icon"
                  onClick={() => updateCz({ numberOfCarpets: Math.max(1, (form.selections.customizations.numberOfCarpets ?? 1) - 1) })}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="bg-primary/10 rounded-lg px-6 py-3 font-bold text-xl text-primary animate-pulse">
                  {form.selections.customizations.numberOfCarpets}
                </div>
                <Button variant="outline" size="icon"
                  onClick={() => updateCz({ numberOfCarpets: (form.selections.customizations.numberOfCarpets ?? 1) + 1 })}>
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
            <Select onValueChange={(v) => updateSel({ propertyType: v })}>
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
            <Select onValueChange={(v) => updateSel({ propertyType: v })}>
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
              <Target className="h-5 w-5 text-secondary" /> Number of Bathrooms (1-5) - AED 170 each
            </Label>
            <div className="flex items-center gap-4 mt-2">
              <Button variant="outline" size="icon"
                onClick={() => updateCz({ numberOfBathrooms: Math.max(1, (form.selections.customizations.numberOfBathrooms ?? 1) - 1) })}>
                <Minus className="h-4 w-4" />
              </Button>
              <div className="bg-primary/10 rounded-lg px-6 py-3 font-bold text-xl text-primary animate-pulse">
                {form.selections.customizations.numberOfBathrooms}
              </div>
              <Button variant="outline" size="icon"
                onClick={() => updateCz({ numberOfBathrooms: Math.min(5, (form.selections.customizations.numberOfBathrooms ?? 1) + 1) })}>
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
                  className={cn("p-3 rounded-lg border cursor-pointer transition-all",
                    form.selections.pestType === "general" ? "border-secondary bg-secondary/10" : "border-muted")}
                  onClick={() => updateSel({ pestType: "general", addOns: form.selections.addOns.filter(a => !["mosquito-fly", "bedbug", "rodent"].includes(a)) })}
                >
                  <div className="font-medium">General Pest Control</div>
                </div>
                {[
                  { key: "mosquito-fly", label: "Mosquito & Fly Control", type: "mosquito" as const },
                  { key: "bedbug", label: "Bedbug Control", type: "bedbug" as const },
                  { key: "rodent", label: "Rodent/Rat Control", type: "rodent" as const }
                ].map(({ key, label, type }) => (
                  <div
                    key={key}
                    className={cn("p-3 rounded-lg border cursor-pointer transition-all",
                      form.selections.pestType === type ? "border-secondary bg-secondary/10" : "border-muted")}
                    onClick={() => {
                      const filtered = form.selections.addOns.filter(a => !["mosquito-fly", "bedbug", "rodent"].includes(a));
                      updateSel({ pestType: type, addOns: [...filtered, key] });
                    }}
                  >
                    <div className="font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fade-in">
              <Label className="text-lg font-semibold">Property Type</Label>
              <Select onValueChange={(v) => updateSel({ propertyType: v })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
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
                  className={cn("p-3 rounded-lg border cursor-pointer transition-all",
                    form.selections.region === "dubai" ? "border-secondary bg-secondary/10" : "border-muted")}
                  onClick={() => updateSel({ region: "dubai", addOns: form.selections.addOns.filter(a => a !== "abudhabi") })}
                >
                  <div className="font-medium">Dubai Region</div>
                </div>
                <div
                  className={cn("p-3 rounded-lg border cursor-pointer transition-all",
                    form.selections.region === "abudhabi" ? "border-secondary bg-secondary/10" : "border-muted")}
                  onClick={() => updateSel({ region: "abudhabi", addOns: [...form.selections.addOns.filter(a => a !== "abudhabi"), "abudhabi"] })}
                >
                  <div className="font-medium">Abu Dhabi Region</div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in">
              <Label className="text-lg font-semibold">Property Type</Label>
              <Select onValueChange={(v) => updateSel({ propertyType: v })}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select your property type" /></SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="animate-fade-in">
              <Label className="text-lg font-semibold">Truck Size</Label>
              <div className="mt-2 space-y-2">
                <div
                  className={cn("p-3 rounded-lg border cursor-pointer transition-all",
                    form.selections.customizations.truck === undefined ? "border-secondary bg-secondary/10" : "border-muted")}
                  onClick={() => updateCz({ truck: undefined })}
                >
                  <div className="font-medium">No Truck</div>
                </div>
                <div
                  className={cn("p-3 rounded-lg border cursor-pointer transition-all",
                    form.selections.customizations.truck === "half" ? "border-secondary bg-secondary/10" : "border-muted")}
                  onClick={() => updateCz({ truck: "half" })}
                >
                  <div className="font-medium">Half Truck</div>
                </div>
                <div
                  className={cn("p-3 rounded-lg border cursor-pointer transition-all",
                    form.selections.customizations.truck === "full" ? "border-secondary bg-secondary/10" : "border-muted")}
                  onClick={() => updateCz({ truck: "full" })}
                >
                  <div className="font-medium">Full Truck</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "handyman":
        return (
          <div className="animate-fade-in delay-200">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" /> Hours - AED 150/hour
            </Label>
            <div className="flex items-center gap-4 mt-2">
              <Button variant="outline" size="icon"
                onClick={() => updateCz({ hours: Math.max(1, (form.selections.customizations.hours ?? 2) - 1) })}>
                <Minus className="h-4 w-4" />
              </Button>
              <div className="bg-secondary/10 rounded-lg px-6 py-3 font-bold text-xl text-secondary animate-pulse">
                {form.selections.customizations.hours}
              </div>
              <Button variant="outline" size="icon"
                onClick={() => updateCz({ hours: (form.selections.customizations.hours ?? 2) + 1 })}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      default:
        if (["ac-service", "ac-duct-cleaning", "ac-coil-cleaning", "ac-duct-coil-cleaning"].includes(serviceData.serviceType || "")) {
          return (
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" /> Number of AC Units (1-8)
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <Button variant="outline" size="icon"
                  onClick={() => updateCz({ numberOfUnits: Math.max(1, (form.selections.customizations.numberOfUnits ?? 1) - 1) })}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="bg-primary/10 rounded-lg px-6 py-3 font-bold text-xl text-primary animate-pulse">
                  {form.selections.customizations.numberOfUnits}
                </div>
                <Button variant="outline" size="icon"
                  onClick={() => updateCz({ numberOfUnits: Math.min(8, (form.selections.customizations.numberOfUnits ?? 1) + 1) })}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        }
        return (
          <div className="animate-fade-in">
            <Label className="text-lg font-semibold">Property Type</Label>
            <Select onValueChange={(v) => updateSel({ propertyType: v })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select your property type" /></SelectTrigger>
              <SelectContent>
                {propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        );
    }
  };

  // ---------------- Submit ----------------
  const handleSubmit = () => {
    if (!form.schedule.date) return toast({ title: "Pick a date", variant: "destructive" });
    if (!form.schedule.time) return toast({ title: "Pick a time", variant: "destructive" });
    if (!form.customer.name.trim()) return toast({ title: "Enter your name", variant: "destructive" });
    if (!form.customer.phone.trim()) return toast({ title: "Enter your phone", variant: "destructive" });
    if (!form.customer.location.trim()) return toast({ title: "Enter your location", variant: "destructive" });

    // combine date + time (12h to 24h)
    const [t, mer] = (form.schedule.time as string).split(" ");
    const [hhS, mmS] = (t || "10:00").split(":");
    const isPM = (mer || "").toUpperCase().startsWith("P");
    const hh24 = ((Number(hhS) % 12) + (isPM ? 12 : 0)) || 0;
    const mm = Number(mmS || 0);
    const combined = new Date(form.schedule.date);
    combined.setHours(hh24, mm, 0, 0);

    const payload: BookingPayload = {
      service: { ...serviceData },
      schedule: {
        date: format(form.schedule.date, "yyyy-MM-dd"),
        time: form.schedule.time!,
        datetimeISO: formatISO(combined),
      },
      customer: { ...form.customer },
      selections: {
        addOns: [...form.selections.addOns],
        propertyType: form.selections.propertyType,
        carpetSize: form.selections.carpetSize,
        pestType: form.selections.pestType,
        region: form.selections.region,
        customizations: { ...form.selections.customizations },
      },
      pricing: {
        subtotal,
        discountRate,
        discountAmount,
        total: totalPrice,
        currency: "AED",
      },
      meta: { createdAtISO: new Date().toISOString() },
    };

    onSubmit
      ? onSubmit(payload)
      : alert("Proceeding with payload:\n\n" + JSON.stringify(payload, null, 2));
  };

  // ---------------- AVAILABLE ADD-ONS (visual list only) ----------------
  const availableAddOns = useMemo(() => {
    const base = ["Deep Carpet Clean", "Window Cleaning", "Appliance Clean", "Sanitization", "Upholstery Treatment"];
    return serviceData.serviceType === "packers-movers" ? [...base, "Half Truck", "Full Truck"] : [...base, "Pest Control Add-on"];
  }, [serviceData.serviceType]);

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-muted/30 to-muted/10">
      <div className="container mx-auto px-4 max-w-7xl">
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="animate-bounce text-6xl">🎉</div>
          </div>
        )}

        {/* Progress */}
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
                <div className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(completedSteps / 5) * 100}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <Card className="overflow-hidden">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={serviceData.image} alt={serviceData.title} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge className="bg-secondary mb-2">{serviceData.category}</Badge>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">{serviceData.title}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1"><Clock className="h-4 w-4" /><span>{serviceData.duration}</span></div>
                    <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span>4.9</span></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customization */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-secondary animate-spin" />
                  Customize Your Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">{renderCustomizationOptions()}</CardContent>
            </Card>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader><CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5 text-primary" />Select Date</CardTitle></CardHeader>
                <CardContent>
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
                        onSelect={(d) => update("schedule", { date: d ?? undefined })}
                        disabled={(date) => date < getMinimumDate()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Select Time</CardTitle></CardHeader>
                <CardContent>
                  <Select onValueChange={(v) => update("schedule", { time: v })}>
                    <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Customer */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Your Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" value={form.customer.name}
                      onChange={(e) => update("customer", { name: e.target.value })} placeholder="Enter your full name" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" value={form.customer.phone}
                      onChange={(e) => update("customer", { phone: e.target.value })} placeholder="600 562624" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={form.customer.email}
                      onChange={(e) => update("customer", { email: e.target.value })} placeholder="info@ilaj.ae" />
                  </div>
                  <div>
                    <Label htmlFor="unitNumber">Unit Number</Label>
                    <Input id="unitNumber" value={form.customer.unitNumber}
                      onChange={(e) => update("customer", { unitNumber: e.target.value })} placeholder="Apartment/Villa number" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="buildingName">Building Name</Label>
                  <Input id="buildingName" value={form.customer.buildingName}
                    onChange={(e) => update("customer", { buildingName: e.target.value })} placeholder="Building or complex name" />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Textarea id="location" value={form.customer.location}
                    onChange={(e) => update("customer", { location: e.target.value })}
                    placeholder="Street, area, city, emirate" rows={2} />
                </div>
                <div>
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input id="landmark" value={form.customer.landmark}
                    onChange={(e) => update("customer", { landmark: e.target.value })} placeholder="Nearby landmark" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>AED {subtotal.toFixed(2)}</span></div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 animate-pulse">
                    <span className="flex items-center gap-1"><Gift className="h-4 w-4" />Discount ({(discountRate * 100).toFixed(0)}%)</span>
                    <span>-AED {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total Price</span>
                  <span className="text-lg font-semibold text-primary">AED {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {showDiscountAnimation && subtotal < 1000 && (
                <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 p-4 rounded-lg border border-secondary/30 animate-bounce">
                  <div className="flex items-center gap-2 text-secondary">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">
                      Add AED {(1000 - subtotal).toFixed(2)} more to get 7% discount!
                    </span>
                  </div>
                </div>
              )}

              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover transition-all duration-300 transform hover:scale-105"
                size="lg"
                disabled={!form.schedule.date || !form.schedule.time || !form.customer.name || !form.customer.phone}
                onClick={handleSubmit}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Proceed to Payment - AED {totalPrice.toFixed(2)}
              </Button>

              <div className="text-center text-xs text-muted-foreground">🔒 Secure payment powered by trusted partners</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Details */}
      <Card className="overflow-hidden mt-8">
        <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-6 w-6 text-primary" />Service Details</CardTitle></CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger className="flex items-center gap-2"><Info className="h-4 w-4" />Description</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed">
                  {getServiceDetails(serviceData.serviceType || "")?.description}
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="scope">
              <AccordionTrigger className="flex items-center gap-2"><Clipboard className="h-4 w-4" />Scope of Work</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {getServiceDetails(serviceData.serviceType || "")?.scopeOfWork.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="inclusions">
              <AccordionTrigger className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />What's Included</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {getServiceDetails(serviceData.serviceType || "")?.inclusions.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="exclusions">
              <AccordionTrigger className="flex items-center gap-2"><XCircle className="h-4 w-4 text-red-600" />What's Not Included</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {getServiceDetails(serviceData.serviceType || "")?.exclusions.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamifiedServiceBooking;
