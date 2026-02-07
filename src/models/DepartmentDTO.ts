import { ClassItem, Pagination } from "./ClassDTO.js";
import { subjectItem } from "./SubjectDTO.js";

export interface departmentItem {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  totalSubjects?: number | null;
}

export interface DepartmentsResponse {
  data: departmentItem[];
  pagination: Pagination;
}

export interface departmentStudentItem {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "student" | "teacher" | "admin";
}

export interface DepartmentDetailResponse {
  data: {
    departmentDetails: departmentItem;
    subjects: subjectItem[];
    classes: ClassItem[];
    enrolledStudents: departmentStudentItem[];
    total: {
      subjects: number;
      classes: number;
      enrolledStudents: number;
    };
  };
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
