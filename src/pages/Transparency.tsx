import { useState } from "react";
import { Shield, Eye, FileText, CheckCircle, ExternalLink, Globe, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useModels } from "@/hooks/useModels";
import { useVendors } from "@/hooks/useVendors";

export default function Transparency() {
  const { data: models } = useModels();
  const { data: vendors } = useVendors();
  const [publicDisclosures, setPublicDisclosures] = useState({
    showModels: true,
    showVendors: true,
    showCompliance: true,
    showBiasMetrics: false,
    showIncidents: false,
  });

  const approvedModels = models?.filter(m => m.status === "approved") || [];
  const assessedVendors = vendors?.filter(v => v.security_assessment) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">AI Trust Center</h1>
          <p className="text-muted-foreground">
            Manage transparency and public disclosures about your AI systems
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          View Public Page
        </Button>
      </div>

      {/* Trust Score */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">AI Trust Score</h3>
              <p className="text-sm text-muted-foreground">Based on compliance, transparency, and governance practices</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">87</div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="disclosures">Public Disclosures</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Models</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedModels.length}</div>
                <p className="text-xs text-muted-foreground">
                  of {models?.length || 0} total models
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assessed Vendors</CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assessedVendors.length}</div>
                <p className="text-xs text-muted-foreground">
                  security assessments complete
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Frameworks</CardTitle>
                <FileText className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">
                  actively monitored
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transparency Level</CardTitle>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">High</div>
                <p className="text-xs text-muted-foreground">
                  3 of 5 disclosures enabled
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transparency Pillars */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Governance</CardTitle>
                    <CardDescription>Policies and oversight</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    AI Ethics Policy in place
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Risk management framework
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Model approval workflow
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Fairness</CardTitle>
                    <CardDescription>Bias testing and monitoring</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Regular bias audits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Adverse impact monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Protected group analysis
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Transparency</CardTitle>
                    <CardDescription>Disclosure and communication</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Public AI inventory
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    User notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Compliance documentation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="disclosures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Systems Used</CardTitle>
              <CardDescription>
                Publicly disclose the AI systems your organization uses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedModels.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{model.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {model.provider} • {model.description || "No description"}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Approved
                    </Badge>
                  </div>
                ))}
                {approvedModels.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No approved models to display
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Certifications</CardTitle>
              <CardDescription>
                Frameworks and standards your AI systems comply with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { name: "NYC Local Law 144", status: "Compliant", region: "New York" },
                  { name: "EU AI Act", status: "In Progress", region: "European Union" },
                  { name: "ISO 42001", status: "Certified", region: "International" },
                ].map((cert, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={cert.status === "Compliant" || cert.status === "Certified" ? "default" : "secondary"}>
                        {cert.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">{cert.region}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Public Disclosure Settings</CardTitle>
              <CardDescription>
                Control what information is publicly visible on your AI Trust Center page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showModels">AI Model Inventory</Label>
                  <p className="text-sm text-muted-foreground">Show approved AI models publicly</p>
                </div>
                <Switch
                  id="showModels"
                  checked={publicDisclosures.showModels}
                  onCheckedChange={(checked) => setPublicDisclosures({ ...publicDisclosures, showModels: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showVendors">Vendor Information</Label>
                  <p className="text-sm text-muted-foreground">Show third-party AI vendors</p>
                </div>
                <Switch
                  id="showVendors"
                  checked={publicDisclosures.showVendors}
                  onCheckedChange={(checked) => setPublicDisclosures({ ...publicDisclosures, showVendors: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showCompliance">Compliance Status</Label>
                  <p className="text-sm text-muted-foreground">Show regulatory compliance status</p>
                </div>
                <Switch
                  id="showCompliance"
                  checked={publicDisclosures.showCompliance}
                  onCheckedChange={(checked) => setPublicDisclosures({ ...publicDisclosures, showCompliance: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showBiasMetrics">Bias Audit Results</Label>
                  <p className="text-sm text-muted-foreground">Show bias testing results publicly</p>
                </div>
                <Switch
                  id="showBiasMetrics"
                  checked={publicDisclosures.showBiasMetrics}
                  onCheckedChange={(checked) => setPublicDisclosures({ ...publicDisclosures, showBiasMetrics: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showIncidents">Incident Disclosures</Label>
                  <p className="text-sm text-muted-foreground">Show resolved incidents publicly</p>
                </div>
                <Switch
                  id="showIncidents"
                  checked={publicDisclosures.showIncidents}
                  onCheckedChange={(checked) => setPublicDisclosures({ ...publicDisclosures, showIncidents: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trust Center URL</CardTitle>
              <CardDescription>
                Your public AI Trust Center page URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm">https://trust.parity.ai/your-organization</code>
                <Button variant="ghost" size="sm" className="ml-auto">
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
