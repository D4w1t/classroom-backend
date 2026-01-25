import express from "express";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";

import { departments, subjects } from "../db/schema/index.js";
import { db } from "../db/index.js";

const router = express.Router();

// Get All Departments with optional search and pagination
router.get("/", async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, Number(page) || 1);
    const limitPerPage = Math.min(100, Math.max(1, Number(limit) || 10));

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    // Search by department name or code
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

    const totalCount = countResult[0]?.count ?? 0;

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

    res.status(200).json({
      data: departmentsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error(`Error GET /departments: ${error}`);
    res.status(500).json({ error: "Error Getting departments" });
  }
});

// Create a new Department
router.post("/", async (req, res) => {
  try {
    const { code, name, description } = req.body;

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return res.status(400).json({ error: "code is required" });
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "name is required" });
    }

    const [createdDepartment] = await db
      .insert(departments)
      .values({ code: code.trim(), name: name.trim(), description })
      .returning({ id: departments.id });

    if (!createdDepartment) throw new Error("Failed to create department.");

    res.status(201).json({ data: createdDepartment });
  } catch (error) {
    const pgError = (error as any)?.cause ?? error;
    if (pgError?.code === "23505") {
      return res.status(409).json({ error: "Department code already exists" });
    }
    
    console.error(`Error POST /departments: ${error}`);
    res.status(500).json({ error: "Error Creating department" });
  }
});

export default router;
