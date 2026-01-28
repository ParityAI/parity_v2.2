import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModels, Model } from "@/hooks/useModels";
import { ModelsTable } from "@/components/models/ModelsTable";
import { ModelsFilters } from "@/components/models/ModelsFilters";
import { ModelsStats } from "@/components/models/ModelsStats";
import { ModelFormDialog } from "@/components/models/ModelFormDialog";
import { ModelDeleteDialog } from "@/components/models/ModelDeleteDialog";

export default function Models() {
  const { data: models, isLoading } = useModels();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const filteredModels = useMemo(() => {
    if (!models) return [];
    
    return models.filter((model) => {
      const matchesSearch = 
        model.name.toLowerCase().includes(search.toLowerCase()) ||
        (model.provider?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (model.description?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchesStatus = statusFilter === "all" || model.status === statusFilter;
      const matchesRisk = riskFilter === "all" || model.risk_level === riskFilter;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [models, search, statusFilter, riskFilter]);

  const handleEdit = (model: Model) => {
    setSelectedModel(model);
    setFormOpen(true);
  };

  const handleDelete = (model: Model) => {
    setSelectedModel(model);
    setDeleteOpen(true);
  };

  const handleAddNew = () => {
    setSelectedModel(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Model Inventory</h1>
          <p className="text-muted-foreground">
            Track and manage all AI models in your organization
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Model
        </Button>
      </div>

      {/* Stats */}
      <ModelsStats models={models} />

      {/* Filters */}
      <ModelsFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
      />

      {/* Table */}
      <ModelsTable
        models={filteredModels}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Dialogs */}
      <ModelFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        model={selectedModel}
      />
      <ModelDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        model={selectedModel}
      />
    </div>
  );
}
