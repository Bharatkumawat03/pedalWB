import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Download,
  Upload,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Package,
} from "lucide-react";

interface ProductsHeaderProps {
  selectedCount: number;
  onAddProduct: () => void;
  onImport: () => void;
  onExport: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkDelete: () => void;
}

export function ProductsHeader({
  selectedCount,
  onAddProduct,
  onImport,
  onExport,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
}: ProductsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Product Management</h2>
        {selectedCount > 0 && (
          <Badge variant="secondary">{selectedCount} selected</Badge>
        )}
      </div>
      
      <div className="flex gap-2">
        {selectedCount > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hover-scale">
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onBulkActivate}>
                <ToggleRight className="h-4 w-4 mr-2" />
                Activate Selected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onBulkDeactivate}>
                <ToggleLeft className="h-4 w-4 mr-2" />
                Deactivate Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onBulkDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <Button variant="outline" onClick={onExport} className="hover-scale">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        <Button variant="outline" onClick={onImport} className="hover-scale">
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
        
        <Button
          onClick={onAddProduct}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover-scale"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
    </div>
  );
}
