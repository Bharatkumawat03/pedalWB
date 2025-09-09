import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Briefcase } from 'lucide-react';

const Careers = () => {
  const positions = [
    {
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'Mumbai, Maharashtra',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Join our tech team to build the future of cycling e-commerce in India.'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Bangalore, Karnataka',
      type: 'Full-time',
      experience: '3-5 years',
      description: 'Lead product strategy and development for our cycling marketplace.'
    },
    {
      title: 'Digital Marketing Specialist',
      department: 'Marketing',
      location: 'Delhi, NCR',
      type: 'Full-time',
      experience: '1-3 years',
      description: 'Drive growth through innovative digital marketing campaigns.'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Ensure our customers have the best possible experience with PedalBharat.'
    }
  ];

  const benefits = [
    'Competitive salary and equity',
    'Health insurance for you and family',
    'Flexible working hours',
    'Professional development budget',
    'Cycling gear allowance',
    'Team cycling trips'
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Join Our Team</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Build the Future of <span className="text-primary">Cycling</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're looking for passionate individuals who share our love for cycling and 
            want to make a difference in the Indian cycling community.
          </p>
        </div>

        {/* Why Join Us */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Why PedalBharat?</h2>
            <p className="text-muted-foreground mb-6">
              At PedalBharat, we're not just building an e-commerce platform – we're creating 
              a movement that's transforming how India cycles. Join us in this exciting journey.
            </p>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-muted/20 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Our Culture</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Innovation-driven environment where your ideas matter</p>
              <p>Collaborative team culture with open communication</p>
              <p>Work-life balance with flexible schedules</p>
              <p>Continuous learning and growth opportunities</p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Open Positions</h2>
          <div className="grid gap-6">
            {positions.map((position, index) => (
              <Card key={index} className="hover:shadow-hover transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">{position.department}</Badge>
                        <Badge variant="outline">{position.type}</Badge>
                      </div>
                    </div>
                    <Button className="mt-4 md:mt-0">Apply Now</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{position.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{position.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{position.experience}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/20 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Don't see the right role?</h2>
          <p className="text-muted-foreground mb-6">
            We're always looking for talented individuals. Send us your resume and tell us how 
            you'd like to contribute to PedalBharat's mission.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Send Us Your Resume
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Careers;