import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Terms of Service</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                By accessing and using PedalBharat's website and services, you accept and agree 
                to be bound by the terms and provision of this agreement. If you do not agree 
                to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Permission is granted to temporarily download one copy of the materials 
                (information or software) on PedalBharat's website for personal, 
                non-commercial transitory viewing only.
              </p>
              <div>
                <h4 className="font-semibold text-foreground mb-2">This license shall automatically terminate if you violate any of these restrictions:</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Modify or copy the materials</li>
                  <li>• Use the materials for commercial purposes</li>
                  <li>• Attempt to decompile or reverse engineer software</li>
                  <li>• Remove copyright or proprietary notations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                We strive to provide accurate product information, but we do not warrant that 
                product descriptions or other content is accurate, complete, reliable, or error-free. 
                If a product offered by PedalBharat is not as described, your sole remedy is to 
                return it in unused condition.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Pricing</h4>
                <p className="text-muted-foreground text-sm">
                  All prices are listed in Indian Rupees (INR) and are subject to change without notice. 
                  We reserve the right to refuse or cancel any order placed for a product listed at an incorrect price.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Payment</h4>
                <p className="text-muted-foreground text-sm">
                  Payment must be made at the time of purchase through our approved payment methods. 
                  We accept major credit cards, debit cards, UPI, and cash on delivery for eligible orders.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping and Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• We aim to dispatch orders within 1-2 business days</li>
                <li>• Delivery times are estimates and may vary based on location</li>
                <li>• Risk of loss and title pass to you upon delivery</li>
                <li>• We are not responsible for delays caused by shipping carriers</li>
                <li>• Additional charges may apply for remote locations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Returns and Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                We offer a 30-day return policy for most items. Products must be unused, 
                in original packaging, and returned within the specified timeframe. 
                Custom or personalized items cannot be returned unless defective. 
                Refunds will be processed to the original payment method within 5-10 business days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• You are responsible for maintaining account confidentiality</li>
                <li>• You must provide accurate and complete information</li>
                <li>• You are responsible for all activities under your account</li>
                <li>• We reserve the right to terminate accounts for violations</li>
                <li>• One account per person is permitted</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                In no event shall PedalBharat or its suppliers be liable for any damages 
                (including, without limitation, damages for loss of data or profit, or due to 
                business interruption) arising out of the use or inability to use the materials 
                on PedalBharat's website, even if PedalBharat or its authorized representative 
                has been notified orally or in writing of the possibility of such damage.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                These terms and conditions are governed by and construed in accordance with 
                the laws of India, and you irrevocably submit to the exclusive jurisdiction 
                of the courts in Mumbai, Maharashtra.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@pedalbharat.com</p>
                <p><strong>Phone:</strong> +91 123 456 7890</p>
                <p><strong>Address:</strong> Mumbai, Maharashtra, India</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;