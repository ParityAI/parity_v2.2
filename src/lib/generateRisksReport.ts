import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface Risk {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  severity: "negligible" | "minor" | "moderate" | "major" | "critical";
  likelihood: "very_low" | "low" | "medium" | "high" | "very_high";
  mitigation_status: "not_started" | "in_progress" | "completed" | "accepted";
  mitigation_plan: string | null;
  review_date: string | null;
  created_at: string;
  models?: { name: string } | null;
  vendors?: { name: string } | null;
}

interface RisksReportData {
  risks: Risk[];
  organizationName?: string;
}

export function generateRisksReport(data: RisksReportData) {
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
  doc.text("Risk Management Report", margin, yPos);
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

  const totalRisks = data.risks.length;
  const criticalRisks = data.risks.filter(r => r.severity === "critical").length;
  const majorRisks = data.risks.filter(r => r.severity === "major").length;
  const veryHighLikelihood = data.risks.filter(r => r.likelihood === "very_high").length;
  const highLikelihood = data.risks.filter(r => r.likelihood === "high").length;
  const mitigatedRisks = data.risks.filter(r => r.mitigation_status === "completed").length;
  const inProgressRisks = data.risks.filter(r => r.mitigation_status === "in_progress").length;
  const acceptedRisks = data.risks.filter(r => r.mitigation_status === "accepted").length;

  const mitigationRate = totalRisks > 0
    ? Math.round(((mitigatedRisks + acceptedRisks) / totalRisks) * 100)
    : 0;

  const summaryData = [
    ["Total Risks Identified", totalRisks.toString()],
    ["Critical Severity", criticalRisks.toString()],
    ["Major Severity", majorRisks.toString()],
    ["Very High Likelihood", veryHighLikelihood.toString()],
    ["High Likelihood", highLikelihood.toString()],
    ["Mitigation Completed", mitigatedRisks.toString()],
    ["Mitigation In Progress", inProgressRisks.toString()],
    ["Risks Accepted", acceptedRisks.toString()],
    ["Mitigation Rate", `${mitigationRate}%`],
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

  // Risk Matrix
  checkPageBreak(60);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Risk Distribution by Category", margin, yPos);
  yPos += 10;

  const categories = [...new Set(data.risks.map(r => r.category || "Uncategorized"))];
  const categoryData = categories.map(category => {
    const categoryRisks = data.risks.filter(r => (r.category || "Uncategorized") === category);
    const critical = categoryRisks.filter(r => r.severity === "critical" || r.severity === "major").length;
    const mitigated = categoryRisks.filter(r => r.mitigation_status === "completed" || r.mitigation_status === "accepted").length;
    return [
      category,
      categoryRisks.length.toString(),
      critical.toString(),
      mitigated.toString(),
      `${categoryRisks.length > 0 ? Math.round((mitigated / categoryRisks.length) * 100) : 0}%`,
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [["Category", "Total", "Critical/Major", "Mitigated", "Mitigation Rate"]],
    body: categoryData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Risk Details Table
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Risk Register", margin, yPos);
  yPos += 10;

  const riskTableData = data.risks.map(risk => [
    risk.title.substring(0, 30) + (risk.title.length > 30 ? "..." : ""),
    risk.category || "N/A",
    risk.severity.toUpperCase(),
    risk.likelihood.replace(/_/g, " ").toUpperCase(),
    risk.mitigation_status.replace(/_/g, " ").toUpperCase(),
    risk.review_date ? format(new Date(risk.review_date), "MMM d") : "N/A",
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Risk", "Category", "Severity", "Likelihood", "Mitigation", "Review"]],
    body: riskTableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 7, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 28 },
      2: { cellWidth: 25 },
      3: { cellWidth: 28 },
      4: { cellWidth: 30 },
      5: { cellWidth: 22 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // High Priority Risks Section
  const highPriority = data.risks.filter(r =>
    (r.severity === "critical" || r.severity === "major") &&
    r.mitigation_status !== "completed" &&
    r.mitigation_status !== "accepted"
  );

  if (highPriority.length > 0) {
    checkPageBreak(50);
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 38);
    doc.text("High Priority Risks - Action Required", margin, yPos);
    yPos += 10;

    highPriority.forEach(risk => {
      checkPageBreak(35);
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.text(`• ${risk.title}`, margin, yPos);
      yPos += 6;

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`  Severity: ${risk.severity.toUpperCase()} | Likelihood: ${risk.likelihood.replace(/_/g, " ").toUpperCase()} | Category: ${risk.category || "N/A"}`, margin, yPos);
      yPos += 5;

      if (risk.description) {
        const descLines = doc.splitTextToSize(`  ${risk.description}`, pageWidth - margin * 2 - 10);
        descLines.slice(0, 2).forEach((line: string) => {
          doc.text(line, margin, yPos);
          yPos += 4;
        });
      }

      if (risk.mitigation_plan) {
        doc.setTextColor(60, 60, 60);
        const planLines = doc.splitTextToSize(`  Mitigation Plan: ${risk.mitigation_plan}`, pageWidth - margin * 2 - 10);
        planLines.slice(0, 2).forEach((line: string) => {
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
      `Page ${i} of ${pageCount} | Confidential - Risk Management Report`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  const fileName = `risk-report-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
}
