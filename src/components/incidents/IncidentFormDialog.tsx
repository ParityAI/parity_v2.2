import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateIncident,
  useUpdateIncident,
} from "@/hooks/useIncidents";
import { useModels } from "@/hooks/useModels";
import { useVendors } from "@/hooks/useVendors";
import type { IncidentRow } from "./IncidentsTable";

const incidentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  status: z.enum(["open", "investigating", "mitigated", "closed"]),
  model_id: z.string().optional(),
  vendor_id: z.string().optional(),
  investigation_notes: z.string().optional(),
  resolution_notes: z.string().optional(),
});

type IncidentFormValues = z.infer<typeof incidentSchema>;

interface IncidentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident?: IncidentRow | null;
}

export function IncidentFormDialog({ open, onOpenChange, incident }: IncidentFormDialogProps) {
  const createIncident = useCreateIncident();
  const updateIncident = useUpdateIncident();
  const { data: models } = useModels();
  const { data: vendors } = useVendors();
  const isEditing = !!incident;

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: "medium",
      status: "open",
      model_id: "",
      vendor_id: "",
      investigation_notes: "",
      resolution_notes: "",
    },
  });

  useEffect(() => {
    if (incident) {
      form.reset({
        title: incident.title,
        description: incident.description || "",
        severity: incident.severity,
        status: incident.status,
        model_id: incident.model_id || "",
        vendor_id: incident.vendor_id || "",
        investigation_notes: incident.investigation_notes || "",
        resolution_notes: incident.resolution_notes || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        severity: "medium",
        status: "open",
        model_id: "",
        vendor_id: "",
        investigation_notes: "",
        resolution_notes: "",
      });
    }
  }, [incident, form]);

  const onSubmit = async (values: IncidentFormValues) => {
    // Note: reported_by and assigned_to are UUID fields in the database
    // that reference user profiles. For now, we omit them from the submission.
    const data = {
      title: values.title,
      description: values.description || null,
      severity: values.severity as "critical" | "high" | "medium" | "low",
      status: values.status as "open" | "investigating" | "mitigated" | "closed",
      model_id: values.model_id || null,
      vendor_id: values.vendor_id || null,
      investigation_notes: values.investigation_notes || null,
      resolution_notes: values.resolution_notes || null,
      resolved_at: values.status === "closed" ? new Date().toISOString() : null,
    };

    if (isEditing && incident) {
      await updateIncident.mutateAsync({ id: incident.id, ...data });
    } else {
      await createIncident.mutateAsync(data);
    }
    onOpenChange(false);
  };

  const isPending = createIncident.isPending || updateIncident.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Incident" : "Report New Incident"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the incident details below."
              : "Report a new incident to track and resolve issues in your AI systems."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bias detected in hiring model" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the incident in detail..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="mitigated">Mitigated</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="model_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Linked Model</FormLabel>
                    <Select onValueChange={(val) => field.onChange(val === "__none__" ? "" : val)} value={field.value || "__none__"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {models?.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Linked Vendor</FormLabel>
                    <Select onValueChange={(val) => field.onChange(val === "__none__" ? "" : val)} value={field.value || "__none__"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {vendors?.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="investigation_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investigation Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes from the investigation..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resolution_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolution Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How was this resolved..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving..."
                  : isEditing
                  ? "Save Changes"
                  : "Report Incident"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
