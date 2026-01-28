import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface Vendor {
  id: string;
  name: string;
  description: string | null;
  contact_email: string | null;
  website: string | null;
  risk_score: number | null;
  security_assessment: boolean | null;
  created_at: string;
}

interface VendorsReportData {
  vendors: Vendor[];
  organizationName?: string;
}

export function generateVendorsReport(data: VendorsReportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  const checkPageBreak = (height: number) => {
    if (yPos + height > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Title
  doc.setFontSize(24);
  doc.setTextColor(16, 185, 129);
  doc.text("Vendor Risk Assessment Report", margin, yPos);
  yPos += 10;

  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(data.organizationName || "Parity AI - Governance Platform", margin, yPos);
  yPos += 8;

  // Generated date
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`, margin, yPos);
  yPos += 15;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Executive Summary
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Executive Summary", margin, yPos);
  yPos += 10;

  const totalVendors = data.vendors.length;
  const highRiskVendors = data.vendors.filter(v => v.risk_score !== null && v.risk_score >= 70).length;
  const mediumRiskVendors = data.vendors.filter(v => v.risk_score !== null && v.risk_score >= 40 && v.risk_score < 70).length;
  const lowRiskVendors = data.vendors.filter(v => v.risk_score !== null && v.risk_score < 40).length;
  const unassessedVendors = data.vendors.filter(v => v.risk_score === null).length;
  const assessedVendors = data.vendors.filter(v => v.security_assessment).length;

  const avgRiskScore = data.vendors
    .filter(v => v.risk_score !== null)
    .reduce((sum, v) => sum + (v.risk_score || 0), 0) / (totalVendors - unassessedVendors) || 0;

  const summaryData = [
    ["Total Vendors", totalVendors.toString()],
    ["High Risk Vendors (70-100)", highRiskVendors.toString()],
    ["Medium Risk Vendors (40-69)", mediumRiskVendors.toString()],
    ["Low Risk Vendors (0-39)", lowRiskVendors.toString()],
    ["Unassessed Vendors", unassessedVendors.toString()],
    ["Security Assessed", assessedVendors.toString()],
    ["Average Risk Score", `${Math.round(avgRiskScore)}/100`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Risk Distribution
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Risk Distribution", margin, yPos);
  yPos += 10;

  const riskData = [
    ["High Risk (70-100)", highRiskVendors.toString(), `${totalVendors > 0 ? Math.round((highRiskVendors / totalVendors) * 100) : 0}%`],
    ["Medium Risk (40-69)", mediumRiskVendors.toString(), `${totalVendors > 0 ? Math.round((mediumRiskVendors / totalVendors) * 100) : 0}%`],
    ["Low Risk (0-39)", lowRiskVendors.toString(), `${totalVendors > 0 ? Math.round((lowRiskVendors / totalVendors) * 100) : 0}%`],
    ["Unassessed", unassessedVendors.toString(), `${totalVendors > 0 ? Math.round((unassessedVendors / totalVendors) * 100) : 0}%`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Risk Level", "Count", "Percentage"]],
    body: riskData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Vendor Details Table
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Vendor Inventory Details", margin, yPos);
  yPos += 10;

  const getRiskLevel = (score: number | null) => {
    if (score === null) return "N/A";
    if (score >= 70) return "HIGH";
    if (score >= 40) return "MEDIUM";
    return "LOW";
  };

  const vendorTableData = data.vendors.map(vendor => [
    vendor.name,
    vendor.contact_email || "N/A",
    vendor.risk_score !== null ? vendor.risk_score.toString() : "N/A",
    getRiskLevel(vendor.risk_score),
    vendor.security_assessment ? "Yes" : "No",
    format(new Date(vendor.created_at), "MMM d, yyyy"),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Name", "Contact Email", "Risk Score", "Risk Level", "Assessed", "Added"]],
    body: vendorTableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 45 },
      2: { cellWidth: 22 },
      3: { cellWidth: 22 },
      4: { cellWidth: 20 },
      5: { cellWidth: 28 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // High Risk Vendors Section
  const highRisk = data.vendors.filter(v => v.risk_score !== null && v.risk_score >= 70);
  if (highRisk.length > 0) {
    checkPageBreak(50);
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 38);
    doc.text("High Risk Vendors - Action Required", margin, yPos);
    yPos += 10;

    highRisk.forEach(vendor => {
      checkPageBreak(25);
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.text(`• ${vendor.name} (Risk Score: ${vendor.risk_score})`, margin, yPos);
      yPos += 6;

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`  Contact: ${vendor.contact_email || "N/A"} | Website: ${vendor.website || "N/A"}`, margin, yPos);
      yPos += 5;

      if (vendor.description) {
        const descLines = doc.splitTextToSize(`  ${vendor.description}`, pageWidth - margin * 2 - 10);
        descLines.slice(0, 2).forEach((line: string) => {
          doc.text(line, margin, yPos);
          yPos += 4;
        });
      }
      yPos += 5;
    });
  }

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | Confidential - Vendor Risk Assessment`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  const fileName = `vendor-risk-report-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
}
