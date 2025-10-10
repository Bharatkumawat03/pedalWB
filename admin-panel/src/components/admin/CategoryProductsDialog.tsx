import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package, 
  DollarSign, 
  Eye,
  Edit,
  Trash2,
  Star,
  StarOff
} from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

interface CategoryProductsDialogProps {
  category: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryProductsDialog({ category, open, onOpenChange }: CategoryProductsDialogProps) {
  const { products } = useAdminData();
  
  if (!category) return null;

  // Filter products by category
  const categoryProducts = products.filter(product => product.category === category.name);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/20 text-success";
      case "Draft":
        return "bg-muted text-muted-foreground";
      case "Out of Stock":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            Products in "{category.name}" ({categoryProducts.length})
          </DialogTitle>
          <DialogDescription>
            View and manage all products in this category
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Info */}
          <Card className="bg-muted/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={category.image.url}
                  alt={category.image.altText}
                  className="h-16 w-16 rounded-lg object-cover border-2 border-border"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <Badge className="bg-success/20 text-success">
                      {category.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {category.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Slug: /{category.slug}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Products Grid */}
          {categoryProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Products Found
              </h3>
              <p className="text-sm text-muted-foreground">
                This category doesn't have any products yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-200 hover-scale">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Product Image */}
                      <div className="relative">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-32 w-full rounded-lg object-cover"
                        />
                        {product.featured && (
                          <div className="absolute top-2 right-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-semibold">₹{product.price.toLocaleString()}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Stock: {product.stock}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="flex-1 text-xs hover-scale">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 text-xs hover-scale">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive text-xs hover-scale">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {categoryProducts.length > 0 && (
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {categoryProducts.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Products</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">
                      {categoryProducts.filter(p => p.status === 'Active').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">
                      {categoryProducts.filter(p => p.status === 'Draft').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Draft</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">
                      {categoryProducts.filter(p => p.status === 'Out of Stock').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Out of Stock</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}