import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCategory, setPriceRange, toggleBrand, setSortBy, setSearch } from '@/store/slices/filtersSlice';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import { products as fallbackProducts, categories as fallbackCategories, brands as fallbackBrands } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List } from 'lucide-react';

const Shop = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalProducts: 0 });
  const [useBackend, setUseBackend] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts({ page: 1, limit: 24 })
        ]);
        
        setCategories([{ _id: 'all', name: 'All Categories', slug: 'all' }, ...categoriesData]);
        // productsData is already the ProductsResponse object with data and pagination
        setProducts(productsData.data || []);
        setPagination({
          page: productsData.pagination?.current || 1,
          total: productsData.pagination?.total || 1,
          totalProducts: productsData.pagination?.totalProducts || productsData.pagination?.count || 0
        });
        
        // Extract unique brands from products
        const uniqueBrands = [...new Set((productsData.data || []).map((p: any) => p.brand).filter(Boolean))];
        setBrands(uniqueBrands.sort());
        setUseBackend(true);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message);
        // Fallback to static data
        setCategories([{ id: 'all', name: 'All Categories' }, ...fallbackCategories]);
        setProducts(fallbackProducts);
        setBrands(fallbackBrands.sort());
        setUseBackend(false);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch products when filters change (backend mode)
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (loading || !useBackend) return; // Skip if initial load is still happening or using fallback
      
      try {
        // Map frontend sortBy values to backend format
        const sortByMap: Record<string, string> = {
          'price-low': 'price-asc',
          'price-high': 'price-desc',
          'name': 'name-asc',
          'rating': 'rating',
          'newest': 'newest'
        };
        
        const filterParams: any = {
          page: 1,
          limit: 24,
          sortBy: sortByMap[filters.sortBy] || filters.sortBy || 'newest',
        };
        
        if (filters.category !== 'all') {
          filterParams.category = filters.category;
        }
        if (filters.search) {
          filterParams.search = filters.search;
        }
        if (filters.brands.length > 0) {
          filterParams.brand = filters.brands[0]; // Backend expects single brand, not array
        }
        if (filters.priceRange[0] > 0) {
          filterParams.minPrice = filters.priceRange[0];
        }
        if (filters.priceRange[1] < 250000) {
          filterParams.maxPrice = filters.priceRange[1];
        }
        
        const productsData = await productService.getProducts(filterParams);
        // productsData is already the ProductsResponse object with data and pagination
        setProducts(productsData.data || []);
        setPagination({
          page: productsData.pagination?.current || 1,
          total: productsData.pagination?.total || 1,
          totalProducts: productsData.pagination?.totalProducts || productsData.pagination?.count || 0
        });
      } catch (err: any) {
        console.error('Error fetching filtered products:', err);
      }
    };

    fetchFilteredProducts();
  }, [filters, loading, useBackend]);

  // Filter and sort products (frontend mode fallback)
  const filteredProducts = useBackend ? products : fallbackProducts
    .filter(product => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }
      
      // Search filter
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          const aRating = a.rating?.average || a.rating || 0;
          const bRating = b.rating?.average || b.rating || 0;
          return bRating - aRating;
        case 'newest':
          return b.isNew ? 1 : -1;
        default:
          return 0;
      }
    });

  const displayProducts = useBackend ? products : filteredProducts;

  return (
    <div className="min-h-screen bg-background py-4 md:py-6">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">Shop Cycling Gear</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Discover premium cycling equipment from the world's leading brands
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-4 md:mb-6 space-y-3">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="pl-10 bg-muted/50"
              />
            </div>

            {/* Sort */}
            <Select value={filters.sortBy} onValueChange={(value: any) => dispatch(setSortBy(value))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {loading ? (
                "Loading products..."
              ) : (
                `Showing ${displayProducts.length} of ${useBackend ? pagination.totalProducts : fallbackProducts.length} products`
              )}
            </p>
            <div className="flex items-center gap-2">
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="gap-2">
                  {categories.find(c => (c._id === filters.category || c.slug === filters.category || c.id === filters.category))?.name}
                  <button
                    onClick={() => dispatch(setCategory('all'))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.brands.map(brand => (
                <Badge key={brand} variant="secondary" className="gap-2">
                  {brand}
                  <button
                    onClick={() => dispatch(toggleBrand(brand))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 md:gap-6">
          {/* Sidebar Filters */}
          <aside className={`w-56 space-y-3 md:space-y-4 ${showFilters ? 'block' : 'hidden'} md:block`}>
            {/* Categories */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <button
                  onClick={() => dispatch(setCategory('all'))}
                  className={`block w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                    filters.category === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  All Categories
                </button>
                {categories.slice(1).map(category => (
                  <button
                    key={category._id || category.id}
                    onClick={() => dispatch(setCategory(category.slug || category._id || category.id))}
                    className={`block w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                      filters.category === (category.slug || category._id || category.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Price Range */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Price Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => dispatch(setPriceRange(value as [number, number]))}
                  max={250000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{filters.priceRange[0].toLocaleString()}</span>
                  <span>₹{filters.priceRange[1].toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">Min Price</label>
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        if (value <= filters.priceRange[1]) {
                          dispatch(setPriceRange([value, filters.priceRange[1]]));
                        }
                      }}
                      className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
                      min="0"
                      max={filters.priceRange[1]}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">Max Price</label>
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 250000;
                        if (value >= filters.priceRange[0]) {
                          dispatch(setPriceRange([filters.priceRange[0], value]));
                        }
                      }}
                      className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
                      min={filters.priceRange[0]}
                      max="250000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brands */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Brands</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={filters.brands.includes(brand)}
                      onCheckedChange={() => dispatch(toggleBrand(brand))}
                    />
                    <label
                      htmlFor={brand}
                      className="text-sm text-foreground cursor-pointer"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {loading ? (
              <div className={`grid gap-3 md:gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                  : 'grid-cols-1'
              }`}>
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="bg-card rounded-lg p-3 md:p-6 animate-pulse">
                    <div className="bg-muted h-32 md:h-48 rounded-md mb-2 md:mb-4"></div>
                    <div className="bg-muted h-3 md:h-4 rounded mb-1 md:mb-2"></div>
                    <div className="bg-muted h-3 md:h-4 rounded w-3/4 mb-1 md:mb-2"></div>
                    <div className="bg-muted h-4 md:h-6 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error && useBackend ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-foreground mb-2">Unable to load products</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              <div className={`grid gap-3 md:gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                  : 'grid-cols-1'
              }`}>
                {displayProducts.map(product => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
