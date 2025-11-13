import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, FileText } from 'lucide-react';

const Soil = () => {
  const reports = [
    { fieldId: 'field-a', fieldName: 'Field A', crop: 'Sugarcane', sampledAt: '2025-10-08', status: 'good' },
    { fieldId: 'field-b', fieldName: 'Field B', crop: 'Onion', sampledAt: '2025-10-10', status: 'ok' },
    { fieldId: 'field-c', fieldName: 'Field C', crop: 'Soybean', sampledAt: '2025-10-05', status: 'attention' },
    { fieldId: 'field-d', fieldName: 'Field D', crop: 'Wheat', sampledAt: '2025-10-12', status: 'good' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'ok': return 'bg-yellow-500';
      case 'attention': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return <Badge className="bg-green-600">Good</Badge>;
      case 'ok': return <Badge className="bg-yellow-600">OK</Badge>;
      case 'attention': return <Badge variant="destructive">Needs Attention</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TestTube className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Soil Analysis</h1>
          <p className="text-muted-foreground">Comprehensive soil reports by field</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Good Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {reports.filter(r => r.status === 'good').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {reports.filter(r => r.status === 'attention').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg pH</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7.2</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map(report => (
          <Card key={report.fieldId}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{report.fieldName}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{report.crop}</p>
                </div>
                {getStatusBadge(report.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-muted rounded">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)} mx-auto mb-1`} />
                  <p className="text-xs text-muted-foreground">pH</p>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor('good')} mx-auto mb-1`} />
                  <p className="text-xs text-muted-foreground">N</p>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor('ok')} mx-auto mb-1`} />
                  <p className="text-xs text-muted-foreground">P</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Sampled: {new Date(report.sampledAt).toLocaleDateString()}
                </p>
                <Link to={`/soil/${report.fieldId}`}>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Soil;
