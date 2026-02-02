import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import {
  Controller,
  Get,
  Query,
  Route,
  SuccessResponse,
  Tags,
  Response,
} from "tsoa";

import { user } from "../db/schema/index.js";
import { db } from "../db/index.js";
import { userItem, UsersResponse } from "../models/UserDTO.js";

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
}
