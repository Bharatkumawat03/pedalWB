import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchWishlist, removeFromWishlist, toggleWishlist } from '@/store/slices/wishlistSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: wishlistItems, isLoading, error } = useSelector((state: RootState) => state.wishlist);
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      productId: item.product?._id || item.product?.id || item._id,
      quantity: 1,
      selectedColor: undefined,
      selectedSize: undefined
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Please Log In</h1>
            <p className="text-muted-foreground mb-8">
              You need to be logged in to view your wishlist.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Save your favorite items here for easy access later.
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/shop" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item: any) => (
            <Card key={item._id || item.id} className="group overflow-hidden hover:shadow-hover transition-all duration-300">
              <div className="relative">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-muted/30">
                  <img
                    src={item.product?.images?.[0]?.url || item.product?.image || '/placeholder-product.jpg'}
                    alt={item.product?.name || 'Product'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Remove Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => handleRemoveFromWishlist(item.product?._id || item.product?.id || item._id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              <CardContent className="p-4">
                <Link to={`/product/${item.product?._id || item.product?.id}`} className="block group">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
                    {item.product?.name || 'Unknown Product'}
                  </h3>
                </Link>

                <Badge variant="secondary" className="mb-3">
                  {item.product?.category || 'N/A'}
                </Badge>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-foreground">
                    ₹{(item.product?.price || item.price || 0).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    onClick={() => handleRemoveFromWishlist(item.product?._id || item.product?.id || item._id)}
                    variant="outline"
                    className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    size="sm"
                  >
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <Link to="/shop">
            <Button variant="outline" size="lg" className="mr-4">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/cart">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;