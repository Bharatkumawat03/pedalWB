import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { useNewsletter } from "@/hooks/useNewsletter";
import { useToast } from "@/hooks/use-toast";
import { Mail, Search, Filter, Trash2, CheckCircle2, XCircle, Download, Users } from "lucide-react";
import { format } from "date-fns";

export default function AdminNewsletter() {
  const { toast } = useToast();
  const { subscribers, loading, currentPage, totalPages, totalSubscribers, updateSubscriber, deleteSubscriber, bulkUnsubscribe, fetchSubscribers } = useNewsletter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null);
  const [bulkUnsubscribeDialogOpen, setBulkUnsubscribeDialogOpen] = useState(false);

  const handleToggleSelection = (id: string) => {
    setSelectedSubscribers(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s._id));
    }
  };

  const handleBulkUnsubscribe = async () => {
    if (selectedSubscribers.length === 0) return;
    
    try {
      await bulkUnsubscribe(selectedSubscribers);
      setSelectedSubscribers([]);
      setBulkUnsubscribeDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    if (subscriberToDelete) {
      try {
        await deleteSubscriber(subscriberToDelete);
        setDeleteDialogOpen(false);
        setSubscriberToDelete(null);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await updateSubscriber(id, currentStatus === 'active' ? 'unsubscribed' : 'active');
    } catch (error) {
      // Error handled in hook
    }
  };

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = !searchTerm || 
      sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
  const unsubscribedSubscribers = subscribers.filter(s => s.status === 'unsubscribed').length;

  const exportSubscribers = () => {
    const csv = [
      ['Email', 'Status', 'Subscribed At', 'Unsubscribed At'].join(','),
      ...filteredSubscribers.map(s => [
        s.email,
        s.status,
        s.subscribedAt ? format(new Date(s.subscribedAt), 'PPp') : '',
        s.unsubscribedAt ? format(new Date(s.unsubscribedAt), 'PPp') : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${filteredSubscribers.length} subscribers exported successfully`,
    });
  };

  return (
    <AdminLayout title="Newsletter Subscribers">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubscribers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{activeSubscribers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{unsubscribedSubscribers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selected</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedSubscribers.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Newsletter Subscribers</CardTitle>
                <CardDescription>Manage newsletter subscriptions</CardDescription>
              </div>
              <div className="flex gap-2">
                {selectedSubscribers.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setBulkUnsubscribeDialogOpen(true)}
                  >
                    Unsubscribe ({selectedSubscribers.length})
                  </Button>
                )}
                <Button variant="outline" onClick={exportSubscribers}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subscribers Table */}
            {loading ? (
              <TableSkeleton />
            ) : filteredSubscribers.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No subscribers found</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 border-b">
                  <Checkbox
                    checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    {selectedSubscribers.length > 0 
                      ? `${selectedSubscribers.length} of ${filteredSubscribers.length} selected`
                      : "Select all"}
                  </span>
                </div>
                {filteredSubscribers.map((subscriber) => (
                  <Card key={subscriber._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedSubscribers.includes(subscriber._id)}
                          onCheckedChange={() => handleToggleSelection(subscriber._id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{subscriber.email}</p>
                            <Badge variant={subscriber.status === 'active' ? 'default' : 'secondary'}>
                              {subscriber.status === 'active' ? 'Active' : 'Unsubscribed'}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>
                              Subscribed: {subscriber.subscribedAt 
                                ? format(new Date(subscriber.subscribedAt), "PPp")
                                : 'N/A'}
                            </span>
                            {subscriber.unsubscribedAt && (
                              <span>
                                Unsubscribed: {format(new Date(subscriber.unsubscribedAt), "PPp")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(subscriber._id, subscriber.status)}
                          >
                            {subscriber.status === 'active' ? 'Unsubscribe' : 'Reactivate'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSubscriberToDelete(subscriber._id);
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
                totalItems={totalSubscribers}
                startIndex={(currentPage - 1) * 20 + 1}
                endIndex={Math.min(currentPage * 20, totalSubscribers)}
                itemsPerPage={20}
                onPageChange={(page) => fetchSubscribers(page)}
                onItemsPerPageChange={() => {}}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bulk Unsubscribe Dialog */}
      <Dialog open={bulkUnsubscribeDialogOpen} onOpenChange={setBulkUnsubscribeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Unsubscribe</DialogTitle>
            <DialogDescription>
              Are you sure you want to unsubscribe {selectedSubscribers.length} subscriber(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setBulkUnsubscribeDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkUnsubscribe}>
              Unsubscribe
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscriber</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscriber? This action cannot be undone.
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

