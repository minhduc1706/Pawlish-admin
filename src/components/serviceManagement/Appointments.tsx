"use client";

import { useState } from "react";
import { format, isToday, isPast, addDays, isFuture } from "date-fns";
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  Scissors,
  CalendarClock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CheckCheck,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

// Types
interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAvatar?: string;
  petName: string;
  petType: string;
  serviceName: string;
  serviceCategory: "spa" | "grooming";
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: "pending" | "scheduled" | "completed" | "canceled" | "no-show";
  isSpecial: boolean;
  specialReason?: string;
  notes?: string;
  price: number;
}

export default function AppointmentsList() {
  // Generate sample data with a mix of past, today, and future appointments
  const today = new Date();
  const generateSampleAppointments = (): Appointment[] => {
    const appointments: Appointment[] = [];

    // Past appointments
    for (let i = 1; i <= 5; i++) {
      const pastDate = addDays(today, -i * 2);
      appointments.push({
        id: `past-${i}`,
        customerId: `cust-${i}`,
        customerName: `Customer ${i}`,
        customerPhone: `(555) 123-${1000 + i}`,
        customerEmail: `customer${i}@example.com`,
        petName: `Pet ${i}`,
        petType: i % 2 === 0 ? "Dog" : "Cat",
        serviceName: i % 2 === 0 ? "Premium Grooming" : "Basic Spa Treatment",
        serviceCategory: i % 2 === 0 ? "grooming" : "spa",
        date: pastDate,
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        duration: 60,
        status: i % 3 === 0 ? "canceled" : "completed",
        isSpecial: false,
        price: 45 + i * 5,
      });
    }

    // Today's appointments
    for (let i = 1; i <= 3; i++) {
      appointments.push({
        id: `today-${i}`,
        customerId: `cust-${i + 5}`,
        customerName: `Customer ${i + 5}`,
        customerPhone: `(555) 123-${2000 + i}`,
        customerEmail: `customer${i + 5}@example.com`,
        petName: `Pet ${i + 5}`,
        petType: i % 2 === 0 ? "Dog" : "Cat",
        serviceName: i % 2 === 0 ? "Deluxe Bath" : "Nail Trimming",
        serviceCategory: i % 2 === 0 ? "spa" : "grooming",
        date: today,
        startTime: `${i + 9}:00 AM`,
        endTime: `${i + 10}:00 AM`,
        duration: 60,
        status: i === 3 ? "no-show" : "scheduled",
        isSpecial: i === 2,
        specialReason:
          i === 2
            ? "Customer requested special handling for anxious pet"
            : undefined,
        price: 35 + i * 10,
      });
    }

    // Future appointments
    for (let i = 1; i <= 7; i++) {
      const futureDate = addDays(today, i);
      const isPending = i % 4 === 0;
      const isSpecial = i % 3 === 0;

      appointments.push({
        id: `future-${i}`,
        customerId: `cust-${i + 8}`,
        customerName: `Customer ${i + 8}`,
        customerPhone: `(555) 123-${3000 + i}`,
        customerEmail: `customer${i + 8}@example.com`,
        petName: `Pet ${i + 8}`,
        petType: i % 3 === 0 ? "Bird" : i % 2 === 0 ? "Dog" : "Cat",
        serviceName:
          i % 3 === 0
            ? "Full Grooming Package"
            : i % 2 === 0
            ? "Aromatherapy"
            : "Bath & Brush",
        serviceCategory: i % 2 === 0 ? "spa" : "grooming",
        date: futureDate,
        startTime: `${(i % 8) + 9}:00 AM`,
        endTime: `${(i % 8) + 10}:00 AM`,
        duration: 60,
        status: isPending ? "pending" : "scheduled",
        isSpecial: isSpecial,
        specialReason: isSpecial
          ? `Special request #${i}: ${
              i % 2 === 0
                ? "Senior pet needs extra care"
                : "First-time customer with nervous pet"
            }`
          : undefined,
        price: 40 + i * 5,
      });
    }

    return appointments;
  };

  // State
  const [appointments, setAppointments] = useState<Appointment[]>(
    generateSampleAppointments()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [specialFilter, setSpecialFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [actionReason, setActionReason] = useState("");
  const itemsPerPage = 8;

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    // Search term filter
    const matchesSearch =
      appointment.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.customerPhone.includes(searchTerm);

    // Status filter
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    // Service filter
    const matchesService =
      serviceFilter === "all" || appointment.serviceCategory === serviceFilter;

    // Special filter
    const matchesSpecial =
      specialFilter === "all" ||
      (specialFilter === "special" && appointment.isSpecial) ||
      (specialFilter === "pending" && appointment.status === "pending") ||
      (specialFilter === "regular" &&
        !appointment.isSpecial &&
        appointment.status !== "pending");

    // Date filter
    const matchesDate =
      !dateFilter ||
      (appointment.date.getDate() === dateFilter.getDate() &&
        appointment.date.getMonth() === dateFilter.getMonth() &&
        appointment.date.getFullYear() === dateFilter.getFullYear());

    // Tab filter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "today" && isToday(appointment.date)) ||
      (activeTab === "upcoming" && isFuture(appointment.date)) ||
      (activeTab === "past" &&
        isPast(appointment.date) &&
        !isToday(appointment.date));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesService &&
      matchesSpecial &&
      matchesDate &&
      matchesTab
    );
  });

  // Sort appointments by date (newest first for past, oldest first for upcoming)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // First sort by pending status (pending first)
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;

    // Then sort by special flag (special first)
    if (a.isSpecial && !b.isSpecial) return -1;
    if (!a.isSpecial && b.isSpecial) return 1;

    // Then sort by date
    if (activeTab === "past") {
      return b.date.getTime() - a.date.getTime(); // Newest past appointments first
    } else {
      return a.date.getTime() - b.date.getTime(); // Oldest upcoming appointments first
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = sortedAppointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Pending Approval
          </Badge>
        );
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Scheduled
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      case "canceled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Canceled
          </Badge>
        );
      case "no-show":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            No Show
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      case "scheduled":
        return <CalendarClock className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "canceled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "no-show":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  // Handle appointment approval
  const approveAppointment = (id: string, reason = "") => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: "scheduled",
              notes: reason
                ? `${appointment.notes || ""}\nApproved: ${reason}`.trim()
                : appointment.notes,
            }
          : appointment
      )
    );
    setSelectedAppointment(null);
    setActionReason("");
  };

  // Handle appointment cancellation
  const cancelAppointment = (id: string, reason = "") => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: "canceled",
              notes: reason
                ? `${appointment.notes || ""}\nCanceled: ${reason}`.trim()
                : appointment.notes,
            }
          : appointment
      )
    );
    setSelectedAppointment(null);
    setActionReason("");
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Appointment List
              </CardTitle>
              <CardDescription>
                View, approve, and manage all customer appointments
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start w-full sm:w-auto"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                  {dateFilter && (
                    <div className="p-3 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateFilter(undefined)}
                        className="w-full"
                      >
                        Clear Date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Tabs
                defaultValue="all"
                className="w-full sm:w-auto"
                onValueChange={(value) => {
                  setActiveTab(value);
                  setCurrentPage(1);
                }}
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex flex-1 flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by customer, pet, or service..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={specialFilter}
                    onValueChange={(value) => {
                      setSpecialFilter(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pending">Pending Approval</SelectItem>
                      <SelectItem value="special">Special Requests</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={serviceFilter}
                    onValueChange={(value) => {
                      setServiceFilter(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="spa">Spa</SelectItem>
                      <SelectItem value="grooming">Grooming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Pet</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAppointments.length > 0 ? (
                    paginatedAppointments.map((appointment) => (
                      <TableRow
                        key={appointment.id}
                        className={
                          appointment.status === "pending"
                            ? "bg-purple-50"
                            : appointment.isSpecial
                            ? "bg-blue-50"
                            : ""
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={appointment.customerAvatar}
                                alt={appointment.customerName}
                              />
                              <AvatarFallback>
                                {appointment.customerName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {appointment.customerName}
                              </span>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Phone className="mr-1 h-3 w-3" />
                                {appointment.customerPhone}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{appointment.petName}</span>
                            <span className="text-xs text-muted-foreground">
                              {appointment.petType}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {appointment.serviceCategory === "spa" ? (
                              <Badge
                                variant="secondary"
                                className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                              >
                                <span className="sr-only">Spa</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M2 12c.8-.6 1.7-1.2 2.5-1.5 1.4-.6 3-.6 4.4.1 1.9.8 4.1.7 6-.5 1.4-.9 2.2-2.1 3.1-3.1" />
                                  <path d="M2 20c.8-.6 1.7-1.2 2.5-1.5 1.4-.6 3-.6 4.4.1 1.9.8 4.1.7 6-.5 1.4-.9 2.2-2.1 3.1-3.1" />
                                  <path d="M2 4c.8-.6 1.7-1.2 2.5-1.5 1.4-.6 3-.6 4.4.1 1.9.8 4.1.7 6-.5 1.4-.9 2.2-2.1 3.1-3.1" />
                                </svg>
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                              >
                                <span className="sr-only">Grooming</span>
                                <Scissors className="h-3 w-3" />
                              </Badge>
                            )}
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <span>{appointment.serviceName}</span>
                                {appointment.isSpecial && (
                                  <Badge
                                    variant="outline"
                                    className="ml-1 bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    Special
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                {appointment.duration} min •{" "}
                                {formatCurrency(appointment.price)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span
                              className={`font-medium ${
                                isToday(appointment.date) ? "text-blue-600" : ""
                              }`}
                            >
                              {isToday(appointment.date)
                                ? "Today"
                                : format(appointment.date, "MMM d, yyyy")}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {appointment.startTime} - {appointment.endTime}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(appointment.status)}
                            {getStatusBadge(appointment.status)}
                          </div>
                          {(appointment.isSpecial ||
                            appointment.status === "pending") &&
                            appointment.specialReason && (
                              <div
                                className="mt-1 text-xs text-muted-foreground max-w-[200px] truncate"
                                title={appointment.specialReason}
                              >
                                {appointment.specialReason}
                              </div>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {(appointment.status === "pending" ||
                              appointment.isSpecial) &&
                              appointment.status !== "completed" &&
                              appointment.status !== "canceled" &&
                              !isPast(appointment.date) && (
                                <>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50"
                                        onClick={() =>
                                          setSelectedAppointment(appointment)
                                        }
                                      >
                                        <CheckCheck className="h-4 w-4" />
                                        <span className="hidden sm:inline">
                                          Approve
                                        </span>
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Approve Appointment
                                        </DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to approve this
                                          appointment?
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-2">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm font-medium mb-1">
                                              Customer
                                            </p>
                                            <p className="text-sm">
                                              {
                                                selectedAppointment?.customerName
                                              }
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium mb-1">
                                              Service
                                            </p>
                                            <p className="text-sm">
                                              {selectedAppointment?.serviceName}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium mb-1">
                                              Date
                                            </p>
                                            <p className="text-sm">
                                              {selectedAppointment?.date &&
                                                format(
                                                  selectedAppointment.date,
                                                  "MMM d, yyyy"
                                                )}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium mb-1">
                                              Time
                                            </p>
                                            <p className="text-sm">
                                              {selectedAppointment?.startTime} -{" "}
                                              {selectedAppointment?.endTime}
                                            </p>
                                          </div>
                                        </div>
                                        {selectedAppointment?.specialReason && (
                                          <div>
                                            <p className="text-sm font-medium mb-1">
                                              Special Request
                                            </p>
                                            <p className="text-sm">
                                              {
                                                selectedAppointment.specialReason
                                              }
                                            </p>
                                          </div>
                                        )}
                                        <div>
                                          <label
                                            htmlFor="approval-notes"
                                            className="text-sm font-medium"
                                          >
                                            Add notes (optional)
                                          </label>
                                          <Textarea
                                            id="approval-notes"
                                            placeholder="Add any notes about this approval..."
                                            value={actionReason}
                                            onChange={(e) =>
                                              setActionReason(e.target.value)
                                            }
                                            className="mt-1"
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <DialogClose asChild>
                                          <Button variant="outline">
                                            Cancel
                                          </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                          <Button
                                            variant="default"
                                            onClick={() =>
                                              selectedAppointment &&
                                              approveAppointment(
                                                selectedAppointment.id,
                                                actionReason
                                              )
                                            }
                                          >
                                            Approve Appointment
                                          </Button>
                                        </DialogClose>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>

                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() =>
                                          setSelectedAppointment(appointment)
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="hidden sm:inline">
                                          Cancel
                                        </span>
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Cancel Appointment
                                        </DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to cancel this
                                          appointment?
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-2">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm font-medium mb-1">
                                              Customer
                                            </p>
                                            <p className="text-sm">
                                              {
                                                selectedAppointment?.customerName
                                              }
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium mb-1">
                                              Service
                                            </p>
                                            <p className="text-sm">
                                              {selectedAppointment?.serviceName}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium mb-1">
                                              Date
                                            </p>
                                            <p className="text-sm">
                                              {selectedAppointment?.date &&
                                                format(
                                                  selectedAppointment.date,
                                                  "MMM d, yyyy"
                                                )}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium mb-1">
                                              Time
                                            </p>
                                            <p className="text-sm">
                                              {selectedAppointment?.startTime} -{" "}
                                              {selectedAppointment?.endTime}
                                            </p>
                                          </div>
                                        </div>
                                        <div>
                                          <label
                                            htmlFor="cancellation-reason"
                                            className="text-sm font-medium"
                                          >
                                            Cancellation reason
                                          </label>
                                          <Textarea
                                            id="cancellation-reason"
                                            placeholder="Provide a reason for cancellation..."
                                            value={actionReason}
                                            onChange={(e) =>
                                              setActionReason(e.target.value)
                                            }
                                            className="mt-1"
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <DialogClose asChild>
                                          <Button variant="outline">
                                            Cancel
                                          </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                          <Button
                                            variant="destructive"
                                            onClick={() =>
                                              selectedAppointment &&
                                              cancelAppointment(
                                                selectedAppointment.id,
                                                actionReason
                                              )
                                            }
                                          >
                                            Cancel Appointment
                                          </Button>
                                        </DialogClose>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No appointments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredAppointments.length
                  )}{" "}
                  of {filteredAppointments.length} appointments
                </div>
                <div className="flex items-center space-x-2">
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
