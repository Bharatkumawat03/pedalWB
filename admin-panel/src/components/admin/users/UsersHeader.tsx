import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users as UsersIcon, UserPlus, Download, Settings } from "lucide-react";

interface UsersHeaderProps {
  selectedCount: number;
  onAddUser: () => void;
  onExport: () => void;
  onBulkActions: () => void;
}

export function UsersHeader({
  selectedCount,
  onAddUser,
  onExport,
  onBulkActions,
}: UsersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <UsersIcon className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">User Management</h2>
        {selectedCount > 0 && (
          <Badge variant="secondary">{selectedCount} selected</Badge>
        )}
      </div>
      <div className="flex gap-2">
        {selectedCount > 0 && (
          <Button variant="outline" onClick={onBulkActions} className="hover-scale">
            <Settings className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
        )}
        <Button variant="outline" onClick={onExport} className="hover-scale">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button
          onClick={onAddUser}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover-scale"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
    </div>
  );
}
