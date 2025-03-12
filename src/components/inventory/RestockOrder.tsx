"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Package,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Calendar,
  Save,
  Trash2,
  CheckCircle,
  FileText,
  History,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stockQuantity: number;
  unit: string;
  minStockLevel: number;
  supplier: string;
  location: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  lastRestock?: Date;
  isConsumable: boolean;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  status:
    | "draft"
    | "pending"
    | "ordered"
    | "partial"
    | "complete"
    | "cancelled";
  items: OrderItem[];
  notes?: string;
  totalAmount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data generator for products with low stock
const generateMockProducts = (): Product[] => {
  const categories = [
    "Shampoo",
    "Conditioner",
    "Styling",
    "Tools",
    "Accessories",
    "Nail Care",
    "Skin Care",
    "Towels",
    "Razors",
    "Miscellaneous",
  ];
  const units = ["bottle", "piece", "pack", "set", "box", "kit"];
  const suppliers = [
    "Beauty Wholesale Inc.",
    "Professional Supplies Co.",
    "Global Beauty",
    "Perfect Tools Ltd.",
    "Salon Essentials",
  ];
  const locations = [
    "Main Storage",
    "Display Shelf",
    "Back Room",
    "Cabinet A",
    "Cabinet B",
    "Supply Closet",
  ];

  const getRandomElement = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const products: Product[] = [];

  // Shampoos
  [
    "Hydrating Shampoo",
    "Volumizing Shampoo",
    "Color Protection Shampoo",
    "Anti-Dandruff Shampoo",
    "Clarifying Shampoo",
    "Nourishing Shampoo",
  ].forEach((name, index) => {
    products.push({
      id: `sh-${index + 1}`,
      name,
      sku: `SHA${(100 + index).toString()}`,
      description: `Professional quality ${name.toLowerCase()} for salon use.`,
      category: "Shampoo",
      price: 120000 + index * 20000,
      cost: 75000 + index * 12000,
      stockQuantity: Math.max(0, 5 - index), // Low stock
      unit: "bottle",
      minStockLevel: 10,
      supplier: getRandomElement(suppliers),
      location: getRandomElement(locations),
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(),
      lastRestock: new Date(2023, 5, 15),
      isConsumable: true,
    });
  });

  // Conditioners
  [
    "Hydrating Conditioner",
    "Volumizing Conditioner",
    "Color Protection Conditioner",
    "Deep Repair Conditioner",
    "Leave-in Conditioner",
  ].forEach((name, index) => {
    products.push({
      id: `co-${index + 1}`,
      name,
      sku: `CON${(100 + index).toString()}`,
      description: `Professional quality ${name.toLowerCase()} for salon use.`,
      category: "Conditioner",
      price: 130000 + index * 20000,
      cost: 85000 + index * 12000,
      stockQuantity: Math.max(0, 7 - index), // Low stock
      unit: "bottle",
      minStockLevel: 10,
      supplier: getRandomElement(suppliers),
      location: getRandomElement(locations),
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(),
      lastRestock: new Date(2023, 6, 20),
      isConsumable: true,
    });
  });

  // Styling products
  [
    "Hair Gel",
    "Hair Spray",
    "Hair Wax",
    "Styling Mousse",
    "Heat Protectant",
    "Hair Serum",
    "Texture Powder",
  ].forEach((name, index) => {
    products.push({
      id: `st-${index + 1}`,
      name,
      sku: `STY${(100 + index).toString()}`,
      description: `Professional quality ${name.toLowerCase()} for salon use.`,
      category: "Styling",
      price: 100000 + index * 15000,
      cost: 60000 + index * 10000,
      stockQuantity: Math.max(0, 6 - index), // Low stock
      unit: index % 2 === 0 ? "bottle" : "can",
      minStockLevel: 8,
      supplier: getRandomElement(suppliers),
      location: getRandomElement(locations),
      createdAt: new Date(2023, 1, 15),
      updatedAt: new Date(),
      lastRestock: new Date(2023, 7, 10),
      isConsumable: true,
    });
  });

  // Tools
  [
    "Professional Hair Scissors",
    "Thinning Scissors",
    "Electric Hair Clipper",
    "Hair Dryer",
    "Curling Iron",
    "Flat Iron",
    "Round Brush",
    "Paddle Brush",
    "Tail Comb",
    "Wide Tooth Comb",
  ].forEach((name, index) => {
    products.push({
      id: `to-${index + 1}`,
      name,
      sku: `TOOL${(100 + index).toString()}`,
      description: `Professional quality ${name.toLowerCase()} for salon use.`,
      category: "Tools",
      price: 200000 + index * 100000,
      cost: 120000 + index * 60000,
      stockQuantity: Math.max(0, 4 - (index % 3)), // Some low stock
      unit: "piece",
      minStockLevel: 3,
      supplier: getRandomElement(suppliers),
      location: getRandomElement(locations),
      createdAt: new Date(2023, 2, 10),
      updatedAt: new Date(),
      lastRestock: new Date(2023, 8, 5),
      isConsumable: false,
    });
  });

  // Add more categories as needed

  return products.filter(
    (p) => p.stockQuantity <= p.minStockLevel && p.isConsumable
  );
};

// Mock data generator for suppliers
const generateMockSuppliers = (): Supplier[] => {
  return [
    {
      id: "sup-1",
      name: "Beauty Wholesale Inc.",
      contactPerson: "Sarah Johnson",
      email: "sarah@beautywholesale.com",
      phone: "0923456789",
      address: "123 Beauty Suppliers Street, District 1, HCMC",
      notes: "Preferred supplier for shampoos and conditioners.",
    },
    {
      id: "sup-2",
      name: "Professional Supplies Co.",
      contactPerson: "Michael Lee",
      email: "michael@prosupplies.com",
      phone: "0912345678",
      address: "456 Pro Tools Avenue, District 2, HCMC",
      notes: "Great pricing on bulk orders. 30-day payment terms.",
    },
    {
      id: "sup-3",
      name: "Global Beauty",
      contactPerson: "Linda Tran",
      email: "linda@globalbeauty.com",
      phone: "0987654321",
      address: "789 Cosmetics Boulevard, District 3, HCMC",
      notes: "International supplier. Order 2 weeks in advance.",
    },
    {
      id: "sup-4",
      name: "Perfect Tools Ltd.",
      contactPerson: "David Nguyen",
      email: "david@perfecttools.com",
      phone: "0934567890",
      address: "321 Equipment Lane, District 1, HCMC",
      notes: "Specializes in high-quality salon equipment and tools.",
    },
    {
      id: "sup-5",
      name: "Salon Essentials",
      contactPerson: "Emily Pham",
      email: "emily@salonessentials.com",
      phone: "0945678901",
      address: "654 Beauty Street, District 4, HCMC",
      notes: "Local supplier with fast delivery. COD available.",
    },
  ];
};

// Mock orders history
const generateMockOrders = (): Order[] => {
  const products = generateMockProducts();
  const suppliers = generateMockSuppliers();

  const getRandomProducts = (count: number): OrderItem[] => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return selected
      .map((product) => ({
        productId: product.id,
        product,
        quantity: 5 + Math.floor(Math.random() * 20),
        unitPrice: product.cost,
        total: 0, // Will be calculated
      }))
      .map((item) => ({
        ...item,
        total: item.quantity * item.unitPrice,
      }));
  };

  const orders: Order[] = [];

  // Generate sample orders
  const statuses: Order["status"][] = [
    "draft",
    "pending",
    "ordered",
    "partial",
    "complete",
    "cancelled",
  ];

  for (let i = 1; i <= 10; i++) {
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const items = getRandomProducts(2 + Math.floor(Math.random() * 4));
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));

    const expectedDeliveryDate = new Date(orderDate);
    expectedDeliveryDate.setDate(
      expectedDeliveryDate.getDate() + 7 + Math.floor(Math.random() * 7)
    );

    orders.push({
      id: `ord-${(1000 + i).toString()}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      orderDate,
      expectedDeliveryDate,
      status,
      items,
      notes: Math.random() > 0.5 ? "Please deliver in the morning." : undefined,
      totalAmount,
      createdBy: "Admin",
      createdAt: orderDate,
      updatedAt: orderDate,
    });
  }

  return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
};

// Form schemas
const orderFormSchema = z.object({
  supplierId: z.string({
    required_error: "Vui lòng chọn nhà cung cấp",
  }),
  expectedDeliveryDate: z.date().optional(),
  notes: z.string().optional(),
});

// Main component
export default function RestockOrder() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("products");
  const [confirmOrderDialogOpen, setConfirmOrderDialogOpen] = useState(false);
  const [orderCreatedDialogOpen, setOrderCreatedDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("products");

  // Form
  const orderForm = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      supplierId: "",
      notes: "",
    },
  });

  // Load mock data on component mount
  useEffect(() => {
    const mockProducts = generateMockProducts();
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);

    const mockSuppliers = generateMockSuppliers();
    setSuppliers(mockSuppliers);

    const mockOrders = generateMockOrders();
    setOrderHistory(mockOrders);
  }, []);

  // Watch supplierId changes
  useEffect(() => {
    const supplierId = orderForm.watch("supplierId");
    if (supplierId) {
      const supplier = suppliers.find((s) => s.id === supplierId);
      setCurrentSupplier(supplier || null);

      // Filter products by the selected supplier
      if (supplier) {
        setFilteredProducts(
          products.filter(
            (p) =>
              p.supplier === supplier.name &&
              p.stockQuantity <= p.minStockLevel &&
              p.isConsumable
          )
        );
      }
    } else {
      setCurrentSupplier(null);
      setFilteredProducts(products);
    }
  }, [orderForm.watch("supplierId"), suppliers, products]);

  // Filter products based on search and category
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    const filtered = products.filter((product) => {
      const matchesSearch =
        term === "" ||
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.sku.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const matchesSupplier =
        !currentSupplier || product.supplier === currentSupplier.name;

      return matchesSearch && matchesCategory && matchesSupplier;
    });

    setFilteredProducts(filtered);
  };

  // Filter products by category
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);

    const filtered = products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        category === "all" || product.category === category;

      const matchesSupplier =
        !currentSupplier || product.supplier === currentSupplier.name;

      return matchesSearch && matchesCategory && matchesSupplier;
    });

    setFilteredProducts(filtered);
  };

  // Get unique categories
  const categories = useMemo(() => {
    const categorySet = new Set(products.map((p) => p.category));
    return Array.from(categorySet);
  }, [products]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Add product to cart
  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      // Update quantity if already in cart
      setCartItems(
        cartItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.unitPrice,
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: OrderItem = {
        productId: product.id,
        product,
        quantity: 1,
        unitPrice: product.cost,
        total: product.cost,
      };

      setCartItems([...cartItems, newItem]);
    }
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  // Update item quantity
  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              total: quantity * item.unitPrice,
            }
          : item
      )
    );
  };

  // Calculate cart total
  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  }, [cartItems]);

  // Calculate reorder suggestion
  const getSuggestedReorderQuantity = (product: Product): number => {
    return Math.max(0, product.minStockLevel * 2 - product.stockQuantity);
  };

  // Add all suggested products
  const addAllSuggested = () => {
    const suggested = filteredProducts
      .map((product) => ({
        productId: product.id,
        product,
        quantity: getSuggestedReorderQuantity(product),
        unitPrice: product.cost,
        total: getSuggestedReorderQuantity(product) * product.cost,
      }))
      .filter((item) => item.quantity > 0);

    // Merge with existing cart items
    const newCartItems = [...cartItems];

    suggested.forEach((suggestedItem) => {
      const existingIndex = newCartItems.findIndex(
        (item) => item.productId === suggestedItem.productId
      );

      if (existingIndex >= 0) {
        // Update existing item
        newCartItems[existingIndex] = {
          ...newCartItems[existingIndex],
          quantity: suggestedItem.quantity,
          total: suggestedItem.quantity * newCartItems[existingIndex].unitPrice,
        };
      } else {
        // Add new item
        newCartItems.push(suggestedItem);
      }
    });

    setCartItems(newCartItems);
  };

  // Handle form submission
  const handleSubmitOrder = (data: z.infer<typeof orderFormSchema>) => {
    if (cartItems.length === 0) {
      alert("Vui lòng thêm ít nhất một sản phẩm vào đơn hàng.");
      return;
    }

    const supplier = suppliers.find((s) => s.id === data.supplierId);

    if (!supplier) {
      alert("Vui lòng chọn nhà cung cấp hợp lệ.");
      return;
    }

    // Create a new order object
    const newOrder: Order = {
      id: `ord-${Date.now().toString()}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      orderDate: new Date(),
      expectedDeliveryDate: data.expectedDeliveryDate,
      status: "draft",
      items: cartItems,
      notes: data.notes,
      totalAmount: cartTotal,
      createdBy: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to order history
    setOrderHistory([newOrder, ...orderHistory]);

    // Show confirmation dialog
    setOrderCreatedDialogOpen(true);

    // Reset form and cart
    orderForm.reset();
    setCartItems([]);
    setActiveTab("products");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FileText className="mr-2 h-8 w-8 text-primary" />
          Đặt Hàng Bổ Sung Sản Phẩm Tiêu Hao
        </h1>
        <p className="text-muted-foreground">
          Tạo đơn đặt hàng mới cho các sản phẩm tiêu hao đang cần bổ sung
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <Tabs defaultValue="products" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="products" className="flex items-center">
                    <Package className="mr-1 h-4 w-4" />
                    Chọn Sản Phẩm
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center">
                    <History className="mr-1 h-4 w-4" />
                    Lịch Sử Đơn Hàng
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsContent value="products">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Tìm kiếm sản phẩm..."
                          className="pl-8 w-full"
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </div>

                      <Select
                        value={categoryFilter}
                        onValueChange={handleCategoryFilter}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả danh mục</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        className="whitespace-nowrap"
                        onClick={addAllSuggested}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Thêm tất cả gợi ý
                      </Button>
                    </div>

                    <ScrollArea className="h-[calc(100vh-380px)] min-h-[300px] rounded-md border">
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <Card
                              key={product.id}
                              className={
                                product.stockQuantity === 0
                                  ? "border-red-200"
                                  : "border-amber-200"
                              }
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-medium text-base">
                                      {product.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {product.sku}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={
                                      product.stockQuantity === 0
                                        ? "destructive"
                                        : "outline"
                                    }
                                    className={
                                      product.stockQuantity === 0
                                        ? ""
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }
                                  >
                                    {product.stockQuantity === 0
                                      ? "Hết hàng"
                                      : "Sắp hết"}
                                  </Badge>
                                </div>

                                <div className="space-y-1 mb-3">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Tồn kho:
                                    </span>
                                    <span className="font-medium">
                                      {product.stockQuantity} {product.unit}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Mức tối thiểu:
                                    </span>
                                    <span className="font-medium">
                                      {product.minStockLevel} {product.unit}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Đơn giá:
                                    </span>
                                    <span className="font-medium">
                                      {formatCurrency(product.cost)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Danh mục:
                                    </span>
                                    <span>{product.category}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Nhà cung cấp:
                                    </span>
                                    <span>{product.supplier}</span>
                                  </div>
                                </div>

                                <Separator className="my-3" />

                                <div className="flex justify-between items-center mt-2">
                                  <div>
                                    <Label className="text-xs">
                                      Gợi ý đặt hàng:
                                    </Label>
                                    <div className="font-medium">
                                      {getSuggestedReorderQuantity(product)}{" "}
                                      {product.unit}
                                    </div>
                                  </div>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => addToCart(product)}
                                  >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Thêm vào đơn
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="col-span-2 flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                            <Package className="h-10 w-10 mb-2 opacity-20" />
                            <p>Không tìm thấy sản phẩm nào.</p>
                            <p className="text-sm">
                              Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa
                              khác.
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <ScrollArea className="h-[calc(100vh-380px)] min-h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã đơn hàng</TableHead>
                          <TableHead>Nhà cung cấp</TableHead>
                          <TableHead>Ngày đặt</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="text-right">
                            Tổng tiền
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderHistory.length > 0 ? (
                          orderHistory.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">
                                {order.id}
                              </TableCell>
                              <TableCell>{order.supplierName}</TableCell>
                              <TableCell>
                                {format(order.orderDate, "dd/MM/yyyy")}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    order.status === "complete"
                                      ? "default"
                                      : order.status === "cancelled"
                                      ? "destructive"
                                      : "outline"
                                  }
                                >
                                  {order.status === "draft" && "Nháp"}
                                  {order.status === "pending" && "Chờ xử lý"}
                                  {order.status === "ordered" && "Đã đặt hàng"}
                                  {order.status === "partial" &&
                                    "Nhận một phần"}
                                  {order.status === "complete" && "Hoàn thành"}
                                  {order.status === "cancelled" && "Đã hủy"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(order.totalAmount)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              Không có đơn hàng nào.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Đơn đặt hàng mới
              </CardTitle>
              <CardDescription>
                {cartItems.length} sản phẩm trong đơn hàng
              </CardDescription>
            </CardHeader>

            <Form {...orderForm}>
              <form onSubmit={orderForm.handleSubmit(handleSubmitOrder)}>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      control={orderForm.control}
                      name="supplierId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nhà cung cấp</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn nhà cung cấp" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {suppliers.map((supplier) => (
                                <SelectItem
                                  key={supplier.id}
                                  value={supplier.id}
                                >
                                  {supplier.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {currentSupplier && (
                      <div className="rounded-md border p-3 text-sm">
                        <p className="font-medium">{currentSupplier.name}</p>
                        <p className="text-muted-foreground">
                          Liên hệ: {currentSupplier.contactPerson}
                        </p>
                        <p className="text-muted-foreground">
                          Email: {currentSupplier.email}
                        </p>
                        <p className="text-muted-foreground">
                          SĐT: {currentSupplier.phone}
                        </p>
                      </div>
                    )}

                    <FormField
                      control={orderForm.control}
                      name="expectedDeliveryDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày nhận dự kiến</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={
                                    !field.value ? "text-muted-foreground" : ""
                                  }
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Thời gian dự kiến nhận hàng.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={orderForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Thêm ghi chú cho đơn hàng này"
                              className="resize-none min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <Label>Sản phẩm trong đơn hàng</Label>
                      <ScrollArea className="h-[200px] mt-2 rounded-md border">
                        {cartItems.length > 0 ? (
                          <div className="p-4 space-y-3">
                            {cartItems.map((item) => (
                              <div
                                key={item.productId}
                                className="flex justify-between items-center border-b pb-2"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {item.product.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatCurrency(item.unitPrice)} x{" "}
                                    {item.quantity} {item.product.unit}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="text-right mr-3">
                                    <div className="font-medium">
                                      {formatCurrency(item.total)}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() =>
                                        updateItemQuantity(
                                          item.productId,
                                          item.quantity - 1
                                        )
                                      }
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <Input
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) =>
                                        updateItemQuantity(
                                          item.productId,
                                          Number.parseInt(e.target.value) || 0
                                        )
                                      }
                                      className="h-7 w-14 text-center"
                                      min="1"
                                    />
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() =>
                                        updateItemQuantity(
                                          item.productId,
                                          item.quantity + 1
                                        )
                                      }
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-red-500 hover:text-red-700"
                                      onClick={() =>
                                        removeFromCart(item.productId)
                                      }
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full py-8 text-center text-muted-foreground">
                            <ShoppingCart className="h-8 w-8 mb-2 opacity-20" />
                            <p>Chưa có sản phẩm nào.</p>
                            <p className="text-xs">
                              Chọn sản phẩm để thêm vào đơn hàng.
                            </p>
                          </div>
                        )}
                      </ScrollArea>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between font-medium">
                        <span>Tổng cộng:</span>
                        <span>{formatCurrency(cartTotal)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline">
                    Huỷ
                  </Button>
                  <Button
                    type="submit"
                    className="gap-1"
                    disabled={
                      cartItems.length === 0 ||
                      !orderForm.getValues("supplierId")
                    }
                  >
                    <Save className="h-4 w-4" />
                    Lưu đơn hàng
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>

      {/* Order Created Dialog */}
      <AlertDialog
        open={orderCreatedDialogOpen}
        onOpenChange={setOrderCreatedDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Đơn hàng đã được tạo
            </AlertDialogTitle>
            <AlertDialogDescription>
              Đơn hàng đã được lưu thành công và sẵn sàng để xử lý. Bạn có thể
              xem và quản lý đơn hàng trong phần Lịch sử đơn hàng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Đồng ý</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
