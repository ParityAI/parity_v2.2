const Placeholder = ({ title }: { title: string }) => {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-muted-foreground">This page is under development</p>
      </div>
    </div>
  );
};

export const Tasks = () => <Placeholder title="Tasks" />;
export const UseCases = () => <Placeholder title="Use Cases" />;
export const Vendors = () => <Placeholder title="Vendors" />;
export const Risks = () => <Placeholder title="Risk Management" />;
export const BiasMetrics = () => <Placeholder title="Bias & Fairness" />;
export const Compliance = () => <Placeholder title="Compliance Frameworks" />;
export const Evidence = () => <Placeholder title="Evidence Hub" />;
export const Reporting = () => <Placeholder title="Reporting" />;
export const Policies = () => <Placeholder title="Policy Manager" />;
export const Incidents = () => <Placeholder title="Incident Management" />;
