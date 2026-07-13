export type UserRole = "customer" | "admin";

export type UserProfile = {
  id: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  createdAt?: string;
};