import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Model, ModelInsert, useCreateModel, useUpdateModel } from "@/hooks/useModels";
import { useVendors } from "@/hooks/useVendors";

const modelSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  provider: z.string().max(100).optional(),
  version: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["approved", "restricted", "pending", "blocked"]),
  risk_level: z.enum(["high", "medium", "low"]).optional(),
  security_assessment: z.boolean(),
  vendor_id: z.string().optional(),
});

type FormData = z.infer<typeof modelSchema>;

interface ModelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model?: Model | null;
}

export function ModelFormDialog({ open, onOpenChange, model }: ModelFormDialogProps) {
  const createModel = useCreateModel();
  const updateModel = useUpdateModel();
  const { data: vendors } = useVendors();
  const isEditing = !!model;

  const form = useForm<FormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: "",
      provider: "",
      version: "",
      description: "",
      status: "pending",
      risk_level: "medium",
      security_assessment: false,
      vendor_id: "",
    },
  });

  useEffect(() => {
    if (model) {
      form.reset({
        name: model.name,
        provider: model.provider || "",
        version: model.version || "",
        description: model.description || "",
        status: model.status,
        risk_level: model.risk_level || "medium",
        security_assessment: model.security_assessment || false,
        vendor_id: model.vendor_id || "",
      });
    } else {
      form.reset({
        name: "",
        provider: "",
        version: "",
        description: "",
        status: "pending",
        risk_level: "medium",
        security_assessment: false,
        vendor_id: "",
      });
    }
  }, [model, form]);

  const onSubmit = async (data: FormData) => {
    const payload: ModelInsert = {
      name: data.name,
      provider: data.provider || null,
      version: data.version || null,
      description: data.description || null,
      status: data.status,
      risk_level: data.risk_level || null,
      security_assessment: data.security_assessment,
      vendor_id: data.vendor_id || null,
    };

    if (isEditing && model) {
      await updateModel.mutateAsync({ id: model.id, ...payload });
    } else {
      await createModel.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Model" : "Add New Model"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the model details below." : "Register a new AI model to track and manage compliance."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., GPT-4 Resume Screener" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., OpenAI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., v4.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the model's purpose..." 
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="risk_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vendor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <Select onValueChange={(val) => field.onChange(val === "__none__" ? "" : val)} value={field.value || "__none__"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor (optional)" />
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

            <FormField
              control={form.control}
              name="security_assessment"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Security Assessment</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Has this model passed security review?
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createModel.isPending || updateModel.isPending}
              >
                {createModel.isPending || updateModel.isPending ? "Saving..." : isEditing ? "Update Model" : "Add Model"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
