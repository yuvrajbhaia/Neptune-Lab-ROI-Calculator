import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AllInputs, PainResult } from "./calculations";
import { formatCurrency } from "./utils";
import { LeadFormData } from "@/components/results/lead-form";

interface PDFData {
  lead: LeadFormData;
  inputs: AllInputs;
  results: PainResult[];
  total: number;
}

export function generateROIReport(data: PDFData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const primaryColor: [number, number, number] = [224, 122, 95]; // #E07A5F
  const darkGray: [number, number, number] = [26, 26, 26]; // #1A1A1A
  const lightGray: [number, number, number] = [107, 114, 128]; // #6B7280

  let yPosition = 20;

  // ===== HEADER =====
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Neptune Plastics", 15, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Lab ROI Analysis Report", 15, 30);

  // Date
  const today = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.setFontSize(10);
  doc.text(today, pageWidth - 15, 25, { align: 'right' });

  yPosition = 50;

  // ===== CLIENT INFORMATION =====
  doc.setTextColor(...darkGray);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Client Information", 15, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightGray);

  const clientInfo = [
    [`Name:`, data.lead.name],
    [`Position:`, data.lead.position],
    [`Company:`, data.lead.company],
    [`Phone:`, data.lead.phone],
    [`Email:`, data.lead.email],
  ];

  clientInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 15, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(value, 45, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // ===== FACTORY SETTINGS =====
  doc.setTextColor(...darkGray);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Factory Settings", 15, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [['Parameter', 'Value']],
    body: [
      ['Output per hour', `${data.inputs.factory.outputPerHour} kg/hr`],
      ['Working hours per day', `${data.inputs.factory.workingHoursPerDay} hrs`],
      ['Working days per month', `${data.inputs.factory.workingDaysPerMonth} days`],
      ['Material cost per kg', `₹${data.inputs.factory.materialCostPerKg}/kg`],
      ['Processing cost per kg', `₹${data.inputs.factory.processingCostPerKg}/kg`],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkGray
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    margin: { left: 15, right: 15 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // ===== SELECTED PAIN POINTS =====
  doc.setTextColor(...darkGray);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Selected Pain Points & Impact Analysis", 15, yPosition);
  yPosition += 8;

  const selectedPains = data.results.filter(p => p.isSelected);

  if (selectedPains.length === 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...lightGray);
    doc.text("No pain points selected", 15, yPosition);
    yPosition += 10;
  } else {
    const painTableData = selectedPains.map(pain => [
      pain.title,
      pain.description,
      formatCurrency(pain.annualLoss / 12),
      formatCurrency(pain.annualLoss),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Pain Point', 'Description', 'Monthly Impact', 'Annual Impact']],
      body: painTableData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: darkGray
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 70 },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { left: 15, right: 15 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // ===== FINANCIAL SUMMARY =====
  // Check if we need a new page
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFillColor(...primaryColor);
  doc.rect(15, yPosition, pageWidth - 30, 60, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Financial Summary", 20, yPosition + 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const summaryY = yPosition + 20;
  doc.text("Total Annual Savings:", 20, summaryY);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(data.total), 20, summaryY + 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Monthly Savings:", 20, summaryY + 20);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(data.total / 12), 20, summaryY + 28);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("5-Year Savings:", pageWidth / 2 + 10, summaryY);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(data.total * 5), pageWidth / 2 + 10, summaryY + 8);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Payback Period:", pageWidth / 2 + 10, summaryY + 20);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("< 12 Months", pageWidth / 2 + 10, summaryY + 28);

  yPosition += 70;

  // ===== FOOTER =====
  const footerY = pageHeight - 25;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightGray);
  doc.text("This report is generated based on the information provided and is for reference purposes only.", 15, footerY);
  doc.text("For detailed pricing and customization, please contact Neptune Plastics.", 15, footerY + 5);
  doc.setTextColor(...primaryColor);
  doc.text("www.neptuneplasticlab.in", 15, footerY + 10);

  doc.setTextColor(...lightGray);
  const pageNum = `Page 1 of ${doc.getNumberOfPages()}`;
  doc.text(pageNum, pageWidth - 15, footerY + 10, { align: 'right' });

  return doc;
}

export async function downloadROIReport(data: PDFData) {
  const doc = generateROIReport(data);
  const fileName = `Neptune_ROI_Report_${data.lead.company.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

export async function downloadQuotation(quotationPdfUrl: string, companyName: string) {
  try {
    const response = await fetch(quotationPdfUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Neptune_Quotation_${companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading quotation:', error);
    throw new Error('Failed to download quotation');
  }
}

export async function downloadBothPDFs(data: PDFData, quotationPdfUrl: string) {
  // Download ROI Report
  await downloadROIReport(data);

  // Small delay to prevent browser blocking multiple downloads
  await new Promise(resolve => setTimeout(resolve, 500));

  // Download Quotation
  await downloadQuotation(quotationPdfUrl, data.lead.company);
}
