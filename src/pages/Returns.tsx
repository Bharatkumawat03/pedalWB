import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, RefreshCw, Package } from 'lucide-react';

const Returns = () => {
  const returnSteps = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Submit return request through your account or contact support',
      icon: RefreshCw
    },
    {
      step: 2,
      title: 'Pack Items',
      description: 'Securely pack items in original packaging with all accessories',
      icon: Package
    },
    {
      step: 3,
      title: 'Schedule Pickup',
      description: 'We\'ll arrange free pickup from your location',
      icon: Clock
    },
    {
      step: 4,
      title: 'Processing',
      description: 'Once received, we\'ll process your return within 3-5 business days',
      icon: CheckCircle
    }
  ];

  const returnReasons = [
    'Product damaged during shipping',
    'Wrong item received',
    'Item doesn\'t match description',
    'Size/fit issues',
    'Quality not as expected',
    'Changed mind (within return window)'
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Returns & Exchanges</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Easy <span className="text-primary">Returns</span> Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your satisfaction is our priority. We offer hassle-free returns within 30 days 
            of purchase with free pickup and quick refunds.
          </p>
        </div>

        {/* Return Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Return Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((step, index) => (
              <Card key={index} className="text-center relative">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Return Policy */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Return Policy</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">30-Day Return Window</h3>
                <p className="text-muted-foreground">
                  You can return most items within 30 days of delivery. Some items may have 
                  different return windows - check product details for specifics.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Return Conditions</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Items must be unused and in original condition</li>
                  <li>• Original packaging and tags must be intact</li>
                  <li>• All accessories and parts must be included</li>
                  <li>• Custom or personalized items cannot be returned</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Refund Timeline</h3>
                <p className="text-muted-foreground">
                  Refunds are processed within 3-5 business days after we receive your return. 
                  It may take 5-10 business days for the refund to appear in your account.
                </p>
              </div>
            </div>
          </div>

          {/* Acceptable Return Reasons */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Valid Return Reasons</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {returnReasons.map((reason, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Note</h4>
              <p className="text-sm text-yellow-700">
                Returns due to customer preference may incur return shipping charges. 
                Defective or damaged items are returned free of charge.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/20 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Need to Return an Item?</h2>
          <p className="text-muted-foreground mb-6">
            Start your return process online or contact our support team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/account?tab=orders">Start Return Request</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact?subject=Return%20Support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;