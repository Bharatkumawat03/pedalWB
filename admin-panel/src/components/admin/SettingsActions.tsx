import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Mail,
  Key,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsActionsProps {
  onBackupCreate: () => Promise<void>;
  onBackupRestore: (file: File) => Promise<void>;
  onCacheFlush: () => Promise<void>;
  onSystemReset: () => Promise<void>;
}

export function SettingsActions({
  onBackupCreate,
  onBackupRestore,
  onCacheFlush,
  onSystemReset
}: SettingsActionsProps) {
  const { toast } = useToast();
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [apiKeys, setApiKeys] = useState({
    stripe: '••••••••••••••••••••••••••••••••',
    email: '••••••••••••••••••••••••••••••••',
    sms: '••••••••••••••••••••••••••••••••'
  });

  const handleBackup = async () => {
    setLoading(true);
    try {
      await onBackupCreate();
      toast({
        title: "Backup Created",
        description: "System backup has been created successfully"
      });
      setBackupDialogOpen(false);
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to create system backup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) return;
    
    setLoading(true);
    try {
      await onBackupRestore(restoreFile);
      toast({
        title: "Restore Complete",
        description: "System has been restored from backup"
      });
      setRestoreDialogOpen(false);
      setRestoreFile(null);
    } catch (error) {
      toast({
        title: "Restore Failed",
        description: "Failed to restore from backup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCacheFlush = async () => {
    setLoading(true);
    try {
      await onCacheFlush();
      toast({
        title: "Cache Cleared",
        description: "System cache has been cleared successfully"
      });
    } catch (error) {
      toast({
        title: "Cache Clear Failed",
        description: "Failed to clear system cache",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSystemReset = async () => {
    setLoading(true);
    try {
      await onSystemReset();
      toast({
        title: "System Reset",
        description: "System has been reset to default settings"
      });
      setResetDialogOpen(false);
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset system",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate sending test email
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Test Email Sent",
        description: `Test email sent successfully to ${testEmail}`
      });
      setTestEmailDialogOpen(false);
      setTestEmail("");
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send test email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* System Maintenance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>System Maintenance</CardTitle>
              <p className="text-sm text-muted-foreground">Database and system management tools</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              onClick={() => setBackupDialogOpen(true)}
              className="flex items-center gap-2 h-12"
            >
              <Download className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Create Backup</div>
                <div className="text-xs text-muted-foreground">Full system backup</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => setRestoreDialogOpen(true)}
              className="flex items-center gap-2 h-12"
            >
              <Upload className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Restore Backup</div>
                <div className="text-xs text-muted-foreground">Restore from file</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={handleCacheFlush}
              disabled={loading}
              className="flex items-center gap-2 h-12"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <div className="text-left">
                <div className="font-medium">Clear Cache</div>
                <div className="text-xs text-muted-foreground">Flush system cache</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => setTestEmailDialogOpen(true)}
              className="flex items-center gap-2 h-12"
            >
              <Mail className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Test Email</div>
                <div className="text-xs text-muted-foreground">Send test message</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>API Keys Management</CardTitle>
              <p className="text-sm text-muted-foreground">Manage external service integrations</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(apiKeys).map(([service, key]) => (
              <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium capitalize">{service} API Key</div>
                  <div className="text-sm text-muted-foreground font-mono">{key}</div>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success">
                  Active
                </Badge>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setApiKeyDialogOpen(true)}
              className="w-full"
            >
              <Key className="h-4 w-4 mr-2" />
              Manage API Keys
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-destructive" />
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <p className="text-sm text-muted-foreground">Irreversible and destructive actions</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setResetDialogOpen(true)}
            className="w-full"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Reset System to Defaults
          </Button>
        </CardContent>
      </Card>

      {/* Backup Dialog */}
      <Dialog open={backupDialogOpen} onOpenChange={setBackupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create System Backup</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              This will create a complete backup of your system including all data, settings, and configurations.
              The backup file will be downloaded to your device.
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBackupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBackup} disabled={loading}>
              {loading ? "Creating..." : "Create Backup"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore System Backup</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">Upload a backup file to restore your system</p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backupFile">Select Backup File</Label>
              <Input
                id="backupFile"
                type="file"
                accept=".bak,.backup,.json"
                onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="font-medium text-destructive">Warning</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                This will overwrite all current data and settings. This action cannot be undone.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRestore} 
              disabled={loading || !restoreFile}
            >
              {loading ? "Restoring..." : "Restore Backup"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Email Dialog */}
      <Dialog open={testEmailDialogOpen} onOpenChange={setTestEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">Send a test email to verify your email configuration</p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="Enter email address..."
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This will send a test email to verify your email configuration is working correctly.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendTestEmail} disabled={loading || !testEmail.trim()}>
              {loading ? "Sending..." : "Send Test Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Reset Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Reset System to Defaults
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all data, users, products, orders, and reset all settings to their default values.
              This action cannot be undone and you will lose all your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSystemReset}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Resetting..." : "Reset System"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* API Key Management Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage API Keys</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">Update your external service API keys</p>
          </DialogHeader>
          <div className="space-y-4">
            {Object.entries(apiKeys).map(([service, key]) => (
              <div key={service} className="space-y-2">
                <Label htmlFor={`${service}-key`} className="capitalize">{service} API Key</Label>
                <Input
                  id={`${service}-key`}
                  type="password"
                  defaultValue={key}
                  placeholder={`Enter ${service} API key...`}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "API Keys Updated",
                description: "Your API keys have been updated successfully"
              });
              setApiKeyDialogOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}