"use client";

import { useState, useMemo } from "react";
import {
  format,
  subDays,
  subMonths,
  subYears,
  startOfDay,
  startOfMonth,
  startOfYear,
  endOfDay,
  endOfMonth,
  endOfYear,
  addDays,
  addMonths,
  addYears,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarIcon,
  Download,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface RevenueData {
  date: Date;
  totalRevenue: number;
  serviceRevenue: number;
  productRevenue: number;
  transactionCount: number;
  customerCount: number;
  averageTicket: number;
  services: {
    [key: string]: number;
  };
  products: {
    [key: string]: number;
  };
  paymentMethods: {
    [key: string]: number;
  };
}

interface ServiceCategory {
  id: string;
  name: string;
  color: string;
}

interface ProductCategory {
  id: string;
  name: string;
  color: string;
}

// Sample data generator
const generateSampleData = (): RevenueData[] => {
  const today = new Date();
  const data: RevenueData[] = [];

  // Service categories
  const serviceCategories = [
    { id: "grooming", name: "Grooming", color: "#4f46e5" },
    { id: "spa", name: "Spa Treatments", color: "#0ea5e9" },
    { id: "medical", name: "Medical Services", color: "#10b981" },
    { id: "boarding", name: "Boarding", color: "#f59e0b" },
    { id: "training", name: "Training", color: "#8b5cf6" },
  ];

  // Product categories
  const productCategories = [
    { id: "food", name: "Pet Food", color: "#ef4444" },
    { id: "toys", name: "Toys", color: "#f97316" },
    { id: "accessories", name: "Accessories", color: "#ec4899" },
    { id: "medicine", name: "Medicine", color: "#06b6d4" },
  ];

  // Payment methods
  const paymentMethods = [
    "Credit Card",
    "Cash",
    "Mobile Payment",
    "Bank Transfer",
  ];

  // Generate 2 years of daily data
  for (let i = 730; i >= 0; i--) {
    const currentDate = subDays(today, i);
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Base values with some randomness
    // Weekends have higher revenue
    const baseRevenue = isWeekend ? 2200 : 1500;
    const randomFactor = 0.3; // 30% random variation

    // Add seasonal variations
    const month = currentDate.getMonth(); // 0-11
    let seasonalFactor = 1.0;

    // Summer months (June-August) have higher revenue
    if (month >= 5 && month <= 7) {
      seasonalFactor = 1.3;
    }
    // Winter holidays (December) have higher revenue
    else if (month === 11) {
      seasonalFactor = 1.5;
    }
    // Spring (March-May) moderate increase
    else if (month >= 2 && month <= 4) {
      seasonalFactor = 1.2;
    }
    // Fall (September-November) slight increase
    else if (month >= 8 && month <= 10) {
      seasonalFactor = 1.1;
    }
    // January-February lower revenue
    else {
      seasonalFactor = 0.9;
    }

    // Add yearly growth trend (10% year-over-year growth)
    const yearsPassed = i / 365;
    const growthFactor = Math.pow(1.1, 2 - yearsPassed);

    // Calculate total revenue with all factors
    const totalRevenue = Math.round(
      baseRevenue *
        (1 + (Math.random() * 2 - 1) * randomFactor) *
        seasonalFactor *
        growthFactor
    );

    // Split between service and product revenue (60-40 split on average)
    const serviceRevenuePercent = 0.6 + (Math.random() * 0.2 - 0.1); // 50-70%
    const serviceRevenue = Math.round(totalRevenue * serviceRevenuePercent);
    const productRevenue = totalRevenue - serviceRevenue;

    // Transaction and customer counts
    const avgTicketSize = 50 + Math.random() * 30; // $50-$80 average ticket
    const transactionCount = Math.round(totalRevenue / avgTicketSize);
    const customerCount = Math.round(
      transactionCount * (0.8 + Math.random() * 0.3)
    ); // Some customers make multiple purchases

    // Distribute service revenue across categories
    const services: { [key: string]: number } = {};
    let remainingServiceRevenue = serviceRevenue;

    serviceCategories.forEach((category, index) => {
      if (index === serviceCategories.length - 1) {
        // Last category gets the remainder
        services[category.id] = remainingServiceRevenue;
      } else {
        // Distribute with some randomness
        const share = remainingServiceRevenue * (0.2 + Math.random() * 0.2);
        services[category.id] = Math.round(share);
        remainingServiceRevenue -= services[category.id];
      }
    });

    // Distribute product revenue across categories
    const products: { [key: string]: number } = {};
    let remainingProductRevenue = productRevenue;

    productCategories.forEach((category, index) => {
      if (index === productCategories.length - 1) {
        // Last category gets the remainder
        products[category.id] = remainingProductRevenue;
      } else {
        // Distribute with some randomness
        const share = remainingProductRevenue * (0.2 + Math.random() * 0.2);
        products[category.id] = Math.round(share);
        remainingProductRevenue -= products[category.id];
      }
    });

    // Distribute total revenue across payment methods
    const paymentMethodsData: { [key: string]: number } = {};
    let remainingTotalRevenue = totalRevenue;

    paymentMethods.forEach((method, index) => {
      if (index === paymentMethods.length - 1) {
        // Last method gets the remainder
        paymentMethodsData[method] = remainingTotalRevenue;
      } else {
        // Credit card is most common (40-60%), then others
        let share;
        if (method === "Credit Card") {
          share = remainingTotalRevenue * (0.4 + Math.random() * 0.2);
        } else {
          share = remainingTotalRevenue * (0.1 + Math.random() * 0.2);
        }
        paymentMethodsData[method] = Math.round(share);
        remainingTotalRevenue -= paymentMethodsData[method];
      }
    });

    data.push({
      date: currentDate,
      totalRevenue,
      serviceRevenue,
      productRevenue,
      transactionCount,
      customerCount,
      averageTicket: Math.round(totalRevenue / transactionCount),
      services,
      products,
      paymentMethods: paymentMethodsData,
    });
  }

  return data;
};

// Main component
export default function RevenueReport() {
  // State
  const [viewMode, setViewMode] = useState<"day" | "month" | "year">("month");
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [comparisonDateRange, setComparisonDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: startOfMonth(subMonths(new Date(), 1)),
    end: endOfMonth(subMonths(new Date(), 1)),
  });
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Sample data
  const allRevenueData = useMemo(() => generateSampleData(), []);
  const serviceCategories = useMemo(
    () => [
      { id: "grooming", name: "Grooming", color: "#4f46e5" },
      { id: "spa", name: "Spa Treatments", color: "#0ea5e9" },
      { id: "medical", name: "Medical Services", color: "#10b981" },
      { id: "boarding", name: "Boarding", color: "#f59e0b" },
      { id: "training", name: "Training", color: "#8b5cf6" },
    ],
    []
  );

  const productCategories = useMemo(
    () => [
      { id: "food", name: "Pet Food", color: "#ef4444" },
      { id: "toys", name: "Toys", color: "#f97316" },
      { id: "accessories", name: "Accessories", color: "#ec4899" },
      { id: "medicine", name: "Medicine", color: "#06b6d4" },
    ],
    []
  );

  // Helper functions for date navigation
  const navigatePrevious = () => {
    if (viewMode === "day") {
      setDateRange({
        start: subDays(dateRange.start, 1),
        end: subDays(dateRange.end, 1),
      });
    } else if (viewMode === "month") {
      setDateRange({
        start: startOfMonth(subMonths(dateRange.start, 1)),
        end: endOfMonth(subMonths(dateRange.start, 1)),
      });
    } else {
      setDateRange({
        start: startOfYear(subYears(dateRange.start, 1)),
        end: endOfYear(subYears(dateRange.start, 1)),
      });
    }
  };

  const navigateNext = () => {
    if (viewMode === "day") {
      setDateRange({
        start: addDays(dateRange.start, 1),
        end: addDays(dateRange.end, 1),
      });
    } else if (viewMode === "month") {
      setDateRange({
        start: startOfMonth(addMonths(dateRange.start, 1)),
        end: endOfMonth(addMonths(dateRange.start, 1)),
      });
    } else {
      setDateRange({
        start: startOfYear(addYears(dateRange.start, 1)),
        end: endOfYear(addYears(dateRange.start, 1)),
      });
    }
  };

  const navigateToday = () => {
    const today = new Date();
    if (viewMode === "day") {
      setDateRange({
        start: startOfDay(today),
        end: endOfDay(today),
      });
    } else if (viewMode === "month") {
      setDateRange({
        start: startOfMonth(today),
        end: endOfMonth(today),
      });
    } else {
      setDateRange({
        start: startOfYear(today),
        end: endOfYear(today),
      });
    }
  };

  // Change view mode (day/month/year)
  const handleViewModeChange = (mode: string) => {
    const currentDate = new Date();
    setViewMode(mode);

    if (mode === "day") {
      setDateRange({
        start: startOfDay(currentDate),
        end: endOfDay(currentDate),
      });
    } else if (mode === "month") {
      setDateRange({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      });
    } else {
      setDateRange({
        start: startOfYear(currentDate),
        end: endOfYear(currentDate),
      });
    }
  };

  // Filter data based on current date range and filters
  const filteredData = useMemo(() => {
    return allRevenueData.filter((item) => {
      const dateInRange =
        item.date >= dateRange.start && item.date <= dateRange.end;

      const matchesServiceFilter =
        serviceFilter === "all" ||
        (item.services[serviceFilter] && item.services[serviceFilter] > 0);

      const matchesPaymentFilter =
        paymentMethodFilter === "all" ||
        (item.paymentMethods[paymentMethodFilter] &&
          item.paymentMethods[paymentMethodFilter] > 0);

      const matchesSearch =
        searchTerm === "" ||
        format(item.date, "dd/MM/yyyy").includes(searchTerm) ||
        item.totalRevenue.toString().includes(searchTerm);

      return (
        dateInRange &&
        matchesServiceFilter &&
        matchesPaymentFilter &&
        matchesSearch
      );
    });
  }, [
    allRevenueData,
    dateRange,
    serviceFilter,
    paymentMethodFilter,
    searchTerm,
  ]);

  // Comparison data if comparison mode is enabled
  const comparisonData = useMemo(() => {
    if (!comparisonMode) return [];

    return allRevenueData.filter(
      (item) =>
        item.date >= comparisonDateRange.start &&
        item.date <= comparisonDateRange.end
    );
  }, [allRevenueData, comparisonMode, comparisonDateRange]);

  // Aggregate data based on view mode
  const aggregatedData = useMemo(() => {
    if (filteredData.length === 0) return [];

    if (viewMode === "day") {
      // For day view, we just return the filtered data
      return filteredData;
    } else if (viewMode === "month") {
      // For month view, aggregate by month
      const monthlyData: Map<string, RevenueData> = new Map();

      filteredData.forEach((item) => {
        const monthKey = format(item.date, "yyyy-MM");

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            date: startOfMonth(item.date),
            totalRevenue: 0,
            serviceRevenue: 0,
            productRevenue: 0,
            transactionCount: 0,
            customerCount: 0,
            averageTicket: 0,
            services: {},
            products: {},
            paymentMethods: {},
          });

          // Initialize service categories
          serviceCategories.forEach((category) => {
            monthlyData.get(monthKey)!.services[category.id] = 0;
          });

          // Initialize product categories
          productCategories.forEach((category) => {
            monthlyData.get(monthKey)!.products[category.id] = 0;
          });

          // Initialize payment methods
          ["Credit Card", "Cash", "Mobile Payment", "Bank Transfer"].forEach(
            (method) => {
              monthlyData.get(monthKey)!.paymentMethods[method] = 0;
            }
          );
        }

        const monthData = monthlyData.get(monthKey)!;
        monthData.totalRevenue += item.totalRevenue;
        monthData.serviceRevenue += item.serviceRevenue;
        monthData.productRevenue += item.productRevenue;
        monthData.transactionCount += item.transactionCount;
        monthData.customerCount += item.customerCount;

        // Aggregate service categories
        Object.entries(item.services).forEach(([category, amount]) => {
          if (!monthData.services[category]) {
            monthData.services[category] = 0;
          }
          monthData.services[category] += amount;
        });

        // Aggregate product categories
        Object.entries(item.products).forEach(([category, amount]) => {
          if (!monthData.products[category]) {
            monthData.products[category] = 0;
          }
          monthData.products[category] += amount;
        });

        // Aggregate payment methods
        Object.entries(item.paymentMethods).forEach(([method, amount]) => {
          if (!monthData.paymentMethods[method]) {
            monthData.paymentMethods[method] = 0;
          }
          monthData.paymentMethods[method] += amount;
        });
      });

      // Calculate average ticket for each month
      monthlyData.forEach((data) => {
        data.averageTicket = Math.round(
          data.totalRevenue / data.transactionCount
        );
      });

      return Array.from(monthlyData.values());
    } else {
      // For year view, aggregate by year
      const yearlyData: Map<string, RevenueData> = new Map();

      filteredData.forEach((item) => {
        const yearKey = format(item.date, "yyyy");

        if (!yearlyData.has(yearKey)) {
          yearlyData.set(yearKey, {
            date: startOfYear(item.date),
            totalRevenue: 0,
            serviceRevenue: 0,
            productRevenue: 0,
            transactionCount: 0,
            customerCount: 0,
            averageTicket: 0,
            services: {},
            products: {},
            paymentMethods: {},
          });

          // Initialize service categories
          serviceCategories.forEach((category) => {
            yearlyData.get(yearKey)!.services[category.id] = 0;
          });

          // Initialize product categories
          productCategories.forEach((category) => {
            yearlyData.get(yearKey)!.products[category.id] = 0;
          });

          // Initialize payment methods
          ["Credit Card", "Cash", "Mobile Payment", "Bank Transfer"].forEach(
            (method) => {
              yearlyData.get(yearKey)!.paymentMethods[method] = 0;
            }
          );
        }

        const yearData = yearlyData.get(yearKey)!;
        yearData.totalRevenue += item.totalRevenue;
        yearData.serviceRevenue += item.serviceRevenue;
        yearData.productRevenue += item.productRevenue;
        yearData.transactionCount += item.transactionCount;
        yearData.customerCount += item.customerCount;

        // Aggregate service categories
        Object.entries(item.services).forEach(([category, amount]) => {
          if (!yearData.services[category]) {
            yearData.services[category] = 0;
          }
          yearData.services[category] += amount;
        });

        // Aggregate product categories
        Object.entries(item.products).forEach(([category, amount]) => {
          if (!yearData.products[category]) {
            yearData.products[category] = 0;
          }
          yearData.products[category] += amount;
        });

        // Aggregate payment methods
        Object.entries(item.paymentMethods).forEach(([method, amount]) => {
          if (!yearData.paymentMethods[method]) {
            yearData.paymentMethods[method] = 0;
          }
          yearData.paymentMethods[method] += amount;
        });
      });

      // Calculate average ticket for each year
      yearlyData.forEach((data) => {
        data.averageTicket = Math.round(
          data.totalRevenue / data.transactionCount
        );
      });

      return Array.from(yearlyData.values());
    }
  }, [filteredData, viewMode, serviceCategories, productCategories]);

  // Aggregated comparison data
  const aggregatedComparisonData = useMemo(() => {
    if (!comparisonMode || comparisonData.length === 0) return [];

    if (viewMode === "day") {
      return comparisonData;
    } else if (viewMode === "month") {
      // For month view, aggregate by month
      const monthlyData: Map<string, RevenueData> = new Map();

      comparisonData.forEach((item) => {
        const monthKey = format(item.date, "yyyy-MM");

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            date: startOfMonth(item.date),
            totalRevenue: 0,
            serviceRevenue: 0,
            productRevenue: 0,
            transactionCount: 0,
            customerCount: 0,
            averageTicket: 0,
            services: {},
            products: {},
            paymentMethods: {},
          });

          // Initialize service categories
          serviceCategories.forEach((category) => {
            monthlyData.get(monthKey)!.services[category.id] = 0;
          });

          // Initialize product categories
          productCategories.forEach((category) => {
            monthlyData.get(monthKey)!.products[category.id] = 0;
          });

          // Initialize payment methods
          ["Credit Card", "Cash", "Mobile Payment", "Bank Transfer"].forEach(
            (method) => {
              monthlyData.get(monthKey)!.paymentMethods[method] = 0;
            }
          );
        }

        const monthData = monthlyData.get(monthKey)!;
        monthData.totalRevenue += item.totalRevenue;
        monthData.serviceRevenue += item.serviceRevenue;
        monthData.productRevenue += item.productRevenue;
        monthData.transactionCount += item.transactionCount;
        monthData.customerCount += item.customerCount;

        // Aggregate service categories
        Object.entries(item.services).forEach(([category, amount]) => {
          if (!monthData.services[category]) {
            monthData.services[category] = 0;
          }
          monthData.services[category] += amount;
        });

        // Aggregate product categories
        Object.entries(item.products).forEach(([category, amount]) => {
          if (!monthData.products[category]) {
            monthData.products[category] = 0;
          }
          monthData.products[category] += amount;
        });

        // Aggregate payment methods
        Object.entries(item.paymentMethods).forEach(([method, amount]) => {
          if (!monthData.paymentMethods[method]) {
            monthData.paymentMethods[method] = 0;
          }
          monthData.paymentMethods[method] += amount;
        });
      });

      // Calculate average ticket for each month
      monthlyData.forEach((data) => {
        data.averageTicket = Math.round(
          data.totalRevenue / data.transactionCount
        );
      });

      return Array.from(monthlyData.values());
    } else {
      // For year view, aggregate by year
      const yearlyData: Map<string, RevenueData> = new Map();

      comparisonData.forEach((item) => {
        const yearKey = format(item.date, "yyyy");

        if (!yearlyData.has(yearKey)) {
          yearlyData.set(yearKey, {
            date: startOfYear(item.date),
            totalRevenue: 0,
            serviceRevenue: 0,
            productRevenue: 0,
            transactionCount: 0,
            customerCount: 0,
            averageTicket: 0,
            services: {},
            products: {},
            paymentMethods: {},
          });

          // Initialize service categories
          serviceCategories.forEach((category) => {
            yearlyData.get(yearKey)!.services[category.id] = 0;
          });

          // Initialize product categories
          productCategories.forEach((category) => {
            yearlyData.get(yearKey)!.products[category.id] = 0;
          });

          // Initialize payment methods
          ["Credit Card", "Cash", "Mobile Payment", "Bank Transfer"].forEach(
            (method) => {
              yearlyData.get(yearKey)!.paymentMethods[method] = 0;
            }
          );
        }

        const yearData = yearlyData.get(yearKey)!;
        yearData.totalRevenue += item.totalRevenue;
        yearData.serviceRevenue += item.serviceRevenue;
        yearData.productRevenue += item.productRevenue;
        yearData.transactionCount += item.transactionCount;
        yearData.customerCount += item.customerCount;

        // Aggregate service categories
        Object.entries(item.services).forEach(([category, amount]) => {
          if (!yearData.services[category]) {
            yearData.services[category] = 0;
          }
          yearData.services[category] += amount;
        });

        // Aggregate product categories
        Object.entries(item.products).forEach(([category, amount]) => {
          if (!yearData.products[category]) {
            yearData.products[category] = 0;
          }
          yearData.products[category] += amount;
        });

        // Aggregate payment methods
        Object.entries(item.paymentMethods).forEach(([method, amount]) => {
          if (!yearData.paymentMethods[method]) {
            yearData.paymentMethods[method] = 0;
          }
          yearData.paymentMethods[method] += amount;
        });
      });

      // Calculate average ticket for each year
      yearlyData.forEach((data) => {
        data.averageTicket = Math.round(
          data.totalRevenue / data.transactionCount
        );
      });

      return Array.from(yearlyData.values());
    }
  }, [
    comparisonData,
    comparisonMode,
    viewMode,
    serviceCategories,
    productCategories,
  ]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (aggregatedData.length === 0) {
      return {
        totalRevenue: 0,
        serviceRevenue: 0,
        productRevenue: 0,
        transactionCount: 0,
        customerCount: 0,
        averageTicket: 0,
      };
    }

    const totalRevenue = aggregatedData.reduce(
      (sum, item) => sum + item.totalRevenue,
      0
    );
    const serviceRevenue = aggregatedData.reduce(
      (sum, item) => sum + item.serviceRevenue,
      0
    );
    const productRevenue = aggregatedData.reduce(
      (sum, item) => sum + item.productRevenue,
      0
    );
    const transactionCount = aggregatedData.reduce(
      (sum, item) => sum + item.transactionCount,
      0
    );
    const customerCount = aggregatedData.reduce(
      (sum, item) => sum + item.customerCount,
      0
    );
    const averageTicket =
      transactionCount > 0 ? Math.round(totalRevenue / transactionCount) : 0;

    return {
      totalRevenue,
      serviceRevenue,
      productRevenue,
      transactionCount,
      customerCount,
      averageTicket,
    };
  }, [aggregatedData]);

  // Calculate comparison summary metrics
  const comparisonSummaryMetrics = useMemo(() => {
    if (!comparisonMode || aggregatedComparisonData.length === 0) {
      return {
        totalRevenue: 0,
        serviceRevenue: 0,
        productRevenue: 0,
        transactionCount: 0,
        customerCount: 0,
        averageTicket: 0,
      };
    }

    const totalRevenue = aggregatedComparisonData.reduce(
      (sum, item) => sum + item.totalRevenue,
      0
    );
    const serviceRevenue = aggregatedComparisonData.reduce(
      (sum, item) => sum + item.serviceRevenue,
      0
    );
    const productRevenue = aggregatedComparisonData.reduce(
      (sum, item) => sum + item.productRevenue,
      0
    );
    const transactionCount = aggregatedComparisonData.reduce(
      (sum, item) => sum + item.transactionCount,
      0
    );
    const customerCount = aggregatedComparisonData.reduce(
      (sum, item) => sum + item.customerCount,
      0
    );
    const averageTicket =
      transactionCount > 0 ? Math.round(totalRevenue / transactionCount) : 0;

    return {
      totalRevenue,
      serviceRevenue,
      productRevenue,
      transactionCount,
      customerCount,
      averageTicket,
    };
  }, [comparisonMode, aggregatedComparisonData]);

  // Calculate percentage changes for comparison
  const calculatePercentageChange = (
    current: number,
    previous: number
  ): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1000); // Multiply by 1000 to make the numbers more realistic for VND
  };

  // Format date based on view mode
  const formatDateForDisplay = (date: Date): string => {
    if (viewMode === "day") {
      return format(date, "dd/MM/yyyy", { locale: vi });
    } else if (viewMode === "month") {
      return format(date, "MM/yyyy", { locale: vi });
    } else {
      return format(date, "yyyy", { locale: vi });
    }
  };

  // Format percentage change with color and arrow
  const formatPercentageChange = (change: number): JSX.Element => {
    if (change > 0) {
      return (
        <span className="text-green-600 flex items-center">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          {change}%
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="text-red-600 flex items-center">
          <ArrowDownRight className="h-3 w-3 mr-1" />
          {Math.abs(change)}%
        </span>
      );
    } else {
      return <span className="text-gray-500">0%</span>;
    }
  };

  // Sort data for table display
  const sortedData = useMemo(() => {
    return [...aggregatedData].sort((a, b) => {
      let aValue, bValue;

      switch (sortColumn) {
        case "date":
          aValue = a.date.getTime();
          bValue = b.date.getTime();
          break;
        case "totalRevenue":
          aValue = a.totalRevenue;
          bValue = b.totalRevenue;
          break;
        case "serviceRevenue":
          aValue = a.serviceRevenue;
          bValue = b.serviceRevenue;
          break;
        case "productRevenue":
          aValue = a.productRevenue;
          bValue = b.productRevenue;
          break;
        case "transactionCount":
          aValue = a.transactionCount;
          bValue = b.transactionCount;
          break;
        case "customerCount":
          aValue = a.customerCount;
          bValue = b.customerCount;
          break;
        case "averageTicket":
          aValue = a.averageTicket;
          bValue = b.averageTicket;
          break;
        default:
          aValue = a.date.getTime();
          bValue = b.date.getTime();
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [aggregatedData, sortColumn, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // Get sort icon
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return null;
    }

    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    // In a real application, this would generate and download a CSV file
    alert("Exporting data to CSV...");
  };

  // Export to PDF
  const exportToPDF = () => {
    // In a real application, this would generate and download a PDF file
    alert("Exporting data to PDF...");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FileText className="mr-2 h-8 w-8 text-primary" />
          Báo Cáo Doanh Thu
        </h1>
        <p className="text-muted-foreground">
          Xem và phân tích doanh thu theo ngày, tháng, hoặc năm
        </p>
      </div>

      {/* Date range and controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Tabs
            value={viewMode}
            onValueChange={(value) =>
              handleViewModeChange(value as "day" | "month" | "year")
            }
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="day"
                onClick={() => handleViewModeChange("day")}
                className={
                  viewMode === "day" ? "bg-primary text-primary-foreground" : ""
                }
              >
                Ngày
              </TabsTrigger>
              <TabsTrigger
                value="month"
                onClick={() => handleViewModeChange("month")}
                className={
                  viewMode === "month"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                Tháng
              </TabsTrigger>
              <TabsTrigger
                value="year"
                onClick={() => handleViewModeChange("year")}
                className={
                  viewMode === "year"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                Năm
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[180px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {viewMode === "day"
                    ? format(dateRange.start, "dd/MM/yyyy", { locale: vi })
                    : viewMode === "month"
                    ? format(dateRange.start, "MM/yyyy", { locale: vi })
                    : format(dateRange.start, "yyyy", { locale: vi })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.start}
                  onSelect={(date) => {
                    if (date) {
                      if (viewMode === "day") {
                        setDateRange({
                          start: startOfDay(date),
                          end: endOfDay(date),
                        });
                      } else if (viewMode === "month") {
                        setDateRange({
                          start: startOfMonth(date),
                          end: endOfMonth(date),
                        });
                      } else {
                        setDateRange({
                          start: startOfYear(date),
                          end: endOfYear(date),
                        });
                      }
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={navigateToday}>
              Hôm nay
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Download className="h-4 w-4 mr-1" />
                Xuất báo cáo
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToCSV}>
                Xuất CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>
                Xuất PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={comparisonMode ? "default" : "outline"}
            onClick={() => setComparisonMode(!comparisonMode)}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            {comparisonMode ? "Tắt so sánh" : "So sánh"}
          </Button>
        </div>
      </div>

      {/* Comparison date range selector (if comparison mode is enabled) */}
      {comparisonMode && (
        <div className="mb-6 p-4 border rounded-lg bg-muted/30">
          <h3 className="font-medium mb-2">So sánh với khoảng thời gian:</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (viewMode === "day") {
                  setComparisonDateRange({
                    start: startOfDay(subDays(dateRange.start, 1)),
                    end: endOfDay(subDays(dateRange.end, 1)),
                  });
                } else if (viewMode === "month") {
                  setComparisonDateRange({
                    start: startOfMonth(subMonths(dateRange.start, 1)),
                    end: endOfMonth(subMonths(dateRange.end, 1)),
                  });
                } else {
                  setComparisonDateRange({
                    start: startOfYear(subYears(dateRange.start, 1)),
                    end: endOfYear(subYears(dateRange.end, 1)),
                  });
                }
              }}
            >
              {viewMode === "day"
                ? "Hôm qua"
                : viewMode === "month"
                ? "Tháng trước"
                : "Năm trước"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (viewMode === "day") {
                  setComparisonDateRange({
                    start: startOfDay(subDays(dateRange.start, 7)),
                    end: endOfDay(subDays(dateRange.end, 7)),
                  });
                } else if (viewMode === "month") {
                  setComparisonDateRange({
                    start: startOfMonth(subMonths(dateRange.start, 3)),
                    end: endOfMonth(subMonths(dateRange.end, 3)),
                  });
                } else {
                  setComparisonDateRange({
                    start: startOfYear(subYears(dateRange.start, 2)),
                    end: endOfYear(subYears(dateRange.end, 2)),
                  });
                }
              }}
            >
              {viewMode === "day"
                ? "1 tuần trước"
                : viewMode === "month"
                ? "3 tháng trước"
                : "2 năm trước"}
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {viewMode === "day"
                    ? format(comparisonDateRange.start, "dd/MM/yyyy", {
                        locale: vi,
                      })
                    : viewMode === "month"
                    ? format(comparisonDateRange.start, "MM/yyyy", {
                        locale: vi,
                      })
                    : format(comparisonDateRange.start, "yyyy", { locale: vi })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={comparisonDateRange.start}
                  onSelect={(date) => {
                    if (date) {
                      if (viewMode === "day") {
                        setComparisonDateRange({
                          start: startOfDay(date),
                          end: endOfDay(date),
                        });
                      } else if (viewMode === "month") {
                        setComparisonDateRange({
                          start: startOfMonth(date),
                          end: endOfMonth(date),
                        });
                      } else {
                        setComparisonDateRange({
                          start: startOfYear(date),
                          end: endOfYear(date),
                        });
                      }
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng Doanh Thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(summaryMetrics.totalRevenue)}
              </div>
              {comparisonMode && (
                <div className="text-sm">
                  {formatPercentageChange(
                    calculatePercentageChange(
                      summaryMetrics.totalRevenue,
                      comparisonSummaryMetrics.totalRevenue
                    )
                  )}
                </div>
              )}
            </div>
            {comparisonMode && (
              <p className="text-xs text-muted-foreground mt-1">
                So với: {formatCurrency(comparisonSummaryMetrics.totalRevenue)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Doanh Thu Dịch Vụ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(summaryMetrics.serviceRevenue)}
              </div>
              {comparisonMode && (
                <div className="text-sm">
                  {formatPercentageChange(
                    calculatePercentageChange(
                      summaryMetrics.serviceRevenue,
                      comparisonSummaryMetrics.serviceRevenue
                    )
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(
                (summaryMetrics.serviceRevenue / summaryMetrics.totalRevenue) *
                  100
              ) || 0}
              % tổng doanh thu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Doanh Thu Sản Phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(summaryMetrics.productRevenue)}
              </div>
              {comparisonMode && (
                <div className="text-sm">
                  {formatPercentageChange(
                    calculatePercentageChange(
                      summaryMetrics.productRevenue,
                      comparisonSummaryMetrics.productRevenue
                    )
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(
                (summaryMetrics.productRevenue / summaryMetrics.totalRevenue) *
                  100
              ) || 0}
              % tổng doanh thu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Số Giao Dịch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {summaryMetrics.transactionCount.toLocaleString("vi-VN")}
              </div>
              {comparisonMode && (
                <div className="text-sm">
                  {formatPercentageChange(
                    calculatePercentageChange(
                      summaryMetrics.transactionCount,
                      comparisonSummaryMetrics.transactionCount
                    )
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Số Khách Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {summaryMetrics.customerCount.toLocaleString("vi-VN")}
              </div>
              {comparisonMode && (
                <div className="text-sm">
                  {formatPercentageChange(
                    calculatePercentageChange(
                      summaryMetrics.customerCount,
                      comparisonSummaryMetrics.customerCount
                    )
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Giá Trị Trung Bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(summaryMetrics.averageTicket)}
              </div>
              {comparisonMode && (
                <div className="text-sm">
                  {formatPercentageChange(
                    calculatePercentageChange(
                      summaryMetrics.averageTicket,
                      comparisonSummaryMetrics.averageTicket
                    )
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Loại dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả dịch vụ</SelectItem>
              {serviceCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={paymentMethodFilter}
            onValueChange={setPaymentMethodFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Phương thức thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phương thức</SelectItem>
              <SelectItem value="Credit Card">Thẻ tín dụng</SelectItem>
              <SelectItem value="Cash">Tiền mặt</SelectItem>
              <SelectItem value="Mobile Payment">Thanh toán di động</SelectItem>
              <SelectItem value="Bank Transfer">Chuyển khoản</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Chi Tiết Doanh Thu</CardTitle>
          <CardDescription>
            {viewMode === "day"
              ? "Doanh thu theo ngày"
              : viewMode === "month"
              ? "Doanh thu theo tháng"
              : "Doanh thu theo năm"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center">
                      Thời gian
                      {getSortIcon("date")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("totalRevenue")}
                  >
                    <div className="flex items-center justify-end">
                      Tổng doanh thu
                      {getSortIcon("totalRevenue")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("serviceRevenue")}
                  >
                    <div className="flex items-center justify-end">
                      Doanh thu dịch vụ
                      {getSortIcon("serviceRevenue")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("productRevenue")}
                  >
                    <div className="flex items-center justify-end">
                      Doanh thu sản phẩm
                      {getSortIcon("productRevenue")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("transactionCount")}
                  >
                    <div className="flex items-center justify-end">
                      Số giao dịch
                      {getSortIcon("transactionCount")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("averageTicket")}
                  >
                    <div className="flex items-center justify-end">
                      Giá trị TB
                      {getSortIcon("averageTicket")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {formatDateForDisplay(item.date)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.serviceRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.productRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.transactionCount.toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.averageTicket)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
                {Math.min(currentPage * itemsPerPage, sortedData.length)} trong
                số {sortedData.length} bản ghi
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Trước
                </Button>
                <span className="text-sm text-muted-foreground">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Sau
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service and product breakdown */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Phân Tích Doanh Thu Dịch Vụ</CardTitle>
            <CardDescription>
              Phân bổ doanh thu theo loại dịch vụ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceCategories.map((category) => {
                const totalServiceRevenue = summaryMetrics.serviceRevenue;
                const categoryRevenue = aggregatedData.reduce(
                  (sum, item) => sum + (item.services[category.id] || 0),
                  0
                );
                const percentage =
                  totalServiceRevenue > 0
                    ? Math.round((categoryRevenue / totalServiceRevenue) * 100)
                    : 0;

                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{formatCurrency(categoryRevenue)}</span>
                        <Badge variant="outline">{percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân Tích Doanh Thu Sản Phẩm</CardTitle>
            <CardDescription>
              Phân bổ doanh thu theo loại sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productCategories.map((category) => {
                const totalProductRevenue = summaryMetrics.productRevenue;
                const categoryRevenue = aggregatedData.reduce(
                  (sum, item) => sum + (item.products[category.id] || 0),
                  0
                );
                const percentage =
                  totalProductRevenue > 0
                    ? Math.round((categoryRevenue / totalProductRevenue) * 100)
                    : 0;

                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{formatCurrency(categoryRevenue)}</span>
                        <Badge variant="outline">{percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment methods */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Phương Thức Thanh Toán</CardTitle>
          <CardDescription>
            Phân bổ doanh thu theo phương thức thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Credit Card", "Cash", "Mobile Payment", "Bank Transfer"].map(
              (method, index) => {
                const totalRevenue = summaryMetrics.totalRevenue;
                const methodRevenue = aggregatedData.reduce(
                  (sum, item) => sum + (item.paymentMethods[method] || 0),
                  0
                );
                const percentage =
                  totalRevenue > 0
                    ? Math.round((methodRevenue / totalRevenue) * 100)
                    : 0;

                const colors = ["#4f46e5", "#10b981", "#f59e0b", "#8b5cf6"];

                const methodNames = {
                  "Credit Card": "Thẻ tín dụng",
                  Cash: "Tiền mặt",
                  "Mobile Payment": "Thanh toán di động",
                  "Bank Transfer": "Chuyển khoản",
                };

                return (
                  <div key={method}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: colors[index] }}
                        />
                        <span>{methodNames[method]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{formatCurrency(methodRevenue)}</span>
                        <Badge variant="outline">{percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: colors[index],
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
