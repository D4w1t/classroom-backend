import { Pagination } from "./ClassDTO";

export type UserRole = "student" | "teacher" | "admin";

export interface userItem {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  imageCldPubId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersResponse {
  data: userItem[];
  pagination: Pagination;
}
