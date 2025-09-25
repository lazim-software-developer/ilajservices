import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, Receipt } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FinancialData {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  completedBookings: number;
}

const FinanceManagement = () => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalRevenue: 0, monthlyRevenue: 0, pendingPayments: 0, completedBookings: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
    fetchRecentTransactions();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const { data: completed } = await supabase.from('bookings').select('final_amount').eq('status', 'completed');
      const { data: pending } = await supabase.from('bookings').select('final_amount').in('payment_status', ['pending', 'partial']);
      
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const { data: monthly } = await supabase.from('bookings').select('final_amount').eq('status', 'completed').gte('booking_date', firstDay.toISOString().split('T')[0]);

      setFinancialData({
        totalRevenue: completed?.reduce((sum, b) => sum + b.final_amount, 0) || 0,
        pendingPayments: pending?.reduce((sum, b) => sum + b.final_amount, 0) || 0,
        monthlyRevenue: monthly?.reduce((sum, b) => sum + b.final_amount, 0) || 0,
        completedBookings: completed?.length || 0
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const { data } = await supabase.from('bookings')
        .select(`id, final_amount, booking_date, payment_status, status, customers (name, email), services (name)`)
        .order('created_at', { ascending: false }).limit(10);
      setRecentTransactions(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getPaymentBadge = (status: string) => {
    const badges = {
      paid: <Badge className="bg-green-100 text-green-800">Paid</Badge>,
      pending: <Badge className="bg-orange-100 text-orange-800">Pending</Badge>,
      partial: <Badge className="bg-blue-100 text-blue-800">Partial</Badge>
    };
    return badges[status as keyof typeof badges] || <Badge variant="outline">{status}</Badge>;
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Finance Management</h1>
          <p className="text-sm text-muted-foreground">Track revenue and payments</p>
        </div>
        <Button><Receipt className="h-4 w-4 mr-2" />Generate Report</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {financialData.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />+15.3%
            </div>
          </CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {financialData.monthlyRevenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">This month</div>
          </CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Pending Payments</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">AED {financialData.pendingPayments.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Awaiting</div>
          </CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Avg. Order</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {financialData.completedBookings > 0 ? Math.round(financialData.totalRevenue / financialData.completedBookings) : 0}
            </div>
            <div className="text-sm text-muted-foreground">Per service</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="table-row-hover">
                      <TableCell className="font-mono text-sm">{transaction.id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.customers.name}</div>
                          <div className="text-sm text-muted-foreground">{transaction.customers.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.services.name}</TableCell>
                      <TableCell>{new Date(transaction.booking_date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">AED {transaction.final_amount}</TableCell>
                      <TableCell>{getPaymentBadge(transaction.payment_status)}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'outline'}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader><CardTitle>Financial Reports</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4" />
                <p>Reports will be generated here</p>
                <Button className="mt-4">Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceManagement;