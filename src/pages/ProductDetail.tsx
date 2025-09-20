import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlistAsync } from '@/store/slices/wishlistSlice';
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
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // Local cart and wishlist state for immediate feedback
  const [localCart, setLocalCart] = useState<any[]>([]);
  const [localWishlist, setLocalWishlist] = useState<any[]>([]);

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

  // Load local cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pedalBharat_cart');
    const savedWishlist = localStorage.getItem('pedalBharat_wishlist');
    
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        setLocalCart(cartData.items || []);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    
    if (savedWishlist) {
      try {
        const wishlistData = JSON.parse(savedWishlist);
        setLocalWishlist(wishlistData.items || []);
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);
  
  // Check if product is in local wishlist
  const isInWishlist = localWishlist.some((item: any) => 
    item.product?._id === id || 
    item.product?.id === id ||
    item._id === id ||
    item.id === id
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
            <ArrowLeft className="w-4 h-4 mr-2" />
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
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!id || isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      // Try Redux first
      await dispatch(addToCart({ 
        productId: id, 
        quantity,
        selectedColor: undefined,
        selectedSize: undefined
      }));
      console.log('Added to cart successfully via Redux');
    } catch (error) {
      console.error('Redux cart failed, using local storage:', error);
      
      // Fallback to local storage
      const cartItem = {
        _id: `local_${Date.now()}`,
        product: {
          _id: id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          brand: product.brand
        },
        quantity,
        selectedColor: undefined,
        selectedSize: undefined,
        itemTotal: product.price * quantity,
        addedAt: new Date().toISOString()
      };

      const existingItemIndex = localCart.findIndex(item => 
        item.product._id === id && 
        item.selectedColor === undefined && 
        item.selectedSize === undefined
      );

      let updatedCart;
      if (existingItemIndex >= 0) {
        updatedCart = [...localCart];
        updatedCart[existingItemIndex].quantity += quantity;
        updatedCart[existingItemIndex].itemTotal = updatedCart[existingItemIndex].quantity * product.price;
      } else {
        updatedCart = [...localCart, cartItem];
      }

      setLocalCart(updatedCart);
      
      // Save to localStorage
      const cartData = {
        items: updatedCart,
        summary: {
          itemCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: updatedCart.reduce((sum, item) => sum + item.itemTotal, 0),
          tax: 0,
          shipping: 0,
          total: updatedCart.reduce((sum, item) => sum + item.itemTotal, 0),
          freeShippingThreshold: 999,
          freeShippingEligible: false
        }
      };
      
      localStorage.setItem('pedalBharat_cart', JSON.stringify(cartData));
      console.log('Added to cart successfully via localStorage');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!id || isTogglingWishlist) return;
    
    setIsTogglingWishlist(true);
    
    try {
      // Try Redux first
      await dispatch(toggleWishlistAsync(id));
      console.log('Toggled wishlist successfully via Redux');
    } catch (error) {
      console.error('Redux wishlist failed, using local storage:', error);
      
      // Fallback to local storage
      const wishlistItem = {
        _id: `local_${Date.now()}`,
        product: {
          _id: id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          brand: product.brand
        },
        addedAt: new Date().toISOString()
      };

      const existingItemIndex = localWishlist.findIndex(item => 
        item.product._id === id || item._id === id || item.id === id
      );

      let updatedWishlist;
      if (existingItemIndex >= 0) {
        // Remove from wishlist
        updatedWishlist = localWishlist.filter((_, index) => index !== existingItemIndex);
      } else {
        // Add to wishlist
        updatedWishlist = [...localWishlist, wishlistItem];
      }

      setLocalWishlist(updatedWishlist);
      
      // Save to localStorage
      const wishlistData = {
        items: updatedWishlist
      };
      
      localStorage.setItem('pedalBharat_wishlist', JSON.stringify(wishlistData));
      console.log('Toggled wishlist successfully via localStorage');
    } finally {
      setIsTogglingWishlist(false);
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

  // Fix stock checking to handle both backend and frontend structures
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

  // Create product images array for gallery
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image, product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button onClick={() => navigate('/')} className="hover:text-primary">Home</button>
          <span>&gt;</span>
          <button onClick={() => navigate('/shop')} className="hover:text-primary">Shop</button>
          <span>&gt;</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-muted/30 rounded-2xl overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-muted/30 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-muted text-muted-foreground">{product.brand}</Badge>
                {product.isNew && <Badge className="bg-primary text-primary-foreground">NEW</Badge>}
                {discountPercentage > 0 && (
                  <Badge variant="destructive">-{discountPercentage}%</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
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

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-foreground">
                  ₹{product.price?.toLocaleString() || 'N/A'}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {!isOutOfStock ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium text-foreground">Quantity:</label>
                <div className="flex border border-border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-border min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                    disabled={isOutOfStock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                
                <Button
                  onClick={handleToggleWishlist}
                  disabled={isTogglingWishlist}
                  variant="outline"
                  size="lg"
                  className="px-6"
                >
                  <Heart 
                    className={`w-5 h-5 ${isInWishlist ? 'fill-primary text-primary' : ''}`} 
                  />
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

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On orders over ₹2000</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">30-Day Returns</p>
                    <p className="text-sm text-muted-foreground">Easy returns & exchanges</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Warranty</p>
                    <p className="text-sm text-muted-foreground">Manufacturer warranty included</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
