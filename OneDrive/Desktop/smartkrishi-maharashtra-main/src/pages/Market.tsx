import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Market = () => {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [commodity, setCommodity] = useState('onion');

  useEffect(() => {
    fetch(`/api/market/apmc?commodity=${commodity}`)
      .then(res => res.json())
      .then(data => setMarketData(data))
      .catch(console.error);
  }, [commodity]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Market Prices</h1>
      
      <Tabs value={commodity} onValueChange={setCommodity}>
        <TabsList>
          <TabsTrigger value="onion">Onion</TabsTrigger>
          <TabsTrigger value="sugarcane">Sugarcane</TabsTrigger>
          <TabsTrigger value="soybean">Soybean</TabsTrigger>
          <TabsTrigger value="wheat">Wheat</TabsTrigger>
        </TabsList>

        <TabsContent value={commodity}>
          <Card>
            <CardHeader>
              <CardTitle>Price Trend - {commodity}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="modal" stroke="hsl(var(--primary))" name="Modal Price" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Market;
