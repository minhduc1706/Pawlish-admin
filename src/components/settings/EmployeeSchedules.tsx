"use client";

import { useState } from "react";
import { addDays, format, getDay, startOfWeek, subDays } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for departments
const departments = [
  { id: "all", name: "All Departments" },
  { id: "sales", name: "Sales" },
  { id: "support", name: "Customer Support" },
  { id: "dev", name: "Development" },
  { id: "marketing", name: "Marketing" },
];

// Mock data for employees
const employees = [
  {
    id: "emp001",
    name: "John Doe",
    department: "sales",
    position: "Sales Manager",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp002",
    name: "Jane Smith",
    department: "sales",
    position: "Sales Representative",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp003",
    name: "Robert Johnson",
    department: "support",
    position: "Support Team Lead",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp004",
    name: "Emily Davis",
    department: "support",
    position: "Support Specialist",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp005",
    name: "Michael Wilson",
    department: "dev",
    position: "Senior Developer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp006",
    name: "Sarah Brown",
    department: "dev",
    position: "Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "emp007",
    name: "David Miller",
    department: "marketing",
    position: "Marketing Specialist",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

// Mock data for shifts
const shiftTypes = {
  morning: {
    name: "Morning",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    hours: "8:00 AM - 4:00 PM",
  },
  afternoon: {
    name: "Afternoon",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    hours: "4:00 PM - 12:00 AM",
  },
  night: {
    name: "Night",
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    hours: "12:00 AM - 8:00 AM",
  },
  dayOff: {
    name: "Day Off",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    hours: "N/A",
  },
  vacation: {
    name: "Vacation",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    hours: "N/A",
  },
  sickLeave: {
    name: "Sick Leave",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    hours: "N/A",
  },
};

// Generate mock schedule data for the current month
const generateSchedule = () => {
  const today = new Date();
  const startDate = subDays(today, 15);
  const endDate = addDays(today, 15);

  const schedule = [];

  for (let i = 0; i < employees.length; i++) {
    const employee = employees[i];
    const employeeSchedule: {
      employeeId: string;
      shifts: { date: Date; type: string; notes: string }[];
    } = {
      employeeId: employee.id,
      shifts: [],
    };

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Randomly assign shifts
      const dayOfWeek = getDay(currentDate);
      let shiftType;

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend - higher chance of day off
        shiftType =
          Math.random() > 0.3
            ? "dayOff"
            : ["morning", "afternoon", "night"][Math.floor(Math.random() * 3)];
      } else {
        // Weekday
        const rand = Math.random();
        if (rand < 0.7) {
          // 70% chance of regular shift
          shiftType = ["morning", "afternoon", "night"][
            Math.floor(Math.random() * 3)
          ];
        } else if (rand < 0.85) {
          // 15% chance of day off
          shiftType = "dayOff";
        } else if (rand < 0.95) {
          // 10% chance of vacation
          shiftType = "vacation";
        } else {
          // 5% chance of sick leave
          shiftType = "sickLeave";
        }
      }

      employeeSchedule.shifts.push({
        date: new Date(currentDate),
        type: shiftType,
        notes: "",
      });

      currentDate = addDays(currentDate, 1);
    }

    schedule.push(employeeSchedule);
  }

  return schedule;
};

const scheduleData = generateSchedule();

export function EmployeeSchedule() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [viewMode, setViewMode] = useState("week");
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("week");

  // Filter employees by department
  const filteredEmployees = employees.filter(
    (employee) =>
      selectedDepartment === "all" || employee.department === selectedDepartment
  );

  // Get the start of the week for the selected date
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });

  // Generate array of dates for the week view
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Navigate to previous/next week
  const goToPreviousWeek = () => {
    setSelectedDate(subDays(selectedDate, 7));
  };

  const goToNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  // Get shift for a specific employee and date
  const getShift = (employeeId: string, date: Date) => {
    const employeeSchedule = scheduleData.find(
      (s) => s.employeeId === employeeId
    );
    if (!employeeSchedule) return null;

    return employeeSchedule.shifts.find(
      (shift) => format(shift.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  // Handle shift click to show details
  const handleShiftClick = (employee: any, shift: any) => {
    setSelectedShift({
      ...shift,
      employee,
    });
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Work Schedule</CardTitle>
        <CardDescription>
          View and manage employee work schedules and shifts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "MMMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {filteredEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Tabs
                value={viewMode}
                onValueChange={setViewMode}
                className="w-[200px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsContent value="week" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  {format(weekStart, "MMMM d")} -{" "}
                  {format(addDays(weekStart, 6), "MMMM d, yyyy")}
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousWeek}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Employee</TableHead>
                      {weekDates.map((date) => (
                        <TableHead
                          key={date.toString()}
                          className="min-w-[120px] text-center"
                        >
                          <div className="flex flex-col">
                            <span>{format(date, "EEE")}</span>
                            <span
                              className={cn(
                                "text-sm font-normal",
                                format(date, "yyyy-MM-dd") ===
                                  format(new Date(), "yyyy-MM-dd")
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground"
                              )}
                            >
                              {format(date, "MMM d")}
                            </span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(selectedEmployee === "all"
                      ? filteredEmployees
                      : filteredEmployees.filter(
                          (e) => e.id === selectedEmployee
                        )
                    ).map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={employee.avatar}
                                alt={employee.name}
                              />
                              <AvatarFallback>
                                {employee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{employee.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {employee.position}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        {weekDates.map((date) => {
                          const shift = getShift(employee.id, date);
                          const shiftInfo = shift
                            ? shiftTypes[shift.type as keyof typeof shiftTypes]
                            : null;

                          return (
                            <TableCell
                              key={date.toString()}
                              className="text-center"
                            >
                              {shift && shiftInfo && (
                                <Badge
                                  className={cn(
                                    "cursor-pointer hover:opacity-80",
                                    shiftInfo.color
                                  )}
                                  onClick={() =>
                                    handleShiftClick(employee, shift)
                                  }
                                >
                                  {shiftInfo.name}
                                </Badge>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduleData
                      .filter(
                        (schedule) =>
                          (selectedEmployee === "all" ||
                            schedule.employeeId === selectedEmployee) &&
                          (selectedDepartment === "all" ||
                            employees.find((e) => e.id === schedule.employeeId)
                              ?.department === selectedDepartment)
                      )
                      .flatMap((schedule) => {
                        const employee = employees.find(
                          (e) => e.id === schedule.employeeId
                        );
                        return schedule.shifts
                          .filter((shift) => {
                            // Filter shifts within 7 days of selected date
                            const shiftDate = new Date(shift.date);
                            const diffTime = Math.abs(
                              shiftDate.getTime() - selectedDate.getTime()
                            );
                            const diffDays = Math.ceil(
                              diffTime / (1000 * 60 * 60 * 24)
                            );
                            return diffDays <= 7;
                          })
                          .map((shift) => ({ employee, shift }));
                      })
                      .sort(
                        (a, b) =>
                          a.shift.date.getTime() - b.shift.date.getTime()
                      )
                      .map(({ employee, shift }, index) => {
                        const shiftInfo =
                          shiftTypes[shift.type as keyof typeof shiftTypes];

                        return (
                          <TableRow
                            key={`${employee?.id}-${index}`}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleShiftClick(employee, shift)}
                          >
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={employee?.avatar}
                                    alt={employee?.name}
                                  />
                                  <AvatarFallback>
                                    {employee?.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div>{employee?.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {employee?.position}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(shift.date, "EEE, MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              <Badge className={cn(shiftInfo.color)}>
                                {shiftInfo.name}
                              </Badge>
                            </TableCell>
                            <TableCell>{shiftInfo.hours}</TableCell>
                            <TableCell>
                              {shift.type === "vacation" ||
                              shift.type === "sickLeave" ||
                              shift.type === "dayOff" ? (
                                <span className="text-muted-foreground">
                                  Not Working
                                </span>
                              ) : (
                                <span className="text-green-600 dark:text-green-400">
                                  Scheduled
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Shift Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Shift Details</DialogTitle>
              <DialogDescription>
                View details for the selected shift.
              </DialogDescription>
            </DialogHeader>

            {selectedShift && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Employee
                    </h4>
                    <p className="text-base">{selectedShift.employee.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Position
                    </h4>
                    <p className="text-base">
                      {selectedShift.employee.position}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Date
                    </h4>
                    <p className="text-base">
                      {format(selectedShift.date, "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Shift
                    </h4>
                    <Badge
                      className={cn(
                        shiftTypes[
                          selectedShift.type as keyof typeof shiftTypes
                        ].color
                      )}
                    >
                      {
                        shiftTypes[
                          selectedShift.type as keyof typeof shiftTypes
                        ].name
                      }
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Hours
                    </h4>
                    <p className="text-base">
                      {
                        shiftTypes[
                          selectedShift.type as keyof typeof shiftTypes
                        ].hours
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Department
                    </h4>
                    <p className="text-base">
                      {
                        departments.find(
                          (d) => d.id === selectedShift.employee.department
                        )?.name
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Notes
                  </h4>
                  <p className="text-base text-muted-foreground">
                    {selectedShift.notes || "No notes for this shift."}
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
