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
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DailyLogEntry {
  id: string;
  sl_number: string;
  customer_name: string;
  mobile_no?: string;
  email_address?: string;
  type_of_work: 'Website Booking' | 'Outside Work' | 'Contract Work';
  description?: string;
  ref_no?: string;
  ilaj_price_aed?: number;
  service_provider?: string;
  service_provider_price?: number;
  remarks?: string;
  payment_mode?: 'Cash' | 'Card' | 'Bank Transfer' | 'Cheque' | 'Online';
  date_of_service?: string;
  time_in?: string;
  amount_as_per_tally?: number;
  invoice_date?: string;
  invoice_number?: string;
  staff_name?: string;
  address?: string;
  sales_invoice_no?: string;
  payment_status: 'Pending' | 'Paid' | 'Partially Paid' | 'Overdue';
  created_at: string;
}

const DailyLogs = () => {
  const [logs, setLogs] = useState<DailyLogEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<DailyLogEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    sl_number: '',
    customer_name: '',
    mobile_no: '',
    email_address: '',
    type_of_work: '',
    description: '',
    ref_no: '',
    ilaj_price_aed: '',
    service_provider: '',
    service_provider_price: '',
    remarks: '',
    payment_mode: '',
    date_of_service: '',
    time_in: '',
    amount_as_per_tally: '',
    invoice_date: '',
    invoice_number: '',
    staff_name: '',
    address: '',
    sales_invoice_no: ''
  });

  useEffect(() => {
    loadDailyLogs();
  }, []);

  const loadDailyLogs = async () => {
    // TODO: Fetch from Supabase
    const mockData: DailyLogEntry[] = [
      {
        id: '1',
        sl_number: 'DL001',
        customer_name: 'Ahmad Al-Rashid',
        mobile_no: '+971501234567',
        email_address: 'ahmad@email.com',
        type_of_work: 'Website Booking',
        description: 'Deep cleaning service - 3 bedroom apartment',
        ref_no: 'REF001',
        ilaj_price_aed: 350,
        service_provider: 'Sarah Mohamed',
        service_provider_price: 250,
        payment_mode: 'Card',
        date_of_service: '2024-09-25',
        time_in: '09:00',
        amount_as_per_tally: 350,
        invoice_number: 'INV-2024-001',
        staff_name: 'Ali Hassan',
        payment_status: 'Paid',
        created_at: '2024-09-25T09:00:00Z'
      }
    ];
    setLogs(mockData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const logEntry = {
        ...formData,
        ilaj_price_aed: formData.ilaj_price_aed ? parseFloat(formData.ilaj_price_aed) : undefined,
        service_provider_price: formData.service_provider_price ? parseFloat(formData.service_provider_price) : undefined,
        amount_as_per_tally: formData.amount_as_per_tally ? parseFloat(formData.amount_as_per_tally) : undefined,
      };

      // TODO: Save to Supabase
      console.log('Saving log entry:', logEntry);

      toast({
        title: "Success",
        description: "Daily log entry saved successfully",
      });

      setIsDialogOpen(false);
      resetForm();
      loadDailyLogs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save daily log entry",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      sl_number: '',
      customer_name: '',
      mobile_no: '',
      email_address: '',
      type_of_work: '',
      description: '',
      ref_no: '',
      ilaj_price_aed: '',
      service_provider: '',
      service_provider_price: '',
      remarks: '',
      payment_mode: '',
      date_of_service: '',
      time_in: '',
      amount_as_per_tally: '',
      invoice_date: '',
      invoice_number: '',
      staff_name: '',
      address: '',
      sales_invoice_no: ''
    });
    setEditingLog(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Partially Paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.sl_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || log.payment_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daily Logs</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLog ? 'Edit' : 'Add'} Daily Log Entry</DialogTitle>
              <DialogDescription>
                Enter the details of the service provided today
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sl_number">SL Number *</Label>
                  <Input
                    id="sl_number"
                    value={formData.sl_number}
                    onChange={(e) => setFormData({...formData, sl_number: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile_no">Mobile Number</Label>
                  <Input
                    id="mobile_no"
                    value={formData.mobile_no}
                    onChange={(e) => setFormData({...formData, mobile_no: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_address">Email Address</Label>
                  <Input
                    id="email_address"
                    type="email"
                    value={formData.email_address}
                    onChange={(e) => setFormData({...formData, email_address: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type_of_work">Type of Work *</Label>
                  <Select value={formData.type_of_work} onValueChange={(value) => setFormData({...formData, type_of_work: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website Booking">Website Booking</SelectItem>
                      <SelectItem value="Outside Work">Outside Work</SelectItem>
                      <SelectItem value="Contract Work">Contract Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ref_no">Reference Number</Label>
                  <Input
                    id="ref_no"
                    value={formData.ref_no}
                    onChange={(e) => setFormData({...formData, ref_no: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ilaj_price_aed">ILAJ Price (AED)</Label>
                  <Input
                    id="ilaj_price_aed"
                    type="number"
                    step="0.01"
                    value={formData.ilaj_price_aed}
                    onChange={(e) => setFormData({...formData, ilaj_price_aed: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_provider">Service Provider</Label>
                  <Input
                    id="service_provider"
                    value={formData.service_provider}
                    onChange={(e) => setFormData({...formData, service_provider: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_provider_price">Service Provider Price (AED)</Label>
                  <Input
                    id="service_provider_price"
                    type="number"
                    step="0.01"
                    value={formData.service_provider_price}
                    onChange={(e) => setFormData({...formData, service_provider_price: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_mode">Payment Mode</Label>
                  <Select value={formData.payment_mode} onValueChange={(value) => setFormData({...formData, payment_mode: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_service">Date of Service</Label>
                  <Input
                    id="date_of_service"
                    type="date"
                    value={formData.date_of_service}
                    onChange={(e) => setFormData({...formData, date_of_service: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time_in">Time In</Label>
                  <Input
                    id="time_in"
                    type="time"
                    value={formData.time_in}
                    onChange={(e) => setFormData({...formData, time_in: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount_as_per_tally">Amount as per Tally</Label>
                  <Input
                    id="amount_as_per_tally"
                    type="number"
                    step="0.01"
                    value={formData.amount_as_per_tally}
                    onChange={(e) => setFormData({...formData, amount_as_per_tally: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoice_date">Invoice Date</Label>
                  <Input
                    id="invoice_date"
                    type="date"
                    value={formData.invoice_date}
                    onChange={(e) => setFormData({...formData, invoice_date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoice_number">Invoice Number</Label>
                  <Input
                    id="invoice_number"
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff_name">Staff Name</Label>
                  <Input
                    id="staff_name"
                    value={formData.staff_name}
                    onChange={(e) => setFormData({...formData, staff_name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sales_invoice_no">Sales Invoice No</Label>
                  <Input
                    id="sales_invoice_no"
                    value={formData.sales_invoice_no}
                    onChange={(e) => setFormData({...formData, sales_invoice_no: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
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
                  {editingLog ? 'Update' : 'Save'} Entry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name or SL number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Log Entries</CardTitle>
          <CardDescription>Complete record of all service activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>ILAJ Price</TableHead>
                  <TableHead>Provider Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.sl_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{log.mobile_no}</div>
                      </div>
                    </TableCell>
                    <TableCell>{log.type_of_work}</TableCell>
                    <TableCell>{log.date_of_service}</TableCell>
                    <TableCell>AED {log.ilaj_price_aed}</TableCell>
                    <TableCell>AED {log.service_provider_price}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.payment_status)}>
                        {log.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
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
    </div>
  );
};

export default DailyLogs;