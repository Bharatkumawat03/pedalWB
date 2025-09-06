import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Award, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroCycling from '@/assets/hero-cycling.jpg';

const HeroSection = () => {
  const stats = [
    { icon: Award, label: '2000+ Products', value: '2000+' },
    { icon: Users, label: '50K+ Happy Riders', value: '50K+' },
    { icon: Clock, label: '10 Years of Experience', value: '10 Years' },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroCycling}
          alt="Professional cyclist in action"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                ⚡ Free Shipping on Orders Over ₹2000
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">Unleash Your Ride.</span>
                <br />
                <span className="text-primary">Elevate Your Performance.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Discover the cutting-edge cycling gear designed for the future. 
                From professional racing to weekend adventures, we equip riders who demand excellence.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg shadow-green hover:shadow-hover transition-all duration-300">
                  Shop Collections
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link to="/categories">
                <Button variant="outline" size="lg" className="border-border hover:border-primary hover:bg-primary/5 px-8 py-3 text-lg">
                  Explore Categories
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-primary group-hover:text-primary/80 transition-colors duration-200" />
                  </div>
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Features */}
          <div className="relative lg:block hidden">
            <div className="absolute inset-0 bg-gradient-card rounded-2xl transform rotate-3 animate-glow" />
            <div className="relative bg-card border border-border rounded-2xl p-8 space-y-6 shadow-card">
              <h3 className="text-2xl font-bold text-foreground mb-6">Why Choose PedalWare?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Expert Curation</h4>
                    <p className="text-muted-foreground text-sm">Hand-picked gear by cycling professionals</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Unmatched Quality</h4>
                    <p className="text-muted-foreground text-sm">Premium components from trusted brands</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Passionate Support</h4>
                    <p className="text-muted-foreground text-sm">Riders helping riders achieve their goals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;