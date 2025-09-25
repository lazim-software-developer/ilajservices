import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import BulkCustomerUpload from '@/components/BulkCustomerUpload';

type CustomerType = 'B2C' | 'Holiday Home' | 'Corporate';
type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiating' | 'Won' | 'Lost';
type BookingStatus = 'Inquiry' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
type ContractStatus = 'None' | 'Draft' | 'Sent' | 'Signed' | 'Active' | 'Expired';

interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  customer_type: CustomerType;
  lead_status: LeadStatus;
  booking_status: BookingStatus;
  contract_status: ContractStatus;
  created_at: string;
  
  // Type-specific fields
  location?: string;
  address?: string;
  remarks?: string;
  poc_name?: string;
  manager_name?: string;
  number_of_units?: number;
  company_name?: string;
}

interface CustomerAttachment {
  id: string;
  customer_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [attachments, setAttachments] = useState<CustomerAttachment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    customer_type: '' as CustomerType,
    location: '',
    address: '',
    remarks: '',
    poc_name: '',
    manager_name: '',
    number_of_units: '',
    company_name: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    // TODO: Fetch from Supabase
    const mockData: Customer[] = [
      {
        id: '1',
        name: 'Ahmad Al-Rashid',
        phone: '+971501234567',
        email: 'ahmad@email.com',
        customer_type: 'B2C',
        lead_status: 'Won',
        booking_status: 'Completed',
        contract_status: 'None',
        location: 'Dubai Marina',
        address: 'Marina Plaza, Tower 1, Apt 1205',
        remarks: 'Regular customer, prefers morning slots',
        created_at: '2024-09-01T10:00:00Z'
      },
      {
        id: '2',
        name: 'Luxury Stays LLC',
        phone: '+971501234568',
        email: 'manager@luxurystays.ae',
        customer_type: 'Holiday Home',
        lead_status: 'Qualified',
        booking_status: 'Confirmed',
        contract_status: 'Active',
        poc_name: 'Sarah Johnson',
        manager_name: 'Mohammed Ali',
        number_of_units: 15,
        remarks: 'Premium holiday home management company',
        created_at: '2024-08-15T14:30:00Z'
      }
    ];
    setCustomers(mockData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const customerData = {
        ...formData,
        number_of_units: formData.number_of_units ? parseInt(formData.number_of_units) : undefined,
      };

      // TODO: Save to Supabase
      console.log('Saving customer:', customerData);

      toast({
        title: "Success",
        description: "Customer saved successfully",
      });

      setIsDialogOpen(false);
      resetForm();
      loadCustomers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save customer",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      customer_type: '' as CustomerType,
      location: '',
      address: '',
      remarks: '',
      poc_name: '',
      manager_name: '',
      number_of_units: '',
      company_name: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Won': case 'Active': case 'Completed': return 'bg-green-100 text-green-800';
      case 'New': case 'Inquiry': case 'Draft': return 'bg-blue-100 text-blue-800';
      case 'Contacted': case 'Confirmed': case 'Sent': return 'bg-yellow-100 text-yellow-800';
      case 'Lost': case 'Cancelled': case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone?.includes(searchTerm);
    const matchesType = filterType === 'all' || customer.customer_type === filterType;
    const matchesStatus = filterStatus === 'all' || customer.lead_status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const renderCustomerTypeFields = () => {
    switch (formData.customer_type) {
      case 'B2C':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </>
        );
      
      case 'Holiday Home':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="poc_name">Point of Contact</Label>
              <Input
                id="poc_name"
                value={formData.poc_name}
                onChange={(e) => setFormData({...formData, poc_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager_name">Manager Name</Label>
              <Input
                id="manager_name"
                value={formData.manager_name}
                onChange={(e) => setFormData({...formData, manager_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number_of_units">Number of Units</Label>
              <Input
                id="number_of_units"
                type="number"
                value={formData.number_of_units}
                onChange={(e) => setFormData({...formData, number_of_units: e.target.value})}
              />
            </div>
          </>
        );
      
      case 'Corporate':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poc_name">Point of Contact</Label>
              <Input
                id="poc_name"
                value={formData.poc_name}
                onChange={(e) => setFormData({...formData, poc_name: e.target.value})}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const viewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer profile with detailed information
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer_type">Customer Type *</Label>
                  <Select value={formData.customer_type} onValueChange={(value: CustomerType) => setFormData({...formData, customer_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B2C">B2C</SelectItem>
                      <SelectItem value="Holiday Home">Holiday Home</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {renderCustomerTypeFields()}
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Customer
                </Button>
              </div>
            </form>
            </DialogContent>
        </Dialog>
      </div>
      
      {/* Bulk Upload Section */}
      <div className="mb-6">
        <BulkCustomerUpload onUploadComplete={loadCustomers} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="B2C">B2C</SelectItem>
                <SelectItem value="Holiday Home">Holiday Home</SelectItem>
                <SelectItem value="Corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>Manage all customer information and lead status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Lead Status</TableHead>
                  <TableHead>Booking Status</TableHead>
                  <TableHead>Contract Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        {customer.customer_type === 'Corporate' && customer.company_name && (
                          <div className="text-sm text-muted-foreground">{customer.company_name}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{customer.customer_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{customer.phone}</div>
                        <div className="text-muted-foreground">{customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.lead_status)}>
                        {customer.lead_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.booking_status)}>
                        {customer.booking_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.contract_status)}>
                        {customer.contract_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => viewCustomerDetails(customer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
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

      {/* Customer Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCustomer.name} - Customer Details</DialogTitle>
                <DialogDescription>
                  Complete customer information and activity history
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Customer Type</Label>
                          <div className="mt-1">
                            <Badge variant="secondary">{selectedCustomer.customer_type}</Badge>
                          </div>
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <div className="mt-1">{selectedCustomer.phone || 'N/A'}</div>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <div className="mt-1">{selectedCustomer.email || 'N/A'}</div>
                        </div>
                        <div>
                          <Label>Lead Status</Label>
                          <div className="mt-1">
                            <Badge className={getStatusColor(selectedCustomer.lead_status)}>
                              {selectedCustomer.lead_status}
                            </Badge>
                          </div>
                        </div>
                        {selectedCustomer.customer_type === 'Holiday Home' && (
                          <div>
                            <Label>Number of Units</Label>
                            <div className="mt-1">{selectedCustomer.number_of_units || 'N/A'}</div>
                          </div>
                        )}
                        {selectedCustomer.customer_type === 'Corporate' && (
                          <div>
                            <Label>Company Name</Label>
                            <div className="mt-1">{selectedCustomer.company_name || 'N/A'}</div>
                          </div>
                        )}
                      </div>
                      {selectedCustomer.remarks && (
                        <div className="mt-4">
                          <Label>Remarks</Label>
                          <div className="mt-1 text-sm text-muted-foreground">{selectedCustomer.remarks}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="bookings">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center text-muted-foreground">
                        Customer booking history will be displayed here
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="attachments">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Customer Attachments</h4>
                        <Button size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload File
                        </Button>
                      </div>
                      <div className="text-center text-muted-foreground">
                        No attachments uploaded yet
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center text-muted-foreground">
                        Customer activity timeline will be displayed here
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;