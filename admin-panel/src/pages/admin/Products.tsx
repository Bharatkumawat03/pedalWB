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
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { Package, DollarSign, TrendingUp, AlertTriangle, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminProducts() {
  console.log('AdminProducts component rendering');
  
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
    currentPage,
    totalPages,
    totalProducts,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
  } = useProducts();
  
  const { toast } = useToast();
  
  // Debounce search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get unique brands
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    return uniqueBrands.sort();
  }, [products]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProductsCount = products.length;
    const activeProducts = products.filter(p => p.status === 'Active' || p.inventory?.inStock).length;
    const lowStockProducts = products.filter(p => {
      const stock = p.stock || p.inventory?.quantity || 0;
      return stock < 10 && stock > 0;
    }).length;
    const featuredProducts = products.filter(p => p.featured).length;
    const totalValue = products.reduce((sum, p) => {
      const stock = p.stock || p.inventory?.quantity || 0;
      return sum + (p.price * stock);
    }, 0);
    const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;
    
    return {
      totalProducts: totalProductsCount,
      activeProducts,
      lowStockProducts,
      featuredProducts,
      totalValue,
      avgPrice,
      activePercentage: totalProductsCount > 0 ? (activeProducts / totalProductsCount) * 100 : 0,
    };
  }, [products]);

  // Filter products with memoization
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Apply filters
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => {
        if (statusFilter === 'Active') return p.status === 'Active' || p.inventory?.inStock;
        if (statusFilter === 'Draft') return p.status === 'Draft';
        return p.status === statusFilter;
      });
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
  }, [debouncedSearchTerm, selectedCategory, statusFilter, brandFilter, featuredFilter, priceRangeFilter, sortBy, sortOrder, products]);

  // Reset to page 1 when filters change and refetch
  useEffect(() => {
    const filters: any = {};
    if (debouncedSearchTerm) filters.search = debouncedSearchTerm;
    if (selectedCategory !== "all") filters.category = selectedCategory;
    if (statusFilter !== "all") filters.status = statusFilter;
    if (brandFilter !== "all") filters.brand = brandFilter;
    if (featuredFilter === "featured") filters.isFeatured = true;
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder;
    
    fetchProducts(1, itemsPerPage, filters);
  }, [debouncedSearchTerm, selectedCategory, statusFilter, brandFilter, featuredFilter, sortBy, sortOrder, itemsPerPage]);

  // Pagination
  const paginatedItems = filteredProducts.slice(0, itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredProducts.length);
  const totalItems = filteredProducts.length;
  
  const goToPage = (page: number) => {
    fetchProducts(page, itemsPerPage);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleCreateProduct = async (data: any) => {
    try {
      await createProduct(data);
      setProductFormOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleUpdateProduct = async (data: any) => {
    if (editingProduct) {
      try {
        const productId = editingProduct._id || editingProduct.id;
        await updateProduct(productId, data);
        setEditingProduct(null);
        setProductFormOpen(false);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        setProductToDelete(null);
        setDeleteDialogOpen(false);
      } catch (error) {
        // Error handled in hook
      }
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

  const toggleProductSelection = (product: any) => {
    const productId = product._id || product.id;
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllProducts = () => {
    setSelectedProducts(
      selectedProducts.length === paginatedItems.length ? [] : paginatedItems.map(p => p._id || p.id)
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) return;

    try {
      switch (action) {
        case 'activate':
          await Promise.all(selectedProducts.map(id => updateProduct(id, { status: 'active', inStock: true })));
          toast({ title: "Products activated", description: `${selectedProducts.length} products activated` });
          break;
        case 'deactivate':
          await Promise.all(selectedProducts.map(id => updateProduct(id, { status: 'inactive', inStock: false })));
          toast({ title: "Products deactivated", description: `${selectedProducts.length} products deactivated` });
          break;
        case 'delete':
          await bulkDeleteProducts(selectedProducts);
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
      // Use featured field which matches the Product model
      await updateProduct(productId, { featured: !currentFeatured });
      toast({
        title: currentFeatured ? "Removed from featured" : "Added to featured",
        description: `Product ${currentFeatured ? 'removed from' : 'added to'} featured list`,
      });
    } catch (error) {
      // Error handled in hook
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
    const { _id, id, __v, createdAt, updatedAt, ...productData } = product;
    const duplicatedProduct = {
      ...productData,
      name: `${product.name} (Copy)`,
    };
    
    try {
      await createProduct(duplicatedProduct);
      toast({
        title: "Product duplicated",
        description: "Product has been successfully duplicated",
      });
    } catch (error) {
      // Error handled in hook
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
                <p className="text-2xl font-bold">{products.length > 0 ? Math.round(products.reduce((sum, p) => sum + (p.stock || p.inventory?.quantity || 0), 0) / products.length) : 0}</p>
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
                  onToggleProduct={(id) => {
                    const product = paginatedItems.find(p => (p._id || p.id) === id);
                    if (product) toggleProductSelection(product);
                  }}
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
