import { useState, useMemo } from "react";
import { Plus, Search, AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  useBiasTests,
  useCreateBiasTest,
  useDeleteBiasTest,
  BiasTestResult,
} from "@/hooks/useBiasTests";
import { useModels } from "@/hooks/useModels";

const testTypeLabels: Record<string, string> = {
  adverse_impact: "Adverse Impact Ratio (AIR)",
  demographic_parity: "Demographic Parity",
  equalized_odds: "Equalized Odds",
  calibration: "Calibration",
};

const resultColors: Record<BiasTestResult, string> = {
  pass: "bg-green-100 text-green-700",
  fail: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
};

const CHART_COLORS = ["#10b981", "#ef4444", "#f59e0b"];

export default function BiasMetrics() {
  const { data: tests = [], isLoading } = useBiasTests();
  const { data: models = [] } = useModels();
  const createBiasTest = useCreateBiasTest();
  const deleteBiasTest = useDeleteBiasTest();

  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    model_id: "",
    test_type: "adverse_impact",
    protected_attribute: "",
    score: 0,
    threshold: 0.8,
    notes: "",
  });

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const modelName = test.models?.name || "";
      const matchesSearch =
        modelName.toLowerCase().includes(search.toLowerCase()) ||
        test.protected_attribute.toLowerCase().includes(search.toLowerCase());
      const matchesResult = resultFilter === "all" || test.result === resultFilter;
      return matchesSearch && matchesResult;
    });
  }, [tests, search, resultFilter]);

  const stats = useMemo(() => ({
    total: tests.length,
    pass: tests.filter(t => t.result === "pass").length,
    fail: tests.filter(t => t.result === "fail").length,
    warning: tests.filter(t => t.result === "warning").length,
  }), [tests]);

  const pieData = [
    { name: "Pass", value: stats.pass, color: "#10b981" },
    { name: "Fail", value: stats.fail, color: "#ef4444" },
    { name: "Warning", value: stats.warning, color: "#f59e0b" },
  ];

  const modelStats = useMemo(() => {
    const modelNames = [...new Set(tests.map(t => t.models?.name).filter(Boolean))];
    return modelNames.map(modelName => ({
      name: modelName,
      pass: tests.filter(t => t.models?.name === modelName && t.result === "pass").length,
      fail: tests.filter(t => t.models?.name === modelName && t.result === "fail").length,
      warning: tests.filter(t => t.models?.name === modelName && t.result === "warning").length,
    }));
  }, [tests]);

  const handleAddNew = () => {
    setFormData({
      model_id: "",
      test_type: "adverse_impact",
      protected_attribute: "",
      score: 0,
      threshold: 0.8,
      notes: "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.model_id || !formData.protected_attribute) {
      return;
    }

    const result: BiasTestResult = formData.score >= formData.threshold ? "pass"
      : formData.score >= formData.threshold * 0.95 ? "warning"
      : "fail";

    await createBiasTest.mutateAsync({
      model_id: formData.model_id,
      test_type: formData.test_type,
      protected_attribute: formData.protected_attribute,
      result,
      score: formData.score,
      threshold: formData.threshold,
      details: formData.notes ? { notes: formData.notes } : null,
    });
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteBiasTest.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Bias & Fairness Metrics</h1>
          <p className="text-muted-foreground">
            Monitor and analyze bias metrics across your AI models
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Record Bias Test
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>NYC Local Law 144 requires annual bias audits</AlertTitle>
        <AlertDescription>
          Automated employment decision tools must undergo independent bias audits.
          The Adverse Impact Ratio (AIR) should be ≥ 0.8 for each protected category.
          Track all bias tests here to maintain compliance.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passing</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.pass}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.pass / stats.total) * 100) : 0}% pass rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failing</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.fail}</div>
            <p className="text-xs text-muted-foreground">Requires mitigation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
            <p className="text-xs text-muted-foreground">Monitor closely</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Results Distribution</CardTitle>
            <CardDescription>Overall bias test outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results by Model</CardTitle>
            <CardDescription>Bias test outcomes per model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelStats}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pass" stackId="a" fill="#10b981" name="Pass" />
                  <Bar dataKey="warning" stackId="a" fill="#f59e0b" name="Warning" />
                  <Bar dataKey="fail" stackId="a" fill="#ef4444" name="Fail" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by model or attribute..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={resultFilter} onValueChange={setResultFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Results</SelectItem>
            <SelectItem value="pass">Pass</SelectItem>
            <SelectItem value="fail">Fail</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead>Test Type</TableHead>
              <TableHead>Protected Attribute</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Test Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTests.map((test) => {
              const score = test.score ?? 0;
              const threshold = test.threshold ?? 0.8;
              return (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.models?.name || "Unknown Model"}</TableCell>
                  <TableCell>{testTypeLabels[test.test_type] || test.test_type}</TableCell>
                  <TableCell>{test.protected_attribute}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={score >= threshold ? "text-green-600" : "text-red-600"}>
                        {score.toFixed(2)}
                      </span>
                      {score >= threshold ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{threshold.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={resultColors[test.result]}>
                      {test.result.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{test.test_date ? format(new Date(test.test_date), "MMM d, yyyy") : "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(test.id)}
                      disabled={deleteBiasTest.isPending}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredTests.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No bias tests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Bias Test</DialogTitle>
            <DialogDescription>
              Record the results of a bias or fairness test
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Model</Label>
              <Select
                value={formData.model_id}
                onValueChange={(value) => setFormData({ ...formData, model_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Test Type</Label>
                <Select
                  value={formData.test_type}
                  onValueChange={(value) => setFormData({ ...formData, test_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adverse_impact">Adverse Impact Ratio</SelectItem>
                    <SelectItem value="demographic_parity">Demographic Parity</SelectItem>
                    <SelectItem value="equalized_odds">Equalized Odds</SelectItem>
                    <SelectItem value="calibration">Calibration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="protected_attribute">Protected Attribute</Label>
                <Input
                  id="protected_attribute"
                  value={formData.protected_attribute}
                  onChange={(e) => setFormData({ ...formData, protected_attribute: e.target.value })}
                  placeholder="e.g., Gender, Race"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="score">Score (0-1)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="threshold">Threshold</Label>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: parseFloat(e.target.value) || 0.8 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about the test"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={createBiasTest.isPending || !formData.model_id || !formData.protected_attribute}
            >
              {createBiasTest.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
