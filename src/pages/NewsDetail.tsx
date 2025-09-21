import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';

const newsArticles = [
  { 
    id: 1, 
    title: 'PedalBharat Launches Revolutionary Smart Helmet with Integrated GPS', 
    category: 'Product Updates', 
    date: 'December 20, 2024', 
    readTime: '5 min read', 
    author: 'Priya Sharma', 
    summary: 'Introducing cutting-edge safety technology that combines protection with smart navigation features for modern cyclists.', 
    image: '/placeholder.svg', 
    content: `PedalBharat today announced the launch of its revolutionary Smart Helmet Pro, a game-changing safety device that integrates advanced GPS navigation, crash detection, and communication features specifically designed for Indian cycling conditions.

**Advanced Safety Features**

The Smart Helmet Pro represents a significant leap forward in cycling safety technology. At its core, the helmet features a sophisticated crash detection system that utilizes multiple accelerometers and gyroscopes to identify potential accidents within milliseconds.

When an impact is detected, the helmet automatically sends emergency alerts to pre-configured contacts along with precise GPS coordinates. This feature is particularly valuable for solo riders exploring remote routes across India's diverse terrain.

**GPS Navigation Integration**

The integrated GPS system provides turn-by-turn navigation through bone conduction speakers, ensuring cyclists can follow routes without removing their hands from handlebars or taking eyes off the road. The system includes:

- Offline map storage for areas with poor cellular coverage
- Integration with popular cycling apps like Strava and Komoot
- Custom route planning optimized for cycling infrastructure
- Real-time traffic updates for urban cycling

**Smart Communication Hub**

Beyond navigation, the helmet serves as a complete communication hub. Cyclists can take calls, listen to music, and communicate with riding partners through the built-in intercom system. The noise-canceling microphone ensures clear communication even in windy conditions.

**Indian Road Optimization**

Understanding the unique challenges of cycling in India, PedalBharat has specifically optimized the Smart Helmet Pro for local conditions:

- Enhanced dust and moisture resistance (IP67 rating)
- Temperature compensation for extreme heat
- Multi-language support including Hindi, Tamil, and Bengali
- Integration with Indian traffic management systems

**Pricing and Availability**

The Smart Helmet Pro is priced at ₹19,999 and will be available exclusively through PedalBharat's online platform and select retail partners starting January 15, 2025. Early bird customers can secure the helmet for ₹16,999 until December 31, 2024.

**Future Updates**

PedalBharat plans quarterly software updates that will add new features including:
- Integration with Indian emergency services
- Weather-based route optimization
- Social cycling features for group rides
- Advanced health monitoring capabilities

The Smart Helmet Pro represents more than just a product launch – it's a vision of safer, more connected cycling that addresses the real challenges faced by cyclists across India's diverse landscapes and urban environments.` 
  },
  { 
    id: 2, 
    title: 'Indian Cycling Market Expected to Grow 15% in 2025', 
    category: 'Industry News', 
    date: 'December 18, 2024', 
    readTime: '7 min read', 
    author: 'Cycling Industry Report', 
    summary: 'Comprehensive analysis of market trends and growth drivers in the Indian cycling ecosystem for the upcoming year.', 
    image: '/placeholder.svg', 
    content: `The Indian cycling market is poised for unprecedented growth in 2025, with industry analysts projecting a 15% increase in market value, driven by urbanization, health consciousness, and government infrastructure initiatives.

**Market Size and Projections**

The Indian cycling market, valued at ₹8,500 crores in 2024, is expected to reach ₹9,775 crores by the end of 2025. This growth trajectory positions India as one of the fastest-growing cycling markets globally, outpacing traditional cycling nations in percentage growth terms.

**Key Growth Drivers**

*Urban Mobility Crisis*
India's metropolitan cities face increasing traffic congestion and pollution levels. Cycling presents a viable solution for short to medium-distance urban commuting. Cities like Pune, Bengaluru, and Delhi have reported 40-60% increases in cycling infrastructure usage over the past year.

*Health and Fitness Awareness*
Post-pandemic health consciousness continues to drive cycling adoption. Fitness cycling has grown by 25% annually, with particular growth in the 25-45 age demographic. Corporate wellness programs increasingly include cycling initiatives.

*Government Policy Support*
The National Cycling and Walking Policy framework, launched in 2024, allocates ₹2,000 crores for cycling infrastructure development. This includes dedicated cycling lanes, bike parking facilities, and integration with public transport systems.

**Segment-wise Analysis**

*E-bikes Leading Growth*
Electric bicycles represent the fastest-growing segment, with projected 35% year-over-year growth. Factors driving e-bike adoption include:
- Improved battery technology and range
- Government subsidies under the PLI scheme
- Corporate adoption for last-mile delivery
- Reduced total cost of ownership compared to motorcycles

*Premium Cycling Equipment*
The premium cycling gear segment (products above ₹50,000) shows 20% growth, driven by:
- Increasing disposable income in urban centers
- Growth of cycling as a sport and recreation
- Influence of social media and cycling communities
- Improved retail availability and after-sales service

**Technology and Innovation Trends**

*Smart Cycling Integration*
Integration of IoT devices, GPS tracking, and smartphone connectivity becomes standard across price segments. Features like theft protection, fitness tracking, and navigation drive consumer preferences.

*Direct-to-Consumer Growth*
Online cycling retail grows 30% annually, with brands investing heavily in digital marketing, virtual try-on technologies, and home delivery services.

**Market Predictions for 2025**

*Price Segment Evolution*
- Entry-level cycles (₹5,000-₹15,000): 12% growth
- Mid-range cycles (₹15,000-₹50,000): 16% growth  
- Premium cycles (₹50,000+): 22% growth
- E-bikes (₹30,000-₹1,50,000): 35% growth

The 15% growth projection for India's cycling market in 2025 reflects a fundamental shift in transportation preferences, health consciousness, and urban planning approaches. Success in capitalizing on this growth requires coordinated efforts from manufacturers, retailers, policymakers, and cycling communities.` 
  },
  { id: 3, title: 'PedalBharat Sponsors National Cycling Championship 2024', category: 'Events', date: 'December 15, 2024', readTime: '2 min read', author: 'Events Team', summary: "Supporting India's top cycling talent with premium gear and infrastructure.", image: '/placeholder.svg', content: `We are proud sponsors of the championship, backing grassroots to elite.` },
  { id: 4, title: 'New Sustainable Packaging Initiative Reduces Carbon Footprint by 40%', category: 'Company News', date: 'December 12, 2024', readTime: '4 min read', author: 'Sustainability Team', summary: 'Environmental commitment through innovative eco-friendly packaging solutions.', image: '/placeholder.svg', content: `Our initiative replaces plastics with recycled paper and bio-materials.` },
  { id: 5, title: 'Partnership with Local Bike Shops Expands Service Network', category: 'Partnerships', date: 'December 10, 2024', readTime: '3 min read', author: 'Business Development', summary: 'Strategic alliance brings professional bike servicing closer to customers nationwide.', image: '/placeholder.svg', content: `Local partners will offer installation, servicing, and test rides.` },
  { id: 6, title: 'Customer Success Stories: From Beginner to Pro Cyclist', category: 'Company News', date: 'December 8, 2024', readTime: '6 min read', author: 'Customer Success', summary: 'Inspiring journeys of cyclists who transformed their lives with the right gear and community support.', image: '/placeholder.svg', content: `Real voices from the community on training, gear, and mindset.` },
];

const NewsDetail = () => {
  const { id } = useParams();
  const article = newsArticles.find(a => String(a.id) === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article not found</h1>
            <Button asChild>
              <Link to="/news">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
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
          <Link to="/news"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        </Button>

        <Card className="overflow-hidden">
          <div className="aspect-video bg-muted">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{article.category}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" /> {article.date}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" /> {article.readTime}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{article.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" /> {article.author}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>') }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsDetail;