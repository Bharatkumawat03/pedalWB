import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';
import { ArrowRight, Zap } from 'lucide-react';

const DealsSection = () => {
  // Get products with potential discount (in real app, these would have discount prices)
  const dealsProducts = products
    .filter(product => product.inStock)
    .slice(10, 15);

  return (
    <section className="py-8 md:py-12 lg:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-12">
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs md:text-sm animate-pulse">
                Limited Time
              </Badge>
            </div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-4">
              Hot Deals
            </h2>
            <p className="text-sm md:text-lg lg:text-xl text-muted-foreground hidden md:block">
              Don't miss out on these amazing offers
            </p>
          </div>
          
          <Link to="/shop" className="hidden md:block">
            <Button variant="outline" className="border-border hover:border-primary hover:bg-primary/5">
              View All Deals
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
          {dealsProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center md:hidden">
          <Link to="/shop">
            <Button variant="outline" size="sm" className="border-border hover:border-primary hover:bg-primary/5 px-6">
              View All Deals
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
