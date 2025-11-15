import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "warning" | "success" | "premium";
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  trend,
  variant = "default"
}: StatsCardProps) {
  const changeColor = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground"
  }[changeType];

  const variantStyles = {
    default: "border-0",
    warning: "border-l-4 border-l-yellow-500",
    success: "border-l-4 border-l-green-500",
    premium: "border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-950/20"
  }[variant];

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-200 shadow-md hover:scale-105", variantStyles)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {trend && (
            <p className="text-xs text-muted-foreground">
              {trend.value.toFixed(1)}% {trend.label}
            </p>
          )}
          {change && (
            <p className={`text-xs ${changeColor} flex items-center gap-1`}>
              {change}
              {description && !trend && (
                <span className="text-muted-foreground">from last month</span>
              )}
            </p>
          )}
          {description && !change && !trend && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {description && (change || trend) && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}