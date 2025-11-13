import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings as SettingsIcon, Activity, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  const [thresholds, setThresholds] = useState({
    ndviWarn: 0.6,
    ndviCrit: 0.5,
    moistureWarn: 30,
    moistureCrit: 20,
    diseaseWarn: 40,
    diseaseCrit: 60,
  });
  
  const [features, setFeatures] = useState({
    market: true,
    sustainability: true,
    pollination: false,
  });

  const [users, setUsers] = useState([
    { id: '1', name: 'रमेश पाटील', role: 'farmer', email: 'ramesh@farm.in', status: 'active' },
    { id: '2', name: 'Dr. संजय देशमुख', role: 'advisor', email: 'advisor@smartkrishi.in', status: 'active' },
    { id: '3', name: 'Admin', role: 'admin', email: 'admin@smartkrishi.in', status: 'active' },
    { id: '4', name: 'सुनीता शिंदे', role: 'farmer', email: 'sunita@farm.in', status: 'active' },
    { id: '5', name: 'प्रकाश जाधव', role: 'farmer', email: 'prakash@farm.in', status: 'active' },
  ]);

  const [logs, setLogs] = useState([
    { ts: new Date().toISOString(), action: 'Updated NDVI threshold', user: 'Admin' },
    { ts: new Date(Date.now() - 3600000).toISOString(), action: 'Added new user', user: 'Admin' },
    { ts: new Date(Date.now() - 7200000).toISOString(), action: 'Modified disease threshold', user: 'Admin' },
    { ts: new Date(Date.now() - 10800000).toISOString(), action: 'Toggled market feature', user: 'Admin' },
    { ts: new Date(Date.now() - 14400000).toISOString(), action: 'Updated user status', user: 'Admin' },
  ]);

  const handleSaveThresholds = () => {
    localStorage.setItem('smartkrishi_thresholds', JSON.stringify(thresholds));
    setLogs(prev => [{
      ts: new Date().toISOString(),
      action: 'Updated system thresholds',
      user: 'Admin'
    }, ...prev.slice(0, 9)]);
    toast({
      title: 'Thresholds Updated',
      description: 'System thresholds saved successfully',
    });
  };

  const handleToggleFeature = (feature: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
    setLogs(prev => [{
      ts: new Date().toISOString(),
      action: `${feature} feature ${!features[feature] ? 'enabled' : 'disabled'}`,
      user: 'Admin'
    }, ...prev.slice(0, 9)]);
    toast({
      title: 'Feature Toggle Updated',
      description: `${feature} ${!features[feature] ? 'enabled' : 'disabled'}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setLogs(prev => [{
      ts: new Date().toISOString(),
      action: 'Deleted user',
      user: 'Admin'
    }, ...prev.slice(0, 9)]);
    toast({
      title: 'User Deleted',
      description: 'User removed successfully',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Farms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">Operational</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : user.role === 'advisor' ? 'secondary' : 'outline'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {user.role !== 'admin' && (
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Threshold Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>NDVI Warning</Label>
              <Input type="number" step="0.1" value={thresholds.ndviWarn} onChange={(e) => setThresholds({...thresholds, ndviWarn: parseFloat(e.target.value)})} />
            </div>
            <div>
              <Label>NDVI Critical</Label>
              <Input type="number" step="0.1" value={thresholds.ndviCrit} onChange={(e) => setThresholds({...thresholds, ndviCrit: parseFloat(e.target.value)})} />
            </div>
            <div>
              <Label>Moisture Warning (%)</Label>
              <Input type="number" value={thresholds.moistureWarn} onChange={(e) => setThresholds({...thresholds, moistureWarn: parseInt(e.target.value)})} />
            </div>
            <div>
              <Label>Moisture Critical (%)</Label>
              <Input type="number" value={thresholds.moistureCrit} onChange={(e) => setThresholds({...thresholds, moistureCrit: parseInt(e.target.value)})} />
            </div>
          </div>
          <Button onClick={handleSaveThresholds}>Save Thresholds</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="capitalize">{key}</Label>
              <Switch checked={value} onCheckedChange={() => handleToggleFeature(key as keyof typeof features)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs.slice(0, 10).map((log, i) => (
              <div key={i} className="flex items-center justify-between p-2 border-b">
                <span className="text-sm">{log.action}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.ts).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} - {log.user}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
