import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { logoutUser } from '@/store/slices/authSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings,
  Package,
  Truck,
  CheckCircle,
  Clock,
  LogOut
} from 'lucide-react';
import userService from '@/services/userService';
import orderService from '@/services/orderService';

const Account = () => {
  const dispatch = useDispatch<AppDispatch>();
  
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

  // Load user data from backend
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load user profile
        const profileResponse = await userService.getProfile();
        setUserProfile(profileResponse.data);
        
        // Load user orders
        const ordersResponse = await orderService.getUserOrders();
        setOrders(ordersResponse.data || []);
        
        // Load user addresses
        const addressesResponse = await userService.getAddresses();
        setAddresses(addressesResponse.data || []);
        
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

  const handleUpdateProfile = async (formData: any) => {
    try {
      const response = await userService.updateProfile(formData);
      setUserProfile(response.data);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleAddAddress = async (addressData: any) => {
    try {
      const response = await userService.addAddress(addressData);
      setAddresses([...addresses, response.data]);
    } catch (err: any) {
      console.error('Error adding address:', err);
      setError(err.message || 'Failed to add address');
    }
  };

  const handleUpdateAddress = async (addressId: string, addressData: any) => {
    try {
      const response = await userService.updateAddress(addressId, addressData);
      setAddresses(addresses.map(addr => 
        addr.id === addressId ? response.data : addr
      ));
    } catch (err: any) {
      console.error('Error updating address:', err);
      setError(err.message || 'Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await userService.deleteAddress(addressId);
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    } catch (err: any) {
      console.error('Error deleting address:', err);
      setError(err.message || 'Failed to delete address');
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
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="lg:col-span-1">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {userProfile?.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                      {userProfile?.lastName?.charAt(0) || user?.lastName?.charAt(0) || ''}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-foreground">
                    {userProfile?.firstName || user?.firstName || 'User'} {userProfile?.lastName || user?.lastName || ''}
                  </h3>
                  <p className="text-sm text-muted-foreground">{userProfile?.email || user?.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    Member since {new Date(userProfile?.createdAt || user?.createdAt || Date.now()).getFullYear()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{orders.length} Orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Wishlist Items</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{addresses.length} Addresses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="addresses" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Order History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No orders found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order._id || order.id} className="p-4 border border-border rounded-lg bg-background/50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(order.status)}
                                <div>
                                  <h4 className="font-semibold text-foreground">{order.orderNumber || order._id}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.createdAt || order.date).toLocaleDateString('en-IN')} • {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">₹{order.totalAmount?.toLocaleString('en-IN') || order.total?.toLocaleString('en-IN')}</p>
                                {getStatusBadge(order.status)}
                              </div>
                            </div>
                            
                            {order.trackingNumber && (
                              <div className="flex items-center justify-between pt-3 border-t border-border">
                                <span className="text-sm text-muted-foreground">
                                  Tracking ID: {order.trackingNumber}
                                </span>
                                <Button variant="outline" size="sm" onClick={() => window.open(`https://parcelsapp.com/en/tracking/${order.trackingNumber}`, '_blank') }>
                                  Track Order
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      handleUpdateProfile({
                        firstName: formData.get('firstName'),
                        lastName: formData.get('lastName'),
                        email: formData.get('email'),
                        phone: formData.get('phone')
                      });
                    }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            First Name
                          </label>
                          <Input 
                            name="firstName"
                            defaultValue={userProfile?.firstName || user?.firstName || ''} 
                            className="bg-background border-border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Last Name
                          </label>
                          <Input 
                            name="lastName"
                            defaultValue={userProfile?.lastName || user?.lastName || ''} 
                            className="bg-background border-border"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <Input 
                          name="email"
                          type="email"
                          defaultValue={userProfile?.email || user?.email || ''} 
                          className="bg-background border-border"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <Input 
                          name="phone"
                          type="tel"
                          defaultValue={userProfile?.phone || user?.phone || ''} 
                          className="bg-background border-border"
                        />
                      </div>

                      <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Saved Addresses
                      </CardTitle>
                      <Button onClick={() => {
                        // Add new address functionality
                        const newAddress = {
                          type: 'Home',
                          name: userProfile?.firstName || user?.firstName || 'User',
                          address: '',
                          city: '',
                          state: '',
                          pincode: '',
                          phone: userProfile?.phone || user?.phone || ''
                        };
                        handleAddAddress(newAddress);
                      }}>
                        Add New Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No addresses found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div key={address._id || address.id} className="p-4 border border-border rounded-lg bg-background/50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-foreground">{address.type || 'Address'}</h4>
                                  {address.isDefault && (
                                    <Badge variant="default">Default</Badge>
                                  )}
                                </div>
                                <p className="text-foreground">{address.name || address.fullName}</p>
                                <p className="text-muted-foreground">{address.address}</p>
                                <p className="text-muted-foreground">{address.city}, {address.state} - {address.pincode}</p>
                                <p className="text-muted-foreground">{address.phone}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => {
                                  // Edit address functionality
                                  const updatedData = prompt('Enter new address:', address.address);
                                  if (updatedData) {
                                    handleUpdateAddress(address._id || address.id, { ...address, address: updatedData });
                                  }
                                }}>
                                  Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => {
                                  if (confirm('Are you sure you want to delete this address?')) {
                                    handleDeleteAddress(address._id || address.id);
                                  }
                                }}>
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
              <TabsContent value="settings">
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">Email notifications for orders</span>
                          <input type="checkbox" defaultChecked className="toggle" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">SMS notifications for deliveries</span>
                          <input type="checkbox" defaultChecked className="toggle" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">Newsletter and promotions</span>
                          <input type="checkbox" className="toggle" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Privacy</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">Make profile public</span>
                          <input type="checkbox" className="toggle" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">Share data for analytics</span>
                          <input type="checkbox" defaultChecked className="toggle" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Danger Zone</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full">
                          Export Account Data
                        </Button>
                        <Button variant="destructive" className="w-full">
                          Delete Account
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
    </div>
  );
};

export default Account;
