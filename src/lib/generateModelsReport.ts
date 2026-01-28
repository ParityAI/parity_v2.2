import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface Model {
  id: string;
  name: string;
  provider: string | null;
  version: string | null;
  description: string | null;
  status: "approved" | "restricted" | "pending" | "blocked";
  risk_level: "high" | "medium" | "low" | null;
  security_assessment: boolean | null;
  created_at: string;
  vendors?: { name: string } | null;
}

interface ModelsReportData {
  models: Model[];
  organizationName?: string;
}

export function generateModelsReport(data: ModelsReportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Helper to add new page if needed
  const checkPageBreak = (height: number) => {
    if (yPos + height > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Title
  doc.setFontSize(24);
  doc.setTextColor(16, 185, 129);
  doc.text("AI Model Inventory Report", margin, yPos);
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

  const totalModels = data.models.length;
  const approvedModels = data.models.filter(m => m.status === "approved").length;
  const pendingModels = data.models.filter(m => m.status === "pending").length;
  const restrictedModels = data.models.filter(m => m.status === "restricted").length;
  const blockedModels = data.models.filter(m => m.status === "blocked").length;
  const highRiskModels = data.models.filter(m => m.risk_level === "high").length;
  const assessedModels = data.models.filter(m => m.security_assessment).length;

  const approvalRate = totalModels > 0 ? Math.round((approvedModels / totalModels) * 100) : 0;

  const summaryData = [
    ["Total Models Tracked", totalModels.toString()],
    ["Approved Models", approvedModels.toString()],
    ["Pending Review", pendingModels.toString()],
    ["Restricted Models", restrictedModels.toString()],
    ["Blocked Models", blockedModels.toString()],
    ["High Risk Models", highRiskModels.toString()],
    ["Security Assessed", assessedModels.toString()],
    ["Approval Rate", `${approvalRate}%`],
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

  const mediumRiskModels = data.models.filter(m => m.risk_level === "medium").length;
  const lowRiskModels = data.models.filter(m => m.risk_level === "low").length;
  const unassessedRisk = data.models.filter(m => !m.risk_level).length;

  const riskData = [
    ["High Risk", highRiskModels.toString(), `${totalModels > 0 ? Math.round((highRiskModels / totalModels) * 100) : 0}%`],
    ["Medium Risk", mediumRiskModels.toString(), `${totalModels > 0 ? Math.round((mediumRiskModels / totalModels) * 100) : 0}%`],
    ["Low Risk", lowRiskModels.toString(), `${totalModels > 0 ? Math.round((lowRiskModels / totalModels) * 100) : 0}%`],
    ["Unassessed", unassessedRisk.toString(), `${totalModels > 0 ? Math.round((unassessedRisk / totalModels) * 100) : 0}%`],
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

  // Model Details Table
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Model Inventory Details", margin, yPos);
  yPos += 10;

  const modelTableData = data.models.map(model => [
    model.name,
    model.provider || "N/A",
    model.version || "N/A",
    model.status.toUpperCase(),
    (model.risk_level || "N/A").toUpperCase(),
    model.security_assessment ? "Yes" : "No",
    model.vendors?.name || "N/A",
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Name", "Provider", "Version", "Status", "Risk", "Assessed", "Vendor"]],
    body: modelTableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 25 },
      2: { cellWidth: 20 },
      3: { cellWidth: 22 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 30 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // High Risk Models Section
  const highRisk = data.models.filter(m => m.risk_level === "high");
  if (highRisk.length > 0) {
    checkPageBreak(50);
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 38); // Red color for high risk
    doc.text("High Risk Models - Attention Required", margin, yPos);
    yPos += 10;

    highRisk.forEach(model => {
      checkPageBreak(25);
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.text(`• ${model.name}`, margin, yPos);
      yPos += 6;

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`  Provider: ${model.provider || "N/A"} | Status: ${model.status} | Vendor: ${model.vendors?.name || "N/A"}`, margin, yPos);
      yPos += 5;

      if (model.description) {
        const descLines = doc.splitTextToSize(`  ${model.description}`, pageWidth - margin * 2 - 10);
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
      `Page ${i} of ${pageCount} | Confidential - AI Governance Report`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  const fileName = `model-inventory-report-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
}
