import { useState } from "react";
import {
  MoreHorizontal,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer } from "@/interfaces/User";
import CustomerForm from "./CustomerForm";

export default function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      lastPurchase: "2023-10-15",
      totalSpent: 1250.99,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "inactive",
      lastPurchase: "2023-08-22",
      totalSpent: 550.5,
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      status: "active",
      lastPurchase: "2023-11-05",
      totalSpent: 3200.75,
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      status: "active",
      lastPurchase: "2023-12-01",
      totalSpent: 890.25,
    },
    {
      id: "5",
      name: "Michael Wilson",
      email: "michael@example.com",
      status: "inactive",
      lastPurchase: "2023-09-18",
      totalSpent: 1475.6,
    },
  ]);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const itemsPerPage = 5;

  // Customer operations
  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  // Filter and pagination
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const updateCustomer = (updateCustomer: Customer) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updateCustomer.id ? updateCustomer : customer
      )
    );
    setEditingCustomer(null);
  };

  // Formatting
  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newCustomer = { ...customer, id: String(customers.length + 1) };
    setCustomers([...customers, newCustomer]);
    setIsAddingCustomer(false);
  };
  
  const handleFormSubmit = (data: Customer | Omit<Customer, "id">) => {
    if ("id" in data) {
      updateCustomer(data as Customer);
    } else {
      addCustomer(data);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6">
      {isAddingCustomer || editingCustomer ? (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsAddingCustomer(false);
            setEditingCustomer(null);
          }}
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Customer Management</CardTitle>
            <Button onClick={() => setIsAddingCustomer(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Purchase</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCustomers.length > 0 ? (
                      paginatedCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">
                            {customer.name}
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                customer.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{customer.lastPurchase}</TableCell>
                          <TableCell>
                            {formatCurrency(customer.totalSpent)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setEditingCustomer(customer)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteCustomer(customer.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No customers found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
