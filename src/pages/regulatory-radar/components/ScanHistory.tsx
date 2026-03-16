import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface AutoRisk {
  id: string;
  title: string;
  severity: string;
  source: string | null;
  regulation: string | null;
  created_at: string;
}

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  major: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  minor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  negligible: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export function ScanHistory() {
  const { data: autoRisks = [], isLoading } = useQuery({
    queryKey: ['risks', 'auto-generated'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('risks')
        .select('id, title, severity, source, regulation, created_at')
        .eq('auto_generated', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as AutoRisk[];
    },
  });

  // Group by date
  const grouped = autoRisks.reduce<Record<string, AutoRisk[]>>((acc, risk) => {
    const date = format(new Date(risk.created_at), 'MMM d, yyyy');
    if (!acc[date]) acc[date] = [];
    acc[date].push(risk);
    return acc;
  }, {});

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            Scan History
          </CardTitle>
          <Link
            to="/risks"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View all in Risk Register
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[420px] px-4 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
              Loading history...
            </div>
          ) : autoRisks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <History className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No scan history yet.</p>
              <p className="text-xs">Run your first scan to see results here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(grouped).map(([date, risks]) => (
                <div key={date}>
                  <div className="text-xs font-medium text-muted-foreground mb-2 sticky top-0 bg-background py-1">
                    {date} — {risks.length} alert{risks.length !== 1 ? 's' : ''}
                  </div>
                  <div className="space-y-1.5">
                    {risks.map((risk) => (
                      <div
                        key={risk.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors"
                      >
                        <Badge
                          variant="outline"
                          className={`text-[10px] shrink-0 ${severityColors[risk.severity] || ''}`}
                        >
                          {risk.severity}
                        </Badge>
                        <span className="text-sm truncate flex-1">{risk.title}</span>
                        {risk.source && (
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {risk.source}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
