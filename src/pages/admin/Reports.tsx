import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, TrendingUp, Users, DollarSign, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ReportData {
  totalBookings: number;
  totalRevenue: number;
  newCustomers: number;
  completionRate: number;
  topServices: Array<{ name: string; count: number; revenue: number }>;
  monthlyTrend: Array<{ month: string; revenue: number; bookings: number }>;
}

const Reports = () => {
  const [reportData, setReportData] = useState<ReportData>({
    totalBookings: 0,
    totalRevenue: 0,
    newCustomers: 0,
    completionRate: 0,
    topServices: [],
    monthlyTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last-30-days');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case 'last-7-days':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'last-30-days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case 'last-3-months':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case 'last-year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Fetch bookings data
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name),
          customers (id)
        `)
        .gte('booking_date', startDate.toISOString().split('T')[0])
        .lte('booking_date', endDate.toISOString().split('T')[0]);

      if (bookingsError) throw bookingsError;

      // Calculate metrics
      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, b) => sum + b.final_amount, 0) || 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
      const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

      // Get unique customers
      const uniqueCustomers = new Set(bookings?.map(b => b.customer_id)).size;

      // Top services
      const serviceStats = bookings?.reduce((acc, booking) => {
        const serviceName = booking.services?.name || 'Unknown';
        if (!acc[serviceName]) {
          acc[serviceName] = { count: 0, revenue: 0 };
        }
        acc[serviceName].count++;
        acc[serviceName].revenue += booking.final_amount;
        return acc;
      }, {} as Record<string, { count: number; revenue: number }>) || {};

      const topServices = Object.entries(serviceStats)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setReportData({
        totalBookings,
        totalRevenue,
        newCustomers: uniqueCustomers,
        completionRate,
        topServices,
        monthlyTrend: [] // Would need more complex calculation
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = () => {
    toast({ title: "PDF Report", description: "Report generation will be implemented here." });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading reports...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Business performance insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generatePDFReport}>
            <Download className="h-4 w-4 mr-2" />Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalBookings}</div>
            <div className="text-sm text-muted-foreground">Bookings in period</div>
          </CardContent>
        </Card>

        <Card className="card-compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {reportData.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Revenue generated</div>
          </CardContent>
        </Card>

        <Card className="card-compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />New Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.newCustomers}</div>
            <div className="text-sm text-muted-foreground">Unique customers</div>
          </CardContent>
        </Card>

        <Card className="card-compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.completionRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Services completed</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Top Services</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="customers">Customer Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.topServices.map((service, index) => (
                  <div key={service.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{service.count} bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">AED {service.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-12">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>Trend charts will be implemented here</p>
                <p className="text-sm">Revenue and booking trends over time</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-12">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p>Customer analysis will be implemented here</p>
                <p className="text-sm">Customer demographics and behavior insights</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;