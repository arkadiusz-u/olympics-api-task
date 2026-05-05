interface InfoRowProps {
    label: string;
    value: string;
}

export const InfoRow = ({ label, value }: InfoRowProps) => {
    return (
      <div className="grid gap-1">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="wrap-break-word font-medium">{value || "TBD"}</span>
      </div>
    );
  }
  