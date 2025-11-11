import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const Refund = () => {
  const refundTimeline = [
    { step: 'Return Initiated', time: 'Day 0', description: 'You submit return request' },
    { step: 'Item Picked Up', time: 'Day 1-2', description: 'We collect the item from your location' },
    { step: 'Quality Check', time: 'Day 3-5', description: 'We inspect the returned item' },
    { step: 'Refund Processed', time: 'Day 6-8', description: 'Refund initiated to your account' },
    { step: 'Refund Received', time: 'Day 8-15', description: 'Amount credited to your account' }
  ];

  const eligibleItems = [
    'Unopened products in original packaging',
    'Items with manufacturing defects',
    'Wrong items shipped',
    'Damaged items during shipping',
    'Items not matching description'
  ];

  const nonEligibleItems = [
    'Items damaged by misuse',
    'Custom or personalized products',
    'Items without original packaging',
    'Products used beyond return window',
    'Gift cards and digital products'
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Refund Policy</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Fair <span className="text-primary">Refund</span> Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We stand behind our products and offer transparent, hassle-free refunds 
            when things don't work out as expected.
          </p>
        </div>

        {/* Refund Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Refund Process Timeline</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {refundTimeline.map((phase, index) => (
              <Card key={index} className="text-center relative">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-sm">{phase.step}</CardTitle>
                  <Badge variant="outline" className="mt-2">{phase.time}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{phase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Eligible for Refund */}
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <CardTitle className="text-green-800">Eligible for Full Refund</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {eligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Not Eligible for Refund */}
          <Card className="border-red-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <XCircle className="w-6 h-6 text-red-600" />
                <CardTitle className="text-red-800">Not Eligible for Refund</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {nonEligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Refund Methods */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Original Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Refunds are processed back to your original payment method (card, UPI, etc.)
              </p>
              <Badge variant="secondary">5-10 business days</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PedalBharat Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Instant credit to your PedalBharat wallet for faster future purchases
              </p>
              <Badge variant="secondary">Instant</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cash on Delivery Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Bank transfer to your provided account details after verification
              </p>
              <Badge variant="secondary">7-15 business days</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>Important Refund Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Refund Amount</h4>
                <p className="text-muted-foreground text-sm">
                  Full product price is refunded. Shipping charges are refunded only if the 
                  return is due to our error (wrong/damaged item).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Processing Time</h4>
                <p className="text-muted-foreground text-sm">
                  Refunds are processed within 3-5 business days after we receive and inspect 
                  the returned item.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Partial Refunds</h4>
                <p className="text-muted-foreground text-sm">
                  Items returned in used condition or without original packaging may receive 
                  partial refunds at our discretion.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Refund Notifications</h4>
                <p className="text-muted-foreground text-sm">
                  You'll receive email and SMS notifications at each step of the refund process.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-muted/20 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Need Help with a Refund?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help you through the refund process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Request Refund
            </Button>
            <Button variant="outline" size="lg">
              Check Refund Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refund;