import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Building2, Users, Calendar, Clock, MapPin, Phone, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface CorporateServiceData {
  title: string;
  description: string;
  basePrice: number;
  image: string;
  duration: string;
  category: string;
  serviceType: string;
}

interface CorporateServiceBookingProps {
  serviceData: CorporateServiceData;
}

const CorporateServiceBooking = ({ serviceData }: CorporateServiceBookingProps) => {
  const [selectedOfficeSize, setSelectedOfficeSize] = useState("1000");
  const [selectedACUnits, setSelectedACUnits] = useState("1");
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    specialRequirements: ''
  });
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const officeSizes = [
    { value: "1000", label: "1000 SQ.FT", multiplier: 1 },
    { value: "1500", label: "1000 - 2000 SQ.FT", multiplier: 1.5 },
    { value: "2500", label: "2000 - 3000 SQ.FT", multiplier: 2.5 },
    { value: "3500", label: "3000 - 4000 SQ.FT", multiplier: 3.5 },
    { value: "4500", label: "4000 - 5000 SQ.FT", multiplier: 4.5 }
  ];

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  const getMinDate = () => {
    const now = new Date();
    now.setHours(now.getHours() + 22);
    return now.toISOString().split('T')[0];
  };

  const calculatePrice = () => {
    const sizeMultiplier = officeSizes.find(size => size.value === selectedOfficeSize)?.multiplier || 1;
    const cleaningPrice = serviceData.basePrice * sizeMultiplier;
    
    let totalPrice = cleaningPrice;
    let breakdown = [`Cleaning Service: AED ${cleaningPrice.toFixed(2)}`];
    
    if (serviceData.serviceType === 'essential-package' || serviceData.serviceType === 'comprehensive-package') {
      const acPrice = 150 * parseInt(selectedACUnits);
      totalPrice += acPrice;
      breakdown.push(`AC Servicing (${selectedACUnits} units): AED ${acPrice.toFixed(2)}`);
    }
    
    if (serviceData.serviceType === 'comprehensive-package') {
      const pestPrice = 420;
      const ductPrice = 250 * parseInt(selectedACUnits);
      totalPrice += pestPrice + ductPrice;
      breakdown.push(`Pest Control (yearly): AED ${pestPrice.toFixed(2)}`);
      breakdown.push(`AC Duct Cleaning (${selectedACUnits} units): AED ${ductPrice.toFixed(2)}`);
    }
    
    return { totalPrice, breakdown };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.companyName || !formData.contactPerson || !formData.email || 
        !formData.phone || !formData.address || !formData.preferredDate || !formData.preferredTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { totalPrice } = calculatePrice();
    
    toast.success("Booking request submitted successfully! We'll contact you within 24 hours to confirm your corporate service.", {
      description: `Total estimated cost: AED ${totalPrice.toFixed(2)}`
    });
  };

  const { totalPrice, breakdown } = calculatePrice();

  const serviceDetails = {
    "basic-package": {
      scope: "Assessment of office cleaning requirements, performing all essential cleaning duties within allotted time, prioritizing high-traffic areas and common contact surfaces, summarizing completed activities.",
      inclusions: [
        "Office desk and surface cleaning",
        "Restroom and kitchen cleaning", 
        "Trash removal and disposal",
        "Floor mopping with disinfectant",
        "Window cleaning (interior)",
        "Meeting room setup and cleaning"
      ],
      exclusions: [
        "Use of customer-provided cleaning materials",
        "Cleaning of areas requiring heavy equipment or ladders",
        "Personal desk items organization",
        "Exterior window cleaning above ground floor"
      ],
      terms: [
        "Minimum 6-month contract required",
        "24-hour advance booking for service changes",
        "Full payment required before service delivery", 
        "Service issues must be reported within 24 hours"
      ]
    },
    "essential-package": {
      scope: "Complete office cleaning assessment and execution, AC system inspection and maintenance, priority cleaning of high-contact areas, detailed reporting of cleaning and AC service activities.",
      inclusions: [
        "All Basic Package services",
        "AC filter cleaning and replacement",
        "Thermostat inspection and calibration",
        "Condensate drain cleaning",
        "AC coil basic maintenance",
        "System operational testing",
        "Quarterly maintenance reports"
      ],
      exclusions: [
        "AC spare parts and refrigerant gas",
        "Major AC repairs or replacements",
        "Duct cleaning (available in Comprehensive package)",
        "Electrical work beyond basic connections"
      ],
      terms: [
        "Minimum 12-month contract for AC services",
        "Quarterly AC maintenance schedule",
        "48-hour notice for AC service appointments",
        "Separate invoicing for parts if required"
      ]
    },
    "comprehensive-package": {
      scope: "Full facility management including cleaning assessment, AC system comprehensive maintenance, pest control inspection and treatment, duct cleaning and sanitization, complete reporting of all services.",
      inclusions: [
        "All Essential Package services", 
        "Comprehensive pest inspection and treatment",
        "AC duct cleaning and sanitization",
        "Indoor air quality improvement",
        "Preventive pest control measures",
        "Annual facility health reports",
        "Priority emergency service calls"
      ],
      exclusions: [
        "Structural pest damage repairs",
        "HVAC system modifications or upgrades", 
        "Specialized pest treatments (termites require separate quote)",
        "Weekend emergency calls (additional charges apply)"
      ],
      terms: [
        "Annual contract with comprehensive coverage",
        "Bi-annual pest control treatments", 
        "Annual duct cleaning schedule",
        "24/7 emergency support hotline available"
      ]
    }
  };

  const currentServiceDetails = serviceDetails[serviceData.serviceType as keyof typeof serviceDetails];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            {serviceData.category}
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
            {serviceData.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {serviceData.description}
          </p>
        </div>

        {/* Service Image */}
        <div className="mb-8">
          <img 
            src={serviceData.image} 
            alt={serviceData.title}
            className="w-full h-64 object-cover rounded-lg shadow-soft"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Corporate Service Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Office Size Selection */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Office Size</Label>
                    <Select value={selectedOfficeSize} onValueChange={setSelectedOfficeSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {officeSizes.map(size => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* AC Units (for packages that include AC service) */}
                  {(serviceData.serviceType === 'essential-package' || serviceData.serviceType === 'comprehensive-package') && (
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Number of AC Units</Label>
                      <Select value={selectedACUnits} onValueChange={setSelectedACUnits}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(20)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1} Unit{i + 1 > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Separator />

                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Company Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                          placeholder="Enter contact person name"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Office Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Enter complete office address"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Scheduling */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Preferred Schedule</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate">Preferred Date *</Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          min={getMinDate()}
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredTime">Preferred Time *</Label>
                        <Select value={formData.preferredTime} onValueChange={(value) => setFormData({...formData, preferredTime: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                      placeholder="Any specific cleaning requirements, access instructions, or special considerations..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Submit Corporate Service Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{serviceData.title}</p>
                    <p className="text-sm text-muted-foreground">{serviceData.duration}</p>
                  </div>
                </div>
                
                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Office Size:</span>
                    <span className="font-medium">
                      {officeSizes.find(size => size.value === selectedOfficeSize)?.label}
                    </span>
                  </div>
                  {(serviceData.serviceType === 'essential-package' || serviceData.serviceType === 'comprehensive-package') && (
                    <div className="flex justify-between">
                      <span>AC Units:</span>
                      <span className="font-medium">{selectedACUnits} unit{parseInt(selectedACUnits) > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  {breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.split(':')[0]}:</span>
                      <span>{item.split(':')[1]}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total Monthly:</span>
                  <span className="text-primary">AED {totalPrice.toFixed(2)}</span>
                </div>

                <div className="text-xs text-muted-foreground">
                  * Prices shown are monthly estimates. Final pricing will be confirmed during site visit.
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">600 562624</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">info@ilaj.ae</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mon-Sat: 9AM-6PM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

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
                  <p className="text-muted-foreground">{currentServiceDetails.scope}</p>
                </div>

                {/* Inclusions */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-green-600">Inclusions</h3>
                  <ul className="space-y-2">
                    {currentServiceDetails.inclusions.map((item, index) => (
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
                    {currentServiceDetails.exclusions.map((item, index) => (
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
                    {currentServiceDetails.terms.map((item, index) => (
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
};

export default CorporateServiceBooking;