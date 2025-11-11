import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setSearch, setCategory, toggleBrand, resetFilters } from '@/store/slices/filtersSlice';
import pedalBharatLogo from '@/assets/pedalbharat-logo.png';
import { ChevronDown } from 'lucide-react';
import { categories, brands } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu,
  X
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Safely destructure auth state with fallbacks
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user;
  
  const cartItems = useSelector((state: RootState) => state.cart.items || []);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items || []);
  const searchValue = useSelector((state: RootState) => state.filters.search);
  
  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const wishlistCount = wishlistItems.length;

  const handleCategoryClick = (categoryId: string) => {
    dispatch(setCategory(categoryId));
    navigate('/shop');
    setShowCategoriesDropdown(false);
  };

  const handleBrandClick = (brand: string) => {
    dispatch(resetFilters());
    dispatch(toggleBrand(brand));
    navigate('/shop');
    setShowBrandsDropdown(false);
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
    <header className="bg-background sticky top-0 z-50 backdrop-blur-md bg-background/95">
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
      <div className="w-full lg:border-b border-border/50 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
           {/* Mobile Menu Toggle */}
           <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* <img src={pedalBharatLogo} alt="PedalBharat" className="h-8 w-auto" /> */}
            <span className="text-xl font-bold text-foreground">PedalIndia</span>
          </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link to="/shop" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Shop
            </Link>
            
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <div className="flex items-center gap-1 text-foreground hover:text-primary transition-colors duration-200 font-medium">
                <Link to="/categories" className="cursor-pointer">
                  Categories
                </Link>
                <ChevronDown className="w-4 h-4 cursor-pointer" />
              </div>
              {showCategoriesDropdown && (
                <div className="absolute top-full left-0 mt-0 pt-2 w-64 z-50">
                  <div className="bg-background border border-border rounded-lg shadow-hover p-2">
                    {categories.filter(cat => cat.id !== 'all').map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className="w-full text-left px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-foreground">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Brands Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowBrandsDropdown(true)}
              onMouseLeave={() => setShowBrandsDropdown(false)}
            >
              <div className="flex items-center gap-1 text-foreground hover:text-primary transition-colors duration-200 font-medium">
                <Link to="/brands" className="cursor-pointer">
                  Brands
                </Link>
                <ChevronDown className="w-4 h-4 cursor-pointer" />
              </div>
              {showBrandsDropdown && (
                <div className="absolute top-full left-0 mt-0 pt-2 w-64 z-50">
                  <div className="bg-background border border-border rounded-lg shadow-hover p-2 max-h-96 overflow-y-auto">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => handleBrandClick(brand)}
                        className="w-full text-left px-4 py-2 hover:bg-muted rounded-md transition-colors text-foreground"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/blog" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Blog
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Contact
            </Link>
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
                    if (e.key === 'Enter') {
                      if (searchValue.trim()) {
                        navigate('/shop');
                      }
                    }
                  }}
                  onFocus={() => {
                    if (window.location.pathname !== '/shop') {
                      navigate('/shop');
                    }
                  }}
                  className="pl-10 bg-muted/50 border-muted focus:border-primary focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search */}
            {/* <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => window.location.href = '/shop'}
            >
              <Search className="w-5 h-5" />
            </Button> */}

            {/* Wishlist - Always visible but will redirect to login if not authenticated */}
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

            {/* Cart - Always visible and works without authentication */}
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

            {/* Profile Icon - Always visible */}
            <Link to="/account">
              <Button variant="ghost" size="icon" title={isAuthenticated ? `Welcome, ${user?.firstName || 'User'}` : 'Sign in to your account'}>
                <User className="w-5 h-5" />
              </Button>
            </Link>

           
          </div>
        </div>
      </div>

        {/* Mobile Search Bar - Advanced and Functional */}
        <div className="lg:hidden">
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for Products"
              value={searchValue}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (searchValue.trim()) {
                    navigate('/shop');
                  }
                }
              }}
              onFocus={() => {
                if (window.location.pathname !== '/shop') {
                  navigate('/shop');
                }
              }}
              className="pl-11 pr-4 h-11 bg-background border-border rounded-lg text-sm focus:ring-2 focus:ring-primary"
            />
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
              </div>
            ) : (
              <div className="border-t border-border pt-2 mt-2">
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Sign in to access your account and wishlist
                </div>
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
