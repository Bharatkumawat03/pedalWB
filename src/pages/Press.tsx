import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Download, ExternalLink } from 'lucide-react';

const Press = () => {
  const pressReleases = [
    {
      title: 'PedalBharat Raises ₹50 Crores in Series A Funding',
      date: 'December 15, 2024',
      category: 'Funding',
      summary: 'Leading cycling e-commerce platform secures significant funding to expand operations across India and enhance technology infrastructure.',
      link: '#'
    },
    {
      title: 'PedalBharat Partners with International Cycling Brands',
      date: 'November 28, 2024',
      category: 'Partnership',
      summary: 'Strategic partnerships with global cycling manufacturers to bring premium products to Indian cycling enthusiasts.',
      link: '#'
    },
    {
      title: 'Launch of PedalBharat Mobile App',
      date: 'October 10, 2024',
      category: 'Product',
      summary: 'Native mobile application launches with enhanced user experience and AR try-on features for cycling gear.',
      link: '#'
    },
    {
      title: 'PedalBharat Wins "E-commerce Startup of the Year" Award',
      date: 'September 5, 2024',
      category: 'Award',
      summary: 'Recognition for innovation in the cycling industry and commitment to promoting cycling culture in India.',
      link: '#'
    }
  ];

  const mediaKit = [
    { name: 'Company Fact Sheet', type: 'PDF', size: '2.1 MB' },
    { name: 'High-Resolution Logos', type: 'ZIP', size: '15.3 MB' },
    { name: 'Product Images', type: 'ZIP', size: '45.2 MB' },
    { name: 'Executive Photos', type: 'ZIP', size: '8.7 MB' }
  ];

  const executives = [
    {
      name: 'Rajesh Kumar',
      position: 'Founder & CEO',
      bio: 'Former McKinsey consultant with 10+ years in e-commerce. Passionate cyclist and triathlete.',
      image: '/placeholder.svg'
    },
    {
      name: 'Priya Sharma',
      position: 'Co-founder & CTO',
      bio: 'Ex-Google engineer specializing in scalable e-commerce platforms. Mountain biking enthusiast.',
      image: '/placeholder.svg'
    },
    {
      name: 'Amit Patel',
      position: 'Head of Operations',
      bio: 'Supply chain expert with experience at Amazon and Flipkart. Road cycling advocate.',
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Press Center</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Press & <span className="text-primary">Media</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest news, announcements, and media resources from PedalBharat.
          </p>
        </div>

        {/* Press Releases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Latest Press Releases</h2>
          <div className="grid gap-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="hover:shadow-hover transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="secondary">{release.category}</Badge>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {release.date}
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2 hover:text-primary transition-colors cursor-pointer">
                        {release.title}
                      </CardTitle>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 md:mt-0">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read More
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{release.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Media Kit */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Media Kit</h2>
            <Card>
              <CardHeader>
                <CardTitle>Download Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mediaKit.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.type} • {item.size}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Media Contact</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Media Relations</h4>
                  <p className="text-muted-foreground">press@pedalbharat.com</p>
                  <p className="text-muted-foreground">+91 98765 43210</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Partnership Inquiries</h4>
                  <p className="text-muted-foreground">partnerships@pedalbharat.com</p>
                  <p className="text-muted-foreground">+91 98765 43211</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">General Information</h4>
                  <p className="text-muted-foreground">info@pedalbharat.com</p>
                  <p className="text-muted-foreground">+91 123 456 7890</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {executives.map((exec, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-muted/30 rounded-full mx-auto mb-4 overflow-hidden">
                    <img 
                      src={exec.image} 
                      alt={exec.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl">{exec.name}</CardTitle>
                  <Badge variant="outline">{exec.position}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{exec.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Stats */}
        <div className="bg-muted/20 rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">PedalBharat by Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Products Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Cities Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99%</div>
              <div className="text-muted-foreground">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Press;