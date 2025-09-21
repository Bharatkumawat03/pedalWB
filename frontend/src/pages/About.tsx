import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Heart, Target } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower every cyclist with premium gear and accessories that enhance their riding experience.'
    },
    {
      icon: Heart,
      title: 'Our Vision',
      description: 'Building India\'s most trusted cycling community through quality products and exceptional service.'
    },
    {
      icon: Users,
      title: 'Our Team',
      description: 'Passionate cyclists and industry experts dedicated to bringing you the best cycling experience.'
    },
    {
      icon: Award,
      title: 'Our Promise',
      description: 'Quality products, competitive prices, and customer service that goes beyond expectations.'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">About PedalBharat</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Cycling is Our <span className="text-primary">Passion</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Founded in 2020, PedalBharat has grown to become India's premier destination for cycling 
            enthusiasts. We believe that the right gear can transform your cycling journey.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                PedalBharat was born from a simple idea: every cyclist deserves access to premium gear 
                without breaking the bank. Our founders, avid cyclists themselves, noticed a gap in the 
                Indian market for affordable yet high-quality cycling components.
              </p>
              <p>
                Starting from a small garage in Mumbai, we've grown to serve thousands of cyclists 
                across India. Our commitment to quality, authenticity, and customer satisfaction has 
                made us the go-to choice for cycling enthusiasts nationwide.
              </p>
              <p>
                Today, we partner with leading global brands to bring you the latest innovations in 
                cycling technology, from professional racing components to everyday commuter accessories.
              </p>
            </div>
          </div>
          <div className="bg-muted/20 rounded-2xl p-8 text-center">
            <div className="space-y-6">
              <div>
                <div className="text-4xl font-bold text-primary">50K+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">1000+</div>
                <div className="text-muted-foreground">Products Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">50+</div>
                <div className="text-muted-foreground">Cities Served</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-hover transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
