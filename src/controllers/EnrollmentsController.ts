import {
  Controller,
  Get,
  Path,
  Route,
  SuccessResponse,
  Tags,
  Response,
  Post,
  Body,
} from "tsoa";
import { db } from "../db";
import { and, eq, getTableColumns } from "drizzle-orm";
import {
  classes,
  departments,
  enrollments,
  subjects,
  user,
} from "../db/schema";
import {
  CreateEnrollmentRequest,
  CreateEnrollmentResponse,
  EnrollmentResponse,
  JoinEnrollmentRequest,
  JoinEnrollmentResponse,
} from "../models/EnrollmentDTO";

@Route("enrollments")
@Tags("Enrollments")
export class EnrollmentsController extends Controller {
  @Get("/{id}")
  @SuccessResponse("200", "OK")
  @Response(400, "Bad Request")
  @Response(404, "Not Found")
  public async getEnrollmentById(
    @Path() id: number,
  ): Promise<EnrollmentResponse | { error: string }> {
    const enrollmentId = Number(id);
    if (!Number.isFinite(enrollmentId)) {
      this.setStatus(400);
      return { error: "Invalid enrollment ID" };
    }

    const [enrollmentDetails] = await db
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
      .where(eq(enrollments.id, enrollmentId));

    if (!enrollmentDetails) {
      this.setStatus(404);
      return { error: "Enrollment not found" };
    }

    this.setStatus(200);
    return {
      data: {
        enrollmentDetails,
      },
    };
  }

  @Post("/")
  @SuccessResponse("201", "Created")
  @Response(400, "Bad Request")
  @Response(500, "Internal Server Error")
  public async createEnrollment(
    @Body() body: CreateEnrollmentRequest,
  ): Promise<CreateEnrollmentResponse | { error: string }> {
    if (!body || !body.classId || !body.studentId) {
      this.setStatus(400);
      return { error: "Missing required fields: classId, studentId" };
    }
    const { classId, studentId } = body;

    const [classRecord] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));

    if (!classRecord) {
      this.setStatus(404);
      return { error: "Class Not Found" };
    }

    const [student] = await db
      .select()
      .from(user)
      .where(eq(user.id, studentId));

    if (!student) {
      this.setStatus(404);
      return { error: "Student Not Found" };
    }

    const [existingEnrollment] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.classId, classId),
          eq(enrollments.studentId, studentId),
        ),
      );

    if (existingEnrollment) {
      this.setStatus(409);
      return { error: "Student already enrolled in class" };
    }

    const [createdEnrollment] = await db
      .insert(enrollments)
      .values({ classId, studentId })
      .returning({ id: enrollments.id });

    if (!createdEnrollment) {
      this.setStatus(500);
      return { error: "Failed to create enrollment" };
    }

    const enrollment = await this.getEnrollmentById(createdEnrollment.id);

    this.setStatus(201);
    return {
      data: {
        enrollmentDetails: (enrollment as any).data.enrollmentDetails,
      },
    };
  }

  @Post("/join")
  @SuccessResponse("201", "Created")
  @Response(400, "Bad Request")
  @Response(500, "Internal Server Error")
  public async joinEnrollment(
    @Body() body: JoinEnrollmentRequest,
  ): Promise<JoinEnrollmentResponse | { error: string }> {
    if (!body || !body.inviteCode || !body.studentId) {
      this.setStatus(400);
      return { error: "Missing required fields: inviteCode, studentId" };
    }
    const { inviteCode, studentId } = body;

    const [classRecord] = await db
      .select()
      .from(classes)
      .where(eq(classes.inviteCode, inviteCode));

    if (!classRecord) {
      this.setStatus(404);
      return {
        error: "Class Not Found",
      };
    }

    const [student] = await db
      .select()
      .from(user)
      .where(eq(user.id, studentId));

    if (!student) {
      this.setStatus(404);
      return {
        error: "Student Not Found",
      };
    }

    const [existingEnrollment] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.classId, classRecord.id),
          eq(enrollments.studentId, studentId),
        ),
      );

    if (existingEnrollment) {
      this.setStatus(409);
      return {
        error: "Student already enrolled in class",
      };
    }

    const [createdEnrollment] = await db
      .insert(enrollments)
      .values({ classId: classRecord.id, studentId })
      .returning({ id: enrollments.id });

    if (!createdEnrollment) {
      this.setStatus(500);
      return {
        error: "Failed to join class",
      };
    }

    const enrollment = await this.getEnrollmentById(createdEnrollment.id);

    this.setStatus(201);
    return {
      data: {
        enrollmentDetails: (enrollment as any).data.enrollmentDetails,
      },
    };
  }
}
