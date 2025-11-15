import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Globe,
  TrendingUp,
  Award,
} from "lucide-react";

interface BrandsTableProps {
  brands: any[];
  onEditBrand: (brand: any) => void;
  onDeleteBrand: (brandId: string) => void;
  onToggleStatus: (brandId: string, currentStatus: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  selectedBrands: string[];
  onSelectBrand: (brandId: string) => void;
  onSelectAll: () => void;
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

const getTierColor = (tier: string) => {
  switch (tier.toLowerCase()) {
    case 'premium':
      return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
    case 'standard':
      return 'bg-primary/20 text-primary hover:bg-primary/30';
    default:
      return 'bg-secondary/20 text-secondary hover:bg-secondary/30';
  }
};

export const BrandsTable = React.memo(function BrandsTable({
  brands,
  onEditBrand,
  onDeleteBrand,
  onToggleStatus,
  sortField,
  sortDirection,
  onSort,
  selectedBrands,
  onSelectBrand,
  onSelectAll,
}: BrandsTableProps) {
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
            <TableHead className="w-12">
              <Checkbox
                checked={selectedBrands.length === brands.length && brands.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Brand
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('country')}
            >
              <div className="flex items-center">
                Country
                <SortIcon field="country" />
              </div>
            </TableHead>
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
              onClick={() => onSort('revenue')}
            >
              <div className="flex items-center">
                Revenue
                <SortIcon field="revenue" />
              </div>
            </TableHead>
            <TableHead>Tier</TableHead>
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
          {brands.map((brand) => (
            <TableRow 
              key={brand.id} 
              className="hover:bg-muted/20 transition-colors"
            >
              <TableCell>
                <Checkbox
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={() => onSelectBrand(brand.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-10 w-10 rounded-lg object-cover hover-scale"
                  />
                  <div>
                    <p className="font-medium">{brand.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {brand.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{brand.country}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                  {brand.productCount}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="font-semibold">${(brand.revenue / 1000).toFixed(0)}K</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getTierColor(brand.tier)}>
                  {brand.tier === 'Premium' && <Award className="h-3 w-3 mr-1" />}
                  {brand.tier}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(brand.status)}>
                  {brand.status}
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
                    <DropdownMenuItem onClick={() => onEditBrand(brand)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Brand
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onToggleStatus(brand.id, brand.status)}>
                      {brand.status === 'Active' ? (
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
                      onClick={() => onDeleteBrand(brand.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Brand
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});
