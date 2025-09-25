import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useServices } from '@/hooks/useServices';
import { supabase } from '@/integrations/supabase/client';

const ServiceManagement = () => {
  const { services, loading, refreshServices } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newService, setNewService] = useState({
    name: '', category: '', description: '', base_price: 0, duration_minutes: 60,
    features: '', image_url: '', is_addon: false
  });
  const [editingService, setEditingService] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = ['all', 'Home', 'Corporate', 'Holiday Home', 'Add-on'];
  
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleService = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;
      toast({ title: "Service Updated", description: `Service ${!currentStatus ? 'enabled' : 'disabled'}.` });
      refreshServices();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update service.", variant: "destructive" });
    }
  };

  const handleSaveService = async () => {
    try {
      const serviceData = {
        ...newService,
        features: newService.features.split(',').map(f => f.trim()).filter(f => f)
      };

      if (editingService) {
        const { error } = await supabase.from('services').update(serviceData).eq('id', editingService.id);
        if (error) throw error;
        toast({ title: "Service Updated" });
      } else {
        const { error } = await supabase.from('services').insert([serviceData]);
        if (error) throw error;
        toast({ title: "Service Created" });
      }

      setIsDialogOpen(false);
      setNewService({ name: '', category: '', description: '', base_price: 0, duration_minutes: 60, features: '', image_url: '', is_addon: false });
      setEditingService(null);
      refreshServices();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save service.", variant: "destructive" });
    }
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      category: service.category,
      description: service.description,
      base_price: service.base_price,
      duration_minutes: service.duration_minutes,
      features: service.features?.join(', ') || '',
      image_url: service.image_url || '',
      is_addon: service.is_addon
    });
    setIsDialogOpen(true);
  };

  const stats = {
    total: services.length,
    active: services.filter(s => s.is_active).length,
    avgPrice: services.reduce((sum, s) => sum + s.base_price, 0) / services.length || 0,
    categories: [...new Set(services.map(s => s.category))].length
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Service Management</h1>
          <p className="text-sm text-muted-foreground">Manage services and pricing</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingService(null)}>
              <Plus className="h-4 w-4 mr-2" />Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Service Name</Label>
                  <Input value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={newService.category} onValueChange={(value) => setNewService({...newService, category: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                      <SelectItem value="Holiday Home">Holiday Home</SelectItem>
                      <SelectItem value="Add-on">Add-on</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (AED)</Label>
                  <Input type="number" value={newService.base_price} onChange={(e) => setNewService({...newService, base_price: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Duration (min)</Label>
                  <Input type="number" value={newService.duration_minutes} onChange={(e) => setNewService({...newService, duration_minutes: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <Label>Features</Label>
                <Input value={newService.features} onChange={(e) => setNewService({...newService, features: e.target.value})} placeholder="Feature 1, Feature 2" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={newService.is_addon} onCheckedChange={(checked) => setNewService({...newService, is_addon: checked})} />
                <Label>Add-on Service</Label>
              </div>
              <Button onClick={handleSaveService}>{editingService ? 'Update' : 'Create'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Services</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-secondary">{stats.active}</div></CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Price</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">AED {stats.avgPrice.toFixed(0)}</div></CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.categories}</div></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        {categories.map((category) => (
          <Button key={category} variant={selectedCategory === category ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(category)}>
            {category === 'all' ? 'All' : category}
          </Button>
        ))}
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id} className="table-row-hover">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {service.image_url && <img src={service.image_url} alt={service.name} className="w-10 h-10 rounded object-cover" />}
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{service.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.is_addon ? 'secondary' : 'outline'}>{service.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">AED {service.base_price}</TableCell>
                  <TableCell>{service.duration_minutes} min</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={service.is_active} onCheckedChange={() => handleToggleService(service.id, service.is_active)} />
                      <span className={service.is_active ? 'text-secondary' : 'text-muted-foreground'}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEditService(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
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

export default ServiceManagement;