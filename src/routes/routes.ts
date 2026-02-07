/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UsersController } from './../controllers/UsersController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SubjectsController } from './../controllers/SubjectsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StatsController } from './../controllers/StatsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EnrollmentsController } from './../controllers/EnrollmentsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DepartmentsController } from './../controllers/DepartmentsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ClassesController } from './../controllers/ClassesController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "UserRole": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["student"]},{"dataType":"enum","enums":["teacher"]},{"dataType":"enum","enums":["admin"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "userItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "emailVerified": {"dataType":"boolean","required":true},
            "image": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "role": {"ref":"UserRole","required":true},
            "imageCldPubId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pagination": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "total": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UsersResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"userItem"},"required":true},
            "pagination": {"ref":"Pagination","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ClassStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["active"]},{"dataType":"enum","enums":["inactive"]},{"dataType":"enum","enums":["completed"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubjectSummary": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeacherSummary": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepartmentSummary": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ClassItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "inviteCode": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "bannerCldPubId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "bannerUrl": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "capacity": {"dataType":"double","required":true},
            "status": {"ref":"ClassStatus","required":true},
            "schedules": {"dataType":"array","array":{"dataType":"any"},"required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "subject": {"dataType":"union","subSchemas":[{"ref":"SubjectSummary"},{"dataType":"enum","enums":[null]}]},
            "teacher": {"dataType":"union","subSchemas":[{"ref":"TeacherSummary"},{"dataType":"enum","enums":[null]}]},
            "department": {"dataType":"union","subSchemas":[{"ref":"DepartmentSummary"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "subjectItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "code": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "department": {"dataType":"union","subSchemas":[{"ref":"DepartmentSummary"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "departmentItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "code": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "totalSubjects": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EnrollmentItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "classId": {"dataType":"double","required":true},
            "studentId": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "class": {"dataType":"union","subSchemas":[{"ref":"ClassItem"},{"dataType":"enum","enums":[null]}]},
            "subject": {"dataType":"union","subSchemas":[{"ref":"subjectItem"},{"dataType":"enum","enums":[null]}]},
            "department": {"dataType":"union","subSchemas":[{"ref":"departmentItem"},{"dataType":"enum","enums":[null]}]},
            "teacher": {"dataType":"union","subSchemas":[{"ref":"userItem"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeacherDetailResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"total":{"dataType":"nestedObjectLiteral","nestedProperties":{"subjects":{"dataType":"double","required":true},"classes":{"dataType":"double","required":true},"enrollments":{"dataType":"double","required":true}},"required":true},"subjects":{"dataType":"array","array":{"dataType":"refObject","ref":"subjectItem"},"required":true},"classes":{"dataType":"array","array":{"dataType":"refObject","ref":"ClassItem"},"required":true},"enrollments":{"dataType":"array","array":{"dataType":"refObject","ref":"EnrollmentItem"},"required":true},"user":{"ref":"userItem","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StudentDetailResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"total":{"dataType":"nestedObjectLiteral","nestedProperties":{"departments":{"dataType":"double","required":true},"subjects":{"dataType":"double","required":true},"classes":{"dataType":"double","required":true}},"required":true},"departments":{"dataType":"array","array":{"dataType":"refObject","ref":"departmentItem"},"required":true},"subjects":{"dataType":"array","array":{"dataType":"refObject","ref":"subjectItem"},"required":true},"classes":{"dataType":"array","array":{"dataType":"refObject","ref":"ClassItem"},"required":true},"user":{"ref":"userItem","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "subjectResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"subjectItem"},"required":true},
            "pagination": {"ref":"Pagination","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "subjectDetailsResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"total":{"dataType":"nestedObjectLiteral","nestedProperties":{"classes":{"dataType":"double","required":true}},"required":true},"classes":{"dataType":"array","array":{"dataType":"refObject","ref":"ClassItem"},"required":true},"subjectDetails":{"ref":"subjectItem","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubjectCreateResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubjectCreateRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "code": {"dataType":"string","required":true},
            "departmentId": {"dataType":"double","required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "statsItem": {
        "dataType": "refObject",
        "properties": {
            "users": {"dataType":"double","required":true},
            "teachers": {"dataType":"double","required":true},
            "admins": {"dataType":"double","required":true},
            "subjects": {"dataType":"double","required":true},
            "departments": {"dataType":"double","required":true},
            "classes": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatsResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"statsItem","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LatestStatsResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"latestTeachers":{"dataType":"array","array":{"dataType":"refObject","ref":"userItem"},"required":true},"latestClasses":{"dataType":"array","array":{"dataType":"refObject","ref":"ClassItem"},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "usersByRoleItem": {
        "dataType": "refObject",
        "properties": {
            "role": {"ref":"UserRole","required":true},
            "total": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "subjectsByDepartmentItem": {
        "dataType": "refObject",
        "properties": {
            "departmentId": {"dataType":"double","required":true},
            "departmentName": {"dataType":"string","required":true},
            "totalSubjects": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "classesBySubjectItem": {
        "dataType": "refObject",
        "properties": {
            "subjectId": {"dataType":"double","required":true},
            "subjectName": {"dataType":"string","required":true},
            "totalClasses": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChartsResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"classesBySubject":{"dataType":"array","array":{"dataType":"refObject","ref":"classesBySubjectItem"},"required":true},"subjectsByDepartment":{"dataType":"array","array":{"dataType":"refObject","ref":"subjectsByDepartmentItem"},"required":true},"usersByRole":{"dataType":"array","array":{"dataType":"refObject","ref":"usersByRoleItem"},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EnrollmentResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"enrollmentDetails":{"ref":"EnrollmentItem","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateEnrollmentResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"enrollmentDetails":{"ref":"EnrollmentItem","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateEnrollmentRequest": {
        "dataType": "refObject",
        "properties": {
            "classId": {"dataType":"double","required":true},
            "studentId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JoinEnrollmentResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"enrollmentDetails":{"ref":"EnrollmentItem","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JoinEnrollmentRequest": {
        "dataType": "refObject",
        "properties": {
            "inviteCode": {"dataType":"string","required":true},
            "studentId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepartmentsResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"departmentItem"},"required":true},
            "pagination": {"ref":"Pagination","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateDepartmentResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateDepartmentRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "code": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "departmentStudentItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "image": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "role": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["student"]},{"dataType":"enum","enums":["teacher"]},{"dataType":"enum","enums":["admin"]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepartmentDetailResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"total":{"dataType":"nestedObjectLiteral","nestedProperties":{"enrolledStudents":{"dataType":"double","required":true},"classes":{"dataType":"double","required":true},"subjects":{"dataType":"double","required":true}},"required":true},"enrolledStudents":{"dataType":"array","array":{"dataType":"refObject","ref":"departmentStudentItem"},"required":true},"classes":{"dataType":"array","array":{"dataType":"refObject","ref":"ClassItem"},"required":true},"subjects":{"dataType":"array","array":{"dataType":"refObject","ref":"subjectItem"},"required":true},"departmentDetails":{"ref":"departmentItem","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ClassesResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"ClassItem"},"required":true},
            "pagination": {"ref":"Pagination","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetClassResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"ClassItem","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateClassResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateClassRequest": {
        "dataType": "refObject",
        "properties": {
            "subjectId": {"dataType":"double","required":true},
            "teacherId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "capacity": {"dataType":"double"},
            "status": {"ref":"ClassStatus"},
            "schedules": {"dataType":"array","array":{"dataType":"any"}},
            "bannerCldPubId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "bannerUrl": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsUsersController_getUsers: Record<string, TsoaRoute.ParameterSchema> = {
                search: {"in":"query","name":"search","dataType":"string"},
                role: {"in":"query","name":"role","dataType":"string"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
        };
        app.get('/users',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUsers)),

            async function UsersController_getUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getUsers, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUsersController_getUserById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/users/:id',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUserById)),

            async function UsersController_getUserById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsersController_getUserById, request, response });

                const controller = new UsersController();

              await templateService.apiHandler({
                methodName: 'getUserById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSubjectsController_getSubjects: Record<string, TsoaRoute.ParameterSchema> = {
                search: {"in":"query","name":"search","dataType":"string"},
                department: {"in":"query","name":"department","dataType":"string"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
        };
        app.get('/subjects',
            ...(fetchMiddlewares<RequestHandler>(SubjectsController)),
            ...(fetchMiddlewares<RequestHandler>(SubjectsController.prototype.getSubjects)),

            async function SubjectsController_getSubjects(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubjectsController_getSubjects, request, response });

                const controller = new SubjectsController();

              await templateService.apiHandler({
                methodName: 'getSubjects',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSubjectsController_getSubjectById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/subjects/:id',
            ...(fetchMiddlewares<RequestHandler>(SubjectsController)),
            ...(fetchMiddlewares<RequestHandler>(SubjectsController.prototype.getSubjectById)),

            async function SubjectsController_getSubjectById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubjectsController_getSubjectById, request, response });

                const controller = new SubjectsController();

              await templateService.apiHandler({
                methodName: 'getSubjectById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSubjectsController_createSubject: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"SubjectCreateRequest"},
        };
        app.post('/subjects',
            ...(fetchMiddlewares<RequestHandler>(SubjectsController)),
            ...(fetchMiddlewares<RequestHandler>(SubjectsController.prototype.createSubject)),

            async function SubjectsController_createSubject(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubjectsController_createSubject, request, response });

                const controller = new SubjectsController();

              await templateService.apiHandler({
                methodName: 'createSubject',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStatsController_getStats: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/stats',
            ...(fetchMiddlewares<RequestHandler>(StatsController)),
            ...(fetchMiddlewares<RequestHandler>(StatsController.prototype.getStats)),

            async function StatsController_getStats(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStatsController_getStats, request, response });

                const controller = new StatsController();

              await templateService.apiHandler({
                methodName: 'getStats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStatsController_getLatest: Record<string, TsoaRoute.ParameterSchema> = {
                limit: {"default":5,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/stats/latest',
            ...(fetchMiddlewares<RequestHandler>(StatsController)),
            ...(fetchMiddlewares<RequestHandler>(StatsController.prototype.getLatest)),

            async function StatsController_getLatest(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStatsController_getLatest, request, response });

                const controller = new StatsController();

              await templateService.apiHandler({
                methodName: 'getLatest',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStatsController_getCharts: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/stats/charts',
            ...(fetchMiddlewares<RequestHandler>(StatsController)),
            ...(fetchMiddlewares<RequestHandler>(StatsController.prototype.getCharts)),

            async function StatsController_getCharts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStatsController_getCharts, request, response });

                const controller = new StatsController();

              await templateService.apiHandler({
                methodName: 'getCharts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEnrollmentsController_getEnrollmentById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/enrollments/:id',
            ...(fetchMiddlewares<RequestHandler>(EnrollmentsController)),
            ...(fetchMiddlewares<RequestHandler>(EnrollmentsController.prototype.getEnrollmentById)),

            async function EnrollmentsController_getEnrollmentById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEnrollmentsController_getEnrollmentById, request, response });

                const controller = new EnrollmentsController();

              await templateService.apiHandler({
                methodName: 'getEnrollmentById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEnrollmentsController_createEnrollment: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateEnrollmentRequest"},
        };
        app.post('/enrollments',
            ...(fetchMiddlewares<RequestHandler>(EnrollmentsController)),
            ...(fetchMiddlewares<RequestHandler>(EnrollmentsController.prototype.createEnrollment)),

            async function EnrollmentsController_createEnrollment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEnrollmentsController_createEnrollment, request, response });

                const controller = new EnrollmentsController();

              await templateService.apiHandler({
                methodName: 'createEnrollment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEnrollmentsController_joinEnrollment: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"JoinEnrollmentRequest"},
        };
        app.post('/enrollments/join',
            ...(fetchMiddlewares<RequestHandler>(EnrollmentsController)),
            ...(fetchMiddlewares<RequestHandler>(EnrollmentsController.prototype.joinEnrollment)),

            async function EnrollmentsController_joinEnrollment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEnrollmentsController_joinEnrollment, request, response });

                const controller = new EnrollmentsController();

              await templateService.apiHandler({
                methodName: 'joinEnrollment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepartmentsController_getDepartments: Record<string, TsoaRoute.ParameterSchema> = {
                search: {"in":"query","name":"search","dataType":"string"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/departments',
            ...(fetchMiddlewares<RequestHandler>(DepartmentsController)),
            ...(fetchMiddlewares<RequestHandler>(DepartmentsController.prototype.getDepartments)),

            async function DepartmentsController_getDepartments(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartmentsController_getDepartments, request, response });

                const controller = new DepartmentsController();

              await templateService.apiHandler({
                methodName: 'getDepartments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepartmentsController_createDepartment: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateDepartmentRequest"},
        };
        app.post('/departments',
            ...(fetchMiddlewares<RequestHandler>(DepartmentsController)),
            ...(fetchMiddlewares<RequestHandler>(DepartmentsController.prototype.createDepartment)),

            async function DepartmentsController_createDepartment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartmentsController_createDepartment, request, response });

                const controller = new DepartmentsController();

              await templateService.apiHandler({
                methodName: 'createDepartment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepartmentsController_getDepartmentById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/departments/:id',
            ...(fetchMiddlewares<RequestHandler>(DepartmentsController)),
            ...(fetchMiddlewares<RequestHandler>(DepartmentsController.prototype.getDepartmentById)),

            async function DepartmentsController_getDepartmentById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartmentsController_getDepartmentById, request, response });

                const controller = new DepartmentsController();

              await templateService.apiHandler({
                methodName: 'getDepartmentById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsClassesController_getClasses: Record<string, TsoaRoute.ParameterSchema> = {
                search: {"in":"query","name":"search","dataType":"string"},
                subject: {"in":"query","name":"subject","dataType":"string"},
                teacher: {"in":"query","name":"teacher","dataType":"string"},
                department: {"in":"query","name":"department","dataType":"string"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
        };
        app.get('/classes',
            ...(fetchMiddlewares<RequestHandler>(ClassesController)),
            ...(fetchMiddlewares<RequestHandler>(ClassesController.prototype.getClasses)),

            async function ClassesController_getClasses(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsClassesController_getClasses, request, response });

                const controller = new ClassesController();

              await templateService.apiHandler({
                methodName: 'getClasses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsClassesController_getClassById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/classes/:id',
            ...(fetchMiddlewares<RequestHandler>(ClassesController)),
            ...(fetchMiddlewares<RequestHandler>(ClassesController.prototype.getClassById)),

            async function ClassesController_getClassById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsClassesController_getClassById, request, response });

                const controller = new ClassesController();

              await templateService.apiHandler({
                methodName: 'getClassById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsClassesController_createClass: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateClassRequest"},
        };
        app.post('/classes',
            ...(fetchMiddlewares<RequestHandler>(ClassesController)),
            ...(fetchMiddlewares<RequestHandler>(ClassesController.prototype.createClass)),

            async function ClassesController_createClass(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsClassesController_createClass, request, response });

                const controller = new ClassesController();

              await templateService.apiHandler({
                methodName: 'createClass',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
