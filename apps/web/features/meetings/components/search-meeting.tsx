import { Input } from '@workspace/ui/components/input';
import { Search } from 'lucide-react';

export function SearchMeeting() {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-sidebar-foreground" />
      <Input
        placeholder="Search your Meetings..."
        className="pl-8 dark:border-none shadow-none placeholder:text-sidebar-foreground"
      />
    </div>
  );
}


