import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Download, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { generateAlertsCSV } from '@/lib/csvGenerator';
import alertsData from '@/data/extendedAlerts.json';

const Alerts = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    setAlerts(alertsData);
  }, []);

  const handleResolve = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'resolved' } : a
    ));
    toast({
      title: 'Alert Resolved',
      description: 'Alert marked as resolved successfully.',
    });
  };

  const handleExport = () => {
    generateAlertsCSV(alerts);
    toast({
      title: 'Export Complete',
      description: 'Alerts exported to CSV successfully.',
    });
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filter || a.status === filter);

  const openAlerts = alerts.filter(a => a.status === 'open');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.alerts')}</h1>
          <p className="text-muted-foreground">
            {openAlerts.length} open alerts • {resolvedAlerts.length} resolved
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{openAlerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {alerts.filter(a => a.severity === 'high' && a.status === 'open').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{openAlerts.reduce((sum, a) => sum + a.rupeeImpact, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alert Center</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={setFilter} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="water">Water</TabsTrigger>
              <TabsTrigger value="weather">Weather</TabsTrigger>
              <TabsTrigger value="disease">Disease</TabsTrigger>
              <TabsTrigger value="yield">Yield</TabsTrigger>
            </TabsList>

            <div className="space-y-3">
              {filteredAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getSeverityColor(alert.severity) as any}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline">{alert.type}</Badge>
                        {alert.status === 'resolved' && (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Evidence:</strong> {alert.evidence}
                      </p>
                      <p className="text-sm text-primary">
                        <strong>Recommendation:</strong> {alert.recommendation}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(alert.ts).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                        <span className="font-semibold text-destructive">
                          Impact: ₹{alert.rupeeImpact.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {alert.status === 'open' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleResolve(alert.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredAlerts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No alerts found</p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
