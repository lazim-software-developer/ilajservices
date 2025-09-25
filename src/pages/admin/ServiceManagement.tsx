import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Tag,
  Settings,
  TrendingUp
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  pricingType: 'Fixed' | 'Per Hour' | 'Per SqM' | 'Per Unit';
  duration: number; // in minutes
  isActive: boolean;
  providerRate: number;
  margin: number;
  popularityScore: number;
  description: string;
  inclusions: string[];
  exclusions: string[];
}

interface PricingRule {
  id: string;
  name: string;
  type: 'Geographic' | 'Time-based' | 'Seasonal' | 'Volume' | 'Corporate';
  serviceIds: string[];
  conditions: string;
  discountType: 'Percentage' | 'Fixed Amount';
  discountValue: number;
  isActive: boolean;
  validFrom: string;
  validTo: string;
}

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadServices();
    loadPricingRules();
  }, []);

  const loadServices = async () => {
    // Mock data - replace with actual API call
    const mockServices: Service[] = [
      {
        id: 'SRV001',
        name: 'Deep Cleaning',
        category: 'Cleaning',
        basePrice: 200,
        pricingType: 'Per SqM',
        duration: 240,
        isActive: true,
        providerRate: 120,
        margin: 40,
        popularityScore: 95,
        description: 'Complete deep cleaning service for residential properties',
        inclusions: ['Dusting', 'Mopping', 'Bathroom cleaning', 'Kitchen cleaning'],
        exclusions: ['Carpet cleaning', 'Window cleaning']
      },
      {
        id: 'SRV002',
        name: 'Carpet Cleaning',
        category: 'Cleaning',
        basePrice: 15,
        pricingType: 'Per SqM',
        duration: 60,
        isActive: true,
        providerRate: 10,
        margin: 33.33,
        popularityScore: 78,
        description: 'Professional carpet cleaning with steam cleaning',
        inclusions: ['Steam cleaning', 'Stain removal', 'Deodorizing'],
        exclusions: ['Dry cleaning', 'Carpet repairs']
      },
      {
        id: 'SRV003',
        name: 'AC Maintenance',
        category: 'Maintenance',
        basePrice: 150,
        pricingType: 'Per Unit',
        duration: 90,
        isActive: true,
        providerRate: 100,
        margin: 33.33,
        popularityScore: 82,
        description: 'Complete AC maintenance and cleaning service',
        inclusions: ['Filter cleaning', 'Coil cleaning', 'Gas check'],
        exclusions: ['Gas refilling', 'Major repairs']
      }
    ];
    setServices(mockServices);
  };

  const loadPricingRules = async () => {
    // Mock data - replace with actual API call
    const mockRules: PricingRule[] = [
      {
        id: 'PR001',
        name: 'Corporate Discount',
        type: 'Corporate',
        serviceIds: ['SRV001', 'SRV002'],
        conditions: 'Monthly booking > 10 units',
        discountType: 'Percentage',
        discountValue: 15,
        isActive: true,
        validFrom: '2024-01-01',
        validTo: '2024-12-31'
      },
      {
        id: 'PR002',
        name: 'Weekend Premium',
        type: 'Time-based',
        serviceIds: ['SRV001'],
        conditions: 'Weekend bookings',
        discountType: 'Percentage',
        discountValue: -20, // negative for premium
        isActive: true,
        validFrom: '2024-01-01',
        validTo: '2024-12-31'
      }
    ];
    setPricingRules(mockRules);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))];

  const getMarginColor = (margin: number) => {
    if (margin >= 40) return 'text-green-600';
    if (margin >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPopularityColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Service Management</h1>
          <p className="text-muted-foreground">Manage your service catalog and pricing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Pricing Rules
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Service Catalog</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {/* Service Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                    <p className="text-2xl font-bold">{services.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                    <p className="text-2xl font-bold">{services.filter(s => s.isActive).length}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Margin</p>
                    <p className="text-2xl font-bold">
                      {(services.reduce((sum, s) => sum + s.margin, 0) / services.length).toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold">{categories.length - 1}</p>
                  </div>
                  <Tag className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Service Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Services Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Provider Rate</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Popularity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground">{service.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{service.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {service.basePrice}
                          <span className="text-xs text-muted-foreground">
                            /{service.pricingType.replace('Per ', '')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {service.providerRate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getMarginColor(service.margin)}`}>
                          {service.margin.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {Math.floor(service.duration / 60)}h {service.duration % 60}m
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPopularityColor(service.popularityScore)}>
                          {service.popularityScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={service.isActive ? 'default' : 'secondary'}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Dynamic Pricing Rules
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Conditions</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Valid Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {rule.serviceIds.length} services
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {rule.conditions}
                      </TableCell>
                      <TableCell>
                        <span className={rule.discountValue > 0 ? 'text-green-600' : 'text-red-600'}>
                          {rule.discountValue > 0 ? '+' : ''}{rule.discountValue}
                          {rule.discountType === 'Percentage' ? '%' : ' AED'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{rule.validFrom}</div>
                          <div className="text-muted-foreground">{rule.validTo}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Service performance metrics and analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceManagement;