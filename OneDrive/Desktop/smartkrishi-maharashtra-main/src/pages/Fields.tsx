import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search } from 'lucide-react';
import { useFarmStore } from '@/store/farmStore';
import { useToast } from '@/hooks/use-toast';
import { generateFieldsCSV } from '@/lib/csvGenerator';
import fieldsData from '@/data/extendedFields.json';

const Fields = () => {
  const { selectedFarm, farms } = useFarmStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [fields, setFields] = useState(fieldsData);
  
  const farm = farms.find(f => f.id === selectedFarm);
  
  const filteredFields = fields.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    generateFieldsCSV(filteredFields, farm?.name || 'Farm');
    toast({
      title: 'Export Complete',
      description: 'Fields data exported to CSV successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fields</h1>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Field List - {farm?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search fields or crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Growth Stage</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>NDVI Avg</TableHead>
                <TableHead>Alerts</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFields.map(field => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>{field.crop}</TableCell>
                  <TableCell>{field.stage}</TableCell>
                  <TableCell>{field.area} acres</TableCell>
                  <TableCell>
                    <Badge variant={field.ndvi >= 0.7 ? 'default' : 'destructive'}>
                      {field.ndvi.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {field.alerts > 0 ? (
                      <Badge variant="destructive">{field.alerts}</Badge>
                    ) : (
                      <Badge variant="outline">0</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/fields/${field.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Fields;
