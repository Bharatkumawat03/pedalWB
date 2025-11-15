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
import { Search, X, Calendar } from "lucide-react";

interface BrandsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  minProducts: string;
  maxProducts: string;
  onMinProductsChange: (value: string) => void;
  onMaxProductsChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClearFilters: () => void;
}

export function BrandsFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCountry,
  onCountryChange,
  minProducts,
  maxProducts,
  onMinProductsChange,
  onMaxProductsChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
}: BrandsFiltersProps) {
  const hasActiveFilters = 
    searchTerm || 
    selectedStatus !== 'all' || 
    selectedCountry !== 'all' ||
    minProducts || 
    maxProducts ||
    dateFrom ||
    dateTo;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Primary Filters Row */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search brands by name, description, or ID..."
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

            {/* Country Filter */}
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Italy">Italy</SelectItem>
                <SelectItem value="Japan">Japan</SelectItem>
                <SelectItem value="China">China</SelectItem>
                <SelectItem value="South Korea">South Korea</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters Row */}
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

            {/* Date Range */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="date"
                  placeholder="From date"
                  value={dateFrom}
                  onChange={(e) => onDateFromChange(e.target.value)}
                  className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="date"
                  placeholder="To date"
                  value={dateTo}
                  onChange={(e) => onDateToChange(e.target.value)}
                  className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
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
