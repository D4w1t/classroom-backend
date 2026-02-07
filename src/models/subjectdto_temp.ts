import { ClassItem, DepartmentSummary, Pagination } from "./ClassDTO";

export interface subjectItem {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  department?: DepartmentSummary | null;
}

export interface subjectResponse {
  data: subjectItem[];
  pagination: Pagination;
}

export interface subjectDetailsResponse {
  data: {
    subjectDetails: subjectItem;
    classes: ClassItem[];
    total: {
      classes: number;
    };
  };
}

export interface SubjectCreateRequest {
  name: string;
  code: string;
  departmentId: number;
  description?: string | null;
}

export interface SubjectCreateResponse {
  data: {
    id: number;
  };
}
