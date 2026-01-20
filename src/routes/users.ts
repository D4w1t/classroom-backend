import { and, desc, getTableColumns, ilike, or, sql, eq } from "drizzle-orm";
import express from "express";
import { user } from "../db/schema/index.js";
import { db } from "../db/index.js";

const router = express.Router();

// Get All Users with optional search, role filter and pagination
router.get("/", async (req, res) => {
  try {
    const { search, role: roleQuery, limit = 10, page = 1 } = req.query;

    // Normalize role param
    const role = Array.isArray(roleQuery) ? roleQuery[0] : roleQuery;
    const allowedRoles = ['student', 'teacher', 'admin'] as const;
    type Role = (typeof allowedRoles)[number];

    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions: any[] = [];

    // Search by user name or email
    if (search) {
      filterConditions.push(
        or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)),
      );
    }

    // Filter by exact role (ensure it's one of allowed enum values)
    if (role && allowedRoles.includes(role as Role)) {
      filterConditions.push(eq(user.role, role as Role));
    }

    // Combine all filters
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

    res.status(200).json({
      data: userList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error(`Error GET /users: ${error}`);
    res.status(500).json({ error: "Error fetching users" });
  }
});

export default router;
