import { Button } from "@/components/ui/button";
import { FolderOpen, Plus, Download } from "lucide-react";

interface CategoriesHeaderProps {
  onAddCategory: () => void;
  onExport: () => void;
}

export function CategoriesHeader({
  onAddCategory,
  onExport,
}: CategoriesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <FolderOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Category Management</h2>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={onExport}
          className="hover-scale"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button 
          onClick={onAddCategory}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover-scale"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
    </div>
  );
}
