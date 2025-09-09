import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Search, User, ArrowRight } from 'lucide-react';

const News = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Company News', 'Product Updates', 'Industry News', 'Events', 'Partnerships'];

  const newsArticles = [
    {
      title: 'PedalBharat Launches Revolutionary Smart Helmet with Integrated GPS',
      category: 'Product Updates',
      date: 'December 20, 2024',
      readTime: '3 min read',
      author: 'Priya Sharma',
      summary: 'Introducing cutting-edge safety technology that combines protection with smart navigation features for modern cyclists.',
      image: '/placeholder.svg',
      featured: true
    },
    {
      title: 'Indian Cycling Market Expected to Grow 15% in 2025',
      category: 'Industry News',
      date: 'December 18, 2024',
      readTime: '5 min read',
      author: 'Cycling Industry Report',
      summary: 'Analysis of market trends and growth drivers in the Indian cycling ecosystem.',
      image: '/placeholder.svg',
      featured: false
    },
    {
      title: 'PedalBharat Sponsors National Cycling Championship 2024',
      category: 'Events',
      date: 'December 15, 2024',
      readTime: '2 min read',
      author: 'Events Team',
      summary: 'Supporting India\'s top cycling talent with premium gear and infrastructure.',
      image: '/placeholder.svg',
      featured: false
    },
    {
      title: 'New Sustainable Packaging Initiative Reduces Carbon Footprint by 40%',
      category: 'Company News',
      date: 'December 12, 2024',
      readTime: '4 min read',
      author: 'Sustainability Team',
      summary: 'Environmental commitment through innovative eco-friendly packaging solutions.',
      image: '/placeholder.svg',
      featured: false
    },
    {
      title: 'Partnership with Local Bike Shops Expands Service Network',
      category: 'Partnerships',
      date: 'December 10, 2024',
      readTime: '3 min read',
      author: 'Business Development',
      summary: 'Strategic alliance brings professional bike servicing closer to customers nationwide.',
      image: '/placeholder.svg',
      featured: false
    },
    {
      title: 'Customer Success Stories: From Beginner to Pro Cyclist',
      category: 'Company News',
      date: 'December 8, 2024',
      readTime: '6 min read',
      author: 'Customer Success',
      summary: 'Inspiring journeys of cyclists who transformed their lives with the right gear and community support.',
      image: '/placeholder.svg',
      featured: false
    }
  ];

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Latest News</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Stay <span className="text-primary">Informed</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get the latest updates on products, industry trends, and cycling culture from PedalBharat.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-muted/50"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && selectedCategory === 'All' && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured Story</h2>
            <Card className="overflow-hidden hover:shadow-hover transition-shadow duration-300">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="bg-muted/30 min-h-[300px] flex items-center justify-center">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge variant="secondary">{featuredArticle.category}</Badge>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {featuredArticle.date}
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredArticle.readTime}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors cursor-pointer">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">{featuredArticle.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <Button>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Articles Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
          </h2>
          
          {regularArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-hover transition-shadow duration-300 cursor-pointer group">
                  <div className="bg-muted/30 h-48 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">{article.category}</Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{article.summary}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-muted/20 rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for the latest cycling news and product updates.
          </p>
          <div className="flex max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="rounded-r-none border-r-0 bg-background"
            />
            <Button className="rounded-l-none">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;