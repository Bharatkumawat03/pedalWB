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
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/use-toast";
import { FolderOpen, Package, TrendingUp, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminCategories() {
  console.log('AdminCategories component rendering');
  
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
    loading,
    currentPage,
    totalPages,
    totalCategories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
  } = useCategories();
  
  const { toast } = useToast();

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCategoriesCount = categories.length;
    const activeCategories = categories.filter(c => c.isActive !== false).length;
    const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
    const avgProductsPerCategory = totalCategoriesCount > 0 ? totalProducts / totalCategoriesCount : 0;
    const emptyCategories = categories.filter(c => (c.productCount || 0) === 0).length;
    const activeRate = totalCategoriesCount > 0 ? (activeCategories / totalCategoriesCount) * 100 : 0;
    
    return {
      totalCategories: totalCategoriesCount,
      activeCategories,
      totalProducts,
      avgProductsPerCategory,
      emptyCategories,
      activeRate,
    };
  }, [categories]);

  // Filtered and sorted categories
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    // Search filter
    if (debouncedSearch) {
      result = result.filter(cat => 
        cat.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        cat.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'Active') {
        result = result.filter(cat => cat.isActive !== false);
      } else {
        result = result.filter(cat => cat.isActive === false);
      }
    }

    // Products range filter
    if (minProducts || maxProducts) {
      result = result.filter(cat => {
        const count = cat.productCount || 0;
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
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [debouncedSearch, selectedStatus, minProducts, maxProducts, sortField, sortDirection, categories]);

  // Pagination
  const paginatedCategories = filteredCategories.slice(0, itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredCategories.length);
  const totalItems = filteredCategories.length;
  
  const goToPage = (page: number) => {
    fetchCategories(page, itemsPerPage);
  };

  // Refetch when filters change
  useEffect(() => {
    fetchCategories(1, itemsPerPage);
  }, [debouncedSearch, selectedStatus, minProducts, maxProducts]);

  const handleCreateCategory = async (data: any) => {
    try {
      // Ensure icon and isActive are included
      const categoryData = {
        ...data,
        icon: data.icon || '🏷️',
        isActive: data.isActive !== undefined ? data.isActive : true
      };
      await createCategory(categoryData);
      setCategoryFormOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleUpdateCategory = async (data: any) => {
    if (editingCategory) {
      try {
        const categoryId = editingCategory._id || editingCategory.id;
        // Ensure icon and isActive are included
        const categoryData = {
          ...data,
          icon: data.icon !== undefined ? data.icon : editingCategory.icon || '🏷️',
          isActive: data.isActive !== undefined ? data.isActive : (editingCategory.status === 'active' || editingCategory.isActive)
        };
        await updateCategory(categoryId, categoryData);
        setEditingCategory(null);
        setCategoryFormOpen(false);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete);
        setCategoryToDelete(null);
        setDeleteDialogOpen(false);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const openEditForm = (category: any) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const openDeleteDialog = (category: any) => {
    const categoryId = category._id || category.id;
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const openViewProducts = (category: any) => {
    setSelectedCategory(category);
    setViewProductsDialog(true);
  };

  const handleToggleStatus = async (category: any, currentStatus: string) => {
    const categoryId = category._id || category.id;
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
              onToggleStatus={handleToggleStatus}
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