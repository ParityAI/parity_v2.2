import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface VendorsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  riskFilter: string;
  onRiskFilterChange: (value: string) => void;
  assessmentFilter: string;
  onAssessmentFilterChange: (value: string) => void;
}

export function VendorsFilters({
  searchQuery,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  assessmentFilter,
  onAssessmentFilterChange,
}: VendorsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={riskFilter} onValueChange={onRiskFilterChange}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Risk Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Risk Levels</SelectItem>
          <SelectItem value="high">High Risk</SelectItem>
          <SelectItem value="medium">Medium Risk</SelectItem>
          <SelectItem value="low">Low Risk</SelectItem>
          <SelectItem value="unassessed">Not Assessed</SelectItem>
        </SelectContent>
      </Select>
      <Select value={assessmentFilter} onValueChange={onAssessmentFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Assessment Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="assessed">Security Assessed</SelectItem>
          <SelectItem value="pending">Pending Assessment</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
