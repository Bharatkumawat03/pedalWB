import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/data/products';
import { ArrowRight } from 'lucide-react';
import derailleurImg from '@/assets/derailleur.jpg';
import wheelImg from '@/assets/wheel.jpg';
import helmetImg from '@/assets/helmet.jpg';

const FeaturedCategories = () => {
  const featuredCategories = [
    {
      id: 'drivetrain',
      name: 'Drivetrain Systems',
      description: 'Precision shifting for every terrain',
      image: derailleurImg,
      itemCount: '200+',
      isNew: true,
    },
    {
      id: 'wheels',
      name: 'Wheels & Tires',
      description: 'Roll with confidence and speed',
      image: wheelImg,
      itemCount: '150+',
      isNew: false,
    },
    {
      id: 'accessories',
      name: 'Smart Accessories',
      description: 'Technology meets performance',
      image: helmetImg,
      itemCount: '180+',
      isNew: true,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our curated collection of premium cycling gear, designed for riders who demand excellence
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredCategories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group block"
            >
              <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300 hover:shadow-hover">
                {/* Category Image */}
                <div className="aspect-[4/3] overflow-hidden bg-muted/30">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>

                {/* Category Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {category.description}
                      </p>
                    </div>
                    {category.isNew && (
                      <Badge className="bg-primary text-primary-foreground">NEW</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {category.itemCount} items
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Categories Button */}
        <div className="text-center">
          <Link to="/categories">
            <Button 
              variant="outline" 
              size="lg"
              className="border-border hover:border-primary hover:bg-primary/5 px-8"
            >
              View All Categories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;