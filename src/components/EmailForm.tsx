import React, { useState } from 'react';
import { sendEmail } from '../services/api';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare} from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  message: string;
}

const EmailForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    message: '',
  });
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleServiceChange = (value: string) => {
    setFormData({ ...formData, service: value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSubmitMessage('');
    setError('');

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields (First Name, Last Name, Email, Phone).');
      return;
    }

    // Format email payload
    const emailPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      location: formData.location,
      message: formData.message
    };

    try {
      const result = await sendEmail(emailPayload);
      setSubmitMessage(result.message);
      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        location: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.error || 'Failed to send email');
    }
  };

  const services = [
    "Deep Cleaning",
    "AC Service & Maintenance",
    "Maid Service",
    "Carpet & Upholstery Cleaning",
    "Pest Control",
    "Holiday Home Management",
    "Corporate Cleaning",
    "Painting Services",
    "Packers & Movers",
    "Handyman Services",
    "Other",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Send us a Message
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="service">Service Interested In</Label>
          <Select onValueChange={handleServiceChange} value={formData.service}>
            <SelectTrigger>
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service, index) => (
                <SelectItem key={index} value={service.toLowerCase().replace(/\s+/g, '-')}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your location (Dubai, Abu Dhabi, etc.)"
          />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your requirements, preferred timing, or any special requests..."
            rows={4}
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-primary hover:bg-primary-hover"
        >
          Send Message
        </Button>

        {submitMessage && <p className="text-green-500 text-center">{submitMessage}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default EmailForm;