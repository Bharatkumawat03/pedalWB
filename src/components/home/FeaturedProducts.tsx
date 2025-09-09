import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product/ProductCard';
import productService from '@/services/productService';
import { ArrowRight, TrendingUp, Loader2 } from 'lucide-react';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await productService.getFeaturedProducts(8);
        setFeaturedProducts(products);
      } catch (err: any) {
        console.error('Error fetching featured products:', err);
        setError(err.message);
        // Fallback to empty array if API fails
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Trending Now
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground">
              Handpicked gear that's making waves in the cycling community
            </p>
          </div>
          
          <Link to="/shop" className="hidden md:block">
            <Button variant="outline" className="border-border hover:border-primary hover:bg-primary/5">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="bg-muted h-48 rounded-md mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-muted h-6 rounded w-1/2"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">Unable to load featured products</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No featured products available</p>
            </div>
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))
          )}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center md:hidden">
          <Link to="/shop">
            <Button variant="outline" className="border-border hover:border-primary hover:bg-primary/5 px-8">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;