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
import { Plus, Search, Filter, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FinancialTransaction {
  id: string;
  transaction_date: string;
  description: string;
  transaction_type: 'Income' | 'Expense';
  amount: number;
  category: string;
  reference_type?: string;
  vat_applicable: boolean;
  vat_amount: number;
  payment_mode?: string;
  created_by?: string;
  created_at: string;
}

interface ServicePricing {
  id: string;
  service_name: string;
  provider_price: number;
  margin_percent: number;
  ilaj_price: number;
  effective_from: string;
  is_active: boolean;
}

interface Expense {
  id: string;
  expense_date: string;
  description: string;
  category: string;
  amount: number;
  vat_applicable: boolean;
  vat_amount: number;
  supplier_name?: string;
  payment_mode?: string;
  created_at: string;
}

const FinanceManagement = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [servicePricing, setServicePricing] = useState<ServicePricing[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  const [transactionForm, setTransactionForm] = useState({
    description: '',
    transaction_type: '' as 'Income' | 'Expense',
    amount: '',
    category: '',
    payment_mode: '',
    vat_applicable: false,
    vat_amount: ''
  });

  const [pricingForm, setPricingForm] = useState({
    service_name: '',
    provider_price: '',
    margin_percent: '',
    effective_from: new Date().toISOString().split('T')[0]
  });

  const [expenseForm, setExpenseForm] = useState({
    description: '',
    category: '',
    amount: '',
    supplier_name: '',
    payment_mode: '',
    vat_applicable: false,
    vat_amount: ''
  });

  const incomeCategories = [
    'Service Revenue',
    'Corporate Contracts',
    'Holiday Home Packages',
    'Add-on Services',
    'Late Fees',
    'Other Income'
  ];

  const expenseCategories = [
    'Service Provider Payments',
    'Office Rent',
    'Utilities',
    'Marketing',
    'Equipment',
    'Supplies',
    'Insurance',
    'Professional Fees',
    'Transportation',
    'Other Expenses'
  ];

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    // TODO: Fetch from Supabase
    const mockTransactions: FinancialTransaction[] = [
      {
        id: '1',
        transaction_date: '2024-09-25',
        description: 'Deep cleaning service - Ahmad Al-Rashid',
        transaction_type: 'Income',
        amount: 350,
        category: 'Service Revenue',
        vat_applicable: true,
        vat_amount: 17.5,
        payment_mode: 'Card',
        created_at: '2024-09-25T10:00:00Z'
      },
      {
        id: '2',
        transaction_date: '2024-09-25',
        description: 'Payment to Sarah Mohamed - Cleaning Service',
        transaction_type: 'Expense',
        amount: 250,
        category: 'Service Provider Payments',
        vat_applicable: false,
        vat_amount: 0,
        payment_mode: 'Bank Transfer',
        created_at: '2024-09-25T11:00:00Z'
      }
    ];

    const mockPricing: ServicePricing[] = [
      {
        id: '1',
        service_name: 'Deep Cleaning',
        provider_price: 250,
        margin_percent: 40,
        ilaj_price: 350,
        effective_from: '2024-09-01',
        is_active: true
      },
      {
        id: '2',
        service_name: 'Regular Cleaning',
        provider_price: 150,
        margin_percent: 33.33,
        ilaj_price: 200,
        effective_from: '2024-09-01',
        is_active: true
      }
    ];

    setTransactions(mockTransactions);
    setServicePricing(mockPricing);
  };

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const transaction = {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount),
        vat_amount: transactionForm.vat_amount ? parseFloat(transactionForm.vat_amount) : 0,
        transaction_date: new Date().toISOString().split('T')[0]
      };

      // TODO: Save to Supabase
      console.log('Saving transaction:', transaction);

      toast({
        title: "Success",
        description: "Transaction recorded successfully",
      });

      setIsTransactionDialogOpen(false);
      resetTransactionForm();
      loadFinancialData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record transaction",
        variant: "destructive",
      });
    }
  };

  const handlePricingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pricing = {
        ...pricingForm,
        provider_price: parseFloat(pricingForm.provider_price),
        margin_percent: parseFloat(pricingForm.margin_percent),
        ilaj_price: parseFloat(pricingForm.provider_price) * (1 + parseFloat(pricingForm.margin_percent) / 100)
      };

      // TODO: Save to Supabase
      console.log('Saving pricing:', pricing);

      toast({
        title: "Success",
        description: "Service pricing updated successfully",
      });

      setIsPricingDialogOpen(false);
      resetPricingForm();
      loadFinancialData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pricing",
        variant: "destructive",
      });
    }
  };

  const resetTransactionForm = () => {
    setTransactionForm({
      description: '',
      transaction_type: '' as 'Income' | 'Expense',
      amount: '',
      category: '',
      payment_mode: '',
      vat_applicable: false,
      vat_amount: ''
    });
  };

  const resetPricingForm = () => {
    setPricingForm({
      service_name: '',
      provider_price: '',
      margin_percent: '',
      effective_from: new Date().toISOString().split('T')[0]
    });
  };

  const calculateVATAmount = (amount: string) => {
    if (!amount || !transactionForm.vat_applicable) return '0';
    return (parseFloat(amount) * 0.05).toFixed(2);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.transaction_type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.transaction_type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getNetProfit = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Finance Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">AED {getTotalIncome().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">AED {getTotalExpenses().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getNetProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              AED {getNetProfit().toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {getTotalIncome() > 0 ? ((getNetProfit() / getTotalIncome()) * 100).toFixed(1) : '0'}%
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="pricing">Service Pricing</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="vat">VAT Management</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Financial Transactions</CardTitle>
                <CardDescription>Record and track all financial activities</CardDescription>
              </div>
              <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetTransactionForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Record Transaction</DialogTitle>
                    <DialogDescription>Add a new income or expense transaction</DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleTransactionSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Input
                          id="description"
                          value={transactionForm.description}
                          onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="transaction_type">Type *</Label>
                        <Select value={transactionForm.transaction_type} onValueChange={(value: 'Income' | 'Expense') => setTransactionForm({...transactionForm, transaction_type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Income">Income</SelectItem>
                            <SelectItem value="Expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (AED) *</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={transactionForm.amount}
                          onChange={(e) => {
                            setTransactionForm({...transactionForm, amount: e.target.value});
                            if (transactionForm.vat_applicable) {
                              setTransactionForm(prev => ({...prev, vat_amount: calculateVATAmount(e.target.value)}));
                            }
                          }}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={transactionForm.category} onValueChange={(value) => setTransactionForm({...transactionForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {(transactionForm.transaction_type === 'Income' ? incomeCategories : expenseCategories).map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payment_mode">Payment Mode</Label>
                        <Select value={transactionForm.payment_mode} onValueChange={(value) => setTransactionForm({...transactionForm, payment_mode: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Card">Card</SelectItem>
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            <SelectItem value="Cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>VAT Applicable</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={transactionForm.vat_applicable}
                            onChange={(e) => {
                              setTransactionForm({...transactionForm, vat_applicable: e.target.checked});
                              if (!e.target.checked) {
                                setTransactionForm(prev => ({...prev, vat_amount: '0'}));
                              } else {
                                setTransactionForm(prev => ({...prev, vat_amount: calculateVATAmount(prev.amount)}));
                              }
                            }}
                          />
                          <span className="text-sm">Include 5% VAT</span>
                        </div>
                        {transactionForm.vat_applicable && (
                          <Input
                            type="number"
                            step="0.01"
                            value={transactionForm.vat_amount}
                            onChange={(e) => setTransactionForm({...transactionForm, vat_amount: e.target.value})}
                            placeholder="VAT Amount"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Record Transaction</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>VAT</TableHead>
                      <TableHead>Payment Mode</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.transaction_date}</TableCell>
                        <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                        <TableCell>
                          <Badge className={transaction.transaction_type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {transaction.transaction_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className="font-medium">
                          AED {transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {transaction.vat_applicable ? `AED ${transaction.vat_amount.toFixed(2)}` : 'N/A'}
                        </TableCell>
                        <TableCell>{transaction.payment_mode}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Service Pricing Management</CardTitle>
                <CardDescription>Set provider prices and profit margins</CardDescription>
              </div>
              <Dialog open={isPricingDialogOpen} onOpenChange={setIsPricingDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetPricingForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pricing
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Service Pricing</DialogTitle>
                    <DialogDescription>Set pricing with margin calculation</DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handlePricingSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="service_name">Service Name *</Label>
                      <Input
                        id="service_name"
                        value={pricingForm.service_name}
                        onChange={(e) => setPricingForm({...pricingForm, service_name: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provider_price">Provider Price (AED) *</Label>
                      <Input
                        id="provider_price"
                        type="number"
                        step="0.01"
                        value={pricingForm.provider_price}
                        onChange={(e) => setPricingForm({...pricingForm, provider_price: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="margin_percent">Margin Percentage *</Label>
                      <Input
                        id="margin_percent"
                        type="number"
                        step="0.01"
                        value={pricingForm.margin_percent}
                        onChange={(e) => setPricingForm({...pricingForm, margin_percent: e.target.value})}
                        required
                      />
                    </div>

                    {pricingForm.provider_price && pricingForm.margin_percent && (
                      <div className="space-y-2">
                        <Label>ILAJ Price (Calculated)</Label>
                        <div className="text-lg font-semibold text-green-600">
                          AED {(parseFloat(pricingForm.provider_price) * (1 + parseFloat(pricingForm.margin_percent) / 100)).toFixed(2)}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="effective_from">Effective From</Label>
                      <Input
                        id="effective_from"
                        type="date"
                        value={pricingForm.effective_from}
                        onChange={(e) => setPricingForm({...pricingForm, effective_from: e.target.value})}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsPricingDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Pricing</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Provider Price</TableHead>
                      <TableHead>Margin %</TableHead>
                      <TableHead>ILAJ Price</TableHead>
                      <TableHead>Effective From</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicePricing.map((pricing) => (
                      <TableRow key={pricing.id}>
                        <TableCell className="font-medium">{pricing.service_name}</TableCell>
                        <TableCell>AED {pricing.provider_price.toFixed(2)}</TableCell>
                        <TableCell>{pricing.margin_percent.toFixed(2)}%</TableCell>
                        <TableCell className="font-medium text-green-600">
                          AED {pricing.ilaj_price.toFixed(2)}
                        </TableCell>
                        <TableCell>{pricing.effective_from}</TableCell>
                        <TableCell>
                          <Badge className={pricing.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {pricing.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                Other expenses management will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vat">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                VAT reports and management will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceManagement;