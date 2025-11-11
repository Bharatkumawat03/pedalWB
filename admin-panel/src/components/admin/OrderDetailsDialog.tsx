import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Package,
  MapPin,
  Calendar,
  CreditCard,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  onUpdateStatus: (orderId: string, status: string) => void;
  onCancelOrder: (orderId: string) => void;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
  onUpdateStatus,
  onCancelOrder,
}: OrderDetailsDialogProps) {
  const { toast } = useToast();

  if (!order) return null;

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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Order Details - {order.id}
          </DialogTitle>
          <DialogDescription>
            View order information, customer details, and manage order status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
            <div className="flex flex-col gap-2">
              <Badge className={statusConfig.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {order.status}
              </Badge>
              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                <CreditCard className="h-3 w-3 mr-1" />
                {order.paymentStatus}
              </Badge>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {order.status === "Pending" && (
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, "Processing")}
                >
                  Mark Processing
                </Button>
              )}
              {order.status === "Processing" && (
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, "Shipped")}
                >
                  Mark Shipped
                </Button>
              )}
              {order.status === "Shipped" && (
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, "Completed")}
                >
                  Mark Completed
                </Button>
              )}
              {["Pending", "Processing"].includes(order.status) && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onCancelOrder(order.id)}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <img
                  src={order.customer?.avatar}
                  alt={order.customer?.name}
                  className="h-8 w-8 rounded-full"
                />
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {order.customer?.name}</p>
                <p><strong>Email:</strong> {order.customer?.email}</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Shipping Address:</span>
                </div>
                <p className="pl-6 text-muted-foreground">{order.shippingAddress}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Order Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Order Date:</strong> {new Date(order.orderDate)?.toLocaleString()}</p>
                {order.deliveryDate && (
                  <p><strong>Delivered:</strong> {new Date(order.deliveryDate)?.toLocaleString()}</p>
                )}
                {order.trackingNumber && (
                  <div className="flex items-center gap-2">
                    <strong>Tracking:</strong>
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      {order.trackingNumber}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(order.trackingNumber, "Tracking number")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-semibold">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{item?.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item?.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item?.price?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{(item?.price * item?.quantity)?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span>₹{order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}