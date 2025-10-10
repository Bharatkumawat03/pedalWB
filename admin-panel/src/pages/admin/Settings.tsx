import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SettingsActions } from "@/components/admin/SettingsActions";
import { useToast } from "@/hooks/use-toast";
import { 
  Store, 
  Mail, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Globe,
  Save,
  RefreshCw
} from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Cycle Hub",
    storeDescription: "Premium bicycles and cycling gear for every adventure",
    storeEmail: "admin@cyclehub.com",
    storePhone: "+91 9876543210",
    currency: "INR",
    timezone: "Asia/Kolkata"
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    newUserRegistrations: false,
    weeklyReports: true
  });

  // Security Settings State
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAttempts: "5"
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackupCreate = async () => {
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create and download a mock backup file
    const backupData = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      data: {
        settings: generalSettings,
        notifications,
        security,
        users: 1284,
        products: 156,
        orders: 892
      }
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBackupRestore = async (file: File) => {
    // Simulate backup restoration
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('Restoring from file:', file.name);
  };

  const handleCacheFlush = async () => {
    // Simulate cache flush
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSystemReset = async () => {
    // Simulate system reset
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Reset all states to defaults
    setGeneralSettings({
      storeName: "Cycle Hub",
      storeDescription: "Premium bicycles and cycling gear for every adventure",
      storeEmail: "admin@cyclehub.com",
      storePhone: "+91 9876543210",
      currency: "INR",
      timezone: "Asia/Kolkata"
    });
    setNotifications({
      emailNotifications: true,
      orderAlerts: true,
      lowStockAlerts: true,
      newUserRegistrations: false,
      weeklyReports: true
    });
    setSecurity({
      twoFactorAuth: false,
      sessionTimeout: "30",
      loginAttempts: "5"
    });
  };

  return (
    <AdminLayout title="Settings">
      <div className="space-y-8">
        {/* System Status */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health and performance</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                All Systems Operational
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <div className="text-2xl font-bold text-primary">2.1s</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <div className="text-2xl font-bold text-primary">1,284</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic store configuration and details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={generalSettings.storeName}
                  onChange={(e) => setGeneralSettings({...generalSettings, storeName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  value={generalSettings.storeDescription}
                  onChange={(e) => setGeneralSettings({...generalSettings, storeDescription: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={generalSettings.storeEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, storeEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    value={generalSettings.storePhone}
                    onChange={(e) => setGeneralSettings({...generalSettings, storePhone: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure your notification preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      {key === 'emailNotifications' && 'Receive notifications via email'}
                      {key === 'orderAlerts' && 'Get notified about new orders'}
                      {key === 'lowStockAlerts' && 'Alert when inventory is low'}
                      {key === 'newUserRegistrations' && 'Notify when new users register'}
                      {key === 'weeklyReports' && 'Receive weekly performance reports'}
                    </div>
                  </div>
                  <Switch 
                    checked={value}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, [key]: checked})
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage security and access controls</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <div className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <Switch 
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setSecurity({...security, twoFactorAuth: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                <Input
                  id="loginAttempts"
                  type="number"
                  value={security.loginAttempts}
                  onChange={(e) => setSecurity({...security, loginAttempts: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Color Theme</Label>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {['Blue', 'Green', 'Purple'].map((color) => (
                      <div key={color} className="relative">
                        <Button
                          variant="outline"
                          className={`w-full h-12 ${color === 'Blue' ? 'ring-2 ring-primary' : ''}`}
                        >
                          <div className={`w-6 h-6 rounded-full ${
                            color === 'Blue' ? 'bg-blue-500' :
                            color === 'Green' ? 'bg-green-500' : 'bg-purple-500'
                          }`} />
                          {color}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-base">Layout Options</Label>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Compact Mode</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dark Mode</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API & Integration Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>API & Integrations</CardTitle>
                <CardDescription>Manage external integrations and API settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Payment Gateway</div>
                    <div className="text-sm text-muted-foreground">Stripe, Razorpay integration</div>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success">Connected</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Email Service</div>
                    <div className="text-sm text-muted-foreground">SendGrid, Mailgun</div>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success">Connected</Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">SMS Gateway</div>
                    <div className="text-sm text-muted-foreground">Twilio, SMS service</div>
                  </div>
                  <Badge variant="outline" className="bg-warning/10 text-warning">Pending</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Analytics</div>
                    <div className="text-sm text-muted-foreground">Google Analytics</div>
                  </div>
                  <Badge variant="outline" className="bg-muted/10 text-muted-foreground">Not Connected</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Management Actions */}
        <SettingsActions
          onBackupCreate={handleBackupCreate}
          onBackupRestore={handleBackupRestore}
          onCacheFlush={handleCacheFlush}
          onSystemReset={handleSystemReset}
        />

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" disabled={loading} onClick={handleSystemReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading} className="min-w-[120px]">
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}