import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFarmStore } from '@/store/farmStore';
import { generateAdvisoryPDF, generateSoilReportPDF, generateWeatherReportPDF } from '@/lib/pdfGenerator';
import { generateAlertsCSV, generateIoTCSV } from '@/lib/csvGenerator';
import alertsData from '@/data/extendedAlerts.json';
import sensorsData from '@/data/sensors.json';
import weatherData from '@/data/weather.json';

const Reports = () => {
  const { toast } = useToast();
  const { farms, selectedFarm } = useFarmStore();
  const farm = farms.find(f => f.id === selectedFarm);

  const handleGenerateAdvisory = async () => {
    if (!farm) return;
    
    const doc = await generateAdvisoryPDF({
      farmName: farm.name,
      ndvi: 0.78,
      soilMoisture: 34,
      rainfall: 8,
      recommendation: `Current farm health is good. Monitor soil moisture levels and follow irrigation schedule. Expected rainfall: 8mm in next 48h.`
    });
    
    doc.save(`advisory_report_${farm.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: 'Advisory Report Generated',
      description: 'PDF downloaded successfully',
    });
  };

  const handleGenerateSoilReport = async () => {
    const doc = await generateSoilReportPDF({
      fieldId: 'field-a',
      params: { pH: 6.8, EC: 0.45, OC: 0.82, N: 245, P: 18, K: 310, S: 12, Ca: 820, Mg: 185, Zn: 1.2, Fe: 4.5, Mn: 3.2 },
      recommendations: {}
    });
    
    doc.save(`soil_report_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: 'Soil Report Generated',
      description: 'PDF downloaded successfully',
    });
  };

  const handleExportAlerts = () => {
    generateAlertsCSV(alertsData);
    toast({
      title: 'Alerts Exported',
      description: 'CSV downloaded successfully',
    });
  };

  const handleExportIoT = () => {
    generateIoTCSV(sensorsData);
    toast({
      title: 'IoT Data Exported',
      description: 'CSV downloaded successfully',
    });
  };

  const handleGenerateWeather = async () => {
    if (!farm) return;
    
    const doc = await generateWeatherReportPDF({
      farmName: farm.name,
      forecast: weatherData.daily
    });
    
    doc.save(`weather_summary_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: 'Weather Report Generated',
      description: 'PDF downloaded successfully',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Advisory Report</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Generate comprehensive farm advisory with NDVI, soil, weather data and recommendations.
            </p>
            <Button className="w-full" onClick={handleGenerateAdvisory}>
              <FileText className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Soil Report</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Detailed soil analysis with 35+ parameters and fertilizer prescription.
            </p>
            <Button className="w-full" onClick={handleGenerateSoilReport}>
              <FileText className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Alerts Export</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Export all alerts with severity, evidence, and recommendations.
            </p>
            <Button className="w-full" onClick={handleExportAlerts}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>IoT Data Export</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Export sensor data including moisture, temperature, battery status.
            </p>
            <Button className="w-full" onClick={handleExportIoT}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Weather Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              7-day weather forecast with temperature, rainfall, and humidity.
            </p>
            <Button className="w-full" onClick={handleGenerateWeather}>
              <FileText className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
