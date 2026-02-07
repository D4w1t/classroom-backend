import type { ClassItem } from "./ClassDTO.js";
import type { subjectItem } from "./SubjectDTO.js";
import type { departmentItem } from "./DepartmentDTO.js";
import type { userItem } from "./UserDTO.js";

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
