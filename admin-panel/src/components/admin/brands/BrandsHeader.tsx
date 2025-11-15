import { Button } from "@/components/ui/button";
import { Badge, Plus, Download, Trash2, ToggleRight, Grid3X3, List } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BrandsHeaderProps {
  onAddBrand: () => void;
  onExport: (format: 'json' | 'csv') => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: string) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
}

export function BrandsHeader({
  onAddBrand,
  onExport,
  selectedCount,
  onBulkDelete,
  onBulkStatusChange,
  viewMode,
  onViewModeChange,
}: BrandsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <Badge className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Brand Management</h2>
        {selectedCount > 0 && (
          <span className="text-sm text-muted-foreground ml-2">
            ({selectedCount} selected)
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* View Mode Toggle */}
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="rounded-r-none"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-l-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hover-scale">
                  <ToggleRight className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onBulkStatusChange('Active')}>
                  Set Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkStatusChange('Inactive')}>
                  Set Inactive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={onBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline"
              className="hover-scale"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport('json')}>
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('csv')}>
              Export as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Add Brand Button */}
        <Button 
          onClick={onAddBrand}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover-scale"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>
    </div>
  );
}
