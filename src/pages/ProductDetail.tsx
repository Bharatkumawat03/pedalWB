import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import productService from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  ArrowLeft, 
  Share2, 
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getProduct(id);
        setProduct(response.data);
        setRelatedProducts(response.data.relatedProducts || []);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  
  // Safe access to wishlist state with fallback
  const wishlistState = useSelector((state: RootState) => state.wishlist);
  const wishlistItems = wishlistState?.items || [];
  
  const isInWishlist = wishlistItems.some((item: any) => 
    item.product?._id === id || 
    item.product?.id === id ||
    item._id === id ||
    (item as any).id === id
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button onClick={() => navigate('/shop')} variant="outline">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shop')} variant="outline">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (id) {
      dispatch(addToCart({ 
        productId: id, 
        quantity,
        selectedColor: undefined,
        selectedSize: undefined
      }));
    }
  };

  const handleToggleWishlist = () => {
    if (id) {
      dispatch(toggleWishlist(id));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = !product.inStock || (product.stock !== undefined && product.stock <= 0);

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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/shop')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted/30">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.isNew && (
                <Badge className="bg-primary text-primary-foreground">NEW</Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive">-{discountPercentage}% OFF</Badge>
              )}
              {isOutOfStock && (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(ratingValue)
                        ? 'text-yellow-400 fill-current'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {ratingValue} ({reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-foreground">
                ₹{product.price?.toLocaleString() || 'N/A'}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  size="lg"
                  className="px-6"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-primary text-primary' : ''}`} />
                </Button>
                
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="lg"
                  className="px-6"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over ₹999</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Warranty</p>
                  <p className="text-xs text-muted-foreground">1 year manufacturer</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Returns</p>
                  <p className="text-xs text-muted-foreground">30 day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <Card key={relatedProduct._id || relatedProduct.id} className="group hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">
                        ₹{relatedProduct.price?.toLocaleString() || 'N/A'}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/product/${relatedProduct._id || relatedProduct.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
