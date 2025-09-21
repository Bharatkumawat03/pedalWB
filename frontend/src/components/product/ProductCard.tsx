import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const [isHovered, setIsHovered] = useState(false);
  
  // Safely access wishlist state with fallback
  const wishlistState = useSelector((state: RootState) => state.wishlist);
  const wishlistItems = wishlistState?.items || [];
  
  // Handle both backend and frontend wishlist structures
  const isInWishlist = wishlistItems.some((item: any) => 
    item.id === (product._id || product.id)
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const productId = product._id || product.id;
    if (productId) {
      dispatch(addToCart({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category || product.brand || 'General'
      }));
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const productId = product._id || product.id;
    if (productId) {
      dispatch(toggleWishlist({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category || product.brand || 'General'
      }));
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Handle both backend and frontend stock checking
  const isOutOfStock = !product.inventory.inStock || (product.inventory.stock !== undefined && product.inventory.stock <= 0);

  // Safely extract rating values
  const getRatingValue = () => {
    if (typeof product.rating === 'number') {
      return product.rating;
    }
    if (product.rating && typeof product.rating === 'object') {
      return product.rating.average || product.rating.value || 0;
    }
    return product.averageRating || 0;
  };

  const getReviewCount = () => {
    if (typeof product.reviews === 'number') {
      return product.reviews;
    }
    if (product.rating && typeof product.rating === 'object') {
      return product.rating.count || product.rating.reviews || 0;
    }
    return product.reviewCount || 0;
  };

  const ratingValue = getRatingValue();
  const reviewCount = getReviewCount();

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
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-primary text-primary-foreground">NEW</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive">-{discountPercentage}%</Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleToggleWishlist}
          >
            <Heart 
              className={`w-4 h-4 ${isInWishlist ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
            />
          </Button>
          <Link to={`/product/${product._id || product.id}`}>
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
            </Button>
          </Link>
        </div>

        {/* Quick Add to Cart */}
        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <Link to={`/product/${product._id || product.id}`} className="block group">
          {/* Brand */}
          <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
          
          {/* Product Name */}
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Rating - Safely handle both backend and frontend rating structures */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(ratingValue)
                      ? 'text-yellow-400 fill-current'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {ratingValue} ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
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
