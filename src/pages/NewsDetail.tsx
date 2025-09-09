import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';

const newsArticles = [
  { id: 1, title: 'PedalBharat Launches Revolutionary Smart Helmet with Integrated GPS', category: 'Product Updates', date: 'December 20, 2024', readTime: '3 min read', author: 'Priya Sharma', summary: 'Introducing cutting-edge safety technology that combines protection with smart navigation features for modern cyclists.', image: '/placeholder.svg', content: `Our smart helmet integrates GPS, crash detection, and turn-by-turn cues.` },
  { id: 2, title: 'Indian Cycling Market Expected to Grow 15% in 2025', category: 'Industry News', date: 'December 18, 2024', readTime: '5 min read', author: 'Cycling Industry Report', summary: 'Analysis of market trends and growth drivers in the Indian cycling ecosystem.', image: '/placeholder.svg', content: `Analysts predict sustained growth driven by urban mobility and fitness.` },
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
            <p className="text-muted-foreground leading-7 whitespace-pre-line">{article.summary}\n\n{article.content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsDetail;
