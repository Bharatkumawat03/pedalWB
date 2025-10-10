import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAdminData } from "@/hooks/useAdminData";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Activity,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  TrendingDown,
  Bell,
  Calendar,
  Target,
  Percent
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, users, orders } = useAdminData();

  // Calculate comprehensive stats
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const lowStockProducts = products.filter(p => p.stock < 5 && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length;

  // Advanced metrics
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = 12.4; // Mock conversion rate
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const newUsersThisMonth = Math.floor(totalUsers * 0.15);

  // Revenue chart data (last 7 days)
  const revenueData = [
    { day: 'Mon', revenue: 12500, orders: 45 },
    { day: 'Tue', revenue: 15800, orders: 52 },
    { day: 'Wed', revenue: 14200, orders: 48 },
    { day: 'Thu', revenue: 18900, orders: 61 },
    { day: 'Fri', revenue: 22400, orders: 73 },
    { day: 'Sat', revenue: 19800, orders: 65 },
    { day: 'Sun', revenue: 17200, orders: 58 }
  ];

  // Order status distribution
  const orderStatusData = [
    { name: 'Completed', value: completedOrders, color: 'hsl(var(--success))' },
    { name: 'Processing', value: processingOrders, color: 'hsl(var(--warning))' },
    { name: 'Pending', value: pendingOrders, color: 'hsl(var(--info))' },
    { name: 'Shipped', value: shippedOrders, color: 'hsl(var(--primary))' },
    { name: 'Cancelled', value: cancelledOrders, color: 'hsl(var(--destructive))' }
  ].filter(item => item.value > 0);

  // Top products
  const topProducts = products.slice(0, 5).map(p => ({
    name: p.name,
    sales: Math.floor(Math.random() * 500) + 100,
    revenue: Math.floor(Math.random() * 50000) + 10000
  }));

  // Recent activity timeline
  const recentActivity = [
    { id: 1, type: 'order', message: 'New order #12345 received', time: '2 minutes ago', icon: ShoppingCart },
    { id: 2, type: 'user', message: 'New user registration: John Doe', time: '15 minutes ago', icon: Users },
    { id: 3, type: 'product', message: 'Product "Mountain Bike" stock low', time: '1 hour ago', icon: AlertTriangle },
    { id: 4, type: 'order', message: 'Order #12340 shipped', time: '2 hours ago', icon: Package },
    { id: 5, type: 'payment', message: 'Payment received: ₹25,000', time: '3 hours ago', icon: DollarSign },
    { id: 6, type: 'user', message: '5 new user registrations', time: '4 hours ago', icon: Users },
  ];

  // System alerts
  const alerts = [
    { id: 1, type: 'warning', message: `${lowStockProducts} products are low in stock`, action: 'View Inventory' },
    { id: 2, type: 'error', message: `${outOfStockProducts} products are out of stock`, action: 'Restock Now' },
    { id: 3, type: 'info', message: `${pendingOrders} orders pending review`, action: 'Review Orders' },
  ].filter(alert => {
    if (alert.type === 'warning' && lowStockProducts === 0) return false;
    if (alert.type === 'error' && outOfStockProducts === 0) return false;
    if (alert.type === 'info' && pendingOrders === 0) return false;
    return true;
  });

  const recentOrders = orders.slice(-5).reverse();

  return (
    <AdminLayout title="Dashboard">
      {/* Alert Banner */}
      {alerts.length > 0 && (
        <Card className="border-warning bg-warning/10 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (alert.action.includes('Inventory')) navigate('/admin/products');
                        if (alert.action.includes('Orders')) navigate('/admin/orders');
                      }}
                    >
                      {alert.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Primary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div onClick={() => navigate('/admin/products')} className="cursor-pointer">
          <StatsCard
            title="Total Products"
            value={totalProducts.toLocaleString()}
            change="+12.5%"
            changeType="positive"
            icon={Package}
            description={`${activeProducts} active products`}
          />
        </div>
        <div onClick={() => navigate('/admin/users')} className="cursor-pointer">
          <StatsCard
            title="Total Users"
            value={totalUsers.toLocaleString()}
            change="+18.2%"
            changeType="positive"
            icon={Users}
            description={`${activeUsers} active users`}
          />
        </div>
        <div onClick={() => navigate('/admin/orders')} className="cursor-pointer">
          <StatsCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            change="+8.7%"
            changeType="positive"
            icon={ShoppingCart}
            description={`${completedOrders} completed`}
          />
        </div>
        <div onClick={() => navigate('/admin/settings')} className="cursor-pointer">
          <StatsCard
            title="Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            change="+22.1%"
            changeType="positive"
            icon={DollarSign}
            description="Total revenue"
          />
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">₹{averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +5.2% vs last week
                </p>
              </div>
              <Target className="h-10 w-10 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate}%</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +2.4% vs last week
                </p>
              </div>
              <Percent className="h-10 w-10 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Users</p>
                <p className="text-2xl font-bold">{newUsersThisMonth}</p>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </div>
              <Users className="h-10 w-10 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
                <p className="text-xs text-warning flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  Needs attention
                </p>
              </div>
              <ShoppingCart className="h-10 w-10 text-warning/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Overview
            </CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="day" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Order Status Distribution
            </CardTitle>
            <CardDescription>Current order status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{}}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Analytics and Activity Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Products */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Top Products
            </CardTitle>
            <CardDescription>Best performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                        </div>
                      </div>
                      <p className="font-semibold text-success">₹{product.revenue.toLocaleString()}</p>
                    </div>
                    <Progress value={(product.sales / 500) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Recent Orders
              </CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>
              <Eye className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => navigate('/admin/orders')}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={order.customer.avatar}
                          alt={order.customer.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-semibold">₹{order.total.toLocaleString()}</p>
                        <Badge className={`text-xs ${
                          order.status === "Completed" ? "bg-success/20 text-success hover:bg-success/30" :
                          order.status === "Processing" ? "bg-warning/20 text-warning hover:bg-warning/30" :
                          order.status === "Shipped" ? "bg-info/20 text-info hover:bg-info/30" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No recent orders</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                  <p className="text-3xl font-bold text-success">{activeProducts}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={(activeProducts / totalProducts) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {((activeProducts / totalProducts) * 100).toFixed(1)}% of total inventory
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                  <p className="text-3xl font-bold text-warning">{lowStockProducts}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={(lowStockProducts / totalProducts) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {((lowStockProducts / totalProducts) * 100).toFixed(1)}% needs restocking
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <Package className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                  <p className="text-3xl font-bold text-destructive">{outOfStockProducts}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={(outOfStockProducts / totalProducts) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {((outOfStockProducts / totalProducts) * 100).toFixed(1)}% unavailable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used admin tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              onClick={() => navigate('/admin/products')}
              className="h-24 flex-col gap-2 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
            >
              <Plus className="h-6 w-6" />
              <span className="font-semibold">Add Product</span>
            </Button>
            <Button 
              onClick={() => navigate('/admin/users')}
              variant="outline" 
              className="h-24 flex-col gap-2 hover:bg-muted hover:scale-105 transition-transform"
            >
              <Users className="h-6 w-6" />
              <span className="font-semibold">Manage Users</span>
            </Button>
            <Button 
              onClick={() => navigate('/admin/orders')}
              variant="outline" 
              className="h-24 flex-col gap-2 hover:bg-muted hover:scale-105 transition-transform"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="font-semibold">View Orders</span>
            </Button>
            <Button 
              onClick={() => navigate('/admin/analytics')}
              variant="outline" 
              className="h-24 flex-col gap-2 hover:bg-muted hover:scale-105 transition-transform"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="font-semibold">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}