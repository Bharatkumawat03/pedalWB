import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, MessageCircle, Phone, Mail, Clock } from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can use this number to track your order on our website or the carrier\'s website.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused items in original packaging. Returns are free for defective products, while customer returns may incur shipping charges.'
    },
    {
      question: 'Do you offer installation services?',
      answer: 'Yes, we partner with certified bike mechanics in major cities. Installation services can be booked during checkout or contacted separately.'
    },
    {
      question: 'Are your products genuine?',
      answer: 'Absolutely! We source all products directly from authorized distributors and manufacturers. Every product comes with manufacturer warranty.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and cash on delivery for eligible orders.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Most orders are delivered within 3-7 business days. Express shipping is available in select cities for next-day delivery.'
    }
  ];

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      available: 'Available 24/7'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: '+91 123 456 7890',
      action: 'Call Now',
      available: 'Mon-Sat, 9 AM - 8 PM'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@pedalbharat.com',
      action: 'Send Email',
      available: 'Response within 24 hours'
    }
  ];

  const categories = [
    { name: 'Orders & Shipping', count: 12 },
    { name: 'Returns & Refunds', count: 8 },
    { name: 'Product Information', count: 15 },
    { name: 'Account & Billing', count: 6 },
    { name: 'Technical Support', count: 9 }
  ];

  const filteredFaqs = faqs.filter(f =>
    !searchQuery ||
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Help Center</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            How can we <span className="text-primary">help</span> you?
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help topics, orders, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg bg-muted/50"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {supportOptions.map((option, index) => (
            <Card key={index} className="text-center hover:shadow-hover transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{option.description}</p>
                <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{option.available}</span>
                </div>
                <Button className="w-full">{option.action}</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Categories Sidebar */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-6">Help Categories</h3>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-hover transition-shadow duration-300" onClick={() => setSearchQuery(category.name)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{category.name}</span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8">
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start"><Link to="/account">Order Status</Link></Button>
                <Button asChild variant="ghost" className="w-full justify-start"><Link to="/returns">Return Request</Link></Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setSearchQuery('Size')}>Size Guide</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setSearchQuery('Warranty')}>Warranty Info</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;