import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, Edit, Trash2, Upload, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ServiceProvider {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  vat_number?: string;
  trade_license?: string;
  other_documents?: any;
  services_provided: string[];
  agreed_price_per_service?: any;
  contract_details?: any;
  is_available: boolean;
  created_at: string;
}

const ServiceProviders = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ServiceProvider | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vat_number: '',
    trade_license: '',
    services_provided: [] as string[],
    contract_details: '',
    is_available: true
  });

  const availableServices = [
    'Deep Cleaning',
    'Regular Cleaning',
    'Carpet Cleaning',
    'Window Cleaning',
    'Kitchen Deep Clean',
    'Bathroom Deep Clean',
    'Upholstery Cleaning',
    'Move-in/Move-out Cleaning',
    'Office Cleaning',
    'Post-Construction Cleaning'
  ];

  useEffect(() => {
    loadServiceProviders();
  }, []);

  const loadServiceProviders = async () => {
    // TODO: Fetch from Supabase
    const mockData: ServiceProvider[] = [
      {
        id: '1',
        name: 'Sarah Mohamed',
        email: 'sarah.m@email.com',
        phone: '+971501234567',
        vat_number: 'VAT123456789',
        trade_license: 'TL987654321',
        services_provided: ['Deep Cleaning', 'Regular Cleaning', 'Kitchen Deep Clean'],
        is_available: true,
        created_at: '2024-09-01T10:00:00Z'
      },
      {
        id: '2',
        name: 'Ahmed Ali Cleaning Services',
        email: 'ahmed@cleaningservices.ae',
        phone: '+971501234568',
        vat_number: 'VAT987654321',
        trade_license: 'TL123456789',
        services_provided: ['Office Cleaning', 'Post-Construction Cleaning', 'Carpet Cleaning'],
        is_available: true,
        created_at: '2024-08-15T14:30:00Z'
      }
    ];
    setProviders(mockData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Save to Supabase
      console.log('Saving service provider:', formData);

      toast({
        title: "Success",
        description: "Service provider saved successfully",
      });

      setIsDialogOpen(false);
      resetForm();
      loadServiceProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service provider",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      vat_number: '',
      trade_license: '',
      services_provided: [],
      contract_details: '',
      is_available: true
    });
    setEditingProvider(null);
  };

  const toggleAvailability = async (providerId: string, currentStatus: boolean) => {
    // TODO: Update in Supabase
    setProviders(providers.map(p => 
      p.id === providerId ? { ...p, is_available: !currentStatus } : p
    ));
    
    toast({
      title: "Success",
      description: `Provider availability ${!currentStatus ? 'enabled' : 'disabled'}`,
    });
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services_provided: prev.services_provided.includes(service)
        ? prev.services_provided.filter(s => s !== service)
        : [...prev.services_provided, service]
    }));
  };

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Service Providers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProvider ? 'Edit' : 'Add'} Service Provider</DialogTitle>
              <DialogDescription>
                Manage service provider information and contract details
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Provider Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vat_number">VAT Number</Label>
                  <Input
                    id="vat_number"
                    value={formData.vat_number}
                    onChange={(e) => setFormData({...formData, vat_number: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trade_license">Trade License</Label>
                  <Input
                    id="trade_license"
                    value={formData.trade_license}
                    onChange={(e) => setFormData({...formData, trade_license: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Availability Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_available}
                      onCheckedChange={(checked) => setFormData({...formData, is_available: checked})}
                    />
                    <span className="text-sm">{formData.is_available ? 'Available' : 'Unavailable'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Services Provided</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableServices.map(service => (
                    <div key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={service}
                        checked={formData.services_provided.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={service} className="text-sm">{service}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract_details">Contract Details</Label>
                <Textarea
                  id="contract_details"
                  value={formData.contract_details}
                  onChange={(e) => setFormData({...formData, contract_details: e.target.value})}
                  placeholder="Contract terms, pricing agreements, special conditions..."
                />
              </div>

              <div className="space-y-2">
                <Label>Documents</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Upload VAT certificate, trade license, and other required documents
                  </p>
                  <Button type="button" variant="outline" className="mt-2">
                    Choose Files
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProvider ? 'Update' : 'Save'} Provider
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search service providers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Providers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Service Providers</CardTitle>
          <CardDescription>Manage your network of service providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div className="font-medium">{provider.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{provider.phone}</div>
                        <div className="text-muted-foreground">{provider.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {provider.services_provided.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {provider.services_provided.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{provider.services_provided.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {provider.vat_number && <Badge variant="outline">VAT</Badge>}
                        {provider.trade_license && <Badge variant="outline">TL</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={provider.is_available}
                          onCheckedChange={() => toggleAvailability(provider.id, provider.is_available)}
                        />
                        <span className="text-sm">
                          {provider.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{providers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {providers.filter(p => p.is_available).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {providers.filter(p => !p.is_available).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceProviders;