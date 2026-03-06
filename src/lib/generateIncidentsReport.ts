import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface Incident {
  id: string;
  title: string;
  description: string | null;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "investigating" | "mitigated" | "closed";
  investigation_notes: string | null;
  resolution: string | null;
  created_at: string;
  updated_at: string;
  models?: { name: string } | null;
  vendors?: { name: string } | null;
}

interface IncidentsReportData {
  incidents: Incident[];
  organizationName?: string;
}

export function generateIncidentsReport(data: IncidentsReportData) {
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
  doc.text("Incident Summary Report", margin, yPos);
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

  const totalIncidents = data.incidents.length;
  const openIncidents = data.incidents.filter(i => i.status === "open").length;
  const investigatingIncidents = data.incidents.filter(i => i.status === "investigating").length;
  const mitigatedIncidents = data.incidents.filter(i => i.status === "mitigated").length;
  const closedIncidents = data.incidents.filter(i => i.status === "closed").length;
  const criticalIncidents = data.incidents.filter(i => i.severity === "critical").length;
  const highIncidents = data.incidents.filter(i => i.severity === "high").length;

  const resolutionRate = totalIncidents > 0
    ? Math.round((closedIncidents / totalIncidents) * 100)
    : 0;

  const summaryData = [
    ["Total Incidents", totalIncidents.toString()],
    ["Open Incidents", openIncidents.toString()],
    ["Under Investigation", investigatingIncidents.toString()],
    ["Mitigated", mitigatedIncidents.toString()],
    ["Closed/Resolved", closedIncidents.toString()],
    ["Critical Severity", criticalIncidents.toString()],
    ["High Severity", highIncidents.toString()],
    ["Resolution Rate", `${resolutionRate}%`],
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

  // Severity Distribution
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Severity Distribution", margin, yPos);
  yPos += 10;

  const mediumIncidents = data.incidents.filter(i => i.severity === "medium").length;
  const lowIncidents = data.incidents.filter(i => i.severity === "low").length;

  const severityData = [
    ["Critical", criticalIncidents.toString(), `${totalIncidents > 0 ? Math.round((criticalIncidents / totalIncidents) * 100) : 0}%`],
    ["High", highIncidents.toString(), `${totalIncidents > 0 ? Math.round((highIncidents / totalIncidents) * 100) : 0}%`],
    ["Medium", mediumIncidents.toString(), `${totalIncidents > 0 ? Math.round((mediumIncidents / totalIncidents) * 100) : 0}%`],
    ["Low", lowIncidents.toString(), `${totalIncidents > 0 ? Math.round((lowIncidents / totalIncidents) * 100) : 0}%`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Severity", "Count", "Percentage"]],
    body: severityData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Incident Details Table
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Incident Details", margin, yPos);
  yPos += 10;

  const incidentTableData = data.incidents.map(incident => [
    incident.title.substring(0, 35) + (incident.title.length > 35 ? "..." : ""),
    incident.severity.toUpperCase(),
    incident.status.toUpperCase(),
    incident.models?.name || "N/A",
    format(new Date(incident.created_at), "MMM d, yyyy"),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Incident", "Severity", "Status", "Related Model", "Reported"]],
    body: incidentTableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 35 },
      4: { cellWidth: 28 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Critical/High Severity Details
  const criticalHigh = data.incidents.filter(i => i.severity === "critical" || i.severity === "high");
  if (criticalHigh.length > 0) {
    checkPageBreak(50);
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 38);
    doc.text("Critical & High Severity Incidents", margin, yPos);
    yPos += 10;

    criticalHigh.forEach(incident => {
      checkPageBreak(35);
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.text(`• ${incident.title}`, margin, yPos);
      yPos += 6;

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`  Severity: ${incident.severity.toUpperCase()} | Status: ${incident.status.toUpperCase()} | Reported: ${format(new Date(incident.created_at), "MMM d, yyyy")}`, margin, yPos);
      yPos += 5;

      if (incident.description) {
        const descLines = doc.splitTextToSize(`  ${incident.description}`, pageWidth - margin * 2 - 10);
        descLines.slice(0, 3).forEach((line: string) => {
          doc.text(line, margin, yPos);
          yPos += 4;
        });
      }

      if (incident.investigation_notes) {
        doc.setTextColor(60, 60, 60);
        const noteLines = doc.splitTextToSize(`  Investigation: ${incident.investigation_notes}`, pageWidth - margin * 2 - 10);
        noteLines.slice(0, 2).forEach((line: string) => {
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
      `Page ${i} of ${pageCount} | Confidential - Incident Summary Report`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  const fileName = `incident-report-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
}
