import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { useContact } from "@/hooks/useContact";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Search, Filter, Trash2, CheckCircle2, Clock, Archive } from "lucide-react";
import { format } from "date-fns";

export default function AdminContact() {
  const { toast } = useToast();
  const { messages, loading, currentPage, totalPages, totalMessages, updateMessage, deleteMessage, fetchMessages } = useContact();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateMessage(id, { status });
      toast({
        title: "Success",
        description: "Message status updated successfully!",
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleSendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return;
    
    try {
      await updateMessage(selectedMessage._id, { 
        status: 'replied',
        response: responseText 
      });
      toast({
        title: "Success",
        description: "Response sent successfully!",
      });
      setResponseDialogOpen(false);
      setResponseText("");
      setSelectedMessage(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    if (messageToDelete) {
      try {
        await deleteMessage(messageToDelete);
        setDeleteDialogOpen(false);
        setMessageToDelete(null);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = !searchTerm || 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || msg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: { variant: "default", label: "New", icon: Clock },
      read: { variant: "secondary", label: "Read", icon: CheckCircle2 },
      replied: { variant: "outline", label: "Replied", icon: CheckCircle2 },
      archived: { variant: "outline", label: "Archived", icon: Archive },
    };
    
    const config = variants[status] || variants.new;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <AdminLayout title="Contact Messages">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {messages.filter(m => m.status === 'new').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Read</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {messages.filter(m => m.status === 'read').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Replied</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">
                {messages.filter(m => m.status === 'replied').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Messages</CardTitle>
            <CardDescription>Manage customer inquiries and messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Messages Table */}
            {loading ? (
              <TableSkeleton />
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No messages found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMessages.map((message) => (
                  <Card key={message._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{message.name}</h4>
                            {getStatusBadge(message.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{message.email}</p>
                          <p className="font-medium">{message.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(message.createdAt), "PPp")}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMessage(message)}
                          >
                            View
                          </Button>
                          {message.status === 'new' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(message._id, 'read')}
                            >
                              Mark Read
                            </Button>
                          )}
                          {message.status !== 'replied' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMessage(message);
                                setResponseDialogOpen(true);
                              }}
                            >
                              Reply
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setMessageToDelete(message._id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalMessages}
                startIndex={(currentPage - 1) * 20 + 1}
                endIndex={Math.min(currentPage * 20, totalMessages)}
                itemsPerPage={20}
                onPageChange={(page) => fetchMessages(page)}
                onItemsPerPageChange={() => {}}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              From: {selectedMessage?.name} ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Message:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>
            {selectedMessage?.response && (
              <div>
                <p className="text-sm font-medium mb-2">Response:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.response}</p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedMessage(null);
                  setViewDialogOpen(false);
                }}
              >
                Close
              </Button>
              {!selectedMessage?.response && (
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    setResponseDialogOpen(true);
                  }}
                >
                  Reply
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Response</DialogTitle>
            <DialogDescription>
              Reply to {selectedMessage?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your response..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={6}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendResponse}>Send Response</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

