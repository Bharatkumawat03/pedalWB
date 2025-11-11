import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product/ProductCard';
import productService from '@/services/productService';
import { products } from '@/data/products';
import { ArrowRight, Award, Loader2 } from 'lucide-react';

const BestSellers = () => {
  const [bestSellerProducts, setBestSellerProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiProducts = await productService.getBestSellers(5);
        setBestSellerProducts(apiProducts || []);
      } catch (err: any) {
        console.error('Error fetching best sellers:', err);
        setError(err.message);
        // Fallback to static data if API fails
        const staticBestSellers = products
          .filter(product => product.inStock)
          .slice(5, 10);
        setBestSellerProducts(staticBestSellers);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <section className="py-8 md:py-12 lg:py-14 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-12">
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
              <Award className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs md:text-sm">
                Most Popular
              </Badge>
            </div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-4">
              Best Sellers
            </h2>
            <p className="text-sm md:text-lg lg:text-xl text-muted-foreground hidden md:block">
              Top picks loved by our cycling community
            </p>
          </div>
          
          <Link to="/shop" className="hidden md:block">
            <Button variant="outline" className="border-border hover:border-primary hover:bg-primary/5">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading best sellers...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-destructive mb-4">
              <h3 className="text-xl font-semibold mb-2">Unable to Load Products</h3>
              <p className="text-muted-foreground">Unable to load best sellers. Please try again later.</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && bestSellerProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bestSellerProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-muted-foreground">
              <h3 className="text-xl font-semibold mb-2">No Best Sellers</h3>
              <p className="text-muted-foreground">No best selling products available at the moment.</p>
            </div>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="text-center md:hidden">
          <Link to="/shop">
            <Button variant="outline" size="sm" className="border-border hover:border-primary hover:bg-primary/5 px-6">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
