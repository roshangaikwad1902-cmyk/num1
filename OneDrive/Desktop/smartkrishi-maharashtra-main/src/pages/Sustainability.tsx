import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

const Sustainability = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Leaf className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold">Sustainability Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Emissions</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">2.3 t CO₂</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Chemical Load</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">68%</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Water Efficiency</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">82%</div></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sustainability;
