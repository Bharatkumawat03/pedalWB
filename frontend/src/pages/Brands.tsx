import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleBrand, resetFilters } from '@/store/slices/filtersSlice';
import { brands } from '@/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Brands = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBrandClick = (brand: string) => {
    dispatch(resetFilters());
    dispatch(toggleBrand(brand));
    navigate('/shop');
  };

  const featuredBrands = [
    { name: 'Shimano', description: 'World leader in cycling components', category: 'Components' },
    { name: 'SRAM', description: 'Innovation in drivetrain technology', category: 'Drivetrain' },
    { name: 'Specialized', description: 'Premium bikes and accessories', category: 'Bikes' },
    { name: 'Trek', description: 'Quality bicycles for every rider', category: 'Bikes' },
    { name: 'Garmin', description: 'GPS and cycling computers', category: 'Electronics' },
    { name: 'Continental', description: 'High-performance tires', category: 'Wheels' },
  ];

  return (
    <div className="min-h-screen bg-background py-4 md:py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Shop by Brand
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Explore products from the world's leading cycling brands. Each brand represents 
            years of innovation and commitment to cycling excellence.
          </p>
        </div>

        {/* Featured Brands */}
        <section className="mb-8 md:mb-10">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-5">Featured Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {featuredBrands.map((brand) => (
              <Card 
                key={brand.name}
                className="group cursor-pointer transition-all duration-300 hover:shadow-hover hover:scale-105 bg-gradient-card border-border/50"
                onClick={() => handleBrandClick(brand.name)}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {brand.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">{brand.category}</Badge>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">{brand.description}</p>
                  <Button variant="outline" size="sm" className="w-full text-xs md:text-sm h-8">
                    View Products
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Brands Grid */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-5">All Brands</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
            {brands.map((brand) => (
              <Card 
                key={brand}
                className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-105 bg-card border-border/50"
                onClick={() => handleBrandClick(brand)}
              >
                <CardContent className="p-2 md:p-3 text-center">
                  <h3 className="text-xs md:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {brand}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Brand Statistics */}
        <section className="mt-8 md:mt-10 bg-gradient-card rounded-lg p-4 md:p-6">
          <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
            <div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1">{brands.length}+</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Premium Brands</p>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1">50+</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Years of Combined Experience</p>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1">1000+</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Products Available</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Brands;