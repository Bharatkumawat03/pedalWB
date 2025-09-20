import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  Clock
} from 'lucide-react';

const Account = () => {
  const [user] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    joinDate: '2023-06-15'
  });

  const [orders] = useState([
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 45000,
      items: 2,
      trackingId: 'TRK123456789'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 18000,
      items: 1,
      trackingId: 'TRK987654321'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-08',
      status: 'processing',
      total: 92000,
      items: 3,
      trackingId: null
    }
  ]);

  const [addresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'Rajesh Kumar',
      address: '123 MG Road, Bangalore, Karnataka 560001',
      phone: '+91 98765 43210',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      name: 'Rajesh Kumar',
      address: '456 Brigade Road, Bangalore, Karnataka 560025',
      phone: '+91 98765 43210',
      isDefault: false
    }
  ]);

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
          <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your account, orders, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - User Info */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    Member since {new Date(user.joinDate).getFullYear()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{orders.length} Orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">5 Wishlist Items</span>
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
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 border border-border rounded-lg bg-background/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(order.status)}
                              <div>
                                <h4 className="font-semibold text-foreground">{order.id}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.date).toLocaleDateString('en-IN')} • {order.items} item{order.items > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">₹{order.total.toLocaleString('en-IN')}</p>
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                          
                          {order.trackingId && (
                            <div className="flex items-center justify-between pt-3 border-t border-border">
                              <span className="text-sm text-muted-foreground">
                                Tracking ID: {order.trackingId}
                              </span>
                              <Button variant="outline" size="sm" onClick={() => window.open(`https://parcelsapp.com/en/tracking/${order.trackingId}`, '_blank') }>
                                Track Order
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Full Name
                          </label>
                          <Input 
                            defaultValue={user.name} 
                            className="bg-background border-border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Phone Number
                          </label>
                          <Input 
                            defaultValue={user.phone} 
                            className="bg-background border-border"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <Input 
                          defaultValue={user.email} 
                          className="bg-background border-border"
                        />
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <Input 
                            type="password" 
                            placeholder="Current Password" 
                            className="bg-background border-border"
                          />
                          <Input 
                            type="password" 
                            placeholder="New Password" 
                            className="bg-background border-border"
                          />
                          <Input 
                            type="password" 
                            placeholder="Confirm New Password" 
                            className="bg-background border-border"
                          />
                        </div>
                      </div>

                      <Button className="w-full">Save Changes</Button>
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
                      <Button>Add New Address</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="p-4 border border-border rounded-lg bg-background/50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-foreground">{address.type}</h4>
                                {address.isDefault && (
                                  <Badge variant="default">Default</Badge>
                                )}
                              </div>
                              <p className="text-foreground">{address.name}</p>
                              <p className="text-muted-foreground">{address.address}</p>
                              <p className="text-muted-foreground">{address.phone}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="destructive" size="sm">Delete</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
