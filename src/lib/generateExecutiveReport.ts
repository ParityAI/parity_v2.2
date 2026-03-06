import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface ExecutiveReportData {
  models: {
    total: number;
    approved: number;
    pending: number;
    highRisk: number;
  };
  vendors: {
    total: number;
    assessed: number;
    highRisk: number;
    avgRiskScore: number;
  };
  incidents: {
    total: number;
    open: number;
    critical: number;
    closedThisMonth: number;
  };
  compliance: {
    total: number;
    compliant: number;
    overdue: number;
    avgScore: number;
  };
  risks: {
    total: number;
    critical: number;
    mitigated: number;
    inProgress: number;
  };
  organizationName?: string;
}

export function generateExecutiveReport(data: ExecutiveReportData) {
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
  doc.setFontSize(28);
  doc.setTextColor(16, 185, 129);
  doc.text("Executive Dashboard Report", margin, yPos);
  yPos += 12;

  // Subtitle
  doc.setFontSize(14);
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

  // Overall Health Score
  const overallScore = calculateOverallHealth(data);
  
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text("AI Governance Health Score", margin, yPos);
  yPos += 15;

  // Health score visual
  const scoreColor = overallScore >= 80 ? [16, 185, 129] : overallScore >= 60 ? [245, 158, 11] : [239, 68, 68];
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(margin, yPos, 50, 25, 3, 3, "F");
  
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(`${overallScore}`, margin + 25, yPos + 17, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(getHealthLabel(overallScore), margin + 60, yPos + 12);
  doc.text("Based on compliance, risk mitigation, and incident resolution metrics", margin + 60, yPos + 20);
  yPos += 40;

  // Key Metrics Grid
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Key Performance Indicators", margin, yPos);
  yPos += 10;

  const kpiData = [
    ["AI Models", `${data.models.approved}/${data.models.total} Approved`, `${data.models.highRisk} High Risk`, data.models.total > 0 ? `${Math.round((data.models.approved / data.models.total) * 100)}%` : "0%"],
    ["Vendors", `${data.vendors.assessed}/${data.vendors.total} Assessed`, `${data.vendors.highRisk} High Risk`, `Avg Score: ${data.vendors.avgRiskScore}`],
    ["Compliance", `${data.compliance.compliant}/${data.compliance.total} Compliant`, `${data.compliance.overdue} Overdue`, `Avg: ${data.compliance.avgScore}%`],
    ["Incidents", `${data.incidents.total} Total`, `${data.incidents.open} Open`, `${data.incidents.critical} Critical`],
    ["Risks", `${data.risks.total} Identified`, `${data.risks.mitigated} Mitigated`, `${data.risks.critical} Critical`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Category", "Status", "Attention", "Metric"]],
    body: kpiData,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: "bold" },
      1: { cellWidth: 50 },
      2: { cellWidth: 40 },
      3: { cellWidth: 45 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 25;

  // Risk Summary
  checkPageBreak(80);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Risk & Compliance Overview", margin, yPos);
  yPos += 12;

  // Compliance Rate
  const complianceRate = data.compliance.total > 0
    ? Math.round((data.compliance.compliant / data.compliance.total) * 100)
    : 0;
  
  // Risk Mitigation Rate
  const riskMitigationRate = data.risks.total > 0
    ? Math.round((data.risks.mitigated / data.risks.total) * 100)
    : 0;

  // Incident Resolution Rate
  const incidentResolutionRate = data.incidents.total > 0
    ? Math.round(((data.incidents.total - data.incidents.open) / data.incidents.total) * 100)
    : 0;

  const ratesData = [
    ["Compliance Rate", `${complianceRate}%`, complianceRate >= 80 ? "On Track" : complianceRate >= 60 ? "Needs Attention" : "Critical"],
    ["Risk Mitigation Rate", `${riskMitigationRate}%`, riskMitigationRate >= 70 ? "On Track" : riskMitigationRate >= 50 ? "Needs Attention" : "Critical"],
    ["Incident Resolution Rate", `${incidentResolutionRate}%`, incidentResolutionRate >= 80 ? "On Track" : incidentResolutionRate >= 60 ? "Needs Attention" : "Critical"],
    ["Model Approval Rate", `${data.models.total > 0 ? Math.round((data.models.approved / data.models.total) * 100) : 0}%`, data.models.pending > 0 ? `${data.models.pending} Pending` : "All Clear"],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Metric", "Rate", "Status"]],
    body: ratesData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 11 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40 },
      2: { cellWidth: 60 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 25;

  // Action Items
  checkPageBreak(60);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Priority Action Items", margin, yPos);
  yPos += 12;

  const actionItems: string[] = [];
  
  if (data.incidents.critical > 0) {
    actionItems.push(`Resolve ${data.incidents.critical} critical severity incident(s) immediately`);
  }
  if (data.risks.critical > 0) {
    actionItems.push(`Address ${data.risks.critical} critical risk(s) requiring urgent mitigation`);
  }
  if (data.compliance.overdue > 0) {
    actionItems.push(`Complete ${data.compliance.overdue} overdue compliance assessment(s)`);
  }
  if (data.models.pending > 0) {
    actionItems.push(`Review ${data.models.pending} pending model approval request(s)`);
  }
  if (data.vendors.highRisk > 0) {
    actionItems.push(`Reassess ${data.vendors.highRisk} high-risk vendor relationship(s)`);
  }
  if (actionItems.length === 0) {
    actionItems.push("No critical action items at this time - continue monitoring");
  }

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  actionItems.forEach((item, index) => {
    checkPageBreak(10);
    doc.text(`${index + 1}. ${item}`, margin + 5, yPos);
    yPos += 8;
  });

  yPos += 15;

  // Recommendations
  checkPageBreak(60);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Strategic Recommendations", margin, yPos);
  yPos += 12;

  const recommendations = generateRecommendations(data);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  recommendations.forEach((rec, index) => {
    checkPageBreak(15);
    const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - margin * 2 - 10);
    lines.forEach((line: string) => {
      doc.text(line, margin + 5, yPos);
      yPos += 5;
    });
    yPos += 3;
  });

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | Confidential - Executive Summary Report`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  const fileName = `executive-report-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
}

function calculateOverallHealth(data: ExecutiveReportData): number {
  let score = 100;
  
  // Deduct for open incidents
  score -= data.incidents.open * 2;
  score -= data.incidents.critical * 10;
  
  // Deduct for non-compliance
  if (data.compliance.total > 0) {
    const nonCompliant = data.compliance.total - data.compliance.compliant;
    score -= nonCompliant * 5;
  }
  
  // Deduct for unmitigated risks
  const unmitigatedRisks = data.risks.total - data.risks.mitigated;
  score -= unmitigatedRisks * 2;
  score -= data.risks.critical * 8;
  
  // Deduct for high-risk vendors
  score -= data.vendors.highRisk * 3;
  
  // Deduct for pending models
  score -= data.models.pending * 2;
  score -= data.models.highRisk * 3;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getHealthLabel(score: number): string {
  if (score >= 90) return "Excellent - Strong governance posture";
  if (score >= 80) return "Good - Minor improvements recommended";
  if (score >= 70) return "Fair - Several areas need attention";
  if (score >= 60) return "Concerning - Multiple issues require action";
  return "Critical - Immediate action required";
}

function generateRecommendations(data: ExecutiveReportData): string[] {
  const recs: string[] = [];
  
  if (data.incidents.critical > 0) {
    recs.push("Establish a dedicated incident response team to address critical incidents within 24 hours");
  }
  
  if (data.compliance.avgScore < 70) {
    recs.push("Implement quarterly compliance training for all AI system owners to improve assessment scores");
  }
  
  if (data.risks.inProgress > data.risks.total * 0.5) {
    recs.push("Consider allocating additional resources to accelerate risk mitigation efforts");
  }
  
  if (data.vendors.highRisk > data.vendors.total * 0.3) {
    recs.push("Review vendor selection criteria and consider alternative providers for high-risk vendors");
  }
  
  if (data.models.highRisk > 2) {
    recs.push("Conduct a comprehensive review of high-risk models with the AI Ethics committee");
  }
  
  if (recs.length === 0) {
    recs.push("Continue current governance practices and consider expanding AI governance to new business units");
    recs.push("Document lessons learned and best practices for knowledge sharing across the organization");
  }
  
  return recs;
}
