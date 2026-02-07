import {
  Controller,
  Get,
  Query,
  Route,
  SuccessResponse,
  Tags,
  Response,
  Path,
  Post,
  Body,
} from "tsoa";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";

import {
  SubjectCreateRequest,
  SubjectCreateResponse,
  subjectDetailsResponse,
  subjectItem,
  subjectResponse,
} from "../models/SubjectDTO.js";
import { classes, departments, subjects, user } from "../db/schema/index.js";
import { db } from "../db/index.js";

@Route("subjects")
@Tags("Subjects")
export class SubjectsController extends Controller {
  @Get("/")
  @SuccessResponse("200", "OK")
  public async getSubjects(
    @Query() search?: string,
    @Query() department?: string,
    @Query() limit = 10,
    @Query() page = 1,
  ): Promise<subjectResponse> {
    const currentPage = Math.max(1, Number(page) || 1);
    const limitPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions: any[] = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }

    if (department) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const subjectList = await db
      .select({
        ...getTableColumns(subjects),
        department: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    this.setStatus(200);
    return {
      data: subjectList as unknown as subjectItem[],
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
  public async getSubjectById(
    @Path() id: number,
  ): Promise<subjectDetailsResponse | { error: string }> {
    const subjectId = Number(id);
    if (!Number.isFinite(subjectId)) {
      this.setStatus(400);
      return { error: "Invalid subject ID" };
    }

    const [subjectDetails] = await db
      .select({
        ...getTableColumns(subjects),
        department: {
          ...getTableColumns(departments),
        },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(eq(subjects.id, subjectId));

    if (!subjectDetails) {
      this.setStatus(404);
      return { error: "Subject not found" };
    }

    const classesList = await db
      .select({
        ...getTableColumns(classes),
        teacher: {
          ...getTableColumns(user),
        },
      })
      .from(classes)
      .leftJoin(user, eq(classes.teacherId, user.id))
      .where(eq(classes.subjectId, subjectId))
      .orderBy(desc(classes.createdAt));

    this.setStatus(200);
    return {
      data: {
        subjectDetails,
        classes: classesList,
        total: {
          classes: classesList.length,
        },
      },
    };
  }

  @Post("/")
  @SuccessResponse("201", "Created")
  @Response(400, "Bad Request")
  @Response(500, "Internal Server Error")
  public async createSubject(
    @Body() body: SubjectCreateRequest,
  ): Promise<SubjectCreateResponse | { error: string }> {
    if (!body || !body.code || !body.name || !body.departmentId) {
      this.setStatus(400);
      return { error: "Missing required fields: name, code and department" };
    }
    const { code, name, departmentId, description } = body;

    const [createdSubject] = await db
      .insert(subjects)
      .values({ departmentId, name, code, description })
      .returning({ id: subjects.id });

    if (!createdSubject) {
      this.setStatus(500);
      return {
        error: "Internal Server Error: Failed to create subject",
      };
    }

    this.setStatus(201);
    return {
      data: createdSubject,
    };
  }
}
