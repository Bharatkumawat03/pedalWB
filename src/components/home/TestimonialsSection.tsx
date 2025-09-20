import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Professional Cyclist",
      rating: 5,
      text: "PedalWare's gear has transformed my performance on the track. The attention to detail and quality is unmatched. I've shaved seconds off my personal best!",
      category: "Performance",
      avatar: "AC"
    },
    {
      id: 2,
      name: "Maria Rodriguez", 
      role: "Mountain Biking Enthusiast",
      rating: 5,
      text: "Finally found gear that can handle the toughest mountain trails. The durability and comfort make every adventure more enjoyable. Highly recommended!",
      category: "Adventure",
      avatar: "MR"
    },
    {
      id: 3,
      name: "David Kumar",
      role: "Daily Commuter",
      rating: 5,
      text: "As a city commuter, I need reliable and stylish gear. PedalWare delivers on both fronts. My daily rides are now more comfortable and efficient.",
      category: "Urban",
      avatar: "DK"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      role: "Weekend Warrior",
      rating: 5,
      text: "The customer service is amazing and the product quality exceeds expectations. Every purchase has been a great investment in my cycling journey.",
      category: "Recreation",
      avatar: "SJ"
    },
    {
      id: 5,
      name: "Mike Thompson",
      role: "Bike Shop Owner",
      rating: 5,
      text: "I recommend PedalWare to all my customers. The consistency in quality and the range of products make them my go-to supplier for premium cycling gear.",
      category: "Professional",
      avatar: "MT"
    },
    {
      id: 6,
      name: "Lisa Wang",
      role: "Cycling Coach",
      rating: 5,
      text: "Training with PedalWare equipment has helped my athletes achieve their goals faster. The performance benefits are measurable and significant.",
      category: "Training",
      avatar: "LW"
    }
  ];

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const getCategoryColor = (category: string) => {
    const colors = {
      Performance: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Adventure: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", 
      Urban: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Recreation: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Professional: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Training: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Quote className="w-6 h-6 text-primary" />
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Testimonials
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Riders Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trusted by thousands of cyclists worldwide, from weekend warriors to professional athletes
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className={`group relative overflow-hidden transition-all duration-300 hover:shadow-hover border-border hover:border-primary/50 ${
                hoveredCard === testimonial.id ? 'transform scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredCard(testimonial.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-6">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-10 h-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>

                {/* Category Badge */}
                <Badge 
                  variant="secondary" 
                  className={`${getCategoryColor(testimonial.category)} text-xs`}
                >
                  {testimonial.category}
                </Badge>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Join thousands of satisfied customers</p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 Average Rating</span>
            </div>
            <div>50,000+ Happy Customers</div>
            <div>99% Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;