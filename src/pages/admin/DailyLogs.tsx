import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, Clock, User, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DailyLog {
  id: string;
  date: string;
  time: string;
  worker: string;
  customer: string;
  service: string;
  location: string;
  status: 'completed' | 'in-progress' | 'cancelled';
  notes: string;
  duration: number;
}

const DailyLogs = () => {
  const [logs, setLogs] = useState<DailyLog[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      worker: 'Ahmed Al-Rashid',
      customer: 'Sarah Johnson',
      service: 'Deep Cleaning',
      location: 'Dubai Marina',
      status: 'completed',
      notes: 'Service completed successfully.',
      duration: 180,
    }
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLog, setNewLog] = useState({
    time: '', worker: '', customer: '', service: '', location: '', 
    status: 'in-progress' as const, notes: '', duration: 0
  });

  const filteredLogs = logs.filter(log => log.date === selectedDate);

  const handleAddLog = () => {
    const log: DailyLog = {
      id: Date.now().toString(),
      date: selectedDate,
      ...newLog
    };
    
    setLogs([...logs, log]);
    setNewLog({
      time: '', worker: '', customer: '', service: '', location: '',
      status: 'in-progress', notes: '', duration: 0
    });
    setIsDialogOpen(false);
    toast({ title: "Log Added", description: "Daily log entry created successfully." });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Daily Logs</h1>
          <p className="text-sm text-muted-foreground">Track daily activities</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-48"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />Add Log
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Log Entry</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Time</Label>
                  <Input type="time" value={newLog.time} onChange={(e) => setNewLog({...newLog, time: e.target.value})} />
                </div>
                <div>
                  <Label>Worker</Label>
                  <Input value={newLog.worker} onChange={(e) => setNewLog({...newLog, worker: e.target.value})} />
                </div>
                <div>
                  <Label>Service</Label>
                  <Input value={newLog.service} onChange={(e) => setNewLog({...newLog, service: e.target.value})} />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea value={newLog.notes} onChange={(e) => setNewLog({...newLog, notes: e.target.value})} />
                </div>
                <Button onClick={handleAddLog}>Add Log</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Logs for {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No log entries for this date</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{log.time}</span>
                      </div>
                      <div className="text-lg font-semibold mt-1">{log.service}</div>
                      <div className="text-sm text-muted-foreground">
                        Worker: {log.worker} | Customer: {log.customer}
                      </div>
                    </div>
                    <Badge variant={log.status === 'completed' ? 'default' : 'secondary'}>{log.status}</Badge>
                  </div>
                  {log.notes && (
                    <div className="bg-muted/30 p-3 rounded mt-3">
                      <div className="text-sm">{log.notes}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyLogs;