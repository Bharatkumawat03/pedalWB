import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { NotificationSystem } from "./NotificationSystem";
import { CommandPalette } from "@/components/CommandPalette";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { KeyboardShortcutsDialog } from "@/components/KeyboardShortcutsDialog";
import { Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({ children, title = "Dashboard" }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <KeyboardShortcutsDialog />
      <CommandPalette />
      
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          {/* Top Header */}
          <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="ml-0" />
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-foreground">{title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back to your admin panel
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Keyboard Shortcuts */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                      <Keyboard className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Press ⌘ / to see shortcuts</p>
                  </TooltipContent>
                </Tooltip>

                {/* Notifications */}
                <NotificationSystem />

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">A</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-foreground">Admin User</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Breadcrumbs */}
            <div className="px-6 pb-3">
              <Breadcrumbs />
            </div>
          </header>

          {/* Main Content with animation */}
          <main className="flex-1 p-6 space-y-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}