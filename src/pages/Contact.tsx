import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Clock, MessageCircle, Headphones, Package } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone Support',
      details: '+91 123 456 7890',
      subtitle: 'Mon-Sat 9AM-7PM'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Support',
      details: 'support@pedalbharat.com',
      subtitle: 'Response within 24 hours'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Store Location',
      details: 'MG Road, Bangalore, Karnataka',
      subtitle: 'Visit our flagship store'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Business Hours',
      details: 'Mon-Sat: 9AM-7PM',
      subtitle: 'Sunday: 10AM-6PM'
    }
  ];

  const supportOptions = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'General Inquiry',
      description: 'Questions about products or services'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Technical Support',
      description: 'Help with product installation or issues'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Order Support',
      description: 'Questions about your order or delivery'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact PedalBharat
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help with all your cycling needs. Reach out to our expert team 
            for personalized advice and support.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {info.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                <p className="text-foreground font-medium">{info.details}</p>
                <p className="text-sm text-muted-foreground">{info.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="order">Order Support</SelectItem>
                        <SelectItem value="warranty">Warranty Claim</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      rows={6}
                      placeholder="Please describe your inquiry in detail..."
                      className="bg-background border-border"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Support Options */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">How can we help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportOptions.map((option, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="text-primary mt-1">
                      {option.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{option.title}</h4>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* FAQ Link */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Quick Answers</h3>
                <p className="text-sm opacity-90 mb-4">
                  Check our FAQ section for instant answers to common questions.
                </p>
                <Button asChild variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                  <Link to="/help">View FAQ</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-foreground">Response Time</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email Support:</span>
                    <Badge variant="secondary">Within 24 hours</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone Support:</span>
                    <Badge variant="secondary">Immediate</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Technical Issues:</span>
                    <Badge variant="secondary">Within 2 hours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <section className="mt-16">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Visit Our Store</CardTitle>
              <p className="text-muted-foreground">
                Experience our products in person at our flagship store in Bangalore.
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">PedalBharat Flagship Store</h3>
                  <p className="text-muted-foreground">MG Road, Bangalore, Karnataka 560001</p>
                  <p className="text-sm text-muted-foreground mt-2">Near Commercial Street Metro Station</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Contact;