import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface Framework {
  id: string;
  name: string;
  short_name: string;
  region: string;
  description: string | null;
}

interface Assessment {
  id: string;
  status: string;
  score: number | null;
  deadline: string | null;
  notes: string | null;
  assessed_at: string | null;
  framework_id: string | null;
}

interface ChecklistItem {
  id: string;
  item_text: string;
  category: string | null;
  framework_id: string;
}

interface ComplianceReportData {
  frameworks: Framework[];
  assessments: Assessment[];
  checklists: ChecklistItem[];
  organizationName?: string;
}

export function generateComplianceReport(data: ComplianceReportData) {
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
  doc.setTextColor(16, 185, 129); // Primary green color
  doc.text("Compliance Report", margin, yPos);
  yPos += 10;

  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(data.organizationName || "FairHire AI - HR Governance", margin, yPos);
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

  const totalFrameworks = data.frameworks.length;
  const assessedFrameworks = data.assessments.filter(a => a.status === "passed" || a.status === "in_progress").length;
  const passedFrameworks = data.assessments.filter(a => a.status === "passed").length;
  const overdueFrameworks = data.assessments.filter(a => {
    if (!a.deadline || a.status === "passed") return false;
    return new Date(a.deadline) < new Date();
  }).length;

  const complianceRate = totalFrameworks > 0 ? Math.round((passedFrameworks / totalFrameworks) * 100) : 0;

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const summaryData = [
    ["Total Frameworks Tracked", totalFrameworks.toString()],
    ["Frameworks Passed", passedFrameworks.toString()],
    ["Assessments In Progress", (assessedFrameworks - passedFrameworks).toString()],
    ["Overdue Assessments", overdueFrameworks.toString()],
    ["Overall Compliance Rate", `${complianceRate}%`],
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

  // Framework Details
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Framework Compliance Status", margin, yPos);
  yPos += 10;

  const frameworkTableData = data.frameworks.map(framework => {
    const assessment = data.assessments.find(a => a.framework_id === framework.id);
    const status = assessment?.status || "not_started";
    const score = assessment?.score !== null ? `${assessment.score}%` : "N/A";
    const deadline = assessment?.deadline 
      ? format(new Date(assessment.deadline), "MMM d, yyyy") 
      : "Not set";
    
    return [
      framework.short_name,
      framework.name,
      framework.region,
      status.replace("_", " ").toUpperCase(),
      score,
      deadline,
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [["Code", "Framework", "Region", "Status", "Score", "Deadline"]],
    body: frameworkTableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 50 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Detailed Checklists per Framework
  data.frameworks.forEach((framework) => {
    const frameworkChecklists = data.checklists.filter(c => c.framework_id === framework.id);
    const assessment = data.assessments.find(a => a.framework_id === framework.id);
    
    if (frameworkChecklists.length === 0) return;

    checkPageBreak(50);
    
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(`${framework.short_name} - ${framework.name}`, margin, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Region: ${framework.region} | Status: ${(assessment?.status || "Not Started").replace("_", " ")}`, margin, yPos);
    yPos += 8;

    // Group by category
    const categories = [...new Set(frameworkChecklists.map(c => c.category || "General"))];
    
    categories.forEach(category => {
      const items = frameworkChecklists.filter(c => (c.category || "General") === category);
      
      checkPageBreak(20 + items.length * 8);
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(category, margin, yPos);
      yPos += 6;

      items.forEach((item, index) => {
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const text = `${index + 1}. ${item.item_text}`;
        const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - 10);
        
        checkPageBreak(lines.length * 5);
        
        lines.forEach((line: string) => {
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });
        yPos += 2;
      });
      
      yPos += 5;
    });

    // Notes if available
    if (assessment?.notes) {
      checkPageBreak(20);
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text("Notes:", margin, yPos);
      yPos += 5;
      doc.setFontSize(9);
      const noteLines = doc.splitTextToSize(assessment.notes, pageWidth - margin * 2);
      noteLines.forEach((line: string) => {
        doc.text(line, margin, yPos);
        yPos += 5;
      });
    }

    yPos += 10;
  });

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | Confidential - For Audit Purposes Only`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  const fileName = `compliance-report-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
}
