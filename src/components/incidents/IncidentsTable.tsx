import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SeverityBadge } from "./SeverityBadge";
import { IncidentStatusBadge } from "./IncidentStatusBadge";

// Use a broader type to support the joined query result
interface IncidentRow {
  id: string;
  title: string;
  description: string | null;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "investigating" | "mitigated" | "closed";
  model_id: string | null;
  vendor_id: string | null;
  reported_by: string | null;
  assigned_to: string | null;
  investigation_notes: string | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
  models?: { name: string } | null;
  vendors?: { name: string } | null;
}

interface IncidentsTableProps {
  incidents: IncidentRow[] | undefined;
  isLoading: boolean;
  onEdit: (incident: IncidentRow) => void;
  onDelete: (incident: IncidentRow) => void;
}

export type { IncidentRow };

export function IncidentsTable({ incidents, isLoading, onEdit, onDelete }: IncidentsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(7)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!incidents || incidents.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">No incidents found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Report your first incident to start tracking issues across your AI systems.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30">
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Severity</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Model</TableHead>
            <TableHead className="font-semibold">Reported</TableHead>
            <TableHead className="font-semibold">Updated</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow key={incident.id} className="hover:bg-secondary/20">
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{incident.title}</p>
                  {incident.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {incident.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <SeverityBadge severity={incident.severity} />
              </TableCell>
              <TableCell>
                <IncidentStatusBadge status={incident.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {incident.models?.name || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(incident.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(incident.updated_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(incident)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(incident)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
