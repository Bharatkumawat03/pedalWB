import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Mail, 
  Ban, 
  UserCheck, 
  Trash2,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserBulkActionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUsers: any[];
  onBulkAction: (action: string, data?: any) => Promise<void>;
}

export function UserBulkActions({ 
  open, 
  onOpenChange, 
  selectedUsers, 
  onBulkAction 
}: UserBulkActionsProps) {
  const { toast } = useToast();
  const [action, setAction] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionType: string) => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    try {
      let actionData = undefined;
      
      if (actionType === 'email') {
        if (!emailSubject.trim() || !emailMessage.trim()) {
          toast({
            title: "Missing Information",
            description: "Please provide both subject and message for bulk email",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        actionData = {
          subject: emailSubject,
          message: emailMessage,
          recipients: selectedUsers.map(u => u.email)
        };
      }

      await onBulkAction(actionType, actionData);
      
      const actionMessages = {
        activate: `${selectedUsers.length} users activated`,
        suspend: `${selectedUsers.length} users suspended`, 
        delete: `${selectedUsers.length} users deleted`,
        email: `Email sent to ${selectedUsers.length} users`
      };

      toast({
        title: "Bulk Action Complete",
        description: actionMessages[actionType as keyof typeof actionMessages] || "Action completed"
      });

      onOpenChange(false);
      setEmailSubject("");
      setEmailMessage("");
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to complete bulk action",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const activeUsers = selectedUsers.filter(u => u.status === 'Active').length;
  const suspendedUsers = selectedUsers.filter(u => u.status === 'Suspended').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Bulk Actions ({selectedUsers.length} users selected)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Users Summary */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <h4 className="font-medium mb-3">Selected Users Summary</h4>
            <div className="flex gap-4 text-sm">
              <Badge variant="outline">{activeUsers} Active</Badge>
              <Badge variant="outline">{suspendedUsers} Suspended</Badge>
              <Badge variant="outline">{selectedUsers.filter(u => u.role === 'Admin').length} Admins</Badge>
              <Badge variant="outline">{selectedUsers.filter(u => u.role === 'Customer').length} Customers</Badge>
            </div>
            <div className="mt-3 max-h-32 overflow-y-auto">
              {selectedUsers.slice(0, 10).map((user, index) => (
                <div key={user.id} className="text-sm py-1">
                  <span className="font-medium">{user.firstName} {user.lastName}</span>
                  <span className="text-muted-foreground"> - {user.email}</span>
                </div>
              ))}
              {selectedUsers.length > 10 && (
                <div className="text-sm text-muted-foreground py-1">
                  ... and {selectedUsers.length - 10} more users
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <h4 className="font-medium">Available Actions</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleAction('activate')}
                disabled={loading || activeUsers === selectedUsers.length}
                className="flex items-center gap-2 h-12"
              >
                <UserCheck className="h-4 w-4 text-success" />
                <div className="text-left">
                  <div className="font-medium">Activate Users</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedUsers.length - activeUsers} affected
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleAction('suspend')}
                disabled={loading || suspendedUsers === selectedUsers.length}
                className="flex items-center gap-2 h-12"
              >
                <Ban className="h-4 w-4 text-warning" />
                <div className="text-left">
                  <div className="font-medium">Suspend Users</div>
                  <div className="text-xs text-muted-foreground">
                    {activeUsers} affected
                  </div>
                </div>
              </Button>
            </div>

            <Separator />

            {/* Bulk Email */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-info" />
                <span className="font-medium">Send Bulk Email</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="emailSubject">Email Subject</Label>
                  <input
                    id="emailSubject"
                    type="text"
                    placeholder="Enter email subject..."
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emailMessage">Email Message</Label>
                  <Textarea
                    id="emailMessage"
                    placeholder="Enter your message..."
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <Button
                  onClick={() => handleAction('email')}
                  disabled={loading || !emailSubject.trim() || !emailMessage.trim()}
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Email to {selectedUsers.length} Users
                </Button>
              </div>
            </div>

            <Separator />

            {/* Danger Zone */}
            <div className="space-y-3">
              <h5 className="font-medium text-destructive">Danger Zone</h5>
              <Button
                variant="destructive"
                onClick={() => handleAction('delete')}
                disabled={loading}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected Users ({selectedUsers.length})
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}