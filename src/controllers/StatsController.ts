import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Controller, Get, Query, Route, SuccessResponse, Tags } from "tsoa";

import { classes, departments, subjects, user } from "../db/schema/index.js";
import { db } from "../db/index.js";

import {
  ChartsResponse,
  LatestStatsResponse,
  statsItem,
  StatsResponse,
} from "../models/StatsDTO.js";

@Route("stats")
@Tags("Statistics")
export class StatsController extends Controller {
  @Get("/")
  @SuccessResponse("200", "OK")
  public async getStats(): Promise<StatsResponse> {
    const [
      usersCount,
      teachersCount,
      adminsCount,
      subjectsCount,
      departmentsCount,
      classesCount,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(user),
      db
        .select({ count: sql<number>`count(*)` })
        .from(user)
        .where(eq(user.role, "teacher")),
      db
        .select({ count: sql<number>`count(*)` })
        .from(user)
        .where(eq(user.role, "admin")),
      db.select({ count: sql<number>`count(*)` }).from(subjects),
      db.select({ count: sql<number>`count(*)` }).from(departments),
      db.select({ count: sql<number>`count(*)` }).from(classes),
    ]);

    this.setStatus(200);
    return {
      data: {
        users: usersCount[0]?.count ?? 0,
        teachers: teachersCount[0]?.count ?? 0,
        admins: adminsCount[0]?.count ?? 0,
        subjects: subjectsCount[0]?.count ?? 0,
        departments: departmentsCount[0]?.count ?? 0,
        classes: classesCount[0]?.count ?? 0,
      } as unknown as statsItem,
    };
  }

  @Get("/latest")
  @SuccessResponse("200", "OK")
  public async getLatest(@Query() limit = 5): Promise<LatestStatsResponse> {
    const limitPerPage = Math.min(100, Math.max(1, Number(limit) || 5));

    const [latestClasses, latestTeachers] = await Promise.all([
      db
        .select({
          ...getTableColumns(classes),
          subject: {
            ...getTableColumns(subjects),
          },
          teacher: {
            ...getTableColumns(user),
          },
          department: {
            ...getTableColumns(departments),
          },
        })
        .from(classes)
        .leftJoin(subjects, eq(classes.subjectId, subjects.id))
        .leftJoin(user, eq(classes.teacherId, user.id))
        .leftJoin(departments, eq(subjects.departmentId, departments.id))
        .orderBy(desc(classes.createdAt))
        .limit(limitPerPage),
      db
        .select()
        .from(user)
        .where(eq(user.role, "teacher"))
        .orderBy(desc(user.createdAt))
        .limit(limitPerPage),
    ]);

    this.setStatus(200);
    return {
      data: { latestClasses, latestTeachers },
    };
  }

  @Get("/charts")
  @SuccessResponse("200", "OK")
  public async getCharts(): Promise<ChartsResponse> {
    const [usersByRole, subjectsByDepartment, classesBySubject] =
      await Promise.all([
        db
          .select({ role: user.role, total: sql<number>`count(*)` })
          .from(user)
          .groupBy(user.role),
        db
          .select({
            departmentId: departments.id,
            departmentName: departments.name,
            totalSubjects: sql<number>`count(${subjects.id})`,
          })
          .from(departments)
          .leftJoin(subjects, eq(subjects.departmentId, departments.id))
          .groupBy(departments.id),
        db
          .select({
            subjectId: subjects.id,
            subjectName: subjects.name,
            totalClasses: sql<number>`count(${classes.id})`,
          })
          .from(subjects)
          .leftJoin(classes, eq(classes.subjectId, subjects.id))
          .groupBy(subjects.id),
      ]);

    this.setStatus(200);
    return {
      data: {
        usersByRole,
        subjectsByDepartment,
        classesBySubject,
      },
    };
  }
}
