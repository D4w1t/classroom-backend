import {
  Controller,
  Get,
  Post,
  Query,
  Route,
  Tags,
  Path,
  Body,
  Response,
  SuccessResponse,
} from "tsoa";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";

import { db } from "../db/index.js";
import {
  classes,
  departments,
  enrollments,
  subjects,
  user,
} from "../db/schema/index.js";
import type {
  ClassesResponse,
  ClassItem,
  GetClassResponse,
  CreateClassRequest,
  CreateClassResponse,
} from "../models/ClassDTO.js";
import { UsersResponse } from "../models/UserDTO.js";

@Route("classes")
@Tags("Classes")
export class ClassesController extends Controller {
  @Get("/")
  @SuccessResponse("200", "Ok")
  public async getClasses(
    @Query() search?: string,
    @Query() subject?: string,
    @Query() teacher?: string,
    @Query() department?: string,
    @Query() limit = 10,
    @Query() page = 1,
  ): Promise<ClassesResponse> {
    const currentPage = Math.max(1, Number(page) || 1);
    const limitPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions: any[] = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(classes.name, `%${search}%`),
          ilike(classes.inviteCode, `%${search}%`),
        ),
      );
    }

    if (subject) filterConditions.push(ilike(subjects.name, `%${subject}%`));
    if (teacher) filterConditions.push(ilike(user.name, `%${teacher}%`));
    if (department)
      filterConditions.push(ilike(departments.name, `%${department}%`));

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const classesList = await db
      .select({
        ...getTableColumns(classes),
        subject: { ...getTableColumns(subjects) },
        teacher: { ...getTableColumns(user) },
        department: { ...getTableColumns(departments) },
      })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .orderBy(desc(classes.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    this.setStatus(200);
    return {
      data: classesList as unknown as ClassItem[],
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
  public async getClassById(
    @Path() id: number,
  ): Promise<GetClassResponse | { error: string }> {
    const classId = Number(id);
    if (!Number.isFinite(classId)) {
      this.setStatus(400);
      return { error: "Invalid class ID" };
    }

    const [classDetails] = await db
      .select({
        ...getTableColumns(classes),
        subject: { ...getTableColumns(subjects) },
        teacher: { ...getTableColumns(user) },
        department: { ...getTableColumns(departments) },
      })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(eq(classes.id, classId));

    if (!classDetails) {
      this.setStatus(404);
      return { error: "Class not found" };
    }

    this.setStatus(200);
    return { data: classDetails as unknown as ClassItem };
  }

  @Post("/")
  @SuccessResponse("201", "Created")
  @Response(400, "Bad Request")
  @Response(500, "Internal Server Error")
  public async createClass(
    @Body() body: CreateClassRequest,
  ): Promise<CreateClassResponse | { error: string }> {
    if (!body || !body.subjectId || !body.teacherId || !body.name) {
      this.setStatus(400);
      return { error: "Missing required fields: subjectId, teacherId, name" };
    }

    try {
      const [createdClass] = await db
        .insert(classes)
        .values({
          ...body,
          inviteCode: Math.random().toString(36).substring(2, 9),
          schedules: body.schedules ?? [],
        })
        .returning({ id: classes.id });

      if (!createdClass) {
        this.setStatus(500);
        return { error: "Failed to create class" };
      }

      this.setStatus(201);
      return { data: { id: createdClass.id } };
    } catch (err: any) {
      this.setStatus(500);
      return { error: "Internal Server Error" };
    }
  }

  @Get("/{id}/users")
  @SuccessResponse("200", "Ok")
  @Response(400, "Bad Request")
  @Response(404, "Not Found")
  public async getUsersInClass(
    @Path() id: number,
    @Query() role: string,
    @Query() limit = 10,
    @Query() page = 1,
  ): Promise<UsersResponse | { error: string }> {
    const classId = Number(id);
    if (!Number.isFinite(classId)) {
      this.setStatus(400);
      return { error: "Invalid class ID" };
    }

    if (role !== "teacher" && role !== "student") {
      this.setStatus(400);
      return { error: "Invalid role" };
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const limitPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const offset = (currentPage - 1) * limitPerPage;

    const baseSelect = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      imageCldPubId: user.imageCldPubId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const groupByFields = [
      user.id,
      user.name,
      user.email,
      user.emailVerified,
      user.image,
      user.role,
      user.imageCldPubId,
      user.createdAt,
      user.updatedAt,
    ];

    const countResult =
      role === "teacher"
        ? await db
            .select({ count: sql<number>`count(distinct ${user.id})` })
            .from(user)
            .leftJoin(classes, eq(user.id, classes.teacherId))
            .where(and(eq(user.role, role), eq(classes.id, classId)))
        : await db
            .select({ count: sql<number>`count(distinct ${user.id})` })
            .from(user)
            .leftJoin(enrollments, eq(user.id, enrollments.studentId))
            .where(and(eq(user.role, role), eq(enrollments.classId, classId)));

    const totalCount = countResult[0]?.count ?? 0;

    const usersList =
      role === "teacher"
        ? await db
            .select(baseSelect)
            .from(user)
            .leftJoin(classes, eq(user.id, classes.teacherId))
            .where(and(eq(user.role, role), eq(classes.id, classId)))
            .groupBy(...groupByFields)
            .orderBy(desc(user.createdAt))
            .limit(limitPerPage)
            .offset(offset)
        : await db
            .select(baseSelect)
            .from(user)
            .leftJoin(enrollments, eq(user.id, enrollments.studentId))
            .where(and(eq(user.role, role), eq(enrollments.classId, classId)))
            .groupBy(...groupByFields)
            .orderBy(desc(user.createdAt))
            .limit(limitPerPage)
            .offset(offset);

    this.setStatus(200);
    return {
      data: usersList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    };
  }
}
