import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Complete Guide to Choosing Your First Road Bike',
      excerpt: 'Everything you need to know about selecting the perfect road bike for beginners. From frame materials to component groups.',
      author: 'Rajesh Kumar',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'Beginner Guide',
      image: '/src/assets/hero-cycling.jpg',
      featured: true
    },
    {
      id: 2,
      title: 'Maintenance Tips for Monsoon Cycling in India',
      excerpt: 'Keep your bike in top condition during the rainy season with these essential maintenance tips and tricks.',
      author: 'Priya Sharma',
      date: '2024-01-12',
      readTime: '6 min read',
      category: 'Maintenance',
      image: '/src/assets/wheel.jpg',
      featured: false
    },
    {
      id: 3,
      title: 'Top 10 Cycling Routes in the Western Ghats',
      excerpt: 'Discover breathtaking cycling routes through the Western Ghats, from beginner-friendly paths to challenging climbs.',
      author: 'Arjun Patel',
      date: '2024-01-10',
      readTime: '12 min read',
      category: 'Travel',
      image: '/src/assets/helmet.jpg',
      featured: true
    },
    {
      id: 4,
      title: 'Understanding Bike Gearing Systems',
      excerpt: 'A comprehensive guide to different gearing systems, when to use them, and how to choose the right setup.',
      author: 'Sneha Singh',
      date: '2024-01-08',
      readTime: '10 min read',
      category: 'Technical',
      image: '/src/assets/derailleur.jpg',
      featured: false
    },
    {
      id: 5,
      title: 'Safety First: Essential Gear for Urban Cycling',
      excerpt: 'Stay safe on busy Indian roads with our guide to essential safety equipment for urban cyclists.',
      author: 'Vikram Reddy',
      date: '2024-01-05',
      readTime: '7 min read',
      category: 'Safety',
      image: '/src/assets/helmet.jpg',
      featured: false
    },
    {
      id: 6,
      title: 'Nutrition and Hydration for Long Distance Rides',
      excerpt: 'Fuel your body properly for endurance cycling with our nutrition and hydration strategies.',
      author: 'Dr. Meera Nair',
      date: '2024-01-03',
      readTime: '9 min read',
      category: 'Health',
      image: '/src/assets/wheel.jpg',
      featured: false
    }
  ];

  const categories = ['All', 'Beginner Guide', 'Maintenance', 'Travel', 'Technical', 'Safety', 'Health'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFeatured = blogPosts.filter(post => post.featured && (selectedCategory === 'All' || post.category === selectedCategory));
  const filteredRegular = blogPosts.filter(post => !post.featured && (selectedCategory === 'All' || post.category === selectedCategory));
  
  return (
    <div className="min-h-screen bg-background py-4 md:py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            PedalBharat Blog
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Expert tips, guides, and stories from the world of cycling in India. 
            Learn from professionals and passionate cyclists.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6 justify-center">
          {categories.map((category) => (
            <Badge 
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs md:text-sm"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Posts */}
        <section className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {filteredFeatured.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-hover bg-gradient-card border-border/50">
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="p-3 md:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground gap-2 md:gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString('en-IN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4 pt-0">
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 md:gap-2 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground text-xs h-7 md:h-8">
                        Read More <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* All Posts */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {filteredRegular.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-card bg-card border-border/50">
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="p-2 md:p-3 pb-1 md:pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="p-2 md:p-3 pt-0">
                    <p className="text-xs text-muted-foreground mb-2 md:mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate">{post.author}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-8 md:mt-10 bg-gradient-primary rounded-lg p-4 md:p-6 text-center text-primary-foreground">
          <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Stay Updated</h2>
          <p className="text-xs md:text-sm mb-4 md:mb-5 opacity-90">Get the latest cycling tips, product reviews, and route guides delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-1.5 md:py-2 text-sm rounded-md text-foreground bg-background border border-border"
            />
            <Button variant="secondary" className="bg-background text-foreground hover:bg-background/90 text-sm h-8 md:h-9">
              Subscribe
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;