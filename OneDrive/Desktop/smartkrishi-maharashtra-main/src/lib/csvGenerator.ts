export const generateCSV = (headers: string[], rows: any[][]) => {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

export const downloadCSV = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateFieldsCSV = (fields: any[], farmName: string) => {
  const headers = ['Field', 'Crop', 'Stage', 'NDVI', 'Alerts'];
  const rows = fields.map(f => [f.name, f.crop, f.stage, f.ndvi, f.alerts]);
  const blob = generateCSV(headers, rows);
  downloadCSV(blob, `fields_${farmName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
};

export const generateAlertsCSV = (alerts: any[]) => {
  const headers = ['ID', 'Type', 'Severity', 'Title', 'Evidence', 'Recommendation', 'Impact (₹)', 'Timestamp', 'Status'];
  const rows = alerts.map(a => [a.id, a.type, a.severity, a.title, a.evidence, a.recommendation, a.rupeeImpact, a.ts, a.status]);
  const blob = generateCSV(headers, rows);
  downloadCSV(blob, `alerts_${new Date().toISOString().split('T')[0]}.csv`);
};

export const generateIoTCSV = (sensors: any[]) => {
  const headers = ['Node ID', 'Crop', 'Soil Type', 'Status', 'Battery (%)', 'RSSI (dBm)'];
  const rows = sensors.map(s => [s.id, s.crop, s.soil, s.status, s.battery, s.rssi]);
  const blob = generateCSV(headers, rows);
  downloadCSV(blob, `iot_data_${new Date().toISOString().split('T')[0]}.csv`);
};

export const generateMarketCSV = (marketData: any[]) => {
  const headers = ['Date', 'Commodity', 'Min Price', 'Max Price', 'Modal Price', 'Market'];
  const rows = marketData.map(m => [m.date, m.commodity, m.min, m.max, m.modal, m.marketName]);
  const blob = generateCSV(headers, rows);
  downloadCSV(blob, `market_prices_${new Date().toISOString().split('T')[0]}.csv`);
};
