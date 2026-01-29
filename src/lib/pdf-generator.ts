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

// Helper function to get calculation breakdown for each pain point
function getPainCalculationBreakdown(painId: number, data: PDFData): string[] {
  const factory = data.inputs.factory;
  const totalCostPerKg = factory.materialCostPerKg + factory.processingCostPerKg;

  switch (painId) {
    case 1: {
      const trials = data.inputs.pain1.rejectedTrialsPerMonth;
      const runTime = data.inputs.pain1.runTimePerBatch;
      const output = factory.outputPerHour;
      return [
        `• Rejected trials per month: ${trials} trials`,
        `• Output per hour: ${output} kg/hr`,
        `• Run time per batch: ${runTime} hours`,
        `• Material cost: ₹${factory.materialCostPerKg}/kg`,
        `• Processing cost: ₹${factory.processingCostPerKg}/kg`,
        `• Total cost per kg: ₹${totalCostPerKg}/kg`,
        ``,
        `Calculation:`,
        `${trials} trials × ${output} kg/hr × ${runTime} hrs × ₹${totalCostPerKg}/kg = ${formatCurrency(trials * output * runTime * totalCostPerKg)}/month`
      ];
    }
    case 2: {
      const savings = data.inputs.pain2.pigmentSavingsPerKg;
      const output = factory.outputPerHour;
      const hours = factory.workingHoursPerDay;
      const days = factory.workingDaysPerMonth;
      return [
        `• Pigment savings per kg: ₹${savings}/kg`,
        `• Output per hour: ${output} kg/hr`,
        `• Working hours per day: ${hours} hrs`,
        `• Working days per month: ${days} days`,
        ``,
        `Calculation:`,
        `₹${savings}/kg × ${output} kg/hr × ${hours} hrs/day × ${days} days = ${formatCurrency(savings * output * hours * days)}/month`
      ];
    }
    case 3: {
      const requests = data.inputs.pain3.smallBatchRequestsPerYear;
      const loss = data.inputs.pain3.lossPerCase;
      return [
        `• Small batch requests per year: ${requests}`,
        `• Loss per case: ${formatCurrency(loss)}`,
        ``,
        `Calculation:`,
        `${requests} requests × ${formatCurrency(loss)} = ${formatCurrency(requests * loss)}/year`
      ];
    }
    case 4: {
      const requests = data.inputs.pain4.experimentRequestsPerYear;
      const loss = data.inputs.pain4.lossPerCase;
      return [
        `• Experiment requests per year: ${requests}`,
        `• Loss per case: ${formatCurrency(loss)}`,
        ``,
        `Calculation:`,
        `${requests} experiments × ${formatCurrency(loss)} = ${formatCurrency(requests * loss)}/year`
      ];
    }
    case 5: {
      const savings = data.inputs.pain5.recycledMaterialSavingsPerKg;
      const machines = data.inputs.pain5.numberOfMachines;
      const output = factory.outputPerHour;
      const hours = factory.workingHoursPerDay;
      const days = factory.workingDaysPerMonth;
      return [
        `• Recycled material savings per kg: ₹${savings}/kg`,
        `• Number of machines: ${machines}`,
        `• Output per hour: ${output} kg/hr`,
        `• Working hours per day: ${hours} hrs`,
        `• Working days per month: ${days} days`,
        ``,
        `Calculation:`,
        `₹${savings}/kg × ${output} kg/hr × ${hours} hrs × ${days} days × ${machines} machines = ${formatCurrency(savings * output * hours * days * machines)}/month`
      ];
    }
    case 6: {
      const requests = data.inputs.pain6.peakSeasonRequestsPerYear;
      const loss = data.inputs.pain6.lossPerCase;
      return [
        `• Peak season requests per year: ${requests}`,
        `• Loss per case: ${formatCurrency(loss)}`,
        ``,
        `Calculation:`,
        `${requests} requests × ${formatCurrency(loss)} = ${formatCurrency(requests * loss)}/year`
      ];
    }
    default:
      return [];
  }
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

  // ===== PAIN POINTS - DETAILED BREAKDOWN =====
  const selectedPains = data.results.filter(p => p.isSelected);

  if (selectedPains.length > 0) {
    yPosition = checkPageBreak(doc, yPosition, 20);

    doc.setTextColor(...darkGray);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Pain Points & Impact Analysis", 15, yPosition);
    yPosition += 10;

    // For each pain point, create a detailed section
    for (let i = 0; i < selectedPains.length; i++) {
      const pain = selectedPains[i];

      // Check if we need a new page
      yPosition = checkPageBreak(doc, yPosition, 80);

      // Pain point title
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text(`Pain Point ${pain.id}: ${pain.title}`, 15, yPosition);
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

      // Calculation breakdown
      const breakdown = getPainCalculationBreakdown(pain.id, data);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...lightGray);

      for (const line of breakdown) {
        if (line === '') {
          yPosition += 3;
        } else if (line.startsWith('Calculation:')) {
          yPosition += 2;
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...darkGray);
          doc.text(line, 15, yPosition);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...lightGray);
          yPosition += 6;
        } else {
          doc.text(line, 15, yPosition);
          yPosition += 5;
        }
      }

      yPosition += 5;

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
      doc.text(formatCurrency(pain.monthlyLoss), 20, yPosition + 15);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...lightGray);
      doc.text("Annual Loss:", pageWidth / 2 + 10, yPosition + 8);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text(formatCurrency(pain.annualLoss), pageWidth / 2 + 10, yPosition + 15);

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

  // Benefits list
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
  doc.setTextColor(...lightGray);

  for (const benefit of benefits) {
    const benefitLines = doc.splitTextToSize(`• ${benefit}`, pageWidth - 35);
    doc.text(benefitLines, 20, yPosition);
    yPosition += benefitLines.length * 5 + 2;
  }

  yPosition += 6;

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
  doc.text(formatCurrency(data.total), leftX, boxY + 12);

  // Monthly Savings
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Monthly Savings:", leftX, boxY + 28);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(data.total / 12), leftX, boxY + 38);

  // 5-Year Savings
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("5-Year Savings:", rightX, boxY);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(data.total * 5), rightX, boxY + 10);

  // Payback Period
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Payback Period:", rightX, boxY + 28);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("< 12 Months", rightX, boxY + 38);

  yPosition += 85;

  // ===== CUSTOMER SHOWCASE =====
  yPosition = checkPageBreak(doc, yPosition, 60);

  doc.setTextColor(...darkGray);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Trusted by Industry Leaders", 15, yPosition);
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
    '/logos/tapidor.png'
  ];

  const logosPerRow = 4;
  const logoWidth = 35;
  const logoHeight = 20;
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
  yPosition = checkPageBreak(doc, yPosition, 40);

  // CTA Box
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(15, yPosition, pageWidth - 30, 35, 3, 3, 'F');

  // CTA Text
  doc.setTextColor(...darkGray);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Ready to transform your lab?", pageWidth / 2, yPosition + 10, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightGray);
  doc.text("Contact us today to discuss how Neptune Lab can solve your production challenges.", pageWidth / 2, yPosition + 18, { align: 'center' });

  // Contact info with clickable links
  const contactY = yPosition + 28;
  const contactSpacing = (pageWidth - 30) / 4;

  // Email
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  const emailX = 15 + contactSpacing * 0.5;
  doc.textWithLink("📧 nikunj@neptuneplastic.net", emailX, contactY, {
    url: "mailto:nikunj@neptuneplastic.net",
    align: 'center'
  });

  // Phone
  const phoneX = 15 + contactSpacing * 1.5;
  doc.textWithLink("📞 +91 9830569698", phoneX, contactY, {
    url: "tel:+919830569698",
    align: 'center'
  });

  // WhatsApp
  const whatsappX = 15 + contactSpacing * 2.5;
  doc.textWithLink("💬 +91 7439505779", whatsappX, contactY, {
    url: "https://wa.me/917439505779",
    align: 'center'
  });

  // Website
  const websiteX = 15 + contactSpacing * 3.5;
  doc.textWithLink("🌐 neptuneplastic.net", websiteX, contactY, {
    url: "https://neptuneplastic.net/",
    align: 'center'
  });

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
