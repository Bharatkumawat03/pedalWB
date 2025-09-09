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
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Shop by Brand
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore products from the world's leading cycling brands. Each brand represents 
            years of innovation and commitment to cycling excellence.
          </p>
        </div>

        {/* Featured Brands */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Featured Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBrands.map((brand) => (
              <Card 
                key={brand.name}
                className="group cursor-pointer transition-all duration-300 hover:shadow-hover hover:scale-105 bg-gradient-card border-border/50"
                onClick={() => handleBrandClick(brand.name)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {brand.name}
                    </h3>
                    <Badge variant="outline">{brand.category}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{brand.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Products
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Brands Grid */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-8">All Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Card 
                key={brand}
                className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-105 bg-card border-border/50"
                onClick={() => handleBrandClick(brand)}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {brand}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Brand Statistics */}
        <section className="mt-16 bg-gradient-card rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">{brands.length}+</h3>
              <p className="text-muted-foreground">Premium Brands</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">50+</h3>
              <p className="text-muted-foreground">Years of Combined Experience</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">1000+</h3>
              <p className="text-muted-foreground">Products Available</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Brands;