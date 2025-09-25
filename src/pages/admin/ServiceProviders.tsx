import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, User, Star, Phone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  rating: number;
  status: 'active' | 'inactive';
  location: string;
  hourly_rate: number;
}

const ServiceProviders = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed@example.com',
      phone: '+971501234567',
      specialization: 'Deep Cleaning',
      rating: 4.8,
      status: 'active',
      location: 'Dubai',
      hourly_rate: 50
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: '', email: '', phone: '', specialization: '', location: '', hourly_rate: 0
  });

  const handleAddProvider = () => {
    const provider: ServiceProvider = {
      id: Date.now().toString(),
      ...newProvider,
      rating: 0,
      status: 'active' as const
    };
    
    setProviders([...providers, provider]);
    setNewProvider({ name: '', email: '', phone: '', specialization: '', location: '', hourly_rate: 0 });
    setIsDialogOpen(false);
    toast({ title: "Provider Added", description: "New service provider added successfully." });
  };

  const stats = {
    total: providers.length,
    active: providers.filter(p => p.status === 'active').length,
    avgRating: providers.reduce((sum, p) => sum + p.rating, 0) / providers.length || 0,
    avgRate: providers.reduce((sum, p) => sum + p.hourly_rate, 0) / providers.length || 0
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Service Providers</h1>
          <p className="text-sm text-muted-foreground">Manage your service provider network</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Provider</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Name</Label>
                <Input value={newProvider.name} onChange={(e) => setNewProvider({...newProvider, name: e.target.value})} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={newProvider.email} onChange={(e) => setNewProvider({...newProvider, email: e.target.value})} />
              </div>
              <div>
                <Label>Specialization</Label>
                <Input value={newProvider.specialization} onChange={(e) => setNewProvider({...newProvider, specialization: e.target.value})} />
              </div>
              <Button onClick={handleAddProvider}>Add Provider</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total Providers</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Active</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-secondary">{stats.active}</div></CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Avg Rating</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.avgRating.toFixed(1)} ⭐</div></CardContent>
        </Card>
        <Card className="card-compact">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Avg Rate</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">AED {stats.avgRate.toFixed(0)}/hr</div></CardContent>
        </Card>
      </div>

      {/* Providers Table */}
      <Card>
        <CardHeader><CardTitle>Service Providers</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id} className="table-row-hover">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-sm text-muted-foreground">{provider.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{provider.specialization}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span>{provider.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={provider.status === 'active' ? 'secondary' : 'outline'}>
                      {provider.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
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

export default ServiceProviders;