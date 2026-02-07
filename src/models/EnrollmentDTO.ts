import type { ClassItem } from "./ClassDTO";
import type { subjectItem } from "./SubjectDTO";
import type { departmentItem } from "./DepartmentDTO";
import type { userItem } from "./UserDTO";

export interface EnrollmentItem {
  id: number;
  classId: number;
  studentId: string;
  createdAt: Date;
  updatedAt: Date;
  class?: ClassItem | null;
  subject?: subjectItem | null;
  department?: departmentItem | null;
  teacher?: userItem | null;
}

export interface EnrollmentResponse {
  data: {
    enrollmentDetails: EnrollmentItem;
  };
}

export interface CreateEnrollmentRequest {
  classId: number;
  studentId: string;
}

export interface CreateEnrollmentResponse {
  data: {
    enrollmentDetails: EnrollmentItem;
  };
}

export interface JoinEnrollmentRequest {
  inviteCode: string;
  studentId: string;
}

export interface JoinEnrollmentResponse {
  data: {
    enrollmentDetails: EnrollmentItem;
  };
}
