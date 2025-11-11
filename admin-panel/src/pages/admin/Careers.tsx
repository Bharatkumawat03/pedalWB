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
import { useCareers } from "@/hooks/useCareers";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Search, Filter, Trash2, FileText, Download, Eye } from "lucide-react";
import { format } from "date-fns";

export default function AdminCareers() {
  const { toast } = useToast();
  const { applications, loading, currentPage, totalPages, totalApplications, updateApplication, deleteApplication, fetchApplications } = useCareers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication || !newStatus) return;
    
    try {
      await updateApplication(selectedApplication._id, { 
        status: newStatus,
        notes: notes || undefined
      });
      toast({
        title: "Success",
        description: "Application status updated successfully!",
      });
      setStatusDialogOpen(false);
      setNewStatus("");
      setNotes("");
      setSelectedApplication(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    if (applicationToDelete) {
      try {
        await deleteApplication(applicationToDelete);
        setDeleteDialogOpen(false);
        setApplicationToDelete(null);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.positionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesPosition = positionFilter === "all" || app.positionTitle === positionFilter;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const uniquePositions = Array.from(new Set(applications.map(app => app.positionTitle)));

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "default", label: "Pending", color: "text-blue-500" },
      reviewing: { variant: "secondary", label: "Reviewing", color: "text-yellow-500" },
      shortlisted: { variant: "outline", label: "Shortlisted", color: "text-green-500" },
      rejected: { variant: "destructive", label: "Rejected", color: "text-red-500" },
      hired: { variant: "default", label: "Hired", color: "text-purple-500" },
    };
    
    const config = variants[status] || variants.pending;
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <AdminLayout title="Job Applications">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {applications.filter(a => a.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviewing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {applications.filter(a => a.status === 'reviewing').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {applications.filter(a => a.status === 'shortlisted').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">
                {applications.filter(a => a.status === 'hired').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Job Applications</CardTitle>
            <CardDescription>Manage job applications and candidates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {uniquePositions.map(pos => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Applications Table */}
            {loading ? (
              <TableSkeleton />
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No applications found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredApplications.map((application) => (
                  <Card key={application._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">
                              {application.firstName} {application.lastName}
                            </h4>
                            {getStatusBadge(application.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{application.email}</p>
                          <div className="flex items-center gap-4">
                            <p className="font-medium">{application.positionTitle}</p>
                            <p className="text-sm text-muted-foreground">{application.positionDepartment}</p>
                          </div>
                          {application.experience && (
                            <p className="text-sm text-muted-foreground">Experience: {application.experience}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Applied: {format(new Date(application.createdAt), "PPp")}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(application)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          {application.resumeUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(application.resumeUrl, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Resume
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(application);
                              setStatusDialogOpen(true);
                            }}
                          >
                            Update Status
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setApplicationToDelete(application._id);
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
                totalItems={totalApplications}
                startIndex={(currentPage - 1) * 20 + 1}
                endIndex={Math.min(currentPage * 20, totalApplications)}
                itemsPerPage={20}
                onPageChange={(page) => fetchApplications(page)}
                onItemsPerPageChange={() => {}}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Application Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedApplication?.firstName} {selectedApplication?.lastName}
            </DialogTitle>
            <DialogDescription>
              {selectedApplication?.positionTitle} - {selectedApplication?.positionDepartment}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Email</p>
                <p className="text-sm text-muted-foreground">{selectedApplication?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Phone</p>
                <p className="text-sm text-muted-foreground">{selectedApplication?.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Experience</p>
                <p className="text-sm text-muted-foreground">{selectedApplication?.experience || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Current Company</p>
                <p className="text-sm text-muted-foreground">{selectedApplication?.currentCompany || 'N/A'}</p>
              </div>
              {selectedApplication?.expectedSalary && (
                <div>
                  <p className="text-sm font-medium mb-1">Expected Salary</p>
                  <p className="text-sm text-muted-foreground">{selectedApplication.expectedSalary}</p>
                </div>
              )}
              {selectedApplication?.availableFrom && (
                <div>
                  <p className="text-sm font-medium mb-1">Available From</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedApplication.availableFrom), "PP")}
                  </p>
                </div>
              )}
            </div>
            {selectedApplication?.coverLetter && (
              <div>
                <p className="text-sm font-medium mb-2">Cover Letter</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
              </div>
            )}
            {selectedApplication?.notes && (
              <div>
                <p className="text-sm font-medium mb-2">Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApplication.notes}</p>
              </div>
            )}
            {selectedApplication?.resumeUrl && (
              <div>
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedApplication.resumeUrl, '_blank')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Resume
                </Button>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setViewDialogOpen(false);
                  setStatusDialogOpen(true);
                }}
              >
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Update status for {selectedApplication?.firstName} {selectedApplication?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Add notes (optional)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={!newStatus}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this application? This action cannot be undone.
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

