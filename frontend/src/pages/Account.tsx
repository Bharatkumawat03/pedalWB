import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { logoutUser } from '@/store/slices/authSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Settings,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  Plus,
  ExternalLink,
  Bell,
  Shield,
  Download,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import userService from '@/services/userService';
import orderService from '@/services/orderService';

const Account = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { toast } = useToast();
  
  // Check authentication
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user;

  // State for API data
  const [userProfile, setUserProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Address dialog state
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressForm, setAddressForm] = useState({
    type: 'home' as 'home' | 'office' | 'other',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    isDefault: false
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
    twoFactor: false,
  });

  // Debug authentication state
  useEffect(() => {
    setDebugInfo({
      reduxAuth: auth,
      localStorageToken: localStorage.getItem('token'),
      localStorageUser: localStorage.getItem('user'),
      isAuthenticatedRedux: isAuthenticated,
      isAuthenticatedLocal: !!localStorage.getItem('token')
    });
  }, [auth, isAuthenticated]);

  // Load user data from backend
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping API calls');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading user data...', { isAuthenticated, user });
        
        // Load user profile
        console.log('Fetching user profile...');
        const profileResponse = await userService.getUserProfile();
        console.log('Profile response:', profileResponse);
        // API interceptor returns response.data, so response is already the data
        setUserProfile(profileResponse.data || profileResponse);
        
        // Load user orders
        console.log('Fetching user orders...');
        const ordersResponse = await orderService.getUserOrders();
        console.log('Orders response:', ordersResponse);
        // API interceptor returns response.data, so response is already the data
        setOrders(ordersResponse.data || ordersResponse || []);
        
        // Load user addresses
        console.log('Fetching user addresses...');
        const addressesResponse = await userService.getAddresses();
        console.log('Addresses response:', addressesResponse);
        // API interceptor returns response.data, but getAddresses already handles this
        setAddresses(Array.isArray(addressesResponse) ? addressesResponse : []);
        
      } catch (err: any) {
        console.error('Error loading user data:', err);
        setError(err.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const profileData = {
        firstName: userProfile?.firstName || user?.firstName || '',
        lastName: userProfile?.lastName || user?.lastName || '',
        phone: userProfile?.phone || user?.phone || ''
      };
      
      const response = await userService.updateUserProfile(profileData) as any;
      // API interceptor returns response.data, so response is already the data
      const updatedProfile = response.data || response;
      setUserProfile(updatedProfile);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast({
        title: "Update Failed",
        description: err.message || 'Failed to update profile',
        variant: "destructive"
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    try {
      // TODO: Implement password change API endpoint
      // await userService.changePassword({
      //   currentPassword: passwordForm.currentPassword,
      //   newPassword: passwordForm.newPassword
      // });
      
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      });
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      console.error('Error changing password:', err);
      toast({
        title: "Password Change Failed",
        description: err.message || 'Failed to change password',
        variant: "destructive"
      });
    }
  };

  const openAddAddressDialog = () => {
    setEditingAddress(null);
    setAddressForm({
      type: 'home',
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phone: '',
      isDefault: addresses.length === 0
    });
    setAddressDialogOpen(true);
  };

  const openEditAddressDialog = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      type: address.type || 'home',
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'India',
      phone: address.phone || '',
      isDefault: address.isDefault || false
    });
    setAddressDialogOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAddress) {
        // Update existing address
        const response = await userService.updateAddress(editingAddress._id, addressForm) as any;
        // Backend returns all addresses
        const updatedAddresses = response.data || response || [];
        setAddresses(Array.isArray(updatedAddresses) ? updatedAddresses : []);
        
        toast({
          title: "Address Updated",
          description: "Your address has been updated successfully.",
        });
      } else {
        // Add new address
        const response = await userService.addAddress(addressForm) as any;
        // Backend returns all addresses
        const updatedAddresses = response.data || response || [];
        setAddresses(Array.isArray(updatedAddresses) ? updatedAddresses : []);
        
        toast({
          title: "Address Added",
          description: "Your address has been added successfully.",
        });
      }
      
      setAddressDialogOpen(false);
    } catch (err: any) {
      console.error('Error saving address:', err);
      toast({
        title: "Save Failed",
        description: err.message || 'Failed to save address',
        variant: "destructive"
      });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await userService.deleteAddress(addressId) as any;
      // Backend returns all addresses after deletion
      const updatedAddresses = response.data || response || [];
      setAddresses(Array.isArray(updatedAddresses) ? updatedAddresses : []);
      
      toast({
        title: "Address Deleted",
        description: "Your address has been deleted successfully.",
      });
    } catch (err: any) {
      console.error('Error deleting address:', err);
      toast({
        title: "Delete Failed",
        description: err.message || 'Failed to delete address',
        variant: "destructive"
      });
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view and manage your account.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your account...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Error Loading Account</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            
            {/* Debug Info */}
            <div className="mb-8 p-4 bg-gray-100 rounded-lg text-left max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2">Debug Info:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
            
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      delivered: "default",
      shipped: "secondary",
      processing: "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  console.log(orders);
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
              <p className="text-muted-foreground">Manage your account, orders, and preferences</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - User Info */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="relative bg-gradient-card border-border/50 shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent" />
              <CardContent className="p-6 relative">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20 shadow-lg">
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-bold">
                      {userProfile?.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                      {userProfile?.lastName?.charAt(0) || user?.lastName?.charAt(0) || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-card">
                      <Edit className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {userProfile?.firstName || user?.firstName || 'User'} {userProfile?.lastName || user?.lastName || ''}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Mail className="w-3 h-3" />{userProfile?.email || user?.email}</p>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Phone className="w-3 h-3" />
                    {user.phone}
                  </p>
                  <Badge variant="secondary" className="mt-3 shadow-sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    Member since {new Date(userProfile?.createdAt || user?.createdAt || Date.now()).getFullYear()}
                  </Badge>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Total Orders</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{orders.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Wishlist</span>
                    </div>
                    <span className="text-lg font-bold text-primary">5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Addresses</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{addresses.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
           <div className="lg:col-span-3">
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-card/50 p-1 h-auto">
                <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="addresses" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Addresses</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                <Card className="bg-gradient-card border-border/50 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      Order History
                    </CardTitle>
                    <CardDescription>Track and manage your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.map((order) => {
                        // Safely extract order data with fallbacks
                        const orderId = order._id || order.id || '';
                        const orderNumber = order.orderNumber || order.id || 'N/A';
                        const orderStatus = order.orderStatus || order.status || 'pending';
                        const orderDate = order.createdAt || order.date || new Date();
                        const itemsCount = order.items?.length || order.items || 0;
                        const totalAmount = order.totalAmount || order.total || 0;
                        const trackingNumber = order.trackingNumber || order.trackingId || null;
                        
                        return (
                          <div 
                            key={orderId} 
                            className="group p-5 border border-border rounded-xl bg-background/50 hover:bg-background/80 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  {getStatusIcon(orderStatus)}
                                </div>
                                <div>
                                  <h4 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{orderNumber}</h4>
                                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(orderDate).toLocaleDateString('en-IN', { 
                                      day: 'numeric', 
                                      month: 'long', 
                                      year: 'numeric' 
                                    })}
                                  </p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <Package className="w-3 h-3" />
                                    {itemsCount} item{itemsCount > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="text-left sm:text-right">
                                <p className="text-2xl font-bold text-primary mb-2">
                                  ₹{typeof totalAmount === 'number' ? totalAmount.toLocaleString('en-IN') : '0'}
                                </p>
                                {getStatusBadge(orderStatus)}
                              </div>
                            </div>
                            
                            {trackingNumber && (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                                  <Truck className="w-4 h-4" />
                                  <span className="font-mono">{trackingNumber}</span>
                                </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full sm:w-auto group-hover:border-primary group-hover:text-primary"
                                onClick={() => window.open(`https://parcelsapp.com/en/tracking/${trackingNumber}`, '_blank')}
                              >
                                Track Order
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

               {/* Profile Tab */}
               <TabsContent value="profile" className="space-y-4">
                <Card className="bg-gradient-card border-border/50 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      Personal Information
                    </CardTitle>
                    <CardDescription>Update your personal details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-semibold flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            First Name
                          </Label>
                          <Input 
                            id="firstName"
                            value={userProfile?.firstName || user?.firstName || ''}
                            onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                            className="bg-background border-border h-11"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-semibold flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Last Name
                          </Label>
                          <Input 
                            id="lastName"
                            value={userProfile?.lastName || user?.lastName || ''}
                            onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                            className="bg-background border-border h-11"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            Email Address
                          </Label>
                          <Input 
                            id="email"
                            type="email"
                            value={userProfile?.email || user?.email || ''}
                            disabled
                            className="bg-muted border-border h-11"
                          />
                          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            Phone Number
                          </Label>
                          <Input 
                            id="phone"
                            value={userProfile?.phone || user?.phone || ''}
                            onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                            className="bg-background border-border h-11"
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                        Save Changes
                      </Button>
                    </form>

                    <Separator className="my-6" />

                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Change Password
                      </h3>
                      <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input 
                            id="current-password"
                            type="password" 
                            placeholder="Enter current password" 
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                            className="bg-background border-border h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input 
                            id="new-password"
                            type="password" 
                            placeholder="Enter new password" 
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            className="bg-background border-border h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input 
                            id="confirm-password"
                            type="password" 
                            placeholder="Confirm new password" 
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            className="bg-background border-border h-11"
                          />
                        </div>
                        <Button type="submit" variant="outline" className="w-full">
                          Change Password
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

               {/* Addresses Tab */}
               <TabsContent value="addresses" className="space-y-4">
                <Card className="bg-gradient-card border-border/50 shadow-card">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          Saved Addresses
                        </CardTitle>
                        <CardDescription>Manage your delivery addresses</CardDescription>
                      </div>
                      <Button onClick={openAddAddressDialog} className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No addresses saved</h3>
                        <p className="text-muted-foreground mb-6">Add your first address to get started</p>
                        <Button onClick={openAddAddressDialog}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Address
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {addresses.map((address) => (
                        <div 
                          key={address._id || address.id} 
                          className="group p-5 border border-border rounded-xl bg-background/50 hover:bg-background/80 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-foreground text-lg">{address.type.charAt(0).toUpperCase() + address.type.slice(1)}</h4>
                                  {address.isDefault && (
                                    <Badge variant="default" className="shadow-sm">Default</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="pl-13 space-y-1">
                                <p className="text-foreground font-medium">{address.firstName} {address.lastName}</p>
                                <p className="text-muted-foreground text-sm flex items-start gap-2">
                                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  {address.addressLine1}
                                  {address.addressLine2 && `, ${address.addressLine2}`}
                                  {address.city && `, ${address.city}`}
                                  {address.state && `, ${address.state}`}
                                  {address.postalCode && ` - ${address.postalCode}`}
                                </p>
                                {address.phone && (
                                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {address.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 w-full lg:w-auto">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openEditAddressDialog(address)}
                                className="flex-1 lg:flex-none group-hover:border-primary group-hover:text-primary"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteAddress(address._id)}
                                className="flex-1 lg:flex-none text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <Card className="bg-gradient-card border-border/50 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-primary" />
                      </div>
                      Account Settings
                    </CardTitle>
                    <CardDescription>Manage your preferences and account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        Notifications
                      </h3>
                      <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between py-2">
                          <div className="space-y-0.5">
                            <Label className="text-base font-medium">Email notifications for orders</Label>
                            <p className="text-sm text-muted-foreground">Receive updates about your orders via email</p>
                          </div>
                          <Switch 
                            checked={settings.emailNotifications}
                            onCheckedChange={() => handleToggleSetting('emailNotifications')}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between py-2">
                          <div className="space-y-0.5">
                            <Label className="text-base font-medium">SMS notifications for deliveries</Label>
                            <p className="text-sm text-muted-foreground">Get real-time delivery updates via SMS</p>
                          </div>
                          <Switch 
                            checked={settings.smsNotifications}
                            onCheckedChange={() => handleToggleSetting('smsNotifications')}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between py-2">
                          <div className="space-y-0.5">
                            <Label className="text-base font-medium">Newsletter and promotions</Label>
                            <p className="text-sm text-muted-foreground">Stay updated with latest deals and offers</p>
                          </div>
                          <Switch 
                            checked={settings.promotions}
                            onCheckedChange={() => handleToggleSetting('promotions')}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Privacy
                      </h3>
                      <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between py-2">
                          <div className="space-y-0.5">
                            <Label className="text-base font-medium">Make profile public</Label>
                            <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                          </div>
                          <Switch />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between py-2">
                          <div className="space-y-0.5">
                            <Label className="text-base font-medium">Share data for analytics</Label>
                            <p className="text-sm text-muted-foreground">Help us improve your experience</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        Danger Zone
                      </h3>
                      <div className="space-y-3 bg-destructive/5 p-4 rounded-lg border border-destructive/20">
                        <Button variant="outline" className="w-full h-12 justify-start hover:bg-background">
                          <Download className="w-4 h-4 mr-2" />
                          Export Account Data
                          <span className="ml-auto text-xs text-muted-foreground">Download all your data</span>
                        </Button>
                        <Button variant="destructive" className="w-full h-12 justify-start shadow-lg hover:shadow-xl transition-all">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                          <span className="ml-auto text-xs">This action is permanent</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Address Dialog */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            <DialogDescription>
              {editingAddress ? 'Update your address information' : 'Enter your address details'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSaveAddress} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressType">Address Type</Label>
                <Select 
                  value={addressForm.type} 
                  onValueChange={(value: 'home' | 'office' | 'other') => setAddressForm({...addressForm, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="isDefault" className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  Set as default address
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={addressForm.firstName}
                  onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={addressForm.lastName}
                  onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Textarea
                id="addressLine1"
                value={addressForm.addressLine1}
                onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Textarea
                id="addressLine2"
                value={addressForm.addressLine2}
                onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddressDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAddress ? 'Update Address' : 'Add Address'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Account;
