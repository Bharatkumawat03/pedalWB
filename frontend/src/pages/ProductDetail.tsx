import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
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
import ProductCard from '@/components/product/ProductCard';
import ReviewsSection from '@/components/product/ReviewsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductAndProducts = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the product and all products in parallel
        const [productResponse, productsResponse] = await Promise.all([
          productService.getProduct(id),
          productService.getProducts({ limit: 100 })
        ]);
        
        // API returns { data: { ...product } }
        const productData = productResponse.data || productResponse;
        setProduct(productData);
        
        // Store all products
        setAllProducts(productsResponse.data || []);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndProducts();
  }, [id]);
  
  // Safely access wishlist state with fallback
  const wishlistState = useSelector((state: RootState) => state.wishlist);
  const wishlistItems = wishlistState?.items || [];
  
  const isInWishlist = wishlistItems.some((item: any) => 
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
    if (id) {
      const productId = product.id || product._id || id;
      try {
        await dispatch(addToCart({ productId, quantity })).unwrap();
      } catch (error: any) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const handleToggleWishlist = async () => {
    if (id) {
      const productId = product.id || product._id || id;
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

  const isOutOfStock = !product.inventory.inStock || (product.inventory.quantity !== undefined && product.inventory.quantity <= 0);

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

  // Create product images array for gallery
  // Images are objects with url property, extract URLs
  const getImageUrl = (image: any) => {
    if (typeof image === 'string') return image;
    if (image?.url) return image.url;
    return '';
  };

  const productImages = product.images && product.images.length > 0 
    ? product.images.map((img: any) => getImageUrl(img))
    : product.image 
    ? [product.image, product.image, product.image, product.image]
    : [];

  // Filter similar products from all products
  const similarProducts = allProducts
    .filter(p => {
      const productId = product.id || product._id;
      const pId = p.id || p._id;
      
      const isSameCategory = p.category === product.category || 
                            (product.category && p.category?.toLowerCase() === product.category.toLowerCase());
      const isDifferentProduct = pId !== productId;
      const isInStock = p.isInStock === true || 
                       (p.inventory?.inStock === true && 
                        (p.inventory?.quantity === undefined || p.inventory?.quantity > 0));
      return isSameCategory && isDifferentProduct && isInStock;
    })
    .slice(0, 5);

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
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.isInStock || (product.inventory?.inStock && product.inventory?.quantity > 0) ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
  
              {/* Features */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
  
              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-medium text-foreground">Quantity:</label>
                  <div className="flex border border-border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-border">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
  
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.isInStock && !(product.inventory?.inStock && product.inventory?.quantity > 0)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
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
                    <Heart 
                      className={`w-5 h-5 ${isInWishlist ? 'fill-primary text-primary' : ''}`} 
                    />
                  </Button>
                  
                  <Button variant="outline" size="lg" className="px-6">
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
  
          {/* Product Details and Reviews Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="specifications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Reviews ({reviewCount})
                </TabsTrigger>
              </TabsList>
  
              <TabsContent value="description" className="mt-8">
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {product.description}
                  </p>
                  
                  <h3 className="text-xl font-bold text-foreground mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
  
              <TabsContent value="specifications" className="mt-8">
                <Card>
                  <CardContent className="p-6">
                    {product.specifications ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-3 border-b border-border last:border-0">
                            <span className="font-medium text-foreground">{key}</span>
                            <span className="text-muted-foreground">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Detailed specifications coming soon.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
  
              <TabsContent value="reviews" className="mt-8">
                <ReviewsSection 
                  productId={product.id || product._id}
                  averageRating={ratingValue}
                  totalReviews={reviewCount}
                />
              </TabsContent>
            </Tabs>
          </div>
  
          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Similar Products
                </h2>
                <p className="text-muted-foreground">
                  More items you might like from {product.category}
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
                {similarProducts.map((similarProduct) => (
                  <ProductCard key={similarProduct.id || similarProduct._id} product={similarProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ProductDetail;