import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderDetailsDialog } from "@/components/admin/OrderDetailsDialog";
import { OrdersHeader } from "@/components/admin/orders/OrdersHeader";
import { OrdersFilters } from "@/components/admin/orders/OrdersFilters";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { StatsCard } from "@/components/admin/StatsCard";
import { useAdminData } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { ShoppingCart, DollarSign, Package, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminOrders() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { orders, updateOrderStatus, cancelOrder, searchOrders, loading } = useAdminData();

  // Debounce search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Calculate stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'Delivered').length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    
    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      processingOrders,
      cancelledOrders,
      totalRevenue,
      avgOrderValue,
      completionRate,
    };
  }, [orders]);

  // Filter orders with memoization
  const filteredOrders = useMemo(() => {
    let filtered = searchOrders(debouncedSearchTerm, selectedStatus, selectedPaymentStatus);

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((order) => new Date(order.orderDate) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter((order) => new Date(order.orderDate) <= new Date(dateTo));
    }

    // Amount range filter
    if (minAmount) {
      filtered = filtered.filter((order) => order.total >= parseFloat(minAmount));
    }
    if (maxAmount) {
      filtered = filtered.filter((order) => order.total <= parseFloat(maxAmount));
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "customer":
          aValue = a.customer.name.toLowerCase();
          bValue = b.customer.name.toLowerCase();
          break;
        case "total":
          aValue = a.total;
          bValue = b.total;
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case "date":
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [
    debouncedSearchTerm,
    selectedStatus,
    selectedPaymentStatus,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount,
    sortField,
    sortDirection,
    orders,
    searchOrders,
  ]);

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
  } = usePagination(filteredOrders, itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    resetPage();
  }, [debouncedSearchTerm, selectedStatus, selectedPaymentStatus, dateFrom, dateTo, minAmount, maxAmount, resetPage]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSelectedPaymentStatus("all");
    setDateFrom("");
    setDateTo("");
    setMinAmount("");
    setMaxAmount("");
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleViewOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowOrderDetails(true);
    }
  };

  const handleTrackOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order?.trackingNumber) {
      toast({
        title: "Tracking Information",
        description: `Tracking Number: ${order.trackingNumber}`,
      });
    } else {
      toast({
        title: "No Tracking Available",
        description: "This order doesn't have tracking information yet.",
        variant: "destructive",
      });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      setShowOrderDetails(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <AdminLayout title="Orders">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            description={`${stats.completedOrders} completed`}
            icon={ShoppingCart}
            trend={{ value: stats.completionRate, label: "Completion rate" }}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            description="All-time revenue"
            icon={DollarSign}
            trend={{ value: 12.5, label: "vs last month" }}
          />
          <StatsCard
            title="Pending Orders"
            value={stats.pendingOrders}
            description={`${stats.processingOrders} processing`}
            icon={Clock}
            variant={stats.pendingOrders > 10 ? "warning" : "default"}
          />
          <StatsCard
            title="Avg Order Value"
            value={`$${stats.avgOrderValue.toFixed(2)}`}
            description="Per transaction"
            icon={TrendingUp}
          />
        </div>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Real-time overview of order pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{stats.completedOrders} / {stats.totalOrders}</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processingOrders}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelledOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <OrdersHeader />

        {/* Filters */}
        <OrdersFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedPaymentStatus={selectedPaymentStatus}
          onPaymentStatusChange={setSelectedPaymentStatus}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          minAmount={minAmount}
          maxAmount={maxAmount}
          onMinAmountChange={setMinAmount}
          onMaxAmountChange={setMaxAmount}
          onClearFilters={handleClearFilters}
        />

        {/* Orders Table */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Orders ({totalItems})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton rows={itemsPerPage} columns={8} />
            ) : (
              <>
            <OrdersTable
              orders={paginatedItems}
              onViewOrder={handleViewOrder}
              onUpdateStatus={handleStatusUpdate}
              onTrackOrder={handleTrackOrder}
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

        {/* Order Details Dialog */}
        <OrderDetailsDialog
          open={showOrderDetails}
          onOpenChange={setShowOrderDetails}
          order={selectedOrder}
          onUpdateStatus={handleStatusUpdate}
          onCancelOrder={handleCancelOrder}
        />
      </div>
    </AdminLayout>
  );
}
