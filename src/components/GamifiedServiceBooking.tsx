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
        description: "Home is where the heart is but is that any good with all the dust lying around? Get your home squeaky clean and revive that furniture shine with our highly-experienced maids. Our maids are skilled in handling a variety of tasks, such as Dusting, Vacuuming, Mopping and Window Cleaning. Oh! And did we mention washing & ironing of clothes, dishwashing and furniture cleaning are part of the deal? Our maids also come well equipped with the essentials if you lack the cleaning materials and may also be availed privately and for offices.",
        scopeOfWork: [
          "Assessment of works to be carried out upon arrival and following client-specific instructions and requests.",
          "Performing all the essential duties within the allotted time period and prioritizing delicate tasks as a primary. Priority cleaning of areas and surfaces that are commonly in contact.",
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
        description: "Recover your home to its 'day-one' state with our rigorous deep cleaning offerings. Expect a sparkly clean house from tip to toe. Our experienced unit of deep cleaners have you covered with the essentials and will perform the required method as per the condition or specification of your house. Whether its carpet covered floors or tiled walls, we have an eye for stain marks and the equipment to handle it delicately. You can even look forward to a comprehensive scrub of your furniture, countertops and even cabinet interiors. Our products are of approved quality and meet the recommended professional standards. Bank on us to get your home spick and span!",
        scopeOfWork: [
          "Conduct a survey of the premises for recommended methods of application and assess any areas that require urgent attention, such as hardened or dried stained tiles or fabric.",
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
      },
      "upholstery-cleaning": {
        description: "Cleanse your sofa back to its original state with ILAJ's special Sofa cleaning services. Covering various sofa sizes and shapes, our selection of quality products and its skilled and sensitive application will see that you'll be seated in pure bliss and comfort until its next treatment.",
        scopeOfWork: [
          "Acknowledge sofa material and inspect for any stains and damages.",
          "Application of product on the sofa and performing the cleaning with the required machinery delicately.",
          "Review and report cleaned sofa(s), paying heed to prioritized areas."
        ],
        inclusions: [
          "Application of safe and DM approved product",
          "Odourless cleaning and shampoo products",
          "Use of industry-standard polishing methods by trained professional"
        ],
        exclusions: [
          "Treatment of any permanent damage or stain marks, such as tear marks, burn marks, etc.",
          "Any use of harmful chemicals or detergents"
        ]
      },
      "carpet-cleaning": {
        description: "Cleanse your carpet back to its original state with ILAJ's special Carpet cleaning services. Covering various carpet sizes and shapes, our selection of quality products and its skilled and sensitive application will see that your feet will rest upon pure bliss.",
        scopeOfWork: [
          "Acknowledge carpet material and inspect for any stains and damages.",
          "Application of product on the carpet and performing the cleaning with the required machinery in a delicate manner",
          "Review and report cleaned carpet, paying heed to prioritized areas."
        ],
        inclusions: [
          "Application of safe and DM approved product",
          "Odourless cleaning and shampoo products",
          "Use of industry-standard polishing machinery by a trained professional"
        ],
        exclusions: [
          "Treatment of any permanent damage or stain marks, such as tear marks, burn marks, etc.",
          "Any use of harmful chemicals or detergents"
        ]
      },
      "kitchen-deep-cleaning": {
        description: "Recover your home to its 'day-one' state with our rigorous deep cleaning offerings. Expect a sparkly clean kitchen from tip to toe. Our experienced unit of deep cleaners have you covered with the essentials and will perform the required method as per the condition or specification of your home. From the sink to every appliance and all tiled floors and walls, we have an eye for stain marks and the equipment to handle it delicately. You can even look forward to a comprehensive scrub of your countertops, cabinets and other storage units. Our products are of approved quality and meet the recommended professional standards. Bank on us to get your kitchen spick and span!",
        scopeOfWork: [
          "Conduct a survey of the premises for recommended methods of application and assess any areas that require urgent attention, such as hardened or dried stains.",
          "Initiating the cleaning works with the required equipment and chemicals while heeding utmost care to sensitive areas or items.",
          "Use of machinery and its sensitivity for the scrubbing of sinks, countertops, marble or other tiled surfaces.",
          "Upon completion, a thorough inspection and report will be documented of all the tasks carried out during the kitchen deep cleaning session."
        ],
        inclusions: [
          "Comprehensive auto floor scrubbing in all areas and corners with the use of safe cleaning disinfectants",
          "Exterior cleaning of exhaust units for removal of dust, oil and other particles",
          "High-pressure dry vacuuming of sofas, curtains, carpets and other fabrics",
          "Internal cleaning of cabinets, cupboards and other storage facilities"
        ],
        exclusions: [
          "Use of any particular cleaning chemicals suggested or provided by the customer",
          "Full carpet floors or other special treatments are subject to site survey and inspection only"
        ]
      },
      "bathroom-deep-cleaning": {
        description: "Recover your bathroom to its 'day-one' state with our rigorous deep cleaning offerings. Expect a sparkly clean bathroom from tip to toe. Our experienced unit of deep cleaners have you covered with the essentials and will perform the required method as per the condition or specification of your home. From the sink to the tiled walls, we have an eye for stain marks and the equipment to handle it delicately. You can even look forward to a comprehensive scrub of your countertops and cabinet interiors. Our products are of approved quality and meet the recommended professional standards. Bank on us to get your bathroom spick and span!",
        scopeOfWork: [
          "Conduct a survey of the premises for recommended methods of application and assess any areas that require urgent attention, such as hardened or dried stains.",
          "Initiating the cleaning works with the required equipment and chemicals while heeding utmost care to sensitive areas or items.",
          "Use of machinery and its sensitivity to the scrubbing of bathtubs, sinks, floor and wall tiles, marble, etc.",
          "Upon completion, a thorough inspection and report will be documented of all the tasks carried out during the bathroom deep cleaning session."
        ],
        inclusions: [
          "Comprehensive auto floor scrubbing in all areas with the use of safe cleaning disinfectants",
          "Exterior cleaning of exhaust units for removal of dust, oil and other particles",
          "Internal cleaning of cabinets, cupboards and other storage facilities"
        ],
        exclusions: [
          "Use of any particular cleaning chemicals suggested or provided by the customer",
          "Full carpet floors or other special treatments are subject to site survey and inspection only"
        ]
      },
      "ac-service": {
        description: "Our crew of specialized and qualified technicians ensure your Air conditioning systems are maintained properly as we understand the common problem that affects these systems across the region. Your A/C system should keep your family comfortable when outdoor temperatures rise. To ensure this happens, preventative maintenance is critical for a properly functioning and efficient unit. Some issues may allow your system to continue providing cool air but could be wasting energy without your knowledge and eventually causing breakdowns of the entire system.",
        scopeOfWork: [
          "Provide a detailed condition survey report with suggested Corrective actions.",
          "Cleaning of the A/C filters and grills.",
          "Inspecting and Cleaning of the condensate drain tray",
          "Flushing of the A/C drain lines",
          "Checking the condition and Operational status of the thermostat.",
          "Checking up the Oil and Refrigerant gas levels and further topping up.",
          "Check the Condition & Operation of the Indoor fan motor",
          "Check the Condition & Operation of the Outdoor unit for stand-alone systems."
        ],
        inclusions: [
          "Detailed condition survey report",
          "Cleaning of A/C filters and grills",
          "Condensate drain tray inspection and cleaning",
          "A/C drain lines flushing",
          "Thermostat condition and operational check",
          "Oil and refrigerant gas level check and top-up"
        ],
        exclusions: [
          "Spare parts, material and consumables",
          "Evaporator Coil Cleaning",
          "Diffuser Cleaning more than 3 metres",
          "Refrigerant Gas leak rectification",
          "Chilled water line leaks rectification",
          "Gypsum ceiling cutting or any other civil works"
        ]
      },
      "ac-coil-cleaning": {
        description: "ILAJ's trained technicians will carefully clean and sanitise your air-conditioning heating/cooling coil. Coil cleaning has become a specialized area of care within air conditioning systems. The coil is in the airflow path on all air conditioning systems. Therefore, it has a direct effect on the rate of airflow and the efficiency of heat transfer and indoor air quality.",
        scopeOfWork: [
          "The indoor air conditioning unit, which houses the cooling coil, is cleaned of debris using specialized dust extraction equipment.",
          "The internal insulation of the air handling unit is inspected and repaired as necessary.",
          "The evaporator coil fins are then checked for damage and repaired as required.",
          "The AHU internal surfaces & evaporator coil is cleaned."
        ],
        inclusions: [
          "Specialized dust extraction equipment cleaning",
          "Internal insulation inspection and repair",
          "Evaporator coil fins damage check and repair",
          "AHU internal surfaces cleaning"
        ],
        exclusions: [
          "Spare parts, material and consumables"
        ]
      },
      "ac-duct-cleaning": {
        description: "ILAJ's trained technicians will carefully clean your air-conditioning and air-duct system. Duct cleaning removes contaminants. This improves indoor air quality, airflow, odors, operation costs and occupant's health. After the system is cleaned, there will be a noticeable reduction in dust, and diffusers will be visibly cleaner.",
        scopeOfWork: [
          "Air handling units - We remove debris, dust, lint, carbon and other contaminants from the air handling unit (AHU).",
          "Return air system - The return air system clean includes the removal of contaminants from internal surfaces of rigid and flexible duct, any internal flow control devices, i.e., dampers or vanes, and registers.",
          "Supply air system - The supply system clean consists of contaminant removal from internal surfaces of rigid and flexible duct, any internal flow control devices, i.e., dampers and vanes, and diffusers."
        ],
        inclusions: [
          "Air handling units debris removal",
          "Return air system contamination cleaning",
          "Supply air system contamination cleaning",
          "Internal surfaces cleaning of rigid and flexible ducts"
        ],
        exclusions: [
          "Spare parts, material and consumables"
        ]
      },
      "ac-duct-coil-cleaning": {
        description: "ILAJ's trained technicians will carefully clean your air-conditioning and air-duct system.",
        scopeOfWork: [
          "AC Coil Cleaning - The indoor air conditioning unit, which houses the cooling coil, is cleaned of debris using specialized dust extraction equipment. The internal insulation of the air handling unit is inspected and repaired as necessary. The evaporator coil fins are then checked for damage and repaired as required. The AHU internal surfaces & evaporator coil is cleaned.",
          "AC Duct Cleaning - Air handling units: We remove debris, dust, lint, carbon and other contaminants from the air handling unit (AHU). Return air system and Supply air system cleaning of all internal surfaces."
        ],
        inclusions: [
          "Complete AC coil cleaning service",
          "Complete AC duct cleaning service",
          "Specialized equipment cleaning",
          "Internal surfaces and components cleaning"
        ],
        exclusions: [
          "Spare parts, material and consumables"
        ]
      },
      "pest-control": {
        description: "Pesky pests can pose a threat to your wellbeing, let alone the condition of your house. They carry the potential to cause both illness and financial loss. Reclaim your territory with ILAJ's team of pest killing professionals. Our technicians will see that your property is ridden of all nasty creepy crawlies and help you to practice the best preventive measures to avoid an infestation. We're skilled in exterminating various pests from roaches to rats and ensure you the applied treatment is completely safe to yourself and your home.",
        scopeOfWork: [
          "Inspect potential areas of a breach where the property may be accessible to pests.",
          "Examine any evidence of existing pests and tracking the source of the infestation.",
          "Applying pesticide treatment thoroughly in all areas of the premises and potential routes.",
          "Review and advise the customer if follow up treatment is required and instruct on prevention practices."
        ],
        inclusions: [
          "Application of safe and DM approved pesticides for general pests as well as individual treatments for specific pests",
          "The guarantee period of 90 days applies to all treatments",
          "Odourless gel and spray treatments"
        ],
        exclusions: [
          "Post-treatment cleaning",
          "Relocation of furniture",
          "Use of scaffolding or ladder equipment"
        ],
      },
      "painting": {
        description: "Liven up the atmosphere with a fresh coat of paint. Get rid of those stained and cracked walls with our professional painters and increase your standard of living with some new vibrant tones for your home.",
        scopeOfWork: [
          "Inspection of all walls for any cracks or crevices and any damage that may require minimal plastering.",
          "Applying protective sheets over nearby furniture or items to avoid spillage or smudging of paint",
          "Applying paint in layers per room",
          "Removal and disposal of protective sheets and arrangement of any furniture back to its original location",
          "Inspecting the newly painted walls and rooms for any errors, smudges or stains and ensuring the colour shade is uniform throughout."
        ],
        inclusions: [
          "Jotun Fenomastic Paint",
          "Plastering of minimal cracks in walls",
          "All essential protective gear and painting tools"
        ],
        exclusions: [
          "Painting of ceiling is excluded from the above-mentioned price. For ceiling painting, an additional 10% will be charged.",
          "Any colour paints are other than common shades of White and Off-White",
          "Any additional effects such as texturing"
        ]
      },
      "packers-movers": {
        description: "Our Professional movers and packers in the market make the whole process of home moving much more efficient and seamless. We handle every situation in a planned and proper manner while on the go. Regardless of your moving requirements, we take everything into account, strategize and execute plans to provide maximum coverage. Pre-site visits are always preferred. Our Price Inclusive of Basic Handyman Services. 3 days prior booking require for movers. Our Price inclusive of dismantling, Packing, moving and Professional Setup of stuffs from home to home / office to office. Insurance service cost you additional amount (Optional)",
        scopeOfWork: [
          "Pre-site visit and assessment",
          "Professional dismantling of furniture and fixtures",
          "Careful packing using quality materials",
          "Safe transportation to destination",
          "Professional setup and arrangement at new location"
        ],
        inclusions: [
          "Basic handyman services",
          "Dismantling, packing, moving and professional setup",
          "Quality packing materials",
          "Professional team and equipment"
        ],
        exclusions: [
          "Insurance service (optional at additional cost)",
          "Storage services",
          "Cleaning services at old or new location"
        ]
      },
      "handyman": {
        description: "Professional handyman services for home repairs and maintenance tasks.",
        scopeOfWork: [
          "Assessment of repair and maintenance requirements",
          "Professional execution of assigned tasks",
          "Quality assurance and cleanup"
        ],
        inclusions: [
          "Professional handyman service",
          "Basic tools and equipment",
          "Quality workmanship"
        ],
        exclusions: [
          "Materials and spare parts",
          "Electrical or plumbing work requiring licenses"
        ]
      }
    };
    
    return serviceDetails[serviceType as keyof typeof serviceDetails] || serviceDetails["deep-cleaning"];
  };

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
            {/* <Card className={cn("transition-all duration-500", showAddOnPulse && "ring-2 ring-secondary animate-pulse")}>
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
            </Card> */}

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
                        disabled={(date) => date < getMinimumDate()}
                        initialFocus
                        className="pointer-events-auto"
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
                  if (!selectedDate || !selectedTime || !customerInfo.name || !customerInfo.phone || !customerInfo.location) {
                    toast({
                      title: "Missing Information",
                      description: "Please fill in all required fields",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  const bookingDetails = `
🏠 *ILAJ Service Booking*

📋 *Service:* ${serviceData.title}
${propertyType ? `🏘️ *Property:* ${propertyType}` : ''}
${numberOfUnits > 1 ? `🔢 *Units:* ${numberOfUnits}` : ''}
${quantity > 1 ? `🔢 *Quantity:* ${quantity}` : ''}
📅 *Date:* ${selectedDate ? format(selectedDate, "PPP") : 'Not selected'}
⏰ *Time:* ${selectedTime || 'Not selected'}
💰 *Total Amount:* AED ${getFinalPrice().toFixed(2)}

👤 *Customer Details:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Email: ${customerInfo.email || 'Not provided'}
Location: ${customerInfo.location}
Building: ${customerInfo.buildingName || 'Not provided'}
Unit: ${customerInfo.unitNumber || 'Not provided'}

${addOns.length > 0 ? `✅ *Add-ons:* ${addOns.join(', ')}` : ''}
${specialRequests ? `📝 *Special Requests:* ${specialRequests}` : ''}
                  `.trim();

                  // Send email notification
                  supabase.functions.invoke('send-booking-email', {
                    body: {
                      customerName: customerInfo.name,
                      customerEmail: customerInfo.email || "",
                      customerPhone: customerInfo.phone,
                      serviceType: serviceData.title,
                      serviceDetails: bookingDetails,
                      totalAmount: getFinalPrice(),
                      bookingType: 'professional'
                    }
                  }).then(({ error }) => {
                    if (error) {
                      console.error("Error sending email:", error);
                    }
                  });
                  
                  const whatsappUrl = `https://wa.me/971600562624?text=${encodeURIComponent(bookingDetails)}`;
                  window.open(whatsappUrl, '_blank');
                  
                  toast({
                    title: "Booking Sent! ✅",
                    description: "Your booking details have been sent via WhatsApp and email",
                  });
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                Confirm Booking - AED {getFinalPrice().toFixed(2)}
              </Button>
              
              <div className="text-center text-xs text-muted-foreground">
                🔒 Secure booking via WhatsApp
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Details Section - Moved to Bottom */}
      <Card className="overflow-hidden mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6 text-primary" />
            Service Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Description
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed">
                  {getServiceDetails(serviceData.serviceType || "").description}
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="scope">
              <AccordionTrigger className="flex items-center gap-2">
                <Clipboard className="h-4 w-4" />
                Scope of Work
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {getServiceDetails(serviceData.serviceType || "").scopeOfWork.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="inclusions">
              <AccordionTrigger className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                What's Included
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {getServiceDetails(serviceData.serviceType || "").inclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="exclusions">
              <AccordionTrigger className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                What's Not Included
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {getServiceDetails(serviceData.serviceType || "").exclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
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