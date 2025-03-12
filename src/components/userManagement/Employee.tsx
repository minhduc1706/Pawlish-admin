import { useState } from "react";
import { MoreHorizontal, Search, Edit, Trash2, PlusCircle } from "lucide-react";

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
import { EmployeeType } from "@/interfaces/User";
import EmployeeForm from "./EmployeeForm";

export default function Employee() {
  const [employees, setEmployees] = useState<EmployeeType[]>([
    {
      id: "1",
      full_name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      role: "groomer",
      salary: 4500.99,
      status: true,
    },
    {
      id: "2",
      full_name: "Jane Smith",
      email: "jane@example.com",
      phone: "987-654-3210",
      role: "admin",
      salary: 3500.5,
      status: false,
    },
  ]);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeType | null>(
    null
  );

  // Employee operations
  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateEmployee = (updatedEmployee: EmployeeType) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
    setEditingEmployee(null);
  };

  const addEmployee = (employee: Omit<EmployeeType, "id">) => {
    const newEmployee = { ...employee, id: String(employees.length + 1) };
    setEmployees([...employees, newEmployee]);
    setIsAddingEmployee(false);
  };

  const handleFormSubmit = (data: EmployeeType | Omit<EmployeeType, "id">) => {
    if ("id" in data) {
      updateEmployee(data as EmployeeType);
    } else {
      addEmployee(data);
    }
  };

  return (
    <div className="container mx-auto py-6">
      {isAddingEmployee || editingEmployee ? (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsAddingEmployee(false);
            setEditingEmployee(null);
          }}
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Employee Management</CardTitle>
            <Button onClick={() => setIsAddingEmployee(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search employees..."
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
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.full_name}
                          </TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.phone || "N/A"}</TableCell>
                          <TableCell>{employee.role}</TableCell>
                          <TableCell>${employee.salary.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                employee.status ? "default" : "secondary"
                              }
                            >
                              {employee.status ? "Active" : "Inactive"}
                            </Badge>
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
                                  onClick={() => setEditingEmployee(employee)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteEmployee(employee.id)}
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
                        <TableCell colSpan={7} className="h-24 text-center">
                          No employees found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
