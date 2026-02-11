import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  iconClassName?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  iconClassName,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="relative">
          <Icon className={cn('h-4 w-4 text-muted-foreground', iconClassName)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
