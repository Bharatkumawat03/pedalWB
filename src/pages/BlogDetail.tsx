import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';

const blogPosts = [
  { 
    id: 1, 
    title: 'Complete Guide to Choosing Your First Road Bike', 
    content: `Choosing your first road bike is an exciting milestone in any cyclist's journey. This comprehensive guide will walk you through everything you need to know to make an informed decision.

**Frame Material Considerations**

The frame is the heart of your bike, and material choice significantly impacts performance, comfort, and price. Let's explore your options:

*Aluminum Frames*
Aluminum frames offer excellent value for beginners. They're lightweight, durable, and provide a responsive ride feel. Modern aluminum alloys have virtually eliminated the harsh ride quality of older aluminum bikes. Expect to pay ₹30,000-₹80,000 for a quality aluminum road bike.

*Carbon Fiber Frames*
Carbon fiber represents the pinnacle of frame technology. These frames are incredibly light, can be engineered for specific ride characteristics, and offer excellent vibration damping. However, they come at a premium, typically starting around ₹80,000 and going up to ₹5,00,000+ for professional-grade frames.

*Steel Frames*
Steel offers a classic ride feel with natural vibration damping and durability that can last decades. Modern steel alloys like chromoly provide excellent strength-to-weight ratios. Steel bikes typically range from ₹40,000-₹1,50,000.

**Component Groups Explained**

The drivetrain is your bike's transmission system, and understanding the hierarchy helps in making informed choices:

*Shimano Hierarchy (Budget to Premium)*
- Claris (8-speed): Entry-level, perfect for beginners
- Sora (9-speed): Step up in smoothness and durability
- Tiagra (10-speed): Excellent mid-range option
- 105 (11-speed): Professional-level performance at enthusiast price
- Ultegra (11/12-speed): Race-ready components
- Dura-Ace (11/12-speed): Professional racing standard

**Budget Planning**

*₹30,000-₹50,000*
Entry-level bikes with aluminum frames and basic component groups. Perfect for recreational riding and fitness.

*₹50,000-₹1,00,000*
Mid-range bikes with better components, lighter frames, and improved durability. Suitable for regular training and longer rides.

*₹1,00,000+*
High-performance bikes with carbon frames and advanced components. Ideal for serious cyclists and competitive racing.

**Essential Features for Beginners**

*Gearing*
Look for a compact crankset (50/34t) paired with an 11-28t or 11-32t cassette. This provides easier climbing gears while maintaining speed on flats.

*Brakes*
Rim brakes are traditional and lighter, while disc brakes offer superior stopping power in all conditions. Disc brakes are becoming standard on most new bikes.

*Wheels*
Quality wheels make a significant difference in ride quality. Look for wheels with sealed bearings and quality hubs.

**Making Your Decision**

The best bike is one that fits your body, budget, and riding goals. Don't feel pressured to buy the most expensive option – a well-fitted, properly maintained entry-level bike will serve you better than an ill-fitting premium bike.

Remember, your first road bike likely won't be your last. Start with something that gets you riding regularly, and upgrade as your skills and preferences develop.`, 
    author: 'Rajesh Kumar', 
    date: '2024-01-15', 
    readTime: '12 min read', 
    category: 'Beginner Guide', 
    image: '/src/assets/hero-cycling.jpg' 
  },
  { 
    id: 2, 
    title: 'Maintenance Tips for Monsoon Cycling in India', 
    content: `The monsoon season presents unique challenges for cyclists in India. With proper preparation and maintenance, you can continue enjoying your rides while protecting your bike from the elements.

**Pre-Monsoon Preparation**

*Chain and Drivetrain*
Before the rains arrive, thoroughly clean and degrease your chain, cassette, and chainrings. Apply a high-quality wet lube specifically designed for rainy conditions. Wet lubes repel water better than dry lubes but attract more dirt, requiring more frequent cleaning.

*Brake System Overhaul*
Inspect brake pads for wear and replace if necessary. Check brake cables for fraying or corrosion. Consider upgrading to disc brakes if you frequently ride in wet conditions – they provide consistent stopping power regardless of weather.

*Tire Selection*
Switch to tires with better wet weather grip. Look for compounds that remain supple in wet conditions and tread patterns that channel water away from the contact patch. Slightly lower tire pressure can improve grip on wet surfaces.

**Daily Maintenance Routine**

*Post-Ride Cleaning*
After every wet ride, wipe down your bike with a clean, dry cloth. Pay special attention to the chain, cassette, and brake components. Remove any debris lodged in the drivetrain.

*Chain Care*
In monsoon conditions, clean and lube your chain every 100-150km or after particularly wet rides. Use a chain cleaning tool or degreaser to remove grime, then apply wet lube sparingly – excess lube attracts dirt.

*Brake Inspection*
Check brake pads regularly during monsoon season. Wet conditions cause faster pad wear, and contaminated pads can reduce braking performance significantly.

**Water Protection Strategies**

*Frame Protection*
Apply a quality bike polish or protective spray to your frame before the monsoon season. This creates a barrier against water and makes cleaning easier.

*Component Covers*
Consider using protective covers for expensive components like electronic shifting systems or high-end wheelsets during storage.

*Proper Storage*
Store your bike in a dry, ventilated area. If you must store it in a humid environment, use silica gel packets or a dehumidifier to control moisture levels.

**Long-term Monsoon Care**

*Professional Servicing*
Schedule a professional tune-up before and after monsoon season. This ensures your bike is properly prepared and any weather-related damage is addressed.

*Component Replacement Schedule*
Plan to replace chains, cassettes, and brake pads more frequently during active monsoon riding. Keep spare components on hand.

With proper care and preparation, you can keep your bike in excellent condition throughout the wettest months of the year.`, 
    author: 'Priya Sharma', 
    date: '2024-01-12', 
    readTime: '8 min read', 
    category: 'Maintenance', 
    image: '/src/assets/wheel.jpg' 
  },
  {
    id: 3,
    title: 'Top 10 Cycling Routes in the Western Ghats',
    content: `Discover breathtaking cycling routes through the Western Ghats, from beginner-friendly paths to challenging climbs. We highlight our favorite routes, including elevation profiles, water stops, and safety tips. From Ooty's rolling hills to Mahabaleshwar's iconic viewpoints, there's a ride for everyone.`,
    author: 'Arjun Patel',
    date: '2024-01-10',
    readTime: '12 min read',
    category: 'Travel',
    image: '/src/assets/helmet.jpg'
  },
  {
    id: 4,
    title: 'Understanding Bike Gearing Systems',
    content: `From 1x to 2x, cassette ranges, and gear inches—understand how gearing affects cadence and climbing, and how to select ratios for your terrain.`,
    author: 'Sneha Singh',
    date: '2024-01-08',
    readTime: '10 min read',
    category: 'Technical',
    image: '/src/assets/derailleur.jpg'
  },
  {
    id: 5,
    title: 'Safety First: Essential Gear for Urban Cycling',
    content: `Helmets, lights, reflective clothing, bells, and mirrors—small upgrades that make a big difference in city traffic. We also outline a night-riding checklist.`,
    author: 'Vikram Reddy',
    date: '2024-01-05',
    readTime: '7 min read',
    category: 'Safety',
    image: '/src/assets/helmet.jpg'
  },
  {
    id: 6,
    title: 'Nutrition and Hydration for Long Distance Rides',
    content: `Carbs, electrolytes, and timing—what to eat before, during, and after long rides. Includes a sample 100km fueling plan.`,
    author: 'Dr. Meera Nair',
    date: '2024-01-03',
    readTime: '9 min read',
    category: 'Health',
    image: '/src/assets/wheel.jpg'
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
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>') }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetail;