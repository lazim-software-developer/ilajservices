import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Customer {
  id: string;
  name: string;
  type: 'B2C' | 'Holiday Home' | 'Corporate';
  contact: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Lead';
  address?: string;
  location?: string;
  officeAddress?: string;
  poc?: string;
  numberOfUnits?: number;
  remarks?: string;
}

const CustomerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const loadCustomer = async () => {
    // Mock data - replace with actual API call
    const mockCustomer: Customer = {
      id: id || '1',
      name: 'Ahmed Al Mansouri',
      type: 'B2C',
      contact: '+971501234567',
      email: 'ahmed.mansouri@email.com',
      status: 'Active',
      address: 'Dubai Marina, Block A, Apt 1205',
      location: '25.0772, 55.1388',
      remarks: 'Regular customer, prefers morning slots'
    };

    setCustomer(mockCustomer);
    setFormData(mockCustomer);
  };

  const handleInputChange = (field: keyof Customer, value: any) => {
    if (formData) {
      setFormData(prev => ({ ...prev!, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;

    // Here you would normally send the data to your API
    console.log('Updated Customer Data:', formData);

    toast({
      title: "Success",
      description: "Customer updated successfully",
    });

    navigate(`/admin/customers/${id}`);
  };

  if (!customer || !formData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate(`/admin/customers/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customer
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Customer</h1>
          <p className="text-muted-foreground">Update customer information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="type">Customer Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2C">B2C</SelectItem>
                    <SelectItem value="Holiday Home">Holiday Home</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contact">Phone</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.location && (
                <div>
                  <Label htmlFor="location">Location (Lat/Lon)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              )}
            </div>
            
            {formData.address && (
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                />
              </div>
            )}
            
            {formData.remarks && (
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerEdit;