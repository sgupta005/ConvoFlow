import { Input } from '@workspace/ui/components/input';
import { Search } from 'lucide-react';
import * as React from 'react';

interface SearchMeetingProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchMeeting({ search, setSearch }: SearchMeetingProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-sidebar-foreground" />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search your Meetings..."
        className="pl-8 dark:border-none shadow-none placeholder:text-sidebar-foreground"
      />
    </div>
  );
}


