import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Download, Droplets } from 'lucide-react';
import { useFarmStore } from '@/store/farmStore';
import { useToast } from '@/hooks/use-toast';
import { generateFieldReportPDF } from '@/lib/pdfGenerator';

const FieldDetail = () => {
  const { id } = useParams();
  const [ndviFrame, setNdviFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThermal, setShowThermal] = useState(false);
  const [irrigationAdvisory, setIrrigationAdvisory] = useState<number | null>(null);
  const { toast } = useToast();
  
  const ndviDates = [
    '2025-10-02', '2025-10-07', '2025-10-12', '2025-10-17',
    '2025-10-22', '2025-10-27', '2025-11-01', '2025-11-06'
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setNdviFrame(prev => (prev + 1) % ndviDates.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const fieldData = {
    'field-a': { name: 'Field A', crop: 'Sugarcane', area: 3.2 },
    'field-b': { name: 'Field B', crop: 'Onion', area: 2.8 },
    'field-c': { name: 'Field C', crop: 'Soybean', area: 2.5 },
    'field-d': { name: 'Field D', crop: 'Wheat', area: 1.8 },
  }[id || 'field-a'] || { name: 'Field', crop: 'Unknown', area: 0 };

  const hotspots = [
    { id: 1, lat: 18.5215, lng: 73.8580, temp: 37.5, area: 450 },
    { id: 2, lat: 18.5198, lng: 73.8592, temp: 36.8, area: 320 },
    { id: 3, lat: 18.5205, lng: 73.8575, temp: 36.2, area: 280 },
  ];

  const handleRunIrrigationAdvisory = async () => {
    // Simulate AI inference
    toast({
      title: 'Running Irrigation Advisory',
      description: 'Analyzing field data...',
    });
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const recommended = 1200; // L/acre
    setIrrigationAdvisory(recommended);
    
    toast({
      title: 'Advisory Generated',
      description: `Recommended: ${recommended} L/acre`,
    });
  };

  const handleExportFieldReport = async () => {
    try {
      const doc = await generateFieldReportPDF(id || 'field-unknown', {
        ndvi: 0.75 + ndviFrame * 0.02,
        crop: fieldData.crop,
        area: fieldData.area,
        hotspots: hotspots.length,
      });
      
      doc.save(`field_${id}_report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: 'Field Report Downloaded',
        description: 'PDF generated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate field report.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{fieldData.name}</h1>
          <p className="text-muted-foreground">{fieldData.crop} • {fieldData.area} acres</p>
        </div>
        <Button onClick={handleExportFieldReport}>
          <Download className="w-4 h-4 mr-2" />
          Export Field Report (PDF)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>NDVI Timelapse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-yellow-500/20" />
              <div className="text-center z-10">
                <p className="text-6xl font-bold text-primary">
                  {(0.65 + ndviFrame * 0.03).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">NDVI Value</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{ndviDates[ndviFrame]}</span>
                <span>Frame {ndviFrame + 1} / {ndviDates.length}</span>
              </div>
              <Slider
                value={[ndviFrame]}
                onValueChange={(val) => setNdviFrame(val[0])}
                max={ndviDates.length - 1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                variant="outline"
                className="flex-1"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                onClick={() => setShowThermal(!showThermal)}
                variant={showThermal ? 'default' : 'outline'}
                className="flex-1"
              >
                Thermal Overlay
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thermal Hotspots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hotspots.map(spot => (
                <div 
                  key={spot.id}
                  className="p-3 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Hotspot {spot.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="mb-1">
                        {spot.temp}°C
                      </Badge>
                      <p className="text-xs text-muted-foreground">{spot.area}m²</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Stats</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">24°C</p>
                  <p className="text-xs text-muted-foreground">Min</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">31°C</p>
                  <p className="text-xs text-muted-foreground">Avg</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">38°C</p>
                  <p className="text-xs text-muted-foreground">Max</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Irrigation Advisory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleRunIrrigationAdvisory} className="w-full">
            <Droplets className="w-4 h-4 mr-2" />
            Run Irrigation Advisory
          </Button>
          
          {irrigationAdvisory !== null && (
            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded">
              <p className="font-semibold mb-2">AI Recommendation</p>
              <p className="text-2xl font-bold text-primary mb-1">
                {irrigationAdvisory} L/acre
              </p>
              <p className="text-sm text-muted-foreground">
                Based on current soil moisture, NDVI, and weather forecast, irrigate within next 12 hours.
              </p>
            </div>
          )}
          
          <div className="p-4 border-l-4 border-yellow-500 bg-yellow-500/5 rounded">
            <p className="font-semibold">Thermal Hotspot Alert</p>
            <p className="text-sm text-muted-foreground mt-1">
              {hotspots.length} thermal hotspots detected. Inspect these areas for water stress or disease.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldDetail;
