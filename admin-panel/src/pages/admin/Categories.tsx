import { useState, useMemo, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoriesHeader } from "@/components/admin/categories/CategoriesHeader";
import { CategoriesFilters } from "@/components/admin/categories/CategoriesFilters";
import { CategoriesTable } from "@/components/admin/categories/CategoriesTable";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CategoryProductsDialog } from "@/components/admin/CategoryProductsDialog";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { StatsCard } from "@/components/admin/StatsCard";
import { useAdminData } from "@/hooks/useAdminData";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { useToast } from "@/hooks/use-toast";
import { FolderOpen, Package, TrendingUp, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [minProducts, setMinProducts] = useState("");
  const [maxProducts, setMaxProducts] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [viewProductsDialog, setViewProductsDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const {
    categories,
    products,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories
  } = useAdminData();
  
  const { toast } = useToast();

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.status === 'Active').length;
    const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);
    const avgProductsPerCategory = totalCategories > 0 ? totalProducts / totalCategories : 0;
    const emptyCategories = categories.filter(c => c.productCount === 0).length;
    const activeRate = totalCategories > 0 ? (activeCategories / totalCategories) * 100 : 0;
    
    return {
      totalCategories,
      activeCategories,
      totalProducts,
      avgProductsPerCategory,
      emptyCategories,
      activeRate,
    };
  }, [categories]);

  // Filtered and sorted categories
  const filteredCategories = useMemo(() => {
    let result = searchCategories(debouncedSearch);

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(cat => cat.status === selectedStatus);
    }

    // Products range filter
    if (minProducts || maxProducts) {
      result = result.filter(cat => {
        const count = cat.productCount;
        if (minProducts && count < parseInt(minProducts)) return false;
        if (maxProducts && count > parseInt(maxProducts)) return false;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'productCount') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [debouncedSearch, selectedStatus, minProducts, maxProducts, sortField, sortDirection, searchCategories]);

  // Pagination
  const {
    paginatedItems: paginatedCategories,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    goToPage,
    resetPage
  } = usePagination(filteredCategories, itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    resetPage();
  }, [debouncedSearch, selectedStatus, minProducts, maxProducts, resetPage]);

  const handleCreateCategory = async (data: any) => {
    await createCategory(data);
  };

  const handleUpdateCategory = async (data: any) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const openEditForm = (category: any) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const openDeleteDialog = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const openViewProducts = (category: any) => {
    setSelectedCategory(category);
    setViewProductsDialog(true);
  };

  const toggleCategoryStatus = async (categoryId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateCategory(categoryId, { status: newStatus });
      toast({
        title: "Status Updated",
        description: `Category status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category status",
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
    setMinProducts("");
    setMaxProducts("");
  };

  const exportCategories = () => {
    const dataStr = JSON.stringify(filteredCategories, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'categories.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export Complete",
      description: `${filteredCategories.length} categories exported successfully`,
    });
  };

  return (
    <AdminLayout title="Categories">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Categories"
            value={stats.totalCategories}
            description={`${stats.activeCategories} active`}
            icon={FolderOpen}
            trend={{ value: stats.activeRate, label: "Active rate" }}
          />
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            description="Across all categories"
            icon={Package}
          />
          <StatsCard
            title="Avg Products/Category"
            value={Math.round(stats.avgProductsPerCategory)}
            description="Distribution metric"
            icon={TrendingUp}
          />
          <StatsCard
            title="Empty Categories"
            value={stats.emptyCategories}
            description="Categories with no products"
            icon={CheckCircle}
            variant={stats.emptyCategories > 0 ? "warning" : "default"}
          />
        </div>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Overview of category organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Categories</span>
                <span className="font-medium">{stats.activeCategories} / {stats.totalCategories}</span>
              </div>
              <Progress value={stats.activeRate} className="h-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Populated</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalCategories - stats.emptyCategories}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Empty</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.emptyCategories}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Product Density</p>
                <p className="text-2xl font-bold">{stats.avgProductsPerCategory.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <CategoriesHeader
          onAddCategory={() => setCategoryFormOpen(true)}
          onExport={exportCategories}
        />

        <CategoriesFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          minProducts={minProducts}
          maxProducts={maxProducts}
          onMinProductsChange={setMinProducts}
          onMaxProductsChange={setMaxProducts}
          onClearFilters={handleClearFilters}
        />

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          {loading ? (
            <TableSkeleton rows={itemsPerPage} columns={6} />
          ) : (
            <CategoriesTable
              categories={paginatedCategories}
              onViewProducts={openViewProducts}
              onEditCategory={openEditForm}
              onDeleteCategory={openDeleteDialog}
              onToggleStatus={toggleCategoryStatus}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
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

        {/* Category Form Modal */}
        <CategoryForm
          open={categoryFormOpen}
          onOpenChange={(open) => {
            setCategoryFormOpen(open);
            if (!open) setEditingCategory(null);
          }}
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          loading={loading}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteCategory}
          title="Delete Category"
          description="Are you sure you want to delete this category? This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
        />

        {/* Category Products Dialog */}
        <CategoryProductsDialog
          category={selectedCategory}
          open={viewProductsDialog}
          onOpenChange={setViewProductsDialog}
        />
      </div>
    </AdminLayout>
  );
}