export type UserRole = "CLIENT" | "FREELANCER" | "ADMIN";
export type ServiceStatus = "ACTIVE" | "INACTIVE";
export type OrderStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage: string | null;
  bio: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string | number;
  deliveryDays: number;
  image: string | null;
  status: ServiceStatus;
  freelancerId: string;
  categoryId: string;
  freelancer: User;
  category: Category;
  createdAt: string;
}

export interface Order {
  id: string;
  clientId: string;
  serviceId: string;
  price: string | number;
  status: OrderStatus;
  requirements: string | null;
  client: User;
  service: Service;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  clientId: string;
  serviceId: string;
  client: User;
  service: Service;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface AuthResponse {
  token: string;
  user: User;
}
