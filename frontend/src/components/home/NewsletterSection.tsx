import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Gift, Bell, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { newsletterService } from '@/services/newsletterService';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await newsletterService.subscribe(email);

      setIsSubscribed(true);
      setEmail('');
      
      toast({
        title: "Successfully subscribed!",
        description: response.message || "Welcome to the PedalBharat community. Check your inbox for a welcome gift!",
      });

      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error: any) {
      toast({
        title: "Subscription Failed",
        description: error.response?.data?.message || "Failed to subscribe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Gift,
      title: "Exclusive Discounts",
      description: "Get 15% off your first order and early access to sales"
    },
    {
      icon: Bell,
      title: "New Product Alerts",
      description: "Be the first to know about new gear and limited releases"
    },
    {
      icon: Star,
      title: "Expert Tips",
      description: "Weekly cycling tips and maintenance guides from pros"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-primary" />
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Newsletter
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join the PedalWare Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay connected with the latest gear, expert tips, and exclusive offers from the cycling world
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Newsletter Form */}
          <div className="space-y-8">
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Subscribe & Save 15%
                  </h3>
                  <p className="text-muted-foreground">
                    Join 25,000+ cyclists who stay ahead of the curve
                  </p>
                </div>

                {!isSubscribed ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 border-border focus:border-primary"
                      />
                      <Button 
                        type="submit"
                        className="bg-primary hover:bg-primary/90 px-8"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-8 animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Welcome to the Community!
                    </h3>
                    <p className="text-muted-foreground">
                      Check your inbox for your welcome gift 🎁
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              What You'll Get
            </h3>
            
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg bg-card/30 border border-border/50 hover:border-primary/50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Social Proof */}
            <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 bg-primary/20 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-primary"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                    +
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">25,000+ Subscribers</p>
                  <p className="text-sm text-muted-foreground">Join the community</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  4.9/5 Newsletter Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;