import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';

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
    content: `Getting started with road cycling can be overwhelming. In this comprehensive guide, we cover frame materials, geometry, gearing, wheelsets, and fit so you can ride comfortably and confidently. We’ll also share a sample budget and upgrade path for your first year of riding.`
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
    content: `Rain, mud, and grit demand more frequent cleaning and lubrication. Learn a simple pre-ride and post-ride checklist, the right lubes for wet conditions, and how to protect bearings and brake rotors.`
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
    content: `We highlight our favorite routes, including elevation profiles, water stops, and safety tips. From Ooty’s rolling hills to Mahabaleshwar’s iconic viewpoints, there’s a ride for everyone.`
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
    content: `From 1x to 2x, cassette ranges, and gear inches—understand how gearing affects cadence and climbing, and how to select ratios for your terrain.`
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
    content: `Helmets, lights, reflective clothing, bells, and mirrors—small upgrades that make a big difference in city traffic. We also outline a night-riding checklist.`
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
    content: `Carbs, electrolytes, and timing—what to eat before, during, and after long rides. Includes a sample 100km fueling plan.`
  }
];

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => String(p.id) === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article not found</h1>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        </Button>

        <Card className="overflow-hidden">
          <div className="aspect-video bg-muted">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{post.category}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString('en-IN')}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" /> {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" /> {post.author}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-7 whitespace-pre-line">{post.content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetail;
