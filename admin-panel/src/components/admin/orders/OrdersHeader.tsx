import { ShoppingCart } from "lucide-react";

export function OrdersHeader() {
  return (
    <div className="flex items-center gap-2">
      <ShoppingCart className="h-6 w-6 text-primary" />
      <h2 className="text-2xl font-bold">Order Management</h2>
    </div>
  );
}
