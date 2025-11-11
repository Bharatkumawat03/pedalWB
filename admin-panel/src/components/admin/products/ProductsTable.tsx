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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye, Star, Copy, ArrowUpDown } from "lucide-react";

interface ProductsTableProps {
  products: any[];
  selectedProducts: string[];
  onToggleProduct: (id: string) => void;
  onToggleAll: () => void;
  onViewDetails: (product: any) => void;
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (product: any) => void;
  onToggleFeature: (id: string, featured: boolean) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-success/20 text-success hover:bg-success/30";
    case "Low Stock":
      return "bg-warning/20 text-warning hover:bg-warning/30";
    case "Out of Stock":
      return "bg-destructive/20 text-destructive hover:bg-destructive/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const ProductsTable = memo(function ProductsTable({
  products,
  selectedProducts,
  onToggleProduct,
  onToggleAll,
  onViewDetails,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFeature,
  sortBy,
  sortOrder,
  onSort,
}: ProductsTableProps) {
  const allSelected = products.length > 0 && selectedProducts.length === products.length;

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=sorted]:bg-accent"
      onClick={() => onSort(field)}
    >
      {children}
      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortBy === field ? "text-primary" : "text-muted-foreground"}`} />
    </Button>
  );

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
              <Checkbox checked={allSelected} onCheckedChange={onToggleAll} />
            </TableHead>
            <TableHead>
              <SortButton field="name">Product</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="category">Category</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="brand">Brand</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="price">Price</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="stock">Stock</SortButton>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const productId = product._id || product.id;
            const productStock = product.stock || product.inventory?.quantity || 0;
            const productImages = product.images || [];
            return (
              <TableRow key={productId} className="hover:bg-muted/20 transition-colors">
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(productId)}
                    onCheckedChange={() => onToggleProduct(productId)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {productImages.length > 0 && (
                      <img
                        src={productImages[0]?.url || productImages[0]}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover hover-scale cursor-pointer"
                        onClick={() => onViewDetails(product)}
                      />
                    )}
                    <div>
                      <p
                        className="font-medium cursor-pointer hover:text-primary"
                        onClick={() => onViewDetails(product)}
                      >
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">ID: {productId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">₹{product.price?.toLocaleString() || '0'}</p>
                    {product.originalPrice && product.originalPrice !== product.price && (
                      <p className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      productStock === 0
                        ? "text-destructive"
                        : productStock < 5
                        ? "text-warning"
                        : "text-foreground"
                    }`}
                  >
                    {productStock}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(product.status || 'Active')}>
                    {product.status || 'Active'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {product.featured ? (
                    <Badge
                      className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer"
                      onClick={() => onToggleFeature(productId, product.featured)}
                    >
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleFeature(productId, product.featured)}
                      className="h-6 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Feature
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover-scale">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover z-50">
                      <DropdownMenuItem onClick={() => onViewDetails(product)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(product)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleFeature(productId, product.featured)}>
                        <Star className="h-4 w-4 mr-2" />
                        {product.featured ? "Remove from Featured" : "Add to Featured"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete(productId)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Product
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
