import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product/ProductCard';
import productService from '@/services/productService';
import { products } from '@/data/products';
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
        // Fallback to static data if API fails
        const staticFeaturedProducts = products.filter(product => product.isFeatured);
        setFeaturedProducts(staticFeaturedProducts);
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
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Featured Collection
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Top Picks for Cyclists
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Handpicked products that deliver exceptional performance and reliability. 
              Trusted by professionals and enthusiasts worldwide.
            </p>
          </div>
          
          <Link to="/shop" className="hidden md:block">
            <Button variant="outline" className="group">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading featured products...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && featuredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Unable to load featured products. Please try again later.</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="text-center md:hidden">
          <Link to="/shop">
            <Button className="group">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">2000+</div>
            <div className="text-sm text-muted-foreground">Products Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">50K+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">24/7</div>
            <div className="text-sm text-muted-foreground">Customer Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">Free</div>
            <div className="text-sm text-muted-foreground">Shipping ₹2000+</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
