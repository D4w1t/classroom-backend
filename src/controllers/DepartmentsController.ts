import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Route,
  SuccessResponse,
  Response,
  Tags,
} from "tsoa";

import { departments, subjects } from "../db/schema/index.js";
import { db } from "../db/index.js";
import {
  CreateDepartmentRequest,
  CreateDepartmentResponse,
  departmentItem,
  DepartmentsResponse,
} from "../models/DepartmentDTO.js";

@Route("departments")
@Tags("Departments")
export class DepartmentsController extends Controller {
  @Get("/")
  @SuccessResponse("200", "OK")
  public async getDepartments(
    @Query() search?: string,
    @Query() page = 1,
    @Query() limit = 10,
  ): Promise<DepartmentsResponse> {
    const currentPage = Math.max(1, Number(page) || 1);
    const limitPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions: any = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(departments.name, `%${search}%`),
          ilike(departments.code, `%${search}%`),
        ),
      );
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(departments)
      .where(whereClause);

    const totalCount = Number(countResult[0]?.count ?? 0);

    const departmentsList = await db
      .select({
        ...getTableColumns(departments),
        totalSubjects: sql<number>`count(${subjects.id})`,
      })
      .from(departments)
      .leftJoin(subjects, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .groupBy(departments.id)
      .orderBy(desc(departments.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    this.setStatus(200);
    return {
      data: departmentsList as unknown as departmentItem[],
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    };
  }

  @Post("/")
  @SuccessResponse("201", "Created")
  @Response(400, "Bad Request")
  @Response(500, "Internal Server Error")
  public async createDepartment(
    @Body() body: CreateDepartmentRequest,
  ): Promise<CreateDepartmentResponse | { error: string }> {
    if (
      !body.code ||
      typeof body.code !== "string" ||
      body.code.trim().length === 0
    ) {
      this.setStatus(400);
      return { error: "code is required" };
    }

    if (
      !body.name ||
      typeof body.name !== "string" ||
      body.name.trim().length === 0
    ) {
      this.setStatus(400);
      return { error: "name is required" };
    }

    try {
      const [createdDepartment] = await db
        .insert(departments)
        .values({ ...body, code: body.code.trim(), name: body.name.trim() })
        .returning({ id: departments.id });

      if (!createdDepartment) {
        this.setStatus(500);
        return { error: "Failed to create department" };
      }

      this.setStatus(201);
      return {
        data: {
          id: createdDepartment.id,
        },
      };
    } catch (error) {
      this.setStatus(500);
      return { error: "Internal Server Error" };
    }
  }
}
