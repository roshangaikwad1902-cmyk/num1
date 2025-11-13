import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateAdvisoryPDF = async (data: {
  farmName: string;
  ndvi: number;
  soilMoisture: number;
  rainfall: number;
  recommendation: string;
}) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Farm Advisory Report', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Farm: ${data.farmName}`, 20, 40);
  doc.text(`NDVI Health: ${data.ndvi.toFixed(2)}`, 20, 50);
  doc.text(`Soil Moisture: ${data.soilMoisture}%`, 20, 60);
  doc.text(`Forecast Rainfall: ${data.rainfall}mm`, 20, 70);
  
  doc.text('Recommendation:', 20, 90);
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(data.recommendation, 170);
  doc.text(lines, 20, 100);
  
  doc.text(`Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 20, 280);
  
  return doc;
};

export const generateSoilReportPDF = async (data: {
  fieldId: string;
  params: any;
  recommendations: any;
}) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text(`Soil Report - ${data.fieldId}`, 20, 20);
  
  doc.setFontSize(12);
  let yPos = 40;
  
  doc.text('Key Parameters:', 20, yPos);
  yPos += 10;
  
  Object.entries(data.params).slice(0, 12).forEach(([key, value]) => {
    doc.text(`${key}: ${value}`, 30, yPos);
    yPos += 8;
  });
  
  doc.text(`Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 20, 280);
  
  return doc;
};

export const generateWeatherReportPDF = async (data: {
  farmName: string;
  forecast: any[];
}) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Weather Report', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Farm: ${data.farmName}`, 20, 40);
  
  let yPos = 60;
  data.forecast.slice(0, 7).forEach((day: any) => {
    doc.text(`${day.date}: ${day.maxC}°C / ${day.minC}°C, Rain: ${day.rainMM}mm`, 20, yPos);
    yPos += 10;
  });
  
  doc.text(`Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 20, 280);
  
  return doc;
};

export const generateFieldReportPDF = async (fieldId: string, data: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text(`Field Report - ${fieldId}`, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`NDVI: ${data.ndvi}`, 20, 40);
  doc.text(`Crop: ${data.crop}`, 20, 50);
  doc.text(`Area: ${data.area} acres`, 20, 60);
  doc.text(`Thermal Hotspots: ${data.hotspots || 0}`, 20, 70);
  
  doc.text(`Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 20, 280);
  
  return doc;
};
