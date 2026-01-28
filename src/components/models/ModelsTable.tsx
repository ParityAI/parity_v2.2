import { useState } from "react";
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
import { MoreHorizontal, Pencil, Trash2, Shield, ShieldOff } from "lucide-react";
import { Model } from "@/hooks/useModels";
import { ModelStatusBadge } from "./ModelStatusBadge";
import { RiskLevelBadge } from "./RiskLevelBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface ModelsTableProps {
  models: (Model & { vendors?: { name: string } | null })[] | undefined;
  isLoading: boolean;
  onEdit: (model: Model) => void;
  onDelete: (model: Model) => void;
}

export function ModelsTable({ models, isLoading, onEdit, onDelete }: ModelsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Security</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(8)].map((_, j) => (
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

  if (!models || models.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">No models found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first AI model to start tracking compliance and risk.
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
            <TableHead className="font-semibold">Model Name</TableHead>
            <TableHead className="font-semibold">Provider</TableHead>
            <TableHead className="font-semibold">Version</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Risk Level</TableHead>
            <TableHead className="font-semibold">Security</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id} className="hover:bg-secondary/20">
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{model.name}</p>
                  {model.vendors?.name && (
                    <p className="text-xs text-muted-foreground">{model.vendors.name}</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {model.provider || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {model.version || "—"}
              </TableCell>
              <TableCell>
                <ModelStatusBadge status={model.status} />
              </TableCell>
              <TableCell>
                <RiskLevelBadge level={model.risk_level} />
              </TableCell>
              <TableCell>
                {model.security_assessment ? (
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
                {format(new Date(model.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(model)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(model)}
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
