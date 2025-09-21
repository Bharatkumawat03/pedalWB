import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Privacy Policy</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your <span className="text-primary">Privacy</span> Matters
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Personal Information</h4>
                <p className="text-muted-foreground text-sm">
                  We collect information you provide directly, such as when you create an account, 
                  make a purchase, or contact us for support. This includes your name, email address, 
                  phone number, shipping address, and payment information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Usage Information</h4>
                <p className="text-muted-foreground text-sm">
                  We automatically collect information about how you use our website, including 
                  your IP address, browser type, pages viewed, and time spent on our site.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Process and fulfill your orders</li>
                <li>• Provide customer support and respond to inquiries</li>
                <li>• Send order updates and shipping notifications</li>
                <li>• Improve our website and services</li>
                <li>• Send promotional emails (with your consent)</li>
                <li>• Prevent fraud and ensure security</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• With service providers who help us operate our business</li>
                <li>• To comply with legal requirements or court orders</li>
                <li>• To protect our rights, property, or safety</li>
                <li>• With your explicit consent</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, 
                no internet transmission is completely secure, and we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Access and update your personal information</li>
                <li>• Request deletion of your data</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Request data portability</li>
                <li>• Object to processing of your data</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                We use cookies and similar technologies to enhance your browsing experience, 
                analyze website traffic, and provide personalized content. You can control 
                cookie settings through your browser preferences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                We may update this Privacy Policy from time to time. We will notify you of 
                any significant changes by posting the new policy on our website and updating 
                the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@pedalbharat.com</p>
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

export default Privacy;