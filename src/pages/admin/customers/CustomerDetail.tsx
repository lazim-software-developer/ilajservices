import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  Upload,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  Home,
  Users
} from 'lucide-react';

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
  createdAt: string;
  attachments?: Array<{id: string; name: string; type: string; url: string}>;
}

interface BookingHistory {
  id: string;
  service: string;
  date: string;
  status: string;
  amount: number;
}

interface ActivityLog {
  id: string;
  action: string;
  date: string;
  user: string;
  details: string;
}

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCustomerDetails();
  }, [id]);

  const loadCustomerDetails = async () => {
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
      createdAt: '2023-06-01',
      attachments: [
        { id: '1', name: 'ID_Copy.pdf', type: 'pdf', url: '#' },
        { id: '2', name: 'Contract.pdf', type: 'pdf', url: '#' }
      ]
    };

    const mockBookings: BookingHistory[] = [
      { id: '1', service: 'Deep Cleaning', date: '2024-01-15', status: 'Completed', amount: 250 },
      { id: '2', service: 'Sofa Cleaning', date: '2024-01-10', status: 'Completed', amount: 150 },
      { id: '3', service: 'Carpet Cleaning', date: '2023-12-20', status: 'Completed', amount: 200 }
    ];

    const mockActivity: ActivityLog[] = [
      { id: '1', action: 'Booking Created', date: '2024-01-15', user: 'System', details: 'Deep cleaning service booked' },
      { id: '2', action: 'Payment Received', date: '2024-01-15', user: 'Payment Gateway', details: 'AED 250 received' },
      { id: '3', action: 'Profile Updated', date: '2024-01-10', user: 'Admin', details: 'Contact information updated' }
    ];

    setCustomer(mockCustomer);
    setBookingHistory(mockBookings);
    setActivityLog(mockActivity);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'B2C': return <Users className="h-4 w-4" />;
      case 'Holiday Home': return <Home className="h-4 w-4" />;
      case 'Corporate': return <Building className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Lead': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!customer) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/admin/customers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
          <div>
            <div className="flex items-center gap-2">
              {getTypeIcon(customer.type)}
              <h1 className="text-3xl font-bold">{customer.name}</h1>
              <Badge className={getStatusColor(customer.status)}>
                {customer.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{customer.type} Customer</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel Edit' : 'Edit Customer'}
          </Button>
        </div>
      </div>

      {/* Customer Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{customer.contact}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
            {customer.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{customer.address}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Booking History</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Service Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingHistory.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.service}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{booking.status}</Badge>
                      </TableCell>
                      <TableCell>AED {booking.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{activity.action}</p>
                        <Badge variant="outline">{activity.user}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-2">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attachments</CardTitle>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.attachments?.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">{attachment.name}</p>
                      <p className="text-sm text-muted-foreground">{attachment.type.toUpperCase()}</p>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetail;