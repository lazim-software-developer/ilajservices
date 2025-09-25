import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Search, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  payment_status: string;
  total_amount: number;
  final_amount: number;
  notes?: string;
  customers: { name: string; email: string; phone: string; };
  services: { name: string; category: string; };
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
    
    const channel = supabase.channel('booking-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchBookings())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`*, customers (name, email, phone), services (name, category)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch bookings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
      if (error) throw error;
      toast({ title: "Booking Updated", description: `Status updated to ${status}.` });
      fetchBookings();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update booking.", variant: "destructive" });
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customers.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customers.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    const icons = {
      confirmed: <CheckCircle className="h-4 w-4 text-secondary" />,
      pending: <Clock className="h-4 w-4 text-orange-500" />,
      completed: <CheckCircle className="h-4 w-4 text-green-500" />,
      cancelled: <XCircle className="h-4 w-4 text-destructive" />
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = { 
      pending: "outline", confirmed: "secondary", completed: "default", cancelled: "destructive" 
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.final_amount, 0)
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Booking Management</h1>
          <p className="text-sm text-muted-foreground">Manage customer bookings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Pending</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-orange-500">{stats.pending}</div></CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Confirmed</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-secondary">{stats.confirmed}</div></CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Completed</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-500">{stats.completed}</div></CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Revenue</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">AED {stats.revenue.toLocaleString()}</div></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader><CardTitle>Recent Bookings</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="table-row-hover">
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.customers.name}</div>
                      <div className="text-sm text-muted-foreground">{booking.customers.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.services.name}</div>
                      <Badge variant="outline" className="text-xs">{booking.services.category}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{new Date(booking.booking_date).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.booking_time ? new Date(`1970-01-01T${booking.booking_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">AED {booking.final_amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      {getStatusBadge(booking.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Booking Details</DialogTitle></DialogHeader>
                          {selectedBooking && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium">Customer</h4>
                                <p>{selectedBooking.customers.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedBooking.customers.email}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Service</h4>
                                <p>{selectedBooking.services.name}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Amount</h4>
                                <p>AED {selectedBooking.final_amount}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Select onValueChange={(value) => updateBookingStatus(booking.id, value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Update" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirm</SelectItem>
                          <SelectItem value="completed">Complete</SelectItem>
                          <SelectItem value="cancelled">Cancel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingManagement;