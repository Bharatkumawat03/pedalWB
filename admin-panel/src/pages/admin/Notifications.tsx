import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Package, ShoppingCart, Users, AlertTriangle, CheckCircle2, Trash2, Check, Search, Filter, Archive } from "lucide-react";

interface Notification {
  id: string;
  type: "order" | "product" | "user" | "alert";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "New Order Received",
    message: "Order #12345 has been placed by John Doe",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: "2",
    type: "product",
    title: "Low Stock Alert",
    message: "Product 'Wireless Mouse' is running low on stock",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "3",
    type: "user",
    title: "New User Registration",
    message: "Sarah Johnson has created a new account",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: "4",
    type: "alert",
    title: "System Update",
    message: "New features have been added to your dashboard",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
  },
  {
    id: "5",
    type: "order",
    title: "Order Shipped",
    message: "Order #12340 has been shipped",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: true,
  },
  {
    id: "6",
    type: "product",
    title: "Product Review",
    message: "New review added for 'Laptop Stand'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    read: false,
  },
  {
    id: "7",
    type: "user",
    title: "User Login",
    message: "Admin user logged in from new device",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
  {
    id: "8",
    type: "alert",
    title: "Security Alert",
    message: "Unusual activity detected in your account",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    read: false,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const filteredNotifications = notifications
    .filter(n => filter === "all" || !n.read)
    .filter(n => typeFilter === "all" || n.type === typeFilter)
    .filter(n => 
      searchTerm === "" || 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const unreadCount = notifications.filter(n => !n.read).length;
  const typeStats = {
    order: notifications.filter(n => n.type === "order").length,
    product: notifications.filter(n => n.type === "product").length,
    user: notifications.filter(n => n.type === "user").length,
    alert: notifications.filter(n => n.type === "alert").length,
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setSelectedNotifications([]);
  };

  const markSelectedAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => 
        selectedNotifications.includes(notif.id) ? { ...notif, read: true } : notif
      )
    );
    setSelectedNotifications([]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    setSelectedNotifications(prev => prev.filter(nId => nId !== id));
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
    setSelectedNotifications([]);
  };

  const toggleSelection = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5" />;
      case "product":
        return <Package className="h-5 w-5" />;
      case "user":
        return <Users className="h-5 w-5" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-info";
      case "product":
        return "text-warning";
      case "user":
        return "text-success";
      case "alert":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "order":
        return "bg-info/10";
      case "product":
        return "bg-warning/10";
      case "user":
        return "bg-success/10";
      case "alert":
        return "bg-destructive/10";
      default:
        return "bg-muted";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <AdminLayout title="Notifications">
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="hover-scale transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
              <p className="text-xs text-muted-foreground">All notifications</p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typeStats.order}</div>
              <p className="text-xs text-muted-foreground">Order updates</p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typeStats.alert}</div>
              <p className="text-xs text-muted-foreground">System alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>
                  Manage and track all your system notifications
                </CardDescription>
              </div>
              
              {selectedNotifications.length > 0 && (
                <div className="flex items-center gap-2 animate-scale-in">
                  <Badge variant="secondary">{selectedNotifications.length} selected</Badge>
                  <Button variant="outline" size="sm" onClick={markSelectedAsRead}>
                    <Check className="h-4 w-4 mr-2" />
                    Mark Read
                  </Button>
                  <Button variant="outline" size="sm" onClick={deleteSelected}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="order">Orders</SelectItem>
                  <SelectItem value="product">Products</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                </SelectContent>
              </Select>

              <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread {unreadCount > 0 && `(${unreadCount})`}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {unreadCount > 0 && (
                <Button variant="outline" onClick={markAllAsRead}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <ScrollArea className="h-[calc(100vh-400px)] pr-4">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || typeFilter !== "all"
                      ? "No notifications match your filters."
                      : filter === "unread" 
                      ? "You're all caught up! No unread notifications."
                      : "You don't have any notifications yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        !notification.read 
                          ? "bg-accent/10 border-accent/30" 
                          : "bg-card hover:bg-accent/5"
                      }`}
                    >
                      <Checkbox
                        checked={selectedNotifications.includes(notification.id)}
                        onCheckedChange={() => toggleSelection(notification.id)}
                        className="mt-1"
                      />
                      
                      <div className={`mt-1 p-2 rounded-lg ${getNotificationBg(notification.type)} ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold">{notification.title}</h4>
                            {!notification.read && (
                              <Badge variant="default" className="h-5 text-xs">New</Badge>
                            )}
                            <Badge variant="outline" className="h-5 text-xs capitalize">
                              {notification.type}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                            className="hover-scale"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete notification"
                          className="hover-scale text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {filteredNotifications.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onCheckedChange={toggleAllSelection}
                  />
                  <span className="text-sm text-muted-foreground">
                    {selectedNotifications.length > 0 
                      ? `${selectedNotifications.length} of ${filteredNotifications.length} selected`
                      : "Select all"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
