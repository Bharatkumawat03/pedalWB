import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCategory } from '@/store/slices/filtersSlice';
import { categories } from '@/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCategoryClick = (categoryId: string) => {
    dispatch(setCategory(categoryId));
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our complete range of cycling equipment organized by categories. 
            From high-performance bikes to essential accessories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.filter(cat => cat.id !== 'all').map((category) => (
            <Card 
              key={category.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-hover hover:scale-105 bg-gradient-card border-border/50"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <Badge variant="secondary" className="text-sm">
                  View Products
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Categories */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🚲</div>
                  <div>
                    <h3 className="text-xl font-semibold">Bicycles</h3>
                    <p className="text-sm opacity-90">Complete bikes for every riding style</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">⚙️</div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Components</h3>
                    <p className="text-sm text-muted-foreground">High-performance bike components</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-accent text-accent-foreground">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🦺</div>
                  <div>
                    <h3 className="text-xl font-semibold">Safety Gear</h3>
                    <p className="text-sm opacity-90">Essential protection equipment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;