import { DepartmentSummary, Pagination } from "./ClassDTO";

export interface subjectItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  department?: DepartmentSummary;
}

export interface subjectResponse {
  data: subjectItem[];
  pagination: Pagination;
}
