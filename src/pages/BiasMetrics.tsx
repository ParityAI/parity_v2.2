import { useState, useMemo } from "react";
import { Plus, Search, AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
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

interface BiasTest {
  id: string;
  modelName: string;
  testType: "adverse_impact" | "demographic_parity" | "equalized_odds" | "calibration";
  protectedAttribute: string;
  result: "pass" | "fail" | "warning";
  score: number;
  threshold: number;
  testDate: string;
  testedBy: string;
  notes: string;
}

const initialTests: BiasTest[] = [
  {
    id: "1",
    modelName: "HireScore",
    testType: "adverse_impact",
    protectedAttribute: "Gender",
    result: "pass",
    score: 0.85,
    threshold: 0.8,
    testDate: "2026-01-15",
    testedBy: "John Doe",
    notes: "Adverse Impact Ratio within acceptable range",
  },
  {
    id: "2",
    modelName: "HireScore",
    testType: "adverse_impact",
    protectedAttribute: "Race/Ethnicity",
    result: "fail",
    score: 0.72,
    threshold: 0.8,
    testDate: "2026-01-15",
    testedBy: "John Doe",
    notes: "AIR below 0.8 threshold - requires mitigation",
  },
  {
    id: "3",
    modelName: "CandidateRank",
    testType: "demographic_parity",
    protectedAttribute: "Age",
    result: "warning",
    score: 0.81,
    threshold: 0.8,
    testDate: "2026-01-14",
    testedBy: "Jane Smith",
    notes: "Close to threshold - monitoring recommended",
  },
  {
    id: "4",
    modelName: "ResumeParser",
    testType: "equalized_odds",
    protectedAttribute: "Gender",
    result: "pass",
    score: 0.92,
    threshold: 0.85,
    testDate: "2026-01-12",
    testedBy: "Mike Johnson",
    notes: "Strong performance across groups",
  },
];

const testTypeLabels = {
  adverse_impact: "Adverse Impact Ratio (AIR)",
  demographic_parity: "Demographic Parity",
  equalized_odds: "Equalized Odds",
  calibration: "Calibration",
};

const resultColors = {
  pass: "bg-green-100 text-green-700",
  fail: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
};

const CHART_COLORS = ["#10b981", "#ef4444", "#f59e0b"];

export default function BiasMetrics() {
  const [tests, setTests] = useState<BiasTest[]>(initialTests);
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    modelName: "",
    testType: "adverse_impact" as BiasTest["testType"],
    protectedAttribute: "",
    score: 0,
    threshold: 0.8,
    notes: "",
  });

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSearch =
        test.modelName.toLowerCase().includes(search.toLowerCase()) ||
        test.protectedAttribute.toLowerCase().includes(search.toLowerCase());
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
    const models = [...new Set(tests.map(t => t.modelName))];
    return models.map(model => ({
      name: model,
      pass: tests.filter(t => t.modelName === model && t.result === "pass").length,
      fail: tests.filter(t => t.modelName === model && t.result === "fail").length,
      warning: tests.filter(t => t.modelName === model && t.result === "warning").length,
    }));
  }, [tests]);

  const handleAddNew = () => {
    setFormData({
      modelName: "",
      testType: "adverse_impact",
      protectedAttribute: "",
      score: 0,
      threshold: 0.8,
      notes: "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.modelName || !formData.protectedAttribute) {
      toast({ title: "Error", description: "Model name and protected attribute are required", variant: "destructive" });
      return;
    }

    const result: BiasTest["result"] = formData.score >= formData.threshold ? "pass"
      : formData.score >= formData.threshold * 0.95 ? "warning"
      : "fail";

    const newTest: BiasTest = {
      id: Date.now().toString(),
      ...formData,
      result,
      testDate: new Date().toISOString().split("T")[0],
      testedBy: "Current User",
    };
    setTests([newTest, ...tests]);
    toast({ title: "Bias test recorded", description: `Test result: ${result.toUpperCase()}` });
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setTests(tests.filter(t => t.id !== id));
    toast({ title: "Test deleted", description: "The bias test record has been removed." });
  };

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
            {filteredTests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.modelName}</TableCell>
                <TableCell>{testTypeLabels[test.testType]}</TableCell>
                <TableCell>{test.protectedAttribute}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={test.score >= test.threshold ? "text-green-600" : "text-red-600"}>
                      {test.score.toFixed(2)}
                    </span>
                    {test.score >= test.threshold ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{test.threshold.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={resultColors[test.result]}>
                    {test.result.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(test.testDate), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(test.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                value={formData.modelName}
                onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                placeholder="e.g., HireScore"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Test Type</Label>
                <Select
                  value={formData.testType}
                  onValueChange={(value: BiasTest["testType"]) => setFormData({ ...formData, testType: value })}
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
                <Label htmlFor="protectedAttribute">Protected Attribute</Label>
                <Input
                  id="protectedAttribute"
                  value={formData.protectedAttribute}
                  onChange={(e) => setFormData({ ...formData, protectedAttribute: e.target.value })}
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
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about the test"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Record Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
