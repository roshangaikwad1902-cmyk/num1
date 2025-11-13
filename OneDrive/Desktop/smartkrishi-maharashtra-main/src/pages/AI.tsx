import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import { Brain, TrendingUp, Droplets, Bug, Sprout, Play, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AI = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const models = [
    {
      id: 'yield',
      name: 'Yield Prediction',
      icon: TrendingUp,
      algorithm: 'Random Forest',
      description: 'Predict crop yield based on NDVI, soil, and weather',
      color: 'text-green-600'
    },
    {
      id: 'groundwater',
      name: 'Groundwater Forecast',
      icon: Droplets,
      algorithm: 'LSTM',
      description: 'Forecast groundwater depth trends',
      color: 'text-blue-600'
    },
    {
      id: 'disease',
      name: 'Disease Risk',
      icon: Bug,
      algorithm: 'Logistic Regression',
      description: 'Calculate pest and disease probability',
      color: 'text-red-600'
    },
    {
      id: 'fertilizer',
      name: 'Fertilizer Optimizer',
      icon: Sprout,
      algorithm: 'Bayesian Linear',
      description: 'Optimize NPK dosage and timing',
      color: 'text-yellow-600'
    },
  ];

  const runPrediction = async (modelId: string) => {
    setLoading(true);
    setSelectedModel(modelId);

    // Simulate 1-2s delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    try {
      // Generate dummy data based on model type
      let dummyResult: any = {
        version: 'v1.3.2',
        inferenceMs: Math.floor(150 + Math.random() * 200),
        confidencePct: 85 + Math.random() * 10,
      };

      if (modelId === 'yield') {
        dummyResult = {
          ...dummyResult,
          output: 82,
          ci: [76, 88],
          explanation: [
            { feature: 'NDVI', importance: 0.45 },
            { feature: 'Soil Moisture', importance: 0.28 },
            { feature: 'Rainfall', importance: 0.15 },
            { feature: 'Temperature', importance: 0.08 },
            { feature: 'Crop Age', importance: 0.04 },
          ],
        };
      } else if (modelId === 'groundwater') {
        dummyResult = {
          ...dummyResult,
          output: -6.2,
          ci: [-5.9, -6.5],
          explanation: [
            { feature: 'Rainfall', importance: 0.52 },
            { feature: 'Usage', importance: 0.31 },
            { feature: 'Season', importance: 0.12 },
            { feature: 'Temperature', importance: 0.05 },
          ],
        };
      } else if (modelId === 'disease') {
        dummyResult = {
          ...dummyResult,
          output: 42.5,
          explanation: [
            { feature: 'Humidity', importance: 0.38 },
            { feature: 'Temperature', importance: 0.25 },
            { feature: 'Leaf Wetness', importance: 0.22 },
            { feature: 'Wind Speed', importance: 0.10 },
            { feature: 'Crop Density', importance: 0.05 },
          ],
        };
      } else if (modelId === 'fertilizer') {
        dummyResult = {
          ...dummyResult,
          output: { npk: 75, urea: 30 },
          explanation: [
            { feature: 'Soil N', importance: 0.35 },
            { feature: 'Soil P', importance: 0.28 },
            { feature: 'Soil K', importance: 0.22 },
            { feature: 'Crop Type', importance: 0.10 },
            { feature: 'Growth Stage', importance: 0.05 },
          ],
        };
      }

      setResult(dummyResult);
      
      toast({
        title: 'Prediction Complete',
        description: `Model ran in ${dummyResult.inferenceMs}ms with ${dummyResult.confidencePct.toFixed(1)}% confidence`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to run prediction',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_${selectedModel}_result.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'JSON Downloaded', description: 'AI model result saved successfully' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI & ML Models</h1>
          <p className="text-muted-foreground">Predictive analytics for smart farming</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map(model => {
          const Icon = model.icon;
          return (
            <Card 
              key={model.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedModel === model.id ? 'border-primary border-2' : ''
              }`}
              onClick={() => setSelectedModel(model.id)}
            >
              <CardHeader>
                <Icon className={`w-8 h-8 ${model.color} mb-2`} />
                <CardTitle className="text-lg">{model.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline">{model.algorithm}</Badge>
                <p className="text-sm text-muted-foreground">{model.description}</p>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    runPrediction(model.id);
                  }}
                  disabled={loading}
                  className="w-full mt-2"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Model
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {result && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleDownloadJSON} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Result JSON
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Output</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Predicted Value</p>
                  <p className="text-5xl font-bold text-primary">
                    {typeof result.output === 'object' 
                      ? JSON.stringify(result.output).slice(0, 20) + '...'
                      : selectedModel === 'disease' 
                      ? `${result.output.toFixed(1)}%` 
                      : result.output.toFixed(2)
                    }
                  </p>
                  {result.ci && (
                    <p className="text-sm text-muted-foreground mt-2">
                      95% CI: [{result.ci[0].toFixed(1)}, {result.ci[1].toFixed(1)}]
                    </p>
                  )}
                  {selectedModel === 'yield' && (
                    <p className="text-sm text-muted-foreground mt-1">quintal/acre</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{result.confidencePct.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{result.inferenceMs}</p>
                    <p className="text-xs text-muted-foreground">ms</p>
                  </div>
                  <div>
                    <Badge variant="outline">{result.version}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Version</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Importance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={result.explanation} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 1]} />
                    <YAxis dataKey="feature" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="importance" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-4">
                  SHAP-style feature importance values showing which inputs most influenced the prediction.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Model-specific visualizations */}
          {selectedModel === 'yield' && (
            <Card>
              <CardHeader>
                <CardTitle>Yield vs NDVI Correlation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { ndvi: 0.3, yield: 45 },
                    { ndvi: 0.5, yield: 62 },
                    { ndvi: 0.7, yield: 78 },
                    { ndvi: 0.8, yield: 84 },
                    { ndvi: 0.9, yield: 88 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ndvi" label={{ value: 'NDVI', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Yield (q/acre)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="yield" stroke="hsl(var(--primary))" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {selectedModel === 'groundwater' && (
            <Card>
              <CardHeader>
                <CardTitle>7-Day Groundwater Depth Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { day: 'Day 1', depth: -6.1, upper: -5.8, lower: -6.4 },
                    { day: 'Day 2', depth: -6.3, upper: -6.0, lower: -6.6 },
                    { day: 'Day 3', depth: -6.5, upper: -6.2, lower: -6.8 },
                    { day: 'Day 4', depth: -6.4, upper: -6.1, lower: -6.7 },
                    { day: 'Day 5', depth: -6.2, upper: -5.9, lower: -6.5 },
                    { day: 'Day 6', depth: -6.0, upper: -5.7, lower: -6.3 },
                    { day: 'Day 7', depth: -5.9, upper: -5.6, lower: -6.2 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[-7, -5]} label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(var(--primary) / 0.2)" />
                    <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(var(--primary) / 0.2)" />
                    <Line type="monotone" dataKey="depth" stroke="hsl(var(--primary))" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {selectedModel === 'disease' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Gauge</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke={result.output > 60 ? 'hsl(0, 70%, 50%)' : result.output > 30 ? 'hsl(45, 70%, 50%)' : 'hsl(120, 70%, 50%)'} 
                        strokeWidth="10"
                        strokeDasharray={`${result.output * 2.51} 251`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{result.output.toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground">Risk</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk Drivers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Humidity</span>
                    <Badge variant="destructive">High (82%)</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Temperature</span>
                    <Badge variant="outline">Moderate (24°C)</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Leaf Wetness</span>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Recommendation: Apply preventive fungicide (Mancozeb 0.25%) within 48h if conditions persist.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedModel === 'fertilizer' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost vs Yield Response Curve</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { npk: 0, yield: 50, cost: 0 },
                      { npk: 25, yield: 68, cost: 1200 },
                      { npk: 50, yield: 78, cost: 2400 },
                      { npk: 75, yield: 82, cost: 3600 },
                      { npk: 100, yield: 84, cost: 4800 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="npk" label={{ value: 'NPK (kg/acre)', position: 'insideBottom', offset: -5 }} />
                      <YAxis yAxisId="left" label={{ value: 'Yield (q/acre)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Cost (₹)', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="yield" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="cost" stroke="hsl(var(--secondary))" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Fertilizer Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">NPK (12-32-16)</span>
                        <Badge>75 kg/acre</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• Basal: 50 kg/acre at planting</p>
                        <p>• Top dress: 25 kg/acre at 30 days</p>
                        <p>• Est. cost: ₹3,600/acre</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Urea</span>
                        <Badge>30 kg/acre</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• Split application at 45 & 60 days</p>
                        <p>• Est. cost: ₹900/acre</p>
                      </div>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-3">
                      <p className="text-sm font-semibold">Expected ROI: +24%</p>
                      <p className="text-xs text-muted-foreground mt-1">Projected yield increase: 6 q/acre</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AI;
