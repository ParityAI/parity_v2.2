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
import { MoreHorizontal, Pencil, Trash2, Shield, ShieldOff, ExternalLink } from "lucide-react";
import { Vendor } from "@/hooks/useVendors";
import { RiskScoreBadge } from "./RiskScoreBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface VendorsTableProps {
  vendors: Vendor[] | undefined;
  isLoading: boolean;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export function VendorsTable({ vendors, isLoading, onEdit, onDelete }: VendorsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Security</TableHead>
              <TableHead>Created</TableHead>
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

  if (!vendors || vendors.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">No vendors found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first AI vendor to start tracking risk and compliance.
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
            <TableHead className="font-semibold">Vendor Name</TableHead>
            <TableHead className="font-semibold">Website</TableHead>
            <TableHead className="font-semibold">Contact</TableHead>
            <TableHead className="font-semibold">Risk Score</TableHead>
            <TableHead className="font-semibold">Security</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id} className="hover:bg-secondary/20">
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{vendor.name}</p>
                  {vendor.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {vendor.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {vendor.website ? (
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {vendor.contact_email || "—"}
              </TableCell>
              <TableCell>
                <RiskScoreBadge score={vendor.risk_score} />
              </TableCell>
              <TableCell>
                {vendor.security_assessment ? (
                  <div className="flex items-center gap-1.5 text-primary">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Passed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ShieldOff className="h-4 w-4" />
                    <span className="text-sm">Pending</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(vendor.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(vendor)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(vendor)}
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
