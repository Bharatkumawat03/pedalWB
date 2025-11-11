import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import NewArrivals from '@/components/home/NewArrivals';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BestSellers from '@/components/home/BestSellers';
import DealsSection from '@/components/home/DealsSection';
import TrustSection from '@/components/home/TrustSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedCategories />
      <NewArrivals />
      <FeaturedProducts />
      <BestSellers />
      <DealsSection />
      <TestimonialsSection />
      <NewsletterSection />
      <TrustSection />
    </div>
  );
};

export default Index;
