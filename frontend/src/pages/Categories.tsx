import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCategory } from '@/store/slices/filtersSlice';
import categoryService from '@/services/categoryService';
import { categories } from '@/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const apiCategories = await categoryService.getCategories();
        // Transform API categories to match expected format
        const transformedCategories = apiCategories.map((cat: any) => ({
          id: cat._id || cat.id,
          name: cat.name,
          icon: cat.icon || '🏷️',
          slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')
        }));
        setCategoriesList(transformedCategories);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        // Fallback to static data
        setCategoriesList(categories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string, slug?: string) => {
    dispatch(setCategory(categoryId));
    if (slug) {
      navigate(`/category/${slug}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 md:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">
            Shop by Category
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Discover our complete range of cycling equipment organized by categories. 
            From high-performance bikes to essential accessories.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {categoriesList.filter(cat => cat.id !== 'all').map((category) => (
                <Card 
                  key={category.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-hover hover:scale-105 bg-gradient-card border-border/50"
                  onClick={() => handleCategoryClick(category.id, category.slug)}
                >
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="text-3xl md:text-4xl lg:text-5xl mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-sm md:text-base lg:text-lg font-semibold text-foreground mb-1.5 md:mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      View Products
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Featured Categories */}
        <section className="mt-8 md:mt-12">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4 md:mb-6 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <div className="text-2xl md:text-3xl">🚲</div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold">Bicycles</h3>
                    <p className="text-xs md:text-sm opacity-90">Complete bikes for every riding style</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <div className="text-2xl md:text-3xl">⚙️</div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-foreground">Components</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">High-performance bike components</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-accent text-accent-foreground">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <div className="text-2xl md:text-3xl">🦺</div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold">Safety Gear</h3>
                    <p className="text-xs md:text-sm opacity-90">Essential protection equipment</p>
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