import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IoTDetail = () => {
  const { nodeId } = useParams();
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Generate dummy data for 48 hours
    const now = new Date();
    const dummyData = [];
    
    for (let i = 47; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      dummyData.push({
        time: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        moisture: 35 + Math.sin(i / 10) * 10 + Math.random() * 5,
        temp: 24 + Math.sin(i / 12) * 4 + Math.random() * 2,
        ec: 0.45 + Math.random() * 0.15,
        battery: 85 - i * 0.1 + Math.random() * 0.2,
        rssi: -60 - Math.random() * 10,
      });
    }
    
    setData(dummyData);
  }, [nodeId]);

  const handleSimulateIrrigation = () => {
    if (!data) return;
    
    // Add moisture spike to last 3 data points
    const updatedData = [...data];
    const lastIndex = updatedData.length - 1;
    for (let i = Math.max(0, lastIndex - 2); i <= lastIndex; i++) {
      updatedData[i] = {
        ...updatedData[i],
        moisture: Math.min(100, updatedData[i].moisture + 15)
      };
    }
    
    setData(updatedData);
    toast({
      title: 'Irrigation Simulated',
      description: 'Soil moisture increased by 15% (simulated event)',
    });
  };

  if (!data) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sensor: {nodeId}</h1>
          <p className="text-muted-foreground">48-hour telemetry data</p>
        </div>
        <Button onClick={handleSimulateIrrigation}>
          <Droplets className="w-4 h-4 mr-2" />
          Simulate Irrigation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data[data.length - 1].moisture.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Soil Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data[data.length - 1].temp.toFixed(1)}°C</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">EC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data[data.length - 1].ec.toFixed(2)} dS/m</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Soil Moisture (48h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="moisture" stroke="hsl(var(--primary))" strokeWidth={2} name="Moisture %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Soil Temperature (48h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temp" stroke="hsl(var(--secondary))" strokeWidth={2} name="Temp °C" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Electrical Conductivity (48h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ec" stroke="hsl(var(--accent))" strokeWidth={2} name="EC dS/m" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Battery Level (48h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="battery" stroke="hsl(var(--primary))" strokeWidth={2} name="Battery %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Signal Strength (RSSI)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[-100, -40]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rssi" stroke="hsl(var(--secondary))" strokeWidth={2} name="RSSI dBm" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IoTDetail;
