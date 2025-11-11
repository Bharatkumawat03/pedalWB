import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface CategoriesTableProps {
  categories: any[];
  onViewProducts: (category: any) => void;
  onEditCategory: (category: any) => void;
  onDeleteCategory: (categoryId: string) => void;
  onToggleStatus: (category: any, currentStatus: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-success/20 text-success hover:bg-success/30';
    case 'inactive':
      return 'bg-muted text-muted-foreground hover:bg-muted/80';
    default:
      return 'bg-secondary/20 text-secondary hover:bg-secondary/30';
  }
};

export const CategoriesTable = React.memo(function CategoriesTable({
  categories,
  onViewProducts,
  onEditCategory,
  onDeleteCategory,
  onToggleStatus,
  sortField,
  sortDirection,
  onSort,
}: CategoriesTableProps) {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Category
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('productCount')}
            >
              <div className="flex items-center">
                Products
                <SortIcon field="productCount" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center">
                Status
                <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const categoryId = category._id || category.id;
            const categoryImage = category.image || {};
            const productCount = category.productCount || 0;
            const status = category.status || 'Active';
            return (
              <TableRow key={categoryId} className="hover:bg-muted/20 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {categoryImage.url && (
                      <img
                        src={categoryImage.url}
                        alt={categoryImage.altText || category.name}
                        className="h-10 w-10 rounded-lg object-cover hover-scale"
                      />
                    )}
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {categoryId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    /{category.slug}
                  </code>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm truncate">{category.description}</p>
                </TableCell>
                <TableCell>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                    {productCount}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(status)}>
                    {status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover-scale">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover z-50">
                      <DropdownMenuItem onClick={() => onViewProducts(category)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Products ({productCount})
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditCategory(category)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Category
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleStatus(category, status)}>
                        {status === 'Active' ? (
                          <>
                            <ToggleLeft className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => onDeleteCategory(categoryId)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
});
