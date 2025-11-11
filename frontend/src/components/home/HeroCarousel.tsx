import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Award, Users, Clock, Mountain, Zap, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroCycling from '@/assets/hero-cycling.jpg';
import heroMountain from '@/assets/hero-mountain.jpg';
import heroRace from '@/assets/hero-race.jpg';
import heroUrban from '@/assets/hero-urban.jpg';

const HeroCarousel = () => {
  const [api, setApi] = useState<any>(null);

  const slides = [
    {
      id: 1,
      image: heroCycling,
      badge: { icon: "⚡", text: "Free Shipping on Orders Over ₹2000" },
      title: "Unleash Your Ride.",
      subtitle: "Elevate Your Performance.",
      description: "Discover the cutting-edge cycling gear designed for the future. From professional racing to weekend adventures, we equip riders who demand excellence.",
      stats: [
        { icon: Award, label: '2000+ Products', value: '2000+' },
        { icon: Users, label: '50K+ Happy Riders', value: '50K+' },
        { icon: Clock, label: '10 Years of Experience', value: '10 Years' },
      ],
      features: [
        { icon: Award, title: "Expert Curation", description: "Hand-picked gear by cycling professionals" },
        { icon: Users, title: "Unmatched Quality", description: "Premium components from trusted brands" },
        { icon: Clock, title: "Passionate Support", description: "Riders helping riders achieve their goals" }
      ]
    },
    {
      id: 2,
      image: heroMountain,
      badge: { icon: "🏔️", text: "Adventure Awaits - Explore New Trails" },
      title: "Conquer Every Trail.",
      subtitle: "Adventure Without Limits.",
      description: "From mountain peaks to forest paths, our adventure gear is built to handle the most challenging terrains while keeping you comfortable and safe.",
      stats: [
        { icon: Mountain, label: '500+ Trail Routes', value: '500+' },
        { icon: Users, label: '25K+ Adventures', value: '25K+' },
        { icon: Award, label: 'Trail Tested', value: '100%' },
      ],
      features: [
        { icon: Mountain, title: "Trail Ready", description: "Gear tested on the toughest mountain trails" },
        { icon: Award, title: "Durability First", description: "Built to withstand extreme conditions" },
        { icon: Users, title: "Adventure Community", description: "Join thousands of trail explorers" }
      ]
    },
    {
      id: 3,
      image: heroRace,
      badge: { icon: "🏆", text: "Pro Performance - Race Like Champions" },
      title: "Race at Light Speed.",
      subtitle: "Professional Excellence.",
      description: "Aerodynamic precision meets championship performance. Our racing collection is engineered for riders who compete at the highest levels.",
      stats: [
        { icon: Zap, label: 'Pro Athletes', value: '100+' },
        { icon: Award, label: 'Championships Won', value: '50+' },
        { icon: Clock, label: 'Seconds Saved', value: '1000s' },
      ],
      features: [
        { icon: Zap, title: "Aerodynamic Design", description: "Wind-tunnel tested for maximum speed" },
        { icon: Award, title: "Championship Proven", description: "Used by professional racing teams" },
        { icon: Clock, title: "Precision Engineering", description: "Every gram and second optimized" }
      ]
    },
    {
      id: 4,
      image: heroUrban,
      badge: { icon: "🌆", text: "Urban Mobility - Ride the City" },
      title: "Navigate the Urban Jungle.",
      subtitle: "Smart City Cycling.",
      description: "Stylish, efficient, and sustainable urban cycling solutions designed for the modern city rider who values both performance and aesthetics.",
      stats: [
        { icon: MapPin, label: 'Cities Covered', value: '100+' },
        { icon: Users, label: 'Daily Commuters', value: '15K+' },
        { icon: Award, label: 'CO2 Saved (tons)', value: '500+' },
      ],
      features: [
        { icon: MapPin, title: "City Optimized", description: "Designed for urban environments and traffic" },
        { icon: Zap, title: "Smart Features", description: "Integrated tech for modern commuting" },
        { icon: Users, title: "Sustainable Choice", description: "Eco-friendly transportation solution" }
      ]
    }
  ];

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative min-h-[300px] md:min-h-[350px] lg:min-h-[400px] overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative min-h-[300px] md:min-h-[350px] lg:min-h-[400px] flex items-center bg-gradient-hero overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={slide.image}
                    alt={`${slide.title} - Professional cycling`}
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">
                  <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
                    {/* Hero Content */}
                    <div className="space-y-4 md:space-y-8 animate-fade-in">
                      <div className="space-y-2 md:space-y-4">
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs md:text-sm">
                          {slide.badge.icon} {slide.badge.text}
                        </Badge>
                        
                        <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                          <span className="text-foreground">{slide.title}</span>
                          <br />
                          <span className="text-primary">{slide.subtitle}</span>
                        </h1>
                        
                        <p className="text-sm md:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                          {slide.description}
                        </p>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                        <Link to="/shop">
                          <Button size="default" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 md:px-8 py-2 md:py-3 text-sm md:text-lg shadow-green hover:shadow-hover transition-all duration-300 w-full sm:w-auto">
                            Shop Collections
                            <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                        </Link>
                        
                        <Link to="/categories" className="hidden sm:block">
                          <Button variant="outline" size="default" className="border-border hover:border-primary hover:bg-primary/5 px-4 md:px-8 py-2 md:py-3 text-sm md:text-lg">
                            Explore Categories
                          </Button>
                        </Link>
                      </div>

                      {/* Stats */}
                      <div className="hidden md:grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                        {slide.stats.map((stat, index) => (
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
                      <div className="absolute inset-0 bg-gradient-card rounded-2xl transform rotate-6 animate-glow opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl transform -rotate-3" />
                      <div className="relative bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6 shadow-card transform rotate-2 hover:rotate-0 transition-transform duration-500">
                        <h3 className="text-2xl font-bold text-foreground mb-6">Why Choose PedalBharat?</h3>
                        
                        <div className="space-y-4">
                          {slide.features.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                                <feature.icon className="w-3 h-3 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{feature.title}</h4>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation */}
        <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border-border hover:border-primary" />
        <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border-border hover:border-primary" />

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/60 transition-all duration-200"
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default HeroCarousel;