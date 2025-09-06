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

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            PedalBharat Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert tips, guides, and stories from the world of cycling in India. 
            Learn from professionals and passionate cyclists.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={category === 'All' ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blogPosts.filter(post => post.featured).map((post) => (
              <Card key={post.id} className="group cursor-pointer transition-all duration-300 hover:shadow-hover bg-gradient-card border-border/50">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-IN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <Card key={post.id} className="group cursor-pointer transition-all duration-300 hover:shadow-card bg-card border-border/50">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{post.category}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-gradient-primary rounded-lg p-8 text-center text-primary-foreground">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6 opacity-90">Get the latest cycling tips, product reviews, and route guides delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md text-foreground bg-background border border-border"
            />
            <Button variant="secondary" className="bg-background text-foreground hover:bg-background/90">
              Subscribe
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;