import { ClassItem, Pagination } from "./ClassDTO";
import { departmentItem } from "./DepartmentDTO";
import { EnrollmentItem } from "./EnrollmentDTO";
import { subjectItem } from "./SubjectDTO";

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

export interface StudentDetailResponse {
  data: {
    user: userItem;
    classes: ClassItem[];
    subjects: subjectItem[];
    departments: departmentItem[];
    total: {
      classes: number;
      subjects: number;
      departments: number;
    };
  };
}

export interface TeacherDetailResponse {
  data: {
    user: userItem;
    enrollments: EnrollmentItem[];
    classes: ClassItem[];
    subjects: subjectItem[];
    total: {
      enrollments: number;
      classes: number;
      subjects: number;
    };
  };
}
