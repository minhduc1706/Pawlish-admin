export interface User {
  _id: string;
  full_name?: string;
  email: string;
  phone?: string;
  address?: string;
  role: "admin" | "customer";
  status: "active" | "block";
}

export interface UpdateUserData {
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: "active" | "block";
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  lastPurchase: string;
  totalSpent: number;
}

export interface EmployeeType {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "groomer" | "admin" | "vet";
  salary: number;
  status: boolean;
}
