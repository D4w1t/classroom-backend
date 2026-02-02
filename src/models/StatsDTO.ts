import { ClassItem } from "./ClassDTO.js";
import { userItem, UserRole } from "./UserDTO.js";

export interface statsItem {
  users: number;
  teachers: number;
  admins: number;
  subjects: number;
  departments: number;
  classes: number;
}

export interface StatsResponse {
  data: statsItem;
}

export interface LatestStatsResponse {
  data: {
    latestClasses: ClassItem[];
    latestTeachers: userItem[];
  };
}

export interface usersByRoleItem {
  role: UserRole;
  total: number;
}

export interface subjectsByDepartmentItem {
  departmentId: number;
  departmentName: string;
  totalSubjects: number;
}

export interface classesBySubjectItem {
  subjectId: number;
  subjectName: string;
  totalClasses: number;
}

export interface ChartsResponse {
  data: {
    usersByRole: usersByRoleItem[];
    subjectsByDepartment: subjectsByDepartmentItem[];
    classesBySubject: classesBySubjectItem[];
  };
}
