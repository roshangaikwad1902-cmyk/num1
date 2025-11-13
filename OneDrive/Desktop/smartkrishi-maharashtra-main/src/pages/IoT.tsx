import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import sensorsData from '@/data/sensors.json';
import { generateIoTCSV } from '@/lib/csvGenerator';

const IoT = () => {
  const [sensors, setSensors] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load all 12 sensors from seed data
    setSensors(sensorsData);
  }, []);

  const handleExportCSV = () => {
    generateIoTCSV(sensors);
    toast({ title: 'CSV Exported', description: 'IoT sensor data downloaded successfully' });
  };

  const statusCounts = {
    total: sensors.length,
    active: sensors.filter(s => s.status === 'OK').length,
    warning: sensors.filter(s => s.status === 'Warning').length,
    offline: sensors.filter(s => s.status === 'Offline').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'default';
      case 'Warning': return 'secondary';
      case 'Offline': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IoT Sensors</h1>
          <p className="text-muted-foreground">LoRaWAN sensor network status</p>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Sensors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusCounts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{statusCounts.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{statusCounts.warning}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{statusCounts.offline}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sensor Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node ID</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Soil Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Battery</TableHead>
                <TableHead>RSSI</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensors.map(sensor => (
                <TableRow key={sensor.id}>
                  <TableCell className="font-mono">{sensor.id}</TableCell>
                  <TableCell>{sensor.crop}</TableCell>
                  <TableCell>{sensor.soil}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(sensor.status) as any}>
                      {sensor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sensor.battery < 50 ? 'destructive' : 'outline'}>
                      {sensor.battery}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sensor.rssi} dBm</Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={`/iot/${sensor.id}`}>
                      <Button variant="outline" size="sm">
                        <Activity className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
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

export default IoT;
