import { ClassItem, Pagination } from "./ClassDTO";
import { EnrollmentItem } from "./EnrollmentDTO";
import { subjectItem } from "./SubjectDTO";

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
export interface DepartmentDetailResponse {
  data: {
    departmentDetails: departmentItem;
    subjects: subjectItem[];
    classes: ClassItem[];
    enrolledStudents: EnrollmentItem[];
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
