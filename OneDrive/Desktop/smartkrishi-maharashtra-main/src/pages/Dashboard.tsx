import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useFarmStore } from '@/store/farmStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generateAdvisoryPDF } from '@/lib/pdfGenerator';
import { 
  Droplets, 
  CloudRain, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  LogOut,
  Download,
  Phone,
  Languages,
  Leaf,
  Map,
  ThermometerSun,
  Copy
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { hi, enUS } from 'date-fns/locale';
import { useState } from 'react';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { selectedFarm, farms, setSelectedFarm, getFarmById } = useFarmStore();
  const { toast } = useToast();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const currentFarm = getFarmById(selectedFarm || '');
  if (!currentFarm) return null;

  const localeMap = { mr: hi, hi, en: enUS };
  const currentLocale = localeMap[i18n.language as keyof typeof localeMap] || enUS;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNDVIStatus = (ndvi: number) => {
    if (ndvi >= 0.7) return { label: t('dashboard.healthy'), color: 'crop-healthy' };
    if (ndvi >= 0.5) return { label: t('dashboard.moderate'), color: 'crop-warning' };
    return { label: t('dashboard.low'), color: 'crop-danger' };
  };

  const getRiskLevel = (risk: number) => {
    if (risk < 30) return { label: t('dashboard.low'), color: 'crop-healthy' };
    if (risk < 60) return { label: t('dashboard.moderate'), color: 'crop-warning' };
    return { label: t('dashboard.high'), color: 'crop-danger' };
  };

  const ndviStatus = getNDVIStatus(currentFarm.ndvi);
  const riskStatus = getRiskLevel(currentFarm.diseaseRisk);

  const handleIrrigateNow = () => {
    // Simulate irrigation event
    toast({
      title: 'Irrigation Event Triggered',
      description: 'Irrigation event triggered successfully (simulated). Soil moisture will be updated.',
    });
    
    // Update farm store with new moisture (simulated)
    setTimeout(() => {
      toast({
        title: 'Water Stress Resolved',
        description: 'New alert: Water stress resolved after irrigation.',
      });
    }, 1000);
  };

  const handleDownloadAdvisory = async () => {
    try {
      const doc = await generateAdvisoryPDF({
        farmName: currentFarm.name,
        ndvi: currentFarm.ndvi,
        soilMoisture: currentFarm.soilMoisture,
        rainfall: currentFarm.rainfall,
        recommendation: `Based on current NDVI (${currentFarm.ndvi.toFixed(2)}), soil moisture (${currentFarm.soilMoisture}%), and forecast rainfall (${currentFarm.rainfall}mm), we recommend: ${currentFarm.irrigationNeed > 3000 ? 'Immediate irrigation required' : 'Monitor soil moisture levels'}. Expected yield: ${currentFarm.yieldForecast.value} q/acre.`
      });
      
      doc.save(`advisory_${currentFarm.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: 'Advisory Downloaded',
        description: 'Farm advisory PDF generated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate advisory PDF.',
        variant: 'destructive',
      });
    }
  };

  const handleContactAdvisor = () => {
    setContactDialogOpen(true);
  };

  const handleCopyContact = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: 'Contact information copied successfully.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">{t('app.name')}</h1>
                <p className="text-sm text-muted-foreground">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={i18n.language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-32">
                  <Languages className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mr">मराठी</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Farm Selector */}
          <div className="mt-4">
            <Select value={selectedFarm || ''} onValueChange={setSelectedFarm}>
              <SelectTrigger className="w-full max-w-xs">
                <Map className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {farms.map(farm => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name} ({farm.area} acres)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Farm Info Banner */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-2xl">{currentFarm.name}</CardTitle>
            <CardDescription>
              {currentFarm.crops.join(', ')} • {currentFarm.area} acres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="flex-1 min-w-[200px]" onClick={handleIrrigateNow}>
                <Droplets className="w-5 h-5 mr-2" />
                {t('dashboard.irrigateNow')}
              </Button>
              <Button size="lg" variant="outline" className="flex-1 min-w-[200px]" onClick={handleDownloadAdvisory}>
                <Download className="w-5 h-5 mr-2" />
                {t('dashboard.downloadAdvice')}
              </Button>
              <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="flex-1 min-w-[200px]" onClick={handleContactAdvisor}>
                    <Phone className="w-5 h-5 mr-2" />
                    {t('dashboard.contactAdvisor')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Your Advisor</DialogTitle>
                    <DialogDescription>
                      Reach out to your agricultural advisor for expert guidance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-semibold mb-2">Dr. संजय देशमुख</p>
                      <p className="text-sm text-muted-foreground mb-3">Agricultural Advisor</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Phone:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono">+91 98765 43210</span>
                            <Button size="sm" variant="ghost" onClick={() => handleCopyContact('+91 98765 43210')}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Email:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">advisor@smartkrishi.in</span>
                            <Button size="sm" variant="ghost" onClick={() => handleCopyContact('advisor@smartkrishi.in')}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* NDVI Health */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {t('dashboard.ndviHealth')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentFarm.ndvi.toFixed(2)}</div>
              <Badge variant="outline" className={`mt-2 bg-${ndviStatus.color}/10 text-${ndviStatus.color}`}>
                {ndviStatus.label}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                {t('dashboard.lastUpdated')}: {formatDistanceToNow(currentFarm.lastUpdated.satellite, { 
                  addSuffix: true, 
                  locale: currentLocale 
                })}
              </p>
            </CardContent>
          </Card>

          {/* Soil Moisture */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                {t('dashboard.soilMoisture')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentFarm.soilMoisture}%</div>
              <Progress value={currentFarm.soilMoisture} className="mt-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {t('dashboard.lastUpdated')}: {formatDistanceToNow(currentFarm.lastUpdated.iot, { 
                  addSuffix: true, 
                  locale: currentLocale 
                })}
              </p>
            </CardContent>
          </Card>

          {/* Irrigation Need */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ThermometerSun className="w-4 h-4" />
                {t('dashboard.irrigationNeed')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentFarm.irrigationNeed.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-1">{t('dashboard.litersPerAcre')}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {t('dashboard.lastUpdated')}: {formatDistanceToNow(currentFarm.lastUpdated.iot, { 
                  addSuffix: true, 
                  locale: currentLocale 
                })}
              </p>
            </CardContent>
          </Card>

          {/* Rainfall Forecast */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CloudRain className="w-4 h-4" />
                {t('dashboard.rainfall')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentFarm.rainfall}</div>
              <p className="text-sm text-muted-foreground mt-1">{t('dashboard.mm')}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {t('dashboard.lastUpdated')}: {formatDistanceToNow(currentFarm.lastUpdated.weather, { 
                  addSuffix: true, 
                  locale: currentLocale 
                })}
              </p>
            </CardContent>
          </Card>

          {/* Groundwater */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                {t('dashboard.groundwater')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentFarm.groundwater}</div>
              <p className="text-sm text-muted-foreground mt-1">{t('dashboard.meters')}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {t('dashboard.lastUpdated')}: {formatDistanceToNow(currentFarm.lastUpdated.iot, { 
                  addSuffix: true, 
                  locale: currentLocale 
                })}
              </p>
            </CardContent>
          </Card>

          {/* Disease Risk */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t('dashboard.diseaseRisk')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentFarm.diseaseRisk}%</div>
              <Badge variant="outline" className={`mt-2 bg-${riskStatus.color}/10 text-${riskStatus.color}`}>
                {riskStatus.label}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                {t('dashboard.lastUpdated')}: {formatDistanceToNow(currentFarm.lastUpdated.weather, { 
                  addSuffix: true, 
                  locale: currentLocale 
                })}
              </p>
            </CardContent>
          </Card>

          {/* Yield Forecast */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t('dashboard.yieldForecast')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentFarm.yieldForecast.value}</div>
              <p className="text-sm text-muted-foreground mt-1">{t('dashboard.quintalsPerAcre')}</p>
              <p className="text-sm text-muted-foreground mt-2">
                95% CI: {currentFarm.yieldForecast.ci[0]} - {currentFarm.yieldForecast.ci[1]}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {t('dashboard.lastUpdated')}: {formatDistanceToNow(currentFarm.lastUpdated.satellite, { 
                  addSuffix: true, 
                  locale: currentLocale 
                })}
              </p>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
