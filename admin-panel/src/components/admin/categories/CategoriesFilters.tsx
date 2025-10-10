import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface CategoriesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  minProducts: string;
  maxProducts: string;
  onMinProductsChange: (value: string) => void;
  onMaxProductsChange: (value: string) => void;
  onClearFilters: () => void;
}

export function CategoriesFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  minProducts,
  maxProducts,
  onMinProductsChange,
  onMaxProductsChange,
  onClearFilters,
}: CategoriesFiltersProps) {
  const hasActiveFilters = searchTerm || selectedStatus !== 'all' || minProducts || maxProducts;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Products Range */}
            <div className="flex-1 flex gap-2">
              <Input
                type="number"
                placeholder="Min products"
                value={minProducts}
                onChange={(e) => onMinProductsChange(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
              <Input
                type="number"
                placeholder="Max products"
                value={maxProducts}
                onChange={(e) => onMaxProductsChange(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={onClearFilters}
                className="whitespace-nowrap"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
