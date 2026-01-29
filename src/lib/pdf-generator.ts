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

// Helper function to load image as base64
async function loadImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Failed to load image: ${url}`, error);
    return '';
  }
}

// Helper function to check if we need a new page
function checkPageBreak(doc: jsPDF, yPosition: number, requiredSpace: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (yPosition + requiredSpace > pageHeight - 30) {
    doc.addPage();
    return 20; // Top margin for new page
  }
  return yPosition;
}

// Helper to format currency for PDF (avoiding Unicode issues)
function formatPDFCurrency(amount: number): string {
  const formatted = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    useGrouping: true,
  });
  return `Rs. ${formatted}`;
}

// Helper function to get calculation inputs for table format
function getPainCalculationTable(painId: number, data: PDFData): string[][] {
  const factory = data.inputs.factory;
  const totalCostPerKg = factory.materialCostPerKg + factory.processingCostPerKg;

  switch (painId) {
    case 1: {
      const trials = data.inputs.pain1.rejectedTrialsPerMonth;
      const runTime = data.inputs.pain1.runTimePerBatch;
      const output = factory.outputPerHour;
      const monthlyLoss = trials * output * runTime * totalCostPerKg;
      return [
        ['Rejected trials per month', `${trials} trials`],
        ['Output per hour', `${output} kg/hr`],
        ['Run time per batch', `${runTime} hours`],
        ['Material cost per kg', `Rs. ${factory.materialCostPerKg}/kg`],
        ['Processing cost per kg', `Rs. ${factory.processingCostPerKg}/kg`],
        ['Total cost per kg', `Rs. ${totalCostPerKg}/kg`],
        ['', ''],
        ['Formula', `${trials} × ${output} × ${runTime} × Rs. ${totalCostPerKg}`],
        ['Monthly Impact', formatPDFCurrency(monthlyLoss)],
      ];
    }
    case 2: {
      const savings = data.inputs.pain2.pigmentSavingsPerKg;
      const output = factory.outputPerHour;
      const hours = factory.workingHoursPerDay;
      const days = factory.workingDaysPerMonth;
      const monthlyLoss = savings * output * hours * days;
      return [
        ['Pigment savings per kg', `Rs. ${savings}/kg`],
        ['Output per hour', `${output} kg/hr`],
        ['Working hours per day', `${hours} hrs`],
        ['Working days per month', `${days} days`],
        ['', ''],
        ['Formula', `Rs. ${savings} × ${output} × ${hours} × ${days}`],
        ['Monthly Impact', formatPDFCurrency(monthlyLoss)],
      ];
    }
    case 3: {
      const requests = data.inputs.pain3.smallBatchRequestsPerYear;
      const loss = data.inputs.pain3.lossPerCase;
      const annualLoss = requests * loss;
      return [
        ['Small batch requests per year', `${requests}`],
        ['Loss per case', formatPDFCurrency(loss)],
        ['', ''],
        ['Formula', `${requests} × ${formatPDFCurrency(loss)}`],
        ['Annual Impact', formatPDFCurrency(annualLoss)],
      ];
    }
    case 4: {
      const requests = data.inputs.pain4.experimentRequestsPerYear;
      const loss = data.inputs.pain4.lossPerCase;
      const annualLoss = requests * loss;
      return [
        ['Experiment requests per year', `${requests}`],
        ['Loss per case', formatPDFCurrency(loss)],
        ['', ''],
        ['Formula', `${requests} × ${formatPDFCurrency(loss)}`],
        ['Annual Impact', formatPDFCurrency(annualLoss)],
      ];
    }
    case 5: {
      const savings = data.inputs.pain5.recycledMaterialSavingsPerKg;
      const machines = data.inputs.pain5.numberOfMachines;
      const output = factory.outputPerHour;
      const hours = factory.workingHoursPerDay;
      const days = factory.workingDaysPerMonth;
      const monthlyLoss = savings * output * hours * days * machines;
      return [
        ['Recycled material savings per kg', `Rs. ${savings}/kg`],
        ['Number of machines', `${machines}`],
        ['Output per hour', `${output} kg/hr`],
        ['Working hours per day', `${hours} hrs`],
        ['Working days per month', `${days} days`],
        ['', ''],
        ['Formula', `Rs. ${savings} × ${output} × ${hours} × ${days} × ${machines}`],
        ['Monthly Impact', formatPDFCurrency(monthlyLoss)],
      ];
    }
    case 6: {
      const requests = data.inputs.pain6.peakSeasonRequestsPerYear;
      const loss = data.inputs.pain6.lossPerCase;
      const annualLoss = requests * loss;
      return [
        ['Peak season requests per year', `${requests}`],
        ['Loss per case', formatPDFCurrency(loss)],
        ['', ''],
        ['Formula', `${requests} × ${formatPDFCurrency(loss)}`],
        ['Annual Impact', formatPDFCurrency(annualLoss)],
      ];
    }
    default:
      return [];
  }
}

// Helper to draw a simple icon (circle with checkmark-like symbol)
function drawBulletIcon(doc: jsPDF, x: number, y: number, color: [number, number, number]) {
  // Draw small circle
  doc.setFillColor(...color);
  doc.circle(x, y - 1.5, 1.5, 'F');

  // Draw checkmark inside
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.line(x - 0.8, y - 1.5, x - 0.3, y - 1);
  doc.line(x - 0.3, y - 1, x + 0.8, y - 2.2);
}

// Helper to draw email icon (envelope)
function drawEmailIcon(doc: jsPDF, x: number, y: number, size: number, color: [number, number, number]) {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.3);
  // Envelope outline
  doc.rect(x, y, size, size * 0.7);
  // Envelope flap
  doc.line(x, y, x + size / 2, y + size * 0.4);
  doc.line(x + size, y, x + size / 2, y + size * 0.4);
}

// Helper to draw phone icon
function drawPhoneIcon(doc: jsPDF, x: number, y: number, size: number, color: [number, number, number]) {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.3);
  // Phone receiver curve
  const cx = x + size / 2;
  const cy = y + size / 2;
  doc.arc(cx - size * 0.2, cy - size * 0.2, size * 0.3, size * 0.3, 45, 135);
  doc.arc(cx + size * 0.2, cy + size * 0.2, size * 0.3, size * 0.3, 225, 315);
}

// Helper to draw WhatsApp icon (phone in speech bubble)
function drawWhatsAppIcon(doc: jsPDF, x: number, y: number, size: number, color: [number, number, number]) {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.3);
  // Speech bubble
  doc.circle(x + size / 2, y + size / 2, size * 0.4);
  // Small tail
  doc.line(x + size * 0.3, y + size * 0.8, x + size * 0.2, y + size);
}

// Helper to draw website icon (globe)
function drawGlobeIcon(doc: jsPDF, x: number, y: number, size: number, color: [number, number, number]) {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.3);
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.4;
  // Circle
  doc.circle(cx, cy, r);
  // Vertical line
  doc.line(cx, cy - r, cx, cy + r);
  // Horizontal line
  doc.line(cx - r, cy, cx + r, cy);
  // Curved lines
  doc.ellipse(cx, cy, r * 0.5, r);
}

export async function generateROIReport(data: PDFData): Promise<jsPDF> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const primaryColor: [number, number, number] = [224, 122, 95]; // #E07A5F
  const darkGray: [number, number, number] = [26, 26, 26]; // #1A1A1A
  const lightGray: [number, number, number] = [107, 114, 128]; // #6B7280

  let yPosition = 20;

  // ===== HEADER WITH LOGO =====
  // Load Neptune logo
  try {
    const logoBase64 = await loadImageAsBase64('/neptune-logo.png');
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 15, 15, 25, 25);
    }
  } catch (error) {
    console.error('Failed to load Neptune logo', error);
  }

  // Company name and title next to logo
  doc.setTextColor(...darkGray);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Neptune Plastics", 45, 25);

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...primaryColor);
  doc.text(`Lab ROI Analysis Report for ${data.lead.company}`, 45, 35);

  // Date
  const today = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.text(today, pageWidth - 15, 25, { align: 'right' });

  // Separator line
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(15, 45, pageWidth - 15, 45);

  yPosition = 55;

  // ===== FACTORY SETTINGS =====
  doc.setTextColor(...darkGray);
  doc.setFontSize(14);
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
      ['Material cost per kg', `Rs. ${data.inputs.factory.materialCostPerKg}/kg`],
      ['Processing cost per kg', `Rs. ${data.inputs.factory.processingCostPerKg}/kg`],
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

  // ===== PAIN POINTS - DETAILED BREAKDOWN =====
  const selectedPains = data.results.filter(p => p.isSelected);

  if (selectedPains.length > 0) {
    yPosition = checkPageBreak(doc, yPosition, 20);

    doc.setTextColor(...darkGray);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Pain Points & Impact Analysis", 15, yPosition);
    yPosition += 10;

    // For each pain point, create a detailed section with sequential numbering
    for (let i = 0; i < selectedPains.length; i++) {
      const pain = selectedPains[i];
      const sequentialNumber = i + 1; // Sequential: 1, 2, 3, 4...

      // Check if we need a new page
      yPosition = checkPageBreak(doc, yPosition, 80);

      // Pain point title with SEQUENTIAL number
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text(`Pain Point ${sequentialNumber}: ${pain.title}`, 15, yPosition);
      yPosition += 8;

      // Separator line
      doc.setDrawColor(...lightGray);
      doc.setLineWidth(0.3);
      doc.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 8;

      // Description
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...darkGray);
      const descLines = doc.splitTextToSize(pain.description, pageWidth - 30);
      doc.text(descLines, 15, yPosition);
      yPosition += descLines.length * 5 + 8;

      // Financial Impact Calculation header
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...darkGray);
      doc.text("Financial Impact Calculation:", 15, yPosition);
      yPosition += 8;

      // Calculation breakdown TABLE
      const calcTable = getPainCalculationTable(pain.id, data);

      autoTable(doc, {
        startY: yPosition,
        body: calcTable,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: lightGray,
          lineWidth: 0.1,
        },
        columnStyles: {
          0: {
            textColor: lightGray,
            cellWidth: 65,
          },
          1: {
            textColor: darkGray,
            fontStyle: 'bold',
            cellWidth: 'auto',
          },
        },
        margin: { left: 20, right: 15 },
        didParseCell: function(data) {
          // Make formula and result rows stand out
          if (data.row.index === calcTable.length - 2) {
            // Formula row
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.textColor = [26, 26, 26];
            data.cell.styles.fillColor = [249, 250, 251];
          }
          if (data.row.index === calcTable.length - 1) {
            // Result row
            data.cell.styles.fontSize = 11;
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.textColor = primaryColor;
            data.cell.styles.fillColor = [249, 250, 251];
          }
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 8;

      // Results box
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(15, yPosition, pageWidth - 30, 20, 2, 2, 'F');

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...lightGray);
      doc.text("Monthly Loss:", 20, yPosition + 8);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text(formatPDFCurrency(pain.monthlyLoss), 20, yPosition + 15);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...lightGray);
      doc.text("Annual Loss:", pageWidth / 2 + 10, yPosition + 8);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text(formatPDFCurrency(pain.annualLoss), pageWidth / 2 + 10, yPosition + 15);

      yPosition += 28;
    }
  }

  // ===== NON-TANGIBLE BENEFITS =====
  yPosition = checkPageBreak(doc, yPosition, 60);

  doc.setTextColor(...darkGray);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Beyond the Numbers: Non-Tangible Benefits", 15, yPosition);
  yPosition += 8;

  // Separator line
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.3);
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  yPosition += 10;

  // Intro paragraph
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);
  const introText = "While our calculations focus on quantifiable financial impact, the Neptune Lab delivers additional benefits that are difficult to measure but equally valuable to your business.";
  const introLines = doc.splitTextToSize(introText, pageWidth - 30);
  doc.text(introLines, 15, yPosition);
  yPosition += introLines.length * 5 + 8;

  // Hidden costs header
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Hidden Costs You're Currently Facing:", 15, yPosition);
  yPosition += 8;

  // Benefits list with professional icons
  const benefits = [
    "Transportation costs for rejected batches sent back and forth",
    "Loss of customer confidence and strained relationships",
    "Stress and uncertainty in production planning",
    "Missed innovation opportunities and competitive advantages",
    "Production disruption during critical peak seasons",
    "Inability to explore cost-saving material alternatives"
  ];

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);

  for (const benefit of benefits) {
    // Draw professional bullet icon
    drawBulletIcon(doc, 20, yPosition, primaryColor);

    const benefitLines = doc.splitTextToSize(benefit, pageWidth - 40);
    doc.text(benefitLines, 25, yPosition);
    yPosition += benefitLines.length * 5 + 3;
  }

  yPosition += 4;

  // Conclusion
  const conclusionText = "These intangible factors compound your losses but are difficult to quantify. The Neptune Lab eliminates these concerns entirely, giving you confidence, flexibility, and peace of mind.";
  const conclusionLines = doc.splitTextToSize(conclusionText, pageWidth - 30);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...darkGray);
  doc.text(conclusionLines, 15, yPosition);
  yPosition += conclusionLines.length * 5 + 15;

  // ===== FINANCIAL SUMMARY =====
  yPosition = checkPageBreak(doc, yPosition, 90);

  // Title
  doc.setTextColor(...darkGray);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Financial Summary", 15, yPosition);
  yPosition += 10;

  // Summary box
  doc.setFillColor(...primaryColor);
  doc.roundedRect(15, yPosition, pageWidth - 30, 70, 3, 3, 'F');

  // Grid layout for metrics
  const boxY = yPosition + 12;
  const leftX = 25;
  const rightX = pageWidth / 2 + 15;

  // Total Annual Savings (most prominent)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Total Annual Savings:", leftX, boxY);

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(formatPDFCurrency(data.total), leftX, boxY + 12);

  // Monthly Savings
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Monthly Savings:", leftX, boxY + 28);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(formatPDFCurrency(data.total / 12), leftX, boxY + 38);

  // 5-Year Savings
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("5-Year Savings:", rightX, boxY);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(formatPDFCurrency(data.total * 5), rightX, boxY + 10);

  // Payback Period
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Payback Period:", rightX, boxY + 28);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("< 12 Months", rightX, boxY + 38);

  yPosition += 85;

  // ===== CUSTOMER SHOWCASE =====
  yPosition = checkPageBreak(doc, yPosition, 70);

  doc.setTextColor(...darkGray);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("57+ Customers Including Industry Leaders", 15, yPosition);
  yPosition += 10;

  // Separator line
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.3);
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  yPosition += 12;

  // Load and display customer logos in a grid
  const logoFiles = [
    '/logos/bhavin.png',
    '/logos/swastick.png',
    '/logos/scj.png',
    '/logos/owens-corning.jpg',
    '/logos/jj-plastalloy.png',
    '/logos/blend-colours.png',
    '/logos/tapidor.png',
    '/logos/alok.jpeg',
    '/logos/sonali.jpeg'
  ];

  const logosPerRow = 3;
  const logoWidth = 40;
  const logoHeight = 22;
  const logoSpacing = (pageWidth - 30 - (logosPerRow * logoWidth)) / (logosPerRow - 1);

  let logoX = 15;
  let logoY = yPosition;
  let logoCount = 0;

  for (const logoFile of logoFiles) {
    try {
      const logoBase64 = await loadImageAsBase64(logoFile);
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
        logoCount++;
        logoX += logoWidth + logoSpacing;

        if (logoCount % logosPerRow === 0) {
          logoX = 15;
          logoY += logoHeight + 10;
        }
      }
    } catch (error) {
      console.error(`Failed to load logo: ${logoFile}`, error);
    }
  }

  yPosition = logoY + (logoCount % logosPerRow === 0 ? 0 : logoHeight) + 20;

  // ===== FOOTER WITH CONTACT INFO =====
  yPosition = checkPageBreak(doc, yPosition, 45);

  // CTA Box
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(15, yPosition, pageWidth - 30, 40, 3, 3, 'F');

  // CTA Text
  doc.setTextColor(...darkGray);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Ready to transform your lab?", pageWidth / 2, yPosition + 10, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightGray);
  doc.text("Contact us today to discuss how Neptune Lab can solve your production challenges.", pageWidth / 2, yPosition + 18, { align: 'center' });

  // Contact info with clickable icons and text
  const contactY = yPosition + 26;
  const iconSize = 4;

  doc.setFontSize(7.5);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "normal");

  // Email
  const emailX = pageWidth / 4 - 20;
  drawEmailIcon(doc, emailX, contactY - 2, iconSize, primaryColor);
  const emailText = "nikunj@neptuneplastic.net";
  doc.text(emailText, emailX + iconSize + 2, contactY + 1);
  const emailWidth = doc.getTextWidth(emailText);
  doc.link(emailX, contactY - 2, iconSize + emailWidth + 2, iconSize + 2, { url: "mailto:nikunj@neptuneplastic.net" });

  // Phone
  const phoneX = pageWidth / 2 - 18;
  drawPhoneIcon(doc, phoneX, contactY - 2, iconSize, primaryColor);
  const phoneText = "+91 9830569698";
  doc.text(phoneText, phoneX + iconSize + 2, contactY + 1);
  const phoneWidth = doc.getTextWidth(phoneText);
  doc.link(phoneX, contactY - 2, iconSize + phoneWidth + 2, iconSize + 2, { url: "tel:+919830569698" });

  // WhatsApp
  const whatsappX = (3 * pageWidth) / 4 - 20;
  drawWhatsAppIcon(doc, whatsappX, contactY - 2, iconSize, primaryColor);
  const whatsappText = "+91 7439505779";
  doc.text(whatsappText, whatsappX + iconSize + 2, contactY + 1);
  const whatsappWidth = doc.getTextWidth(whatsappText);
  doc.link(whatsappX, contactY - 2, iconSize + whatsappWidth + 2, iconSize + 2, { url: "https://wa.me/917439505779" });

  // Website (centered on second line)
  const websiteX = pageWidth / 2 - 16;
  drawGlobeIcon(doc, websiteX, contactY + 6, iconSize, primaryColor);
  const websiteText = "neptuneplastic.net";
  doc.text(websiteText, websiteX + iconSize + 2, contactY + 9);
  const websiteWidth = doc.getTextWidth(websiteText);
  doc.link(websiteX, contactY + 6, iconSize + websiteWidth + 2, iconSize + 2, { url: "https://neptuneplastic.net/" });

  // Page footer
  const footerY = pageHeight - 15;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightGray);
  doc.text("This report is generated based on the information provided and is for reference purposes only.", 15, footerY);

  const pageNum = `Page ${doc.getCurrentPageInfo().pageNumber} of ${doc.getNumberOfPages()}`;
  doc.text(pageNum, pageWidth - 15, footerY, { align: 'right' });

  return doc;
}

export async function downloadROIReport(data: PDFData) {
  const doc = await generateROIReport(data);
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
