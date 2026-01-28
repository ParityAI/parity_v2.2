import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { useIncidents } from "@/hooks/useIncidents";
import { IncidentsStats } from "@/components/incidents/IncidentsStats";
import { IncidentsFilters } from "@/components/incidents/IncidentsFilters";
import { IncidentsTable, IncidentRow } from "@/components/incidents/IncidentsTable";
import { IncidentFormDialog } from "@/components/incidents/IncidentFormDialog";
import { IncidentDeleteDialog } from "@/components/incidents/IncidentDeleteDialog";

export default function Incidents() {
  const { data: incidents, isLoading } = useIncidents();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<IncidentRow | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingIncident, setDeletingIncident] = useState<IncidentRow | null>(null);

  const filteredIncidents = useMemo(() => {
    if (!incidents) return undefined;
    return incidents.filter((incident) => {
      const matchesSearch =
        !searchQuery ||
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity =
        severityFilter === "all" || incident.severity === severityFilter;
      const matchesStatus =
        statusFilter === "all" || incident.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [incidents, searchQuery, severityFilter, statusFilter]);

  const handleEdit = (incident: IncidentRow) => {
    setEditingIncident(incident);
    setFormOpen(true);
  };

  const handleDelete = (incident: IncidentRow) => {
    setDeletingIncident(incident);
    setDeleteOpen(true);
  };

  const handleAdd = () => {
    setEditingIncident(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-destructive/10 p-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Incident Management</h1>
            <p className="text-sm text-muted-foreground">
              Track, investigate, and resolve incidents across your AI systems
            </p>
          </div>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Report Incident
        </Button>
      </div>

      {/* Stats */}
      <IncidentsStats incidents={incidents} />

      {/* Filters */}
      <IncidentsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Table */}
      <IncidentsTable
        incidents={filteredIncidents}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Dialogs */}
      <IncidentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        incident={editingIncident}
      />
      <IncidentDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        incident={deletingIncident}
      />
    </div>
  );
}
