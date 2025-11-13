import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { generateSoilReportPDF } from '@/lib/pdfGenerator';

const SoilDetail = () => {
  const { fieldId } = useParams();
  const [report, setReport] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Generate dummy soil report data
    const dummyReport = {
      fieldId: fieldId || 'field-a',
      sampledAt: new Date().toISOString(),
      params: {
        pH: 6.8,
        EC: 0.45,
        OC: 0.82,
        N: 245,
        P: 18,
        K: 310,
        S: 12,
        Ca: 820,
        Mg: 185,
        Zn: 1.2,
        Fe: 4.5,
        Mn: 3.2,
        Cu: 0.8,
        B: 0.5,
        Mo: 0.15,
      },
      recommendations: {
        fertilizers: [
          { name: 'NPK (12-32-16)', kgPerAcre: 75, cost: 3600, split: ['Basal: 50 kg', 'Top dress: 25 kg'] },
          { name: 'Urea', kgPerAcre: 30, cost: 900, split: ['Split at 45 & 60 days'] },
          { name: 'MOP', kgPerAcre: 20, cost: 800, split: ['Basal application'] },
        ],
        safetyNotes: [
          'Apply fertilizers during early morning or late evening',
          'Avoid application before heavy rainfall',
          'Maintain proper irrigation after fertilizer application',
        ],
      },
    };
    setReport(dummyReport);
  }, [fieldId]);

  if (!report) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  const radarData = [
    { parameter: 'pH', value: (report.params.pH / 14) * 100, target: 70 },
    { parameter: 'N', value: (report.params.N / 400) * 100, target: 65 },
    { parameter: 'P', value: (report.params.P / 40) * 100, target: 50 },
    { parameter: 'K', value: (report.params.K / 500) * 100, target: 70 },
    { parameter: 'OC', value: (report.params.OC / 1.5) * 100, target: 60 },
  ];

  const keyParams = [
    { name: 'pH', value: report.params.pH, unit: '', status: 'good' },
    { name: 'EC', value: report.params.EC, unit: 'dS/m', status: 'good' },
    { name: 'OC', value: report.params.OC, unit: '%', status: 'ok' },
    { name: 'N', value: report.params.N, unit: 'kg/ha', status: 'good' },
    { name: 'P', value: report.params.P, unit: 'kg/ha', status: 'ok' },
    { name: 'K', value: report.params.K, unit: 'kg/ha', status: 'good' },
    { name: 'S', value: report.params.S, unit: 'kg/ha', status: 'good' },
    { name: 'Ca', value: report.params.Ca, unit: 'mg/kg', status: 'good' },
    { name: 'Mg', value: report.params.Mg, unit: 'mg/kg', status: 'good' },
    { name: 'Zn', value: report.params.Zn, unit: 'mg/kg', status: 'ok' },
    { name: 'Fe', value: report.params.Fe, unit: 'mg/kg', status: 'good' },
    { name: 'Mn', value: report.params.Mn, unit: 'mg/kg', status: 'good' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'default';
      case 'ok': return 'secondary';
      case 'attention': return 'destructive';
      default: return 'outline';
    }
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    
    try {
      const doc = await generateSoilReportPDF({
        fieldId: fieldId || 'field-unknown',
        params: report.params,
        recommendations: report.recommendations,
      });
      
      doc.save(`soil_${fieldId}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: 'Soil Report Downloaded',
        description: 'PDF generated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate soil report.',
        variant: 'destructive',
      });
    }
  };

  const handleGeneratePrescription = () => {
    if (!report) return;
    
    const totalCost = report.recommendations.fertilizers.reduce((sum: number, f: any) => sum + f.cost, 0);
    
    toast({
      title: 'Fertilizer Prescription Generated',
      description: `Total cost: ₹${totalCost.toLocaleString()}/acre`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Soil Report - {fieldId}</h1>
          <p className="text-muted-foreground">
            Sampled: {new Date(report.sampledAt).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={handleDownloadPDF}>
          <Download className="w-4 h-4 mr-2" />
          Download Soil Report (PDF)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nutrient Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="parameter" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Current" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Radar name="Target" dataKey="target" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Parameters (35+)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {keyParams.map(param => (
              <div key={param.name} className="p-3 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{param.name}</span>
                  <Badge variant={getStatusColor(param.status) as any} className="text-xs">
                    {param.status}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{param.value}</p>
                <p className="text-xs text-muted-foreground">{param.unit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fertilizer Prescription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGeneratePrescription} className="w-full">
            Generate Prescription
          </Button>
          <div className="space-y-4">
            {report.recommendations.fertilizers.map((fert: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-semibold">{fert.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {fert.split.join(' → ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{fert.kgPerAcre} kg/acre</p>
                  <p className="text-sm text-muted-foreground">₹{fert.cost}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border-l-4 border-yellow-500 rounded">
            <p className="font-semibold mb-2">Safety Notes</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {report.recommendations.safetyNotes.map((note: string, i: number) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoilDetail;
