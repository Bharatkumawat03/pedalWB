import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store/store';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { Product } from '@/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

// Unified interface that works with both backend API and frontend data
interface ProductCardProps {
  product: any; // Flexible to handle both backend (_id) and frontend (id) structures
  className?: string;
}

const ProductCard = ({ product, className = '' }: ProductCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // Safely access wishlist state with fallback
  const wishlistState = useSelector((state: RootState) => state.wishlist);
  const wishlistItems = wishlistState?.items || [];
  
  // Handle both backend and frontend wishlist structures
  const isInWishlist = wishlistItems.some((item: any) => 
    item.id === (product._id || product.id)
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    const productId = product._id || product.id;
    if (productId) {
      try {
        await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      } catch (error: any) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    const productId = product._id || product.id;
    if (productId) {
      try {
        await dispatch(toggleWishlist(productId)).unwrap();
      } catch (error: any) {
        if (error === 'LOGIN_REQUIRED' || error?.message === 'LOGIN_REQUIRED') {
          // Redirect to login page
          navigate('/login', { state: { from: window.location.pathname } });
        } else {
          console.error('Error toggling wishlist:', error);
        }
      }
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Handle stock checking with new API structure
  const isOutOfStock = !product.isInStock && 
                       (!product.inventory?.inStock || 
                        (product.inventory?.quantity !== undefined && product.inventory.quantity <= 0));

  // Safely extract rating values
  const getRatingValue = () => {
    if (product.rating && typeof product.rating === 'object') {
      return product.rating.average || 0;
    }
    if (typeof product.rating === 'number') {
      return product.rating;
    }
    return 0;
  };

  const getReviewCount = () => {
    if (product.rating && typeof product.rating === 'object') {
      return product.rating.count || 0;
    }
    if (typeof product.reviews === 'number') {
      return product.reviews;
    }
    return 0;
  };

  const ratingValue = getRatingValue();
  const reviewCount = getReviewCount();
  
  // Get product image URL - handle both image objects and string URLs
  const getImageUrl = () => {
    // If images array exists, get primary or first image
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find((img: any) => img.isPrimary);
      if (primaryImage?.url) return primaryImage.url;
      if (product.images[0]?.url) return product.images[0].url;
      // Fallback if image object doesn't have url
      if (typeof product.images[0] === 'string') return product.images[0];
    }
    // Fallback to product.image (string)
    return product.image || '';
  };

  const productImageUrl = getImageUrl();
  
  return (
    <Card 
      className={`group bg-card border-border hover:border-primary/20 transition-all duration-300 hover:shadow-hover overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-muted/30">
          <img
            src={productImageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-1.5 md:top-3 left-1.5 md:left-3 flex flex-col gap-1 md:gap-2">
          {product.isNew && (
            <Badge className="bg-primary text-primary-foreground text-[10px] md:text-xs px-1.5 md:px-2 py-0 md:py-0.5">NEW</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="text-[10px] md:text-xs px-1.5 md:px-2 py-0 md:py-0.5">-{discountPercentage}%</Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="text-[10px] md:text-xs px-1.5 md:px-2 py-0 md:py-0.5">Out of Stock</Badge>
          )}
        </div>

        {/* Action Buttons - Hidden on mobile, shown on hover on desktop */}
        <div className={`absolute top-1.5 md:top-3 right-1.5 md:right-3 flex flex-col gap-1 md:gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'md:opacity-0'}`}>
          <Button
            size="icon"
            variant="ghost"
            className="w-6 h-6 md:w-8 md:h-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleToggleWishlist}
          >
            <Heart 
              className={`w-3 h-3 md:w-4 md:h-4 ${isInWishlist ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
            />
          </Button>
          <Link to={`/product/${product._id || product.id}`} className="hidden md:block">
            <Button
              size="icon"
              variant="ghost"
              className="w-6 h-6 md:w-8 md:h-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <Eye className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
            </Button>
          </Link>
        </div>

        {/* Quick Add to Cart - Hidden on mobile */}
        <div className={`absolute bottom-2 md:bottom-3 left-2 md:left-3 right-2 md:right-3 transition-all duration-300 hidden md:block ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm"
            size="sm"
          >
            <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-2 md:p-4">
        <Link to={`/product/${product._id || product.id}`} className="block group">
          {/* Brand */}
          <p className="text-[10px] md:text-sm text-muted-foreground mb-0.5 md:mb-1 line-clamp-1">{product.brand}</p>
          
          {/* Product Name */}
          <h3 className="text-xs md:text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-1 md:mb-2">
            {product.name}
          </h3>

          {/* Rating - Safely handle both backend and frontend rating structures */}
          <div className="flex items-center gap-0.5 md:gap-1 mb-1.5 md:mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 ${
                    i < Math.floor(ratingValue)
                      ? 'text-yellow-400 fill-current'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] md:text-sm text-muted-foreground">
              {ratingValue} ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2">
            <span className="text-sm md:text-lg font-bold text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] md:text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
