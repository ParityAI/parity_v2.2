import { useState, useMemo } from "react";
import { isPast } from "date-fns";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useComplianceFrameworks,
  useFrameworkChecklists,
  useComplianceAssessments,
} from "@/hooks/useCompliance";
import { ComplianceStats } from "@/components/compliance/ComplianceStats";
import { ComplianceFilters } from "@/components/compliance/ComplianceFilters";
import { FrameworkCard } from "@/components/compliance/FrameworkCard";

export default function Compliance() {
  const { data: frameworks, isLoading: frameworksLoading } = useComplianceFrameworks();
  const { data: assessments, isLoading: assessmentsLoading } = useComplianceAssessments();
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const { data: checklists } = useFrameworkChecklists(selectedFramework);

  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Map assessments by framework_id for quick lookup
  const assessmentMap = useMemo(() => {
    if (!assessments) return new Map();
    const map = new Map();
    assessments.forEach((a) => {
      if (a.framework_id) {
        map.set(a.framework_id, a);
      }
    });
    return map;
  }, [assessments]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!frameworks) return { total: 0, passed: 0, inProgress: 0, pending: 0, overdue: 0 };

    let passed = 0;
    let inProgress = 0;
    let pending = 0;
    let overdue = 0;

    frameworks.forEach((f) => {
      const assessment = assessmentMap.get(f.id);
      if (assessment) {
        if (assessment.status === "passed") passed++;
        else if (assessment.status === "in_progress") inProgress++;
        else if (assessment.status === "pending") pending++;

        if (assessment.deadline && isPast(new Date(assessment.deadline)) && assessment.status !== "passed") {
          overdue++;
        }
      }
    });

    return { total: frameworks.length, passed, inProgress, pending, overdue };
  }, [frameworks, assessmentMap]);

  // Filter frameworks
  const filteredFrameworks = useMemo(() => {
    if (!frameworks) return [];

    return frameworks.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.short_name.toLowerCase().includes(search.toLowerCase()) ||
        (f.description?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchesRegion = regionFilter === "all" || f.region === regionFilter;

      const assessment = assessmentMap.get(f.id);
      const currentStatus = assessment?.status || "not_started";
      const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;

      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [frameworks, search, regionFilter, statusFilter, assessmentMap]);

  // Get checklists for all frameworks (for expanded view)
  const [allChecklists, setAllChecklists] = useState<Map<string, any[]>>(new Map());

  const handleSelectFramework = async (frameworkId: string) => {
    setSelectedFramework(frameworkId);
  };

  const isLoading = frameworksLoading || assessmentsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-5 w-96" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Compliance Frameworks</h1>
          <p className="text-muted-foreground">
            Track compliance across multiple regulatory frameworks and standards
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <ComplianceStats stats={stats} />

      {/* Filters */}
      <ComplianceFilters
        search={search}
        onSearchChange={setSearch}
        regionFilter={regionFilter}
        onRegionFilterChange={setRegionFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Framework Cards Grid */}
      {filteredFrameworks.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">No frameworks found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFrameworks.map((framework) => (
            <FrameworkCard
              key={framework.id}
              framework={framework}
              checklists={selectedFramework === framework.id && checklists ? checklists : []}
              assessment={assessmentMap.get(framework.id) || null}
              onSelectFramework={handleSelectFramework}
              isSelected={selectedFramework === framework.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
