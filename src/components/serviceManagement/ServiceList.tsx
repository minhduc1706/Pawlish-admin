"use client";

import { useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Clock,
  DollarSign,
  Star,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceForm } from "@/components/serviceManagement/ServiceForm";

// Service type definition
interface Service {
  id: string;
  name: string;
  description: string;
  category: "spa" | "grooming";
  duration: number; // in minutes
  price: number;
  popularityScore: number; // 1-5
  forPetTypes: string[]; // e.g., ["dog", "cat"]
  image?: string;
}

export default function ServiceList() {
  // Sample service data
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Premium Dog Bath",
      description:
        "Complete bath with premium shampoo, conditioner, and blow dry",
      category: "grooming",
      duration: 60,
      price: 45.99,
      popularityScore: 5,
      forPetTypes: ["dog"],
    },
    {
      id: "2",
      name: "Cat Grooming Package",
      description:
        "Full grooming service for cats including nail trimming and ear cleaning",
      category: "grooming",
      duration: 45,
      price: 39.99,
      popularityScore: 4,
      forPetTypes: ["cat"],
    },
    {
      id: "3",
      name: "Relaxing Pet Massage",
      description:
        "Therapeutic massage to relieve stress and improve circulation",
      category: "spa",
      duration: 30,
      price: 35.5,
      popularityScore: 5,
      forPetTypes: ["dog", "cat"],
    },
    {
      id: "4",
      name: "Aromatherapy Treatment",
      description:
        "Calming aromatherapy session with essential oils safe for pets",
      category: "spa",
      duration: 25,
      price: 29.99,
      popularityScore: 3,
      forPetTypes: ["dog", "cat"],
    },
    {
      id: "5",
      name: "Nail Trimming",
      description: "Professional nail trimming service",
      category: "grooming",
      duration: 15,
      price: 15.99,
      popularityScore: 4,
      forPetTypes: ["dog", "cat"],
    },
  ]);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "spa" | "grooming">("all");
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const itemsPerPage = 5;

  // Service operations
  const addService = (service: Omit<Service, "id">) => {
    const newService = {
      ...service,
      id: Math.random().toString(36).substring(2, 9),
    };
    setServices([...services, newService as Service]);
    setIsAddingService(false);
  };

  const updateService = (updatedService: Service) => {
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
    setEditingService(null);
  };

  const deleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
  };

  // Filter and pagination
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeTab === "all" || service.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Formatting
  //   const formatCurrency = (amount: number) => {
  //     return new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);
  //   };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} hr ${remainingMinutes} min`
      : `${hours} hr`;
  };

  // Handle form submission
  const handleFormSubmit = (data: Service | Omit<Service, "id">) => {
    if ("id" in data) {
      updateService(data as Service);
    } else {
      addService(data);
    }
  };

  return (
    <div className="container mx-auto py-6">
      {isAddingService || editingService ? (
        <ServiceForm
          service={editingService}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsAddingService(false);
            setEditingService(null);
          }}
        />
      ) : (
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Spa & Grooming Services
                </CardTitle>
                <CardDescription>
                  Manage your pet spa and grooming services
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddingService(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Tabs
                  defaultValue="all"
                  className="w-full sm:w-auto"
                  onValueChange={(value) => {
                    setActiveTab(value as "all" | "spa" | "grooming");
                    setCurrentPage(1);
                  }}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="spa">Spa</TabsTrigger>
                    <TabsTrigger value="grooming">Grooming</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Category
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Duration
                      </TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        For
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Popularity
                      </TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedServices.length > 0 ? (
                      paginatedServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {service.name}
                              </span>
                              <span className="text-sm text-muted-foreground hidden sm:inline">
                                {service.description.length > 50
                                  ? `${service.description.substring(0, 50)}...`
                                  : service.description}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant={
                                service.category === "spa"
                                  ? "default"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {service.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                              {formatDuration(service.duration)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center font-medium">
                              <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                              {service.price.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {service.forPetTypes.map((petType) => (
                                <Badge
                                  key={petType}
                                  variant="outline"
                                  className="capitalize"
                                >
                                  {petType}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < service.popularityScore
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <span className="sr-only">Open menu</span>
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                  >
                                    <path
                                      d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setEditingService(service)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteService(service.id)}
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
                          No services found.
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
