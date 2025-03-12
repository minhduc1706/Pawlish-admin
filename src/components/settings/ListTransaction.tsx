"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

// Mock data for transactions
const transactions = [
  {
    id: "INV-001",
    date: new Date("2023-11-14"),
    customer: "John Doe",
    email: "john@example.com",
    amount: 125.99,
    status: "completed",
    method: "Credit Card",
  },
  {
    id: "INV-002",
    date: new Date("2023-11-13"),
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: 89.5,
    status: "completed",
    method: "PayPal",
  },
  {
    id: "INV-003",
    date: new Date("2023-11-12"),
    customer: "Robert Johnson",
    email: "robert@example.com",
    amount: 45.0,
    status: "pending",
    method: "Bank Transfer",
  },
  {
    id: "INV-004",
    date: new Date("2023-11-11"),
    customer: "Emily Davis",
    email: "emily@example.com",
    amount: 199.99,
    status: "completed",
    method: "Credit Card",
  },
  {
    id: "INV-005",
    date: new Date("2023-11-10"),
    customer: "Michael Wilson",
    email: "michael@example.com",
    amount: 65.75,
    status: "failed",
    method: "PayPal",
  },
  {
    id: "INV-006",
    date: new Date("2023-11-09"),
    customer: "Sarah Brown",
    email: "sarah@example.com",
    amount: 129.0,
    status: "completed",
    method: "Credit Card",
  },
  {
    id: "INV-007",
    date: new Date("2023-11-08"),
    customer: "David Miller",
    email: "david@example.com",
    amount: 79.99,
    status: "pending",
    method: "Bank Transfer",
  },
];

type Status = "all" | "completed" | "pending" | "failed";
type DateRange = { from: Date | undefined; to: Date | undefined };

export function TransactionHistory() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  // Filter transactions based on search, status, and date
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const searchMatch =
      transaction.id.toLowerCase().includes(search.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(search.toLowerCase()) ||
      transaction.email.toLowerCase().includes(search.toLowerCase());

    // Status filter
    const statusMatch = status === "all" || transaction.status === status;

    // Date filter
    let dateMatch = true;
    if (date.from) {
      dateMatch = dateMatch && transaction.date >= date.from;
    }
    if (date.to) {
      dateMatch = dateMatch && transaction.date <= date.to;
    }

    return searchMatch && statusMatch && dateMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Status badge styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Transactions</CardTitle>
        <CardDescription>
          View and manage all payment transactions in your system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex w-full items-center space-x-2 sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="w-full pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as Status)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date.from && !date.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      "Date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button variant="outline" className="ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.id}
                      </TableCell>
                      <TableCell>
                        {format(transaction.date, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{transaction.customer}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyles(
                            transaction.status
                          )}`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.method}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium">
                  {Math.min(filteredTransactions.length, perPage)}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {filteredTransactions.length}
                </span>{" "}
                transactions
              </p>
              <Select
                value={perPage.toString()}
                onValueChange={(value) => {
                  setPerPage(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={
                      page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  // Show first page, last page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(pageNumber);
                          }}
                          isActive={page === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Show ellipsis
                  if (
                    (pageNumber === 2 && page > 3) ||
                    (pageNumber === totalPages - 1 && page < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                    className={
                      page >= totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
