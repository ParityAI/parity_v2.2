import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface IncidentData {
  status: string;
  count: number;
  color: string;
}

interface DashboardChartsProps {
  taskData: ChartData[] | undefined;
  incidentData: IncidentData[] | undefined;
  riskDistribution: ChartData[] | undefined;
  isLoading: boolean;
}

export function DashboardCharts({ taskData, incidentData, riskDistribution, isLoading }: DashboardChartsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const hasTaskData = taskData && taskData.some(t => t.value > 0);
  const hasIncidentData = incidentData && incidentData.some(i => i.count > 0);
  const hasRiskData = riskDistribution && riskDistribution.some(r => r.value > 0);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Task Radar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Task Radar</CardTitle>
          <CardDescription>Compliance task status</CardDescription>
        </CardHeader>
        <CardContent>
          {hasTaskData ? (
            <>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                {taskData?.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              No compliance tasks yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Incident Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Incident Status</CardTitle>
          <CardDescription>Current incident breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          {hasIncidentData ? (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="status" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {incidentData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              No incidents recorded
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk Distribution</CardTitle>
          <CardDescription>Models by risk level</CardDescription>
        </CardHeader>
        <CardContent>
          {hasRiskData ? (
            <>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                {riskDistribution?.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              No models registered yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
