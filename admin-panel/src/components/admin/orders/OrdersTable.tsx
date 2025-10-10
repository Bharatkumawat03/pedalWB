import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Eye,
  Clock,
  Package,
  CheckCircle,
  Truck,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface OrdersTableProps {
  orders: any[];
  onViewOrder: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onTrackOrder: (orderId: string) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Completed":
      return { color: "bg-success/20 text-success hover:bg-success/30", icon: CheckCircle };
    case "Processing":
      return { color: "bg-info/20 text-info hover:bg-info/30", icon: Clock };
    case "Shipped":
      return { color: "bg-primary/20 text-primary hover:bg-primary/30", icon: Truck };
    case "Pending":
      return { color: "bg-warning/20 text-warning hover:bg-warning/30", icon: AlertCircle };
    case "Cancelled":
      return { color: "bg-destructive/20 text-destructive hover:bg-destructive/30", icon: AlertCircle };
    default:
      return { color: "bg-muted text-muted-foreground", icon: Package };
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-success/20 text-success hover:bg-success/30";
    case "Pending":
      return "bg-warning/20 text-warning hover:bg-warning/30";
    case "Refunded":
      return "bg-info/20 text-info hover:bg-info/30";
    case "Failed":
      return "bg-destructive/20 text-destructive hover:bg-destructive/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const OrdersTable = memo(function OrdersTable({
  orders,
  onViewOrder,
  onUpdateStatus,
  onTrackOrder,
  sortField,
  sortDirection,
  onSort,
}: OrdersTableProps) {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("id")}
                className="h-8 font-semibold hover:bg-muted/50"
              >
                Order ID
                <SortIcon field="id" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("customer")}
                className="h-8 font-semibold hover:bg-muted/50"
              >
                Customer
                <SortIcon field="customer" />
              </Button>
            </TableHead>
            <TableHead>Items</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("total")}
                className="h-8 font-semibold hover:bg-muted/50"
              >
                Total
                <SortIcon field="total" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("status")}
                className="h-8 font-semibold hover:bg-muted/50"
              >
                Status
                <SortIcon field="status" />
              </Button>
            </TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("date")}
                className="h-8 font-semibold hover:bg-muted/50"
              >
                Date
                <SortIcon field="date" />
              </Button>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <TableRow key={order.id} className="hover:bg-muted/20">
                <TableCell>
                  <div className="font-medium">{order.id}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={order.customer.avatar}
                      alt={order.customer.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {order.customer.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item: any, index: number) => (
                      <p key={index} className="text-sm truncate max-w-[200px]">
                        {item.quantity}x {item.name}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">₹{order.total.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewOrder(order.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {order.status === "Pending" && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "Processing")}>
                          <Clock className="h-4 w-4 mr-2" />
                          Mark Processing
                        </DropdownMenuItem>
                      )}
                      {order.status === "Processing" && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "Shipped")}>
                          <Package className="h-4 w-4 mr-2" />
                          Mark as Shipped
                        </DropdownMenuItem>
                      )}
                      {order.status === "Shipped" && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "Completed")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onTrackOrder(order.id)}>
                        <Truck className="h-4 w-4 mr-2" />
                        Track Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
});
