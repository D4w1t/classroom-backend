import { Controller, Get, Query, Route, SuccessResponse, Tags } from "tsoa";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";

import { subjectItem, subjectResponse } from "../models/subjectDTO.js";
import { departments, subjects } from "../db/schema/index.js";
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
}
