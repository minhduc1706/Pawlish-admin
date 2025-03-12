"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  Package,
  Layers,
  AlertTriangle,
  FileText,
  History,
  ShoppingCart,
  ArrowDownUp,
  CheckCircle2,
  Download,
  BarChart4,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Textarea } from "@/components/ui/textarea";

import { Progress } from "@/components/ui/progress";

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  costPrice: number;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  location: string;
  lastRestocked: string;
  expiryDate?: string;
  status: "active" | "discontinued";
  image?: string;
  description?: string;
}

interface StockMovement {
  id: string;
  productId: string;
  date: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  performedBy: string;
  reference?: string;
}

// Sample data
const generateSampleProducts = (): Product[] => {
  return [
    {
      id: "1",
      name: "Dầu gội cao cấp",
      sku: "SH-001",
      category: "Dầu gội",
      brand: "L'Oréal",
      price: 120000,
      costPrice: 80000,
      currentStock: 25,
      minStockLevel: 10,
      maxStockLevel: 50,
      unit: "chai",
      location: "Kệ A1",
      lastRestocked: "2023-11-15",
      expiryDate: "2025-11-15",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Dầu gội cao cấp dành cho tóc khô và hư tổn",
    },
    {
      id: "2",
      name: "Dầu xả dưỡng tóc",
      sku: "CO-002",
      category: "Dầu xả",
      brand: "L'Oréal",
      price: 110000,
      costPrice: 70000,
      currentStock: 18,
      minStockLevel: 10,
      maxStockLevel: 40,
      unit: "chai",
      location: "Kệ A1",
      lastRestocked: "2023-11-15",
      expiryDate: "2025-11-15",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Dầu xả dưỡng tóc giúp tóc mềm mượt",
    },
    {
      id: "3",
      name: "Dao cạo 5 lưỡi",
      sku: "RZ-003",
      category: "Dao cạo",
      brand: "Gillette",
      price: 85000,
      costPrice: 55000,
      currentStock: 8,
      minStockLevel: 15,
      maxStockLevel: 60,
      unit: "cái",
      location: "Kệ B2",
      lastRestocked: "2023-10-20",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Dao cạo 5 lưỡi sắc bén, cạo êm",
    },
    {
      id: "4",
      name: "Lược chải tóc rối",
      sku: "CB-004",
      category: "Lược",
      brand: "Tangle Teezer",
      price: 250000,
      costPrice: 180000,
      currentStock: 12,
      minStockLevel: 5,
      maxStockLevel: 20,
      unit: "cái",
      location: "Kệ C1",
      lastRestocked: "2023-11-05",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Lược chải tóc rối chuyên dụng",
    },
    {
      id: "5",
      name: "Khăn spa cao cấp",
      sku: "TW-005",
      category: "Khăn",
      brand: "Spa Luxury",
      price: 95000,
      costPrice: 60000,
      currentStock: 35,
      minStockLevel: 20,
      maxStockLevel: 100,
      unit: "cái",
      location: "Kệ D3",
      lastRestocked: "2023-11-10",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Khăn spa cao cấp, mềm mịn, thấm hút tốt",
    },
    {
      id: "6",
      name: "Sáp vuốt tóc",
      sku: "WX-006",
      category: "Tạo kiểu tóc",
      brand: "Wella",
      price: 180000,
      costPrice: 120000,
      currentStock: 15,
      minStockLevel: 8,
      maxStockLevel: 30,
      unit: "hộp",
      location: "Kệ B1",
      lastRestocked: "2023-10-25",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Sáp vuốt tóc giữ nếp lâu, không bết dính",
    },
    {
      id: "7",
      name: "Kẹp tóc chuyên nghiệp",
      sku: "CL-007",
      category: "Phụ kiện",
      brand: "Salon Pro",
      price: 45000,
      costPrice: 25000,
      currentStock: 40,
      minStockLevel: 20,
      maxStockLevel: 80,
      unit: "bộ",
      location: "Kệ C2",
      lastRestocked: "2023-11-01",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Bộ kẹp tóc chuyên nghiệp dành cho salon",
    },
    {
      id: "8",
      name: "Găng tay nhuộm tóc",
      sku: "GL-008",
      category: "Phụ kiện",
      brand: "Salon Pro",
      price: 30000,
      costPrice: 15000,
      currentStock: 5,
      minStockLevel: 30,
      maxStockLevel: 100,
      unit: "đôi",
      location: "Kệ D1",
      lastRestocked: "2023-10-15",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Găng tay dùng khi nhuộm tóc, bảo vệ da tay",
    },
    {
      id: "9",
      name: "Thuốc nhuộm tóc nâu đen",
      sku: "DY-009",
      category: "Thuốc nhuộm",
      brand: "Schwarzkopf",
      price: 220000,
      costPrice: 150000,
      currentStock: 10,
      minStockLevel: 8,
      maxStockLevel: 30,
      unit: "hộp",
      location: "Kệ A3",
      lastRestocked: "2023-11-08",
      expiryDate: "2024-11-08",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Thuốc nhuộm tóc màu nâu đen tự nhiên",
    },
    {
      id: "10",
      name: "Máy sấy tóc công suất cao",
      sku: "DR-010",
      category: "Thiết bị",
      brand: "Dyson",
      price: 2500000,
      costPrice: 2000000,
      currentStock: 3,
      minStockLevel: 2,
      maxStockLevel: 10,
      unit: "cái",
      location: "Tủ A",
      lastRestocked: "2023-09-20",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Máy sấy tóc công suất cao, bảo vệ tóc khỏi hư tổn",
    },
    {
      id: "11",
      name: "Kem ủ tóc phục hồi",
      sku: "TR-011",
      category: "Dưỡng tóc",
      brand: "Kerastase",
      price: 350000,
      costPrice: 250000,
      currentStock: 7,
      minStockLevel: 5,
      maxStockLevel: 20,
      unit: "hũ",
      location: "Kệ A2",
      lastRestocked: "2023-10-30",
      expiryDate: "2025-10-30",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Kem ủ tóc phục hồi tóc hư tổn nặng",
    },
    {
      id: "12",
      name: "Bông tẩy trang",
      sku: "CT-012",
      category: "Phụ kiện",
      brand: "Beauty Pro",
      price: 35000,
      costPrice: 20000,
      currentStock: 2,
      minStockLevel: 10,
      maxStockLevel: 50,
      unit: "gói",
      location: "Kệ D2",
      lastRestocked: "2023-10-10",
      status: "active",
      image: "/placeholder.svg?height=100&width=100",
      description: "Bông tẩy trang cao cấp, mềm mịn với da",
    },
  ];
};

const generateStockMovements = (): StockMovement[] => {
  return [
    {
      id: "1",
      productId: "1",
      date: "2023-11-15T09:30:00",
      type: "in",
      quantity: 20,
      reason: "Nhập hàng từ nhà cung cấp",
      performedBy: "Nguyễn Văn A",
      reference: "PO-2023-11-001",
    },
    {
      id: "2",
      productId: "2",
      date: "2023-11-15T09:30:00",
      type: "in",
      quantity: 15,
      reason: "Nhập hàng từ nhà cung cấp",
      performedBy: "Nguyễn Văn A",
      reference: "PO-2023-11-001",
    },
    {
      id: "3",
      productId: "3",
      date: "2023-10-20T14:15:00",
      type: "in",
      quantity: 30,
      reason: "Nhập hàng từ nhà cung cấp",
      performedBy: "Nguyễn Văn A",
      reference: "PO-2023-10-002",
    },
    {
      id: "4",
      productId: "1",
      date: "2023-11-18T11:45:00",
      type: "out",
      quantity: 2,
      reason: "Sử dụng cho khách hàng",
      performedBy: "Trần Thị B",
    },
    {
      id: "5",
      productId: "3",
      date: "2023-11-19T16:20:00",
      type: "out",
      quantity: 5,
      reason: "Sử dụng cho khách hàng",
      performedBy: "Trần Thị B",
    },
    {
      id: "6",
      productId: "5",
      date: "2023-11-10T10:00:00",
      type: "in",
      quantity: 50,
      reason: "Nhập hàng từ nhà cung cấp",
      performedBy: "Nguyễn Văn A",
      reference: "PO-2023-11-003",
    },
    {
      id: "7",
      productId: "5",
      date: "2023-11-20T13:30:00",
      type: "out",
      quantity: 15,
      reason: "Sử dụng cho khách hàng",
      performedBy: "Lê Thị C",
    },
    {
      id: "8",
      productId: "8",
      date: "2023-11-21T09:15:00",
      type: "adjustment",
      quantity: -3,
      reason: "Hàng bị hỏng",
      performedBy: "Nguyễn Văn A",
    },
    {
      id: "9",
      productId: "12",
      date: "2023-11-22T15:45:00",
      type: "adjustment",
      quantity: -5,
      reason: "Kiểm kê thiếu hàng",
      performedBy: "Nguyễn Văn A",
    },
    {
      id: "10",
      productId: "4",
      date: "2023-11-05T11:30:00",
      type: "in",
      quantity: 10,
      reason: "Nhập hàng từ nhà cung cấp",
      performedBy: "Nguyễn Văn A",
      reference: "PO-2023-11-004",
    },
  ];
};

export default function ProductManagement() {
  // State
  const [products, setProducts] = useState<Product[]>(generateSampleProducts());
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(
    generateStockMovements()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Derived state
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      products.map((product) => product.category)
    );
    return Array.from(uniqueCategories);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search term filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      // Stock level filter
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" &&
          product.currentStock <= product.minStockLevel) ||
        (stockFilter === "normal" &&
          product.currentStock > product.minStockLevel &&
          product.currentStock < product.maxStockLevel) ||
        (stockFilter === "high" &&
          product.currentStock >= product.maxStockLevel);

      // Tab filter
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "low-stock" &&
          product.currentStock <= product.minStockLevel) ||
        (activeTab === "expiring-soon" &&
          product.expiryDate &&
          new Date(product.expiryDate) <=
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesCategory && matchesStock && matchesTab;
    });
  }, [products, searchTerm, categoryFilter, stockFilter, activeTab]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let aValue: any = a[sortColumn as keyof Product];
      let bValue: any = b[sortColumn as keyof Product];

      if (
        sortColumn === "name" ||
        sortColumn === "brand" ||
        sortColumn === "category"
      ) {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredProducts, sortColumn, sortDirection]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Get product stock movements
  const getProductStockMovements = (productId: string) => {
    return stockMovements.filter(
      (movement) => movement.productId === productId
    );
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Format date time
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Get stock status
  const getStockStatus = (product: Product) => {
    if (product.currentStock <= product.minStockLevel) {
      return "low";
    } else if (product.currentStock >= product.maxStockLevel) {
      return "high";
    } else {
      return "normal";
    }
  };

  // Get stock status badge
  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case "low":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Sắp hết
          </Badge>
        );
      case "normal":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            Bình thường
          </Badge>
        );
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <Layers className="h-3 w-3" />
            Dư thừa
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get movement type badge
  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case "in":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Nhập kho
          </Badge>
        );
      case "out":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Xuất kho
          </Badge>
        );
      case "adjustment":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Điều chỉnh
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Calculate stock level percentage
  const calculateStockPercentage = (product: Product) => {
    const range = product.maxStockLevel - product.minStockLevel;
    if (range <= 0) return 0;

    const currentLevel = product.currentStock - product.minStockLevel;
    const percentage = (currentLevel / range) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  // Get stock level color
  const getStockLevelColor = (percentage: number) => {
    if (percentage <= 25) {
      return "bg-red-500";
    } else if (percentage <= 75) {
      return "bg-amber-500";
    } else {
      return "bg-green-500";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Package className="mr-2 h-6 w-6 text-primary" />
            Quản Lý Kho Sản Phẩm
          </h1>
          <p className="text-muted-foreground">
            Quản lý tồn kho, theo dõi sản phẩm và lịch sử xuất nhập kho
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin chi tiết về sản phẩm mới.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input id="name" placeholder="Nhập tên sản phẩm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">Mã SKU</Label>
                    <Input id="sku" placeholder="Nhập mã SKU" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">+ Thêm danh mục mới</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Thương hiệu</Label>
                    <Input id="brand" placeholder="Nhập thương hiệu" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá bán</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Nhập giá bán"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Giá nhập</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      placeholder="Nhập giá nhập"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentStock">Số lượng hiện tại</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      placeholder="Nhập số lượng"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStockLevel">Mức tồn kho tối thiểu</Label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      placeholder="Nhập mức tối thiểu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxStockLevel">Mức tồn kho tối đa</Label>
                    <Input
                      id="maxStockLevel"
                      type="number"
                      placeholder="Nhập mức tối đa"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit">Đơn vị</Label>
                    <Input
                      id="unit"
                      placeholder="Nhập đơn vị (chai, hộp, cái...)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Vị trí lưu trữ</Label>
                    <Input id="location" placeholder="Nhập vị trí lưu trữ" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Ngày hết hạn (nếu có)</Label>
                    <Input id="expiryDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select defaultValue="active">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Đang kinh doanh</SelectItem>
                        <SelectItem value="discontinued">
                          Ngừng kinh doanh
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả sản phẩm"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Hủy</Button>
                </DialogClose>
                <Button type="submit">Lưu sản phẩm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Xuất báo cáo
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Xuất PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart4 className="mr-2 h-4 w-4" />
                Báo cáo phân tích
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            Lịch sử xuất nhập
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng sản phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {categories.length} danh mục sản phẩm
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sản phẩm sắp hết
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {products.filter((p) => p.currentStock <= p.minStockLevel).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cần đặt hàng bổ sung
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sản phẩm sắp hết hạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {
                products.filter(
                  (p) =>
                    p.expiryDate &&
                    new Date(p.expiryDate) <=
                      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Trong vòng 90 ngày tới
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng giá trị tồn kho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                products.reduce(
                  (sum, product) =>
                    sum + product.costPrice * product.currentStock,
                  0
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tính theo giá nhập
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tất cả sản phẩm</TabsTrigger>
          <TabsTrigger value="low-stock" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Sắp hết hàng
          </TabsTrigger>
          <TabsTrigger
            value="expiring-soon"
            className="flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            Sắp hết hạn
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, mã SKU, thương hiệu..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tình trạng tồn kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tình trạng</SelectItem>
              <SelectItem value="low">Sắp hết hàng</SelectItem>
              <SelectItem value="normal">Bình thường</SelectItem>
              <SelectItem value="high">Dư thừa</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Tên sản phẩm
                  {sortColumn === "name" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("sku")}
              >
                <div className="flex items-center">
                  SKU
                  {sortColumn === "sku" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Danh mục
                  {sortColumn === "category" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("currentStock")}
              >
                <div className="flex items-center">
                  Tồn kho
                  {sortColumn === "currentStock" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center">
                  Giá bán
                  {sortColumn === "price" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={
                        product.image || "/placeholder.svg?height=40&width=40"
                      }
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.brand}
                    </div>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {product.currentStock} {product.unit}
                        </span>
                        {getStockStatusBadge(getStockStatus(product))}
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStockLevelColor(
                            calculateStockPercentage(product)
                          )}`}
                          style={{
                            width: `${calculateStockPercentage(product)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Min: {product.minStockLevel}</span>
                        <span>Max: {product.maxStockLevel}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.status === "active" ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Đang kinh doanh
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-700 border-gray-200"
                      >
                        Ngừng kinh doanh
                      </Badge>
                    )}
                    {product.expiryDate && (
                      <div className="text-xs text-muted-foreground mt-1">
                        HSD: {formatDate(product.expiryDate)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Đặt hàng bổ sung
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownUp className="mr-2 h-4 w-4" />
                          Xuất/Nhập kho
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Không tìm thấy sản phẩm nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, sortedProducts.length)} trong
            số {sortedProducts.length} sản phẩm
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <Dialog
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        >
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>Chi tiết sản phẩm</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết và lịch sử xuất nhập kho của sản phẩm.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Thông tin sản phẩm</TabsTrigger>
                <TabsTrigger value="stock-history">
                  Lịch sử xuất nhập
                </TabsTrigger>
                <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 py-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img
                      src={
                        selectedProduct.image ||
                        "/placeholder.svg?height=200&width=200"
                      }
                      alt={selectedProduct.name}
                      className="w-full h-auto rounded-lg border"
                    />
                  </div>
                  <div className="md:w-2/3 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {selectedProduct.brand}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Mã SKU</p>
                        <p>{selectedProduct.sku}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Danh mục
                        </p>
                        <p>{selectedProduct.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Giá bán</p>
                        <p className="font-medium">
                          {formatCurrency(selectedProduct.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Giá nhập
                        </p>
                        <p>{formatCurrency(selectedProduct.costPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Vị trí lưu trữ
                        </p>
                        <p>{selectedProduct.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Lần nhập cuối
                        </p>
                        <p>{formatDate(selectedProduct.lastRestocked)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Hạn sử dụng
                        </p>
                        <p>
                          {selectedProduct.expiryDate
                            ? formatDate(selectedProduct.expiryDate)
                            : "Không có"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Trạng thái
                        </p>
                        <p>
                          {selectedProduct.status === "active"
                            ? "Đang kinh doanh"
                            : "Ngừng kinh doanh"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Mô tả</p>
                      <p>{selectedProduct.description || "Không có mô tả"}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Tình trạng tồn kho
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">
                          {selectedProduct.currentStock} {selectedProduct.unit}
                        </span>
                        {getStockStatusBadge(getStockStatus(selectedProduct))}
                      </div>
                      <Progress
                        value={calculateStockPercentage(selectedProduct)}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Tối thiểu: {selectedProduct.minStockLevel}</span>
                        <span>Tối đa: {selectedProduct.maxStockLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stock-history">
                <div className="py-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ngày</TableHead>
                          <TableHead>Loại</TableHead>
                          <TableHead>Số lượng</TableHead>
                          <TableHead>Lý do</TableHead>
                          <TableHead>Người thực hiện</TableHead>
                          <TableHead>Tham chiếu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getProductStockMovements(selectedProduct.id).length >
                        0 ? (
                          getProductStockMovements(selectedProduct.id).map(
                            (movement) => (
                              <TableRow key={movement.id}>
                                <TableCell>
                                  {formatDateTime(movement.date)}
                                </TableCell>
                                <TableCell>
                                  {getMovementTypeBadge(movement.type)}
                                </TableCell>
                                <TableCell className="font-medium">
                                  <span
                                    className={
                                      movement.type === "in"
                                        ? "text-green-600"
                                        : movement.type === "out"
                                        ? "text-blue-600"
                                        : movement.quantity > 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {movement.type === "in" ||
                                    movement.type === "adjustment"
                                      ? "+"
                                      : "-"}
                                    {Math.abs(movement.quantity)}{" "}
                                    {selectedProduct.unit}
                                  </span>
                                </TableCell>
                                <TableCell>{movement.reason}</TableCell>
                                <TableCell>{movement.performedBy}</TableCell>
                                <TableCell>
                                  {movement.reference || "-"}
                                </TableCell>
                              </TableRow>
                            )
                          )
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              Không có lịch sử xuất nhập kho.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="edit">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Tên sản phẩm</Label>
                      <Input
                        id="edit-name"
                        defaultValue={selectedProduct.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-sku">Mã SKU</Label>
                      <Input id="edit-sku" defaultValue={selectedProduct.sku} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Danh mục</Label>
                      <Select defaultValue={selectedProduct.category}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="new">
                            + Thêm danh mục mới
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-brand">Thương hiệu</Label>
                      <Input
                        id="edit-brand"
                        defaultValue={selectedProduct.brand}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">Giá bán</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        defaultValue={selectedProduct.price}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-costPrice">Giá nhập</Label>
                      <Input
                        id="edit-costPrice"
                        type="number"
                        defaultValue={selectedProduct.costPrice}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-currentStock">
                        Số lượng hiện tại
                      </Label>
                      <Input
                        id="edit-currentStock"
                        type="number"
                        defaultValue={selectedProduct.currentStock}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-minStockLevel">
                        Mức tồn kho tối thiểu
                      </Label>
                      <Input
                        id="edit-minStockLevel"
                        type="number"
                        defaultValue={selectedProduct.minStockLevel}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-maxStockLevel">
                        Mức tồn kho tối đa
                      </Label>
                      <Input
                        id="edit-maxStockLevel"
                        type="number"
                        defaultValue={selectedProduct.maxStockLevel}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-unit">Đơn vị</Label>
                      <Input
                        id="edit-unit"
                        defaultValue={selectedProduct.unit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-location">Vị trí lưu trữ</Label>
                      <Input
                        id="edit-location"
                        defaultValue={selectedProduct.location}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-expiryDate">
                        Ngày hết hạn (nếu có)
                      </Label>
                      <Input
                        id="edit-expiryDate"
                        type="date"
                        defaultValue={selectedProduct.expiryDate}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Trạng thái</Label>
                      <Select defaultValue={selectedProduct.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">
                            Đang kinh doanh
                          </SelectItem>
                          <SelectItem value="discontinued">
                            Ngừng kinh doanh
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Mô tả</Label>
                    <Textarea
                      id="edit-description"
                      defaultValue={selectedProduct.description}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">Lưu thay đổi</Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
