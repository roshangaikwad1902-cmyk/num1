import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Cloud, CloudRain, Wind, Droplets, Download, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { generateWeatherReportPDF } from '@/lib/pdfGenerator';
import weatherData from '@/data/weather.json';

const Weather = () => {
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Use dummy data from weather.json
    const formatted = (weatherData.hourly || []).map((h: any) => ({
      ...h,
      time: new Date(h.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: new Date(h.ts).toLocaleDateString()
    }));
    setHourlyData(formatted);
    setDailyData(weatherData.daily || []);
  }, []);

  const handleDownloadPDF = async () => {
    const doc = await generateWeatherReportPDF({
      farmName: 'Shivneri Farm',
      forecast: dailyData
    });
    doc.save('weather_report.pdf');
    toast({ title: 'Weather Report Downloaded', description: 'weather_report.pdf saved successfully' });
  };

  // Calculate tomorrow's rain probability
  const tomorrowRain = dailyData[1]?.rainMM || 0;
  const rainProb = tomorrowRain > 10 ? 72 : tomorrowRain > 5 ? 45 : 20;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weather Forecast</h1>
          <p className="text-muted-foreground">IMD-style weather data for your farm</p>
        </div>
        <Button onClick={handleDownloadPDF}>
          <Download className="w-4 h-4 mr-2" />
          Download Weather Report (PDF)
        </Button>
      </div>

      <Card className="border-l-4 border-yellow-500 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-semibold">Weather Risk Summary — IMD</p>
              <p className="text-sm text-muted-foreground mt-1">
                {tomorrowRain > 10 
                  ? `Heavy rainfall expected tomorrow (${rainProb}%). Delay irrigation & avoid pesticide application.`
                  : tomorrowRain > 5
                  ? `Light rainfall expected tomorrow (${rainProb}%). Plan accordingly.`
                  : `Dry conditions expected. Monitor soil moisture closely.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="hourly">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="hourly">Hourly (48h)</TabsTrigger>
          <TabsTrigger value="daily">Daily (7d)</TabsTrigger>
        </TabsList>

        <TabsContent value="hourly" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Trend (48h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[15, 40]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="tempC" stroke="hsl(var(--primary))" strokeWidth={2} name="Temp °C" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rainfall Probability (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="precipProbPct" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary) / 0.3)" name="Rain %" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Humidity Trend (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[40, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="humidityPct" stroke="hsl(var(--accent))" strokeWidth={2} name="Humidity %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hourlyData.slice(0, 12).map((hour, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {new Date(hour.ts).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{hour.tempC}°C</span>
                    {hour.precipProbPct > 30 ? (
                      <CloudRain className="w-8 h-8 text-blue-500" />
                    ) : (
                      <Cloud className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-muted-foreground" />
                      <span>{hour.humidityPct}% humidity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-muted-foreground" />
                      <span>{hour.windKph} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-muted-foreground" />
                      <span>{hour.precipProbPct}% rain</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyData.map((day, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Max</p>
                      <p className="text-2xl font-bold">{day.maxC}°C</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Min</p>
                      <p className="text-2xl font-bold text-muted-foreground">{day.minC}°C</p>
                    </div>
                    {day.rainMM > 5 ? (
                      <CloudRain className="w-10 h-10 text-blue-500" />
                    ) : (
                      <Cloud className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-blue-500" />
                    <Badge variant={day.rainMM > 10 ? 'default' : 'outline'}>
                      {day.rainMM} mm rainfall
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Weather;
