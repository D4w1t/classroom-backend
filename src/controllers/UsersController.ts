import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import {
  Controller,
  Get,
  Query,
  Route,
  SuccessResponse,
  Tags,
  Response,
  Path,
} from "tsoa";

import {
  classes,
  departments,
  enrollments,
  subjects,
  user,
} from "../db/schema/index.js";
import { db } from "../db/index.js";
import {
  StudentDetailResponse,
  TeacherDetailResponse,
  userItem,
  UsersResponse,
} from "../models/UserDTO.js";

@Route("users")
@Tags("Users")
export class UsersController extends Controller {
  @Get("/")
  @SuccessResponse("200", "OK")
  @Response(400, "Bad Request")
  public async getUsers(
    @Query() search?: string,
    @Query() role?: string,
    @Query() limit = 10,
    @Query() page = 1,
  ): Promise<UsersResponse | { error: string }> {
    const allowedRoles = ["student", "teacher", "admin"] as const;
    type Role = (typeof allowedRoles)[number];

    const currentPage = Math.max(1, Number(page) || 1);
    const limitPerPage = Math.min(100, Math.max(1, Number(limit) || 10));

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions: any[] = [];

    if (search) {
      filterConditions.push(
        or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)),
      );
    }

    if (role && !allowedRoles.includes(role as Role)) {
      this.setStatus(400);
      return {
        error: "Invalid role parameter. Allowed roles: student, teacher, admin",
      };
    }

    if (role && allowedRoles.includes(role as Role)) {
      filterConditions.push(eq(user.role, role as Role));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const userList = await db
      .select({ ...getTableColumns(user) })
      .from(user)
      .where(whereClause)
      .orderBy(desc(user.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    this.setStatus(200);
    return {
      data: userList as unknown as userItem[],
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    };
  }

  @Get("/{id}")
  @SuccessResponse("200", "Ok")
  @Response(400, "Bad Request")
  @Response(404, "Not Found")
  public async getUserById(
    @Path() id: string,
  ): Promise<
    | TeacherDetailResponse
    | StudentDetailResponse
    | { data: { user: userItem } }
    | { error: string }
  > {
    const userId = id;

    const [userDetails] = await db
      .select({
        ...getTableColumns(user),
      })
      .from(user)
      .where(eq(user.id, userId));

    if (!userDetails) {
      this.setStatus(404);
      return { error: "User not found" };
    }

    if (userDetails.role === "teacher") {
      const classesList = await db
        .select({
          ...getTableColumns(classes),
          subject: {
            ...getTableColumns(subjects),
          },
          department: {
            ...getTableColumns(departments),
          },
        })
        .from(classes)
        .leftJoin(subjects, eq(classes.subjectId, subjects.id))
        .leftJoin(departments, eq(subjects.departmentId, departments.id))
        .where(eq(classes.teacherId, userId))
        .orderBy(desc(classes.createdAt));

      const subjectMap = new Map<number, typeof subjects.$inferSelect>();
      const departmentMap = new Map<number, typeof departments.$inferSelect>();

      for (const classItem of classesList) {
        if (classItem.subject?.id) {
          subjectMap.set(classItem.subject.id, classItem.subject);
        }

        if (classItem.department?.id) {
          departmentMap.set(classItem.department.id, classItem.department);
        }
      }

      this.setStatus(200);
      return {
        data: {
          user: userDetails,
          classes: classesList,
          subjects: Array.from(subjectMap.values()),
          departments: Array.from(departmentMap.values()),
          total: {
            classes: classesList.length,
            subjects: subjectMap.size,
            departments: departmentMap.size,
          },
        },
      };
    }

    if (userDetails.role === "student") {
      const enrollmentsList = await db
        .select({
          ...getTableColumns(enrollments),
          class: {
            ...getTableColumns(classes),
          },
          subject: {
            ...getTableColumns(subjects),
          },
          department: {
            ...getTableColumns(departments),
          },
          teacher: {
            ...getTableColumns(user),
          },
        })
        .from(enrollments)
        .leftJoin(classes, eq(enrollments.classId, classes.id))
        .leftJoin(subjects, eq(classes.subjectId, subjects.id))
        .leftJoin(departments, eq(subjects.departmentId, departments.id))
        .leftJoin(user, eq(classes.teacherId, user.id))
        .where(eq(enrollments.studentId, userId))
        .orderBy(desc(enrollments.createdAt));

      const classMap = new Map<number, typeof classes.$inferSelect>();
      const subjectMap = new Map<number, typeof subjects.$inferSelect>();

      for (const enrollment of enrollmentsList) {
        if (enrollment.class?.id) {
          classMap.set(enrollment.class.id, enrollment.class);
        }
        if (enrollment.subject?.id) {
          subjectMap.set(enrollment.subject.id, enrollment.subject);
        }
      }

      this.setStatus(200);
      return {
        data: {
          user: userDetails,
          enrollments: enrollmentsList,
          classes: Array.from(classMap.values()),
          subjects: Array.from(subjectMap.values()),
          total: {
            enrollments: enrollmentsList.length,
            classes: classMap.size,
            subjects: subjectMap.size,
          },
        },
      };
    }

    this.setStatus(200);
    return {
      data: {
        user: userDetails,
      },
    };
  }
}
