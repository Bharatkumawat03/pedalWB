import { useState, useMemo } from "react";
import { Search, Package, ShoppingCart, User, FolderOpen, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdminData } from "@/hooks/useAdminData";
import { useNavigate } from "react-router-dom";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { products, orders, users, categories } = useAdminData();
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    if (!debouncedSearch) return { products: [], orders: [], users: [], categories: [] };

    const query = debouncedSearch.toLowerCase();

    return {
      products: products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      ).slice(0, 5),
      orders: orders.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.customer.name.toLowerCase().includes(query) ||
          o.status.toLowerCase().includes(query)
      ).slice(0, 5),
      users: users.filter(
        (u) =>
          u.firstName.toLowerCase().includes(query) ||
          u.lastName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.role.toLowerCase().includes(query)
      ).slice(0, 5),
      categories: categories.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      ).slice(0, 5),
    };
  }, [debouncedSearch, products, orders, users, categories]);

  const totalResults =
    searchResults.products.length +
    searchResults.orders.length +
    searchResults.users.length +
    searchResults.categories.length;

  const handleResultClick = (type: string, id: string) => {
    navigate(`/admin/${type}`);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, orders, users..."
            className="w-64 pl-10 bg-muted/50 border-none focus:bg-background transition-colors"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => searchQuery && setIsOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <ScrollArea className="max-h-96">
          {!debouncedSearch ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Start typing to search...
            </div>
          ) : totalResults === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No results found for "{debouncedSearch}"
            </div>
          ) : (
            <div className="p-2">
              {searchResults.products.length > 0 && (
                <div className="mb-3">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                    <Package className="h-3 w-3" />
                    Products ({searchResults.products.length})
                  </div>
                  {searchResults.products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick("products", product.id)}
                      className="w-full text-left px-2 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <span>{product.brand} • {product.category}</span>
                        <Badge variant="secondary" className="text-xs">
                          ₹{product.price.toLocaleString()}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.orders.length > 0 && (
                <div className="mb-3">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                    <ShoppingCart className="h-3 w-3" />
                    Orders ({searchResults.orders.length})
                  </div>
                  {searchResults.orders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => handleResultClick("orders", order.id)}
                      className="w-full text-left px-2 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <div className="font-medium text-sm">Order #{order.id}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <span>{order.customer.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.users.length > 0 && (
                <div className="mb-3">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Users ({searchResults.users.length})
                  </div>
                  {searchResults.users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleResultClick("users", user.id)}
                      className="w-full text-left px-2 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <div className="font-medium text-sm">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <span>{user.email}</span>
                        <Badge variant="secondary" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.categories.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                    <FolderOpen className="h-3 w-3" />
                    Categories ({searchResults.categories.length})
                  </div>
                  {searchResults.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleResultClick("categories", category.id)}
                      className="w-full text-left px-2 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <span>{category.description}</span>
                        <Badge variant={category.status === "active" ? "default" : "secondary"} className="text-xs">
                          {category.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
