'use client';

import { usePathname } from "next/navigation";
import { SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";

export function LayoutClient({ children }: { children: Readonly<React.ReactNode> }) {
  const pathname = usePathname();
  const lastSegment = pathname.split('/').filter(Boolean).pop();
  const pageName = lastSegment
    ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    : 'Dashboard';
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 justify-between w-full">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <span className="text-sm">{pageName.replace('-', ' ')}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <div className="px-4">
        {children}
      </div>
    </SidebarInset>)
}