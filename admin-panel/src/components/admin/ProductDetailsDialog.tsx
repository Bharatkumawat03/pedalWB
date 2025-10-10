import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package, 
  DollarSign, 
  Edit,
  Trash2,
  Star,
  Calendar,
  Tag,
  Truck,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailsDialogProps {
  product: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (product: any) => void;
  onDelete?: (productId: string) => void;
}

export function ProductDetailsDialog({ 
  product, 
  open, 
  onOpenChange, 
  onEdit, 
  onDelete 
}: ProductDetailsDialogProps) {
  const { toast } = useToast();

  if (!product) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Active":
        return { color: "bg-success/20 text-success", icon: CheckCircle2 };
      case "Draft":
        return { color: "bg-muted text-muted-foreground", icon: Package };
      case "Out of Stock":
        return { color: "bg-destructive/20 text-destructive", icon: AlertTriangle };
      default:
        return { color: "bg-muted text-muted-foreground", icon: Package };
    }
  };

  const statusConfig = getStatusConfig(product.status);
  const StatusIcon = statusConfig.icon;

  const handleShare = () => {
    navigator.clipboard.writeText(`Product: ${product.name} - ₹${product.price}`);
    toast({
      title: "Product details copied",
      description: "Product information has been copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            Product Details
          </DialogTitle>
          <DialogDescription>
            View and manage product information, pricing, and inventory details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Header */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-border">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover hover-scale"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.slice(1, 4).map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="h-20 w-20 rounded-lg object-cover border hover-scale cursor-pointer"
                    />
                  ))}
                  {product.images.length > 4 && (
                    <div className="h-20 w-20 rounded-lg border bg-muted flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        +{product.images.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  <p className="text-muted-foreground">Product ID: {product.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusConfig.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {product.status}
                  </Badge>
                  {product.featured && (
                    <Badge className="bg-primary/20 text-primary">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-info/20 text-info">
                      New
                    </Badge>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice !== product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.originalPrice !== product.price && (
                  <p className="text-sm text-success">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()} 
                    ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                  </p>
                )}
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Category</p>
                  <Badge variant="outline" className="justify-start">
                    <Tag className="h-3 w-3 mr-1" />
                    {product.category}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Brand</p>
                  <p className="text-sm">{product.brand}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Stock</p>
                  <p className={`text-sm font-medium ${
                    product.stock === 0 ? 'text-destructive' :
                    product.stock < 5 ? 'text-warning' : 'text-success'
                  }`}>
                    {product.stock} units
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">SKU</p>
                  <p className="text-sm font-mono">{product.id.toUpperCase()}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {onEdit && (
                  <Button onClick={() => onEdit(product)} className="hover-scale">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </Button>
                )}
                <Button variant="outline" onClick={handleShare} className="hover-scale">
                  <Package className="h-4 w-4 mr-2" />
                  Share Details
                </Button>
                {onDelete && (
                  <Button 
                    variant="outline" 
                    onClick={() => onDelete(product.id)}
                    className="text-destructive hover:text-destructive hover-scale"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Features</h3>
                <div className="grid gap-2">
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Shipping Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span>2.5 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span>30×20×15 cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Class:</span>
                    <span>Standard</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Product Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Added:</span>
                    <span>Jan 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>2 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Views:</span>
                    <span>1,234</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}