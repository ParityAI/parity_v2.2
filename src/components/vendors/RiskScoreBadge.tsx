import { Badge } from "@/components/ui/badge";

interface RiskScoreBadgeProps {
  score: number | null;
}

export function RiskScoreBadge({ score }: RiskScoreBadgeProps) {
  if (score === null || score === undefined) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Not assessed
      </Badge>
    );
  }

  if (score >= 70) {
    return (
      <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
        High ({score})
      </Badge>
    );
  }

  if (score >= 40) {
    return (
      <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-500">
        Medium ({score})
      </Badge>
    );
  }

  return (
    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-500">
      Low ({score})
    </Badge>
  );
}
