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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Vendor, useCreateVendor, useUpdateVendor } from "@/hooks/useVendors";

const vendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  description: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contact_email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  risk_score: z.number().min(0).max(100).nullable(),
  security_assessment: z.boolean(),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

interface VendorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor | null;
}

export function VendorFormDialog({ open, onOpenChange, vendor }: VendorFormDialogProps) {
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();
  const isEditing = !!vendor;

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      contact_email: "",
      risk_score: null,
      security_assessment: false,
    },
  });

  useEffect(() => {
    if (vendor) {
      form.reset({
        name: vendor.name,
        description: vendor.description || "",
        website: vendor.website || "",
        contact_email: vendor.contact_email || "",
        risk_score: vendor.risk_score,
        security_assessment: vendor.security_assessment || false,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        website: "",
        contact_email: "",
        risk_score: null,
        security_assessment: false,
      });
    }
  }, [vendor, form]);

  const onSubmit = async (values: VendorFormValues) => {
    const data = {
      name: values.name,
      description: values.description || null,
      website: values.website || null,
      contact_email: values.contact_email || null,
      risk_score: values.risk_score,
      security_assessment: values.security_assessment,
    };

    if (isEditing && vendor) {
      await updateVendor.mutateAsync({ id: vendor.id, ...data });
    } else {
      await createVendor.mutateAsync(data);
    }
    onOpenChange(false);
  };

  const isPending = createVendor.isPending || updateVendor.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the vendor information below."
              : "Add a new AI vendor to track risk and compliance."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., OpenAI" {...field} />
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
                      placeholder="Brief description of the vendor..."
                      className="resize-none"
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
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@vendor.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="risk_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Risk Score: {field.value !== null ? field.value : "Not assessed"}
                  </FormLabel>
                  <FormControl>
                    <div className="pt-2">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value ?? 50]}
                        onValueChange={([value]) => field.onChange(value)}
                        className="w-full"
                      />
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>Low Risk (0)</span>
                        <span>High Risk (100)</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="security_assessment"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Security Assessment</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Has this vendor passed security review?
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
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
                {isPending ? "Saving..." : isEditing ? "Save Changes" : "Add Vendor"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
