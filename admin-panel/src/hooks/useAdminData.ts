import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app, this would come from API
const initialProducts = [
  {
    id: "1",
    name: "Mountain Explorer Pro",
    category: "Mountain Bikes",
    brand: "Trek",
    price: 45999,
    originalPrice: 52999,
    stock: 15,
    status: "Active",
    featured: true,
    isNew: false,
    description: "High-performance mountain bike designed for extreme terrains and adventure seekers.",
    images: ["https://images.unsplash.com/photo-1544191696-15693be47905?w=400&h=400&fit=crop"],
    features: ["Carbon fiber frame", "Shimano XT components", "Tubeless ready wheels"]
  },
  {
    id: "2", 
    name: "City Cruiser Elite",
    category: "City Bikes",
    brand: "Giant",
    price: 28999,
    originalPrice: 32999,
    stock: 8,
    status: "Active",
    featured: false,
    isNew: true,
    description: "Comfortable and stylish city bike perfect for daily commuting.",
    images: ["https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop"],
    features: ["Lightweight aluminum frame", "7-speed transmission", "LED lights included"]
  },
  {
    id: "3",
    name: "Road Runner Carbon",
    category: "Road Bikes", 
    brand: "Specialized",
    price: 89999,
    originalPrice: 99999,
    stock: 3,
    status: "Low Stock",
    featured: true,
    isNew: false,
    description: "Professional road bike with carbon fiber construction for maximum speed.",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    features: ["Full carbon construction", "Electronic shifting", "Aerodynamic design"]
  }
];

const initialCategories = [
  {
    id: "1",
    name: "Mountain Bikes",
    slug: "mountain-bikes",
    description: "High-performance bikes for off-road adventures",
    productCount: 45,
    status: "Active",
    image: {
      url: "https://images.unsplash.com/photo-1544191696-15693be47905?w=400&h=400&fit=crop",
      altText: "Mountain bike on trail"
    }
  },
  {
    id: "2",
    name: "Road Bikes", 
    slug: "road-bikes",
    description: "Lightweight bikes designed for speed on paved roads",
    productCount: 32,
    status: "Active",
    image: {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      altText: "Road bike"
    }
  },
  {
    id: "3",
    name: "City Bikes",
    slug: "city-bikes", 
    description: "Comfortable bikes perfect for urban commuting",
    productCount: 28,
    status: "Active",
    image: {
      url: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop",
      altText: "City bike"
    }
  }
];

const initialUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    role: "Customer",
    status: "Active",
    joinDate: "2024-01-15",
    totalOrders: 12,
    totalSpent: 145000,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith", 
    email: "jane.smith@example.com",
    phone: "+91 9876543211",
    role: "Customer",
    status: "Active",
    joinDate: "2024-02-20",
    totalOrders: 8,
    totalSpent: 89000,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=40&h=40&fit=crop&crop=face"
  }
];

const initialOrders = [
  {
    id: "ORD-12847",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    items: [
      { name: "Mountain Explorer Pro", quantity: 1, price: 45999 }
    ],
    total: 45999,
    status: "Completed",
    paymentStatus: "Paid",
    shippingAddress: "123 Main St, Mumbai, MH 400001",
    orderDate: "2024-03-20T10:30:00Z",
    deliveryDate: "2024-03-25T14:00:00Z",
    trackingNumber: "TRK123456789"
  },
  {
    id: "ORD-12846",
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com", 
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=40&h=40&fit=crop&crop=face"
    },
    items: [
      { name: "City Cruiser Elite", quantity: 1, price: 28999 },
      { name: "Safety Helmet", quantity: 1, price: 2500 }
    ],
    total: 31499,
    status: "Processing",
    paymentStatus: "Paid",
    shippingAddress: "456 Park Ave, Delhi, DL 110001",
    orderDate: "2024-03-19T15:45:00Z",
    deliveryDate: null,
    trackingNumber: null
  },
  {
    id: "ORD-12845",
    customer: {
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    items: [
      { name: "Road Runner Carbon", quantity: 1, price: 89999 }
    ],
    total: 89999,
    status: "Shipped",
    paymentStatus: "Paid",
    shippingAddress: "789 Oak St, Bangalore, KA 560001",
    orderDate: "2024-03-18T09:20:00Z",
    deliveryDate: null,
    trackingNumber: "TRK987654321"
  },
  {
    id: "ORD-12844",
    customer: {
      name: "Sarah Wilson", 
      email: "sarah.wilson@example.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    items: [
      { name: "Kids Adventure Bike", quantity: 2, price: 12499 }
    ],
    total: 24998,
    status: "Pending",
    paymentStatus: "Pending",
    shippingAddress: "321 Pine St, Chennai, TN 600001",
    orderDate: "2024-03-21T12:00:00Z",
    deliveryDate: null,
    trackingNumber: null
  },
  {
    id: "ORD-12843",
    customer: {
      name: "David Brown",
      email: "david.brown@example.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face"
    },
    items: [
      { name: "Electric Bike Pro", quantity: 1, price: 65999 },
      { name: "Bike Lock", quantity: 1, price: 1500 }
    ],
    total: 67499,
    status: "Cancelled",
    paymentStatus: "Refunded",
    shippingAddress: "654 Elm St, Pune, MH 411001",
    orderDate: "2024-03-17T16:30:00Z",
    deliveryDate: null,
    trackingNumber: null
  }
];

// Mock Brands Data
const initialBrands = [
  { id: "brand-1", name: "Nike", description: "Athletic footwear and apparel", country: "USA", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop", website: "https://nike.com", tier: "Premium", status: "Active", productCount: 145, revenue: 2500000, createdAt: "2020-01-15" },
  { id: "brand-2", name: "Adidas", description: "Sports equipment and clothing", country: "Germany", logo: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=100&h=100&fit=crop", website: "https://adidas.com", tier: "Premium", status: "Active", productCount: 132, revenue: 2200000, createdAt: "2020-02-20" },
  { id: "brand-3", name: "Apple", description: "Consumer electronics and software", country: "USA", logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100&h=100&fit=crop", website: "https://apple.com", tier: "Premium", status: "Active", productCount: 89, revenue: 5500000, createdAt: "2019-11-10" },
  { id: "brand-4", name: "Samsung", description: "Electronics and technology", country: "South Korea", logo: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop", website: "https://samsung.com", tier: "Premium", status: "Active", productCount: 201, revenue: 4800000, createdAt: "2020-03-05" },
  { id: "brand-5", name: "Sony", description: "Electronics and entertainment", country: "Japan", logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop", website: "https://sony.com", tier: "Premium", status: "Active", productCount: 167, revenue: 3900000, createdAt: "2019-12-15" },
  { id: "brand-6", name: "Zara", description: "Fashion and apparel", country: "Spain", logo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&h=100&fit=crop", website: "https://zara.com", tier: "Standard", status: "Active", productCount: 423, revenue: 1800000, createdAt: "2020-04-12" },
  { id: "brand-7", name: "H&M", description: "Fashion retailer", country: "Sweden", logo: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&h=100&fit=crop", website: "https://hm.com", tier: "Standard", status: "Active", productCount: 512, revenue: 1500000, createdAt: "2020-01-28" },
  { id: "brand-8", name: "IKEA", description: "Furniture and home accessories", country: "Sweden", logo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop", website: "https://ikea.com", tier: "Standard", status: "Active", productCount: 789, revenue: 3200000, createdAt: "2019-10-20" },
  { id: "brand-9", name: "Rolex", description: "Luxury watches", country: "Switzerland", logo: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&h=100&fit=crop", website: "https://rolex.com", tier: "Premium", status: "Active", productCount: 45, revenue: 8900000, createdAt: "2019-09-15" },
  { id: "brand-10", name: "Toyota", description: "Automotive manufacturer", country: "Japan", logo: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100&h=100&fit=crop", website: "https://toyota.com", tier: "Premium", status: "Active", productCount: 234, revenue: 6700000, createdAt: "2020-02-10" },
  { id: "brand-11", name: "Levi's", description: "Denim and casual wear", country: "USA", logo: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop", website: "https://levis.com", tier: "Standard", status: "Inactive", productCount: 0, revenue: 0, createdAt: "2020-05-18" },
  { id: "brand-12", name: "Puma", description: "Athletic and casual footwear", country: "Germany", logo: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100&h=100&fit=crop", website: "https://puma.com", tier: "Standard", status: "Active", productCount: 98, revenue: 980000, createdAt: "2020-03-22" },
];

export function useAdminData() {
  const { toast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [brands, setBrands] = useState(initialBrands);
  const [users, setUsers] = useState(initialUsers);
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(false);

  // Product operations
  const createProduct = async (productData: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProduct = {
        ...productData,
        id: Date.now().toString(),
        status: "Active"
      };
      setProducts(prev => [newProduct, ...prev]);
      
      toast({
        title: "Success",
        description: "Product created successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...productData } : product
      ));
      
      toast({
        title: "Success",
        description: "Product updated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProducts(prev => prev.filter(product => product.id !== id));
      
      toast({
        title: "Success",
        description: "Product deleted successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Category operations
  const createCategory = async (categoryData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCategory = {
        ...categoryData,
        id: Date.now().toString(),
        slug: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        productCount: 0,
        status: "Active"
      };
      setCategories(prev => [newCategory, ...prev]);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, categoryData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCategories(prev => prev.map(category => 
        category.id === id ? { 
          ...category, 
          ...categoryData,
          slug: categoryData.name.toLowerCase().replace(/\s+/g, '-')
        } : category
      ));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCategories(prev => prev.filter(category => category.id !== id));
      
      toast({
        title: "Success",
        description: "Category deleted successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User operations
  const createUser = async (userData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        joinDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalSpent: 0,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&seed=${Date.now()}`
      };
      setUsers(prev => [newUser, ...prev]);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...userData } : user
      ));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.filter(user => user.id !== id));
      
      toast({
        title: "Success",
        description: "User deleted successfully!"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete user",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Search and filter functions
  const searchProducts = (searchTerm: string, category: string) => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  };

  const searchCategories = (searchTerm: string) => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const searchUsers = (searchTerm: string, role: string, status: string) => {
    return users.filter(user => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = role === "all" || user.role === role;
      const matchesStatus = status === "all" || user.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  };


   // Brand operations
   const createBrand = async (brandData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newBrand = {
        id: `brand-${Date.now()}`,
        ...brandData,
        productCount: 0,
        revenue: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setBrands([...brands, newBrand]);
      toast({ title: "Success", description: "Brand created successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create brand", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateBrand = async (id: string, brandData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBrands(brands.map(brand => brand.id === id ? { ...brand, ...brandData } : brand));
      toast({ title: "Success", description: "Brand updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update brand", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBrands(brands.filter(brand => brand.id !== id));
      toast({ title: "Success", description: "Brand deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete brand", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const searchBrands = (searchTerm: string) => {
    if (!searchTerm) return brands;
    const term = searchTerm.toLowerCase();
    return brands.filter(brand =>
      brand.name.toLowerCase().includes(term) ||
      brand.description.toLowerCase().includes(term) ||
      brand.country.toLowerCase().includes(term) ||
      brand.id.toLowerCase().includes(term)
    );
  };

  // Order operations
  const updateOrderStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(prev => prev.map(order => 
        order.id === id ? { 
          ...order, 
          status,
          ...(status === "Shipped" && !order.trackingNumber ? { trackingNumber: `TRK${Date.now()}` } : {}),
          ...(status === "Completed" && !order.deliveryDate ? { deliveryDate: new Date().toISOString() } : {})
        } : order
      ));
      
      toast({
        title: "Order Updated",
        description: `Order ${id} status changed to ${status}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(prev => prev.map(order => 
        order.id === id ? { 
          ...order, 
          status: "Cancelled",
          paymentStatus: order.paymentStatus === "Paid" ? "Refunded" : "Cancelled"
        } : order
      ));
      
      toast({
        title: "Order Cancelled",
        description: `Order ${id} has been cancelled`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const searchOrders = (searchTerm: string, status: string, paymentStatus: string) => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = status === "all" || order.status === status;
      const matchesPaymentStatus = paymentStatus === "all" || order.paymentStatus === paymentStatus;
      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });
  };

  return {
    // Data
    products,
    categories,
    users,
    orders,
    loading,
    
    // Product operations
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    
    // Category operations
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories,

     // Brand operations
     createBrand,
     updateBrand,
     deleteBrand,
     searchBrands,
    
    // User operations
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    
    // Order operations
    updateOrderStatus,
    cancelOrder,
    searchOrders,
  };
}