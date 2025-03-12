"use client";

import { useState } from "react";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


// Mock data for promotions
const promotions = [
  {
    id: "PROMO-001",
    date: new Date("2023-11-14"),
    customer: "John Doe",
    email: "john@example.com",
    amount: 125.99,
    status: "completed",
    method: "Credit Card",
  },
  {
    id: "PROMO-002",
    date: new Date("2023-11-13"),
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: 89.5,
    status: "completed",
    method: "PayPal",
  },
  {
    id: "PROMO-003",
    date: new Date("2023-11-12"),
    customer: "Robert Johnson",
    email: "robert@example.com",
    amount: 45.0,
    status: "pending",
    method: "Bank Transfer",
  },
];

type Status = "all" | "completed" | "pending" | "failed";
type DateRange = { from: Date | undefined; to: Date | undefined };

export function PromotionHistory() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  // Filter promotions based on search, status, and date
  const filteredPromotions = promotions.filter((promotion) => {
    // Search filter
    const searchMatch =
      promotion.id.toLowerCase().includes(search.toLowerCase()) ||
      promotion.customer.toLowerCase().includes(search.toLowerCase()) ||
      promotion.email.toLowerCase().includes(search.toLowerCase());

    // Status filter
    const statusMatch = status === "all" || promotion.status === status;

    // Date filter
    let dateMatch = true;
    if (date.from) {
      dateMatch = dateMatch && promotion.date >= date.from;
    }
    if (date.to) {
      dateMatch = dateMatch && promotion.date <= date.to;
    }

    return searchMatch && statusMatch && dateMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPromotions.length / perPage);
  const paginatedPromotions = filteredPromotions.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotion History</CardTitle>
        <CardDescription>
          View and manage all promotions in your system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotion ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPromotions.length > 0 ? (
                paginatedPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">{promotion.id}</TableCell>
                    <TableCell>{format(promotion.date, "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <div>
                        <div>{promotion.customer}</div>
                        <div className="text-sm text-muted-foreground">
                          {promotion.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{promotion.amount}</TableCell>
                    <TableCell>{promotion.status}</TableCell>
                    <TableCell>{promotion.method}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No promotions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
