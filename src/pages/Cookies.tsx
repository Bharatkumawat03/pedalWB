import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Cookies = () => {
  const cookieTypes = [
    {
      type: 'Essential Cookies',
      purpose: 'Required for website functionality',
      examples: 'Login status, shopping cart, security features',
      canDisable: false
    },
    {
      type: 'Performance Cookies',
      purpose: 'Help us understand how visitors use our website',
      examples: 'Page views, traffic sources, time spent on pages',
      canDisable: true
    },
    {
      type: 'Functional Cookies',
      purpose: 'Remember your preferences and settings',
      examples: 'Language preferences, location settings, personalization',
      canDisable: true
    },
    {
      type: 'Marketing Cookies',
      purpose: 'Used to deliver relevant advertisements',
      examples: 'Ad targeting, social media integration, remarketing',
      canDisable: true
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Cookie Policy</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Cookie <span className="text-primary">Policy</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Cookies are small text files that are stored on your computer or mobile device 
                when you visit a website. They help us provide you with a better experience by 
                remembering your preferences and improving our website's functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                PedalBharat uses cookies to enhance your browsing experience, analyze website 
                traffic, and provide personalized content. We use both session cookies 
                (which expire when you close your browser) and persistent cookies 
                (which remain on your device for a set period).
              </p>
            </CardContent>
          </Card>

          {/* Cookie Types */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Types of Cookies We Use</h2>
            <div className="grid gap-6">
              {cookieTypes.map((cookie, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{cookie.type}</CardTitle>
                      <Badge variant={cookie.canDisable ? "outline" : "secondary"}>
                        {cookie.canDisable ? "Optional" : "Required"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Purpose:</h4>
                      <p className="text-muted-foreground text-sm">{cookie.purpose}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Examples:</h4>
                      <p className="text-muted-foreground text-sm">{cookie.examples}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                We may also use third-party services that set cookies on our website:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• <strong>Google Analytics:</strong> For website analytics and performance measurement</li>
                <li>• <strong>Payment Processors:</strong> For secure payment processing</li>
                <li>• <strong>Social Media:</strong> For social media integration and sharing</li>
                <li>• <strong>Advertising Partners:</strong> For targeted advertising (with your consent)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Browser Settings</h4>
                <p className="text-muted-foreground text-sm">
                  You can control and delete cookies through your browser settings. Most browsers 
                  allow you to refuse cookies or to be alerted when cookies are being sent.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Cookie Preferences</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  You can manage your cookie preferences using our cookie consent tool, 
                  which appears when you first visit our website.
                </p>
                <Button variant="outline">
                  Update Cookie Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact of Disabling Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                If you choose to disable cookies, some features of our website may not function properly:
              </p>
              <ul className="space-y-1 text-muted-foreground text-sm">
                <li>• Shopping cart functionality may be limited</li>
                <li>• You may need to log in repeatedly</li>
                <li>• Personalized recommendations may not be available</li>
                <li>• Some forms may not work correctly</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Browser-Specific Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Chrome</h4>
                  <p className="text-muted-foreground">Settings → Privacy and Security → Cookies and other site data</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Firefox</h4>
                  <p className="text-muted-foreground">Options → Privacy & Security → Cookies and Site Data</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Safari</h4>
                  <p className="text-muted-foreground">Preferences → Privacy → Manage Website Data</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Edge</h4>
                  <p className="text-muted-foreground">Settings → Cookies and site permissions → Cookies and site data</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                We may update this Cookie Policy from time to time to reflect changes in our 
                practices or for other operational, legal, or regulatory reasons. Please check 
                this page periodically for updates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                If you have any questions about our use of cookies, please contact us:
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

export default Cookies;