import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComplianceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  regionFilter: string;
  onRegionFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function ComplianceFilters({
  search,
  onSearchChange,
  regionFilter,
  onRegionFilterChange,
  statusFilter,
  onStatusFilterChange,
}: ComplianceFiltersProps) {
  const hasFilters = search || regionFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onRegionFilterChange("all");
    onStatusFilterChange("all");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search frameworks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-3">
        <Select value={regionFilter} onValueChange={onRegionFilterChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="Europe">Europe</SelectItem>
            <SelectItem value="Global">Global</SelectItem>
            <SelectItem value="India">India</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
