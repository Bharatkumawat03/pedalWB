import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandsHeader } from "@/components/admin/brands/BrandsHeader";
import { BrandsFilters } from "@/components/admin/brands/BrandsFilters";
import { BrandsTable } from "@/components/admin/brands/BrandsTable";
import { BrandForm } from "@/components/admin/BrandForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { StatsCard } from "@/components/admin/StatsCard";
import { useAdminData } from "@/hooks/useAdminData";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { useToast } from "@/hooks/use-toast";
import { Badge as BadgeIcon, TrendingUp, Globe, AlertCircle, Award, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminBrands() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [minProducts, setMinProducts] = useState("");
  const [maxProducts, setMaxProducts] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [brandFormOpen, setBrandFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const {
    brands,
    products,
    loading,
    createBrand,
    updateBrand,
    deleteBrand,
    searchBrands
  } = useAdminData();
  
  const { toast } = useToast();

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Calculate advanced stats
  const stats = useMemo(() => {
    const totalBrands = brands.length;
    const activeBrands = brands.filter(b => b.status === 'Active').length;
    const premiumBrands = brands.filter(b => b.tier === 'Premium').length;
    const totalProducts = brands.reduce((sum, b) => sum + b.productCount, 0);
    const avgProductsPerBrand = totalBrands > 0 ? totalProducts / totalBrands : 0;
    const emptyBrands = brands.filter(b => b.productCount === 0).length;
    const activeRate = totalBrands > 0 ? (activeBrands / totalBrands) * 100 : 0;
    const premiumRate = totalBrands > 0 ? (premiumBrands / totalBrands) * 100 : 0;
    
    // Country distribution
    const countryDistribution = brands.reduce((acc, brand) => {
      acc[brand.country] = (acc[brand.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCountries = Object.entries(countryDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Performance metrics
    const topPerformingBrands = [...brands]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const totalRevenue = brands.reduce((sum, b) => sum + (Number(b.revenue) || 0), 0);
    const avgRevenue = totalBrands > 0 ? totalRevenue / totalBrands : 0;
    
    return {
      totalBrands,
      activeBrands,
      premiumBrands,
      totalProducts,
      avgProductsPerBrand,
      emptyBrands,
      activeRate,
      premiumRate,
      topCountries,
      topPerformingBrands,
      totalRevenue,
      avgRevenue,
    };
  }, [brands]);

  // Filtered and sorted brands
  const filteredBrands = useMemo(() => {
    let result = searchBrands(debouncedSearch);

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(brand => brand.status === selectedStatus);
    }

    // Country filter
    if (selectedCountry !== 'all') {
      result = result.filter(brand => brand.country === selectedCountry);
    }

    // Products range filter
    if (minProducts || maxProducts) {
      result = result.filter(brand => {
        const count = brand.productCount;
        if (minProducts && count < parseInt(minProducts)) return false;
        if (maxProducts && count > parseInt(maxProducts)) return false;
        return true;
      });
    }

    // Date range filter
    if (dateFrom || dateTo) {
      result = result.filter(brand => {
        const brandDate = new Date(brand.createdAt);
        if (dateFrom && brandDate < new Date(dateFrom)) return false;
        if (dateTo && brandDate > new Date(dateTo)) return false;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'productCount' || sortField === 'revenue') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [debouncedSearch, selectedStatus, selectedCountry, minProducts, maxProducts, dateFrom, dateTo, sortField, sortDirection, searchBrands]);

  // Pagination
  const {
    paginatedItems: paginatedBrands,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    goToPage,
    resetPage
  } = usePagination(filteredBrands, itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    resetPage();
  }, [debouncedSearch, selectedStatus, selectedCountry, minProducts, maxProducts, dateFrom, dateTo, resetPage]);

  const handleCreateBrand = async (data: any) => {
    await createBrand(data);
    setBrandFormOpen(false);
  };

  const handleUpdateBrand = async (data: any) => {
    if (editingBrand) {
      await updateBrand(editingBrand.id, data);
      setEditingBrand(null);
      setBrandFormOpen(false);
    }
  };

  const handleDeleteBrand = async () => {
    if (brandToDelete) {
      await deleteBrand(brandToDelete);
      setBrandToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    for (const brandId of selectedBrands) {
      await deleteBrand(brandId);
    }
    setSelectedBrands([]);
    setBulkDeleteDialogOpen(false);
    toast({
      title: "Brands Deleted",
      description: `${selectedBrands.length} brands have been deleted`,
    });
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    for (const brandId of selectedBrands) {
      await updateBrand(brandId, { status: newStatus });
    }
    setSelectedBrands([]);
    toast({
      title: "Status Updated",
      description: `${selectedBrands.length} brands updated to ${newStatus}`,
    });
  };

  const openEditForm = (brand: any) => {
    setEditingBrand(brand);
    setBrandFormOpen(true);
  };

  const openDeleteDialog = (brandId: string) => {
    setBrandToDelete(brandId);
    setDeleteDialogOpen(true);
  };

  const toggleBrandStatus = async (brandId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateBrand(brandId, { status: newStatus });
      toast({
        title: "Status Updated",
        description: `Brand status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update brand status",
        variant: "destructive"
      });
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedCountry("all");
    setMinProducts("");
    setMaxProducts("");
    setDateFrom("");
    setDateTo("");
  };

  const exportBrands = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(filteredBrands, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'brands.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      // CSV export
      const headers = ['ID', 'Name', 'Country', 'Status', 'Products', 'Revenue', 'Tier', 'Created'];
      const csvContent = [
        headers.join(','),
        ...filteredBrands.map(brand => [
          brand.id,
          `"${brand.name}"`,
          brand.country,
          brand.status,
          brand.productCount,
          brand.revenue,
          brand.tier,
          brand.createdAt
        ].join(','))
      ].join('\n');
      
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', 'brands.csv');
      linkElement.click();
    }
    
    toast({
      title: "Export Complete",
      description: `${filteredBrands.length} brands exported as ${format.toUpperCase()}`,
    });
  };

  const toggleSelectAll = () => {
    if (selectedBrands.length === paginatedBrands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(paginatedBrands.map(b => b.id));
    }
  };

  const toggleSelectBrand = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  return (
    <AdminLayout title="Brands">
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Brands"
                value={stats.totalBrands}
                description={`${stats.activeBrands} active`}
                icon={BadgeIcon}
                trend={{ value: stats.activeRate, label: "Active rate" }}
              />
              <StatsCard
                title="Premium Brands"
                value={stats.premiumBrands}
                description={`${stats.premiumRate.toFixed(1)}% of total`}
                icon={Award}
                variant="premium"
              />
              <StatsCard
                title="Total Revenue"
                value={`$${(stats.totalRevenue / 1000000).toFixed(1)}M`}
                description={`Avg: $${(stats.avgRevenue / 1000).toFixed(0)}K per brand`}
                icon={TrendingUp}
              />
              <StatsCard
                title="Empty Brands"
                value={stats.emptyBrands}
                description="Brands with no products"
                icon={AlertCircle}
                variant={stats.emptyBrands > 0 ? "warning" : "default"}
              />
            </div>

            {/* Brand Distribution */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Performance</CardTitle>
                  <CardDescription>Status and product distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active Brands</span>
                      <span className="font-medium">{stats.activeBrands} / {stats.totalBrands}</span>
                    </div>
                    <Progress value={stats.activeRate} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Premium Brands</span>
                      <span className="font-medium">{stats.premiumBrands} / {stats.totalBrands}</span>
                    </div>
                    <Progress value={stats.premiumRate} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Products</p>
                      <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Avg/Brand</p>
                      <p className="text-2xl font-bold">{stats.avgProductsPerBrand.toFixed(1)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Empty</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.emptyBrands}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Top 5 countries by brand count</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats.topCountries.map(([country, count]: [string, number], index) => (
                    <div key={country} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {index + 1}
                        </div>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{country}</span>
                      </div>
                      <Badge variant="outline">{count} brands</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Performing Brands
                </CardTitle>
                <CardDescription>By revenue generation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topPerformingBrands.map((brand: any, index) => (
                    <div key={brand.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 text-white font-bold">
                          {index + 1}
                        </div>
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold">{brand.name}</p>
                          <p className="text-sm text-muted-foreground">{brand.country}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">${(brand.revenue / 1000000).toFixed(2)}M</p>
                        <p className="text-sm text-muted-foreground">{brand.productCount} products</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <BrandsHeader
              onAddBrand={() => setBrandFormOpen(true)}
              onExport={exportBrands}
              selectedCount={selectedBrands.length}
              onBulkDelete={() => setBulkDeleteDialogOpen(true)}
              onBulkStatusChange={handleBulkStatusChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <BrandsFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              minProducts={minProducts}
              maxProducts={maxProducts}
              onMinProductsChange={setMinProducts}
              onMaxProductsChange={setMaxProducts}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onClearFilters={handleClearFilters}
            />

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              {loading ? (
                <TableSkeleton rows={itemsPerPage} columns={8} />
              ) : (
                <BrandsTable
                  brands={paginatedBrands}
                  onEditBrand={openEditForm}
                  onDeleteBrand={openDeleteDialog}
                  onToggleStatus={toggleBrandStatus}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  selectedBrands={selectedBrands}
                  onSelectBrand={toggleSelectBrand}
                  onSelectAll={toggleSelectAll}
                />
              )}
            </Card>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={goToPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </TabsContent>
        </Tabs>

        {/* Brand Form Modal */}
        <BrandForm
          open={brandFormOpen}
          onOpenChange={(open) => {
            setBrandFormOpen(open);
            if (!open) setEditingBrand(null);
          }}
          brand={editingBrand}
          onSubmit={editingBrand ? handleUpdateBrand : handleCreateBrand}
          loading={loading}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteBrand}
          title="Delete Brand"
          description="Are you sure you want to delete this brand? This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
        />

        {/* Bulk Delete Confirmation Dialog */}
        <ConfirmDialog
          open={bulkDeleteDialogOpen}
          onOpenChange={setBulkDeleteDialogOpen}
          onConfirm={handleBulkDelete}
          title="Delete Selected Brands"
          description={`Are you sure you want to delete ${selectedBrands.length} brands? This action cannot be undone.`}
          confirmText="Delete All"
          variant="destructive"
        />
      </div>
    </AdminLayout>
  );
}
