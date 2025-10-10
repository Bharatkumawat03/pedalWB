import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "@/components/admin/UserForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { UserProfileDialog } from "@/components/admin/UserProfileDialog";
import { EmailDialog } from "@/components/admin/EmailDialog";
import { UserBulkActions } from "@/components/admin/UserBulkActions";
import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { useAdminData } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { Users, CheckCircle2, AlertTriangle, ShoppingCart } from "lucide-react";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minOrders, setMinOrders] = useState("");
  const [maxOrders, setMaxOrders] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailUser, setEmailUser] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const { users, loading, createUser, updateUser, deleteUser, searchUsers } = useAdminData();
  const { toast } = useToast();

  // Debounce search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let result = searchUsers(debouncedSearchTerm, selectedRole, selectedStatus);

    // Date range filter
    if (dateFrom || dateTo) {
      result = result.filter(user => {
        const userDate = new Date(user.joinDate);
        const fromDate = dateFrom ? new Date(dateFrom) : null;
        const toDate = dateTo ? new Date(dateTo) : null;
        
        if (fromDate && userDate < fromDate) return false;
        if (toDate && userDate > toDate) return false;
        return true;
      });
    }

    // Orders range filter
    if (minOrders || maxOrders) {
      result = result.filter(user => {
        const orders = user.totalOrders;
        if (minOrders && orders < parseInt(minOrders)) return false;
        if (maxOrders && orders > parseInt(maxOrders)) return false;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different data types
      if (sortField === 'totalSpent') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortField === 'totalOrders') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      } else if (sortField === 'joinDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [debouncedSearchTerm, selectedRole, selectedStatus, dateFrom, dateTo, minOrders, maxOrders, sortField, sortDirection, searchUsers]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
    resetPage,
  } = usePagination(filteredUsers, itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    resetPage();
  }, [debouncedSearchTerm, selectedRole, selectedStatus, dateFrom, dateTo, minOrders, maxOrders, resetPage]);

  const handleCreateUser = async (data: any) => {
    await createUser(data);
  };

  const handleUpdateUser = async (data: any) => {
    if (editingUser) {
      await updateUser(editingUser.id, data);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete);
      setUserToDelete(null);
    }
  };

  const openEditForm = (user: any) => {
    setEditingUser(user);
    setUserFormOpen(true);
  };

  const openDeleteDialog = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const openProfileDialog = (user: any) => {
    setSelectedUser(user);
    setProfileDialogOpen(true);
  };

  const openEmailDialog = (user: any) => {
    setEmailUser(user);
    setEmailDialogOpen(true);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    setSelectedUsers(selectedUsers.length === paginatedItems.length ? [] : paginatedItems.map((u) => u.id));
  };

  const handleBulkAction = async (action: string, data?: any) => {
    const selectedUserData = users.filter((u) => selectedUsers.includes(u.id));

    switch (action) {
      case "activate":
        await Promise.all(selectedUsers.map((id) => updateUser(id, { status: "Active" })));
        break;
      case "suspend":
        await Promise.all(selectedUsers.map((id) => updateUser(id, { status: "Suspended" })));
        break;
      case "delete":
        await Promise.all(selectedUsers.map((id) => deleteUser(id)));
        break;
      case "email":
        // Simulate sending bulk email
        console.log("Sending bulk email:", data);
        break;
    }

    setSelectedUsers([]);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRole("all");
    setSelectedStatus("all");
    setDateFrom("");
    setDateTo("");
    setMinOrders("");
    setMaxOrders("");
  };

  const exportUsers = () => {
    const dataStr = JSON.stringify(filteredUsers, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "users.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export Complete",
      description: `${filteredUsers.length} users exported successfully`,
    });
  };

  const activeUsers = users.filter(u => u.status === "Active").length;
  const suspendedUsers = users.filter(u => u.status === "Suspended").length;
  const totalRevenue = users.reduce((sum, u) => sum + (typeof u.totalSpent === 'string' ? parseFloat(u.totalSpent) : u.totalSpent), 0);
  const activePercentage = users.length > 0 ? ((activeUsers/users.length)*100).toFixed(0) : "0";

  return (
    <AdminLayout title="Users">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="hover-scale transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">{activePercentage}% of total</p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{suspendedUsers}</div>
              <p className="text-xs text-muted-foreground">Need review</p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <ShoppingCart className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From all users</p>
            </CardContent>
          </Card>
        </div>

        {/* Header */}
        <UsersHeader
          selectedCount={selectedUsers.length}
          onAddUser={() => setUserFormOpen(true)}
          onExport={exportUsers}
          onBulkActions={() => setBulkActionsOpen(true)}
        />

        {/* Filters */}
        <UsersFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          minOrders={minOrders}
          maxOrders={maxOrders}
          onMinOrdersChange={setMinOrders}
          onMaxOrdersChange={setMaxOrders}
          onClearFilters={handleClearFilters}
        />

        {/* Users Table */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Users ({totalItems})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton rows={itemsPerPage} columns={9} />
            ) : (
              <>
                <UsersTable
                  users={paginatedItems}
                  selectedUsers={selectedUsers}
                  onToggleUser={toggleUserSelection}
                  onToggleAll={toggleAllUsers}
                  onViewProfile={openProfileDialog}
                  onEdit={openEditForm}
                  onDelete={openDeleteDialog}
                  onEmail={openEmailDialog}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />

                {totalPages > 1 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    onPageChange={goToPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* User Form Modal */}
        <UserForm
          open={userFormOpen}
          onOpenChange={(open) => {
            setUserFormOpen(open);
            if (!open) setEditingUser(null);
          }}
          user={editingUser}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          loading={loading}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteUser}
          title="Delete User"
          description="Are you sure you want to delete this user? This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
        />

        {/* User Profile Dialog */}
        <UserProfileDialog
          user={selectedUser}
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
        />

        {/* Email Dialog */}
        <EmailDialog user={emailUser} open={emailDialogOpen} onOpenChange={setEmailDialogOpen} />

        {/* User Bulk Actions Dialog */}
        <UserBulkActions
          open={bulkActionsOpen}
          onOpenChange={setBulkActionsOpen}
          selectedUsers={users.filter((u) => selectedUsers.includes(u.id))}
          onBulkAction={handleBulkAction}
        />
      </div>
    </AdminLayout>
  );
}
