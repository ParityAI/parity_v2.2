import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteIncident } from "@/hooks/useIncidents";
import type { IncidentRow } from "./IncidentsTable";

interface IncidentDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: IncidentRow | null;
}

export function IncidentDeleteDialog({ open, onOpenChange, incident }: IncidentDeleteDialogProps) {
  const deleteIncident = useDeleteIncident();

  const handleDelete = async () => {
    if (incident) {
      await deleteIncident.mutateAsync(incident.id);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Incident</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{incident?.title}"? This action cannot be undone.
            All investigation notes and resolution data will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteIncident.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteIncident.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteIncident.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
