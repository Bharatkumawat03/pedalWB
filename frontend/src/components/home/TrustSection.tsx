import { Badge } from '@/components/ui/badge';
import { Shield, Truck, Award, HeadphonesIcon } from 'lucide-react';

const TrustSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Expert Curation',
      description: 'Every product tested and approved by cycling professionals',
      badge: 'Quality Assured',
    },
    {
      icon: Truck,
      title: 'Unmatched Quality',
      description: 'Premium components from the world\'s most trusted brands',
      badge: 'Premium Parts',
    },
    {
      icon: Award,
      title: 'Passionate Support',
      description: 'Riders helping riders achieve their cycling goals',
      badge: 'Expert Help',
    },
  ];

  return (
    <section className="py-8 md:py-12 lg:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-2 md:mb-4 text-xs md:text-sm">
            The PedalWare Difference
          </Badge>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-6">
            Why 50,000+ Riders Trust Us
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From weekend warriors to professional racers, cyclists choose PedalWare for gear that performs when it matters most.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-3 md:gap-6 lg:gap-8 mb-6 md:mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center p-4 md:p-6 lg:p-8 bg-card border border-border rounded-xl md:rounded-2xl hover:border-primary/20 transition-all duration-300 hover:shadow-card"
            >
              <div className="relative mb-3 md:mb-6">
                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-primary" />
                </div>
                <Badge className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-primary text-primary-foreground text-[10px] md:text-xs">
                  {feature.badge}
                </Badge>
              </div>
              
              <h3 className="text-sm md:text-base lg:text-xl font-bold text-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors duration-200">
                {feature.title}
              </h3>
              
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 bg-muted/30 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">
          <div className="text-center">
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1 md:mb-2">2000+</div>
            <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">Premium Products</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1 md:mb-2">50K+</div>
            <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">Happy Riders</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1 md:mb-2">99%</div>
            <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">Customer Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1 md:mb-2">10</div>
            <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">Years of Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;