import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle2, AlertCircle, Clock, Database, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
  details: any;
}

interface RecentActivityProps {
  activities: ActivityItem[] | undefined;
  isLoading: boolean;
}

const getActivityIcon = (entityType: string, action: string) => {
  if (action.includes("approved") || action.includes("passed")) return CheckCircle2;
  if (action.includes("critical") || action.includes("incident")) return AlertCircle;
  if (entityType === "model") return Database;
  if (entityType === "vendor") return Building2;
  return Clock;
};

const formatActivityMessage = (activity: ActivityItem) => {
  const { action, entity_type, details } = activity;
  const name = details?.name || details?.title || "";
  
  switch (action) {
    case "created":
      return `New ${entity_type} ${name ? `"${name}" ` : ""}added`;
    case "updated":
      return `${entity_type} ${name ? `"${name}" ` : ""}updated`;
    case "deleted":
      return `${entity_type} ${name ? `"${name}" ` : ""}removed`;
    case "approved":
      return `${entity_type} ${name ? `"${name}" ` : ""}approved`;
    default:
      return `${action} on ${entity_type}`;
  }
};

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasActivities = activities && activities.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </div>
        {hasActivities && (
          <Button variant="ghost" size="sm">
            View All <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {hasActivities ? (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.entity_type, activity.action);
              return (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {formatActivityMessage(activity)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Actions will appear here as you use the platform</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
