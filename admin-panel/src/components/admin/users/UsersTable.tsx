import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface UsersTableProps {
  users: any[];
  selectedUsers: string[];
  onToggleUser: (id: string) => void;
  onToggleAll: () => void;
  onViewProfile: (user: any) => void;
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
  onEmail: (user: any) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-success/20 text-success hover:bg-success/30";
    case "Inactive":
      return "bg-muted text-muted-foreground hover:bg-muted/80";
    case "Suspended":
      return "bg-destructive/20 text-destructive hover:bg-destructive/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-primary/20 text-primary hover:bg-primary/30";
    case "Customer":
      return "bg-info/20 text-info hover:bg-info/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const UsersTable = memo(function UsersTable({
  users,
  selectedUsers,
  onToggleUser,
  onToggleAll,
  onViewProfile,
  onEdit,
  onDelete,
  onEmail,
  sortField,
  sortDirection,
  onSort,
}: UsersTableProps) {
  const allSelected = users.length > 0 && selectedUsers.length === users.length;

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
              <Checkbox checked={allSelected} onCheckedChange={onToggleAll} />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('firstName')}
            >
              <div className="flex items-center">
                User
                <SortIcon field="firstName" />
              </div>
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('role')}
            >
              <div className="flex items-center">
                Role
                <SortIcon field="role" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center">
                Status
                <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('joinDate')}
            >
              <div className="flex items-center">
                Join Date
                <SortIcon field="joinDate" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('totalOrders')}
            >
              <div className="flex items-center">
                Orders
                <SortIcon field="totalOrders" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('totalSpent')}
            >
              <div className="flex items-center">
                Total Spent
                <SortIcon field="totalSpent" />
              </div>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => onToggleUser(user.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-10 w-10 rounded-full object-cover hover-scale"
                  />
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate max-w-[200px]">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
              </TableCell>
              <TableCell className="text-sm">
                {new Date(user.joinDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span className="font-medium">{user.totalOrders}</span>
              </TableCell>
              <TableCell>
                <span className="font-medium">₹{user.totalSpent.toLocaleString()}</span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover-scale">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover z-50">
                    <DropdownMenuItem onClick={() => onViewProfile(user)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEmail(user)}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete(user.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});
