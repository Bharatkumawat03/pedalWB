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

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  minOrders: string;
  maxOrders: string;
  onMinOrdersChange: (value: string) => void;
  onMaxOrdersChange: (value: string) => void;
  onClearFilters: () => void;
}

export function UsersFilters({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  minOrders,
  maxOrders,
  onMinOrdersChange,
  onMaxOrdersChange,
  onClearFilters,
}: UsersFiltersProps) {
  const hasActiveFilters = searchTerm || selectedRole !== 'all' || selectedStatus !== 'all' || 
    dateFrom || dateTo || minOrders || maxOrders;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Role Filter */}
            <Select value={selectedRole} onValueChange={onRoleChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Date Range */}
            <div className="flex-1 flex gap-2">
              <Input
                type="date"
                placeholder="From date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
              <Input
                type="date"
                placeholder="To date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Orders Range */}
            <div className="flex-1 flex gap-2">
              <Input
                type="number"
                placeholder="Min orders"
                value={minOrders}
                onChange={(e) => onMinOrdersChange(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
              <Input
                type="number"
                placeholder="Max orders"
                value={maxOrders}
                onChange={(e) => onMaxOrdersChange(e.target.value)}
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
