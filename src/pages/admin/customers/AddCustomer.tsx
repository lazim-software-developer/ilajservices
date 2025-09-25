import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Upload, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FormData {
  customerType: 'B2C' | 'Holiday Home' | 'Corporate' | '';
  // B2C fields
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  address?: string;
  remarks?: string;
  // Holiday Home fields
  holidayHomeName?: string;
  pocName?: string;
  pocPhone?: string;
  pocEmail?: string;
  officeAddress?: string;
  numberOfUnits?: number;
  unitList?: string[];
  contractTerms?: string;
  // Corporate fields
  companyName?: string;
  pocs?: Array<{name: string; phone: string; email: string}>;
}

const AddCustomer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({ customerType: '' });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [corporatePocs, setCorporatePocs] = useState([{ name: '', phone: '', email: '' }]);
  const [units, setUnits] = useState(['']);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addCorporatePoc = () => {
    setCorporatePocs(prev => [...prev, { name: '', phone: '', email: '' }]);
  };

  const removeCorporatePoc = (index: number) => {
    setCorporatePocs(prev => prev.filter((_, i) => i !== index));
  };

  const updateCorporatePoc = (index: number, field: string, value: string) => {
    setCorporatePocs(prev => prev.map((poc, i) => 
      i === index ? { ...poc, [field]: value } : poc
    ));
  };

  const addUnit = () => {
    setUnits(prev => [...prev, '']);
  };

  const removeUnit = (index: number) => {
    setUnits(prev => prev.filter((_, i) => i !== index));
  };

  const updateUnit = (index: number, value: string) => {
    setUnits(prev => prev.map((unit, i) => i === index ? value : unit));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.customerType) {
      toast({
        title: "Error",
        description: "Please select a customer type",
        variant: "destructive",
      });
      return;
    }

    // Type-specific validation
    if (formData.customerType === 'B2C' && (!formData.name || !formData.phone || !formData.email)) {
      toast({
        title: "Error",
        description: "Please fill in all required B2C fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.customerType === 'Holiday Home' && (!formData.holidayHomeName || !formData.phone || !formData.email)) {
      toast({
        title: "Error",
        description: "Please fill in all required Holiday Home fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.customerType === 'Corporate' && (!formData.companyName || !formData.phone || !formData.email)) {
      toast({
        title: "Error",
        description: "Please fill in all required Corporate fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally send the data to your API
    console.log('Form Data:', formData);
    console.log('Attachments:', attachments);
    console.log('Corporate POCs:', corporatePocs);
    console.log('Units:', units);

    toast({
      title: "Success",
      description: "Customer created successfully",
    });

    navigate('/admin/customers');
  };

  const renderB2CForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter customer name"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <Label htmlFor="location">Location (Lat/Lon)</Label>
          <Input
            id="location"
            value={formData.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="25.0772, 55.1388"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter full address"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks || ''}
          onChange={(e) => handleInputChange('remarks', e.target.value)}
          placeholder="Any additional remarks"
          rows={3}
        />
      </div>
    </div>
  );

  const renderHolidayHomeForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="holidayHomeName">Holiday Home Name *</Label>
          <Input
            id="holidayHomeName"
            value={formData.holidayHomeName || ''}
            onChange={(e) => handleInputChange('holidayHomeName', e.target.value)}
            placeholder="Enter holiday home name"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <Label htmlFor="numberOfUnits">Number of Units</Label>
          <Input
            id="numberOfUnits"
            type="number"
            value={formData.numberOfUnits || ''}
            onChange={(e) => handleInputChange('numberOfUnits', parseInt(e.target.value))}
            placeholder="Enter number of units"
          />
        </div>
      </div>

      <Separator />
      <h3 className="text-lg font-semibold">Point of Contact (POC)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="pocName">POC Name</Label>
          <Input
            id="pocName"
            value={formData.pocName || ''}
            onChange={(e) => handleInputChange('pocName', e.target.value)}
            placeholder="Enter POC name"
          />
        </div>
        <div>
          <Label htmlFor="pocPhone">POC Phone</Label>
          <Input
            id="pocPhone"
            value={formData.pocPhone || ''}
            onChange={(e) => handleInputChange('pocPhone', e.target.value)}
            placeholder="Enter POC phone"
          />
        </div>
        <div>
          <Label htmlFor="pocEmail">POC Email</Label>
          <Input
            id="pocEmail"
            type="email"
            value={formData.pocEmail || ''}
            onChange={(e) => handleInputChange('pocEmail', e.target.value)}
            placeholder="Enter POC email"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="officeAddress">Office Address</Label>
        <Textarea
          id="officeAddress"
          value={formData.officeAddress || ''}
          onChange={(e) => handleInputChange('officeAddress', e.target.value)}
          placeholder="Enter office address"
          rows={3}
        />
      </div>

      <Separator />
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Unit List</Label>
          <Button type="button" variant="outline" size="sm" onClick={addUnit}>
            <Plus className="h-4 w-4 mr-2" />
            Add Unit
          </Button>
        </div>
        <div className="space-y-2">
          {units.map((unit, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={unit}
                onChange={(e) => updateUnit(index, e.target.value)}
                placeholder={`Unit ${index + 1}`}
              />
              {units.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeUnit(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="contractTerms">Contract Terms</Label>
        <Textarea
          id="contractTerms"
          value={formData.contractTerms || ''}
          onChange={(e) => handleInputChange('contractTerms', e.target.value)}
          placeholder="Enter contract terms"
          rows={4}
        />
      </div>
    </div>
  );

  const renderCorporateForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName || ''}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="officeAddress">Office Address</Label>
        <Textarea
          id="officeAddress"
          value={formData.officeAddress || ''}
          onChange={(e) => handleInputChange('officeAddress', e.target.value)}
          placeholder="Enter office address"
          rows={3}
        />
      </div>

      <Separator />
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Points of Contact (POCs)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addCorporatePoc}>
            <Plus className="h-4 w-4 mr-2" />
            Add POC
          </Button>
        </div>
        <div className="space-y-4">
          {corporatePocs.map((poc, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">POC {index + 1}</h4>
                {corporatePocs.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCorporatePoc(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  value={poc.name}
                  onChange={(e) => updateCorporatePoc(index, 'name', e.target.value)}
                  placeholder="POC Name"
                />
                <Input
                  value={poc.phone}
                  onChange={(e) => updateCorporatePoc(index, 'phone', e.target.value)}
                  placeholder="POC Phone"
                />
                <Input
                  value={poc.email}
                  onChange={(e) => updateCorporatePoc(index, 'email', e.target.value)}
                  placeholder="POC Email"
                  type="email"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/customers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Customer</h1>
          <p className="text-muted-foreground">Create a new customer profile</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.customerType} 
              onValueChange={(value) => handleInputChange('customerType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B2C">B2C - Individual Customer</SelectItem>
                <SelectItem value="Holiday Home">Holiday Home</SelectItem>
                <SelectItem value="Corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Dynamic Form Based on Customer Type */}
        {formData.customerType && (
          <Card>
            <CardHeader>
              <CardTitle>{formData.customerType} Details</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.customerType === 'B2C' && renderB2CForm()}
              {formData.customerType === 'Holiday Home' && renderHolidayHomeForm()}
              {formData.customerType === 'Corporate' && renderCorporateForm()}
            </CardContent>
          </Card>
        )}

        {/* Attachments */}
        {formData.customerType && (
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formData.customerType === 'Holiday Home' && 
                  'Upload trade license, VAT certificate, and housekeeping contract'}
                {formData.customerType === 'Corporate' && 
                  'Upload trade license and VAT certificate'}
                {formData.customerType === 'B2C' && 
                  'Upload any relevant documents'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
                
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        {formData.customerType && (
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Create Customer
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddCustomer;