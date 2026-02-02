export interface SubjectSummary {
  id: number;
  name: string;
}

export interface TeacherSummary {
  id: string;
  name?: string | null;
}

export interface DepartmentSummary {
  id: number;
  name: string;
}

export type ClassStatus = "active" | "inactive" | "completed";

export interface ClassItem {
  id: number;
  inviteCode: string;
  name: string;
  bannerCldPubId?: string | null;
  bannerUrl?: string | null;
  description?: string | null;
  capacity: number;
  status: ClassStatus;
  schedules: any[];
  createdAt: Date;
  updatedAt: Date;
  subject?: SubjectSummary | null;
  teacher?: TeacherSummary | null;
  department?: DepartmentSummary | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ClassesResponse {
  data: ClassItem[];
  pagination: Pagination;
}

export interface GetClassResponse {
  data: ClassItem;
}

export interface CreateClassRequest {
  subjectId: number;
  teacherId: string;
  name: string;
  description?: string | null;
  capacity?: number;
  status?: ClassStatus;
  schedules?: any[];
  bannerCldPubId?: string | null;
  bannerUrl?: string | null;
}

export interface CreateClassResponse {
  data: {
    id: number;
  };
}
