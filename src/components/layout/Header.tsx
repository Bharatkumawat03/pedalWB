import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setSearch } from '@/store/slices/filtersSlice';
import { logoutUser } from '@/store/slices/authSlice';
import pedalBharatLogo from '@/assets/pedalbharat-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu,
  X,
  LogOut
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items || []);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items || []);
  const searchValue = useSelector((state: RootState) => state.filters.search);
  
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user;
  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/categories' },
    { name: 'Brands', href: '/brands' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-md bg-background/95">
      {/* Top Bar */}
      <div className="border-b border-border/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="text-muted-foreground">
              📞 +91 123 456 7890 | support@pedalbharat.com
            </div>
            <div className="hidden md:flex items-center space-x-4 text-muted-foreground">
              <span>Free shipping on orders above ₹5,000</span>
              <span>•</span>
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={pedalBharatLogo} alt="PedalBharat" className="h-8 w-auto" />
            <span className="text-xl font-bold text-foreground hidden sm:block">PedalBharat</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search cycling gear..."
                value={searchValue}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchValue.trim()) {
                    window.location.href = '/shop';
                  }
                }}
                className="pl-10 bg-muted/50 border-muted focus:border-primary"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => window.location.href = '/shop'}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Account / Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/account">
                  <Button variant="ghost" size="icon" title={`Welcome, ${user?.firstName || 'User'}`}>
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Logout"
                  className="hidden sm:flex"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <div className="border-t border-border pt-2 mt-2">
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Welcome, {user?.firstName || 'User'}
                </div>
                <Link
                  to="/account"
                  className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-border pt-2 mt-2 space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search cycling gear..."
                  value={searchValue}
                  onChange={(e) => dispatch(setSearch(e.target.value))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchValue.trim()) {
                      window.location.href = '/shop';
                    }
                  }}
                  className="pl-10 bg-muted/50 border-muted"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
