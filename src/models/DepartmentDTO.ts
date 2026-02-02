import { Pagination } from "./ClassDTO";

export interface departmentItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  totalSubjects?: number;
}

export interface DepartmentsResponse {
  data: departmentItem[];
  pagination: Pagination;
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
}

export interface CreateDepartmentResponse {
  data: {
    id: number;
  };
}
