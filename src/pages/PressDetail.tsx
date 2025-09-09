import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft } from 'lucide-react';

const pressReleases = [
  { id: 1, title: 'PedalBharat Raises ₹50 Crores in Series A Funding', date: 'December 15, 2024', category: 'Funding', summary: 'Leading cycling e-commerce platform secures significant funding to expand operations across India and enhance technology infrastructure.', image: '/placeholder.svg', content: `This funding will accelerate product development and logistics expansion.` },
  { id: 2, title: 'PedalBharat Partners with International Cycling Brands', date: 'November 28, 2024', category: 'Partnership', summary: 'Strategic partnerships with global cycling manufacturers to bring premium products to Indian cycling enthusiasts.', image: '/placeholder.svg', content: `Partnerships include co-marketing and local after-sales support.` },
  { id: 3, title: 'Launch of PedalBharat Mobile App', date: 'October 10, 2024', category: 'Product', summary: 'Native mobile application launches with enhanced user experience and AR try-on features for cycling gear.', image: '/placeholder.svg', content: `AR try-on and offline caching make shopping seamless on the go.` },
  { id: 4, title: 'PedalBharat Wins "E-commerce Startup of the Year" Award', date: 'September 5, 2024', category: 'Award', summary: 'Recognition for innovation in the cycling industry and commitment to promoting cycling culture in India.', image: '/placeholder.svg', content: `Awarded by the National Startup Forum for outstanding growth and UX.` },
];

const PressDetail = () => {
  const { id } = useParams();
  const release = pressReleases.find(r => String(r.id) === id);

  if (!release) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Press release not found</h1>
            <Button asChild>
              <Link to="/press">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Press
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
          <Link to="/press"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        </Button>

        <Card className="overflow-hidden">
          <div className="aspect-video bg-muted" />
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{release.category}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" /> {release.date}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{release.title}</h1>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-7 whitespace-pre-line">{release.summary}\n\n{release.content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PressDetail;
