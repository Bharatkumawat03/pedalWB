import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, MapPin, Package, Shield, Zap } from 'lucide-react';

const Shipping = () => {
  const shippingOptions = [
    {
      icon: Truck,
      title: 'Standard Shipping',
      time: '3-7 Business Days',
      cost: 'Free on orders ₹2,000+',
      description: 'Reliable delivery across India'
    },
    {
      icon: Zap,
      title: 'Express Shipping',
      time: '1-2 Business Days',
      cost: '₹200',
      description: 'Fast delivery in major cities'
    },
    {
      icon: Package,
      title: 'Cash on Delivery',
      time: '3-7 Business Days',
      cost: '₹50 extra',
      description: 'Pay when you receive'
    }
  ];

  const zones = [
    { zone: 'Metro Cities', cities: 'Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad', time: '1-3 days' },
    { zone: 'Tier 1 Cities', cities: 'Pune, Ahmedabad, Jaipur, Lucknow, Kanpur, Nagpur', time: '2-4 days' },
    { zone: 'Tier 2 Cities', cities: 'Indore, Bhopal, Patna, Vadodara, Coimbatore', time: '3-5 days' },
    { zone: 'Other Areas', cities: 'All other serviceable locations', time: '4-7 days' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Packaging',
      description: 'All items are carefully packaged to prevent damage during transit'
    },
    {
      icon: MapPin,
      title: 'Order Tracking',
      description: 'Real-time tracking updates via SMS and email notifications'
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: '98% of orders delivered within promised timeframe'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Shipping Information</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Fast & Reliable <span className="text-primary">Shipping</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We deliver your cycling gear safely and quickly across India with multiple 
            shipping options to suit your needs.
          </p>
        </div>

        {/* Shipping Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {shippingOptions.map((option, index) => (
            <Card key={index} className="text-center hover:shadow-hover transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <Badge variant="secondary" className="text-sm">{option.time}</Badge>
                  <p className="font-semibold text-primary">{option.cost}</p>
                </div>
                <p className="text-muted-foreground text-sm">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Delivery Zones */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Delivery Timeline by Location</h2>
          <div className="grid gap-4">
            {zones.map((zone, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{zone.zone}</h3>
                      <p className="text-muted-foreground text-sm">{zone.cities}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Badge variant="outline" className="text-primary border-primary">
                        {zone.time}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Charges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Orders below ₹2,000</span>
                <span className="font-semibold">₹100</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Orders ₹2,000 & above</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Express Shipping</span>
                <span className="font-semibold">₹200</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Cash on Delivery</span>
                <span className="font-semibold">₹50 extra</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>• Processing time: 1-2 business days before dispatch</p>
                <p>• Delivery estimates exclude weekends and holidays</p>
                <p>• Remote areas may take additional 1-2 days</p>
                <p>• COD available for orders up to ₹50,000</p>
                <p>• Free shipping applies to cart value before taxes</p>
                <p>• Bulk orders may require special shipping arrangements</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Shipping;