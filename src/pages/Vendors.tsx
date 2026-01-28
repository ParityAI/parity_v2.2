import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileDown } from "lucide-react";
import { useVendors, Vendor } from "@/hooks/useVendors";
import { VendorsStats } from "@/components/vendors/VendorsStats";
import { VendorsFilters } from "@/components/vendors/VendorsFilters";
import { VendorsTable } from "@/components/vendors/VendorsTable";
import { VendorFormDialog } from "@/components/vendors/VendorFormDialog";
import { VendorDeleteDialog } from "@/components/vendors/VendorDeleteDialog";
import { CSVUploadDialog } from "@/components/vendors/CSVUploadDialog";
import { generateVendorsReport } from "@/lib/generateVendorsReport";

const Vendors = () => {
  const { data: vendors, isLoading } = useVendors();
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [assessmentFilter, setAssessmentFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const handleExportPDF = () => {
    if (vendors) {
      generateVendorsReport({ vendors });
    }
  };

  const filteredVendors = useMemo(() => {
    if (!vendors) return [];

    return vendors.filter((vendor) => {
      // Search filter
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.contact_email?.toLowerCase().includes(searchQuery.toLowerCase());

      // Risk filter
      let matchesRisk = true;
      if (riskFilter !== "all") {
        if (riskFilter === "high") {
          matchesRisk = vendor.risk_score !== null && vendor.risk_score >= 70;
        } else if (riskFilter === "medium") {
          matchesRisk = vendor.risk_score !== null && vendor.risk_score >= 40 && vendor.risk_score < 70;
        } else if (riskFilter === "low") {
          matchesRisk = vendor.risk_score !== null && vendor.risk_score < 40;
        } else if (riskFilter === "unassessed") {
          matchesRisk = vendor.risk_score === null;
        }
      }

      // Assessment filter
      let matchesAssessment = true;
      if (assessmentFilter !== "all") {
        if (assessmentFilter === "assessed") {
          matchesAssessment = vendor.security_assessment === true;
        } else if (assessmentFilter === "pending") {
          matchesAssessment = vendor.security_assessment !== true;
        }
      }

      return matchesSearch && matchesRisk && matchesAssessment;
    });
  }, [vendors, searchQuery, riskFilter, assessmentFilter]);

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setFormOpen(true);
  };

  const handleDelete = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDeleteOpen(true);
  };

  const handleAddNew = () => {
    setSelectedVendor(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground">
            Manage and track your third-party AI vendors
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCsvUploadOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF} disabled={!vendors?.length} className="gap-2">
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <VendorsStats vendors={vendors} />

      {/* Filters */}
      <VendorsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
        assessmentFilter={assessmentFilter}
        onAssessmentFilterChange={setAssessmentFilter}
      />

      {/* Table */}
      <VendorsTable
        vendors={filteredVendors}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Dialogs */}
      <VendorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        vendor={selectedVendor}
      />
      <VendorDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        vendor={selectedVendor}
      />
      <CSVUploadDialog
        open={csvUploadOpen}
        onOpenChange={setCsvUploadOpen}
      />
    </div>
  );
};

export default Vendors;
