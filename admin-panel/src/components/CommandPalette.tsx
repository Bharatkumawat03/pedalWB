import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Users,
  ShoppingCart,
  BarChart3,
  Bell,
  Settings,
  Search,
} from "lucide-react";

const commands = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin", keywords: ["home", "overview"] },
  { icon: Package, label: "Products", path: "/admin/products", keywords: ["items", "inventory"] },
  { icon: FolderOpen, label: "Categories", path: "/admin/categories", keywords: ["groups", "organize"] },
  { icon: Users, label: "Users", path: "/admin/users", keywords: ["customers", "accounts"] },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders", keywords: ["purchases", "sales"] },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics", keywords: ["stats", "reports"] },
  { icon: Bell, label: "Notifications", path: "/admin/notifications", keywords: ["alerts", "messages"] },
  { icon: Settings, label: "Settings", path: "/admin/settings", keywords: ["preferences", "config"] },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button> */}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {commands.map((cmd) => (
              <CommandItem
                key={cmd.path}
                onSelect={() => handleSelect(cmd.path)}
                className="cursor-pointer"
              >
                <cmd.icon className="mr-2 h-4 w-4" />
                <span>{cmd.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
