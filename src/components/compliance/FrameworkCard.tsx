import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInDays, isPast } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplianceStatusBadge } from "./ComplianceStatusBadge";
import {
  ComplianceFramework,
  FrameworkChecklist,
  useUpdateAssessment,
  useCreateAssessment,
} from "@/hooks/useCompliance";
import { cn } from "@/lib/utils";

interface FrameworkCardProps {
  framework: ComplianceFramework;
  checklists: FrameworkChecklist[];
  assessment?: {
    id: string;
    status: string;
    score: number | null;
    deadline: string | null;
    checklist_progress: string[] | null;
    notes: string | null;
  } | null;
  onSelectFramework: (id: string) => void;
  isSelected: boolean;
}

const regionIcons: Record<string, string> = {
  USA: "🇺🇸",
  Europe: "🇪🇺",
  Global: "🌐",
  India: "🇮🇳",
};

export function FrameworkCard({
  framework,
  checklists,
  assessment,
  onSelectFramework,
  isSelected,
}: FrameworkCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localChecked, setLocalChecked] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<string>("");
  const [status, setStatus] = useState<string>("not_started");
  const [notes, setNotes] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);

  const createAssessment = useCreateAssessment();
  const updateAssessment = useUpdateAssessment();

  useEffect(() => {
    if (assessment) {
      setLocalChecked(assessment.checklist_progress || []);
      setDeadline(assessment.deadline ? assessment.deadline.split("T")[0] : "");
      setStatus(assessment.status);
      setNotes(assessment.notes || "");
    } else {
      setLocalChecked([]);
      setDeadline("");
      setStatus("not_started");
      setNotes("");
    }
    setHasChanges(false);
  }, [assessment]);

  const completedCount = localChecked.length;
  const totalCount = checklists.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const toggleCheckItem = (itemId: string) => {
    setLocalChecked((prev) => {
      const newChecked = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      setHasChanges(true);
      return newChecked;
    });
  };

  const handleSave = async () => {
    const payload = {
      status,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      checklist_progress: localChecked,
      notes: notes || null,
      score: Math.round(progress),
    };

    if (assessment) {
      await updateAssessment.mutateAsync({ id: assessment.id, ...payload });
    } else {
      await createAssessment.mutateAsync({
        framework_id: framework.id,
        ...payload,
      });
    }
    setHasChanges(false);
  };

  const deadlineDate = deadline ? new Date(deadline) : null;
  const daysUntilDeadline = deadlineDate ? differenceInDays(deadlineDate, new Date()) : null;
  const isOverdue = deadlineDate ? isPast(deadlineDate) : false;

  return (
    <Card
      className={cn(
        "glass transition-all duration-300 hover:border-primary/30",
        isSelected && "border-primary/50 ring-1 ring-primary/20"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/60 text-xl">
              {regionIcons[framework.region] || "📋"}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {framework.short_name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{framework.region}</p>
            </div>
          </div>
          <ComplianceStatusBadge status={status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {framework.description}
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {completedCount}/{totalCount} items
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Deadline */}
        {deadlineDate && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
              isOverdue
                ? "bg-destructive/10 text-destructive"
                : daysUntilDeadline !== null && daysUntilDeadline <= 7
                ? "bg-yellow-500/10 text-yellow-500"
                : "bg-secondary/50 text-muted-foreground"
            )}
          >
            {isOverdue ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
            <span>
              {isOverdue
                ? `Overdue by ${Math.abs(daysUntilDeadline!)} days`
                : `${daysUntilDeadline} days until deadline`}
            </span>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsExpanded(!isExpanded);
            onSelectFramework(framework.id);
          }}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            View Checklist
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {/* Expanded Checklist */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2">
                {/* Status & Deadline Controls */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs text-muted-foreground">
                      Status
                    </label>
                    <Select
                      value={status}
                      onValueChange={(v) => {
                        setStatus(v);
                        setHasChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-muted-foreground">
                      <Calendar className="mr-1 inline h-3 w-3" />
                      Deadline
                    </label>
                    <Input
                      type="date"
                      value={deadline}
                      onChange={(e) => {
                        setDeadline(e.target.value);
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>

                {/* Checklist Items */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Checklist Items
                  </p>
                  <div className="max-h-[300px] space-y-1 overflow-y-auto rounded-lg border border-border/50 bg-background/50 p-2">
                    {checklists.map((item) => {
                      const isChecked = localChecked.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleCheckItem(item.id)}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                            isChecked
                              ? "bg-primary/10"
                              : "hover:bg-secondary/50"
                          )}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          ) : (
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <div>
                            <p
                              className={cn(
                                "text-sm",
                                isChecked
                                  ? "text-primary"
                                  : "text-foreground"
                              )}
                            >
                              {item.item_text}
                            </p>
                            {item.category && (
                              <span className="text-xs text-muted-foreground">
                                {item.category}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">
                    Notes
                  </label>
                  <Textarea
                    placeholder="Add any notes about this compliance framework..."
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      setHasChanges(true);
                    }}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                {/* Save Button */}
                {hasChanges && (
                  <Button
                    onClick={handleSave}
                    disabled={
                      createAssessment.isPending || updateAssessment.isPending
                    }
                    className="w-full gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {createAssessment.isPending || updateAssessment.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
