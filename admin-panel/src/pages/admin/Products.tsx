import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductDetailsDialog } from "@/components/admin/ProductDetailsDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { BulkImportDialog } from "@/components/admin/BulkImportDialog";
import { ProductsHeader } from "@/components/admin/products/ProductsHeader";
import { ProductsFilters } from "@/components/admin/products/ProductsFilters";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { StatsCard } from "@/components/admin/StatsCard";
import { useAdminData } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { Package, DollarSign, TrendingUp, AlertTriangle, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const {
    products,
    categories,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
  } = useAdminData();
  
  const { toast } = useToast();
  
  // Debounce search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get unique brands
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(p => p.brand))];
    return uniqueBrands.sort();
  }, [products]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'Active').length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const featuredProducts = products.filter(p => p.featured).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;
    
    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      featuredProducts,
      totalValue,
      avgPrice,
      activePercentage: totalProducts > 0 ? (activeProducts / totalProducts) * 100 : 0,
    };
  }, [products]);

  // Filter products with memoization
  const filteredProducts = useMemo(() => {
    let filtered = searchProducts(debouncedSearchTerm, selectedCategory);
    
    // Apply filters
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    if (brandFilter !== "all") {
      filtered = filtered.filter(p => p.brand === brandFilter);
    }
    if (featuredFilter === "featured") {
      filtered = filtered.filter(p => p.featured === true);
    } else if (featuredFilter === "not-featured") {
      filtered = filtered.filter(p => !p.featured);
    }
    if (priceRangeFilter !== "all") {
      const [min, max] = priceRangeFilter.split("-").map(v => v.replace("+", ""));
      filtered = filtered.filter(p => {
        if (max) return p.price >= Number(min) && p.price <= Number(max);
        return p.price >= Number(min);
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [debouncedSearchTerm, selectedCategory, statusFilter, brandFilter, featuredFilter, priceRangeFilter, sortBy, sortOrder, products, searchProducts]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
    resetPage
  } = usePagination(filteredProducts, itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    resetPage();
  }, [debouncedSearchTerm, selectedCategory, statusFilter, brandFilter, featuredFilter, priceRangeFilter, resetPage]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleCreateProduct = async (data: any) => {
    await createProduct(data);
  };

  const handleUpdateProduct = async (data: any) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  const handleBulkImport = async (products: any[]) => {
    try {
      await Promise.all(products.map(product => createProduct(product)));
      toast({
        title: "Bulk Import Successful",
        description: `${products.length} products imported successfully!`
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Some products failed to import",
        variant: "destructive"
      });
    }
  };

  const openEditForm = (product: any) => {
    setEditingProduct(product);
    setProductFormOpen(true);
  };

  const openDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllProducts = () => {
    setSelectedProducts(
      selectedProducts.length === paginatedItems.length ? [] : paginatedItems.map(p => p.id)
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) return;

    try {
      switch (action) {
        case 'activate':
          await Promise.all(selectedProducts.map(id => updateProduct(id, { status: 'Active' })));
          toast({ title: "Products activated", description: `${selectedProducts.length} products activated` });
          break;
        case 'deactivate':
          await Promise.all(selectedProducts.map(id => updateProduct(id, { status: 'Draft' })));
          toast({ title: "Products deactivated", description: `${selectedProducts.length} products deactivated` });
          break;
        case 'delete':
          await Promise.all(selectedProducts.map(id => deleteProduct(id)));
          toast({ title: "Products deleted", description: `${selectedProducts.length} products deleted` });
          break;
      }
      setSelectedProducts([]);
    } catch (error) {
      toast({ 
        title: "Bulk action failed", 
        description: "Some products could not be updated",
        variant: "destructive" 
      });
    }
  };

  const toggleProductFeature = async (productId: string, currentFeatured: boolean) => {
    try {
      await updateProduct(productId, { featured: !currentFeatured });
      toast({
        title: currentFeatured ? "Removed from featured" : "Added to featured",
        description: `Product ${currentFeatured ? 'removed from' : 'added to'} featured list`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product feature status",
        variant: "destructive"
      });
    }
  };

  const exportProducts = () => {
    const dataStr = JSON.stringify(filteredProducts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'products.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export Complete",
      description: `${filteredProducts.length} products exported successfully`,
    });
  };

  const duplicateProduct = async (product: any) => {
    const duplicatedProduct = {
      ...product,
      name: `${product.name} (Copy)`,
      id: undefined // Let the system generate a new ID
    };
    
    try {
      await createProduct(duplicatedProduct);
      toast({
        title: "Product duplicated",
        description: "Product has been successfully duplicated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate product",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout title="Products">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            description={`${stats.activeProducts} active`}
            icon={Package}
            trend={{ value: stats.activePercentage, label: "Active rate" }}
          />
          <StatsCard
            title="Inventory Value"
            value={`$${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            description="Total stock value"
            icon={DollarSign}
          />
          <StatsCard
            title="Low Stock Items"
            value={stats.lowStockProducts}
            description="Items below 10 units"
            icon={AlertTriangle}
            variant={stats.lowStockProducts > 0 ? "warning" : "default"}
          />
          <StatsCard
            title="Featured Products"
            value={stats.featuredProducts}
            description={`Avg price: $${stats.avgPrice.toFixed(2)}`}
            icon={Star}
            trend={{ value: (stats.featuredProducts / stats.totalProducts) * 100, label: "Featured rate" }}
          />
        </div>

        {/* Inventory Health */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Health</CardTitle>
            <CardDescription>Real-time overview of your product catalog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Products</span>
                <span className="font-medium">{stats.activeProducts} / {stats.totalProducts}</span>
              </div>
              <Progress value={stats.activePercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Brands</p>
                <p className="text-2xl font-bold">{brands.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg Stock/Product</p>
                <p className="text-2xl font-bold">{products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.stock, 0) / products.length) : 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <ProductsHeader
          selectedCount={selectedProducts.length}
          onAddProduct={() => setProductFormOpen(true)}
          onImport={() => setBulkImportOpen(true)}
          onExport={exportProducts}
          onBulkActivate={() => handleBulkAction('activate')}
          onBulkDeactivate={() => handleBulkAction('deactivate')}
          onBulkDelete={() => handleBulkAction('delete')}
        />

        {/* Filters */}
        <ProductsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          categories={categories}
          brandFilter={brandFilter}
          onBrandChange={setBrandFilter}
          featuredFilter={featuredFilter}
          onFeaturedChange={setFeaturedFilter}
          priceRangeFilter={priceRangeFilter}
          onPriceRangeChange={setPriceRangeFilter}
          brands={brands}
        />

        {/* Products Table */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Products ({totalItems})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton rows={itemsPerPage} columns={9} />
            ) : (
              <>
                <ProductsTable
                  products={paginatedItems}
                  selectedProducts={selectedProducts}
                  onToggleProduct={toggleProductSelection}
                  onToggleAll={toggleAllProducts}
                  onViewDetails={handleViewDetails}
                  onEdit={openEditForm}
                  onDelete={openDeleteDialog}
                  onDuplicate={duplicateProduct}
                  onToggleFeature={toggleProductFeature}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                
                {totalPages > 1 && (
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
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Product Form Modal */}
        <ProductForm
          open={productFormOpen}
          onOpenChange={(open) => {
            setProductFormOpen(open);
            if (!open) setEditingProduct(null);
          }}
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          loading={loading}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteProduct}
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
        />

        {/* Product Details Dialog */}
        <ProductDetailsDialog
          product={selectedProduct}
          open={showProductDetails}
          onOpenChange={setShowProductDetails}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
        />

        {/* Bulk Import Dialog */}
        <BulkImportDialog
          open={bulkImportOpen}
          onOpenChange={setBulkImportOpen}
          onImport={handleBulkImport}
        />
      </div>
    </AdminLayout>
  );
}
